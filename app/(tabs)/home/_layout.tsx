import { useAppTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const { isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerLargeTitleEnabled: true,
        headerTintColor: isDark ? 'white' : 'black',
        headerBlurEffect: isDark ? 'systemChromeMaterial' : 'light',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: 'Home',
        }}
      />
      <Stack.Screen
        name="[categoryId]/index"
        options={({ route }) => {
          const params = route.params as { title?: string } | undefined;

          return {
            headerShown: true,
            headerTitle: params?.title ?? 'All',
            animation: 'slide_from_right',
          };
        }}
      />
      <Stack.Screen
        name="product/[id]/index"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="cart"
        options={{
          headerShown: true,
          headerTitle: 'Cart',
          headerLargeTitleEnabled: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name='checkout'
        options={{
          headerShown: true,
          headerTitle: 'Checkout',
          headerLargeTitleEnabled: false,
        }}
      />
      <Stack.Screen
        name='payment'
        options={{
          headerShown: false,
          headerTitle: 'Payment',
          headerLargeTitleEnabled: false,
        }}
      />
    </Stack>
  );
}
