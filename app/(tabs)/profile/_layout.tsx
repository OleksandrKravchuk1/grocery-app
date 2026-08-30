import { useAppTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function ProfileLayout() {
    const { isDark } = useAppTheme();
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
                    headerTitle: "Profile",
                    headerLargeTitle: true,
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    headerTitle: "Edit Profile",
                }}
            />
            <Stack.Screen
                name="orders/index"
                options={{
                    headerTitle: "Your Orders",
                }}
            />
            <Stack.Screen
                name="orders/[id]/index"
                options={{
                    headerTitle: "Order Details",
                    headerBackTitle: "Orders",
                }}
            />
            <Stack.Screen
                name="orders/[id]/tracking"
                options={{
                    headerTitle: "Track Order",
                    headerBackTitle: "Details",
                }}
            />
            <Stack.Screen
                name="payment"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="support"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
