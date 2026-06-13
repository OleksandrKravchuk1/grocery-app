import { useTheme } from "@/constants/theme";
import { useAuth } from "@/features/auth/context/AuthContext";
import { colors } from "@/src/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet } from "react-native";

type Props = {
    onAddToFavoritesPress?: () => void;
    isFavorite?: boolean;
};

export function FavoriteButton({ onAddToFavoritesPress, isFavorite }: Props) {
    const theme = useTheme();
    const { user } = useAuth();

    const handlePress = () => {
        if (!user) {
            Alert.alert(
                "Sign In Required",
                "You must be signed in to add items to your favorites."
            );
            return;
        }
        onAddToFavoritesPress?.();
    };

    return (
        <Pressable
            onPress={handlePress}
            style={[styles.favoriteButton, { backgroundColor: theme.button }]}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            accessibilityHint="Toggles this product in your favorites"
            accessibilityState={{ selected: isFavorite }}
        >
            <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={20}
                color={isFavorite ? colors.favouriteActive : theme.text}
                accessible={false}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    favoriteButton: {
        position: "absolute",
        right: 0,
        top: -4,
        width: 38,
        height: 38,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2
        },
        elevation: 2
    },
});