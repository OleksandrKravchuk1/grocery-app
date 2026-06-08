import { useTheme } from "@/src/constants/theme";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export function AddressView({ address }: { address: string }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <Pressable
      style={styles.addressContainer}
      accessibilityRole='button'
      accessibilityLabel={`Current delivery address: ${address}`}
      accessibilityHint='Opens the location picker to select your delivery address'
      onPress={() => router.push('/(modals)/location-picker')}
    >
      <MaterialIcons name="delivery-dining"
        size={28}
        color={theme.text}
        accessible={false}
      />
      <Text style={[styles.address, {
        color: theme.text
      }]}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {address}
      </Text>
      <Entypo name='chevron-small-down'
        size={24}
        color={theme.text}
        accessible={false}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  address: {
    fontSize: 18,
    paddingHorizontal: 8,
    flexShrink: 1,
  },
});
