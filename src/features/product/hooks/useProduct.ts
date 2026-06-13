import { getProductById } from "@/src/features/product/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProduct(id: number | undefined) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: id !== undefined && !isNaN(id),
    });
}
