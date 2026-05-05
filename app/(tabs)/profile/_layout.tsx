import {Stack} from "expo-router";
import {useColorScheme} from "react-native";

export default function ProfileLayout() {
    const isDark = useColorScheme() === 'dark';
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
                    headerTitle: "Profile",
                }}
            />
        </Stack>
    );
}
