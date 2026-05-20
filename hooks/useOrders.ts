import { useAuth } from "@/context/AuthContext";
import { getOrdersByUserId } from "@/db/orders";
import { useQuery } from "@tanstack/react-query";

export function useOrders() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['orders', user?.id],
        queryFn: () => getOrdersByUserId(user!.id),
        enabled: !!user?.id,
    });
}