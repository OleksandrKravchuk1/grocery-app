import { getOrderById } from "@/src/features/order/api/orders";
import { Order } from "@/src/types/order";
import { useQuery } from "@tanstack/react-query";

export function useOrder(id: string | undefined) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => {
      if (!id) throw new Error("Order ID is missing");
      return getOrderById(id);
    },
    enabled: !!id,
  });
}
