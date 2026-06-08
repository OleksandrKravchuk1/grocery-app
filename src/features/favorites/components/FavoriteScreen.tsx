import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { FavoriteSignInPlaceholder } from "@/features/favorites/components/FavoriteSignInPlaceholder";
import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { useTheme } from "@/src/constants/theme";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { FavoriteEmptyComponent } from "@/src/features/favorites/components/FavoriteEmptyComponent";
import { useFavoriteProducts } from "@/src/features/favorites/hooks/useFavoriteProducts";
import ProductCard from "@/src/features/product/components/ProductCard";

export function FavoriteScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();

  const { products, isLoading, error, removeFavorite } = useFavoriteProducts();

  if (!session) return <FavoriteSignInPlaceholder onSignInPress={() => router.push("/profile")} />;

  if (isLoading) return <LoadingView accessibilityLabel="Loading favourites" />;

  if (error) return <ErrorView message={error instanceof Error ? error.message : "Failed to load favorites"} />;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={[
        styles.listContent,
        products.length === 0 && { flexGrow: 1, justifyContent: "center", paddingTop: 0 },
        { backgroundColor: theme.screen }
      ]}
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
            isFavorite={true}
            onAddToFavoritesPress={() => removeFavorite(item.id)}
          />
        </View>
      )}
      ListEmptyComponent={<FavoriteEmptyComponent />}
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
});
