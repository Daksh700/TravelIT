import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function SSOScreen() {
    const router = useRouter();
    const {isLoaded, isSignedIn}= useAuth();

    useEffect(() => {
        if(isLoaded) {
            if(isSignedIn) {
                router.replace("../(tabs)")
            }
            else {
                router.replace("/(auth)/sign-in")
            }
        }
    }, [isLoaded, isSignedIn, router]);

    return null;
}