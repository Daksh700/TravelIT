import * as Haptics from 'expo-haptics'
import { useAppSettings } from '@/store/useAppSettings'

type ImpactType = "soft" | "light" | "medium" | "heavy" | "rigid"

export const useHaptics = () => {
    const {haptics} = useAppSettings();
    
    const handleImpact = (impact: ImpactType) => {
        if(!haptics) return;

        switch (impact) {
            case "soft":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
                break;
            case "light":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                break;
            case "medium":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                break;
            case "heavy":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                break;
            case "rigid":
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
                break;
            default:
                break;
        }
    }

    return {handleImpact}
}