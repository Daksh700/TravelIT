import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function SignIn() {
  const { isLoading, handleSocialAuth } = useSocialAuth();
  const router = useRouter();
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 32,
        justifyContent: "center",
      }}
    >
      <View
        style={{ backgroundColor: colors.primary }}
        className="w-12 h-12 self-center mb-6 items-center justify-center"
      >
        <Text
          style={{ color: colors.primaryText }}
          className="font-bold text-xl"
        >
          ✓
        </Text>
      </View>

      <Text
        style={{ color: colors.text }}
        className="text-4xl font-bold tracking-tight uppercase italic text-center"
      >
        TravelIt
      </Text>

      <Text
        style={{ color: colors.textMuted }}
        className="text-xs uppercase tracking-widest font-bold text-center mt-2 mb-10"
      >
        Your AI Journey Vault
      </Text>

      <View className="gap-3">
        <Pressable
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
          className="w-full flex-row items-center justify-center gap-3 py-4 border"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Image
                source={require("../../assets/images/google.png")}
                className="w-5 h-5"
              />
              <Text
                style={{ color: colors.text }}
                className="text-xs font-bold uppercase tracking-widest"
              >
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
          className="w-full flex-row items-center justify-center gap-3 py-4 border"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Image
                source={require("../../assets/images/apple.png")}
                className="w-5 h-5"
              />
              <Text
                style={{ color: colors.text }}
                className="text-xs font-bold uppercase tracking-widest"
              >
                Continue with Apple
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <View className="flex-row items-center my-8">
        <View
          style={{ backgroundColor: colors.border }}
          className="flex-1 h-[1px]"
        />
        <Text
          style={{ color: colors.textMuted }}
          className="mx-4 text-[10px] font-bold uppercase tracking-widest"
        >
          Or
        </Text>
        <View
          style={{ backgroundColor: colors.border }}
          className="flex-1 h-[1px]"
        />
      </View>

      <Pressable
        style={{ backgroundColor: colors.primary }}
        className="py-4"
        onPress={() => router.push("/(auth)/email-sign-in")}
      >
        <Text
          style={{ color: colors.primaryText }}
          className="font-bold uppercase tracking-widest text-center"
        >
          Sign in with Email
        </Text>
      </Pressable>

      <Pressable
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
        className="mt-3 py-4 border"
        onPress={() => router.push("/(auth)/sign-up")}
      >
        <Text
          style={{ color: colors.text }}
          className="font-bold uppercase tracking-widest text-center"
        >
          Create Account
        </Text>
      </Pressable>

      <Text
        style={{ color: colors.textMuted }}
        className="text-[10px] font-bold uppercase tracking-[0.3em] text-center mt-12"
      >
        Securely Encrypted // TravelIt v2.5
      </Text>
    </View>
  );
}