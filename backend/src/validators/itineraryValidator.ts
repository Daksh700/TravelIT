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
});

export const saveItinerarySchema = z.object({
  source: z.string(),
  destination: z.string(),

  sourceMeta: z.object({
    city: z.string(),
    autoDetected: z.boolean(),
  }),

  duration: z.number(),

  budgetTier: z.enum(["low", "medium", "high"]),
  budget: z.number(),
  currency: z.string(),

  interests: z.array(z.string()).optional(),

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

  status: z.enum(["draft", "active", "completed"]).default("draft"),
});