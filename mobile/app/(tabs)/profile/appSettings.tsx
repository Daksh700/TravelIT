import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Moon, Sun, Zap, Monitor } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useAppSettings } from "@/store/useAppSettings";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useHaptics } from "@/hooks/useHaptics";

const SettingToggle = ({
  icon: Icon,
  label,
  description,
  value,
  onToggle,
  disabled
}: any) => {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={{
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
        opacity: disabled ? 0.5: 1,
      }}
      className="flex-row items-center justify-between p-4 border-b"
    > 
      <View className="flex-row items-center gap-4">
        <View
          style={{ backgroundColor: colors.inputBg }}
          className="p-2 rounded-md"
        >
          <Icon size={20} color={value ? colors.primary : colors.textMuted} />
        </View>

        <View>
          <Text
            style={{ color: colors.text }}
            className="text-base font-bold"
          >
            {label}
          </Text>
          <Text
            style={{ color: colors.textMuted }}
            className="text-[10px] uppercase tracking-widest"
          >
            {description}
          </Text>
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.switchOff, true: colors.primary }}
        thumbColor={colors.switchThumb}
        disabled={disabled}
      />
    </Pressable>
  );
};

export default function AppSettingsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const {handleImpact} = useHaptics();

  const {
    darkMode,
    systemTheme,
    haptics,
    toggleDarkMode,
    toggleSystemTheme,
    toggleHaptics,
  } = useAppSettings();

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={{ borderBottomColor: colors.border }}
        className="flex-row items-center gap-4 px-6 py-4 border-b"
      >
        <Pressable onPress={() => {
            handleImpact("light");
            router.back()
          }}>
          <ArrowLeft size={22} color={colors.textMuted} />
        </Pressable>

        <View>
          <Text
            style={{ color: colors.text }}
            className="text-lg font-bold"
          >
            App Settings
          </Text>
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs"
          >
            Configure your interface logic
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Appearance */}
        <Text
          style={{ color: colors.textMuted }}
          className="text-xs font-bold uppercase tracking-widest mb-3"
        >
          Appearance
        </Text>

        <View
          style={{ borderColor: colors.border }}
          className="rounded-xl overflow-hidden border mb-8"
        >
          <SettingToggle
            icon={darkMode ? Moon : Sun}
            label="Dark Mode"
            description={darkMode ? "Eyes protected" : "Daylight mode active"}
            value={darkMode}
            onToggle={() => {
              handleImpact("light");
              toggleDarkMode();
            }}
            disabled={systemTheme}
          />

          <SettingToggle
            icon={Monitor}
            label="System Theme"
            description="Sync with device OS"
            value={systemTheme}
            onToggle={() => {
              handleImpact("light");
              toggleSystemTheme();
            }}
          />
        </View>

        {/* Feedback */}
        <Text
          style={{ color: colors.textMuted }}
          className="text-xs font-bold uppercase tracking-widest mb-3"
        >
          Feedback
        </Text>

        <View
          style={{ borderColor: colors.border }}
          className="rounded-xl overflow-hidden border mb-8"
        >
          <SettingToggle
            icon={Zap}
            label="Haptic Feedback"
            description="Tactile interface response"
            value={haptics}
            onToggle={() => {
              handleImpact("light");
              toggleHaptics();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}