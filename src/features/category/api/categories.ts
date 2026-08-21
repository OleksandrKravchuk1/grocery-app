import { api } from '@/src/api/client';

export async function getCategories() {
  const { data } = await api.get('/products/categories');
  return data;
}
