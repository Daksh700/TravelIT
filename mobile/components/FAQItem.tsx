import { useThemeColors } from "@/hooks/useThemeColors";
import { Text, View } from "react-native";

interface FAQItemProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

export const FAQItem = ({ question, answer, isLast }: FAQItemProps) => {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        borderBottomColor: isLast ? "transparent" : colors.border,
      }}
      className="p-5 border-b"
    >
      <Text
        style={{ color: colors.text }}
        className="text-sm font-bold mb-2"
      >
        {question}
      </Text>

      <Text
        style={{ color: colors.textMuted }}
        className="text-xs leading-relaxed"
      >
        {answer}
      </Text>
    </View>
  );
};