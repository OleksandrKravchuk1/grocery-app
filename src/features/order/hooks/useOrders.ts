import { useAuth } from "@/src/features/auth/context/AuthContext";
import { fetchUserOrders } from "@/src/features/order/services/orders";
import { useQuery } from "@tanstack/react-query";

export function useOrders() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['orders', user?.id],
        queryFn: () => fetchUserOrders(user!.id),
        enabled: !!user?.id,
    });
}
