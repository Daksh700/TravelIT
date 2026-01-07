import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { aj } from "../config/arcjet";


export const rateLimiter = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return next(new ApiError(429, "Too many requests! Calm down, traveler."));
            }
            else if(decision.reason.isBot()) {
                return next(new ApiError(403, "Automated requests are not allowed"));
            }
            else {
                return next(new ApiError(403, "Access denied by security policy"));
            }
        }

        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return next(new ApiError(403, "Malicious bot activity detected"));
        }

        next();
    } catch (error) {
        console.error("Arcjet Middleware Error: ", error);
        next();
    }
}