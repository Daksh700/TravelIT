import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import { getClerkError } from "@/utils/clerkError";
import { AuthError } from "@/components/AuthError";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function SignUp() {
  const { colors } = useThemeColors();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onSignUp = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(undefined);

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(undefined);

    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.replace("../(tabs)");
      } else {
        setError(getClerkError(res));
      }
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView className="flex-1 px-8">
          <View className="h-12 justify-center -ml-2">
            <Pressable
              onPress={() => setPendingVerification(false)}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          <View className="mt-8 items-center">
            <Text
              style={{ color: colors.text }}
              className="text-3xl font-bold uppercase italic text-center"
            >
              Verify Email
            </Text>

            <Text
              style={{ color: colors.textMuted }}
              className="text-xs uppercase tracking-widest font-bold mt-2 mb-10 text-center"
            >
              Code sent to {emailAddress}
            </Text>

            <View className="w-full gap-2">
              <Text
                style={{ color: colors.textMuted }}
                className="text-[10px] uppercase tracking-widest font-bold text-center"
              >
                Enter Code
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                maxLength={6}
                keyboardType="numeric"
                placeholder="000000"
                placeholderTextColor={colors.placeholder}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
                className="border px-4 py-5 rounded-md text-center text-3xl tracking-[0.5em] font-bold"
              />
            </View>

            <Pressable
              onPress={onVerify}
              disabled={loading}
              className="bg-primary py-4 w-full mt-6 items-center rounded-sm"
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryText} />
              ) : (
                <Text
                  style={{ color: colors.primaryText }}
                  className="font-bold uppercase tracking-widest"
                >
                  Verify & Start
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1 px-8">
        <View className="h-12 justify-center -ml-2">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        <View className="mt-8">
          <View className="mb-10 items-center">
            <Text
              style={{ color: colors.text }}
              className="text-3xl font-bold uppercase italic text-center"
            >
              Create{"\n"}Account
            </Text>

            <Text
              style={{ color: colors.textMuted }}
              className="text-xs uppercase tracking-widest font-bold mt-2 text-center"
            >
              Join the journey vault
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
                autoCapitalize="none"
                placeholder="Enter email"
                placeholderTextColor={colors.placeholder}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
                className="h-14 px-4 rounded-md border text-sm font-medium"
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
                  className="h-14 pl-4 pr-12 rounded-md border text-sm font-medium"
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-0 h-14 w-12 items-center justify-center"
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={onSignUp}
              disabled={loading}
              className="bg-primary py-4 items-center mt-4 rounded-sm"
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryText} />
              ) : (
                <Text
                  style={{ color: colors.primaryText }}
                  className="font-bold uppercase tracking-widest"
                >
                  Continue
                </Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row justify-center gap-2 mt-8">
            <Text
              style={{ color: colors.textMuted }}
              className="text-xs"
            >
              Already have an account?
            </Text>

            <Pressable onPress={() => router.back()}>
              <Text
                style={{ color: colors.primary }}
                className="text-xs font-bold uppercase tracking-wider"
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>

        <AuthError message={error} />
      </SafeAreaView>
    </View>
  );
}