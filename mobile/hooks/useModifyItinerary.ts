import { modifyItinerary, updateItineraryDetails } from "@/services/itinerary";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ModifyItineraryParams = {
  itineraryId: string;
  type: "weather" | "delay" | "ai_edit";
  delayHours?: number;
  dayNumber?: number; 
  userPrompt?: string;
};

type UpdateDetailsParams = {
  itineraryId: string;
  tripDetails: any[];
}

export const useModifyItinerary = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ModifyItineraryParams) => {
      const token = await getToken();
      if (!token) throw new Error("No token");

      return modifyItinerary(
        token,
        data.itineraryId,
        data.type,
        data.delayHours,
        data.dayNumber,
        data.userPrompt
      );
    },

    onSuccess: (updatedTrip) => {
      if (!updatedTrip) return;

      queryClient.setQueryData(["user-itineraries"], (oldData: any[] | undefined) => {
        if (!oldData) return [updatedTrip];

        return oldData.map((trip) => 
          trip._id === updatedTrip._id ? updatedTrip : trip
        );
      });

      queryClient.setQueryData(["trip", updatedTrip._id], updatedTrip);

      queryClient.invalidateQueries({ queryKey: ["user-itineraries"] });
    },

    onError: (err: any) => {
      console.error("Modification failed: ", err.message);
    },
  });
};

export const useUpdateItineraryDetails = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDetailsParams) => {
      const token = await getToken();
      if (!token) throw new Error("No token");

      return updateItineraryDetails(
        token,
        data.itineraryId,
        data.tripDetails
      );
    },

    onSuccess: (updatedTrip) => {
        if (!updatedTrip) return;

        queryClient.setQueryData(["user-itineraries"], (oldData: any[] | undefined) => {
            if (!oldData) return [updatedTrip];
            return oldData.map((trip) => 
                trip._id === updatedTrip._id ? updatedTrip : trip
            );
        });
    },

    onError: (err: any) => {
      console.error("Drag & Drop save failed: ", err.message);
    }
  });
};