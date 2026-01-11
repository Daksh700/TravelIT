import express from "express"
import { rateLimiter } from "../middlewares/ratelimitMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { exploreLocation, generateItinerary } from "../controllers/aiController.js";
import { exploreSchema, generateItinerarySchema, saveItinerarySchema } from "../validators/itineraryValidator.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { createItinerary, deleteTrip, getUserItineraries, updateStatus } from "../controllers/itineraryController.js";

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

router.post(
    "/explore",
    protectRoute,
    validate(exploreSchema),
    exploreLocation
)

router.patch(
    "/status/:id",
    protectRoute,
    updateStatus
)

router.delete(
    "/:id",
    protectRoute,
    deleteTrip
)

export default router;