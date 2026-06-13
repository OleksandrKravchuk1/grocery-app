import {supabase} from "@/src/lib/supabase";
import {SearchSortBy} from "@/src/types/product";

type SearchProductOptions = {
    categoryId?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sortBy?: SearchSortBy;
}

const mapProduct = (item: any) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    rating: item.rating,
    image: item.media?.filename
        ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${item.media.filename}`
        : '',
});

export async function getProductsByCategoryId(category_id: number) {
    const {data, error} = await supabase
        .from('products')
        .select('*, media:image_id(filename)')
        .eq('category_id', category_id);

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map(mapProduct);
}

export async function getProductsByIds(productIds: number[]) {
    if (productIds.length === 0) return [];

    const {data, error} = await supabase
        .from('products')
        .select('*, media:image_id(filename)')
        .in('id', productIds);

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map(mapProduct);
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
        .select('*, media:image_id(filename)')
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

    return (data || []).map(mapProduct);
}

