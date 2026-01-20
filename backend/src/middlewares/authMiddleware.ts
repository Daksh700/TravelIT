import { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = getAuth(req);

    if(!userId) {
        throw new ApiError(401, "Unauthorized request: No token provided");
    }

    const user = await User.findOne({clerkId: userId});

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if(!user) {
        const newUser = await User.create({
            clerkId: userId,
            email: email,
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            username: clerkUser.username || email.split("@")[0],
            avatar: clerkUser.imageUrl || "",
        });
        req.user = newUser;
    } else {
        req.user = user;
    }

    next();
})