import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MapPin, Clock, ArrowLeft } from "lucide-react-native";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ViewTripScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: trips } = useUserItineraries();

  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    GBP: "£",
  };

  const trip = trips?.find((t: any) => t._id === id);

  if (!trip) {
    router.replace("/(tabs)/trips");
    return null;
  }

  const currencySymbol = symbols[trip.currency] ?? "";

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
      {/* Header */}
      <View
        style={{ borderBottomColor: colors.border }}
        className="flex-row items-center gap-4 px-6 py-4 border-b"
      >
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textMuted} />
        </Pressable>

        <View>
          <Text style={{ color: colors.text }} className="text-lg font-bold">
            My Vault
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-xs">
            Archived journeys & memories.
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* ---- HEADER ---- */}
        <View className="flex-row justify-between items-start mb-8">
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text }} className="text-3xl font-bold leading-tight">
              {trip.tripTitle}
            </Text>

            <View className="flex-row gap-4 mt-2">
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted }} className="text-sm">
                  {trip.destination}
                </Text>
              </View>

              <View className="flex-row items-center gap-1">
                <Clock size={14} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted }} className="text-sm">
                  {trip.tripDetails.length} days
                </Text>
              </View>
            </View>

            {/* STATUS */}
            <Text style={{ color: colors.textSecondary }} className="text-xs font-bold mt-2">
              Status: {trip.status || "draft"}
            </Text>

            {/* NEW — EXTRA META */}
            <View className="mt-2 space-y-1">
              <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
                Travelers: {trip.travelers}
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
                Age Group: {trip.ageGroup}
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
                Safety Mode: {trip.safeMode ? "ON" : "OFF"}
              </Text>
            </View>
          </View>
        </View>

        {/* ---- SUMMARY ---- */}
        <View style={{ borderLeftColor: colors.primary }} className="pl-4 border-l mb-10">
          <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed">
            {trip.tripDescription}
          </Text>
        </View>

        {/* ---- DAYS ---- */}
        <View className="relative">
          <View
            style={{ backgroundColor: colors.border }}
            className="absolute left-[11px] top-6 bottom-0 w-[1px]"
          />

          {trip.tripDetails.map((day: any) => (
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
                    <View style={{ backgroundColor: colors.card }} className="px-2 py-1 rounded-sm mb-2">
                      <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">
                        {act.time}
                      </Text>
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

        {/* ---- BACK ---- */}
        <Button
          variant="outline"
          onPress={() => router.replace("/(tabs)/trips")}
          className="mt-10 mb-10 h-14 py-0"
        >
          <View className="flex-row items-center justify-center gap-2">
            <Text style={{ color: colors.text }} className="font-bold">
              Back to Vault
            </Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}