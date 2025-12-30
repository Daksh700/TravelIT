import { Text, View } from "react-native";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export const SectionHeader = ({title, subtitle}: SectionHeaderProps) => {
    return (
        <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-1">
                <View className="w-2 h-2 bg-primary">
                    <Text className="text-2xl font-bold text-white uppercase tracking-tighter">
                        {title}
                    </Text>
                </View>
            </View>
            { 
                subtitle && <Text className="text-zinc-500 text-sm ml-4">{subtitle}</Text>
            }
        </View>
    )
}