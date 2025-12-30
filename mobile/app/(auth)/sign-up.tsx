import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { getClerkError } from "@/utils/clerkError";
import { AuthError } from "@/components/AuthError";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // --- STEP 1: Create Account & Send Email Code ---
  const onSignUp = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError(undefined);
    try {
      await signUp.create({
        emailAddress,
        password
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Verify Code ---
  const onVerify = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError(undefined);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.replace('../(tabs)');
      } else {
        setError(getClerkError(signUpAttempt));
      }
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFICATION VIEW =================
  if (pendingVerification) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1 px-8">
          
          {/* Back Arrow (Returns to Edit Email) */}
          <View className="h-12 justify-center -ml-2">
             <Pressable onPress={() => setPendingVerification(false)} className="w-10 h-10 items-center justify-center">
               <Ionicons name="arrow-back" size={24} color="#71717a" />
             </Pressable>
          </View>

          <View className="mt-8 items-center">
            <Text className="text-white text-3xl font-bold uppercase italic tracking-tight text-center">
              Verify Email
            </Text>
            <Text className="text-zinc-500 text-xs mt-2 font-bold uppercase tracking-widest text-center mb-10">
              Code sent to {emailAddress}
            </Text>

            <View className="space-y-2 w-full">
              <Text className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold text-center">
                Enter Code
              </Text>
              <TextInput
                value={code}
                placeholder="000000"
                placeholderTextColor="#27272a"
                keyboardType="numeric"
                onChangeText={setCode}
                maxLength={6}
                className="border border-zinc-800 px-4 py-5 text-white text-center text-3xl tracking-[0.5em] font-bold bg-zinc-900/50 rounded-md w-full"
              />
            </View>

            <Pressable 
              className="bg-[#00dc82] py-4 items-center justify-center mt-6 w-full rounded-sm" 
              onPress={onVerify}
              disabled={loading}
            >
               {loading ? <ActivityIndicator color="black" /> : (
                 <Text className="text-black font-bold uppercase tracking-widest">Verify & Start</Text>
               )}
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Footer */}
        <View className="pb-8">
          <Text className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.3em] text-center">
            Securely Encrypted // TravelIt v2.5
          </Text>
        </View>
      </View>
    );
  }

  // ================= SIGN UP VIEW =================
  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1 px-8">
        
        {/* Back Arrow */}
        <View className="h-12 justify-center -ml-2">
           <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
             <Ionicons name="arrow-back" size={24} color="#71717a" />
           </Pressable>
        </View>

        <View className="mt-8">
          <View className="mb-10 items-center">
            <Text className="text-white text-3xl font-bold uppercase italic tracking-tight text-center">
              Create{"\n"}Account
            </Text>
            <Text className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-2 text-center">
              Join the journey vault
            </Text>
          </View>

          <View className="gap-5">
            
            {/* Email Input (Fixed Height: h-14) */}
            <View className="gap-2">
              <Text className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold ml-1">
                Email Address
              </Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                placeholderTextColor="#3f3f46"
                onChangeText={setEmailAddress}
                // Fix: h-14 use kiya, py-4 hata diya
                className="h-14 border border-zinc-800 px-4 text-white text-sm font-medium bg-zinc-900/30 rounded-md"
                textAlignVertical="center" // Android fix
              />
            </View>

            {/* Password Input (Fixed Height: h-14 + Absolute Icon) */}
            <View className="gap-2">
              <Text className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold ml-1">
                Password
              </Text>
              <View className="relative justify-center">
                <TextInput
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor="#3f3f46"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  // Fix: h-14 aur pr-12 (padding right for icon)
                  className="h-14 border border-zinc-800 pl-4 pr-12 text-white text-sm font-medium bg-zinc-900/30 rounded-md w-full"
                  textAlignVertical="center" // Android fix
                />
                <Pressable 
                  className="absolute right-0 h-14 w-12 items-center justify-center" 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={18} 
                    color="#71717a" 
                  />
                </Pressable>
              </View>
            </View>

            <Pressable 
              className="bg-[#00dc82] py-4 items-center justify-center mt-4 rounded-sm" 
              onPress={onSignUp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="black" /> : (
                <Text className="text-black font-bold uppercase tracking-widest text-center">Continue</Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row justify-center gap-2 mt-8">
            <Text className="text-zinc-600 text-xs font-medium">Already have an account?</Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-[#00dc82] text-xs font-bold uppercase tracking-wider">Sign In</Text>
            </Pressable>
          </View>
        </View>
        <AuthError message={error} />
      </SafeAreaView>
    </View>
  );
}