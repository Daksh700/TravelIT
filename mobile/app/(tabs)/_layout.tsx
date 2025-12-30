import { useAuthSync } from "@/hooks/useAuthSync";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Home, Compass, Plus, Map, User } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";

export default function TabsLayout()  {

    const { isSignedIn } = useAuth();
    const {handleAuthSync} = useAuthSync();

    useEffect(() => {
        if(isSignedIn) {
            handleAuthSync();
        }
    }, [isSignedIn]);

    if(!isSignedIn) return <Redirect href="/(auth)/sign-in" />  
    
    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: "#050505", 
                borderTopWidth: 1,
                borderTopColor: "#27272a", 
                height: 70, 
                paddingTop: 10,
                paddingBottom: 10,
            },
            tabBarActiveTintColor: "#00dc82", 
            tabBarInactiveTintColor: "#71717a", 
            tabBarLabelStyle: {
                fontSize: 10,
                marginTop: 4,
                fontFamily: "System", 
            }
        }}>
            <Tabs.Screen 
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Home 
                            size={24} 
                            color={color}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="explore"
                options={{
                    tabBarIcon: ({color}) => (
                        <Compass 
                            size={24}
                            color={color}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="plan"
                options={{
                    tabBarIcon: ({color, focused}) => (
                        <View className={`p-2 rounded-full ${focused ? 'bg-primary/20' : ''}`}>
                            <Plus size={24} color={color} strokeWidth={2.5}/>
                        </View>
                    )
                }}
            />

            <Tabs.Screen 
                name="trips"
                options={{
                    title: "Trips",
                    tabBarIcon: ({color}) => (
                        <Map size={24} color={color}/>
                    )
                }}
            />

            <Tabs.Screen 
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({color}) => (
                        <User size={24} color={color}/>
                    )
                }}
            />
        </Tabs>
    )
}