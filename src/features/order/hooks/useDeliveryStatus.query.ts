import { useQuery } from "@tanstack/react-query";
import { getDeliveryStatus } from "../api/orders";

export function useDeliveryStatus(orderId: number | undefined) {
  return useQuery({
    queryKey: ['delivery-status', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID is required!');
      }
      return getDeliveryStatus(orderId);
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'delivered') {
        return false;
      }
      return 3000;
    },
    enabled: !!orderId,
  });
}