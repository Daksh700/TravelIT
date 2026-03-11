import express from "express";
import { validate } from "../middlewares/validateMiddleware.js";
import { updateUserSchema } from "../validators/userValidator.js";
import { getBookmarks, getCurrentUser, savePushToken, syncUser, toggleBookmark, updateUserProfile } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.post('/sync', syncUser);

router.get('/me', protectRoute, getCurrentUser);

router.patch('/update', protectRoute, upload.single('avatar'), validate(updateUserSchema), updateUserProfile);

router.post('/bookmarks/toggle', protectRoute, toggleBookmark);

router.get('/bookmarks', protectRoute, getBookmarks);

router.post('/push-token', protectRoute, savePushToken);

export default router;