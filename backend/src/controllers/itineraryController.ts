import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Itinerary } from "../models/Itinerary.js";
import { GoogleGenAI } from "@google/genai";
import { verifyPlace } from "../services/placeVerifier.js";
import { PlaceInput, optimizeItinerary, fetchDistanceMatrix } from "../services/routeOptimizerService.js";
import { getDurationFromTimeRange } from "../utils/timeUtils.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"
import { sendPushNotification } from "../utils/sendNotification.js";

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
    safeMode = false,
    tripStartDate,
    tripEndDate,
    hotel,
    flight
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
    !tripDetails ||
    !tripStartDate ||
    !tripEndDate
  ) {
    throw new ApiError(400, "All required fields are missing");
  }

  const verifiedDays = [];

  for(const day of tripDetails) {
    const verifiedActs = [];
    for(const act of day.activities) {
      const locationStr = typeof act.location === 'string' ? act.location : act.location?.formattedAddress || act.location?.name || 'Unknown';
      const verified = await verifyPlace(`${act.activity} ${locationStr} ${destination}`);
      const {location, ...verifiedData} = verified;
      
      const coordinates = verified.location ? { lat: verified.location.lat, lng: verified.location.lng } : null;
      
      verifiedActs.push({...act, location: locationStr, coordinates, ...verifiedData}); 
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
    safeMode,
    tripStartDate,
    tripEndDate,
    hotel: hotel || null,
    flight: flight || null
  });

  const savedItinerary = await newItinerary.save();

  user.generationsCount = (user.generationsCount || 0) + 1;
  await user.save();

  if (user.pushToken) {
        sendPushNotification(
            user.pushToken, 
            "Trip Planned! ✈️", 
            `Your ${duration}-day trip to ${destination} has been saved successfully.`
        );
    }

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

export const modifyItinerary = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { itineraryId, modificationType, delayHours, dayNumber, userPrompt } = req.body;

  if (!user) throw new ApiError(401, "User not authenticated");

  if (!user.isPro) {
      throw new ApiError(403, "Real-Time Logic and AI Edits are Pro features. Upgrade to unlock.");
  }

  const itinerary = await Itinerary.findOne({ _id: itineraryId, userId: user._id });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  if (!['weather', 'delay', 'ai_edit'].includes(modificationType)) {
    throw new ApiError(400, "Invalid modification type. Must be 'weather', 'delay', or 'ai_edit'");
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  
  let instructions = "";

  const targetDay = dayNumber || 1;
  
  if (modificationType === "weather") {
    instructions = `
      CRITICAL WEATHER ALERT: It is raining/snowing heavily on DAY ${targetDay}.
      ACTION: Review the activities for DAY ${targetDay} (and other days if necessary).
      - Identify outdoor activities (Parks, Open Markets, Beaches, Hiking, Walking Tours).
      - SWAP them with nearby INDOOR alternatives (Museums, Art Galleries, Covered Malls, Aquariums, Cozy Cafes).
      - Keep the "time" slots the same if possible.
      - Update the "description" to mention it's a good rainy day option.
    `;
  } else if (modificationType === "delay") {
    const buffer = delayHours || 2;
    instructions = `
      TIMING ADJUSTMENT ALERT: The user has encountered a delay of ${buffer} hours on DAY ${targetDay}.
      
      ACTION: 
      1. For DAY ${targetDay} ONLY:
         - Shift the start time of all remaining activities forward by ${buffer} hours.
         - If an activity shifts past 9:00 PM or 10:00 PM, either:
           a) Shorten its duration.
           b) Remove it if it's not critical.
           c) Replace it with a "Late Night Dinner" or "Relaxation".
      2. Ensure the timeline for DAY ${targetDay} remains logical (e.g., don't schedule Lunch at 5 PM).
      3. DO NOT change the schedule for other days (Day ${targetDay === 1 ? 2 : 1}, etc.) unless absolutely necessary.
    `;
  }
  else if (modificationType === "ai_edit") {
    if (!userPrompt) throw new ApiError(400, "User prompt is required for AI edits");

    instructions = `
      USER REQUEST: "${userPrompt}"
      
      ACTION:
      - Modify the "tripDetails" based strictly on the user's request.
      - Examples:
        - If user says "Make Day 2 cheaper", replace expensive paid activities on Day 2 with free/cheap ones (parks, walking tours).
        - If user says "Remove the Museum on Day 1", remove that specific activity object.
        - If user says "Add a coffee break", insert a café visit.
      
      CONSTRAINTS:
      - DO NOT modify the flights or hotels (they are stored separately).
      - DO NOT change the number of days unless explicitly asked.
      - Keep the JSON structure exact.
      - DO NOT generate or include any "_id" fields in the activities.
    `;
  }

  const prompt = `
    You are a travel itinerary modifier.
    
    Current Itinerary JSON:
    ${JSON.stringify(itinerary.tripDetails)}

    ${instructions}

    REQUIREMENTS:
    - Return the FULL updated "tripDetails" array (all days, even unchanged ones).
    - Return ONLY valid JSON.
    - Make NO MISTAKES !!!

    JSON FORMAT (MUST MATCH, NO markdown):
      [
        {
          "day": number,
          "theme": "string",
          "activities": [
            {
              "time": "string",
              "activity": "string",
              "location": "string",
              "description": "string",
              "estimatedCost": number
            }
          ]
        }
      ]
  `;

  const model = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  const responseText = await model.text;
  const cleanText = responseText?.replace(/```json/g, "").replace(/```/g, "").trim();

  let newTripDetails;
  try {
    newTripDetails = JSON.parse(cleanText || "[]");

    if (!Array.isArray(newTripDetails) && (newTripDetails as any).tripDetails) {
        newTripDetails = (newTripDetails as any).tripDetails;
    }
  } catch (error) {
    throw new ApiError(500, "AI failed to modify itinerary properly.");
  }
  
  const finalVerifiedDetails = [];

  for (const day of newTripDetails) {
    const verifiedActs = [];
    for (const act of day.activities) {

      const { _id, ...activityDataWithoutId } = act;
      
      const locationStr = typeof act.location === 'string' ? act.location : itinerary.destination;
      const query = `${act.activity} ${locationStr} ${itinerary.destination}`;
      
      const verified = await verifyPlace(act.activity, query);
      const {location, ...verifiedData} = verified;
      
      const coordinates = verified.location ? { lat: verified.location.lat, lng: verified.location.lng } : null;
      
      verifiedActs.push({
        ...activityDataWithoutId,
        location: locationStr,
        coordinates,
        ...verifiedData, 
      });
    }
    finalVerifiedDetails.push({ ...day, activities: verifiedActs });
  }

  itinerary.tripDetails = finalVerifiedDetails;

  await itinerary.save();

  return res.status(200).json(
    new ApiResponse(200, itinerary, "Itinerary modified successfully")
  );
});

export const updateItineraryDetails = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    const { itineraryId, tripDetails } = req.body; 

    if (!user) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!itineraryId || !tripDetails) {
        throw new ApiError(400, "Itinerary ID and new details are required");
    }

    if (!Array.isArray(tripDetails)) {
        throw new ApiError(400, "Trip details must be an array");
    }

    for (let i = 0; i < tripDetails.length; i++) {
        const day = tripDetails[i];
        if (typeof day.day !== 'number' || !Array.isArray(day.activities)) {
            throw new ApiError(400, `Day ${i + 1}: Invalid structure. Each day must have a 'day' number and 'activities' array`);
        }
    }

    const itinerary = await Itinerary.findOneAndUpdate(
        { _id: itineraryId, userId: user._id },
        { 
            $set: { tripDetails: tripDetails } 
        },
        { new: true }
    );

    if (!itinerary) {
        throw new ApiError(404, "Itinerary not found");
    }

    return res.status(200).json(
        new ApiResponse(200, itinerary, "Itinerary details updated successfully")
    );
});

export const optimizeDayRoute = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user || !user.isPro) {
        throw new ApiError(403, "Smart Route Optimization is a Pro feature. Upgrade to unlock.");
    }
    
    const { activities, dayStartTime = "09:00 AM" } = req.body;

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
        throw new ApiError(400, "Activities array is required to optimize route");
    }

    const validPlaces = activities.filter(act => 
       act.verified === true && 
       !act.activity.toLowerCase().includes("transportation")
    );
    
    const ignoredPlaces = activities.filter(act => 
       act.verified !== true || 
       act.activity.toLowerCase().includes("transportation")
    );

    if (validPlaces.length === 0) {
        throw new ApiError(400, "No valid places found to optimize.");
    }

    const placesToOptimize: PlaceInput[] = validPlaces.map((act: any, index: number) => {
        const durationMins = getDurationFromTimeRange(act.time);

        const latitude = act.coordinates?.lat || act.lat || act.geometry?.location?.lat || 0;
        const longitude = act.coordinates?.lng || act.lng || act.geometry?.location?.lng || 0;

        return {
            id: `place_${index}`, 
            name: act.activity,
            lat: latitude, 
            lng: longitude,
            openTime: act.openingHours || "08:00 AM", 
            closeTime: act.closedToday ? "00:00 AM" : "22:00 PM",
            durationMins: durationMins
        };
    });

    const distanceMatrix = await fetchDistanceMatrix(placesToOptimize);
    const optimizedResult = optimizeItinerary(placesToOptimize, dayStartTime, distanceMatrix);

    if (!optimizedResult) {
        throw new ApiError(400, "Could not find a valid route. Constraints might be too tight.");
    }

    const optimizedValidActivities = optimizedResult.optimizedPlaces.map((optPlace) => {
        const originalAct = validPlaces.find(a => a.activity === optPlace.name);
        
        return {
            ...originalAct,
            time: `${optPlace.arrivalTime} - ${optPlace.departureTime}`,
            waitingTime: optPlace.waitingTime 
        };
    });

    const finalActivities = [...optimizedValidActivities, ...ignoredPlaces];

    return res.status(200).json(
        new ApiResponse(200, {
            originalOrder: activities,
            optimizedOrder: finalActivities, 
            stats: {
                totalTravelTimeMins: optimizedResult.totalTravelTimeMins,
                totalWaitingTimeMins: optimizedResult.totalWaitingTimeMins
            }
        }, "Route optimized successfully!")
    );
});

export const uploadTripPhoto = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params; 

    if (!user) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!req.file) {
        throw new ApiError(400, "Please upload an image");
    }

    let imageUrl = "";

    try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "trip_vault", 
            resource_type: "image",
            transformation: [
                { width: 1080, crop: "limit" }, 
                { quality: "auto" },
                { format: "auto" },
            ],
        });

        imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new ApiError(500, "Failed to upload image to cloud storage");
    } finally {
      if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }

    const updatedItinerary = await Itinerary.findOneAndUpdate(
        { _id: id, userId: user._id },
        { $push: { userPhotos: imageUrl } },
        { new: true } 
    );

    if (!updatedItinerary) {
        throw new ApiError(404, "Trip not found or unauthorized to edit");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedItinerary, "Photo uploaded successfully!")
    );
});