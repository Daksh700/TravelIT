import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    title?: string;
    onPress: () => void;
    variant?: "primary" | "outline" | "ghost";
    isLoading?: boolean;
    children?: React.ReactNode;
    className?: string; // Custom styles override karne ke liye
    disabled?: boolean;
}

export const Button = ({ title, onPress, variant = "primary", isLoading, children, className, disabled } : ButtonProps) => {
    let containerStyle = "p-4 flex-row items-center justify-center";
    let textStyle = "font-bold text-base";

    if(variant === "primary") {
        containerStyle += " bg-primary";
        textStyle += " text-black";
    }
    else if(variant === "outline") {
        containerStyle += " border border-zinc-700 bg-transparent";
        textStyle += " text-white";
    }
    else if(variant === "ghost") {
        containerStyle += " bg-transparent";
        textStyle += " text-zinc-400";
    }

    const opacity = (disabled || isLoading) ? "opacity-50" : "opacity-100";

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || isLoading}
            className={`${containerStyle} ${opacity} ${className}`}
        >
            {
                isLoading ? (
                    <ActivityIndicator color={variant === "primary" ? "black" : "white"}/>
                ) : (
                    <>
                        {
                            children ? children : <Text className={textStyle}>{title}</Text>
                        }
                    </>
                )
            }
        </TouchableOpacity>
    )

}