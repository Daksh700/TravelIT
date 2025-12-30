import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if(!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
        const message = error.message || "Something went wrong"
        error = new ApiError(statusCode, message, [], error.stack);
    }

    const response = {
        success: error.success,
        message: error.message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development" ? {stack: error.stack} : {})
    };

    return res.status(error.statusCode).json(response);
}