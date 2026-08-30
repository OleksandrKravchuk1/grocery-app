import { useAppTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function SupportLayout() {
  const { isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTintColor: isDark ? 'white' : 'black',
        headerBlurEffect: isDark ? 'systemChromeMaterial' : 'light',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings",
        }}
      />
    </Stack>
  );
}
