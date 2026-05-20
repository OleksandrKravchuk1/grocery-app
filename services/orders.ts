import { getOrdersByUserId } from "@/db/orders";

export async function fetchUserOrders(userId?: string) {
    if (!userId) {
        throw new Error("User not found");
    };

    return getOrdersByUserId(userId);
}