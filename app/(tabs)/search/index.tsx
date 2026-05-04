import {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Platform,
    Text,
    TextInput,
    View,
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ProductCard from "@/components/ProductCard";
import {useTheme} from "@/constants/theme";
import {useFavouriteProducts} from "@/hooks/useFavouriteProducts";
import {searchProduct} from "@/db/products";
import {SearchProductItem} from "@/types/product";

export default function SearchScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const {favouriteIds, toggleFavourite} = useFavouriteProducts();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchProductItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const runSearch = async () => {
            const trimmedQuery = query.trim();

            if (!trimmedQuery) {
                setLoading(false);
                setResults([]);
                return;
            }

            try {
                setLoading(true);
                const data = await searchProduct(trimmedQuery);

                if (!cancelled) {
                    setResults((data ?? []) as SearchProductItem[]);
                }
            } catch (error) {
                if (!cancelled) {
                    setResults([]);
                }
                console.error("Search error:", error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        const timeout = setTimeout(runSearch, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query]);

    return (
        <View style={[styles.container, {backgroundColor: theme.screen}]}>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Find products..."
                placeholderTextColor={theme.muted}
                style={[
                    styles.input,
                    {
                        color: theme.text,
                        backgroundColor: theme.inputBg,
                        borderColor: theme.inputBorder,
                        marginTop: Platform.OS === 'android' ? insets.top + 56 : insets.top + 90,
                    },
                ]}
            />

            {loading ? (
                <ActivityIndicator color={theme.accent} style={styles.loader}/>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        query.trim() ? (
                            <Text style={[styles.emptyText, {color: theme.text}]}>
                                {`Nothing found for "${query.trim()}"`}
                            </Text>
                        ) : (
                            <Text style={[styles.emptyText, {color: theme.muted}]}>
                                Start typing to search for products
                            </Text>
                        )
                    }
                    renderItem={({item}) => (
                        <ProductCard
                            id={item.id}
                            image={item.image}
                            title={item.title}
                            rating={item.rating}
                            price={item.price}
                            cardStyle={styles.card}
                            isFavourite={favouriteIds.includes(item.id)}
                            onAddToFavouritesPress={() => toggleFavourite(item.id)}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
        fontSize: 16,
    },
    loader: {
        marginTop: 24,
    },
    listContent: {
        paddingBottom: 24,
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        width: "48%",
        marginRight: 0,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 16,
    },
});