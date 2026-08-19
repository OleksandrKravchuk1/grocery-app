import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ProfileLayout() {
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
                    headerTitle: "Payment Methods",
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
