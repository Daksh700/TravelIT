import { useAppSettings } from "@/store/useAppSettings";

export const useThemeColors = () => {
    const { darkMode } = useAppSettings();

    const lightColors = {
        background: "#ffffff",
        surface: "#f4f4f5",
        card: "#ffffff",

        text: "#000000",
        textSecondary: "#52525b",
        textMuted: "#71717a",
        placeholder: "#9ca3af",

        border: "#e5e7eb",
        divider: "#e5e7eb",
        inputBg: "#ffffff",

        primary: "#00dc82",
        primaryText: "#000000",

        secondary: "#0070f3",

        danger: "#ef4444",
        success: "#22c55e",

        // ✅ Switch
        switchOn: "#00dc82",
        switchOff: "#d4d4d8",
        switchThumb: "#ffffff",

        tabBarBg: "#ffffff",
        tabBarBorder: "#e5e7eb",
        tabActive: "#00dc82",
        tabInactive: "#9ca3af",
    };

    const darkColors = {
        background: "#050505",
        surface: "#0a0a0a",
        card: "#0a0a0a",

        text: "#ffffff",
        textSecondary: "#d4d4d8",
        textMuted: "#a1a1aa",
        placeholder: "#71717a",

        border: "#27272a",
        divider: "#27272a",
        inputBg: "#0a0a0a",

        primary: "#00dc82",
        primaryText: "#000000",

        secondary: "#0070f3",

        danger: "#ef4444",
        success: "#22c55e",

        // ✅ Switch
        switchOn: "#00dc82",
        switchOff: "#52525b",
        switchThumb: "#ffffff",

        tabBarBg: "#050505",
        tabBarBorder: "#27272a",
        tabActive: "#00dc82",
        tabInactive: "#71717a",
    };
    return {
        colors: darkMode ? darkColors : lightColors,
        isDark: darkMode,
    };
};