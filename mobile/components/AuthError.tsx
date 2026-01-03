import { Text } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export const AuthError = ({ message }: { message?: string }) => {
  const { colors } = useThemeColors();

  if (!message) return null;

  return (
    <Text
      style={{ color: colors.danger }}
      className="
        text-xs font-bold text-center mt-3
        uppercase tracking-wider
      "
    >
      {message}
    </Text>
  );
};