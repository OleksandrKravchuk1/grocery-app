import { useAppTheme } from "@/src/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OrderEmptyComponent() {
  const { colors: theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.centerContainer, { backgroundColor: theme.screen, marginTop: insets.top + 56 }]}>
      <MaterialIcons
        name="shopping-bag"
        size={64}
        color={theme.muted}
      />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Orders Yet
      </Text>
      <Text style={[styles.emptyMessage, { color: theme.muted }]}>
        Start shopping to place your first order
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
})