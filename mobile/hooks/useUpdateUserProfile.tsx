import { updateUserProfile } from "@/services/user";
import { useAuth } from "@clerk/clerk-expo"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type updateUser = {
    firstName?: string,
    lastName?: string,
    username?: string,
    avatar?: string,
}

export const useUpdateUserProfile = () => {
    const {getToken} = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: updateUser) => {
            const token = await getToken();
            if(!token) throw new Error("No token");

            return updateUserProfile(
                token,
                data.firstName,
                data.lastName,
                data.username,
                data.avatar
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["me"]})
        }
    })
}