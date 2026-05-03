import {supabase} from "@/db/supabase";

export async function getProductsByCategoryId(category_id: number) {
    const {data, error} = await supabase
        .from('products')
        .select()
        .eq('category_id', category_id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getProductsByIds(productIds: number[]) {
    if (productIds.length === 0) return [];

    const {data, error} = await supabase
        .from('products')
        .select()
        .in('id', productIds);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function searchProduct(query: string) {
    const {data, error} = await supabase
        .from('products')
        .select()
        .ilike('title', `%${query}%`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}