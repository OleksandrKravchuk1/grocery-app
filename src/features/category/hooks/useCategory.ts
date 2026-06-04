import { getCategories } from "@/src/features/category/api/categories";
import { Category } from "@/src/types/category";
import { useQuery } from "@tanstack/react-query";

export function useCategory() {
    const query = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    return { 
        categories: (query.data ?? []) as Category[], 
        isLoading: query.isLoading, 
        error: query.error instanceof Error ? query.error.message : null,
    };
}
