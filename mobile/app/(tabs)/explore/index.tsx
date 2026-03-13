import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, MapPin, Star, ArrowRight, Bookmark } from "lucide-react-native"; 
import { useState } from "react"; 
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useExploreLocation } from "@/hooks/useExploreLocation";
import { useQueryClient } from "@tanstack/react-query";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useBookmarks, useToggleBookmark } from "@/hooks/useBookmarks"; 

export default function ExploreScreen() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  
  const { mutate: explore, isPending } = useExploreLocation();
  const result = queryClient.getQueryData<any>(["exploreResult"]);

  const { data: savedPlaces } = useBookmarks();
  const { mutate: toggleBookmark } = useToggleBookmark();

  const handleSearch = () => {
    if(!query.trim()) return;
    explore({ query });
  };

  const isBookmarked = (name: string) => {
      return savedPlaces?.some((p: any) => p.name === name);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={['top']}>
      <Header />
      
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        

        <View className="mb-6">
            <Text style={{ color: colors.text }} className="text-2xl font-bold uppercase tracking-tight mb-1">
              Explore
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-sm ml-1">
              Live insights + Real locations.
            </Text>
        </View>

        <View className="relative mb-6">
            <Input 
                placeholder="Best coffee in Seattle..." 
                value={query}
                onChangeText={setQuery}
                className="pr-16 h-14"
            />
            <TouchableOpacity 
                onPress={handleSearch}
                disabled={isPending}
                className="absolute right-0 top-0 h-14 w-14 items-center justify-center"
            >
                {isPending ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                    <Search size={22} color={colors.text} />
                )}
            </TouchableOpacity>
        </View>

        {result ? (
            <View className="mb-10">
                {result.text && (
                    <View style={{ borderLeftColor: colors.primary }} className="pl-4 border-l mb-8">
                        <Text style={{ color: colors.textMuted }} className="text-sm leading-relaxed italic">
                            {result.text}
                        </Text>
                    </View>
                )}

                {result.items && result.items.length > 0 && (
                    <View className="gap-6 mb-10">
                        {result.items.map((item: any, idx: number) => {
                            const saved = isBookmarked(item.name); 

                            return (
                                <View 
                                    key={idx} 
                                    style={{ backgroundColor: colors.card, borderColor: colors.border }} 
                                    className="border rounded-lg overflow-hidden relative"
                                >
                                    <TouchableOpacity 
                                        onPress={() => toggleBookmark(item)}
                                        activeOpacity={0.8}
                                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                                        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full items-center justify-center backdrop-blur-md"
                                    >
                                        <Bookmark size={20} color={saved ? "#22c55e" : "#fff"} fill={saved ? "#22c55e" : "transparent"} />
                                    </TouchableOpacity>

                                    {item.image ? (
                                        <Image 
                                            source={{ uri: item.image }} 
                                            style={{ width: "100%", height: 160 }} 
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={{ height: 100, backgroundColor: colors.surface }} className="items-center justify-center">
                                            <MapPin size={24} color={colors.textMuted} opacity={0.5} />
                                        </View>
                                    )}

                                    <View className="p-4">
                                        <View className="flex-row justify-between items-start mb-2">
                                            <Text style={{ color: colors.text }} className="text-lg font-bold flex-1 mr-2">
                                                {item.name}
                                            </Text>
                                            {item.rating && (
                                                <View className="flex-row items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md">
                                                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                                                    <Text className="text-yellow-500 text-xs font-bold">{item.rating}</Text>
                                                </View>
                                            )}
                                        </View>

                                        {item.address && (
                                            <View className="flex-row items-center gap-1 mb-3">
                                                <MapPin size={12} color={colors.textMuted} />
                                                <Text style={{ color: colors.textMuted }} className="text-xs flex-1" numberOfLines={1}>
                                                    {item.address}
                                                </Text>
                                            </View>
                                        )}

                                        <Text style={{ color: colors.textSecondary }} className="text-sm leading-relaxed">
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )}

                
                {!!result.links?.length && (
                  <View className="gap-2">
                      <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-widest mb-2">
                          Sources
                      </Text>
                      {result.links.map((link:any, idx:number) => (
                          <TouchableOpacity 
                              key={idx}
                              onPress={async () => {
                                const supported = await Linking.canOpenURL(link.url);
                                if(supported) {
                                  Linking.openURL(link.url);
                                }
                                else {
                                  console.warn("Unsupported URL: ", link.url);
                                }
                              }}
                              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                              className="flex-row items-center justify-between p-4 border rounded-md"
                          >
                              <Text style={{ color: colors.textSecondary }} className="text-xs flex-1 mr-2" numberOfLines={1}>
                                  {link.title}
                              </Text>
                              <ArrowRight size={12} color={colors.textMuted} />
                          </TouchableOpacity>
                      ))}
                  </View>
                )}

                <View className="mt-12">
                  <Button
                      variant="outline"
                      onPress={() => {
                        queryClient.removeQueries({ queryKey: ["exploreResult"] });
                        setQuery("");
                      }}
                      className="h-12"
                    >
                      <Text style={{ color: colors.text }}>Clear Search</Text>
                  </Button>
                </View>

            </View>
        ) : (
            !isPending && (
              <View className="gap-2">
                  <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-widest mb-2">
                      Try asking
                  </Text>
                  {[
                    'Best coffee in Seattle',
                    'Hidden gems in Rome',
                    'Tourist Places in Bali'
                  ].map((text) => (
                      <TouchableOpacity
                          key={text}
                          onPress={() => {
                            setQuery(text);
                            explore({ query: text });
                          }}
                          style={{ borderColor: colors.border }}
                          className="p-4 border border-dashed active:border-primary rounded-md"
                      >
                          <Text style={{ color: colors.textMuted }} className="text-sm">{text}</Text>
                      </TouchableOpacity>
                  ))}
              </View>
            )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}