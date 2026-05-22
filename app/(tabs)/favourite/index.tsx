import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";

import Auth from "@/components/auth/Auth";
import ProductCard from "@/components/product/ProductCard";
import { ErrorView } from "@/components/ui/view/ErrorView";
import { LoadingView } from "@/components/ui/view/LoadingView";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { getFavourites, removeFavourite } from "@/db/favourites";
import { getProductsByIds } from "@/db/products";
import { Product } from "@/types/product";

export default function Index() {
    const { user, session } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const theme = useMemo(
        () => ({
            screen: isDark ? colors.black : colors.screenLight,
            text: isDark ? colors.white : colors.textLight,
            muted: isDark ? colors.mutedDark : colors.mutedLight,
        }),
        [isDark]
    );

    const loadFavourites = useCallback(async () => {
        if (!user?.id) {
            setProducts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const favourites = await getFavourites(user.id);
            const productIds = (favourites ?? []).map((item) => item.product_id as number);

            if (productIds.length === 0) {
                setProducts([]);
                return;
            }

            const productsData = (await getProductsByIds(productIds)) as Product[];
            const orderMap = new Map(productIds.map((id, index) => [id, index]));
            const orderedProducts = [...productsData].sort(
                (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
            );

            setProducts(orderedProducts);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load favourites");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        void loadFavourites();
    }, [loadFavourites]);

    const handleRemoveFavourite = async (productId: number) => {
        if (!user?.id) return;

        const previousProducts = products;
        setProducts((prev) => prev.filter((item) => item.id !== productId));

        try {
            await removeFavourite(user.id, productId);
        } catch (e) {
            setProducts(previousProducts);
            Alert.alert("Favourite error", e instanceof Error ? e.message : "Failed to remove favourite");
        }
    };

    if (!session) return <Auth />;

    if (loading) return <LoadingView accessibilityLabel="Loading favourites" />;

    if (error) return <ErrorView message={error} onRetry={loadFavourites} />;

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={[styles.listContent, { backgroundColor: theme.screen }]}
            accessibilityRole="list"
            accessibilityLabel="Favourite products"
            accessibilityHint="Browse the products you have saved as favourites"
            renderItem={({ item }) => (
                <View style={styles.itemWrapper}>
                    <ProductCard
                        id={item.id}
                        image={item.image}
                        title={item.title}
                        rating={item.rating}
                        price={item.price}
                        cardStyle={styles.gridCard}
                        isFavourite={true}
                        onAddToFavouritesPress={() => handleRemoveFavourite(item.id)}
                    />
                </View>
            )}
            ListEmptyComponent={
                <View style={styles.emptyWrap}>
                    <Text style={[styles.emptyText, { color: theme.muted }]} accessibilityRole="text">No favourite products yet.</Text>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    listContent: {
        paddingHorizontal: 6,
        paddingVertical: 12,
        paddingTop: 150,
        paddingBottom: 16,
    },
    itemWrapper: {
        width: "50%",
        paddingHorizontal: 6,
        marginBottom: 12,
    },
    gridCard: {
        width: "100%",
        marginRight: 0,
    },
    emptyWrap: {
        alignItems: "center",
        marginTop: 24,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "500",
    },
});
