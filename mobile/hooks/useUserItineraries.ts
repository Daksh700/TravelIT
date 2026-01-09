import { getUserItineraries } from "@/services/itinerary";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

export const useUserItineraries = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["userItineraries"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return getUserItineraries(token);
    },
  });
};