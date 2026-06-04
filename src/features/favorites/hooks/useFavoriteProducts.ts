import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavoriteIds, toggleFavorite } from "@/src/features/favorites/services/favorites";

export function useFavoriteProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => getFavoriteIds(user!.id),
    enabled: !!user?.id,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!user) {
        throw new Error("Please sign in to use favorites.");
      }
      return toggleFavorite(user.id, productId, favoritesQuery.data ?? []);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["favorites", user?.id],
      });
    },
  });

  return {
    favoriteIds: favoritesQuery.data ?? [],
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    loading: favoritesQuery.isLoading || toggleFavoriteMutation.isPending,
  };
}
