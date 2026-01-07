import { generateItinerary } from "@/services/itinerary";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

type GenerateItineraryParams = {
  source: string,
  destination: string,
  budgetTier: string,
  budget: number,
  currency: string,
  duration: number,
  interests?: string[]
}

export const useGenerateItinerary = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async(data: GenerateItineraryParams) => {
      const token = await getToken();
      if(!token) throw new Error("No token");

      return generateItinerary(
        token,
        data.source,
        data.destination,
        data.budgetTier,
        data.budget,
        data.currency,
        data.duration,
        data.interests
      );
    },
    onSuccess: (data, variables) => {
        if(!data) return;

        const fullPayload = {
          ...data,
          source: variables.source,
          destination: variables.destination,
          duration: Number(variables.duration),
          budgetTier: variables.budgetTier,
          budget: Number(variables.budget),
          currency: variables.currency,
          interests: variables.interests ?? [],
          sourceMeta: {
            city: variables.source,
            autoDetected: false,
          },
          status: "draft"
        }
        queryClient.setQueryData(["latestItinerary"], fullPayload);
        router.push("/(tabs)/plan/result")
    },
    onError: (err: any) => {
        console.log("Generation failed: ", err.message);
    }
  });
};