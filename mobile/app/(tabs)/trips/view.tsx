import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Pressable, TouchableOpacity, Modal, Image, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { exportTripToPDF } from "@/utils/pdfExport";
import { 
  MapPin, Clock, ArrowLeft, Building2, Star, X, 
  Wifi, Wind, Tv, Coffee, Briefcase, Users, User, ShieldCheck, Plane,
  CloudRain, Sparkles, Trash2, GripVertical, Send, Edit3, Download
} from "lucide-react-native";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useModifyItinerary, useUpdateItineraryDetails, useOptimizeRoute } from "@/hooks/useModifyItinerary"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";

export default function ViewTripScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  
  const { data: trips } = useUserItineraries();
  const trip = trips?.find((t: any) => t._id === id);
  const { mutate: modifyTrip, isPending: isModifying } = useModifyItinerary();
  const { mutate: saveOrder } = useUpdateItineraryDetails();
  const { mutateAsync: optimizeRoute } = useOptimizeRoute();

  const [isEditMode, setIsEditMode] = useState(false);
  const [localData, setLocalData] = useState<any[]>([]); 
  
  const [hotelModalVisible, setHotelModalVisible] = useState(false);
  const [modifyModalVisible, setModifyModalVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  
  const [chatQuery, setChatQuery] = useState("");
  const [modifyType, setModifyType] = useState<"weather" | "delay">("weather");
  const [selectedDay, setSelectedDay] = useState("1");
  const [delayHours, setDelayHours] = useState("2");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [optimizingDay, setOptimizingDay] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const symbols: Record<string, string> = { USD: "$", EUR: "€", INR: "₹", GBP: "£" };

  useEffect(() => {
    if (trip && !isModifying) {
        const flat: any[] = [];
        trip.tripDetails.forEach((day: any) => {
            flat.push({ type: 'header', day: day.day, theme: day.theme, key: `header-${day.day}` });
            day.activities.forEach((act: any, index: number) => {
                flat.push({ 
                    type: 'activity', 
                    day: day.day, 
                    ...act, 
                    uniqueId: `${day.day}-${index}-${act.activity.replace(/\s/g, '').slice(0,10)}`, 
                    originalIndex: index 
                });
            });
        });
        setLocalData(flat);
    }
  }, [trip, isModifying]);

  if (!trip) return null;

  const hotel = trip.hotel;
  const flight = trip.flight; 
  const currencySymbol = symbols[trip.currency] ?? "";
  const isDraft = trip.status === 'draft';

  const updateBackendOrder = (newData: any[]) => {
    setLocalData(newData); 
    
    const newDetails: any[] = [];
    let currentDayObj: any = null;

    newData.forEach((item) => {
        if (item.type === 'header') {
            if (currentDayObj) newDetails.push(currentDayObj);
            currentDayObj = { day: item.day, theme: item.theme, activities: [] };
        } else if (item.type === 'activity' && currentDayObj) {
            const { type, uniqueId, originalIndex, isActive, key, day, ...cleanActivity } = item;
            currentDayObj.activities.push(cleanActivity);
        }
    });
    if (currentDayObj) newDetails.push(currentDayObj);

    saveOrder({ itineraryId: trip._id, tripDetails: newDetails });
  };

  const handleDeleteActivity = (uniqueId: string) => {
    const newData = localData.filter(item => item.uniqueId !== uniqueId);
    updateBackendOrder(newData);
  };

  const handleAiEdit = () => {
    if(!chatQuery.trim()) return;
    setIsChatLoading(true);
    setChatVisible(false);
    modifyTrip({ itineraryId: trip._id, type: "ai_edit", userPrompt: chatQuery }, {
      onSuccess: () => {
        setIsChatLoading(false);
        setChatQuery("");
      },
      onError: () => {
        setIsChatLoading(false);
        setChatQuery("");
      }
    });
  };

  const openModificationModal = (type: "weather" | "delay") => {
    setModifyType(type);
    setSelectedDay("1"); 
    setDelayHours("2");  
    setModifyModalVisible(true);
  };

  const handleSubmitModification = () => {
    modifyTrip({
      itineraryId: trip._id,
      type: modifyType,
      dayNumber: parseInt(selectedDay) || 1,
      delayHours: modifyType === "delay" ? parseInt(delayHours) || 2 : undefined
    });
    setModifyModalVisible(false);
  };

  const handleOptimizeDay = async (dayIndex: number, activities: any[]) => {
    try {
      setOptimizingDay(dayIndex);
      
      const result = await optimizeRoute({
        activities,
        dayStartTime: "09:00 AM" 
      });

      if (result && result.optimizedOrder) {
        const updatedDetails = [...trip.tripDetails];
        updatedDetails[dayIndex].activities = result.optimizedOrder;
        
        saveOrder({ itineraryId: trip._id, tripDetails: updatedDetails });

        queryClient.setQueryData(["user-itineraries"], (oldData: any[]) => {
            if (!oldData) return oldData;
            return oldData.map((t) => 
                t._id === trip._id ? { ...t, tripDetails: updatedDetails } : t
            );
        });
      }
    } catch (error) {
      console.error("Failed to optimize UI:", error);
    } finally {
      setOptimizingDay(null);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    await exportTripToPDF(trip);
    setIsExporting(false);
  };

  const renderStatusBadge = (act: any) => {
    if (act.verified === false) return <Badge text="Not Found (Re-Check)" bg="#fee2e2" color="#dc2626" />;
    if (act.closedToday) return <Badge text="Closed Today" bg="#dbeafe" color="#1d4ed8" />;
    if (act.seasonalWarning) return <Badge text="Seasonal Risk" bg="#fef9c3" color="#ca8a04" />;
    if (act.verified) return <Badge text="Verified" bg="#dcfce7" color="#15803d" />;
    return null;
  };

  const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    if (item.type === 'header') {
      return (
        <View className="relative pl-8 mb-4 mt-6">
           <View style={{ backgroundColor: colors.background, borderColor: colors.primary }} className="absolute left-0 top-1 w-6 h-6 border rounded-full items-center justify-center z-10">
                <Text style={{ color: colors.primary }} className="text-xs font-bold">{item.day}</Text>
           </View>
           <Text style={{ color: colors.text }} className="text-lg font-bold">{item.theme}</Text>
        </View>
      );
    }

    return (
      <ScaleDecorator>
        <View className="relative pl-8 mb-3">
            <View style={{ backgroundColor: colors.border }} className="absolute left-[11px] -top-6 bottom-[-24px] w-[1px]" />
            <TouchableOpacity
                onLongPress={drag}
                activeOpacity={1}
                style={{ 
                    backgroundColor: isActive ? "#1a1a1a" : colors.surface, 
                    borderColor: isActive ? colors.primary : colors.border,
                    opacity: isActive ? 0.9 : 1
                }}
                className={`p-4 border rounded-md flex-row items-center gap-3`}
            >
                <GripVertical size={20} color={colors.textMuted} />
                <View className="flex-1">
                    <Text style={{ color: colors.text }} className="font-bold text-base mb-1">{item.activity}</Text>
                    <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
                        Est. Cost: {currencySymbol}{item.estimatedCost}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteActivity(item.uniqueId)} className="p-2">
                    <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
      <View style={{ borderBottomColor: colors.border }} className="flex-row items-center gap-4 px-6 py-4 border-b">
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.textMuted} />
        </Pressable>
        <View>
          <Text style={{ color: colors.text }} className="text-lg font-bold">My Vault</Text>
          <Text style={{ color: colors.textMuted }} className="text-xs">Archived journeys & memories.</Text>
        </View>
      </View>

      {isEditMode ? (
        <View style={{ flex: 1 }}>
            <View className="px-6 py-4 border-b" style={{ borderColor: colors.border }}>
                <Text style={{ color: colors.text, textAlign: "center", marginBottom: 10 }}>
                    Drag items to reorder. Press Done to save.
                </Text>
                <Button title="Done Editing" onPress={() => setIsEditMode(false)} />
            </View>
            <DraggableFlatList
                data={localData}
                onDragEnd={({ data }) => updateBackendOrder(data)}
                keyExtractor={(item) => item.uniqueId || item.key}
                renderItem={renderDraggableItem}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
            />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="flex-row justify-between items-start mb-8">
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text }} className="text-3xl font-bold leading-tight">{trip.tripTitle}</Text>
                <View className="flex-row gap-4 mt-2">
                <View className="flex-row items-center gap-1">
                    <MapPin size={14} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted }} className="text-sm">{trip.destination}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Clock size={14} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted }} className="text-sm">{trip.tripDetails.length} days</Text>
                </View>
                </View>
                <View className="mt-4 flex-row">
                <View className="px-3 py-1.5 rounded-full flex-row items-center gap-2 border" style={{ backgroundColor: colors.card, borderColor: isDraft ? colors.border : '#22c55e' }}>
                    <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isDraft ? colors.textMuted : '#22c55e' }} />
                    <Text className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isDraft ? colors.textMuted : '#22c55e' }}>{trip.status || "DRAFT"}</Text>
                </View>
                </View>
            </View>
            </View>

            <View className="flex-row gap-3 mb-8">
                <MetaCard label="Travelers" value={trip.travelers} icon={<Users size={14} color="#9ca3af" />} colors={colors} />
                <MetaCard label="Age Group" value={trip.ageGroup} icon={<User size={14} color="#9ca3af" />} colors={colors} />
                <MetaCard label="Safety" value={trip.safeMode ? "On" : "Off"} icon={<ShieldCheck size={14} color={trip.safeMode ? "#22c55e" : "#9ca3af"} />} colors={colors} />
            </View>

            <View className="flex-row gap-3 mb-6">
                <TouchableOpacity 
                    onPress={() => setIsEditMode(true)}
                    style={{ backgroundColor: "transparent", borderColor: colors.border }}
                    className="flex-1 py-3 rounded-lg border items-center justify-center flex-row gap-2"
                >
                    <Edit3 size={16} color={colors.text} />
                    <Text style={{ color: colors.text }} className="font-bold uppercase text-xs">Edit Order</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setChatVisible(true)}
                    style={{ backgroundColor: "transparent", borderColor: "#22c55e" }}
                    className="flex-1 py-3 rounded-lg border items-center justify-center flex-row gap-2"
                >
                    <Sparkles size={16} color="#22c55e" />
                    <Text style={{ color: "#22c55e" }} className="font-bold uppercase text-xs">Chat with AI</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleExportPDF}
                    disabled={isExporting}
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                    className="flex-1 py-3 rounded-lg border items-center justify-center flex-row gap-1.5"
                >
                    {isExporting ? (
                        <ActivityIndicator size="small" color={colors.text} />
                    ) : (
                        <Download size={14} color={colors.text} />
                    )}
                    <Text style={{ color: colors.text }} className="font-bold uppercase text-[10px]">PDF</Text>
                </TouchableOpacity>
            </View>

            <View style={{ borderLeftColor: colors.primary }} className="pl-4 border-l mb-10">
                <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed">{trip.tripDescription}</Text>
            </View>

            <View className="mb-10 rounded-lg overflow-hidden border p-5" style={{ backgroundColor: "#0a0a0a", borderColor: "#262626" }}>
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-white text-base font-bold italic tracking-wider">REAL-TIME LOGIC</Text>
                    {isModifying && <ActivityIndicator size="small" color="#fff" />}
                </View>
                <View className="gap-3">
                    <TouchableOpacity onPress={() => openModificationModal("weather")} disabled={isModifying} className="flex-row items-center p-4 rounded-lg border border-[#262626] bg-[#121212] active:bg-[#1a1a1a]">
                    <CloudRain size={24} color="#3b82f6" />
                    <View className="ml-4 flex-1">
                        <Text className="text-white font-bold text-sm">Adapt for Rain</Text>
                        <Text className="text-neutral-500 text-xs">Switch outdoor plans to indoor venues.</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModificationModal("delay")} disabled={isModifying} className="flex-row items-center p-4 rounded-lg border border-[#262626] bg-[#121212] active:bg-[#1a1a1a]">
                    <Clock size={24} color="#22c55e" />
                    <View className="ml-4 flex-1">
                        <Text className="text-white font-bold text-sm">Handle Delay</Text>
                        <Text className="text-neutral-500 text-xs">Shift timing due to late arrival/traffic.</Text>
                    </View>
                    </TouchableOpacity>
                </View>
            </View>

            {flight && (
            <View className="mb-6 rounded-lg overflow-hidden relative border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4ade80] z-10" />
                <View className="p-5 pl-7">
                <View className="flex-row items-center gap-2 mb-6">
                    <Plane size={16} color="#4ade80" />
                    <Text className="text-[#4ade80] font-bold text-xs uppercase tracking-wider">Round Trip Recommendation</Text>
                </View>
                <View className="mb-6">
                    <Text className="text-neutral-500 text-[10px] font-bold uppercase mb-1">OUTBOUND</Text>
                    <View className="flex-row justify-between items-start">
                    <View>
                        <Text style={{ color: colors.text }} className="text-lg font-bold">{flight.airline}</Text>
                        <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase mt-0.5">{trip.source.toUpperCase()} → {trip.destination.toUpperCase()} • ECONOMY</Text>
                    </View>
                    <View className="items-end">
                        <Text style={{ color: colors.text }} className="text-xl font-bold">{currencySymbol}{flight.price.toLocaleString()}</Text>
                        <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold">{flight.duration}</Text>
                    </View>
                    </View>
                </View>
                <View style={{ backgroundColor: colors.border }} className="h-[1px] mb-6" />
                <View>
                    <Text className="text-neutral-500 text-[10px] font-bold uppercase mb-1">RETURN</Text>
                    <View className="flex-row justify-between items-start">
                    <View>
                        <Text style={{ color: colors.text }} className="text-lg font-bold">{flight.airline}</Text>
                        <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase mt-0.5">{trip.destination.toUpperCase()} → {trip.source.toUpperCase()} • ECONOMY</Text>
                    </View>
                    <View className="items-end">
                        <Text style={{ color: colors.text }} className="text-xl font-bold">{currencySymbol}{flight.price.toLocaleString()}</Text>
                        <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold">{flight.duration}</Text>
                    </View>
                    </View>
                </View>
                </View>
            </View>
            )}

            {hotel && (
            <TouchableOpacity onPress={() => setHotelModalVisible(true)} className="mb-10 rounded-lg overflow-hidden relative border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 z-10" />
                <View className="p-5 pl-7">
                <View className="flex-row items-center gap-2 mb-3">
                    <Building2 size={16} color="#3b82f6" />
                    <Text className="text-[#3b82f6] font-bold text-xs uppercase tracking-wider">Accommodation Logic</Text>
                </View>
                <View className="flex-row justify-between items-start">
                    <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ color: colors.text }} className="text-lg font-bold leading-tight mb-1">{hotel.name}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs mb-3">{trip.destination} • HOTEL</Text>
                    <View className="flex-row items-center gap-1">
                        <Star size={14} color="#facc15" fill="#facc15" />
                        <Text style={{ color: colors.text }} className="font-bold text-sm">{hotel.rating}/10</Text>
                        <Text style={{ color: colors.textMuted }} className="text-xs">({hotel.reviewCount} reviews)</Text>
                    </View>
                    </View>
                    <View className="items-end">
                    <Text style={{ color: colors.text }} className="text-xl font-bold">{currencySymbol}{Math.round(hotel.totalPrice).toLocaleString()}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase text-right">Total for {trip.tripDetails.length} Nights</Text>
                    </View>
                </View>
                <View style={{ borderTopColor: colors.border }} className="mt-4 pt-3 border-t">
                    <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase text-center">ⓘ Tap for Hotel Details & Photos</Text>
                </View>
                </View>
            </TouchableOpacity>
            )}

            {trip.travelers > 1 && isDraft && (
                <TouchableOpacity 
                    activeOpacity={0.9}
                    onPress={() => router.push({ pathname: "/(tabs)/trips/tinder", params: { itineraryId: trip._id } })}
                    className="mb-8 rounded-2xl overflow-hidden border border-[#3b82f6]/30 relative"
                >
                    <View style={{ backgroundColor: "#1e3a8a" }} className="absolute inset-0 opacity-20" />
                    <View className="p-6 flex-row items-center justify-between">
                        <View className="flex-1 pr-6">
                            <Text className="text-[#60a5fa] text-[10px] font-bold uppercase tracking-widest mb-1">Multiplayer Mode</Text>
                            <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">Group Sync</Text>
                            <Text style={{ color: colors.textMuted }} className="text-xs leading-relaxed">
                                Traveling with {trip.travelers} others? Invite them to swipe and finalize this itinerary together!
                            </Text>
                        </View>
                        <View className="w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-500/50">
                            <Users size={24} color="#fff" />
                        </View>
                    </View>
                </TouchableOpacity>
            )}

            <View className="relative">
                <View style={{ backgroundColor: colors.border }} className="absolute left-[11px] top-6 bottom-0 w-[1px]" />
                
                {trip.tripDetails.map((day: any, dayIndex: number) => {
                    const isOptimizingThisDay = optimizingDay === dayIndex;

                    return (
                    <View key={day.day} className="relative pl-8 mb-10">
                        <View style={{ backgroundColor: colors.background, borderColor: colors.primary }} className="absolute left-0 top-1 w-6 h-6 border rounded-full items-center justify-center z-10">
                            <Text style={{ color: colors.primary }} className="text-xs font-bold">{day.day}</Text>
                        </View>
                        
                        <View className="flex-row justify-between items-center mb-4">
                            <Text style={{ color: colors.text, flex: 1 }} className="text-lg font-bold pr-4">
                                {day.theme}
                            </Text>
                            
                            <TouchableOpacity
                                onPress={() => handleOptimizeDay(dayIndex, day.activities)}
                                disabled={isOptimizingThisDay}
                                style={{ backgroundColor: colors.surface, borderColor: isOptimizingThisDay ? colors.border : colors.primary }}
                                className="flex-row items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border"
                            >
                                {isOptimizingThisDay ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <Sparkles size={12} color={colors.primary} />
                                )}
                                <Text style={{ color: isOptimizingThisDay ? colors.textMuted : colors.primary }} className="text-xs font-bold uppercase tracking-wider">
                                    {isOptimizingThisDay ? "Thinking..." : "Optimize"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-3">
                            {day.activities.map((act: any, idx: number) => {
                                const locationString = typeof act.location === 'string' ? act.location : act.formattedAddress || "Unknown Location";
                                return (
                                    <Card key={idx} style={{ borderColor: colors.border, backgroundColor: colors.surface }} className="p-4 border">
                                        <View className="flex-row justify-between items-start mb-2">
                                            <View className="flex-row gap-2 flex-wrap flex-1 pr-2">
                                                {renderStatusBadge(act)}
                                                {act.waitingTime > 0 && (
                                                    <Badge text={`Wait: ${act.waitingTime}m`} bg="#fef9c3" color="#ca8a04" />
                                                )}
                                            </View>
                                            <View className="bg-neutral-800/50 px-2 py-1 rounded">
                                                <Text style={{ color: colors.primary }} className="text-xs font-bold tracking-widest">
                                                    {act.time}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={{ color: colors.text }} className="font-bold text-base mb-1">{act.activity}</Text>
                                        <View className="flex-row items-center gap-1 mb-2">
                                            <MapPin size={10} color={colors.primary} />
                                            <Text style={{ color: colors.primary }} className="text-xs font-bold">{locationString}</Text>
                                        </View>
                                        <Text style={{ color: colors.textMuted }} className="text-sm">{act.description}</Text>
                                        <Text style={{ color: colors.textSecondary }} className="text-xs font-bold mt-2">Est. Cost: {currencySymbol}{act.estimatedCost}</Text>
                                    </Card>
                                );
                            })}
                        </View>
                    </View>
                    );
                })}
            </View>

            <Button variant="outline" onPress={() => router.replace("/(tabs)/trips")} className="mt-10 mb-10 h-14 py-0">
                <View className="flex-row items-center justify-center gap-2">
                    <Text style={{ color: colors.text }} className="font-bold">Back to Vault</Text>
                </View>
            </Button>
        </ScrollView>
      )}

      <Modal visible={chatVisible} transparent animationType="fade" onRequestClose={() => setChatVisible(false)}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" }}
        >
            <View style={{ backgroundColor: "#000", borderColor: "#333", width: "85%", borderRadius: 16, borderWidth: 1 }} className="p-6">
                <View className="flex-row justify-between items-center mb-6">
                    <Text style={{ color: "#fff" }} className="text-lg font-bold italic uppercase">Chat Assistant</Text>
                    <TouchableOpacity onPress={() => !isChatLoading && setChatVisible(false)} disabled={isChatLoading}>
                        <X size={24} color={isChatLoading ? "#666" : "#666"} />
                    </TouchableOpacity>
                </View>
                
                <View className="flex-row items-center gap-3">
                    <TextInput 
                        value={chatQuery}
                        onChangeText={setChatQuery}
                        placeholder="e.g. 'Make Day 2 cheaper'"
                        placeholderTextColor="#666"
                        editable={!isChatLoading}
                        style={{ 
                            flex: 1, 
                            backgroundColor: "#1a1a1a", 
                            color: isChatLoading ? "#666" : "#fff", 
                            borderColor: "#333",
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            height: 50
                        }}
                    />
                    <TouchableOpacity 
                        onPress={handleAiEdit}
                        disabled={isChatLoading || !chatQuery.trim()}
                        style={{ backgroundColor: isChatLoading || !chatQuery.trim() ? "#999" : "#22c55e" }} 
                        className="h-[50px] w-[50px] rounded-lg items-center justify-center"
                    >
                        {isChatLoading ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Send size={20} color="#000" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={modifyModalVisible} transparent animationType="fade" onRequestClose={() => setModifyModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: colors.surface, borderColor: colors.border, width: "85%", borderRadius: 16, borderWidth: 1 }} className="p-6">
                <View className="flex-row justify-between items-center mb-2">
                    <Text style={{ color: colors.text }} className="text-xl font-bold">{modifyType === "weather" ? "Adapt for Weather" : "Handle Delay"}</Text>
                    <TouchableOpacity onPress={() => setModifyModalVisible(false)}>
                        <X size={24} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: colors.textMuted }} className="text-sm mb-6">
                    {modifyType === "weather" ? "Which day has bad weather? We'll swap outdoor activities for indoor ones." : "Which day is delayed and by how much? We'll shift the schedule."}
                </Text>

                <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase mb-2">Select Day (1 - {trip.tripDetails.length})</Text>
                <Input value={selectedDay} onChangeText={setSelectedDay} keyboardType="numeric" placeholder="1" containerStyle={{ marginBottom: 16 }} />

                {modifyType === "delay" && (
                    <>
                        <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase mb-2">Delay Duration (Hours)</Text>
                        <Input value={delayHours} onChangeText={setDelayHours} keyboardType="numeric" placeholder="2" containerStyle={{ marginBottom: 16 }} />
                    </>
                )}

                <Button onPress={handleSubmitModification} title="Apply Changes" />
            </View>
        </View>
      </Modal>

      <Modal visible={hotelModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setHotelModalVisible(false)}>
        {hotel && (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={{ borderColor: colors.border }} className="px-6 py-4 flex-row justify-between items-center border-b">
                <Text style={{ color: colors.text }} className="text-lg font-bold italic">ACCOMMODATION DETAILS</Text>
                <TouchableOpacity onPress={() => setHotelModalVisible(false)}>
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
                </View>
                <ScrollView className="flex-1 px-6 pt-6">
                <View className="mb-6">
                    <Text style={{ color: colors.text }} className="text-2xl font-bold mb-2">{hotel.name}</Text>
                    <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase mb-4">{trip.destination} • HOTEL</Text>
                    <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed italic">Experience a comfortable stay at {hotel.name}, offering excellent amenities and easy access to local attractions in {trip.destination}. Rated {hotel.rating}/10 by over {hotel.reviewCount} guests, this is our top pick for your budget and preferences.</Text>
                </View>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase tracking-widest mb-4">LOGIC & AMENITIES</Text>
                <View className="flex-row flex-wrap gap-3 mb-8">
                    <AmenityItem icon={<Wifi size={14} color="#4ade80" />} label="Free Wi-Fi" colors={colors} />
                    <AmenityItem icon={<Clock size={14} color="#4ade80" />} label="24-hour reception" colors={colors} />
                    <AmenityItem icon={<Briefcase size={14} color="#4ade80" />} label="Luggage storage" colors={colors} />
                    <AmenityItem icon={<Wind size={14} color="#4ade80" />} label="Air conditioning" colors={colors} />
                    <AmenityItem icon={<Tv size={14} color="#4ade80" />} label="Flat-screen TV" colors={colors} />
                    <AmenityItem icon={<Coffee size={14} color="#4ade80" />} label="Kettle" colors={colors} />
                </View>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase tracking-widest mb-4">VISUAL GROUNDING</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 mb-24">
                    {hotel.photos && hotel.photos.length > 0 ? (
                    hotel.photos.map((photo: string, index: number) => (
                        <View key={index} style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="w-[200px] h-[150px] rounded-md overflow-hidden mr-3 border">
                        <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                        </View>
                    ))
                    ) : (
                    <View style={{ backgroundColor: colors.surface }} className="w-full h-32 items-center justify-center rounded-md">
                        <Text style={{ color: colors.textMuted }}>No images available</Text>
                    </View>
                    )}
                </ScrollView>
                </ScrollView>
                <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="absolute bottom-0 left-0 right-0 border-t p-6 pb-10">
                    <View style={{ backgroundColor: colors.card, borderColor: colors.border }} className="flex-row justify-between items-center border p-4 rounded-lg">
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
    </GestureHandlerRootView>
  );
}

const Badge = ({ text, bg, color }: { text: string; bg: string; color: string }) => (
  <View className="px-2 py-1 rounded-sm" style={{ backgroundColor: bg }}>
    <Text className="text-[10px] font-bold uppercase" style={{ color }}>{text}</Text>
  </View>
);

const MetaCard = ({ label, value, icon, colors }: { label: string; value: string | number; icon: any, colors: any }) => (
  <View style={{ backgroundColor: colors.card, borderColor: colors.border }} className="flex-1 border rounded-md py-3 items-center justify-center">
    <View className="flex-row items-center gap-1 mb-1 opacity-70">
      {icon}
      <Text style={{ color: colors.textMuted }} className="text-[10px] uppercase font-bold tracking-wider">{label}</Text>
    </View>
    <Text style={{ color: colors.text }} className="text-base font-bold capitalize">{value}</Text>
  </View>
);

const AmenityItem = ({ icon, label, colors }: { icon: any, label: string, colors: any }) => (
  <View style={{ backgroundColor: colors.card, borderColor: colors.border }} className="w-[48%] flex-row items-center gap-2 border p-3 rounded-md">
    {icon}
    <Text style={{ color: colors.text }} className="text-xs font-bold">{label}</Text>
  </View>
);