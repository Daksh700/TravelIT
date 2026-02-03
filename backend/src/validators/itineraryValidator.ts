import {z} from "zod";

export const generateItinerarySchema = z.object({
  source: z.string().min(2, "Source is required"),
  destination: z.string().min(3, "Destination name is too short"),

  budgetTier: z.enum(["low", "medium", "high"], {
    message: "Budget tier must be low, medium, or high",
  }),

  budget: z.number().min(100, "Budget too low"),

  currency: z.string().default("USD"),

  duration: z.number()
    .min(1, "Trip must be at least 1 day")
    .max(15, "Trip cannot exceed 15 days"),

  interests: z.array(z.string()).optional(),

  travelers: z.number()
    .min(1, "At least 1 traveler is required")
    .default(1),

  ageGroup: z.enum(["family", "young", "adults", "seniors"]).default("adults"),

  safeMode: z.boolean().default(false),

  tripStartDate: z.string(),
  tripEndDate: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
});

export const saveItinerarySchema = z.object({
  source: z.string(),
  destination: z.string(),

  sourceMeta: z.object({
    city: z.string(),
    autoDetected: z.boolean(),
  }),

  duration: z.number(),

  tripStartDate: z.string(),
  tripEndDate: z.string(),

  budgetTier: z.enum(["low", "medium", "high"]),
  budget: z.number(),
  currency: z.string(),

  interests: z.array(z.string()).optional(),

  travelers: z.number().min(1),
  ageGroup: z.enum(["family", "young", "adults", "seniors"]),
  safeMode: z.boolean(),

  tripTitle: z.string().min(3, "Title must be at least 3 chars"),
  tripDescription: z.string().min(10, "Description is too short"),

  tripDetails: z.array(
    z.object({
      day: z.number(),
      theme: z.string().optional(),
      activities: z.array(
        z.object({
          time: z.string(),
          activity: z.string(),
          location: z.string(),
          description: z.string(),
          estimatedCost: z.number(),
        })
      ),
    })
  ),

  hotel: z.any().optional().nullable(),
  flight: z.any().optional().nullable(),

  status: z.enum(["draft", "active", "completed"]).default("draft"),
});

export const exploreSchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters long")
})

export const modifyItinerarySchema = z.object({
  itineraryId: z.string().min(1, "Itinerary ID is required"),
  modificationType: z.enum(["weather", "delay", "ai_edit"], { 
    message: "Type must be 'weather', 'delay', or 'ai_edit'",
  }),
  delayHours: z.number().optional(), 
  dayNumber: z.number().optional(),
  userPrompt: z.string().optional(), 
});

export const updateTripDetailsSchema = z.object({
  itineraryId: z.string().min(1),
  tripDetails: z.array(
    z.object({
      day: z.number(),
      theme: z.string().optional(),
      activities: z.array(z.any()) 
    })
  )
});