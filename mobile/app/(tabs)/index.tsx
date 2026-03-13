import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Globe, Sun, Wind } from "lucide-react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserItineraries } from "@/hooks/useUserItineraries";
import { useTrendingDestinations } from "@/hooks/useTrendingDestinations";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const { data: trips } = useUserItineraries();
  const { data: trending, isLoading: isTrendingLoading } = useTrendingDestinations();

  const plannedCount = trips?.length ?? 0;
  const completedCount = trips?.filter((t: any) => t.status === "completed").length ?? 0;

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["top"]}
    >
      <Header />

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-3 mb-10 space-y-4">
          <Text
            style={{ color: colors.text }}
            className="text-5xl font-bold leading-tight"
          >
            Design your{"\n"}
            <Text style={{ color: colors.primary }}>
              next escape.
            </Text>
          </Text>

          <Text
            style={{ color: colors.textMuted }}
            className="text-lg mb-4"
          >
            AI-powered itineraries for the modern traveler.
          </Text>

          <Button onPress={() => router.push("/(tabs)/plan")} className="flex-row gap-2">
            <Text style={{ color: colors.primaryText }} className="font-bold text-base">
              Start Planning
            </Text>
            <ArrowRight size={20} color={colors.primaryText} />
          </Button>
        </View>

        <View className="mb-8">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-bold uppercase tracking-widest mb-4"
          >
            Trending Now
          </Text>

          {isTrendingLoading ? (
            <View className="h-64 items-center justify-center border rounded-md" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
                <ActivityIndicator color={colors.primary} />
            </View>
          ) : trending && trending.length > 0 ? (
            <View className="flex-row flex-wrap gap-4">
              <View
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                className="w-full h-64 overflow-hidden border"
              >
                <ImageBackground
                  source={{ uri: trending[0]?.image || "https://picsum.photos/800/600" }}
                  className="w-full h-full justify-end p-5"
                >
                  <View className="absolute inset-0 bg-black/40" />
                  <Text style={{ color: colors.primary }} className="font-bold text-xs uppercase mb-1 tracking-wider z-10">
                    {trending[0]?.theme || "Explore"}
                  </Text>
                  <Text className="text-3xl font-bold text-white z-10">
                    {trending[0]?.location}
                  </Text>
                </ImageBackground>
              </View>

              {trending.slice(1, 3).map((item: any, idx: number) => (
                <Card key={idx} className="flex-1 justify-between min-h-[120px]">
                  {idx === 0 ? <Sun size={24} color="#eab308" /> : <Wind size={24} color="#60a5fa" />}
                  <View>
                    <Text style={{ color: colors.textMuted }} className="text-xs">
                      {item.theme}
                    </Text>
                    <Text
                      style={{ color: colors.text }}
                      className="font-bold text-lg"
                    >
                      {item.location.split(',')[0]}
                    </Text>
                  </View>
                </Card>
              ))}

              <Card
                style={{
                  backgroundColor: `${colors.secondary ?? "#0070f3"}20`,
                  borderColor: `${colors.secondary ?? "#0070f3"}40`,
                }}
                className="w-full flex-row items-center justify-between mt-2"
              >
                <View>
                  <Text
                    style={{ color: colors.secondary }}
                    className="text-xs font-bold uppercase"
                  >
                    Pro Tip
                  </Text>
                  <Text
                    style={{ color: colors.textSecondary }}
                    className="font-medium"
                  >
                    Use {"Local Gems"} in prompt.
                  </Text>
                </View>

                <Globe
                  size={32}
                  color={colors.secondary}
                  style={{ opacity: 0.5 }}
                />
              </Card>
            </View>
          ) : (
            <Text style={{ color: colors.textMuted }}>No trending destinations available right now.</Text>
          )}
        </View>

        <View className="mb-6 pb-8">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-bold uppercase tracking-widest mb-4"
          >
            Your Stats
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: "/(tabs)/trips", params: { filter: "all", _t: Date.now() } })}
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="flex-1 p-4 border"
            >
              <Text
                style={{ color: colors.text }}
                className="text-3xl font-bold"
              >
                {plannedCount}
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs uppercase mt-1"
              >
                Trips Planned
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: "/(tabs)/trips", params: { filter: "completed", _t: Date.now() } })}
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="flex-1 p-4 border"
            >
              <Text
                style={{ color: colors.text }}
                className="text-3xl font-bold"
              >
                {completedCount}
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs uppercase mt-1"
              >
                Trips Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}