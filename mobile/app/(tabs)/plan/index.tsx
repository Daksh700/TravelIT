import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity, Switch, Modal } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Sparkles, Calendar as CalendarIcon, Lock } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useGenerateItinerary } from "@/hooks/useGenerateItinerary";
import DateTimePicker from "@react-native-community/datetimepicker";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from "react-native-reanimated";

export default function CreateTripScreen() {
  const { colors } = useThemeColors();
  const { mutate: generate, isPending } = useGenerateItinerary();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const progress = useSharedValue(0);

  useEffect(() => {
    if (step === 1) progress.value = withTiming(0, { duration: 400 });
    if (step === 2) progress.value = withTiming(0.5, { duration: 400 });
    if (step === 3) progress.value = withTiming(1, { duration: 400 });
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const [form, setForm] = useState({
    source: "",
    destination: "",
    duration: 3,
    budgetTier: "low",
    budget: 500,
    currency: "USD",

    tripStartDate: "",
    tripEndDate: "",
    checkInDate: "",
    checkOutDate: "",

    interests: "",
    travelers: 1,
    ageGroup: "adults",
    safeMode: false,
  });

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const [pickerConfig, setPickerConfig] = useState<{
    field: "tripStartDate" | "checkInDate" | null;
    value: Date;
    minDate?: Date;
    maxDate?: Date;
  } | null>(null);

  const openDatePicker = (field: "tripStartDate" | "checkInDate") => {
    let minDate = new Date();
    let maxDate = undefined;
    let value = new Date();

    if (field === "tripStartDate") {
      minDate = new Date();
      value = form.tripStartDate ? new Date(form.tripStartDate) : new Date();
    } else if (field === "checkInDate") {
      if (!form.tripStartDate) return;
      minDate = new Date(form.tripStartDate);
      maxDate = new Date(form.tripEndDate);
      value = form.checkInDate ? new Date(form.checkInDate) : minDate;
    }

    setPickerConfig({ field, value, minDate, maxDate });
  };

  const handleDateConfirm = (event: any, selectedDate?: Date) => {
    if (!selectedDate || !pickerConfig) {
      setPickerConfig(null);
      return;
    }

    const formatted = formatDate(selectedDate);
    
    if (pickerConfig.field === "tripStartDate") {
      const endDate = addDays(selectedDate, Math.max(0, form.duration - 1));
      const endFormatted = formatDate(endDate);

      setForm({
        ...form,
        tripStartDate: formatted,
        tripEndDate: endFormatted,
        checkInDate: formatted,
        checkOutDate: endFormatted,
      });
    } else if (pickerConfig.field === "checkInDate") {
      setForm({ ...form, checkInDate: formatted });
    }

    setPickerConfig(null);
  };

  const step1Valid =
    form.source.trim().length > 0 &&
    form.destination.trim().length > 0 &&
    form.duration > 0 &&
    form.budget > 0;

  const step2Valid =
    form.tripStartDate &&
    form.tripEndDate &&
    form.checkInDate &&
    form.checkOutDate;

  const step3Valid = true; 

  const handleGenerate = () => {
    generate({
      ...form,
      duration: Number(form.duration),
      budget: Number(form.budget),
      travelers: Number(form.travelers),
      interests: form.interests
        ? form.interests.split(",").map((i) => i.trim())
        : [],
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1" edges={["top"]}>
      <Header />

      <View className="mx-6 mt-6 mb-2">
        <View style={{ position: "relative" }}>
          <View
            style={{
              position: "absolute",
              top: 13,
              left: 14,
              right: 14,
              height: 2,
              zIndex: 0,
            }}
          >
            <View style={{ flex: 1, backgroundColor: colors.border, height: "100%" }}>
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: colors.primary,
                    },
                    progressStyle,
                  ]}
                />
            </View>
          </View>

          <View className="flex-row justify-between" style={{ zIndex: 10 }}>
            {[1, 2, 3].map((num) => {
              const active = step >= num;
              return (
                <View
                  key={num}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    backgroundColor: active ? colors.primary : colors.background,
                    borderWidth: 2,
                    borderColor: active ? colors.primary : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.primaryText : colors.textMuted,
                      fontWeight: "bold",
                    }}
                  >
                    {num}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mb-8">
          <Text style={{ color: colors.text }} className="text-3xl font-bold tracking-tight mb-1">Create Trip</Text>
          <Text style={{ color: colors.textMuted }} className="text-sm ml-1">Let TravelIt craft your journey ✈️</Text>
        </View>

        {step === 1 && (
          <Animated.View entering={FadeIn}>
            
            <View className="mb-4"> 
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Source City</Text>
              <Input value={form.source} placeholder="Mumbai" onChangeText={(t) => setForm({ ...form, source: t })} className="h-14" />
            </View>

            <View className="mb-4">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Destination</Text>
              <Input value={form.destination} placeholder="Tokyo" onChangeText={(t) => setForm({ ...form, destination: t })} className="h-14" />
            </View>

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Days</Text>
                <Input keyboardType="numeric" value={String(form.duration)} onChangeText={(t) => setForm({ ...form, duration: Number(t) || 1 })} className="h-14 text-center" />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Max Budget</Text>
                <Input keyboardType="numeric" value={String(form.budget)} onChangeText={(t) => setForm({ ...form, budget: Number(t) || 0 })} className="h-14 text-center" />
              </View>
            </View>

            <View className="mb-8">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Currency</Text>
              <View className="flex-row gap-2">
                {["USD", "EUR", "INR", "GBP"].map((c) => (
                  <TouchableOpacity key={c} onPress={() => setForm({ ...form, currency: c })} style={{ backgroundColor: form.currency === c ? colors.primary : colors.card, borderColor: colors.border }} className="flex-1 border h-14 items-center justify-center">
                    <Text style={{ color: form.currency === c ? colors.primaryText : colors.textMuted }} className="font-bold uppercase text-xs">{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-8">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Budget Tier</Text>
              <View className="flex-row gap-2">
                {["low", "medium", "high"].map((opt) => (
                  <TouchableOpacity key={opt} onPress={() => setForm({ ...form, budgetTier: opt })} style={{ backgroundColor: form.budgetTier === opt ? colors.primary : colors.card, borderColor: colors.border }} className="flex-1 border h-14 items-center justify-center">
                    <Text style={{ color: form.budgetTier === opt ? colors.primaryText : colors.textMuted }} className="font-bold uppercase text-xs">{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button disabled={!step1Valid} onPress={() => setStep(2)} title="Next →" className="h-14" />
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeIn}>
            <TouchableOpacity onPress={() => openDatePicker("tripStartDate")} className="mb-4">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Trip Start Date</Text>
              <View className="h-14 border px-4 flex-row items-center justify-between" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
                <Text style={{ color: colors.text }}>{form.tripStartDate || "Select Start Date"}</Text>
                <CalendarIcon size={18} color={colors.textMuted} />
              </View>
            </TouchableOpacity>

            <View className="mb-6 opacity-60">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Trip End Date (Auto)</Text>
              <View className="h-14 border px-4 flex-row items-center justify-between" style={{ borderColor: colors.border, backgroundColor: colors.inputBg }}>
                <Text style={{ color: colors.textMuted }}>{form.tripEndDate || "Calculated from duration"}</Text>
                <Lock size={16} color={colors.textMuted} />
              </View>
            </View>

            <View className="flex-row gap-4 mb-6">
              <TouchableOpacity onPress={() => openDatePicker("checkInDate")} className="flex-1">
                <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Hotel Check-in</Text>
                <View className="h-14 border justify-center px-3" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
                  <Text style={{ color: colors.text, fontSize: 13 }}>{form.checkInDate || "Select"}</Text>
                </View>
              </TouchableOpacity>

              <View className="flex-1 opacity-60">
                <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Check-out</Text>
                <View className="h-14 border px-3 flex-row items-center justify-between" style={{ borderColor: colors.border, backgroundColor: colors.inputBg }}>
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>{form.checkOutDate || "Auto"}</Text>
                  <Lock size={14} color={colors.textMuted} />
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Number of Travelers</Text>
              <Input keyboardType="numeric" value={String(form.travelers)} onChangeText={(t) => setForm({ ...form, travelers: Number(t) || 1 })} className="h-14 text-center" />
            </View>

            <View className="mb-8">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Age Category</Text>
              <View className="flex-row gap-2">
                {[ ["young", "Young (18-25)"],
                    ["adults", "Adults (25-45)"],
                    ["family", "Family"],
                    ["seniors", "Seniors"]  ].map(([key, label]) => (
                  <TouchableOpacity key={key} onPress={() => setForm({ ...form, ageGroup: key })} style={{ backgroundColor: form.ageGroup === key ? colors.primary : colors.card, borderColor: colors.border }} className="flex-1 border h-12 items-center justify-center px-1">
                    <Text style={{ color: form.ageGroup === key ? colors.primaryText : colors.textMuted }} className="font-bold text-[10px] uppercase text-center">{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-4">
              <Button onPress={() => setStep(1)} title="Back" className="flex-1" />
              <Button onPress={() => setStep(3)} disabled={!step2Valid} title="Next →" className="flex-1" />
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeIn}>
            <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="flex-row items-center justify-between p-4 border rounded-md mb-8">
              <View className="flex-row items-center gap-3">
                <View style={{ backgroundColor: colors.inputBg }} className="p-2 rounded-md">
                  <Sparkles size={18} color={colors.textMuted} />
                </View>
                <View>
                  <Text style={{ color: colors.text }} className="font-bold">Safety Mode</Text>
                  <Text style={{ color: colors.textSecondary }} className="text-xs">Safer picks for cautious / solo travelers</Text>
                </View>
              </View>
              <Switch value={form.safeMode} onValueChange={(v) => setForm({ ...form, safeMode: v })} trackColor={{ false: colors.switchOff, true: colors.switchOn }} thumbColor={colors.switchThumb} />
            </View>

            <View className="mb-8">
              <Text style={{ color: colors.textMuted }} className="uppercase text-[11px] font-bold mb-2">Interests (comma-separated)</Text>
              <Input placeholder="Food, Nightlife, Temples" value={form.interests} onChangeText={(t) => setForm({ ...form, interests: t })} className="h-14" />
            </View>

            <View className="flex-row gap-4 mt-4">
              <Button onPress={() => setStep(2)} title="Back" className="flex-1" />
              <Button onPress={handleGenerate} disabled={!step3Valid || isPending} title={isPending ? "Generating..." : "Generate Trip"} className="flex-1" />
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {pickerConfig && (
        <Modal transparent animationType="fade" visible={true} onRequestClose={() => setPickerConfig(null)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ backgroundColor: "white", borderRadius: 16, padding: 10, width: "90%", maxWidth: 350 }}>
              <DateTimePicker
                value={pickerConfig.value}
                mode="date"
                display="inline"
                minimumDate={pickerConfig.minDate}
                maximumDate={pickerConfig.maxDate}
                onChange={handleDateConfirm}
              />
              <TouchableOpacity onPress={() => setPickerConfig(null)} style={{ padding: 12, alignItems: "center" }}>
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}