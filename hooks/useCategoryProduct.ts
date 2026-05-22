import { useQuery } from "@tanstack/react-query";
import { getProductsByCategoryId } from "@/db/products";

export function useCategoryProducts(categoryId: number) {

    const query = useQuery({
        queryKey: ["categoryProducts", categoryId],
        queryFn: () => getProductsByCategoryId(categoryId),
        enabled: Number.isFinite(categoryId),
    });

    return {
        products: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error instanceof Error ? query.error.message : null,
    };
};