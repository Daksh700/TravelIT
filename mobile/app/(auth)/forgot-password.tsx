import { AuthError } from "@/components/AuthError";
import { getClerkError } from "@/utils/clerkError";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    useEffect(() => {
        if(isSignedIn) {
            router.replace('../(tabs)');
        }
    }, [isSignedIn, router]);
    
    if (!isLoaded) return null;

    const sendResetCode = async () => {
        setLoading(true);
        setError(undefined);
        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email.trim() // Added trim for safety
            });

            setSuccessfulCreation(true);
        } catch (err: any) {
            setError(getClerkError(err));
        }
        finally {
            setLoading(false);
        }
    }

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
                setError('');
                return;
            }

            if(result.status === "complete") {
                await setActive({session: result.createdSessionId});
                router.replace('../(tabs)');
            }
        } catch (err: any) {
            setError(getClerkError(err));
        }
        finally {
            setLoading(false);
        }
    }
    
    return (
        <View className="flex-1 bg-black">
            <SafeAreaView className="flex-1 px-8">

                {/* --- Top Bar: Back Arrow --- */}
                <View className="h-12 justify-center -ml-2">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
                        <Ionicons name="arrow-back" size={24} color="#71717a" />
                    </Pressable>
                </View>

                {/* --- Main Content --- */}
                <View className="mt-8">

                    {/* Header */}
                    <View className="mb-10 items-center">
                        <Text className="text-white text-3xl font-bold uppercase italic tracking-tight text-center">
                        Forgot{"\n"}Password?
                        </Text>
                        <Text className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-2 text-center">
                        {successfulCreation ? "Enter code & new password" : "Reset your access"}
                        </Text>
                    </View>

                    {/* --- Form Container --- */}
                    <View className="gap-5">

                        {/* ================= STEP 1: SEND EMAIL ================= */}
                        {!successfulCreation && (
                            <>
                                <View className="gap-2">
                                    <Text className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold ml-1">
                                        Email Address
                                    </Text>
                                    <TextInput
                                        style={{ textAlignVertical: 'center' }} // Android Fix
                                        className="h-14 border border-zinc-800 px-4 text-white text-sm font-medium bg-zinc-900/30 rounded-md"
                                        placeholder="Enter email"
                                        placeholderTextColor="#3f3f46"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>

                                <Pressable
                                    onPress={sendResetCode}
                                    disabled={loading}
                                    className="bg-[#00dc82] py-4 items-center justify-center mt-4 rounded-sm"
                                    >
                                    {loading ? <ActivityIndicator color="black" /> : (
                                        <Text className="text-black font-bold uppercase tracking-widest text-center">
                                        Send Reset Code
                                        </Text>
                                    )}
                                </Pressable>
                            </>
                        )}

                        {/* ================= STEP 2: ENTER CODE & NEW PASSWORD ================= */}
                        {successfulCreation && (
                            <>
                                {/* --- 1. RESET CODE (Big UI from SignUp) --- */}
                                <View className="space-y-2 w-full mb-2">
                                    <Text className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold text-center">
                                        Email Verification Code
                                    </Text>
                                    <TextInput
                                        value={code}
                                        placeholder="000000"
                                        placeholderTextColor="#27272a"
                                        keyboardType="numeric"
                                        onChangeText={setCode}
                                        maxLength={6}
                                        // Ye wahi SignUp wala style hai 👇
                                        className="border border-zinc-800 px-4 py-5 text-white text-center text-3xl tracking-[0.5em] font-bold bg-zinc-900/50 rounded-md w-full"
                                    />
                                </View>

                                {/* --- 2. NEW PASSWORD (Standard Input) --- */}
                                <View className="gap-2">
                                    <Text className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold ml-1">
                                        New Password
                                    </Text>
                                    <View className="relative justify-center">
                                        <TextInput
                                            style={{ textAlignVertical: 'center' }}
                                            className="h-14 border border-zinc-800 px-4 pr-12 text-white text-sm font-medium bg-zinc-900/30 rounded-md w-full"
                                            placeholder="Enter new password"
                                            placeholderTextColor="#3f3f46"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
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

                                {/* --- CTA --- */}
                                <Pressable
                                    onPress={resetPassword}
                                    disabled={loading}
                                    className="bg-[#00dc82] py-4 items-center justify-center mt-4 rounded-sm"
                                >
                                    {loading ? <ActivityIndicator color="black" /> : (
                                        <Text className="text-black font-bold uppercase tracking-widest text-center">
                                            Reset Password
                                        </Text>
                                    )}
                                </Pressable>
                            </>
                        )}

                        {/* Error Messages */}
                        {error ? (
                            <Text className="text-red-500 text-sm font-bold text-center mt-2 uppercase tracking-wider">
                                {error}
                            </Text>
                        ) : null}
                        
                        {secondFactor && (
                            <Text className="text-zinc-500 text-sm font-bold text-center mt-2">
                                2FA required, this UI does not handle it yet.
                            </Text>
                        )}

                    </View>
                </View>
            </SafeAreaView>

            {/* --- Footer --- */}
            <View className="pb-8">
                <Text className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.3em] text-center">
                Securely Encrypted // TravelIt v2.5
                </Text>
            </View>

            <AuthError message={error} />
        </View>
    )
}