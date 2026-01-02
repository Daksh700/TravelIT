import { View, Text, ScrollView, Image, Switch, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Settings, Bell, Heart, ChevronRight, CreditCard, HelpCircle } from "lucide-react-native";
import { useState } from "react";

import { Header } from "@/components/Header";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SignOutButton } from "@/components/SignOutButton";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const {data: user, isLoading} = useUserProfile();

  const router = useRouter();

  // 🔹 LOADING STATE UI
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#00dc82" />
        <Text className="text-zinc-500 text-sm mt-4">Loading profile…</Text>
      </SafeAreaView>
    );
  }

  // Menu Item
  const MenuItem = ({ icon: Icon, label, value, isSwitch = false, isDestructive = false }: any) => (
    <View
      className="flex-row items-center justify-between p-4 bg-surface border-b border-zinc-800"
    >
      <View className="flex-row items-center gap-4">
        <View className={`p-2 rounded-md ${isDestructive ? "bg-red-500/10" : "bg-zinc-900"}`}>
          <Icon size={20} color={isDestructive ? "#ef4444" : "white"} />
        </View>
        <Text className={`text-base font-bold ${isDestructive ? "text-red-500" : "text-white"}`}>
          {label}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: "#3f3f46", true: "#00dc82" }}
          thumbColor="white"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {value && <Text className="text-zinc-500 text-sm">{value}</Text>}
          <ChevronRight size={16} color="#52525b" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Header />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER */}
        <View className="items-center justify-center pt-8 pb-10 px-6">
          <View className="relative mb-4">
            <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
              <Image source={{ uri: user.avatar }} className="w-full h-full" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-white mb-1">{user.username}</Text>
          <Text className="text-zinc-500">{user.firstName} {user.lastName}</Text>
        </View>

        {/* MENUS */}
        <View className="px-6 mb-10">
          <Text className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3 ml-1">
            Account
          </Text>
          <View className="rounded-lg overflow-hidden border border-zinc-800 mb-8">
            <Pressable onPress={() => router.push('/profile/editProfile')}>
              <MenuItem icon={User} label="Edit Profile" />
            </Pressable>
            <MenuItem icon={CreditCard} label="Subscription" value="Active" />
            <MenuItem icon={Heart} label="Saved Preferences" />
          </View>

          <Text className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3 ml-1">
            Settings
          </Text>
          <View className="rounded-lg overflow-hidden border border-zinc-800 mb-8">
            <MenuItem icon={Bell} label="Notifications" isSwitch />
            <MenuItem icon={Settings} label="App Settings" />
            <MenuItem icon={HelpCircle} label="Help & Support" />
          </View>
        </View>

        {/* LOGOUT */}
        <SignOutButton />
      </ScrollView>
    </SafeAreaView>
  );
}