import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
    className?: string;
}

export const Card = ({ children, className, ...props}: CardProps) => {
    return (
        <View
            className={`bg-surface border border-border p-4 ${className}`}
            {...props}
        >
            {children}
        </View>
    )
}

