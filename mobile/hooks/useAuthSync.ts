import { syncUser } from "@/services/user";
import { useAuth } from "@clerk/clerk-expo"
import { useState } from "react";

export const useAuthSync = () => {
    const {isSignedIn, getToken} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [syncDone, setSyncDone] = useState(false);

    const handleAuthSync = async () => {
        setIsLoading(true);
        try {
            if(isSignedIn) {
                const token = await getToken();

                if(token) {
                    await syncUser(token);
                    setSyncDone(true);
                }
            }
        } 
        catch (err) {
            console.log("Error in Auth Sync", err);
        }
        finally {
            setIsLoading(false);
        }
    } 

    return {isLoading, handleAuthSync}
}

