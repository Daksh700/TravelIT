import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MapPin, Star, Trash2, ExternalLink, BookmarkX } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useBookmarks, useToggleBookmark } from "@/hooks/useBookmarks";
import { Button } from "@/components/Button";
import { useHaptics } from "@/hooks/useHaptics";

export default function SavedPreferencesScreen() {
  const { colors } = useThemeColors();
  const { handleImpact } = useHaptics();
  const router = useRouter();
  
  const { data: savedPlaces, isLoading } = useBookmarks();
  const { mutate: toggleBookmark } = useToggleBookmark();

  if (isLoading) {
    return (
      <View style={{ backgroundColor: colors.background }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={['top']}>
      <View style={{ borderBottomColor: colors.border }} className="flex-row items-center gap-4 px-6 py-4 border-b">
        <TouchableOpacity onPress={() => {
          handleImpact("soft");
          router.back()
        }}>
          <ArrowLeft size={22} color={colors.textMuted} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: colors.text }} className="text-lg font-bold">Saved Places</Text>
          <Text style={{ color: colors.textMuted }} className="text-xs">Your curated travel bucket list.</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {savedPlaces && savedPlaces.length > 0 ? (
          <View className="gap-6">
            {savedPlaces.map((item: any, idx: number) => (
              <View 
                key={idx} 
                style={{ backgroundColor: colors.card, borderColor: colors.border }} 
                className="border rounded-xl overflow-hidden shadow-sm"
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
                ) : (
                  <View style={{ height: 120, backgroundColor: colors.surface }} className="items-center justify-center">
                    <MapPin size={32} color={colors.textMuted} opacity={0.3} />
                  </View>
                )}

                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <Text style={{ color: colors.text }} className="text-lg font-bold" numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.address && (
                        <View className="flex-row items-center gap-1 mt-1">
                          <MapPin size={12} color={colors.primary} />
                          <Text style={{ color: colors.textMuted }} className="text-xs flex-1" numberOfLines={1}>
                            {item.address}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {item.rating && (
                      <View className="flex-row items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                        <Star size={12} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-yellow-500 text-xs font-bold">{item.rating}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={{ color: colors.textSecondary }} className="text-sm leading-relaxed mb-4" numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View className="flex-row gap-3 border-t pt-4" style={{ borderTopColor: colors.border }}>
                    <TouchableOpacity 
                      onPress={() => {
                        handleImpact("medium");
                        toggleBookmark(item)
                      }}
                      className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                      <Text className="font-bold text-xs" style={{ color: "#ef4444" }}>Remove</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg"
                      style={{ backgroundColor: colors.primary }}
                      onPress={() => {
                        handleImpact("medium");
                        const url = `https://maps.google.com/?q=${encodeURIComponent(item.name + " " + (item.address || ""))}`;
                        Linking.openURL(url);
                      }}
                    >
                      <ExternalLink size={16} color={colors.background} />
                      <Text className="font-bold text-xs" style={{ color: colors.background }}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View style={{ backgroundColor: colors.surface }} className="w-20 h-20 rounded-full items-center justify-center mb-4">
              <BookmarkX size={40} color={colors.textMuted} />
            </View>
            <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">No saved places yet</Text>
            <Text style={{ color: colors.textMuted }} className="text-center px-10 mb-8">
              Start exploring new destinations and bookmark them to see them here.
            </Text>
            <Button 
              title="Go Explore" 
              onPress={() => router.push("/(tabs)/explore")} 
              className="px-10"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}