import { useAppTheme } from "@/src/context/ThemeContext";
import {Stack} from "expo-router";

export default function SearchLayout() {
    const { isDark } = useAppTheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerLargeTitle: true,
                headerTransparent: true,
                headerTintColor: isDark ? 'white' : 'black',
                headerBlurEffect: isDark ? 'systemChromeMaterial' : 'light',
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Search",
                }}
            />
        </Stack>
    );
}
