import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiResponse } from "../utils/ApiResponse.js";

export const generateItinerary = asyncHandler(async (req: Request, res: Response) => {
  const {
    source,
    destination,
    duration,
    budget,
    budgetTier,
    currency = "USD",
    interests = [],
  } = req.body;

  if (!source || !destination || !duration || !budget || !budgetTier) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const interestPrompt =
    interests.length > 0
      ? `User interests: ${interests.join(
          ", "
        )}. Prioritize activities related to these interests.`
      : "Cover the most popular and top-rated tourist attractions.";

  const prompt = `
You are a professional travel planner.

Create a realistic ${duration}-day itinerary:
- Source city: ${source}
- Destination: ${destination}
- Budget tier: ${budgetTier}
- Maximum total budget: ${budget} ${currency}

Rules:
- Stay within the budget.
- Include daily meals: breakfast, lunch, snack, dinner.
- Include local transportation costs.
- If major city has metro/travel pass (e.g. JR/Metro), include it.
- If flight + stay realistically fit inside budget, include them in Day 1 or summary note.
- Prefer hostels for low-budget tiers.
- Avoid duplicated activities.
- Return ONLY valid JSON.

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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Cleanup possible markdown wrappers
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    const itineraryData = JSON.parse(text);

    return res.status(200).json(
      new ApiResponse(200, itineraryData, "Itinerary generated successfully")
    );
  } catch (error) {
    throw new ApiError(
      500,
      "AI generated invalid JSON. Please retry itinerary generation."
    );
  }
});