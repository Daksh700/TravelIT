import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CheckCircle2, Crown, Sparkles, ArrowLeft } from "lucide-react-native";
import { useEffect } from "react";
import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
import { CFDropCheckoutPayment, CFEnvironment, CFSession, CFThemeBuilder } from 'cashfree-pg-api-contract';
import { useThemeColors } from "@/hooks/useThemeColors";
import { Button } from "@/components/Button";
import { usePayment } from "@/hooks/usePayment";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useHaptics } from "@/hooks/useHaptics";

export default function SubscriptionScreen() {
    const { colors } = useThemeColors();
    const { handleImpact } = useHaptics();
    const router = useRouter();
    const { data: dbUser } = useUserProfile();
    const { createOrder, verifyPayment, isProcessing } = usePayment();

    const isPro = dbUser?.isPro;

    useEffect(() => {
        CFPaymentGatewayService.setCallback({
            onVerify: async (orderID: string) => {
                try {
                    await verifyPayment(orderID);
                    Alert.alert("Success! 🎉", "Welcome to TravelIt Pro!");
                    handleImpact("medium");
                    router.back();
                } catch (error: any) {
                    Alert.alert("Verification Failed", error.message || "Please contact support.");
                }
            },
            onError: (error: any, orderID: string) => {
                Alert.alert("Payment Cancelled", error?.message || "Transaction was not completed.");
            }
        });

        return () => {
            CFPaymentGatewayService.removeCallback();
        };
    }, []);

    const handleUpgrade = async () => {
        try {
            handleImpact("medium");
            const orderData = await createOrder();

            const session = new CFSession(
                orderData.payment_session_id, 
                orderData.order_id, 
                CFEnvironment.SANDBOX 
            );

            const theme = new CFThemeBuilder()
                .setNavigationBarBackgroundColor(colors.background)
                .setNavigationBarTextColor(colors.text)
                .setButtonBackgroundColor(colors.primary)
                .setButtonTextColor("#FFFFFF")
                .setPrimaryTextColor(colors.text)
                .setSecondaryTextColor(colors.textMuted)
                .build();

            const dropPayment = new CFDropCheckoutPayment(session, null, theme);

            CFPaymentGatewayService.doPayment(dropPayment);

        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to initiate payment");
        }
    };

    const Feature = ({ text, isProFeature = false }: { text: string, isProFeature?: boolean }) => (
        <View className="flex-row items-center gap-3 mb-3">
            <CheckCircle2 size={20} color={isProFeature ? colors.primary : colors.textMuted} opacity={isProFeature ? 1 : 0.6} />
            <Text style={{ color: isProFeature ? colors.text : colors.textMuted }} className={`text-sm ${isProFeature ? 'font-medium' : ''}`}>
                {text}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
            <View style={{ borderBottomColor: colors.border }} className="flex-row items-center gap-4 px-6 py-4 border-b">
                <TouchableOpacity onPress={() => {
                    handleImpact("soft");
                    router.back()
                }}>
                    <ArrowLeft size={22} color={colors.textMuted} />
                </TouchableOpacity>
                <View>
                    <Text style={{ color: colors.text }} className="text-lg font-bold">Subscription</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs">Upgrade to TravelIt Pro.</Text>
                </View>
            </View>
            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {isPro ? (
                    <View className="items-center mb-8">
                        <Text style={{ color: colors.text }} className="text-3xl font-bold mb-2 text-center">
                            Choose your <Text style={{ color: colors.primary }}>Journey</Text>
                        </Text>
                        <Text style={{ color: colors.textMuted }} className="text-center text-sm px-4">
                            Unlock the full power of AI for your ultimate travel experiences.
                        </Text>
                    </View>
                ) : (
                    <>
                        <View className="items-center mb-8">
                            <Text style={{ color: colors.text }} className="text-3xl font-bold mb-2 text-center">
                                Upgrade to <Text style={{ color: colors.primary }}>Pro</Text>
                            </Text>
                            <Text style={{ color: colors.textMuted }} className="text-center text-sm px-4">
                                Unlock the full power of AI for your ultimate travel experiences.
                            </Text>
                        </View>

                        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="border rounded-2xl p-6 mb-6 relative">
                            <View className="absolute top-4 right-4 bg-neutral-800 px-3 py-1 rounded-full">
                                <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">Current Plan</Text>
                            </View>

                            <Text style={{ color: colors.textMuted }} className="text-xl font-bold mb-1">Free Tier</Text>
                            
                            <View className="flex-row items-baseline mb-6">
                                <Text style={{ color: colors.text }} className="text-3xl font-bold opacity-80">₹0</Text>
                                <Text style={{ color: colors.textMuted }} className="text-xs ml-1 font-bold uppercase">/ forever</Text>
                            </View>

                            <View className="border-t pt-5" style={{ borderColor: colors.border }}>
                                <Feature text="Standard AI Trip Generation" />
                                <Feature text="Save Trips to Vault" />
                                <Feature text="Explore Destinations" />
                                <Feature text="Basic Flight & Hotel Estimates" />
                            </View>
                        </View>

                        <View style={{ backgroundColor: colors.card, borderColor: colors.primary }} className="border-2 rounded-2xl p-6 relative overflow-hidden mb-8 shadow-lg shadow-green-500/10">
                            <View className="absolute top-0 right-0 bg-yellow-500/20 px-4 py-1.5 rounded-bl-xl z-10 flex-row items-center gap-1">
                                <Crown size={12} color="#eab308" />
                                <Text className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest">Lifetime</Text>
                            </View>

                            <Text style={{ color: colors.primary }} className="text-xl font-bold mb-1">TravelIt Pro</Text>

                            <View className="flex-row items-baseline mb-6">
                                <Text style={{ color: colors.text }} className="text-4xl font-bold">₹499</Text>
                                <Text style={{ color: colors.textMuted }} className="text-xs ml-2 font-bold uppercase">/ one-time</Text>
                            </View>

                            <View className="mb-6 border-t pt-5" style={{ borderColor: colors.border }}>
                                <Text style={{ color: colors.text }} className="text-xs font-bold uppercase tracking-widest mb-4">Everything in Free, plus:</Text>
                                <Feature text="Unlimited AI Generations" isProFeature />
                                <Feature text="Export Trips to PDF" isProFeature />
                                <Feature text="Group Sync (Trip Tinder)" isProFeature />
                                <Feature text="Smart Route Optimization" isProFeature />
                                <Feature text="AI Real-Time Edits (Weather/Delay)" isProFeature />
                            </View>

                            {isProcessing ? (
                                <View className="py-4 items-center justify-center rounded-xl bg-neutral-800">
                                    <ActivityIndicator color={colors.primary} />
                                </View>
                            ) : (
                                <Button title="Upgrade Now" onPress={handleUpgrade} className="w-full h-14 rounded-xl flex-row justify-center gap-2">
                                    <Sparkles size={18} color="#000" fill="#000" />
                                    <Text className="text-black font-bold text-base ml-2 uppercase tracking-wide">Pay ₹499</Text>
                                </Button>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}