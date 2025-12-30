import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ApiError } from "../utils/ApiError";


export const validate = (schema: ZodType<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if(error instanceof ZodError) {
            const extractedErrors = error.issues.map(
                (issue) => `${issue.path.join(".")} : ${issue.message}`
            )

            return next(new ApiError(400, "Validation Error", extractedErrors));
        }

        next(error);
    }
}