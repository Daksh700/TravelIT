import { View, ViewProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

interface CardProps extends ViewProps {
  className?: string;
}

export const Card = ({ children, style, ...props }: CardProps) => {
  const { colors } = useThemeColors();

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: 16,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};