import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSocialAuth } from "@/hooks/useSocialAuth";

export default function SignIn() {
  const { isLoading, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 bg-black px-8 justify-center">

      {/* 🔐 Logo */}
      <View className="w-12 h-12 bg-[#00dc82] self-center mb-6 items-center justify-center">
        <Text className="text-black font-bold text-xl">✓</Text>
      </View>

      {/* 🏷 Brand */}
      <Text className="text-white text-4xl font-bold tracking-tight uppercase italic text-center">
        TravelIt
      </Text>

      <Text className="text-zinc-500 text-xs uppercase tracking-widest font-bold text-center mt-2 mb-10">
        Your AI Journey Vault
      </Text>

      {/* 🔘 Buttons */}
      <View className="gap-3">

        {/* Google */}
        <Pressable
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          className="w-full flex-row items-center justify-center gap-3 py-4 border border-zinc-800"
        >
          {isLoading ? (
            <ActivityIndicator color="#00dc82" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/google.png")}
                className="w-5 h-5"
              />
              <Text className="text-xs font-bold uppercase tracking-widest text-white">
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>

        {/* Apple */}
        <Pressable
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          className="w-full flex-row items-center justify-center gap-3 py-4 border border-zinc-800"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/apple.png")}
                className="w-5 h-5"
              />
              <Text className="text-xs font-bold uppercase tracking-widest text-white">
                Continue with Apple
              </Text>
            </>
          )}
        </Pressable>
      </View>

      {/* ─── OR ─── */}
      <View className="flex-row items-center my-8">
        <View className="flex-1 h-[1px] bg-zinc-900" />
        <Text className="mx-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          Or
        </Text>
        <View className="flex-1 h-[1px] bg-zinc-900" />
      </View>

      {/* Email CTA (UI only) */}
      <Pressable
        className="bg-[#00dc82] py-4"
      >
        <Text className="text-black font-bold uppercase tracking-widest text-center">
          Sign in with Email
        </Text>
      </Pressable>

      <Pressable
        className="mt-3 border border-zinc-800 py-4"
      >
        <Text className="text-white font-bold uppercase tracking-widest text-center">
          Create Account
        </Text>
      </Pressable>

      {/* 🔒 Footer */}
      <Text className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em] text-center mt-12">
        Securely Encrypted // TravelIt v2.5
      </Text>

    </View>
  );
}