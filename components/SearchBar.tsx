import {Ionicons} from "@expo/vector-icons";
import {Pressable, StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native";
import {useTheme} from "@/constants/theme";

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    topInset?: number;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
};

export default function SearchBar({value, onChangeText, onClear, topInset = 0, placeholder = "Find products...", style}: SearchBarProps) {
    const theme = useTheme();

    return (
        <View
            style={[styles.searchBar, {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                marginTop: topInset,
            },
                style,
            ]}
        >
            <Ionicons name="search" size={20} color={theme.muted}/>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.muted}
                style={[styles.input, {color: theme.text}]}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
            {!!value && (
                <Pressable
                    onPress={onClear}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                >
                    <Ionicons name="close-circle" size={20} color={theme.muted}/>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        height: 50,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

