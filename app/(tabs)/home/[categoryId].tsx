import ProductCard from "@/components/product/ProductCard";
import { ErrorView } from "@/components/ui/view/ErrorView";
import { LoadingView } from "@/components/ui/view/LoadingView";
import { useFadeInSlideUp } from "@/hooks/animations/useFadeInSlideUp";
import { useCategoryProducts } from "@/hooks/useCategoryProduct";
import { useFavouriteProducts } from "@/hooks/useFavouriteProducts";
import { useNumericRouteParam } from "@/hooks/useNumaricRouteParam";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export default function CategoryProductsScreen() {
    const { favouriteIds, toggleFavourite } = useFavouriteProducts();

    const parsedCategoryId = useNumericRouteParam("categoryId");
    const { error, isError, isLoading, products } = useCategoryProducts(parsedCategoryId);

    const animatedStyle = useFadeInSlideUp(isLoading || isError);

    if (isLoading) return <LoadingView accessibilityLabel="Loading products" />;

    if (isError) return <ErrorView message={error} />;

    return (
        <Animated.View style={animatedStyle}>
            <Animated.FlatList
                data={products}
                keyExtractor={(item, index) => `${item.id}-${item.title}-${index}`}
                numColumns={2}
                contentContainerStyle={styles.listContent}
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
                            isFavourite={favouriteIds.includes(item.id)}
                            onAddToFavouritesPress={() => toggleFavourite(item.id)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText} accessibilityRole='text'>
                        No products in this category
                    </Text>
                }
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
    emptyText: {
        fontSize: 16,
    },
});