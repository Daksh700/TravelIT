import { TextInput, View, Text, TextInputProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

interface InputProps extends TextInputProps {
  label?: string;
  className?: string; 
}

export const Input = ({ label, className, ...props }: InputProps) => {
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
        placeholderTextColor={colors.placeholder}
        style={{
          backgroundColor: colors.inputBg,
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