import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";

type Props = {
    icon: React.ReactNode;
    label: string;
    selected: boolean;
    onPress: () => void;
    theme: {
        card: string;
        text: string;
        muted: string;
        border: string;
        accent: string;
    }
};

export function PaymentOption({icon, label, selected, onPress, theme}: Props) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityState={{selected}}
            accessibilityLabel={label}
            accessibilityHint="Selects this payment method"
            style={[
                styles.option,
                { backgroundColor: theme.card, borderColor: theme.border },
            ]}
        >
            <View style={styles.optionLeft}>
                <View style={styles.optionIcon} accessible={false}>{icon}</View>
                <Text style={[styles.optionLabel, { color: theme.text }]}>{label}</Text>
            </View>

            <View style={[styles.radioOuter, { borderColor: selected ? theme.accent : theme.muted }]} accessible={false}>
                {selected ? <View style={[styles.radioInner, { backgroundColor: theme.accent }]} /> : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    option: {
        minHeight: 54,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
        paddingRight: 10,
    },
    optionIcon: {
        width: 28,
        alignItems: "center",
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: "500",
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});