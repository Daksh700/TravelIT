import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const protectRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = getAuth(req);

    if(!userId) {
        throw new ApiError(401, "Unauthorized request: No token provided");
    }

    const user = await User.findOne({clerkId: userId});

    if(!user) {
        throw new ApiError(401, "Unauthorized request: User not found in DB");
    }

    req.user = user;

    next();
})