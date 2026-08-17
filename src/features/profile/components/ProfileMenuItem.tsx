import { useTheme } from "@/src/constants/theme";
import { usePressAnimation } from "@/src/hooks/animations/usePressAnimation";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
};

export function ProfileMenuItem({ icon, label, onPress, danger = false, showChevron = true }: Props) {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({ toValue: 0.97 });

  const color = danger ? theme.danger : theme.text;
  const iconColor = danger ? theme.danger : theme.accent;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [
          styles.container,
          { borderBottomColor: theme.border },
          pressed && { backgroundColor: theme.inputBg },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: danger ? `${theme.danger}15` : `${theme.accent}15` }]}>
            <Ionicons name={icon} size={20} color={iconColor} accessible={false} />
          </View>
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
        {showChevron && (
          <Ionicons name="chevron-forward" size={18} color={theme.muted} accessible={false} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
