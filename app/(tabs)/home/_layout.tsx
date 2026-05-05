import {Stack} from "expo-router";
import {useColorScheme} from "react-native";

export default function HomeLayout() {
    const isDark = useColorScheme() === 'dark';

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
                name="[categoryId]"
                options={({route}) => {
                    const params = route.params as { title?: string } | undefined;

                    return {
                        headerShown: true,
                        headerTitle: params?.title ?? 'All',
                    };
                }}
            />
            <Stack.Screen
                name="cart"
                options={{
                    headerShown: true,
                    headerTitle: 'Cart',
                    headerLargeTitleEnabled: false,
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
