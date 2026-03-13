import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { LogOut } from "lucide-react-native";

import { Button } from "./Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useHaptics } from "@/hooks/useHaptics";

export const SignOutButton = () => {
  const { handleImpact } = useHaptics()
  const { signOut } = useClerk();
  const router = useRouter();
  const { colors } = useThemeColors();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="px-6 mb-10">
      <Button
        variant="outline"
        onPress={() => {
          handleImpact("medium")
          handleSignOut()
        }}
        style={{
          borderColor: colors.danger,
          backgroundColor: "transparent",
        }}
      >
        <View className="flex-row items-center gap-2">
          <LogOut size={18} color={colors.danger} />
          <Text
            style={{ color: colors.danger }}
            className="font-bold"
          >
            Log Out
          </Text>
        </View>
      </Button>
    </View>
  );
};