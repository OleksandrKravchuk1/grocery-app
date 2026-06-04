import { getOrdersByUserId } from "@/src/features/order/api/orders";

export async function fetchUserOrders(userId?: string) {
    if (!userId) {
        throw new Error("User not found");
    };

    return getOrdersByUserId(userId);
}
