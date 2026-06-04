import { CartItem } from "@/src/types/product";
import { supabase } from "@/src/lib/supabase";

type OrderProps = {
    userId: string;
    items: CartItem[];
    price: number;
};

export async function createOrder({ userId, items, price}: OrderProps) {
    const {data: order, error} = await supabase
    .from('orders')
    .insert({
        user_id: userId,
        total_price: price,
        status: 'pending',
        })
    .select()
    .single();

    if (error) {
        throw new Error(error.message);
    };

    const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    return order;
};

export async function getOrdersByUserId(userId: string) {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId);

    if (error) {
        throw new Error(error.message);
    };

    return orders;
};
