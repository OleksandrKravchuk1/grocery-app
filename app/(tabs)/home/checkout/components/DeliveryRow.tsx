import {Pressable, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    selected: boolean;
    onPress: () => void;
    color: string;
    borderColor: string;
    accent: string;
}

export const DeliveryRow = ({icon, label, selected, onPress, color, borderColor, accent}: Props) => {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityState={{selected}}
            accessibilityLabel={label}
            accessibilityHint="Selects this delivery option"
            style={[styles.row, {borderBottomColor: borderColor, borderBottomWidth: 1}]}
        >
            <View style={styles.rowLeft}>
                <Ionicons name={icon} size={20} color={color} accessible={false}/>
                <Text style={[styles.rowLabel, {color}]}>{label}</Text>
            </View>

            <View
                style={[
                    styles.radioOuter,
                    {borderColor: selected ? accent : color},
                ]}
            >
                {selected ? <View style={[styles.radioInner, {backgroundColor: accent}]}/> : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        minHeight: 56,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 10,
        paddingRight: 10,
    },
    rowLabel: {
        fontSize: 18,
        fontWeight: "400",
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