import mongoose, {Schema, Document} from "mongoose";

interface IActivity {
    time: string;
    activity: string;
    location: string;
    description: string;
    estimatedCost: number;
}

interface IDayPlan {
    day: number;
    theme: string;
    activities: IActivity[];
}

export interface IItinerary extends Document {
    userId: mongoose.Types.ObjectId;
    source: string;
    destination: string;
    sourceMeta: {
        city: string;
        autoDetected: boolean;
    };
    duration: number;
    budgetTier: "low" | "medium" | "high";
    budget: number;
    currency: string;
    interests?: string[];
    travelers: number;
    ageGroup: "family" | "young" | "adults" | "seniors";
    safeMode: boolean;
    tripTitle: string;
    tripDescription: string;
    tripDetails: IDayPlan[];
    status: "draft" | "active" | "completed";

    createdAt: Date;
    updatedAt: Date;
}

const ItinerarySchema = new Schema<IItinerary>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        sourceMeta: {
            city: {type: String},
            autoDetected: {type: Boolean, default: false},
        },
        duration: {
            type: Number,
            required: true,
        },
        budgetTier: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "USD",
        },
        interests: {
            type: [String],
            default: [],
        },
        travelers: {
            type: Number,
            default: 1,
            min: 1,
        },

        ageGroup: {
            type: String,
            enum: ["family", "young", "adults", "seniors"],
            default: "adults",
        },

        safeMode: {
            type: Boolean,
            default: false,
        },
        tripTitle: {
            type: String,
            required: true,
        }, 
        tripDescription: {
            type: String,
            required: true,
        },
        tripDetails: [
            {
                day: {type: Number, required: true},
                theme: {type: String},
                activities: [
                    {
                        time: {type: String},
                        activity: {type: String},
                        location: {type: String},
                        description: {type: String},
                        estimatedCost: {type: Number}
                    }
                ]
            }
        ],

        status: {
            type: String,
            enum: ["draft", "active", "completed"],
            default: "draft",
        }
    },
    {timestamps: true}
)

export const Itinerary = mongoose.model<IItinerary>("Itinerary", ItinerarySchema);
