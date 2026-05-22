import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";

type Props = {
    iconName: "person" | "calendar-month" | "phone" | "email" | "lock";
    value: string;
    onChangeText: (value: string) => void;
    onBlur?: () => void;
    placeholder: string;
    keyboardType?: "default" | "phone-pad" | "email-address";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    secureTextEntry?: boolean;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
    accessibilityHint?: string;
};

export function InputRow({
    iconName,
    value,
    onChangeText,
    onBlur,
    placeholder,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
    style,
    accessibilityLabel,
    accessibilityHint,
}: Props) {
    const theme = useTheme();

    return (
        <View style={[styles.inputRow, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }, style]}>
            <MaterialIcons name={iconName} size={18} color={theme.accent} accessible={false} />
            <TextInput
                style={[styles.inputText, { color: theme.text }]}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor={theme.muted}
                keyboardType={keyboardType ?? "default"}
                autoCapitalize={autoCapitalize ?? "sentences"}
                secureTextEntry={secureTextEntry ?? false}
                accessibilityRole="text"
                accessibilityLabel={accessibilityLabel ?? placeholder}
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