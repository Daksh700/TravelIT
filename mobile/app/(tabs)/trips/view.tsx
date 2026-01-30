import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Pressable, TouchableOpacity, Modal, Image } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { 
  MapPin, Clock, ArrowLeft, Building2, Star, X, 
  Wifi, Wind, Tv, Coffee, Briefcase, Users, User, ShieldCheck 
} from "lucide-react-native";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function ViewTripScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: trips } = useUserItineraries();
  
  const [hotelModalVisible, setHotelModalVisible] = useState(false);

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

  const hotel = trip.hotel;
  const currencySymbol = symbols[trip.currency] ?? "";
  const isDraft = trip.status === 'draft';

  const renderStatusBadge = (act: any) => {
    if (act.verified === false) return <Badge text="Not Found" bg="#fee2e2" color="#dc2626" />;
    if (act.closedToday) return <Badge text="Closed Today" bg="#dbeafe" color="#1d4ed8" />;
    if (act.seasonalWarning) return <Badge text="Seasonal Risk" bg="#fef9c3" color="#ca8a04" />;
    if (act.verified) return <Badge text="Verified" bg="#dcfce7" color="#15803d" />;
    return null;
  };

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

            {/* STATUS BADGE */}
            <View className="mt-4 flex-row">
              <View 
                className="px-3 py-1.5 rounded-full flex-row items-center gap-2 border"
                style={{ 
                  backgroundColor: colors.card, 
                  borderColor: isDraft ? colors.border : '#22c55e',
                }}
              >
                <View 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isDraft ? colors.textMuted : '#22c55e' }}
                />
                <Text 
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: isDraft ? colors.textMuted : '#22c55e' }}
                >
                  {trip.status || "DRAFT"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ---- META INFO (Stat Cards) ---- */}
        <View className="flex-row gap-3 mb-8">
          <MetaCard 
            label="Travelers" 
            value={trip.travelers} 
            icon={<Users size={14} color="#9ca3af" />} 
            colors={colors}
          />
          <MetaCard 
            label="Age Group" 
            value={trip.ageGroup} 
            icon={<User size={14} color="#9ca3af" />} 
            colors={colors}
          />
          <MetaCard 
            label="Safety" 
            value={trip.safeMode ? "On" : "Off"} 
            icon={<ShieldCheck size={14} color={trip.safeMode ? "#22c55e" : "#9ca3af"} />} 
            colors={colors}
          />
        </View>

        {/* ---- SUMMARY ---- */}
        <View style={{ borderLeftColor: colors.primary }} className="pl-4 border-l mb-10">
          <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed">
            {trip.tripDescription}
          </Text>
        </View>

        {/* ---- HOTEL SUMMARY CARD ---- */}
        {hotel && (
          <TouchableOpacity
            onPress={() => setHotelModalVisible(true)}
            className="mb-10 rounded-lg overflow-hidden relative border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            {/* Blue Accent Line */}
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 z-10" />

            <View className="p-5 pl-7">
              <View className="flex-row items-center gap-2 mb-3">
                <Building2 size={16} color="#3b82f6" />
                <Text className="text-[#3b82f6] font-bold text-xs uppercase tracking-wider">
                  Accommodation Logic
                </Text>
              </View>

              <View className="flex-row justify-between items-start">
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ color: colors.text }} className="text-lg font-bold leading-tight mb-1">
                    {hotel.name}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-xs mb-3">
                     {trip.destination} • HOTEL
                  </Text>
                  
                  <View className="flex-row items-center gap-1">
                    <Star size={14} color="#facc15" fill="#facc15" />
                    <Text style={{ color: colors.text }} className="font-bold text-sm">{hotel.rating}/10</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs">({hotel.reviewCount} reviews)</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text style={{ color: colors.text }} className="text-xl font-bold">
                    {currencySymbol}{Math.round(hotel.totalPrice).toLocaleString()}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase text-right">
                    Total for {trip.tripDetails.length} Nights
                  </Text>
                </View>
              </View>
              
              <View style={{ borderTopColor: colors.border }} className="mt-4 pt-3 border-t">
                <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase text-center">
                  ⓘ Tap for Hotel Details & Photos
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

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
                    {/* BADGES */}
                    <View className="flex-row gap-2 mb-2">
                      {renderStatusBadge(act)}
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

      {/* ========================================================= */}
      {/* 🔹 HOTEL DETAILS MODAL (Updated for Light/Dark Mode) */}
      {/* ========================================================= */}
      <Modal visible={hotelModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setHotelModalVisible(false)}>
        {hotel && (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            
            {/* Modal Header */}
            <View style={{ borderColor: colors.border }} className="px-6 py-4 flex-row justify-between items-center border-b">
              <Text style={{ color: colors.text }} className="text-lg font-bold italic">ACCOMMODATION DETAILS</Text>
              <TouchableOpacity onPress={() => setHotelModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
              
              {/* Hotel Title Section */}
              <View className="mb-6">
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-2">{hotel.name}</Text>
                <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase mb-4">
                  {trip.destination} • HOTEL
                </Text>
                
                <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed italic">
                  Experience a comfortable stay at {hotel.name}, offering excellent amenities and easy access to local attractions in {trip.destination}. Rated {hotel.rating}/10 by over {hotel.reviewCount} guests, this is our top pick for your budget and preferences.
                </Text>
              </View>

              {/* Logic & Amenities */}
              <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase tracking-widest mb-4">
                LOGIC & AMENITIES
              </Text>
              
              <View className="flex-row flex-wrap gap-3 mb-8">
                <AmenityItem icon={<Wifi size={14} color="#4ade80" />} label="Free Wi-Fi" colors={colors} />
                <AmenityItem icon={<Clock size={14} color="#4ade80" />} label="24-hour reception" colors={colors} />
                <AmenityItem icon={<Briefcase size={14} color="#4ade80" />} label="Luggage storage" colors={colors} />
                <AmenityItem icon={<Wind size={14} color="#4ade80" />} label="Air conditioning" colors={colors} />
                <AmenityItem icon={<Tv size={14} color="#4ade80" />} label="Flat-screen TV" colors={colors} />
                <AmenityItem icon={<Coffee size={14} color="#4ade80" />} label="Kettle" colors={colors} />
              </View>

              {/* Visual Grounding */}
              <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase tracking-widest mb-4">
                VISUAL GROUNDING
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 mb-24">
                {hotel.photos && hotel.photos.length > 0 ? (
                  hotel.photos.map((photo: string, index: number) => (
                    <View key={index} style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="w-[200px] h-[150px] rounded-md overflow-hidden mr-3 border">
                       <Image 
                          source={{ uri: photo }} 
                          style={{ width: "100%", height: "100%" }} 
                          resizeMode="cover" 
                       />
                    </View>
                  ))
                ) : (
                  <View style={{ backgroundColor: colors.surface }} className="w-full h-32 items-center justify-center rounded-md">
                     <Text style={{ color: colors.textMuted }}>No images available</Text>
                  </View>
                )}
              </ScrollView>
            </ScrollView>

            {/* Footer Valuation */}
            <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="absolute bottom-0 left-0 right-0 border-t p-6 pb-10">
               <View 
                 style={{ 
                   backgroundColor: colors.card, 
                   borderColor: colors.border 
                 }} 
                 className="flex-row justify-between items-center border p-4 rounded-lg"
               >
                  <View>
                     <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase mb-1">Total Valuation</Text>
                     <Text style={{ color: colors.text }} className="text-3xl font-bold">{currencySymbol}{Math.round(hotel.totalPrice).toLocaleString()}</Text>
                  </View>
                  <View style={{ backgroundColor: colors.primary }} className="px-3 py-1 rounded-sm">
                     <Text style={{ color: colors.primaryText }} className="font-bold text-xs uppercase">{trip.tripDetails.length} Nights</Text>
                  </View>
               </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const Badge = ({ text, bg, color }: { text: string; bg: string; color: string }) => (
  <View className="px-2 py-1 rounded-sm" style={{ backgroundColor: bg }}>
    <Text className="text-[10px] font-bold uppercase" style={{ color }}>{text}</Text>
  </View>
);

const MetaCard = ({ label, value, icon, colors }: { label: string; value: string | number; icon: any, colors: any }) => (
  <View 
    className="flex-1 border rounded-md py-3 items-center justify-center"
    style={{ 
        backgroundColor: colors.card, 
        borderColor: colors.border 
    }}
  >
    <View className="flex-row items-center gap-1 mb-1 opacity-70">
      {icon}
      <Text style={{ color: colors.textMuted }} className="text-[10px] uppercase font-bold tracking-wider">{label}</Text>
    </View>
    <Text style={{ color: colors.text }} className="text-base font-bold capitalize">{value}</Text>
  </View>
);

const AmenityItem = ({ icon, label, colors }: { icon: any, label: string, colors: any }) => (
  <View 
    style={{ backgroundColor: colors.card, borderColor: colors.border }}
    className="w-[48%] flex-row items-center gap-2 border p-3 rounded-md"
  >
    {icon}
    <Text style={{ color: colors.text }} className="text-xs font-bold">{label}</Text>
  </View>
);