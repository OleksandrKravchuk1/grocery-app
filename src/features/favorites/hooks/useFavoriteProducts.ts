import { useAuth } from "@/src/features/auth/context/AuthContext";
import { getFavorites, removeFavorite } from "@/src/features/favorites/api/favorites";
import { getFavoriteIds, toggleFavorite } from "@/src/features/favorites/services/favorites";
import { getProductsByIds } from "@/src/features/product/api/products";
import { Product } from "@/src/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

async function fetchFavoriteProducts(userId: string): Promise<Product[]> {
  const favorites = await getFavorites(userId);
  const productIds = (favorites ?? []).map((item) => item.product_id as number);

  if (productIds.length === 0) return [];

  const productsData = (await getProductsByIds(productIds)) as Product[];
  const orderMap = new Map(productIds.map((id, index) => [id, index]));

  return [...productsData].sort(
    (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
  );
}

export function useFavoriteProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Query IDs (used on catalogs to check if a single item is favorited)
  const favoritesQuery = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => getFavoriteIds(user!.id),
    enabled: !!user?.id,
  });

  // 2. Query full Products list (used on Favorites Screen)
  const productsQuery = useQuery({
    queryKey: ["favoriteProducts", user?.id],
    queryFn: () => fetchFavoriteProducts(user!.id),
    enabled: !!user?.id,
  });

  // 3. Toggle favorite mutation (adds or removes)
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!user) {
        throw new Error("Please sign in to use favorites.");
      }
      return toggleFavorite(user.id, productId, favoritesQuery.data ?? []);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      void queryClient.invalidateQueries({ queryKey: ["favoriteProducts", user?.id] });
    },
  });

  // 4. Remove favorite mutation (specifically for list view with optimistic updates)
  const removeFavoriteMutation = useMutation({
    mutationFn: (productId: number) => removeFavorite(user!.id, productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["favoriteProducts", user?.id] });
      const previous = queryClient.getQueryData<Product[]>(["favoriteProducts", user?.id]);
      if (previous) {
        queryClient.setQueryData(
          ["favoriteProducts", user?.id],
          previous.filter((p) => p.id !== productId)
        );
      }
      return { previous };
    },
    onError: (err, productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["favoriteProducts", user?.id], context.previous);
      }
      Alert.alert("Favorite error", err instanceof Error ? err.message : "Failed to remove favorite");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      void queryClient.invalidateQueries({ queryKey: ["favoriteProducts", user?.id] });
    },
  });

  return {
    favoriteIds: favoritesQuery.data ?? [],
    products: productsQuery.data ?? [],
    isLoading: favoritesQuery.isLoading || productsQuery.isLoading,
    isPending: toggleFavoriteMutation.isPending || removeFavoriteMutation.isPending,
    error: favoritesQuery.error || productsQuery.error,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    removeFavorite: removeFavoriteMutation.mutate,
  };
}
