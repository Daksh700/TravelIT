import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
    savedPlaces: {
        name: string;
        address?: string;
        description?: string;
        image?: string;
        rating?: number;
    }[];
    isPro: boolean;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    proActivatedAt?: Date;
    pushToken?: string | null;
    generationsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String
        },
        username: {
            type: String,
        },
        avatar: {
            type: String,
            default: "https:ui-avatars.com/api/?name=User&background=random"
        },
        savedPlaces: [
            {
                name: { type: String, required: true },
                address: { type: String },
                description: { type: String },
                image: { type: String },
                rating: { type: Number }
            }
        ],
        isPro: {
            type: Boolean,
            default: false
        },
        razorpayOrderId: { 
            type: String 
        },
        razorpayPaymentId: { 
            type: String 
        },
        proActivatedAt: { 
            type: Date 
        },
        pushToken: {
            type: String,
            default: null
        },
        generationsCount: { 
            type: Number,
            default: 0
        }
    },
    {timestamps: true}
)

export const User = mongoose.model<IUser>("User", userSchema);