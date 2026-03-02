import { Server, Socket } from "socket.io";
import { randomBytes } from "crypto";

interface SwipeActivity {
    id: string;
    name: string;
    description: string;
    location: string;
    image?: string;
    estimatedCost: number;
    yesVotes: Set<string>;
    noVotes: Set<string>;
}

interface RoomState {
    roomId: string;
    hostId: string;
    users: Set<string>;
    pendingActivities: SwipeActivity[];
    confirmedItinerary: SwipeActivity[];
    discarded: SwipeActivity[];
    status: "active" | "completed"
}

const activeRooms = new Map<string, RoomState>();

export const initializeTripTinderSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`⚡ Client connected: ${socket.id}`);

        socket.on("create_room", ({ userId, activities }) => {
            const roomId = `TRIP-${randomBytes(2).toString("hex").toUpperCase()}`;

            const formattedActivities: SwipeActivity[] = activities.map((act: any, index: number) => ({
                id: `act_${index}_${Date.now()}`,
                name: act.activity,
                description: act.description,
                location: act.location,
                estimatedCost: act.estimatedCost,
                yesVotes: new Set<string>(),
                noVotes: new Set<string>(),
            }));

            const newRoom: RoomState = {
                roomId,
                hostId: userId,
                users: new Set([userId]),
                pendingActivities: formattedActivities,
                confirmedItinerary: [],
                discarded: [],
                status: "active"
            };

            activeRooms.set(roomId, newRoom);
            socket.join(roomId);

            console.log(`🏠 Room Created: ${roomId} by User: ${userId}`);

            socket.emit("room_created", {
                roomId,
                users: Array.from(newRoom.users),
                totalActivities: formattedActivities.length
            });
        });

        socket.on("join_room", ({ roomId, userId }) => {
            const room = activeRooms.get(roomId);

            if(!room) {
                return socket.emit("error", { message: "Room not found or expired." });
            }

            if(room.status === "completed") {
                return socket.emit("error", { message: "Swiping is already finished for this trip."});
            }

            room.users.add(userId);
            socket.join(roomId);

            socket.to(roomId).emit("user_joined", {
                userId,
                totalUsers: room.users.size
            })

            socket.emit("room_joined", {
                roomId,
                users: Array.from(room.users),
                pendingActivitiesCount: room.pendingActivities.length,
                currentActivity: room.pendingActivities[0] ? serializeActivity(room.pendingActivities[0]) : null,
            })
        })

        socket.on("swipe", ({ roomId, userId, activityId, direction }) => {
            const room = activeRooms.get(roomId);

            if(!room) return;

            const activityIndex = room.pendingActivities.findIndex((a) => a.id === activityId);
            if(activityIndex === -1) return;

            const activity = room.pendingActivities[activityIndex];

            if(direction === "right") {
                activity.yesVotes.add(userId);
                activity.noVotes.delete(userId);
            } else if(direction === "light") {
                activity.noVotes.add(userId);
                activity.yesVotes.delete(userId);
            }

            const totalVotes = activity.yesVotes.size + activity.noVotes.size;
            const totalUsers = room.users.size;

            if(totalVotes === totalUsers) {
                room.pendingActivities.splice(activityIndex, 1);

                if(activity.yesVotes.size > activity.noVotes.size) {
                    room.confirmedItinerary.push(activity);
                    io.to(roomId).emit("activity_matched", {
                        activity: serializeActivity(activity),
                        yesCount: activity.yesVotes.size,
                        noCount: activity.noVotes.size,
                    });
                } else {
                    room.discarded.push(activity);
                    io.to(roomId).emit("activity_discarded", {
                        activityId: activity.id,
                        reason: activity.yesVotes.size === activity.noVotes.size ? "tie" : "majority_no",
                    });
                }
                
                if(room.pendingActivities.length === 0) {
                    room.status = "completed";
                    io.to(roomId).emit("swiping_completed", {
                        confirmedItinerary: room.confirmedItinerary.map(serializeActivity),
                    });

                    setTimeout(() => activeRooms.delete(roomId), 1000 * 60 * 60);
                } else {
                    io.to(roomId).emit("next_activity", {
                        activity: serializeActivity(room.pendingActivities[0])
                    });
                }
            }
        });

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        })
    })
}

const serializeActivity = (activity: SwipeActivity) => {
    return {
        ...activity,
        yesVotes: Array.from(activity.yesVotes),
        noVotes: Array.from(activity.noVotes)
    }
}
