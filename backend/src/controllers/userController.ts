import { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const syncUser = asyncHandler(async (req: Request, res: Response) => {
    const {userId} = getAuth(req);

    if(!userId) {
        throw new ApiError(401, "Unauthorized: userId is missing");
    }

    const existingUser = await User.findOne({clerkId: userId});

    if(existingUser) {
        return res.status(200).json(
            new ApiResponse(200, existingUser, "User already synced")
        )
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if(!email) {
        throw new ApiError(400, "Clerk user has no email");
    }

    const user = await User.create({
        clerkId: userId,
        email: email,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.username || email.split("@")[0],
        avatar: clerkUser.imageUrl || "",
    })

    return res.status(201).json(
        new ApiResponse(201, user, "User created successfully")
    )
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    )
})

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const {firstName, lastName, username, avatar} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            firstName,
            lastName,
            username,
            avatar
        },
        {new: true, runValidators: true},
    );

    if(!updatedUser) {
        throw new ApiError(404, "User not found to update");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    )
})