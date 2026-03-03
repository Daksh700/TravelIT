import { Stack } from "expo-router";

export default function ProfileStackLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="editProfile"/>
            <Stack.Screen name="savedPreferences"/>
            <Stack.Screen name="appSettings"/>
            <Stack.Screen name="help"/>
        </Stack>
    )
}