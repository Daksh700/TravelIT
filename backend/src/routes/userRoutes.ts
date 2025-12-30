import express from "express";
import { validate } from "../middlewares/validateMiddleware";
import { updateUserSchema } from "../validators/userValidator";
import { getCurrentUser, syncUser, updateUserProfile } from "../controllers/userController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.post('/sync', syncUser);

router.get('/me', protectRoute, getCurrentUser);

router.patch('/update', protectRoute, validate(updateUserSchema), updateUserProfile);

export default router;