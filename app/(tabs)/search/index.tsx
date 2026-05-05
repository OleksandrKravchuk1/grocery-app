import {useCallback, useEffect, useMemo, useState} from "react";
import {ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import {useTheme} from "@/constants/theme";
import {searchProduct} from "@/db/products";
import {SearchProductItem} from "@/types/product";
import {useInsets} from "@/hooks/useInsets";
import {useFavouriteProducts} from "@/hooks/useFavouriteProducts";
import {getPriceRange} from "@/utilities/searchFilters";
import {useSearchFilters} from "@/context/SearchFiltersContext";
import {Ionicons} from "@expo/vector-icons";

export default function SearchScreen() {
    const theme = useTheme();
    const {topInset} = useInsets();
    const {favouriteIds, toggleFavourite} = useFavouriteProducts();
    const {filters} = useSearchFilters();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchProductItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const {categoryId, pricePreset, sortBy} = filters;

    const trimmedQuery = useMemo(() => query.trim(), [query]);

    const runSearch = useCallback(async (value: string) => {
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

            const {minPrice, maxPrice} = getPriceRange(pricePreset);
            const data = await searchProduct(q, {
                categoryId,
                minPrice,
                maxPrice,
                sortBy,
            });

            setResults((data ?? []) as SearchProductItem[]);
        } catch (error) {
            setResults([]);
            setError(error instanceof Error ? error.message : "Failed to search products");
        } finally {
            setLoading(false);
        }
    }, [categoryId, pricePreset, sortBy]);

    useEffect(() => {
        let cancelled = false;

        const timeout = setTimeout(() => {
            if (!cancelled) {
                void runSearch(query);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query, runSearch]);

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
                        Try a different keyword or adjust filters
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

    const activeFiltersCount = [categoryId != null, pricePreset !== "all", sortBy !== "relevance"]
        .filter(Boolean).length;

    return (
        <View style={[styles.container, {backgroundColor: theme.screen}]}>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                onClear={() => setQuery("")}
                topInset={topInset}
            />

            <View style={styles.actionsRow}>
                <Pressable
                    style={[styles.actionButton, {borderColor: theme.inputBorder, backgroundColor: theme.inputBg}]}
                    onPress={() => router.push("/(modals)/search-filters")}
                >
                    <Ionicons name="filter-circle-outline" size={24} color={theme.text} />
                </Pressable>

                <Text style={[styles.filtersInfo, {color: theme.muted}]}>
                    {activeFiltersCount > 0 ? `${activeFiltersCount} active filter(s)` : "No active filters"}
                </Text>
            </View>

            {trimmedQuery ? (
                <Text style={[styles.meta, {color: theme.muted}]}>
                    {loading ? "Searching..." : `${results.length} result(s) for "${trimmedQuery}"`}
                </Text>
            ) : null}

            {loading ? (
                <ActivityIndicator color={theme.accent} style={styles.loader} />
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
    actionsRow: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    actionButton: {
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    actionText: {
        fontSize: 14,
        fontWeight: "700",
    },
    filtersInfo: {
        flex: 1,
        textAlign: "right",
        fontSize: 12,
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
});