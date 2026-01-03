import { useAppSettings } from "@/store/useAppSettings";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export const useSystemThemeSync = () => {
    const colorScheme = useColorScheme();
    const {systemTheme, setDarkMode} = useAppSettings();

    useEffect(() => {
        if(systemTheme === true) {
            if(colorScheme === "dark") {
                setDarkMode(true)
            }
            else if(colorScheme === "light") {
                setDarkMode(false);
            }
        }
    }, [systemTheme, colorScheme])
}