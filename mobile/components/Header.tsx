import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";

import { useThemeColors } from "@/hooks/useThemeColors";

export const Header = () => {
  const { colors } = useThemeColors();

  // 🔹 Pulsing animation
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
      className="flex-row items-center justify-between px-6 py-4 border-b"
    >
      {/* Logo + Title */}
      <View className="flex-row items-center gap-2">
        <View
          style={{ backgroundColor: colors.primary }}
          className="w-3 h-3"
        />

        <Text
          style={{ color: colors.text }}
          className="text-xl font-bold tracking-tighter"
        >
          TRAVELIT
        </Text>
      </View>

      {/* Pulsing Status Dot */}
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: colors.secondary ?? colors.primary,
          },
        ]}
      />
    </View>
  );
};