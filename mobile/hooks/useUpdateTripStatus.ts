import { useAuth } from "@clerk/clerk-expo"
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTripStatus } from "@/services/itinerary";

type UpdateTripStatusParams = {
    id: string,
    status: string,
}

export const useUpdateTripStatus = () => {
    const {getToken} = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: UpdateTripStatusParams) => {
            const token = await getToken();
            if(!token) throw new Error("No token");
            return updateTripStatus(token, data.id, data.status);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["userItineraries"]})
        }
    })
}