import { api } from '@/src/api/client';
import { CartItem } from "@/src/types/product";

type OrderProps = {
  userId: string;
  items: CartItem[];
  price: number;
};

export async function createOrder({ items, price }: OrderProps) {
  const payload = {
    totalPrice: price,
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    })),
  };

  try {
    const { data } = await api.post('/orders', payload);
    return data;
  } catch (error: any) {
    console.error("Backend error:", error.response?.data || error.message);
    throw error;
  }
}

const mapOrderItems = (orderItems: any[]) => {
  if (!orderItems) return [];
  return orderItems.map((item: any) => {
    if (item.products) {
      item.product = {
        ...item.products,
        image: item.products.media?.filename
          ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${item.products.media.filename}`
          : '',
      };
      delete item.products;
    }
    return item;
  });
};

export async function getOrdersByUserId() {
  const { data } = await api.get('/orders');
  return data.map((order: any) => ({
    ...order,
    total_price: parseFloat(order.total_price || 0),
    order_items: mapOrderItems(order.order_items),
  }));
}

export async function getOrderById(orderId: string) {
  const { data } = await api.get('/orders');
  const order = data.find((o: any) => o.id === Number(orderId));

  if (!order) throw new Error("Order not found");

  order.total_price = parseFloat(order.total_price || 0);
  order.order_items = mapOrderItems(order.order_items);

  return order;
}
