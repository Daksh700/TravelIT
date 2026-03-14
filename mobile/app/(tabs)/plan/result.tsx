import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  MapPin,
  Clock,
  Save,
  Building2,
  Star,
  X,
  Wifi,
  Wind,
  Tv,
  Coffee,
  Briefcase,
  User,
  Users,
  ShieldCheck,
  Plane,
  Sparkles,
  Wallet
} from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSaveItinerary } from "@/hooks/useSaveItinerary";
import { useState } from "react";
import { useOptimizeRoute } from "@/hooks/useModifyItinerary";
import { useHaptics } from "@/hooks/useHaptics";

export default function ResultScreen() {
  const { colors } = useThemeColors();
  const { handleImpact } = useHaptics();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: save, isPending } = useSaveItinerary();
  const { mutateAsync: optimizeRoute } = useOptimizeRoute();

  const [hotelModalVisible, setHotelModalVisible] = useState(false);
  const [optimizingDay, setOptimizingDay] = useState<number | null>(null);

  const isBusy = isPending || optimizingDay !== null;

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

  const hotel = itinerary.hotel;
  const flight = itinerary.flight;
  const currencySymbol = symbols[itinerary.currency] ?? itinerary.currency;

  const accommodationCost = hotel ? Math.round(hotel.totalPrice) : 0;
  const travelCost = flight ? Math.round(flight.price) : 0;

  let activitiesCost = 0;
  if (itinerary.tripDetails && Array.isArray(itinerary.tripDetails)) {
    itinerary.tripDetails.forEach((day: any) => {
      if (day.activities && Array.isArray(day.activities)) {
        day.activities.forEach((act: any) => {
           const costStr = String(act.estimatedCost || '0').replace(/[^0-9.]/g, '');
           const parsed = parseInt(costStr, 10);
           if(!isNaN(parsed)) {
             activitiesCost += parsed;
           }
        });
      }
    });
  }

  const totalCost = accommodationCost + travelCost + activitiesCost;

  const handleSave = () => {
    save({
      source: itinerary.source,
      destination: itinerary.destination,
      sourceMeta: itinerary.sourceMeta,
      duration: itinerary.duration,
      tripStartDate: itinerary.tripStartDate,
      tripEndDate: itinerary.tripEndDate,
      budgetTier: itinerary.budgetTier,
      budget: itinerary.budget,
      currency: itinerary.currency,
      tripTitle: itinerary.tripTitle,
      tripDescription: itinerary.tripDescription,
      tripDetails: itinerary.tripDetails,
      hotel: itinerary.hotel,
      flight: itinerary.flight,
      status: "draft",
      interests: itinerary.interests ?? [],
      travelers: itinerary.travelers,
      ageGroup: itinerary.ageGroup,
      safeMode: itinerary.safeMode,
      estimatedCosts: {
          accommodation: accommodationCost,
          flight: travelCost,
          activities: activitiesCost,
          total: totalCost
      }
    });
  };

  const handleOptimizeDay = async (dayIndex: number, activities: any[]) => {
    try {
      setOptimizingDay(dayIndex);

      const result = await optimizeRoute({
        activities,
        dayStartTime: "09:00 AM",
      });

      if (result && result.optimizedOrder) {
        queryClient.setQueryData(["latestItinerary"], (oldData: any) => {
          if (!oldData) return oldData;
          const updatedDetails = [...oldData.tripDetails];
          updatedDetails[dayIndex].activities = result.optimizedOrder;
          return { ...oldData, tripDetails: updatedDetails };
        });
      }
    } catch (error: any) {
      console.error("Failed to optimize UI:", error);
      Alert.alert(
        "Optimization Failed 🚦", 
        error?.message || "We couldn't calculate a perfect route for this day. The locations might be too far apart or the time schedule is too tight."
      );
    } finally {
      setOptimizingDay(null);
    }
  };

  const renderStatusBadge = (act: any) => {
    if (act.verified === false)
      return <Badge text="Not Found" bg="#fee2e2" color="#dc2626" />;
    if (act.closedToday)
      return <Badge text="Closed Today" bg="#dbeafe" color="#1d4ed8" />;
    if (act.seasonalWarning)
      return <Badge text="Seasonal Risk" bg="#fef9c3" color="#ca8a04" />;
    if (act.verified)
      return <Badge text="Verified" bg="#dcfce7" color="#15803d" />;
    return null;
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["top"]}
    >
      <Header />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row justify-between items-start mb-8">
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.text }}
              className="text-3xl font-bold leading-tight"
            >
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
            disabled={isBusy}
            onPress={() => {
              handleImpact("medium");
              handleSave()
            }}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: isBusy ? 0.5 : 1,
            }}
            className="p-3 border rounded-md"
          >
            {isPending ? (
              <Text
                style={{ color: colors.text }}
                className="text-[11px] font-bold"
              >
                Saving...
              </Text>
            ) : (
              <Save size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3 mb-8">
          <MetaCard
            label="Travelers"
            value={itinerary.travelers}
            icon={<Users size={14} color="#9ca3af" />}
            colors={colors}
          />
          <MetaCard
            label="Age Group"
            value={itinerary.ageGroup}
            icon={<User size={14} color="#9ca3af" />}
            colors={colors}
          />
          <MetaCard
            label="Safety"
            value={itinerary.safeMode ? "On" : "Off"}
            icon={
              <ShieldCheck
                size={14}
                color={itinerary.safeMode ? "#22c55e" : "#9ca3af"}
              />
            }
            colors={colors}
          />
        </View>

        <View
          style={{ borderLeftColor: colors.primary }}
          className="pl-4 border-l mb-10"
        >
          <Text
            style={{ color: colors.textMuted }}
            className="text-sm leading-relaxed"
          >
            {itinerary.tripDescription}
          </Text>
        </View>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="p-6 rounded-2xl border mb-10 shadow-sm">
            <View className="flex-row items-center gap-2 mb-5">
                <Wallet size={20} color={colors.text} />
                <Text style={{ color: colors.text }} className="text-lg font-bold">Estimated Cost Breakdown</Text>
            </View>
            
            <View className="gap-4">
                <View className="flex-row justify-between items-center">
                    <Text style={{ color: colors.textMuted }} className="font-bold text-[10px] uppercase tracking-widest">Total Cost</Text>
                    <Text style={{ color: colors.primary }} className="font-black text-2xl">{currencySymbol}{totalCost.toLocaleString()}</Text>
                </View>
                
                <View style={{ backgroundColor: colors.border }} className="h-[1px] w-full my-1" />
                
                <View className="flex-row justify-between items-center">
                    <Text style={{ color: colors.textMuted }} className="text-sm font-medium">Accommodation</Text>
                    <Text style={{ color: colors.text }} className="font-bold text-sm">{currencySymbol}{accommodationCost.toLocaleString()}</Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                    <Text style={{ color: colors.textMuted }} className="text-sm font-medium">Travel Cost</Text>
                    <Text style={{ color: colors.text }} className="font-bold text-sm">{currencySymbol}{travelCost.toLocaleString()}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <Text style={{ color: colors.textMuted }} className="text-sm font-medium">Activities</Text>
                    <Text style={{ color: colors.text }} className="font-bold text-sm">{currencySymbol}{activitiesCost.toLocaleString()}</Text>
                </View>
            </View>
        </View>

        {flight && (
          <View
            className="mb-6 rounded-lg overflow-hidden relative border"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#262626" }}
          >
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4ade80] z-10" />

            <View className="p-5 pl-7">
              <View className="flex-row items-center gap-2 mb-6">
                <Plane size={16} color="#4ade80" />
                <Text className="text-[#4ade80] font-bold text-xs uppercase tracking-wider">
                  Round Trip Recommendation
                </Text>
              </View>

              <View className="mb-6">
                <Text className="text-neutral-500 text-[10px] font-bold uppercase mb-1">
                  OUTBOUND
                </Text>
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-white text-lg font-bold">
                      {flight.airline}
                    </Text>
                    <Text className="text-neutral-400 text-xs font-bold uppercase mt-0.5">
                      {itinerary.source.toUpperCase()} →{" "}
                      {itinerary.destination.toUpperCase()} • ECONOMY
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white text-xl font-bold">
                      {currencySymbol}
                      {flight.price.toLocaleString()}
                    </Text>
                    <Text className="text-neutral-500 text-[10px] font-bold">
                      {flight.duration}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="h-[1px] bg-neutral-800 mb-6" />

              <View>
                <Text className="text-neutral-500 text-[10px] font-bold uppercase mb-1">
                  RETURN
                </Text>
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-white text-lg font-bold">
                      {flight.airline}
                    </Text>
                    <Text className="text-neutral-400 text-xs font-bold uppercase mt-0.5">
                      {itinerary.destination.toUpperCase()} →{" "}
                      {itinerary.source.toUpperCase()} • ECONOMY
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-white text-xl font-bold">
                      {currencySymbol}
                      {flight.price.toLocaleString()}
                    </Text>
                    <Text className="text-neutral-500 text-[10px] font-bold">
                      {flight.duration}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {hotel && (
          <TouchableOpacity
            onPress={() => {
              handleImpact("medium");
              setHotelModalVisible(true)
            }}
            className="mb-10 rounded-lg overflow-hidden relative border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
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
                  <Text
                    style={{ color: colors.text }}
                    className="text-lg font-bold leading-tight mb-1"
                  >
                    {hotel.name}
                  </Text>
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-xs mb-3"
                  >
                    {itinerary.destination} • HOTEL
                  </Text>

                  <View className="flex-row items-center gap-1">
                    <Star size={14} color="#facc15" fill="#facc15" />
                    <Text
                      style={{ color: colors.text }}
                      className="font-bold text-sm"
                    >
                      {hotel.rating}/10
                    </Text>
                    <Text
                      style={{ color: colors.textMuted }}
                      className="text-xs"
                    >
                      ({hotel.reviewCount} reviews)
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text
                    style={{ color: colors.text }}
                    className="text-xl font-bold"
                  >
                    {currencySymbol}
                    {Math.round(hotel.totalPrice).toLocaleString()}
                  </Text>
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-[10px] font-bold uppercase text-right"
                  >
                    Total for {itinerary.tripDetails.length} Nights
                  </Text>
                </View>
              </View>

              <View
                style={{ borderTopColor: colors.border }}
                className="mt-4 pt-3 border-t"
              >
                <Text
                  style={{ color: colors.textMuted }}
                  className="text-[10px] font-bold uppercase text-center"
                >
                  ⓘ Tap for Hotel Details & Photos
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View className="relative">
          <View
            style={{ backgroundColor: colors.border }}
            className="absolute left-[11px] top-6 bottom-0 w-[1px]"
          />

          {itinerary.tripDetails.map((day: any, dayIndex: number) => {
            const isOptimizingThisDay = optimizingDay === dayIndex;

            return (
              <View key={day.day} className="relative pl-8 mb-10">
                <View
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                  }}
                  className="absolute left-0 top-1 w-6 h-6 border rounded-full items-center justify-center z-10"
                >
                  <Text
                    style={{ color: colors.primary }}
                    className="text-xs font-bold"
                  >
                    {day.day}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                  <Text
                    style={{ color: colors.text, flex: 1 }}
                    className="text-lg font-bold pr-4"
                  >
                    {day.theme}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      handleImpact("medium");
                      handleOptimizeDay(dayIndex, day.activities)
                    }}
                    disabled={isBusy}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: isOptimizingThisDay
                        ? colors.border
                        : colors.primary,
                        opacity: (isBusy && !isOptimizingThisDay) ? 0.5 : 1
                    }}
                    className="flex-row items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border"
                  >
                    {isOptimizingThisDay ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Sparkles size={12} color={colors.primary} />
                    )}
                    <Text
                      style={{
                        color: isOptimizingThisDay
                          ? colors.textMuted
                          : colors.primary,
                      }}
                      className="text-xs font-bold uppercase tracking-wider"
                    >
                      {isOptimizingThisDay ? "Thinking..." : "Optimize"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="space-y-3">
                  {day.activities.map((act: any, idx: number) => {
                    const locationString =
                      typeof act.location === "string"
                        ? act.location
                        : act.formattedAddress || "Unknown Location";

                    return (
                      <Card
                        key={idx}
                        style={{
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        }}
                        className="p-4 border"
                      >
                        <View className="flex-row justify-between items-start mb-2">
                          <View className="flex-row gap-2 flex-wrap flex-1 pr-2">
                            {renderStatusBadge(act)}
                            {act.waitingTime > 0 && (
                              <Badge
                                text={`Wait: ${act.waitingTime}m`}
                                bg="#fef9c3"
                                color="#ca8a04"
                              />
                            )}
                          </View>

                          <View className="bg-neutral-800/50 px-2 py-1 rounded">
                            <Text
                              style={{ color: colors.primary }}
                              className="text-xs font-bold tracking-widest"
                            >
                              {act.time}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={{ color: colors.text }}
                          className="font-bold text-base mb-1"
                        >
                          {act.activity}
                        </Text>

                        <View className="flex-row items-center gap-1 mb-2">
                          <MapPin size={10} color={colors.primary} />
                          <Text
                            style={{ color: colors.primary }}
                            className="text-xs font-bold"
                          >
                            {locationString}
                          </Text>
                        </View>

                        <Text
                          style={{ color: colors.textMuted }}
                          className="text-sm"
                        >
                          {act.description}
                        </Text>
                        <Text
                          style={{ color: colors.textSecondary }}
                          className="text-xs font-bold mt-2"
                        >
                          Est. Cost: {currencySymbol}
                          {act.estimatedCost}
                        </Text>
                      </Card>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <Button
          variant="outline"
          onPress={() => router.replace("/(tabs)/plan")}
          className="mt-10 mb-10 h-14 py-0"
        >
          <View className="flex-row items-center justify-center gap-2">
            <Text style={{ color: colors.text }} className="font-bold">
              Plan Another Trip
            </Text>
          </View>
        </Button>
      </ScrollView>

      <Modal
        visible={hotelModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setHotelModalVisible(false)}
      >
        {hotel && (
          <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
            <View
              style={{ borderColor: colors.border }}
              className="px-6 py-4 flex-row justify-between items-center border-b"
            >
              <Text
                style={{ color: colors.text }}
                className="text-lg font-bold italic"
              >
                ACCOMMODATION DETAILS
              </Text>
              <TouchableOpacity onPress={() => {
                handleImpact("soft");
                setHotelModalVisible(false)
              }}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
              <View className="mb-6">
                <Text
                  style={{ color: colors.text }}
                  className="text-2xl font-bold mb-2"
                >
                  {hotel.name}
                </Text>
                <Text
                  style={{ color: colors.textMuted }}
                  className="text-xs font-bold uppercase mb-4"
                >
                  {itinerary.destination} • HOTEL
                </Text>

                <Text
                  style={{ color: colors.textMuted }}
                  className="text-sm leading-relaxed italic"
                >
                  Experience a comfortable stay at {hotel.name}, offering
                  excellent amenities and easy access to local attractions in{" "}
                  {itinerary.destination}. Rated {hotel.rating}/10 by over{" "}
                  {hotel.reviewCount} guests, this is our top pick for your
                  budget and preferences.
                </Text>
              </View>

              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-widest mb-4"
              >
                LOGIC & AMENITIES
              </Text>

              <View className="flex-row flex-wrap gap-3 mb-8">
                <AmenityItem
                  icon={<Wifi size={14} color="#4ade80" />}
                  label="Free Wi-Fi"
                  colors={colors}
                />
                <AmenityItem
                  icon={<Clock size={14} color="#4ade80" />}
                  label="24-hour reception"
                  colors={colors}
                />
                <AmenityItem
                  icon={<Briefcase size={14} color="#4ade80" />}
                  label="Luggage storage"
                  colors={colors}
                />
                <AmenityItem
                  icon={<Wind size={14} color="#4ade80" />}
                  label="Air conditioning"
                  colors={colors}
                />
                <AmenityItem
                  icon={<Tv size={14} color="#4ade80" />}
                  label="Flat-screen TV"
                  colors={colors}
                />
                <AmenityItem
                  icon={<Coffee size={14} color="#4ade80" />}
                  label="Kettle"
                  colors={colors}
                />
              </View>

              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-widest mb-4"
              >
                VISUAL GROUNDING
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-3 mb-24"
              >
                {hotel.photos && hotel.photos.length > 0 ? (
                  hotel.photos.map((photo: string, index: number) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      }}
                      className="w-[200px] h-[150px] rounded-md overflow-hidden mr-3 border"
                    >
                      <Image
                        source={{ uri: photo }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    </View>
                  ))
                ) : (
                  <View
                    style={{ backgroundColor: colors.surface }}
                    className="w-full h-32 items-center justify-center rounded-md"
                  >
                    <Text style={{ color: colors.textMuted }}>
                      No images available
                    </Text>
                  </View>
                )}
              </ScrollView>
            </ScrollView>

            <View
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
              }}
              className="absolute bottom-0 left-0 right-0 border-t p-6 pb-10"
            >
              <View
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                className="flex-row justify-between items-center border p-4 rounded-lg"
              >
                <View>
                  <Text
                    style={{ color: colors.primary }}
                    className="text-xs font-bold uppercase mb-1"
                  >
                    Total Valuation
                  </Text>
                  <Text
                    style={{ color: colors.text }}
                    className="text-3xl font-bold"
                  >
                    {currencySymbol}
                    {Math.round(hotel.totalPrice).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{ backgroundColor: colors.primary }}
                  className="px-3 py-1 rounded-sm"
                >
                  <Text
                    style={{ color: colors.primaryText }}
                    className="font-bold text-xs uppercase"
                  >
                    {itinerary.tripDetails.length} Nights
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const Badge = ({
  text,
  bg,
  color,
}: {
  text: string;
  bg: string;
  color: string;
}) => (
  <View className="px-2 py-1 rounded-sm" style={{ backgroundColor: bg }}>
    <Text className="text-[10px] font-bold uppercase" style={{ color }}>
      {text}
    </Text>
  </View>
);

const MetaCard = ({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string | number;
  icon: any;
  colors: any;
}) => (
  <View
    className="flex-1 border rounded-md py-3 items-center justify-center"
    style={{
      backgroundColor: colors.card,
      borderColor: colors.border,
    }}
  >
    <View className="flex-row items-center gap-1 mb-1 opacity-70">
      {icon}
      <Text
        style={{ color: colors.textMuted }}
        className="text-[10px] uppercase font-bold tracking-wider"
      >
        {label}
      </Text>
    </View>
    <Text
      style={{ color: colors.text }}
      className="text-base font-bold capitalize"
    >
      {value}
    </Text>
  </View>
);

const AmenityItem = ({
  icon,
  label,
  colors,
}: {
  icon: any;
  label: string;
  colors: any;
}) => (
  <View
    style={{ backgroundColor: colors.card, borderColor: colors.border }}
    className="w-[48%] flex-row items-center gap-2 border p-3 rounded-md"
  >
    {icon}
    <Text style={{ color: colors.text }} className="text-xs font-bold">
      {label}
    </Text>
  </View>
);
