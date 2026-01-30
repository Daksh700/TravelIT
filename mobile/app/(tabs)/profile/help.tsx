import { ScrollView, Text, View, Pressable, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Mail,
  FileText,
  Shield,
  Info,
  ExternalLink,
} from "lucide-react-native";
import { useRouter } from "expo-router";

import { HELP_FAQS } from "@/data/helpFaqs";
import { FAQItem } from "@/components/FAQItem";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useHaptics } from "@/hooks/useHaptics";

export default function HelpScreen() {
  const {handleImpact} = useHaptics();
  const router = useRouter();
  const { colors } = useThemeColors();


  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
        <View
            style={{ borderBottomColor: colors.border }}
            className="flex-row items-center gap-4 px-6 py-4 border-b"
        >
            <Pressable
                onPress={() => { 
                handleImpact("soft");
                router.back();
                }}
            >
                <ArrowLeft size={22} color={colors.textMuted} />
            </Pressable>

            <View>
                <Text
                    style={{ color: colors.text }}
                    className="text-lg font-bold"
                >
                    Knowledge Base
                </Text>
                <Text
                style={{ color: colors.textMuted }}
                className="text-xs"
                >
                    Support logic & documentation
                </Text>
            </View>
        </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel label="Direct Communication" />

        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
          className="p-6 rounded-xl border mb-10"
        >
          <View className="flex-row items-center gap-4 mb-5">
            <View
              style={{ backgroundColor: colors.inputBg }}
              className="p-3 rounded-full"
            >
              <Mail size={22} color={colors.primary} />
            </View>

            <View>
              <Text
                style={{ color: colors.text }}
                className="text-base font-bold"
              >
                Email Support
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs mt-0.5"
              >
                Response within 24 hours
              </Text>
            </View>
          </View>

          <Pressable
            onPress={
              async () => {
                    handleImpact("medium");
                    const url = "mailto:support@travelit.ai";
                    try {
                      const supported = await Linking.canOpenURL(url);
                      if (supported) {
                        await Linking.openURL(url);
                      } else {
                        Alert.alert("Cannot open mail client", "No mail client is configured on this device.");
                      }
                    } catch (err) {
                      console.warn("Failed to open URL", err);
                      Alert.alert("Error", "Unable to open mail app.");
                    }
              }
            }
            style={{
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
            }}
            className="py-3.5 rounded-lg border flex-row items-center justify-center gap-2"
          >
            <Text
              style={{ color: colors.primary }}
              className="font-bold text-sm"
            >
              support@travelit.ai
            </Text>
            <ExternalLink size={14} color={colors.textMuted} />
          </Pressable>
        </View>

        <SectionLabel label="Common Queries" />

        <View
          style={{ borderColor: colors.border }}
          className="rounded-xl overflow-hidden border mb-10"
        >
          {HELP_FAQS.map((faq, index) => (
            <FAQItem 
                key={index} 
                {...faq} 
                isLast={index === HELP_FAQS.length - 1}
            />
          ))}
        </View>

        <SectionLabel label="Resources" />

        <View
          style={{ borderColor: colors.border }}
          className="rounded-xl overflow-hidden border mb-12"
        >
          <ResourceItem
            icon={FileText}
            label="Terms of Service"
            onPress={() => {
                handleImpact("soft");
                Linking.openURL("https://travelit.ai/terms")
            }}
          />
          <ResourceItem
            icon={Shield}
            label="Privacy Policy"
            onPress={() => {
                handleImpact("soft");
                Linking.openURL("https://travelit.ai/privacy")
            }}
          />
          <ResourceItem
            icon={Info}
            label="Community Guidelines"
            onPress={() => {
                handleImpact("soft");
                Linking.openURL("https://travelit.ai/guidelines")
            }}
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionLabel = ({ label }: { label: string }) => {
  const { colors } = useThemeColors();

  return (
    <Text
      style={{ color: colors.textMuted }}
      className="text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1"
    >
      {label}
    </Text>
  );
};

const ResourceItem = ({
  icon: Icon,
  label,
  onPress,
  isLast,
}: any) => {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderBottomColor: isLast ? "transparent" : colors.border,
      }}
      className="flex-row items-center justify-between p-4 border-b"
    >
      <View className="flex-row items-center gap-3">
        <Icon size={18} color={colors.textMuted} />
        <Text
          style={{ color: colors.text }}
          className="text-sm font-medium"
        >
          {label}
        </Text>
      </View>

      <ExternalLink size={14} color={colors.textMuted} />
    </Pressable>
  );
};