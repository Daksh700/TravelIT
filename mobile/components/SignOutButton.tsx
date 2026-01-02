import { useClerk } from "@clerk/clerk-expo"
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "./Button";
import { LogOut } from "lucide-react-native";


export const SignOutButton = () => {
    const {signOut} = useClerk();
    const router = useRouter();


    const handleSignOut = async () => {
        try {
            await signOut();

            router.replace('/(auth)/sign-in')
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <View className="px-6 mb-10">
          <Button variant="outline" onPress={handleSignOut} className="border-red-500/50">
            <View className="flex-row items-center gap-2">
              <LogOut size={18} color="#ef4444" />
              <Text className="text-red-500 font-bold">Log Out</Text>
            </View>
          </Button>
        </View>
    )
}