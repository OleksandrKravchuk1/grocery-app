import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function MenuLayout() {
  const isDark = useColorScheme() === 'dark';
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: false,
        headerTransparent: true,
        headerTintColor: isDark ? 'white' : 'black',
        headerBlurEffect: isDark ? 'systemChromeMaterial' : 'light',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          headerTitle: "Menu",
        }}
      />
      <Stack.Screen
        name="orders/index"
        options={{
          headerTitle: "Your orders",
        }}
      />
      <Stack.Screen
        name="orders/[id]/index"
        options={{
          headerTitle: "Order details",
          headerBackTitle: "Orders",
        }}
      />
      <Stack.Screen
        name="orders/[id]/tracking"
        options={{
          headerTitle: "Track order",
          headerBackTitle: "Details",
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerTitle: "Payment methods",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          headerTitle: "Support",
        }}
      />
    </Stack>
  );
}
