import { useTheme } from "@/constants/theme";
import { View, StyleSheet } from "react-native";

export const Separator = () => {
    const theme = useTheme();
    return (
        <View style={[styles.separator, { backgroundColor: theme.border }]} />
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        marginVertical: 12,
    },
});