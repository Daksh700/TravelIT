import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useTripTinder = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [targetUsersCount, setTargetUsersCount] = useState<number>(0); 
  const [roomCurrency, setRoomCurrency] = useState<string>("USD");
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [matchedActivities, setMatchedActivities] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const backendUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '');
    
    const socketInstance = io(backendUrl, {
      transports: ['websocket', 'polling'], 
    });

    socketInstance.on('connect', () => {
        console.log("✅ Socket Connected Successfully!", socketInstance.id);
    });
    
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("room_created", (data) => {
      setRoomId(data.roomId);
      setUsers(data.users);
      setTargetUsersCount(data.targetUsersCount); 
      setRoomCurrency(data.currency);
      setCurrentActivity(data.currentActivity);
      setError(null);
    });

    socket.on("room_joined", (data) => {
      setRoomId(data.roomId);
      setUsers(data.users);
      setTargetUsersCount(data.targetUsersCount); 
      setRoomCurrency(data.currency);
      setCurrentActivity(data.currentActivity);
      setError(null);
    });

    socket.on("user_joined", (data) => {
      console.log(`User ${data.userId} joined!`);
      setUsers((prev) => prev.includes(data.userId) ? prev : [...prev, data.userId]);
    });

    socket.on("next_activity", (data) => {
      setCurrentActivity(data.activity);
    });

    socket.on("activity_matched", (data) => {
      console.log("Matched!", data.activity.name);
      setMatchedActivities((prev) => [...prev, data.activity]);
    });

    socket.on("activity_discarded", (data) => {
      console.log("Discarded", data.reason);
    });

    socket.on("swiping_completed", (data) => {
      setIsFinished(true);
      setMatchedActivities(data.confirmedItinerary);
      setCurrentActivity(null);
    });

    socket.on("error", (err) => {
      setError(err.message);
    });

    return () => {
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("user_joined");
      socket.off("next_activity");
      socket.off("activity_matched");
      socket.off("activity_discarded");
      socket.off("swiping_completed");
      socket.off("error");
    };
  }, [socket]);

  const createRoom = (activities: any[], targetUsers: number, currency: string) => {
    socket?.emit("create_room", { userId, activities, targetUsersCount: targetUsers, currency });
  };

  const joinRoom = (code: string) => {
    socket?.emit("join_room", { roomId: code, userId });
  };

  const swipe = (activityId: string, direction: "right" | "left") => {
    if (!roomId) return;
    setCurrentActivity(null); 
    socket?.emit("swipe", { roomId, userId, activityId, direction });
  };

  return {
    roomId,
    users,
    targetUsersCount, 
    roomCurrency,
    currentActivity,
    matchedActivities,
    isFinished,
    error,
    createRoom,
    joinRoom,
    swipe,
    setError
  };
};