import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useState } from "react"; 
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useExploreLocation } from "@/hooks/useExploreLocation";
import { useQueryClient } from "@tanstack/react-query";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function ExploreScreen() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");

  const queryClient = useQueryClient();
  
  const { mutate: explore, isPending } = useExploreLocation();

  const result = queryClient.getQueryData<any>(["exploreResult"]);

  const handleSearch = () => {
    if(!query.trim()) return;
    explore({ query });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={['top']}>
      <Header />
      
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* 1. Header */}
        <View className="mb-6">
            <Text style={{ color: colors.text }} className="text-2xl font-bold uppercase tracking-tight mb-1">
              Explore
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-sm ml-1">
              Live insights from Google Search.
            </Text>
        </View>

        {/* 2. Search Input */}
        <View className="relative mb-4">
            <Input 
                placeholder="Events in London this week..." 
                value={query}
                onChangeText={setQuery}
                className="pr-16 h-14"
            />

            <TouchableOpacity 
                onPress={handleSearch}
                disabled={isPending}
                className="absolute right-0 top-0 h-14 w-14 items-center justify-center rounded-r-md"
            >
                {isPending ? (
                    <ActivityIndicator size="small" color={colors.primaryText} />
                ) : (
                    <Search size={22} color={colors.text} />
                )}
            </TouchableOpacity>
        </View>

        {/* 3. Result Area */}
        {result ? (
            <View className="space-y-6 mb-10">
                {/* AI summary */}
                <Text style={{ color: colors.text }} className="leading-relaxed text-base mb-2">
                    {result.text}
                </Text>

                {/* Links */}
                {!!result.links?.length && (
                  <View className="gap-2 mt-2">
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
                              <Text style={{ color: colors.text }} className="text-sm flex-1 mr-2" numberOfLines={1}>
                                  {link.title}
                              </Text>
                              <Search size={14} color={colors.textMuted} />
                          </TouchableOpacity>
                      ))}
                  </View>
                )}

                {/* FIX: More spacing above clear */}
                <View className="mt-4">
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
                    'Visa requirements for Bali'
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