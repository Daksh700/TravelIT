import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity, Modal, ActivityIndicator, Image, RefreshControl } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useUpdateTripStatus } from "@/hooks/useUpdateTripStatus";
import { useDeleteTrip } from "@/hooks/useDeleteTrip";
import { useUploadTripPhoto } from "@/hooks/useModifyItinerary";
import { useRouter } from "expo-router";
import { ChevronDown, X, Trash2, ImagePlus, Users } from "lucide-react-native"; 
import { useState } from "react";
import * as ImagePicker from "expo-image-picker"

export default function TripsScreen() {
  const { colors } = useThemeColors();
  const { data: trips, isLoading, refetch } = useUserItineraries();
  const { mutate: updateStatus } = useUpdateTripStatus();
  const { mutate: deleteTrip } = useDeleteTrip();
  const { mutate: uploadPhoto } = useUploadTripPhoto();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [uploadingTripId, setUploadingTripId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "draft":
        return { label: "Draft", sub: "PLANNING PHASE", color: "#52525b" };
      case "active":
        return { label: "Active", sub: "CURRENTLY EN ROUTE", color: "#22c55e" };
      case "completed":
        return { label: "Completed", sub: "SUCCESSFULLY CONCLUDED", color: "#3b82f6" };
      default:
        return { label: status, sub: "", color: "#52525b" };
    }
  };

  const handleAddPhoto = async (tripId: string) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("We need camera roll permissions to add your memories!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7, 
    });

    if (!result.canceled && result.assets[0].uri) {
      setUploadingTripId(tripId);
      
      uploadPhoto(
        { itineraryId: tripId, asset: result.assets[0] },
        {
          onSettled: () => {
            setUploadingTripId(null);
          }
        }
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); 
    setRefreshing(false);
  };

  const filteredTrips = trips?.filter((trip: any) => {
    if (filter === "all") return true;
    return trip.status === filter;
  }) || [];

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
        
        <Text style={{ color: colors.textMuted }} className="text-sm mt-4">
          Loading trips…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
        }>
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight mb-1">
              My Vault
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-sm mb-8">
              Archived journeys & memories.
            </Text>
          </View>

            <TouchableOpacity 
                onPress={() => router.push("/(tabs)/trips/tinder")}
                style={{ backgroundColor: colors.surface, borderColor: colors.primary }}
                className="px-3 py-2 rounded-lg border border-dashed flex-row items-center gap-2"
            >
                <Users size={14} color={colors.primary} />
                <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-widest">Join Sync</Text>
            </TouchableOpacity>
        </View>

        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {["all", "active", "draft", "completed"].map((f) => {
              const isSelected = filter === f;
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  style={{
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                  className="px-4 py-2 rounded-full border mr-2"
                >
                  <Text
                    style={{
                      color: isSelected ? "#fff" : colors.text,
                      textTransform: "capitalize",
                      fontWeight: isSelected ? "bold" : "600",
                      fontSize: 13
                    }}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {(!filteredTrips || filteredTrips.length === 0) ? (
          <View className="items-center justify-center py-20">
            <Text style={{ color: colors.textMuted }}>
              {filter === "all" ? "Your vault is empty." : `No ${filter} trips found.`}
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-6 pb-20">
            {filteredTrips.map((trip: any) => (
              <View
                key={trip._id}
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-5 border rounded-xl"
              >
                
                <View className="flex-row justify-between items-start mb-4">

                  <TouchableOpacity
                    onPress={() => {
                      setActiveTrip(trip);
                      setModalVisible(true);
                    }}
                    style={{ backgroundColor: colors.card, borderColor: colors.border }}
                    className="px-3 py-1.5 border rounded-md flex-row items-center gap-1"
                  >
                    <Text style={{ color: getStatusDetails(trip.status).color, fontSize: 11, fontWeight: "800", textTransform: 'uppercase' }}>
                      {trip.status}
                    </Text>
                    <ChevronDown size={12} color={colors.textMuted} />
                  </TouchableOpacity>

                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity 
                      onPress={() => handleAddPhoto(trip._id)} 
                      disabled={uploadingTripId === trip._id}
                    >
                      {uploadingTripId === trip._id ? (
                        <ActivityIndicator size="small" color={colors.text} />
                      ) : (
                        <ImagePlus size={20} color={colors.textMuted} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setActiveTrip(trip);
                        setShowDelete(true);
                      }}
                    >
                      <Trash2 size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: "/(tabs)/trips/view", params: { id: trip._id } })}
                >
                  <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1 leading-tight">
                    {trip.tripTitle}
                  </Text>

                  <Text style={{ color: colors.textSecondary }} className="italic text-sm mb-6">
                    {trip.tripDescription.length > 80
                      ? trip.tripDescription.slice(0, 80) + "..."
                      : trip.tripDescription}
                  </Text>

                  <View className="flex-row items-center gap-3">
                    <View style={{ backgroundColor: colors.card }} className="px-3 py-2 rounded-md">
                      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                        {trip.duration} DAYS
                      </Text>
                    </View>

                    <View style={{ backgroundColor: colors.card }} className="px-3 py-2 rounded-md">
                      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                        {trip.destination}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {trip.userPhotos && trip.userPhotos.length > 0 && (
                    <View className="mt-6">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {trip.userPhotos.map((photoUrl: string, index: number) => (
                          <TouchableOpacity 
                            key={index} 
                            onPress={() => setSelectedPhoto(photoUrl)} 
                            style={{ borderColor: colors.border, backgroundColor: colors.card }} 
                            className="w-16 h-16 rounded-lg overflow-hidden border mr-3"
                          >
                            <Image
                              source={{ uri: photoUrl }} 
                              style={{ width: '100%', height: '100%' }} 
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="w-full p-6 rounded-2xl border">
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-xl font-bold">Update Status</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

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
                  style={{ backgroundColor: colors.card, borderColor: isSelected ? colors.text : colors.border }}
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

                  <View style={{ backgroundColor: isSelected ? details.color : colors.border }} className="w-2 h-2 rounded-full" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal visible={showDelete} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="w-full p-6 rounded-2xl border">
            <Text style={{ color: colors.text }} className="text-xl font-bold mb-4">
              Delete Trip?
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-sm mb-6">
              This action cannot be undone.
            </Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowDelete(false)}
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                className="flex-1 py-3 border rounded-lg"
              >
                <Text style={{ color: colors.text, textAlign: "center" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (activeTrip) {
                    deleteTrip({ id: activeTrip._id });
                    setShowDelete(false);
                  }
                }}
                style={{ backgroundColor: "#ef4444" }}
                className="flex-1 py-3 rounded-lg"
              >
                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal 
        visible={!!selectedPhoto} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
          
          <TouchableOpacity 
            onPress={() => setSelectedPhoto(null)} 
            style={{ position: 'absolute', top: 50, right: 20, zIndex: 50, padding: 10 }}
          >
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 6 }}>
              <X size={24} color="#fff" />
            </View>
          </TouchableOpacity>

          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto }}
              style={{ width: '100%', height: '80%' }}
              resizeMode="contain" 
            />
          )}
          
        </View>
      </Modal>
    </SafeAreaView>
  );
}