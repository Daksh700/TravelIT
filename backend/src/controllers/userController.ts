import { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const syncUser = asyncHandler(async (req: Request, res: Response) => {
    const {userId} = getAuth(req);

    if(!userId) {
        throw new ApiError(401, "Unauthorized: userId is missing");
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if(!email) {
        throw new ApiError(400, "Clerk user has no email");
    }

    const userData = {
        clerkId: userId,
        email: email,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.username || email.split("@")[0],
        avatar: clerkUser.imageUrl || "",
    }

    let user = await User.findOneAndUpdate(
        {clerkId: userId},
        userData,
        {new: true}
    )

    if(user) {
        return res.status(200).json(
            new ApiResponse(200, user, "User updated successfully")
        )
    }

    user = await User.create(userData);

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