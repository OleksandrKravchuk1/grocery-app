import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { SearchFiltersProvider } from "@/context/SearchFiltersContext";
import { SplashScreenView } from "@/components/SplashScreenView";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);

    const queryClient = new QueryClient();

    useEffect(() => {
        let isMounted = true;

        const prepareApp = async () => {
            try {
                await SplashScreen.hideAsync();
                await new Promise(resolve => setTimeout(resolve, 3000));
            } finally {
                if (isMounted) {
                    setIsReady(true);
                }
            }
        };

        void prepareApp();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!isReady) {
        return <SplashScreenView />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LocationProvider>
                    <CartProvider>
                        <SearchFiltersProvider>
                            <Stack
                                initialRouteName="(tabs)"
                                screenOptions={{
                                    headerShown: false,
                                }}
                            >
                                <Stack.Screen
                                    name="index"
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="(tabs)"
                                />
                                <Stack.Screen
                                    name="(modals)"
                                    options={{
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
        </QueryClientProvider>
    );
}