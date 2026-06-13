import { useTheme } from "@/src/constants/theme";
import { ProductBadge } from "@/types/product";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  badges: ProductBadge[];
};

export function ProductBadges({ badges }: Props) {
  const theme = useTheme();

  if (!badges || badges.length === 0) return null;

  return (
    <View style={styles.detailsRow}>
      {badges.map((badge, index) => (
        <View key={index} style={[styles.detailBadge, { backgroundColor: theme.screen }]}>
          <Feather name={badge.icon} size={18} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>{badge.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },
  detailBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
