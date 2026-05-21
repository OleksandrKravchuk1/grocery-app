import { addFavourite, getFavourites, removeFavourite } from "@/db/favourites";

type FavouriteRow = {
    product_id: number;
};

export async function getFavouriteIds(userId: string) {
    const data = await getFavourites(userId);
    return (data ?? []).map((item: FavouriteRow) => item.product_id);
}

export async function toggleFavourite(userId: string, productId: number, favouriteIds: number[]) {
    const isFavourite = favouriteIds.includes(productId);

    if (isFavourite) {
        await removeFavourite(userId, productId);
    } else {
        await addFavourite(userId, productId);
    }
}