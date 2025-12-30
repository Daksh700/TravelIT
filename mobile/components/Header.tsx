import { View, Text } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from "react-native-reanimated";
import { useEffect } from "react";

export const Header = () => {
  // Animation Logic for Pulsing Dot
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Infinite Pulse Effect
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }), // Dim
        withTiming(1, { duration: 1000 })    // Bright
      ),
      -1, // -1 matlab Infinite loop
      true // Reverse (Smooth wapis aayega)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-row items-center justify-between px-6 py-4 border-b border-border bg-background">
      <View className="flex-row items-center gap-2">
        <View className="w-3 h-3 bg-primary" />
        <Text className="text-xl font-bold tracking-tighter text-white">
          TRAVELIT
        </Text>
      </View>

      <Animated.View 
        style={[animatedStyle]} 
        className="w-2 h-2 rounded-full bg-secondary"
      />
    </View>
  );
};