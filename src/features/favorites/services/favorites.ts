import { addFavorite, getFavorites, removeFavorite } from "@/src/features/favorites/api/favorites";

type FavoriteRow = {
  product_id: number;
};

export async function getFavoriteIds(userId: string) {
  const data = await getFavorites();
  return (data ?? []).map((item: FavoriteRow) => item.product_id);
}

export async function toggleFavorite(userId: string, productId: number, favoriteIds: number[]) {
  const isFavorite = favoriteIds.includes(productId);

  if (isFavorite) {
    await removeFavorite(productId);
  } else {
    await addFavorite(productId);
  }
}
