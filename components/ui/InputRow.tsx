import {StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useTheme} from "@/constants/theme";

type Props = {
    iconName: "person" | "calendar-month" | "phone";
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?: "default" | "phone-pad";
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
    accessibilityHint?: string;
};

export function InputRow({
                             iconName,
                             value,
                             onChangeText,
                             placeholder,
                             keyboardType,
                             style,
                             accessibilityLabel,
                             accessibilityHint,
                         }: Props) {
    const theme = useTheme();
    const inputAccessibilityLabel = accessibilityLabel ?? placeholder;

    return (
        <View style={[styles.inputRow, {
            backgroundColor: theme.inputBg, borderColor: theme.inputBorder
        }, style
        ]}>
            <MaterialIcons name={iconName} size={18} color={theme.accent} accessible={false}/>
            <TextInput style={[styles.inputText, {color: theme.text}]}
                       value={value}
                       onChangeText={onChangeText}
                       placeholder={placeholder}
                       placeholderTextColor={theme.muted}
                       keyboardType={keyboardType ?? "default"}
                       accessibilityRole="text"
                       accessibilityLabel={inputAccessibilityLabel}
                       accessibilityHint={accessibilityHint}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputRow: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    inputText: {
        flex: 1,
        fontSize: 18,
    },
});
