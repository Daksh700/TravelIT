import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  TextInput,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getClerkError } from "@/utils/clerkError";
import { AuthError } from "@/components/AuthError";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function EmailSignIn() {
  const { colors } = useThemeColors();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(undefined);

    try {
      const res = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.replace("../(tabs)");
      }
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1 px-8">
        <View className="h-12 justify-center -ml-2">
          <Pressable
            className="w-10 h-10 items-center justify-center"
            onPress={router.back}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textMuted} />
          </Pressable>
        </View>

        <View className="mt-8">
          <View className="mb-10 items-center">
            <Text
              style={{ color: colors.text }}
              className="text-3xl font-bold uppercase italic tracking-tight text-center"
            >
              Welcome Back
            </Text>

            <Text
              style={{ color: colors.textMuted }}
              className="text-xs uppercase tracking-widest font-bold mt-2 text-center"
            >
              Access your itinerary
            </Text>
          </View>

          <View className="gap-5">
            <View className="gap-2">
              <Text
                style={{ color: colors.textMuted }}
                className="text-[10px] uppercase tracking-widest font-bold ml-1"
              >
                Email Address
              </Text>

              <TextInput
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="Enter email"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
                className="h-14 px-4 rounded-md text-sm font-medium border"
              />
            </View>

            <View className="gap-2">
              <Text
                style={{ color: colors.textMuted }}
                className="text-[10px] uppercase tracking-widest font-bold ml-1"
              >
                Password
              </Text>

              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password"
                  placeholderTextColor={colors.placeholder}
                  style={{
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                  className="h-14 px-4 pr-12 rounded-md text-sm font-medium border"
                />

                <Pressable
                  className="absolute right-0 h-14 w-12 items-center justify-center"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            <View className="items-end -mt-1">
              <Pressable
                onPress={() =>
                  router.replace("/(auth)/forgot-password")
                }
              >
                <Text
                  style={{ color: colors.primary }}
                  className="text-[10px] font-bold uppercase tracking-widest"
                >
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onSignIn}
              disabled={loading}
              className="bg-primary py-4 items-center justify-center mt-4 rounded-sm"
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryText} />
              ) : (
                <Text
                  style={{ color: colors.primaryText }}
                  className="font-bold uppercase tracking-widest"
                >
                  Sign In
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        <AuthError message={error} />
      </SafeAreaView>
    </View>
  );
}