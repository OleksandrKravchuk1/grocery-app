import {useEffect, useState} from "react";
import {
    ActivityIndicator, Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {useTheme} from "@/constants/theme";
import {searchProduct} from "@/db/products";
import ProductCard from "@/components/ProductCard";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useAuth} from "@/context/AuthContext";
import {addFavourite, getFavourites, removeFavourite} from "@/db/favourites";

type ProductItem = {
    id: number;
    image: string;
    title: string;
    rating: number;
    price: number;
};

export default function SearchScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const {user} = useAuth();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

    useEffect(() => {
        let cancelled = false;
        const loadFavourites = async () => {
            if (!user) {
                setFavouriteIds([]);
                return;
            }

            try {
                const data = await getFavourites(user.id);
                const ids = (data ?? []).map((item) => item.product_id);
                if (!cancelled) {
                    setFavouriteIds(ids);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load favourites:", error);
                }
            }
        };

        void loadFavourites();
        return () => {
            cancelled = true;
        };
    }, [user]);

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
                    setResults((data ?? []) as ProductItem[]);
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

    const toggleFavourite = async (productId: number) => {
        if (!user) {
            Alert.alert("Sign in required", "Please sign in to use favourites.");
            return;
        }

        const isFavourite = favouriteIds.includes(productId);

        setFavouriteIds((prev) =>
            isFavourite ? prev.filter((id) => id !== productId) : [...prev, productId]
        );

        try {
            if (isFavourite) {
                await removeFavourite(user.id, productId);
            } else {
                await addFavourite(user.id, productId);
            }
        } catch (error) {
            setFavouriteIds((prev) =>
                isFavourite ? [...prev, productId] : prev.filter((id) => id !== productId)
            );
            Alert.alert(
                "Favourite error",
                error instanceof Error ? error.message : "Failed to update favourites"
            );
        }
    };

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
                        marginTop: insets.top + 56,
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
                                Nothing found for `{query.trim()}`
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