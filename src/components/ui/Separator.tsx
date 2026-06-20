import { useTheme } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export function Separator() {
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