import { api } from "@/api/client";

export async function getFavorites() {
  const { data } = await api.get('/favourites');
  return data;
}

export async function addFavorite(productId: number) {
  const { data } = await api.post(`/favourites/${productId}`);
  return data;
}
export async function removeFavorite(productId: number) {
  const { data } = await api.delete(`/favourites/${productId}`);
  return data;
}
