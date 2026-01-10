import { exploreLocation } from "@/services/explore"
import { useAuth } from "@clerk/clerk-expo"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"

type ExploreLocationParams = {
    query: string
}

export const useExploreLocation = () => {
    const {getToken} = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: ExploreLocationParams) => {
            const token = await getToken();
            if(!token) throw new Error("No token");

            return exploreLocation(
                token,
                data.query
            )
        },
        onSuccess: (data, variables) => {
            if(!data) return;

            queryClient.setQueryData(["exploreResult"], {
                query: variables.query,
                text: data.text,
                links: data.links ?? []
            });
        },
        onError: (err: any) => {
            console.log("Explore failed:", err.message)
        }
    })
}