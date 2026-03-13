import { AuthError } from "@/components/AuthError";
import { getClerkError } from "@/utils/clerkError";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useHaptics } from "@/hooks/useHaptics";

export default function ForgotPassword() {
  const { colors } = useThemeColors();
  const { handleImpact } = useHaptics();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("../(tabs)");
    }
  }, [isSignedIn]);

  if (!isLoaded) return null;

  const sendResetCode = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        return;
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
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
            onPress={() => {
              handleImpact("soft");
              router.back()
            }}
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
              Forgot{"\n"}Password?
            </Text>

            <Text
              style={{ color: colors.textMuted }}
              className="text-xs uppercase tracking-widest font-bold mt-2 text-center"
            >
              {successfulCreation
                ? "Enter code & new password"
                : "Reset your access"}
            </Text>
          </View>

          <View className="gap-5">
            {!successfulCreation && (
              <>
                <View className="gap-2">
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-[10px] uppercase tracking-widest font-bold ml-1"
                  >
                    Email Address
                  </Text>

                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    placeholderTextColor={colors.placeholder}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.border,
                    }}
                    className="h-14 px-4 rounded-md border text-sm font-medium"
                  />
                </View>

                <Pressable
                  onPress={() => {
                    handleImpact("medium");
                    sendResetCode()
                  }}
                  disabled={loading}
                  className="bg-primary py-4 mt-4 rounded-sm items-center"
                >
                  {loading ? (
                    <ActivityIndicator color={colors.primaryText} />
                  ) : (
                    <Text
                      style={{ color: colors.primaryText }}
                      className="font-bold uppercase tracking-widest"
                    >
                      Send Reset Code
                    </Text>
                  )}
                </Pressable>
              </>
            )}
            
            {successfulCreation && (
              <>
                <View className="gap-2 w-full mb-2">
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-[10px] uppercase tracking-widest font-bold text-center"
                  >
                    Email Verification Code
                  </Text>

                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="000000"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                    maxLength={6}
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.border,
                    }}
                    className="border px-4 py-5 rounded-md text-center text-3xl tracking-[0.5em] font-bold"
                  />
                </View>

                <View className="gap-2">
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-[10px] uppercase tracking-widest font-bold ml-1"
                  >
                    New Password
                  </Text>

                  <View className="relative">
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholder="Enter new password"
                      placeholderTextColor={colors.placeholder}
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderColor: colors.border,
                      }}
                      className="h-14 px-4 pr-12 rounded-md border text-sm font-medium"
                    />

                    <Pressable
                      onPress={() => {
                        handleImpact("soft");
                        setShowPassword(!showPassword)
                      }}
                      className="absolute right-0 h-14 w-12 items-center justify-center"
                    >
                      <Ionicons
                        name={
                          showPassword
                            ? "eye-outline"
                            : "eye-off-outline"
                        }
                        size={18}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    handleImpact("medium");
                    resetPassword()
                  }}
                  disabled={loading}
                  className="bg-primary py-4 mt-4 rounded-sm items-center"
                >
                  {loading ? (
                    <ActivityIndicator color={colors.primaryText} />
                  ) : (
                    <Text
                      style={{ color: colors.primaryText }}
                      className="font-bold uppercase tracking-widest"
                    >
                      Reset Password
                    </Text>
                  )}
                </Pressable>
              </>
            )}

            {secondFactor && (
              <Text
                style={{ color: colors.textMuted }}
                className="text-sm font-bold text-center mt-2"
              >
                2FA required (not handled yet)
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
      <AuthError message={error} />
    </View>
  );
}