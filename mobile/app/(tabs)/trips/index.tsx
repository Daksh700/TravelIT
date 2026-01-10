import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useRouter } from "expo-router";
import { MapPin, Clock } from "lucide-react-native";

export default function TripsScreen() {
  const { colors } = useThemeColors();
  const { data: trips, isLoading } = useUserItineraries();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Loading trips...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["top"]}
    >
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {(!trips || trips.length === 0) ? (
          <View className="items-center justify-center py-20">
            <Text style={{ color: colors.textMuted }}>Your vault is empty.</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {trips.map((trip: any) => (
              <TouchableOpacity
                key={trip._id}
                onPress={() =>
                  router.push({ pathname: "/(tabs)/trips/view", params: { id: trip._id } })
                }
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="p-4 border rounded-md"
              >
                <Text style={{ color: colors.text }} className="text-xl font-bold">
                  {trip.tripTitle}
                </Text>

                <View className="flex-row items-center gap-2 mt-1">
                  <MapPin size={14} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted }}>{trip.destination}</Text>
                </View>

                <View className="flex-row items-center gap-2 mt-1">
                  <Clock size={14} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted }}>
                    {trip.duration} days
                  </Text>
                </View>

                {/* NEW — STATUS */}
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-xs font-bold mt-2"
                >
                  Status: {trip.status || "draft"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}