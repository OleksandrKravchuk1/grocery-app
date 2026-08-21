import { api } from '@/src/api/client';
import { SearchSortBy } from "@/src/types/product";

type SearchProductOptions = {
  categoryId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sortBy?: SearchSortBy;
}

export const mapProduct = (item: any) => ({
  ...item,
  price: parseFloat(item.price || 0),
  rating: parseFloat(item.rating || 0),
  image: item.media?.filename
    ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${item.media.filename}`
    : '',
});

export async function getProducts() {
  const { data } = await api.get('/products');
  return data.map(mapProduct);
}

export async function getProductsByCategoryId(category_id: number) {
  const { data } = await api.get('/products');
  const filtered = data.filter((p: any) => p.category_id === category_id);
  return filtered.map(mapProduct);
}

export async function getProductsByIds(productIds: number[]) {
  if (productIds.length === 0) return [];
  const { data } = await api.get('/products');
  const filtered = data.filter((p: any) => productIds.includes(p.id));
  return filtered.map(mapProduct);
}

export async function searchProduct(query: string, options: SearchProductOptions = {}) {
  const { data } = await api.get('/products');
  let filtered = data;

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter((p: any) => p.title.toLowerCase().includes(q));
  }

  if (options.categoryId != null) {
    filtered = filtered.filter((p: any) => p.category_id === options.categoryId);
  }

  if (options.minPrice != null) {
    filtered = filtered.filter((p: any) => p.price >= options.minPrice!);
  }

  if (options.maxPrice != null) {
    filtered = filtered.filter((p: any) => p.price <= options.maxPrice!);
  }

  if (options.sortBy === "price_asc") {
    filtered.sort((a: any, b: any) => a.price - b.price);
  } else if (options.sortBy === "price_desc") {
    filtered.sort((a: any, b: any) => b.price - a.price);
  } else if (options.sortBy === "rating_desc") {
    filtered.sort((a: any, b: any) => b.rating - a.rating);
  } else {
    filtered.sort((a: any, b: any) => a.title.localeCompare(b.title));
  }

  return filtered.slice(0, 40).map(mapProduct);
}

export async function getProductById(id: number | undefined) {
  if (id === undefined) {
    throw new Error("Product ID is required");
  }
  const { data } = await api.get(`/products/${id}`);
  return data ? mapProduct(data) : null;
}
