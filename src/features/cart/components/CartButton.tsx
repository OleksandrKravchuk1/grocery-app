import { useTheme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export function CartButton() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Pressable
      style={styles.bagIcon}
      onPress={() => router.push('/home/cart')}
      accessibilityRole='button'
      accessibilityLabel='Shopping Cart'
      accessibilityHint='View items in your shopping cart'
    >
      <Ionicons
        name="bag-outline"
        size={24}
        color={theme.text}
        accessible={false} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bagIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
