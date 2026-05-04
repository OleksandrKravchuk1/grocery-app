import {useEffect, useMemo, useState} from "react";
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View} from "react-native";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import {useTheme} from "@/constants/theme";
import {useFavouriteProducts} from "@/hooks/useFavouriteProducts";
import {searchProduct} from "@/db/products";
import {SearchProductItem} from "@/types/product";
import {useInsets} from "@/hooks/useInsets";

export default function SearchScreen() {
    const theme = useTheme();
    const {topInset} = useInsets();
    const {favouriteIds, toggleFavourite} = useFavouriteProducts();

    const [query, setQuery]           = useState("");
    const [results, setResults]       = useState<SearchProductItem[]>([]);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const trimmedQuery = useMemo(() => query.trim(), [query]);

    const runSearch = async (value: string) => {
        const q = value.trim();

        if (!q) {
            setError(null);
            setResults([]);
            setLoading(false);
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const data = await searchProduct(q);
            setResults((data ?? []) as SearchProductItem[]);
        } catch (error) {
            setResults([]);
            setError(error instanceof Error ? error.message : "Failed to search products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const timeout = setTimeout(() => {
            if (!cancelled) {
                runSearch(query);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query]);

    const handleRefresh = async () => {
        if (!trimmedQuery) return;

        setRefreshing(true);
        try {
            await runSearch(trimmedQuery);
        } finally {
            setRefreshing(false);
        }
    };

    const renderEmpty = () => {
        if (loading) return null;

        if (error) {
            return (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, {color: theme.text}]}>
                        Search failed
                    </Text>
                    <Text style={[styles.emptySubtitle, {color: theme.muted}]}>
                        {error}
                    </Text>
                </View>
            );
        }
        if (trimmedQuery) {
            return (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, {color: theme.text}]}>
                        Nothing found
                    </Text>
                    <Text style={[styles.emptySubtitle, {color: theme.muted}]}>
                        Try a different keyword
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.emptyState}>
                <Text style={[styles.emptyTitle, {color: theme.text}]}>
                    Search products
                </Text>
                <Text style={[styles.emptySubtitle, {color: theme.muted}]}>
                    Start typing to find items quickly
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, {backgroundColor: theme.screen}]}>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                onClear={() => setQuery("")}
                topInset={topInset}
            />

            {trimmedQuery ? (
                <Text style={[styles.meta, {color: theme.muted}]}>
                    {loading ? "Searching..." : `${results.length} result(s) for "${trimmedQuery}"`}
                </Text>
            ) : null}

            {loading ? (
                <ActivityIndicator color={theme.accent} style={styles.loader}/>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.accent}
                            colors={[theme.accent]}
                        />
                    }
                    ListEmptyComponent={renderEmpty}
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
        paddingHorizontal: 16,
    },
    loader: {
        marginTop: 24,
    },
    meta: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: 13,
    },
    listContent: {
        paddingTop: 8,
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
    emptyState: {
        marginTop: 40,
        alignItems: "center",
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 16,
    },
});