import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";

type Props = {
    iconName: ComponentProps<typeof Ionicons>["name"];
    color: string;
}

export function AnimatedLogo({ iconName, color }: Props) {
    const { ring1Style, ring2Style } = usePulseAnimation();

    return (
        <View style={styles.logoWrap}>
            <Animated.View style={[styles.pulseRing, ring2Style, { borderColor: color }]} />
            <Animated.View style={[styles.pulseRing, ring1Style, { borderColor: color }]} />
            <View style={[styles.logoCircle, { borderColor: color }]}>
                <Ionicons name={iconName} size={64} color={color} accessible={false} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logoWrap: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
        marginBottom: 20,
        height: 160,
    },
    pulseRing: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
    },
    logoCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
});