import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
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
            default: "https://ui-avatars.com/api/?name=User&background=random"
        }
    },
    {timestamps: true}
)

export const User = mongoose.model<IUser>("User", userSchema);