import { TextInput, View, Text, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  className?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <View className="space-y-2 w-full">
      {label && <Text className="text-xs font-bold uppercase text-zinc-500 tracking-widest">{label}</Text>}
      <TextInput
        placeholderTextColor="#71717a"
        className={`bg-surface border border-border text-white px-4 py-3 text-base w-full ${className}`}
        {...props}
      />
    </View>
  );
};