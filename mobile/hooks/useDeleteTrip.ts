import { deleteTrip } from "@/services/itinerary";
import { useAuth } from "@clerk/clerk-expo"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteTrip = {
    id: string,
}

export const useDeleteTrip = () => {
    const {getToken} = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: DeleteTrip) => {
            const token = await getToken();
            if(!token) throw new Error("No token");
            return deleteTrip(token, data.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["userItineraries"]})
        }
    })
}