import { useAuthSync } from "@/hooks/useAuthSync";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Home, Compass, Plus, Map, User } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { useHaptics } from "@/hooks/useHaptics";

export default function TabsLayout() {
  const {handleImpact} = useHaptics();
  const { isSignedIn } = useAuth();
  const { handleAuthSync } = useAuthSync();
  const { colors } = useThemeColors();

  useEffect(() => {
    if (isSignedIn) {
      handleAuthSync();
    }
  }, [isSignedIn]);

  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },

        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,

        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 4,
          fontFamily: "System",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            handleImpact("soft")
          }
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? `${colors.primary}33`
                  : "transparent",
                padding: 8,
                borderRadius: 999,
              }}
            >
              <Plus size={24} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            handleImpact("soft")
          }
        }}
      />
    </Tabs>
  );
}