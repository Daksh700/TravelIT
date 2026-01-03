import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"


type AppSettingsState = {
    darkMode: boolean;
    systemTheme: boolean;
    haptics: boolean;

    toggleDarkMode: () => void;
    toggleSystemTheme: () => void;
    toggleHaptics: () => void;

    setDarkMode: (val: boolean) => void;
}

export const useAppSettings = create<AppSettingsState>() (
    persist(
        (set) => ({
            darkMode: true,
            systemTheme: true,
            haptics: true,

            toggleDarkMode: () => 
                set((state) => ({darkMode: !state.darkMode})),

            toggleSystemTheme: () => 
                set((state) => ({systemTheme: !state.systemTheme})),

            toggleHaptics: () => 
                set((state) => ({haptics: !state.haptics})),

            setDarkMode: (val: boolean) => 
                set({darkMode: val}),
        }),
        {
            name: "app_settings",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
