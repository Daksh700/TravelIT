import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  const { colors } = useThemeColors();

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Title Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        {/* Accent Dot */}
        <View
          style={{
            width: 8,
            height: 8,
            backgroundColor: colors.primary,
          }}
        />

        {/* Title */}
        <Text
          style={{
            color: colors.text,
            fontSize: 24,
            fontWeight: "700",
            letterSpacing: -0.5,
          }}
        >
          {title.toUpperCase()}
        </Text>
      </View>

      {/* Subtitle */}
      {subtitle && (
        <Text
          style={{
            marginLeft: 16,
            color: colors.textMuted,
            fontSize: 14,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};