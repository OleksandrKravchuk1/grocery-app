import {supabase} from "@/db/supabase";
import {SearchSortBy} from "@/types/product";

type SearchProductOptions = {
    categoryId?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sortBy?: SearchSortBy;
}

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

export async function searchProduct(query: string, options: SearchProductOptions = {}) {
    const {
        categoryId,
        minPrice,
        maxPrice,
        sortBy = "relevance",
    } = options;

    let request = supabase
        .from('products')
        .select()
        .ilike('title', `%${query}%`);

    if (categoryId != null) {
        request = request.eq('category_id', categoryId);
    }

    if (minPrice != null) {
        request = request.gte('price', minPrice);
    }

    if (maxPrice != null) {
        request = request.lte('price', maxPrice);
    }

    if (sortBy === "price_asc") {
        request = request.order('price', {ascending: true});
    } else if (sortBy === "price_desc") {
        request = request.order('price', {ascending: false});
    } else if (sortBy === "rating_desc") {
        request = request.order('rating', {ascending: false});
    } else {
        request = request.order('title', {ascending: true});
    }

    const {data, error} = await request.limit(40);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}