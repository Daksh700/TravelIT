import express from "express"
import { rateLimiter } from "../middlewares/ratelimitMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { generateItinerary } from "../controllers/aiController.js";
import { generateItinerarySchema, saveItinerarySchema } from "../validators/itineraryValidator.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { createItinerary, getUserItineraries } from "../controllers/itineraryController.js";

const router = express.Router();

router.post(
    "/generate",
    protectRoute,
    rateLimiter,
    validate(generateItinerarySchema),
    generateItinerary
);

router.post(
    "/save",
    protectRoute,
    validate(saveItinerarySchema),
    createItinerary
)

router.get(
    "/history",
    protectRoute,
    getUserItineraries
)

export default router;