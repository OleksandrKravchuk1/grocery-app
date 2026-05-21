import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavouriteIds, toggleFavourite } from "@/services/favotites";

export function useFavouriteProducts() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const favouritesQuery = useQuery({
        queryKey: ["favourites", user?.id],
        queryFn: () => getFavouriteIds(user!.id),
        enabled: !!user?.id,
    });

    const toggleFavouriteMutation = useMutation({
        mutationFn: async (productId: number) => {
            if (!user) {
                throw new Error("Please sign in to use favourites.");
            }
            return toggleFavourite(user.id, productId, favouritesQuery.data ?? []);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["favourites", user?.id],
            });
        },
    });

    return {
        favouriteIds: favouritesQuery.data ?? [],
        toggleFavourite: toggleFavouriteMutation.mutateAsync,
        loading: favouritesQuery.isLoading || toggleFavouriteMutation.isPending,
    };
}