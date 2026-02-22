import { TextInput, View, Text, TextInputProps, StyleProp, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

interface InputProps extends TextInputProps {
  label?: string;
  className?: string; 
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = ({ label, className, containerStyle, ...props }: InputProps) => {
  const { colors } = useThemeColors();

  return (
    <View style={{ width: "100%", marginBottom: 12 }}>
      {label && (
        <Text
          style={{ color: colors.textMuted }}
          className="text-xs font-bold uppercase tracking-widest mb-2"
        >
          {label}
        </Text>
      )}

      <TextInput
        {...props}
        placeholderTextColor={colors.textMuted}
        style={{
          backgroundColor: colors.surface,
          color: colors.text,
          borderColor: colors.border,
        }}
        className={`
          px-4 py-3 text-base w-full rounded-sm border
          ${className ?? ""}
        `}
      />
    </View>
  );
};