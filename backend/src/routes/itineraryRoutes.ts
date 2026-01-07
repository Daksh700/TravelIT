import express from "express"
import { rateLimiter } from "../middlewares/ratelimitMiddleware";
import { validate } from "../middlewares/validateMiddleware";
import { generateItinerary } from "../controllers/aiController";
import { generateItinerarySchema, saveItinerarySchema } from "../validators/itineraryValidator";
import { protectRoute } from "../middlewares/authMiddleware";
import { createItinerary, getUserItineraries } from "../controllers/itineraryController";

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