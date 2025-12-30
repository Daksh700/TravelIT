import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, Pressable, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getClerkError } from "@/utils/clerkError";
import { AuthError } from "@/components/AuthError";

export default function EmailSignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const onSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(undefined);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('../(tabs)');
      } else {
        alert("Login Failed"); // Error handling simplified for UI demo
      }
    } catch (err: any) {
      setError(getClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1 px-8">
        
        {/* Top Bar: Back Arrow */}
        <View className="h-12 justify-center -ml-2">
           <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
             <Ionicons name="arrow-back" size={24} color="#71717a" />
           </Pressable>
        </View>

        {/* Main Content */}
        <View className="mt-8">
          
          {/* Header - Centered */}
          <View className="mb-10 items-center">
            <Text className="text-white text-3xl font-bold uppercase italic tracking-tight text-center">
              Welcome Back
            </Text>
            <Text className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-2 text-center">
              Access your itinerary
            </Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {/* Email - FIXED HEIGHT (h-14) */}
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
                // Fix: h-14 instead of py-4
                className="h-14 border border-zinc-800 px-4 text-white text-sm font-medium bg-zinc-900/30 rounded-md"
                textAlignVertical="center" // Critical for Android alignment
              />
            </View>

            {/* Password - FIXED HEIGHT (h-14) */}
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
                  // Fix: h-14 aur padding right for icon
                  className="h-14 border border-zinc-800 px-4 pr-12 text-white text-sm font-medium bg-zinc-900/30 rounded-md w-full"
                  textAlignVertical="center"
                />
                
                {/* Icon Fixed Height to match input */}
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

            {/* Forgot Password Link */}
            <View className="items-end -mt-1">
              <Pressable onPress={() => router.replace("/(auth)/forgot-password")}>
                <Text className="text-[10px] text-[#00dc82] font-bold uppercase tracking-widest">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* CTA */}
            <Pressable
              onPress={onSignIn}
              disabled={loading}
              className="bg-[#00dc82] py-4 items-center justify-center mt-4 rounded-sm"
            >
              {loading ? <ActivityIndicator color="black" /> : (
                <Text className="text-black font-bold uppercase tracking-widest text-center">
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