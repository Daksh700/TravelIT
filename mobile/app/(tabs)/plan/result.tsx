import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MapPin, Clock, Save } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSaveItinerary } from "@/hooks/useSaveItinerary";

export default function ResultScreen() {
  const { colors } = useThemeColors();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: save, isPending } = useSaveItinerary();

  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    GBP: "£",
  };

  const itinerary = queryClient.getQueryData(["latestItinerary"]) as any;

  if (!itinerary) {
    router.replace("/(tabs)/plan");
    return null;
  }

  const currencySymbol = symbols[itinerary.currency] ?? "";

  const handleSave = () => {
    save({
      source: itinerary.source,
      destination: itinerary.destination,
      sourceMeta: itinerary.sourceMeta,
      duration: itinerary.duration,
      budgetTier: itinerary.budgetTier,
      budget: itinerary.budget,
      currency: itinerary.currency,
      tripTitle: itinerary.tripTitle,
      tripDescription: itinerary.tripDescription,
      tripDetails: itinerary.tripDetails,
      status: "draft",
      interests: itinerary.interests ?? [],
      travelers: itinerary.travelers,
      ageGroup: itinerary.ageGroup,
      safeMode: itinerary.safeMode,
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* ---- HEADER ---- */}
        <View className="flex-row justify-between items-start mb-8">
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text }} className="text-3xl font-bold leading-tight">
              {itinerary.tripTitle}
            </Text>

            <View className="flex-row gap-4 mt-2">
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted }} className="text-sm">
                  {itinerary.destination}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Clock size={14} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted }} className="text-sm">
                  {itinerary.tripDetails.length} days
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            disabled={isPending}
            onPress={handleSave}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: isPending ? 0.5 : 1,
            }}
            className="p-3 border rounded-md"
          >
            {isPending ? (
              <Text style={{ color: colors.text }} className="text-[11px] font-bold">
                Saving...
              </Text>
            ) : (
              <Save size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* ---- META INFO ---- */}
        <View className="mb-6">
          <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
            Travelers: {itinerary.travelers}
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
            Age Group: {itinerary.ageGroup}
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
            Safety Mode: {itinerary.safeMode ? "ON" : "OFF"}
          </Text>
        </View>

        {/* ---- SUMMARY ---- */}
        <View style={{ borderLeftColor: colors.primary }} className="pl-4 border-l mb-10">
          <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed">
            {itinerary.tripDescription}
          </Text>
        </View>

        {/* ---- DAY PLAN ---- */}
        <View className="relative">
          <View
            style={{ backgroundColor: colors.border }}
            className="absolute left-[11px] top-6 bottom-0 w-[1px]"
          />

          {itinerary.tripDetails.map((day: any) => (
            <View key={day.day} className="relative pl-8 mb-10">
              <View
                style={{ backgroundColor: colors.background, borderColor: colors.primary }}
                className="absolute left-0 top-1 w-6 h-6 border rounded-full items-center justify-center"
              >
                <Text style={{ color: colors.primary }} className="text-xs font-bold">
                  {day.day}
                </Text>
              </View>

              <Text style={{ color: colors.text }} className="text-lg font-bold mb-4">
                {day.theme}
              </Text>

              <View className="space-y-3">
                {day.activities.map((act: any, idx: number) => (
                  <Card
                    key={idx}
                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    className="p-4 border"
                  >
                    <View className="flex-row justify-between items-start mb-1">
                      <View style={{ backgroundColor: colors.card }} className="px-2 py-1 rounded-sm">
                        <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">
                          {act.time}
                        </Text>
                      </View>
                    </View>

                    <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                      {act.activity}
                    </Text>

                    <View className="flex-row items-center gap-1 mb-2">
                      <MapPin size={10} color={colors.primary} />
                      <Text style={{ color: colors.primary }} className="text-xs font-bold">
                        {act.location}
                      </Text>
                    </View>

                    <Text style={{ color: colors.textMuted }} className="text-sm">
                      {act.description}
                    </Text>

                    <Text style={{ color: colors.textSecondary }} className="text-xs font-bold mt-2">
                      Est. Cost: {currencySymbol}{act.estimatedCost}
                    </Text>
                  </Card>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ---- NEW TRIP BUTTON ---- */}
        <Button variant="outline" onPress={() => router.replace("/(tabs)/plan")} className="mt-10 mb-10 h-14 py-0">
          <View className="flex-row items-center justify-center gap-2">
            <Text style={{ color: colors.text }} className="font-bold">
              Plan Another Trip
            </Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}