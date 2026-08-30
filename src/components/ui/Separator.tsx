import { useAppTheme } from "@/src/context/ThemeContext";
import { StyleSheet, View } from "react-native";

export function Separator() {
  const { colors: theme } = useAppTheme();
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