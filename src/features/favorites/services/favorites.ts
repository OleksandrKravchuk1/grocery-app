import { addFavorite, getFavorites, removeFavorite } from "@/src/features/favorites/api/favorites";

type FavoriteRow = {
    product_id: number;
};

export async function getFavoriteIds(userId: string) {
    const data = await getFavorites(userId);
    return (data ?? []).map((item: FavoriteRow) => item.product_id);
}

export async function toggleFavorite(userId: string, productId: number, favoriteIds: number[]) {
    const isFavorite = favoriteIds.includes(productId);

    if (isFavorite) {
        await removeFavorite(userId, productId);
    } else {
        await addFavorite(userId, productId);
    }
}
