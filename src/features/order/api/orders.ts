import { supabase } from "@/src/lib/supabase";
import { CartItem } from "@/src/types/product";

type OrderProps = {
  userId: string;
  items: CartItem[];
  price: number;
};

export async function createOrder({ userId, items, price }: OrderProps) {
  const { data: order, error } = await supabase
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

export async function getOrderById(orderId: string) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*, media:image_id(filename)))')
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Map product images correctly
  if (order.order_items) {
    order.order_items = order.order_items.map((item: any) => {
      if (item.product) {
        item.product = {
          ...item.product,
          image: item.product.media?.filename
            ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${item.product.media.filename}`
            : '',
        };
      }
      return item;
    });
  }

  return order;
}
