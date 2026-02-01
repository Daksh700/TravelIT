import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GoogleGenAI } from "@google/genai";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyPlace } from "../services/placeVerifier.js";
import { getHotels } from "../services/hotelService.js";
import { getFlights } from "../services/flightService.js";

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
    tripStartDate,
    tripEndDate,
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

CRITICAL COST RULES (READ CAREFULLY):
1. **REALISTIC PRICING**: You MUST provide realistic market rates for ${destination}. 
   - Example: A cheap lunch in New York is $15-$20 (approx 1200-1600 INR). DO NOT output 20 INR or 0 INR unless it is truly free (like a park).
   - Convert realistic local prices to ${currency} accurately.
2. **NO HOTEL COSTS**: The user has already booked a hotel separately. DO NOT include accommodation costs in the "estimatedCost" field for any activity.
3. **FLIGHTS**: In Day 1, include an activity named "Flight Arrival" and put the estimated Flight cost there.

Rules:
- Stay within the budget (excluding hotel cost).
- Include daily meals: breakfast, lunch, snack, dinner (with realistic prices).
- Include local transportation costs (Metro/Subway/Uber).
- If major city has metro/travel pass (e.g. JR/Metro), include it.
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

    let flightSnapshot = null;

    if (tripStartDate && tripEndDate) {

      const flightResult = await getFlights(source, destination, tripStartDate, tripEndDate, travelers, currency);

      if (flightResult && flightResult.bestFlight) {
        flightSnapshot = {
          airline: flightResult.bestFlight.airline,
          logo: flightResult.bestFlight.logo,
          price: flightResult.bestFlight.price,
          currency: flightResult.bestFlight.currency,
          departureTime: flightResult.bestFlight.departureTime,
          arrivalTime: flightResult.bestFlight.arrivalTime,
          duration: flightResult.bestFlight.durationLabel,
          stops: flightResult.bestFlight.stops
        };
      }
      
    }

    return res.status(200).json(
      new ApiResponse(200, {...itineraryData, hotel: hotelSnapshot || null, flight: flightSnapshot || null, tripStartDate, tripEndDate}, "Itinerary generated successfully")
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

  if (!query) {
    throw new ApiError(400, "Query is required");
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

  const prompt = `
  You are a travel assistant. The user is asking: "${query}".
    
  Return a valid JSON object with:
   1. "summary": A concise answer (max 2 sentences).
   2. "recommendations": An array of places/items mentioned (max 5).
    Each recommendation must have: "name", "description" (short).

    JSON FORMAT ONLY. NO MARKDOWN.
  `;

  const model = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { 
      tools: [{googleSearch: {}}] 
    }
  });

  const responseText = model.text; 
  const cleanText = responseText?.replace(/```json/g, "").replace(/```/g, "").trim();
    
  let structuredData;
  try {
    structuredData = JSON.parse(cleanText || "{}");
  } catch (e) {
    return res.status(200).json(new ApiResponse(200, { text: responseText, items: [], links: [] }, "Raw text returned"));
  }

  const enrichedItems = [];
    
  if (structuredData.recommendations) {
    for (const item of structuredData.recommendations) {
      const details = await verifyPlace(item.name, query);
            
        enrichedItems.push({
            ...item,
            image: details.photos?.[0] || null, 
            address: details.formattedAddress || null,
            rating: details.rating || null,
            verified: details.verified
          });
        }
    }

  const groundingMetadata = model.candidates?.[0]?.groundingMetadata;
  const links = groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.web) return { title: chunk.web.title, url: chunk.web.uri };
      return null;
  }).filter((link: any) => link !== null) || [];

  return res.status(200).json(
    new ApiResponse(200, { 
      text: structuredData.summary, 
      items: enrichedItems, 
      links 
    }, "Search results fetched")
  );
})