import { SplashScreenView } from "@/src/components/SplashScreenView";
import { OfflineBanner } from "@/src/components/ui/OfflineBanner";
import { LocationProvider } from "@/src/context/LocationContext";
import { SearchFiltersProvider } from "@/src/context/SearchFiltersContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { AuthProvider } from "@/src/features/auth/context/AuthContext";
import { CartProvider } from "@/src/features/cart/context/CartContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

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
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LocationProvider>
              <CartProvider>
                <SearchFiltersProvider>
                  <View style={{ flex: 1 }}>
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
                    <OfflineBanner />
                  </View>
                </SearchFiltersProvider>
              </CartProvider>
            </LocationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StripeProvider>
  );
}