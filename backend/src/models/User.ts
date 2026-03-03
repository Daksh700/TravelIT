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
        ]
    },
    {timestamps: true}
)

export const User = mongoose.model<IUser>("User", userSchema);