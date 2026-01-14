import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Itinerary } from "../models/Itinerary.js";
import { verifyPlace } from "../services/placeVerifier.js";

export const createItinerary = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const {
    source,
    destination,
    sourceMeta,
    duration,
    budgetTier,
    budget,
    currency,
    interests,
    tripTitle,
    tripDescription,
    tripDetails,
    travelers = 1,
    ageGroup = "adults",
    safeMode = false
  } = req.body;

  if (
    !source ||
    !destination ||
    !sourceMeta?.city ||
    sourceMeta.autoDetected === undefined ||
    !duration ||
    !budgetTier ||
    !budget ||
    !currency ||
    !tripTitle ||
    !tripDescription ||
    !tripDetails
  ) {
    throw new ApiError(400, "All required fields are missing");
  }

  const verifiedDays = [];

  for(const day of tripDetails) {
    const verifiedActs = [];
    for(const act of day.activities) {
      const verified = await verifyPlace(`${act.activity} ${act.location} ${destination}`);
      verifiedActs.push({...act, ...verified});
    }

    verifiedDays.push({...day, activities: verifiedActs});
  }

  const newItinerary = new Itinerary({
    userId: user._id,
    source,
    destination,
    sourceMeta: {
      city: sourceMeta.city,
      autoDetected: sourceMeta.autoDetected,
    },
    duration,
    budgetTier,
    budget,
    currency,
    interests: interests || [],
    tripTitle,
    tripDescription,
    tripDetails: verifiedDays,
    status: "draft",
    travelers,
    ageGroup,
    safeMode
  });

  const savedItinerary = await newItinerary.save();

  return res.status(201).json(
    new ApiResponse(201, savedItinerary, "Trip saved successfully!")
  );
});

export const getUserItineraries = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if(!user) {
        throw new ApiError(401, "User not authenticated");
    }

    const trips = await Itinerary.find({userId: user._id}).sort({createdAt: -1});

    return res.status(200).json(
        new ApiResponse(200, trips, "Trips fetched successfully")
    )
})

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if(!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { status } = req.body;
  const { id } = req.params;

  if(!["draft", "active", "completed"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const updatedItinerary = await Itinerary.findOneAndUpdate(
    {_id: id, userId: user._id},
    { status },
    { new: true }
  )

  if(!updatedItinerary) {
    throw new ApiError(404, "Trip not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedItinerary, "Status updated")
  )
})

export const deleteTrip = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if(!user) {
    throw new ApiError(401, "Use not authenticated");
  }

  const {id} = req.params;

  const removed = await Itinerary.findOneAndDelete(
    {_id: id, userId: user._id}
  )

  if(!removed) {
    throw new ApiError(404, "Trip not found");
  }

  return res.status(200).json(
    new ApiResponse(200, removed, "Trip Deleted Successfully")
  )
})