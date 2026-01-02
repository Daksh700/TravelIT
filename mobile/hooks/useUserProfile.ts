import { getUser } from "@/services/user";
import { useAuth } from "@clerk/clerk-expo"
import { useQuery } from "@tanstack/react-query";


export const useUserProfile = () => {
    const {isSignedIn, getToken} = useAuth();
    
    return useQuery({
        queryKey: ["me"],
        enabled: isSignedIn,
        queryFn: async () => {
            const token = await getToken();
            if(!token) throw new Error("No Token");
            return getUser(token);
        }
    })
}