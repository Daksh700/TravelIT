import 'react-native-reanimated';
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { StatusBar } from "expo-status-bar";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import "../global.css"
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{headerShown: false, contentStyle: {backgroundColor: '#050505'}}}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
