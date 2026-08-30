import { useAppTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function CartLayout() {
  const { isDark } = useAppTheme();
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