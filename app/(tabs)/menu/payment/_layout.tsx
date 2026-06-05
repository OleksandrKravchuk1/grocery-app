import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function PaymentLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Stack
      screenOptions={{
        headerTitle: "Payment Methods",
        headerTransparent: true,
        headerLargeTitleEnabled: false,
        headerBlurEffect: isDark ? "dark" : "light",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}