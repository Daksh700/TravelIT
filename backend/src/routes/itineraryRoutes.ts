import express from "express"
import { rateLimiter } from "../middlewares/ratelimitMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { exploreLocation, generateItinerary } from "../controllers/aiController.js";
import { exploreSchema, generateItinerarySchema, modifyItinerarySchema, optimizeDayRouteSchema, saveItinerarySchema, updateTripDetailsSchema } from "../validators/itineraryValidator.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { createItinerary, deleteTrip, getUserItineraries, modifyItinerary, updateItineraryDetails, updateStatus, optimizeDayRoute, uploadTripPhoto} from "../controllers/itineraryController.js";
import { upload } from "../middlewares/multerMiddleware.js"

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

router.post(
    "/modify",
    protectRoute,
    validate(modifyItinerarySchema),
    modifyItinerary
);

router.post(
    "/optimize-route",
    protectRoute,
    validate(optimizeDayRouteSchema),
    optimizeDayRoute,
)

router.post(
    "/:id/photo",
    protectRoute,
    upload.single("photo"),
    uploadTripPhoto
)

router.patch(
    "/status/:id",
    protectRoute,
    updateStatus
)

router.patch(
    "/details",
    protectRoute,
    validate(updateTripDetailsSchema),
    updateItineraryDetails
)

router.delete(
    "/:id",
    protectRoute,
    deleteTrip
)

export default router;