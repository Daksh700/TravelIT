import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, Switch } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Sparkles } from "lucide-react-native";
import { useState } from "react";
import { useGenerateItinerary } from "@/hooks/useGenerateItinerary";

export default function CreateTripScreen() {
  const { colors } = useThemeColors();
  const { mutate: generate, isPending } = useGenerateItinerary();

  const [form, setForm] = useState({
    source: "",
    destination: "",
    duration: 3,
    budgetTier: "low",
    budget: 500,
    currency: "USD",
    interests: "",
    travelers: 1,
    ageGroup: "adults",
    safeMode: false,
  });

  const handleGenerate = () => {
    generate({
      source: form.source.trim(),
      destination: form.destination.trim(),
      duration: Number(form.duration),
      budgetTier: form.budgetTier,
      budget: Number(form.budget),
      currency: form.currency,
      travelers: Number(form.travelers),
      ageGroup: form.ageGroup,
      safeMode: form.safeMode,
      interests:
        form.interests.length > 0
          ? form.interests.split(",").map((i) => i.trim())
          : [],
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
      <Header />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Title */}
        <View className="mb-8">
          <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight mb-1">
            Create Trip
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm ml-1">
            Let TravelIt craft your journey ✈️
          </Text>
        </View>

        {/* Source */}
        <View className="mb-6">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Source City
          </Text>
          <Input
            value={form.source}
            placeholder="Mumbai"
            onChangeText={(t) => setForm({ ...form, source: t })}
            className="h-14"
          />
        </View>

        {/* Destination */}
        <View className="mb-6">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Destination
          </Text>
          <Input
            value={form.destination}
            placeholder="Tokyo"
            onChangeText={(t) => setForm({ ...form, destination: t })}
            className="h-14"
          />
        </View>

        {/* Duration + Budget */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1">
            <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
              Days
            </Text>
            <Input
              keyboardType="numeric"
              value={String(form.duration)}
              onChangeText={(t) => setForm({ ...form, duration: Number(t) || 1 })}
              className="h-14 text-center"
            />
          </View>

          <View className="flex-1">
            <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
              Max Budget
            </Text>
            <Input
              keyboardType="numeric"
              value={String(form.budget)}
              onChangeText={(t) => setForm({ ...form, budget: Number(t) || 0 })}
              className="h-14 text-center"
            />
          </View>
        </View>

        {/* Currency Picker */}
        <View className="mb-6">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Currency
          </Text>
          <View className="flex-row gap-2">
            {["USD", "EUR", "INR", "GBP"].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setForm({ ...form, currency: c })}
                style={{
                  backgroundColor: form.currency === c ? colors.primary : colors.card,
                  borderColor: colors.border,
                }}
                className="flex-1 border h-14 items-center justify-center"
              >
                <Text
                  style={{
                    color: form.currency === c ? colors.primaryText : colors.textMuted,
                  }}
                  className="font-bold uppercase text-xs"
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget Tier */}
        <View className="mb-6">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Budget Tier
          </Text>
          <View className="flex-row gap-2">
            {["low", "medium", "high"].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setForm({ ...form, budgetTier: opt })}
                style={{
                  backgroundColor: form.budgetTier === opt ? colors.primary : colors.card,
                  borderColor: colors.border,
                }}
                className="flex-1 border h-14 items-center justify-center"
              >
                <Text
                  style={{
                    color: form.budgetTier === opt ? colors.primaryText : colors.textMuted,
                  }}
                  className="font-bold uppercase text-xs"
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Travelers */}
        <View className="mb-6">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Number of Travelers
          </Text>
          <Input
            keyboardType="numeric"
            value={String(form.travelers)}
            onChangeText={(t) => setForm({ ...form, travelers: Number(t) || 1 })}
            className="h-14 text-center"
          />
        </View>

        {/* Age Group */}
        <View className="mb-6">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Age Category
          </Text>
          <View className="flex-row gap-2">
            {[
              ["young", "Young (18-25)"],
              ["adults", "Adults (25-45)"],
              ["family", "Family"],
              ["seniors", "Seniors"],
            ].map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setForm({ ...form, ageGroup: key })}
                style={{
                  backgroundColor: form.ageGroup === key ? colors.primary : colors.card,
                  borderColor: colors.border,
                }}
                className="flex-1 border h-12 items-center justify-center px-1"
              >
                <Text
                  style={{
                    color: form.ageGroup === key ? colors.primaryText : colors.textMuted,
                  }}
                  className="font-bold text-[10px] uppercase text-center"
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safe Mode */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
          className="flex-row items-center justify-between p-4 border rounded-md mb-8"
        >
          <View className="flex-row items-center gap-3">
            <View
              style={{ backgroundColor: colors.inputBg }}
              className="p-2 rounded-md"
            >
              <Sparkles size={18} color={colors.textMuted} />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="font-bold">
                Safety Mode
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">
                Safer picks for cautious / solo travelers
              </Text>
            </View>
          </View>

          <Switch
            value={form.safeMode}
            onValueChange={(v) => setForm({ ...form, safeMode: v })}
            trackColor={{
              false: colors.switchOff,
              true: colors.switchOn,
            }}
            thumbColor={colors.switchThumb}
          />
        </View>

        {/* Interests */}
        <View className="mb-8">
          <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">
            Interests (comma-separated)
          </Text>
          <Input
            placeholder="Food, Nightlife, Temples"
            value={form.interests}
            onChangeText={(t) => setForm({ ...form, interests: t })}
            className="h-14"
          />
        </View>

        {/* Generate */}
        <Button onPress={handleGenerate} disabled={isPending} className="h-14">
          {isPending ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color={colors.primaryText} />
              <Text style={{ color: colors.primaryText }} className="font-bold">
                Generating...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <Sparkles size={18} color={colors.primaryText} />
              <Text style={{ color: colors.primaryText }} className="font-bold">
                Generate
              </Text>
            </View>
          )}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}