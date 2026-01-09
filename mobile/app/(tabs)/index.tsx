import { ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Globe, Sun, Wind } from "lucide-react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserItineraries } from "@/hooks/useUserItineraries";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const { data: trips } = useUserItineraries();

  // 🟢 Stats
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
        {/* ───────── HERO ───────── */}
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

        {/* ───────── TRENDING ───────── */}
        <View className="mb-8">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-bold uppercase tracking-widest mb-4"
          >
            Trending Now
          </Text>

          <View className="flex-row flex-wrap gap-4">
            {/* Kyoto */}
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="w-full h-64 overflow-hidden border"
            >
              <ImageBackground
                source={{ uri: "https://picsum.photos/800/600" }}
                className="w-full h-full justify-end p-5"
              >
                <View className="absolute inset-0 bg-black/30" />

                <Text
                  style={{ color: colors.primary }}
                  className="font-bold text-xs uppercase mb-1 tracking-wider"
                >
                  Culture
                </Text>

                <Text className="text-3xl font-bold text-white">
                  Kyoto, Japan
                </Text>
              </ImageBackground>
            </View>

            {/* Bali */}
            <Card className="flex-1 justify-between min-h-[120px]">
              <Sun size={24} color="#eab308" />
              <View>
                <Text style={{ color: colors.textMuted }} className="text-xs">
                  Relax
                </Text>
                <Text
                  style={{ color: colors.text }}
                  className="font-bold text-lg"
                >
                  Bali
                </Text>
              </View>
            </Card>

            {/* Iceland */}
            <Card className="flex-1 justify-between min-h-[120px]">
              <Wind size={24} color="#60a5fa" />
              <View>
                <Text style={{ color: colors.textMuted }} className="text-xs">
                  Adventure
                </Text>
                <Text
                  style={{ color: colors.text }}
                  className="font-bold text-lg"
                >
                  Iceland
                </Text>
              </View>
            </Card>

            {/* Pro Tip */}
            <Card
              style={{
                backgroundColor: `${colors.secondary ?? "#0070f3"}20`,
                borderColor: `${colors.secondary ?? "#0070f3"}40`,
              }}
              className="w-full flex-row items-center justify-between"
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
        </View>

        {/* ───────── STATS ───────── */}
        <View className="mb-6 pb-8">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-bold uppercase tracking-widest mb-4"
          >
            Your Stats
          </Text>

          <View className="flex-row gap-4">
            {/* Trips Planned */}
            <View
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
            </View>

            {/* Trips Completed */}
            <View
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
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}