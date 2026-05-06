import {ActivityIndicator, FlatList, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useMemo, useState} from "react";
import {getProductsByCategoryId} from "@/db/products";
import ProductCard from "@/components/ProductCard";

type Product = {
    id: number;
    title: string;
    price: number;
    rating: number;
    image: string;
    category_id: number;
};

export default function CategoryProductsScreen() {
    const {categoryId} = useLocalSearchParams<{ categoryId?: string | string[] }>();

    const parsedCategoryId = useMemo(() => {
        const raw = Array.isArray(categoryId) ? categoryId[0] : categoryId;
        return Number(raw);
    }, [categoryId]);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            if (!Number.isFinite(parsedCategoryId)) {
                setError("Invalid category id");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getProductsByCategoryId(parsedCategoryId);
                setProducts((data ?? []) as Product[]);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [parsedCategoryId]);

    if (loading) {
        return (
            <View style={styles.centered} accessibilityLabel='Loading products' accessibilityRole='progressbar'>
                <ActivityIndicator/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered} accessibilityRole='alert'>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            keyExtractor={(item, index) => `${item.id}-${item.title}-${index}`}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            accessibilityRole='list'
            accessibilityLabel={`Products in category ${parsedCategoryId}`}
            accessibilityHint='Browse the products in this category'
            renderItem={({item}) => (
                <View style={styles.itemWrapper}>
                    <ProductCard
                        id={item.id}
                        image={item.image}
                        title={item.title}
                        rating={item.rating}
                        price={item.price}
                        cardStyle={styles.gridCard}
                    />
                </View>
            )}
            ListEmptyComponent={
                <Text style={styles.emptyText} accessibilityRole='text'>
                    No products in this category
                </Text>
            }
        />
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