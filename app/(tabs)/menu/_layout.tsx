import { Stack } from "expo-router";
import {useColorScheme} from "react-native";

export default function MenuLayout() {
    const colorScheme = useColorScheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerLargeTitle: false,
                headerTransparent: true,
                headerBlurEffect: colorScheme === 'dark' ? 'systemChromeMaterial' : 'light',
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
                name="orders"
                options={{
                    headerTitle: "Your orders",
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
        </Stack>
    );
}
