import 'react-native-reanimated';
import { useState, useEffect, useRef } from 'react';
import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { StatusBar } from "expo-status-bar";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, Animated, StyleSheet } from 'react-native'; 
import LottieView from 'lottie-react-native';

import { useThemeColors } from "@/hooks/useThemeColors";
import { useSystemThemeSync } from '@/hooks/useSystemThemeSync';
import { useNotifications } from '@/hooks/useNotifications';

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

function RootNavigation() {
  const { isLoaded, isSignedIn } = useAuth();
  const { colors } = useThemeColors();

  useNotifications(!!isSignedIn);

  const [splashRemoved, setSplashRemoved] = useState(false);
  const [isTimerDone, setIsTimerDone] = useState(false);
  
  const splashOpacity = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerDone(true);
    }, 2500);

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    if (isLoaded && isTimerDone) {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 500, 
        useNativeDriver: true, 
      }).start(() => {
        setSplashRemoved(true);
      });
    }
  }, [isLoaded, isTimerDone]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      
      {isLoaded && (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      )}

      {!splashRemoved && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            { 
              backgroundColor: colors.background, 
              justifyContent: 'center', 
              alignItems: 'center', 
              opacity: splashOpacity, 
              zIndex: 999 
            }
          ]}
          pointerEvents="none" 
        >
          <LottieView
            source={require('../assets/animations/Travel.json')} 
            autoPlay
            loop={false} 
            style={{ width: 250, height: 250 }}
          />
        </Animated.View>
      )}

    </View>
  );
}

export default function RootLayout() {
  const { colors, isDark } = useThemeColors();
  useSystemThemeSync();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <SafeAreaProvider>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <RootNavigation />
          </View>
        </SafeAreaProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}