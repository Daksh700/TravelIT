import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Pressable } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTripTinder } from '@/hooks/useTripTinder';
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useUpdateItineraryDetails } from "@/hooks/useModifyItinerary";
import { useAuth } from '@clerk/clerk-expo';
import { Users, ArrowLeft, MapPin, CheckCircle2, X, Heart } from 'lucide-react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Swiper from 'react-native-deck-swiper';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { useHaptics } from '@/hooks/useHaptics';

export default function TripTinderScreen() {
  const { colors } = useThemeColors();
  const { handleImpact } = useHaptics();
  const { userId } = useAuth(); 
  const router = useRouter();
  
  const { itineraryId } = useLocalSearchParams(); 
  
  const { data: trips } = useUserItineraries();
  const activeTrip = itineraryId ? trips?.find((t: any) => String(t._id) === String(itineraryId)) : null;
  
  const { mutate: updateTripDetails, isPending: isSaving } = useUpdateItineraryDetails();

  const currentUserId = userId || `guest_${Date.now()}`;
  const isHost = !!itineraryId; 

  const { 
    roomId, users, targetUsersCount, roomCurrency, currentActivity, matchedActivities, 
    isFinished, error, createRoom, joinRoom, swipe, setError
  } = useTripTinder(currentUserId);

  const symbols: Record<string, string> = { USD: "$", EUR: "€", INR: "₹", GBP: "£" };
  const currencySymbol = symbols[roomCurrency || activeTrip?.currency || "USD"] ?? "$"; 

  const [joinCode, setJoinCode] = useState("");
  const [participantCount, setParticipantCount] = useState(activeTrip?.travelers?.toString() || "2"); 
  
  const [currentDayStr, setCurrentDayStr] = useState<number | null>(null);
  const [showDayTransition, setShowDayTransition] = useState(false);

  useEffect(() => {
    if (currentActivity && currentActivity.day && currentActivity.day !== currentDayStr) {
      setCurrentDayStr(currentActivity.day);
      setShowDayTransition(true);
      setTimeout(() => setShowDayTransition(false), 1500); 
    }
  }, [currentActivity]);

  const handleCreateRoom = () => {
    const count = parseInt(participantCount);
    if (isNaN(count) || count < 2) return setError("At least 2 people required.");
    if (!activeTrip) return;

    const flatActivities: any[] = [];
    activeTrip.tripDetails.forEach((dayObj: any) => {
        dayObj.activities.forEach((act: any) => {
            flatActivities.push({ 
              ...act, 
              day: dayObj.day,
              time: act.time || "Flexible"
            });
        });
    });
    createRoom(flatActivities, count, activeTrip.currency); 
  };

  const handleSaveToVault = () => {
    if (!activeTrip || !isHost) return;
    
    const groupedDetails = activeTrip.tripDetails.map((originalDay: any) => {
        const survivedActivities = matchedActivities
            .filter((act) => act.day === originalDay.day)
            .map((act) => ({
                time: act.time, 
                activity: act.name, 
                location: act.location,
                description: act.description, 
                estimatedCost: act.estimatedCost, 
                verified: true
            }));
        
        return { 
          ...originalDay, 
          activities: survivedActivities 
        };
    });

    updateTripDetails(
        { itineraryId: activeTrip._id, tripDetails: groupedDetails },
        { onSuccess: () => router.replace(`/(tabs)/trips/view?id=${activeTrip._id}`) }
    );
  };

  const groupActivitiesByDay = (activities: any[]) => {
    const grouped: { [key: number]: any[] } = {};
    activities.forEach(act => {
      if (!grouped[act.day]) grouped[act.day] = [];
      grouped[act.day].push(act);
    });
    return grouped;
  };

  if (isFinished) {
    const groupedMatches = groupActivitiesByDay(matchedActivities);

    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView className="flex-1 px-6 pt-6">
          <View className="items-center mt-6 mb-8">
              <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-4">
                  <CheckCircle2 size={40} color="#22c55e" />
              </View>
              <Text style={{ color: colors.text }} className="text-3xl font-bold mb-2">Trip Finalized! 🎉</Text>
              <Text style={{ color: colors.textMuted }} className="text-center px-4">
                  {matchedActivities.length} activities successfully matched.
              </Text>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {Object.keys(groupedMatches).map((dayStr) => (
              <View key={dayStr} className="mb-6">
                <Text style={{ color: colors.primary }} className="text-lg font-bold mb-3 tracking-widest">
                  DAY {dayStr}
                </Text>
                
                {groupedMatches[parseInt(dayStr)].map((act: any, i: number) => (
                  <View key={i} style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="p-4 rounded-xl border mb-3 flex-row items-center justify-between">
                    <View className="flex-1 pr-2">
                      <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase mb-1">{act.time}</Text>
                      <Text style={{ color: colors.text }} className="font-bold text-base">{act.name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {isHost ? (
            <Button 
              title={isSaving ? "Updating Vault..." : "Update Trip in Vault"} 
              onPress={handleSaveToVault} 
              disabled={isSaving}
              className="mt-4 mb-8 h-14" 
            />
          ) : (
            <Button 
              title="Done" 
              variant="outline"
              onPress={() => router.replace("/(tabs)/trips")} 
              className="mt-4 mb-8 h-14" 
            />
          )}
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  if (roomId) {
    const isEveryoneJoined = users.length >= targetUsersCount; 

    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView className="flex-1">
          <View className="px-6 pt-4 flex-row items-center justify-between mb-2">
            <View>
              <Text style={{ color: colors.textMuted }} className="text-xs uppercase tracking-widest font-bold">Room Code</Text>
              <Text style={{ color: colors.primary }} className="text-xl font-bold tracking-widest">{roomId}</Text>
            </View>
            <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="px-3 py-1.5 rounded-full border flex-row items-center gap-2">
              <Users size={14} color={colors.text} />
              <Text style={{ color: colors.text }} className="font-bold text-xs">{users.length}/{targetUsersCount} Live</Text>
            </View>
          </View>

          {!isEveryoneJoined && (
              <View className="mx-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                  <Text className="text-blue-500 text-xs font-bold text-center">
                      Waiting for {targetUsersCount - users.length} friend(s) to join before you can swipe.
                  </Text>
              </View>
          )}

          <View className="flex-1 relative justify-center">
              {showDayTransition && currentDayStr && (
                  <View className="absolute inset-0 z-50 items-center justify-center bg-black/80 backdrop-blur-md">
                      <Text className="text-white text-5xl font-black tracking-widest mb-2">DAY {currentDayStr}</Text>
                      <Text className="text-blue-400 text-lg font-bold uppercase tracking-widest">Get Ready</Text>
                  </View>
              )}

              {currentActivity ? (
                  <View className="flex-1">
                      <Swiper
                          key={currentActivity.id} 
                          cards={[currentActivity]}
                          renderCard={(card) => {
                              if(!card) return <View/>;
                              return (
                                  <View style={{ backgroundColor: colors.surface, borderColor: colors.border, height: '75%' }} className="w-full p-6 rounded-3xl border shadow-2xl items-center justify-center relative overflow-hidden">
                                      <View style={{ backgroundColor: colors.card, borderColor: colors.border }} className="absolute top-6 left-6 px-4 py-2 rounded-full border">
                                          <Text style={{ color: colors.text }} className="text-xs font-bold uppercase tracking-widest">
                                            Day {card.day || currentDayStr || '?'}
                                          </Text>
                                      </View>
                                      <View style={{ backgroundColor: colors.card, borderColor: colors.border }} className="absolute top-6 right-6 px-4 py-2 rounded-full border">
                                          <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase">{card.time}</Text>
                                      </View>
                                      
                                      <View className="w-24 h-24 bg-neutral-800 rounded-full items-center justify-center mb-8 mt-10">
                                          <Text className="text-5xl">🗺️</Text>
                                      </View>
                                      
                                      <Text style={{ color: colors.text }} className="text-3xl font-black text-center mb-4 leading-tight">
                                          {card.name}
                                      </Text>
                                      
                                      <View className="flex-row items-center gap-1.5 mb-8 bg-neutral-900/50 px-4 py-2 rounded-md">
                                          <MapPin size={14} color={colors.primary} />
                                          <Text style={{ color: colors.primary }} className="text-xs font-bold">{card.location}</Text>
                                      </View>

                                      <Text style={{ color: colors.textSecondary }} className="text-center text-sm mb-10 leading-relaxed px-4">
                                          {card.description}
                                      </Text>
                                      
                                      <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="px-6 py-3 rounded-xl border">
                                          <Text style={{ color: colors.text }} className="font-bold text-sm uppercase tracking-wider">Est. Cost: {currencySymbol}{card.estimatedCost}</Text>
                                      </View>
                                  </View>
                              )
                          }}
                          onSwipedLeft={() => {
                            handleImpact("light");
                            isEveryoneJoined && swipe(currentActivity.id, "left")
                          }}
                          onSwipedRight={() => {
                            handleImpact("medium");
                            isEveryoneJoined && swipe(currentActivity.id, "right")
                          }}
                          disableLeftSwipe={!isEveryoneJoined}
                          disableRightSwipe={!isEveryoneJoined}
                          disableTopSwipe
                          disableBottomSwipe
                          stackSize={1}
                          backgroundColor="transparent"
                          cardVerticalMargin={20}
                          cardHorizontalMargin={24}
                          animateCardOpacity
                          swipeBackCard={false}
                          overlayLabels={{
                            left: { 
                                element: (
                                    <View className="w-24 h-24 rounded-full border-4 border-red-500 bg-red-500/20 items-center justify-center shadow-lg shadow-red-500/50">
                                        <X size={60} color="#ef4444" strokeWidth={3} />
                                    </View>
                                ),
                                style: { 
                                    wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 40, marginLeft: -40 } 
                                } 
                            },
                            right: { 
                                element: (
                                    <View className="w-24 h-24 rounded-full border-4 border-green-500 bg-green-500/20 items-center justify-center shadow-lg shadow-green-500/50">
                                        <Heart size={50} color="#22c55e" fill="#22c55e" strokeWidth={1} />
                                    </View>
                                ),
                                style: { 
                                    wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 40, marginLeft: 40 } 
                                } 
                            }
                          }}
                      />
                  </View>
              ) : (
                  <View className="flex-1 items-center justify-center pb-20">
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text style={{ color: colors.textMuted }} className="mt-6 font-medium text-lg">Waiting for votes...</Text>
                  </View>
              )}
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View style={{ borderBottomColor: colors.border }} className="flex-row items-center gap-4 px-6 py-4 border-b">
          <Pressable onPress={() => {
            handleImpact("soft");
            router.back()
          }}>
            <ArrowLeft size={22} color={colors.textMuted} />
          </Pressable>
          <View>
            <Text style={{ color: colors.text }} className="text-lg font-bold">Group Sync</Text>
            <Text style={{ color: colors.textMuted }} className="text-xs">Collaborative itinerary planning.</Text>
          </View>
        </View>

        <View className="px-6 pt-8">
            {isHost ? (
                <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="p-6 rounded-2xl border mb-6 shadow-sm">
                  <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">Host this Trip</Text>
                  <Text style={{ color: colors.textMuted }} className="text-sm mb-6">You are finalizing: {activeTrip?.tripTitle}</Text>
                  
                  <Text style={{ color: colors.text }} className="text-[10px] uppercase font-bold mb-2 ml-1 tracking-widest">TOTAL PARTICIPANTS</Text>
                  <Input 
                    placeholder="2" 
                    keyboardType="numeric"
                    value={participantCount} 
                    onChangeText={(t) => { setParticipantCount(t); setError(null); }} 
                    className="mb-6 h-14 font-bold text-lg" 
                  />

                  {error && <Text className="text-red-500 text-xs mb-4 font-bold">{error}</Text>}
                  <Button title="Create Room" onPress={handleCreateRoom} className="h-14" />
                </View>
            ) : (
              <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="p-6 rounded-2xl border shadow-sm">
                <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">Join a Room</Text>
                <Text style={{ color: colors.textMuted }} className="text-sm mb-6">Enter the 9-character code shared by your host.</Text>
                
                {error && <Text className="text-red-500 text-xs mb-4 font-bold">{error}</Text>}
                
                <Input 
                  placeholder="TRIP-XXXX" 
                  value={joinCode} 
                  onChangeText={(t) => { setJoinCode(t.toUpperCase()); setError(null); }} 
                  className="mb-6 h-14 uppercase font-bold tracking-widest text-center text-lg" 
                  autoCapitalize="characters"
                />
                <Button 
                  title="Join Room" 
                  onPress={() => joinRoom(joinCode)} 
                  disabled={joinCode.length < 5} 
                  style={{ opacity: joinCode.length < 5 ? 0.5 : 1 }}
                  className="h-14"
                />
              </View>
            )}
        </View>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}