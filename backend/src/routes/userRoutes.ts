import express from "express";
import { validate } from "../middlewares/validateMiddleware.js";
import { updateUserSchema } from "../validators/userValidator.js";
import { getBookmarks, getCurrentUser, syncUser, toggleBookmark, updateUserProfile } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/sync', syncUser);

router.get('/me', protectRoute, getCurrentUser);

router.patch('/update', protectRoute, validate(updateUserSchema), updateUserProfile);

router.post('/bookmarks/toggle', protectRoute, toggleBookmark);

router.get('/bookmarks', protectRoute, getBookmarks);

export default router;