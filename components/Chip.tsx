import {useTheme} from "@/constants/theme";
import {Pressable, StyleSheet, Text} from "react-native";

const Chip = ({label, selected, onPress}: { label: string; selected: boolean; onPress: () => void; }) => {
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? theme.accent : theme.inputBg,
                    borderColor: selected ? theme.accent : theme.inputBorder,
                },
            ]}
        >
            <Text style={[styles.chipText, {color: selected ? "#fff" : theme.text}]}>
                {label}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 999,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
    },
});

export default Chip;