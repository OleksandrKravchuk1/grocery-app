import { CategoryEmptyComponent } from "@/features/category/components/CategoryEmptyComponent";
import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { useTheme } from "@/src/constants/theme";
import { useFavoriteProducts } from "@/src/features/favorites/hooks/useFavoriteProducts";
import ProductCard from "@/src/features/product/components/ProductCard";
import { useCategoryProducts } from "@/src/features/product/hooks/useCategoryProducts";
import { useFadeInSlideUp } from "@/src/hooks/animations/useFadeInSlideUp";
import { useNumericRouteParam } from "@/src/hooks/useNumaricRouteParam";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function CategoryProductsScreen() {
    const theme = useTheme();
    const { favoriteIds, toggleFavorite } = useFavoriteProducts();

    const parsedCategoryId = useNumericRouteParam("categoryId");
    const { error, isError, isLoading, products } = useCategoryProducts(parsedCategoryId);

    const animatedStyle = useFadeInSlideUp(isLoading || isError);

    if (isLoading) return <LoadingView accessibilityLabel="Loading products" />;

    if (isError) return <ErrorView message={error} />;

    return (
        <Animated.View style={[animatedStyle, { backgroundColor: theme.screen, flex: 1 }]}>
            <Animated.FlatList
                data={products}
                keyExtractor={(item, index) => `${item.id}-${item.title}-${index}`}
                numColumns={2}
                contentContainerStyle={[
                    styles.listContent,
                    products.length === 0 && { flexGrow: 1, justifyContent: "center", paddingTop: 0 }
                ]}
                accessibilityRole='list'
                accessibilityLabel={`Products in category ${parsedCategoryId}`}
                accessibilityHint='Browse the products in this category'
                renderItem={({ item }) => (
                    <View style={styles.itemWrapper}>
                        <ProductCard
                            id={item.id}
                            image={item.image}
                            title={item.title}
                            rating={item.rating}
                            price={item.price}
                            cardStyle={styles.gridCard}
                            isFavorite={favoriteIds.includes(item.id)}
                            onAddToFavoritesPress={() => toggleFavorite(item.id)}
                        />
                    </View>
                )}
                ListEmptyComponent={<CategoryEmptyComponent />}
            />
        </Animated.View>
    );
};

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
});