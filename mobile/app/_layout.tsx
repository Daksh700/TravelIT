import 'react-native-reanimated';
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo';
import { StatusBar } from "expo-status-bar";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View } from 'react-native';

import { useThemeColors } from "@/hooks/useThemeColors";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colors, isDark } = useThemeColors();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <SafeAreaProvider>
          <View
            style={{ flex: 1, backgroundColor: colors.background }}
          >
            <StatusBar style={isDark ? "light" : "dark"} />

            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
            </Stack>
          </View>
        </SafeAreaProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}