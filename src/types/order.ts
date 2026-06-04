export type Order = {
    id: string;
    user_id: string;
    total_price: number;
    status: string;
    created_at: string;
    order_items?: Array<{
        id: string;
        product_id: number;
        quantity: number;
        price: number;
    }>;
};