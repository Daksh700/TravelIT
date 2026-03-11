import {
  View,
  Text,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Settings,
  Bell,
  Heart,
  ChevronRight,
  CreditCard,
  HelpCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { Header } from "@/components/Header";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SignOutButton } from "@/components/SignOutButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useHaptics } from "@/hooks/useHaptics";
import { useAuth } from "@clerk/clerk-expo";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { savePushToken } from "@/services/user";

export default function ProfileScreen() {
  const {handleImpact} = useHaptics();
  const { data: user, isLoading } = useUserProfile();
  const router = useRouter();
  const { colors } = useThemeColors();
  const { getToken } = useAuth();

  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      setNotifications(!!user.pushToken);
    }
  }, [user]);

  const handleNotificationToggle = async (newValue: boolean) => {
    setNotifications(newValue);
    handleImpact("light");

    try {
      const token = await getToken();
      if (!token) return;

      if (newValue) {
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          await savePushToken(token, pushToken);
        } else {
          setNotifications(false);
          Alert.alert(
            "Permission Required", 
            "Please enable notifications for TravelIt in your phone's settings."
          );
        }
      } else {
        await savePushToken(token, ""); 
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      setNotifications(!newValue);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textMuted }} className="text-sm mt-4">
          Loading profile…
        </Text>
      </SafeAreaView>
    );
  }

  const MenuItem = ({ icon: Icon, label, value, isSwitch = false }: any) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
      }}
      className="flex-row items-center justify-between p-4 border-b"
    >
      <View className="flex-row items-center gap-4">
        <View
          style={{ backgroundColor: colors.inputBg }}
          className="p-2 rounded-md"
        >
          <Icon size={20} color={colors.textMuted} />
        </View>

        <Text style={{ color: colors.text }} className="text-base font-bold">
          {label}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          value={notifications}
          onValueChange={handleNotificationToggle}
          trackColor={{
            false: colors.switchOff,
            true: colors.switchOn,
          }}
          thumbColor={colors.switchThumb}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {value && (
            <Text style={{ color: colors.textMuted }} className="text-sm">
              {value}
            </Text>
          )}
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["top"]}
    >
      <Header />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center justify-center pt-8 pb-10 px-6">
          <View className="mb-4">
            <View
              style={{ borderColor: colors.primary }}
              className="w-24 h-24 rounded-full overflow-hidden border-2"
            >
              <Image source={{ uri: user.avatar }} className="w-full h-full" />
            </View>
          </View>

          <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
            {user.username}
          </Text>

          <Text style={{ color: colors.textMuted }}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        <View className="px-6 mb-10">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-bold uppercase tracking-widest mb-3 ml-1"
          >
            Account
          </Text>

          <View
            style={{ borderColor: colors.border }}
            className="rounded-lg overflow-hidden border mb-8"
          >
            <Pressable onPress={() => {
              handleImpact("soft")
              router.push("/profile/editProfile");
            }}>
              <MenuItem icon={User} label="Edit Profile" />
            </Pressable>

            <Pressable onPress={() => {
              handleImpact("soft");
              router.push("/(tabs)/profile/subscription");
            }}>
              <MenuItem 
                icon={CreditCard} 
                label="Subscription" 
                value={user?.isPro ? "Pro Active" : "Free Plan"} 
              />
            </Pressable>
            <Pressable onPress={() => {
              handleImpact("soft");
              router.push("/(tabs)/profile/savedPreferences")
            }}>
              <MenuItem icon={Heart} label="Saved Preferences" />
            </Pressable>
          </View>

          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-bold uppercase tracking-widest mb-3 ml-1"
          >
            Settings
          </Text>

          <View
            style={{ borderColor: colors.border }}
            className="rounded-lg overflow-hidden border mb-8"
          >
            <MenuItem icon={Bell} label="Notifications" isSwitch />

            <Pressable onPress={() => {
              handleImpact("soft");
              router.push("/(tabs)/profile/appSettings")
            }}>
              <MenuItem icon={Settings} label="App Settings" />
            </Pressable>

            <Pressable onPress={() => {
              handleImpact("soft");
              router.push("/(tabs)/profile/help")
            }}>
              <MenuItem icon={HelpCircle} label="Help & Support" />
            </Pressable>
          </View>
        </View>

        <SignOutButton />
      </ScrollView>
    </SafeAreaView>
  );
}