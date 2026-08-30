import { useAppTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function PaymentLayout() {
  const { isDark } = useAppTheme();

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