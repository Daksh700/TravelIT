import { useQuery } from "@tanstack/react-query";
import { getTrendingDestinations } from "@/services/explore";
import { useAuth } from "@clerk/clerk-expo";

export function useTrendingDestinations() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["trendingDestinations"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No auth token found");
      return getTrendingDestinations(token);
    },
    staleTime: 1000 * 60 * 60 * 24, 
  });
}