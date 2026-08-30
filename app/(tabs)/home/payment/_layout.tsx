import { useAppTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function PaymentLayout() {
  const router = useRouter();
  const { colors: theme, isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTitle: "Payment",
        headerTransparent: true,
        headerLargeTitleEnabled: false,
        headerBlurEffect: isDark ? "systemChromeMaterial" : "light",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ marginRight: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.text}
                accessible={false}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
