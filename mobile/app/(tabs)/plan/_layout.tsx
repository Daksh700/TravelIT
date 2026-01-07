import { Stack } from "expo-router";

export default function PlanStackLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="result"/>
        </Stack>
    )
}