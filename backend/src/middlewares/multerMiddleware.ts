import multer, {FileFilterCallback} from "multer";
import { Request } from "express";
import { ApiError } from "../utils/ApiError.js";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if(file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only Image files are allowed") as any, false);
    }
  }
});
