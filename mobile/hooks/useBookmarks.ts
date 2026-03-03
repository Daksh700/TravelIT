import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { getBookmarks, toggleBookmark } from "@/services/user";

export const useBookmarks = () => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ["savedPlaces"],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error("No token");
            return getBookmarks(token);
        }
    });
};

export const useToggleBookmark = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (place: any) => {
            const token = await getToken();
            if (!token) throw new Error("No token");
            return toggleBookmark(token, place);
        },
        onMutate: async (newPlace) => {
            await queryClient.cancelQueries({ queryKey: ["savedPlaces"] });
            const previousBookmarks = queryClient.getQueryData<any[]>(["savedPlaces"]);
            
            queryClient.setQueryData(["savedPlaces"], (old: any[]) => {
                if (!old) return [newPlace];
                const exists = old.some(p => p.name === newPlace.name);
                return exists ? old.filter(p => p.name !== newPlace.name) : [...old, newPlace];
            });
            
            return { previousBookmarks };
        },
        onError: (err, newPlace, context) => {
            if (context?.previousBookmarks) {
                queryClient.setQueryData(["savedPlaces"], context.previousBookmarks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["savedPlaces"] });
        }
    });
};