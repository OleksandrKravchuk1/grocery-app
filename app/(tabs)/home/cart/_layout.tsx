import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function CartLayout() {
  const isDark = useColorScheme() === 'dark';
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerLargeTitleEnabled: true,
        headerBlurEffect: isDark ? 'systemChromeMaterial' : 'light',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}