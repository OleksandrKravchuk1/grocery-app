import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { addFavourite, getFavourites, removeFavourite } from "@/db/favourites";

type FavouriteRow = {
    product_id: number;
};

type UseFavouriteProductsResult = {
    favouriteIds: number[];
    toggleFavourite: (productId: number) => Promise<void>;
    loading: boolean;
};

export function useFavouriteProducts(): UseFavouriteProductsResult {
    const { user } = useAuth();

    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const loadFavourites = useCallback(async () => {
        if (!user) {
            setFavouriteIds([]);
            return;
        }

        try {
            setLoading(true);
            const data = await getFavourites(user.id);
            const ids = (data ?? []).map((item: FavouriteRow) => item.product_id);
            setFavouriteIds(ids);
        } catch (error) {
            console.error("Failed to load favourites:", error);
            setFavouriteIds([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        void loadFavourites();
    }, [loadFavourites]);

    const toggleFavourite = useCallback(
        async (productId: number) => {
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
        },
        [user, favouriteIds]
    );

    return {
        favouriteIds,
        toggleFavourite,
        loading,
    };
}