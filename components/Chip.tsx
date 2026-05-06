import {useTheme} from "@/constants/theme";
import {Pressable, StyleSheet, Text} from "react-native";

type Props = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

const Chip = ({label, selected, onPress}: Props) => {
    const theme = useTheme();

    return (
        <Pressable style={[styles.chip, {
            backgroundColor: selected ? theme.accent : theme.inputBg,
            borderColor: selected ? theme.accent : theme.inputBorder,
        }]}
                   onPress={onPress}
                   accessibilityRole='button'
                   accessibilityState={{selected}}
                   accessibilityHint='Double tap to toggle selection'
        >
            <Text style={[styles.chipText, {
                color: selected ? "#fff" : theme.text
            }]}>
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
        fontWeight: '600',
    },
});

export default Chip;