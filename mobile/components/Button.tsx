import { ActivityIndicator, StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>; 
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  isLoading = false,
  children,
  disabled,
  style
}: ButtonProps) => {
  const { colors } = useThemeColors();

  const isDisabled = disabled || isLoading;

  /* ---------- CONTAINER STYLE ---------- */
  let backgroundColor = "transparent";
  let borderColor = "transparent";

  if (variant === "primary") {
    backgroundColor = colors.primary;
  }

  if (variant === "outline") {
    borderColor = colors.border;
  }

  /* ---------- TEXT COLOR ---------- */
  let textColor = colors.text;

  if (variant === "primary") {
    textColor = colors.primaryText;
  }

  if (variant === "ghost") {
    textColor = colors.textMuted;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        {
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

          backgroundColor,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor,

          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.primaryText : colors.text}
        />
      ) : children ? (
        children
      ) : (
        <Text
          style={{
            color: textColor,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};