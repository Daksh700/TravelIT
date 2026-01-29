import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GoogleGenAI } from "@google/genai";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyPlace } from "../services/placeVerifier.js";
import { getHotels } from "../services/hotelService.js";

export const generateItinerary = asyncHandler(async (req: Request, res: Response) => {
  const {
    source,
    destination,
    duration,
    budget,
    budgetTier,
    currency = "USD",
    interests = [],
    travelers = 1,
    ageGroup = "adults",
    safeMode = false,   
    checkInDate,     
    checkOutDate  
  } = req.body;

  if (!source || !destination || !duration || !budget || !budgetTier || !checkInDate ||!checkOutDate) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (checkInDate && checkOutDate) {
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      throw new ApiError(400, "Invalid hotel dates");
    }

    if (outDate <= inDate) {
      throw new ApiError(400, "Check-out must be after check-in");
    }
  }

  const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY as string});

  const interestPrompt =
    interests.length > 0
      ? `User interests: ${interests.join(
          ", "
        )}. Prioritize activities related to these interests.`
      : "Cover the most popular and top-rated tourist attractions.";

  const peoplePrompt = `Group size: ${travelers} traveler(s).`;

  const agePromptMap = {
    young: "Target 18-25—nightlife, local youth hotspots, unique modern experiences.",
    adults: "Target 25-45—balanced activities, food, culture, exploration.",
    family: "Family friendly—no risky locations, kid-safe attractions, theme parks, zoos.",
    seniors: "Senior-friendly—no steep climbs, minimize long walks, quieter places."
  } as const;

  const agePrompt = agePromptMap[ageGroup as keyof typeof agePromptMap] ?? agePromptMap.adults;

  const safeModePrompt = safeMode
    ? `SAFETY MODE ON:
- Avoid unsafe neighborhoods entirely.
- Prefer daytime activities.
- Recommend well-lit public places.
- Prefer guided group tours or busy tourist spots.
- Add a daily safety note if relevant.`
    : "Safety: standard assumptions.";

  const prompt = `
You are a professional travel planner.

Create a realistic ${duration}-day itinerary:
- Source city: ${source}
- Destination: ${destination}
- Budget tier: ${budgetTier}
- Maximum total budget: ${budget} ${currency}
- ${peoplePrompt}
- Age group: ${ageGroup}
- Safety consideration: ${safeMode ? "HIGH" : "normal"}

IMPORTANT TIME RULE:
- DO NOT use exact times like "7:00 AM - 10:00 AM" or "2:45 PM".
- Instead use broad time slots ONLY from this list:
  - "Early Morning"
  - "Morning"
  - "Late Morning"
  - "Afternoon"
  - "Late Afternoon"
  - "Evening"
  - "Night"
  - "Late Night"

Rules:
- Stay within the budget.
- Include daily meals: breakfast, lunch, snack, dinner.
- Include local transportation costs.
- If major city has metro/travel pass (e.g. JR/Metro), include it.
- If flight + stay realistically fit inside budget, include them in Day 1 and summary note.
- Prefer hostels for low-budget tiers.
- Avoid duplicated activities.
- ${agePrompt}
- ${safeModePrompt}
- Return ONLY valid JSON.
- Make NO MISTAKES !!!

JSON FORMAT (MUST MATCH, NO markdown):
{
  "tripTitle": "string",
  "tripDescription": "string",
  "tripDetails": [
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
}

${interestPrompt}
`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const response = await result.text;

  // Cleanup possible markdown wrappers
  const cleanText = response?.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    const itineraryData = JSON.parse(cleanText || "{}");

    const verifiedDays = [];

    for(const day of itineraryData.tripDetails) {
      const verifiedActs = [];

      for(const act of day.activities) {
        const verified = await verifyPlace(act.activity, `${act.location} ${destination}`);
        verifiedActs.push({...act, ...verified});
      }

      verifiedDays.push({...day, activities: verifiedActs});
    }

    itineraryData.tripDetails = verifiedDays;

    let hotelSnapshot = null;

    if (checkInDate && checkOutDate) {
      const hotelResult = await getHotels(
        destination,
        checkInDate,
        checkOutDate,
        budget,
        travelers,
        currency
      );

      const best = hotelResult.bestHotel;

      if (best) {
        hotelSnapshot = {
          hotelId: best.property.id,
          name: best.property.name,
          city: best.property.city,
          address: best.property.address,
          arrivalDate: new Date(checkInDate),
          departureDate: new Date(checkOutDate),
          pricePerNight: best.property.priceBreakdown?.grossPrice?.value ?? null,
          totalPrice: best.property.priceBreakdown?.grossPrice?.value
            ? best.property.priceBreakdown.grossPrice.value * hotelResult.nights
            : null,
          currency,
          rating: best.property.reviewScore ?? null,
          reviewCount: best.property.reviewCount ?? 0,
          photos: best.property.photoUrls ?? []
        };
      }
    }

    return res.status(200).json(
      new ApiResponse(200, {...itineraryData, hotel: hotelSnapshot || null}, "Itinerary generated successfully")
    );
  } catch (error) {
    throw new ApiError(
      500,
      "AI generated invalid JSON. Please retry itinerary generation."
    );
  }
});

export const exploreLocation = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;

    if(!query) {
        throw new ApiError(400, "Query is required");
    }

    const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY as string});

    const prompt = `Answer this travel query concisely: ${query}`;

    const model = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}]
        }
    });

    const text = model.text;

    const groundingMetadata = model.candidates?.[0]?.groundingMetadata;

    const links = groundingMetadata?.groundingChunks?.map((chunk: any) => {
        if(chunk.web) {
            return {
                title: chunk.web.title,
                url: chunk.web.uri
            };
        }
        return null;
    }).filter((link: any) => link !== null) || [];

    return res.status(200).json(
        new ApiResponse(200, {text, links}, "Search results fetched")
    );
})