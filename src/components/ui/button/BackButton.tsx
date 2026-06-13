import { useTheme } from "@/src/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function BackButton() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handlePress = () => {
    router.back();
  }
  return (
    <Pressable
      style={[styles.backButton, { top: insets.top + 16, backgroundColor: theme.cardContainer }]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Feather name="chevron-left" size={28} color={theme.text} accessible={false} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
})