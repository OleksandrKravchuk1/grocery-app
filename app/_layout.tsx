import {useEffect, useState} from "react";
import * as SplashScreen from "expo-splash-screen";
import {Stack} from "expo-router";
import {AuthProvider} from "@/context/AuthContext";
import {CartProvider} from "@/context/CartContext";
import {LocationProvider} from "@/context/LocationContext";
import {SearchFiltersProvider} from "@/context/SearchFiltersContext";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const prepareApp = async () => {
            try {
            } finally {
                if (isMounted) {
                    setIsReady(true);
                    await SplashScreen.hideAsync();
                }
            }
        };

        void prepareApp();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <AuthProvider>
            <LocationProvider>
                <CartProvider>
                    <SearchFiltersProvider>
                        <Stack>
                            <Stack.Screen
                                name="(tabs)"
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="(modals)"
                                options={{
                                    headerShown: false,
                                    headerTitle: "modals",
                                    headerLargeTitle: false,
                                    headerTransparent: true,
                                    headerBlurEffect: "light",
                                }}
                            />
                        </Stack>
                    </SearchFiltersProvider>
                </CartProvider>
            </LocationProvider>
        </AuthProvider>
    );
}
