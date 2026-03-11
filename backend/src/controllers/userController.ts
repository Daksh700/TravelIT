import { Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"
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
    let avatarUrl = req.body.avatar;

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "travelit_avatars",
            });
            avatarUrl = result.secure_url;
        } catch (error) {
            throw new ApiError(500, "Error uploading image to Cloudinary");
        } finally {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }
    }

    const updateData: any = {
        firstName,
        lastName,
        username,
    };

    if (avatarUrl) {
        updateData.avatar = avatarUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        updateData,
        { new: true, runValidators: true }
    );

    if(!updatedUser) {
        throw new ApiError(404, "User not found to update");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    )
})

export const toggleBookmark = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const place = req.body;

    if (!user) throw new ApiError(401, "User not authenticated");
    if (!place || !place.name) throw new ApiError(400, "Place details missing");

    const existingUser = await User.findById(user._id);
    if (!existingUser) throw new ApiError(404, "User not found");

    const isBookmarked = existingUser.savedPlaces.some((p: any) => p.name === place.name);

    let updatedUser;
    if (isBookmarked) {
        updatedUser = await User.findByIdAndUpdate(
            user._id, 
            { $pull: { savedPlaces: { name: place.name } } }, 
            { new: true }
        );
    } else {
        updatedUser = await User.findByIdAndUpdate(
            user._id, 
            { $push: { savedPlaces: place } }, 
            { new: true }
        );
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser?.savedPlaces, "Bookmarks updated")
    );
});

export const getBookmarks = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "User not authenticated");

    const existingUser = await User.findById(user._id);
    
    return res.status(200).json(
        new ApiResponse(200, existingUser?.savedPlaces || [], "Bookmarks fetched successfully")
    );
});

export const savePushToken = asyncHandler(async (req: Request, res: Response) => {
    const { pushToken } = req.body;
    const user = req.user;

    if (!user) throw new ApiError(401, "User not authenticated");

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { pushToken },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Push token saved successfully")
    );
});