import { saveItinerary } from "@/services/itinerary";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

type SaveItineraryParams = {
  source: string,
  destination: string,
  sourceMeta: object,
  duration: number,
  budgetTier: string,
  budget: number,
  currency: string,
  tripTitle: string,
  tripDescription: string,
  tripDetails: object[],
  status: string,
  interests?: string[]
}

export const useSaveItinerary = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async(data: SaveItineraryParams) => {
      const token = await getToken();
      if(!token) throw new Error("No token");

      return saveItinerary(
        token,
        data.source,
        data.destination,
        data.sourceMeta,
        data.duration,
        data.budgetTier,
        data.budget,
        data.currency,
        data.tripTitle,
        data.tripDescription,
        data.tripDetails,
        "draft",
        data.interests,
      );
    },
    onSuccess: () => {
        router.push("/(tabs)/plan")
    },
    onError: (err: any) => {
        console.log("Generation failed: ", err.message);
    }
  });
};