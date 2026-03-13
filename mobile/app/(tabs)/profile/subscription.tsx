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

    const Feature = ({ text }: { text: string }) => (
        <View className="flex-row items-center gap-3 mb-3">
            <CheckCircle2 size={20} color={colors.primary} />
            <Text style={{ color: colors.text }} className="text-sm font-medium">{text}</Text>
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
                    <View style={{ backgroundColor: colors.surface, borderColor: colors.primary }} className="p-6 rounded-2xl border mb-6 items-center">
                        <Crown size={48} color={colors.primary} className="mb-4" />
                        <Text style={{ color: colors.text }} className="text-2xl font-bold mb-2">You are a Pro!</Text>
                        <Text style={{ color: colors.textMuted }} className="text-center text-sm">
                            Thank you for supporting TravelIt. You have lifetime access to all premium features.
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

                        <View style={{ backgroundColor: colors.card, borderColor: colors.border }} className="border rounded-2xl p-6 relative overflow-hidden mb-8">
                            <View className="absolute top-0 right-0 bg-yellow-500/20 px-4 py-1.5 rounded-bl-xl z-10">
                                <Text className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest">Lifetime</Text>
                            </View>

                            <View className="flex-row items-baseline mb-6">
                                <Text style={{ color: colors.text }} className="text-4xl font-bold">₹499</Text>
                                <Text style={{ color: colors.textMuted }} className="text-sm ml-2 font-bold uppercase">/ one-time</Text>
                            </View>

                            <View className="mb-6 border-t pt-6" style={{ borderColor: colors.border }}>
                                <Feature text="Unlimited AI Itinerary Generations" />
                                <Feature text="Advanced Route Optimization" />
                                <Feature text="Export Trips to PDF" />
                                <Feature text="Trip Tinder (Group Planning)" />
                                <Feature text="No Ads, Faster Response" />
                            </View>

                            {isProcessing ? (
                                <View className="py-4 items-center justify-center rounded-xl bg-neutral-800">
                                    <ActivityIndicator color={colors.primary} />
                                </View>
                            ) : (
                                <Button title="Upgrade Now" onPress={handleUpgrade} className="w-full h-14 rounded-xl flex-row justify-center gap-2">
                                    <Sparkles size={18} color="#fff" />
                                    <Text className="text-white font-bold text-base ml-2">Pay ₹499</Text>
                                </Button>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}