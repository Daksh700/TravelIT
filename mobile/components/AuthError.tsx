import { Text } from "react-native";

export const AuthError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <Text className="text-red-500 text-xs font-bold text-center mt-3 uppercase tracking-wider">
      {message}
    </Text>
  );
};