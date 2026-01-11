import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity, Modal } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useUpdateTripStatus } from "@/hooks/useUpdateTripStatus";
import { useRouter } from "expo-router";
import { ChevronDown, X } from "lucide-react-native"; 
import { useState } from "react";

export default function TripsScreen() {
  const { colors } = useThemeColors();
  const { data: trips, isLoading } = useUserItineraries();
  const { mutate: updateStatus } = useUpdateTripStatus();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTrip, setActiveTrip] = useState<any>(null);

  // Helper to get status details for the modal
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "draft":
        return { label: "Draft", sub: "PLANNING PHASE", color: "#52525b" }; // Zinc-600
      case "active":
        return { label: "Active", sub: "CURRENTLY EN ROUTE", color: "#22c55e" }; // Green-500
      case "completed":
        return { label: "Completed", sub: "SUCCESSFULLY CONCLUDED", color: "#3b82f6" }; // Blue-500
      default:
        return { label: status, sub: "", color: "#52525b" };
    }
  };

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
        <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight mb-1">
          My Vault
        </Text>
        <Text style={{ color: colors.textMuted }} className="text-sm mb-8">
          Archived journeys & memories.
        </Text>

        {(!trips || trips.length === 0) ? (
          <View className="items-center justify-center py-20">
            <Text style={{ color: colors.textMuted }}>Your vault is empty.</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-6 pb-20">
            {trips.map((trip: any) => (
              <View
                key={trip._id}
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-5 border rounded-xl"
              >
                {/* STATUS BUTTON (Top Left) */}
                <TouchableOpacity
                  onPress={() => {
                    setActiveTrip(trip);
                    setModalVisible(true);
                  }}
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                  className="self-start px-3 py-1.5 border rounded-md flex-row items-center gap-1 mb-4"
                >
                  <Text style={{ color: getStatusDetails(trip.status).color, fontSize: 11, fontWeight: "800", textTransform: 'uppercase' }}>
                    {trip.status}
                  </Text>
                  <ChevronDown size={12} color={colors.textMuted} />
                </TouchableOpacity>

                {/* MAIN CARD CONTENT */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({ pathname: "/(tabs)/trips/view", params: { id: trip._id } })
                  }
                >
                  {/* Title */}
                  <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1 leading-tight">
                    {trip.tripTitle}
                  </Text>

                  {/* Subtitle / Description */}
                  <Text style={{ color: colors.textSecondary }} className="italic text-sm mb-6">
                    {trip.tripDescription.length > 80
                      ? trip.tripDescription.slice(0, 80) + "..."
                      : trip.tripDescription}
                  </Text>

                  {/* TAGS ROW (Boxy look like Image 1) */}
                  <View className="flex-row items-center gap-3">
                    {/* Duration Badge */}
                    <View 
                      style={{ backgroundColor: colors.card }} 
                      className="px-3 py-2 rounded-md"
                    >
                      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                        {trip.duration} DAYS
                      </Text>
                    </View>

                    {/* Location Badge */}
                    <View 
                        style={{ backgroundColor: colors.card }} 
                        className="px-3 py-2 rounded-md"
                    >
                         <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                            {trip.destination}
                        </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          <View
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            className="w-full p-6 rounded-2xl border"
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-xl font-bold">
                Update Status
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Lifecycle Options */}
            {["draft", "active", "completed"].map((statusKey) => {
              const details = getStatusDetails(statusKey);
              const isSelected = activeTrip?.status === statusKey;

              return (
                <TouchableOpacity
                  key={statusKey}
                  onPress={() => {
                    if (activeTrip) {
                        updateStatus({ id: activeTrip._id, status: statusKey });
                        setModalVisible(false); 
                    }
                  }}
                  style={{ 
                    backgroundColor: colors.card, 
                    borderColor: isSelected ? colors.text : colors.border 
                  }}
                  className="p-4 mb-3 border rounded-lg flex-row justify-between items-center"
                >
                  <View>
                    <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                      {details.label}
                    </Text>
                    <Text style={{ color: colors.textMuted }} className="text-[10px] uppercase tracking-wider font-semibold">
                      {details.sub}
                    </Text>
                  </View>

                  {/* Status Dot */}
                  <View 
                    style={{ backgroundColor: isSelected ? details.color : colors.border }} 
                    className="w-2 h-2 rounded-full"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}