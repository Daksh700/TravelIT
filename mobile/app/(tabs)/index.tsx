import { ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useRouter } from "expo-router";
import { ArrowRight, Globe, Sun, Wind } from "lucide-react-native";
import { Header } from "@/components/Header";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <Header />
            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        
                {/* 1. Hero Section */}
                <View className="mt-3 mb-10 space-y-4">
                    <Text className="text-5xl font-bold text-white leading-tight">
                        Design your{"\n"}
                        <Text className="text-primary">next escape.</Text>
                    </Text>
                    <Text className="text-zinc-400 text-lg">
                        AI-powered itineraries for the modern traveler.
                    </Text>

                    <Button 
                        onPress={() => router.push("..")}
                        className="mt-4 flex-row gap-2"
                    >
                        <Text className="font-bold text-base text-black">Start Planning</Text>
                        <ArrowRight size={20} color="black" />
                    </Button>
                </View>

                {/* 2. Trending Section */}
                <View className="mb-8"> 
                    <Text className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-4">
                        Trending Now
                    </Text>

                    <View className="flex-row flex-wrap gap-4">
                        
                        {/* Kyoto Card (Fixed Sharp & Aligned) */}
                        <View className="w-full h-64 overflow-hidden border border-border bg-surface">
                            <ImageBackground 
                                source={{ uri: "https://picsum.photos/800/600" }} 
                                className="w-full h-full justify-end p-5"
                                resizeMode="cover"
                            >
                                <View className="absolute inset-0 bg-black/30" />
                                <Text className="text-primary font-bold text-xs uppercase mb-1 tracking-wider">
                                    Culture
                                </Text>
                                <Text className="text-3xl font-bold text-white shadow-sm">
                                    Kyoto, Japan
                                </Text>
                            </ImageBackground>
                        </View>

                        {/* Bali Card */}
                        <Card className="flex-1 bg-surface border border-border justify-between min-h-[120px]">
                            <Sun size={24} color="#eab308" />
                            <View>
                                <Text className="text-xs text-zinc-500">Relax</Text>
                                <Text className="font-bold text-white text-lg">Bali</Text>
                            </View>
                        </Card>

                        {/* Iceland Card */}
                        <Card className="flex-1 bg-surface border border-border justify-between min-h-[120px]">
                            <Wind size={24} color="#60a5fa" />
                            <View>
                                <Text className="text-xs text-zinc-500">Adventure</Text>
                                <Text className="font-bold text-white text-lg">Iceland</Text>
                            </View>
                        </Card>

                        {/* Pro Tip Card */}
                        <Card className="w-full bg-secondary/10 border-secondary/20 flex-row items-center justify-between">
                            <View>
                                <Text className="text-xs text-secondary font-bold uppercase">Pro Tip</Text>
                                <Text className="text-zinc-300 font-medium">Use {"Local Gems"} in prompt.</Text>
                            </View>
                            <Globe size={32} color="#0070f3" style={{ opacity: 0.5 }} />
                        </Card>

                    </View>
                </View>

                {/* 3. Stats Section */}
                <View className="mb-6 pb-8">
                    <Text className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-4">Your Stats</Text>
                    <View className="flex-row gap-4">
                        <View className="flex-1 bg-surface border border-border p-4">
                            <Text className="text-3xl font-bold text-white">0</Text>
                            <Text className="text-xs text-zinc-500 uppercase mt-1">Trips Planned</Text>
                        </View>
                        <View className="flex-1 bg-surface border border-border p-4">
                            <Text className="text-3xl font-bold text-white">0</Text>
                            <Text className="text-xs text-zinc-500 uppercase mt-1">Trips Completed</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}