export type Product = {
    id: number;
    title: string;
    price: number;
    rating: number;
    image: string;
};

export type CardListProps = {
    category_id: number;
};

export type CartItem = {
    key: string;
    product: Product;
    quantity: number;
};

export type SearchProductItem = {
    id: number;
    image: string;
    title: string;
    rating: number;
    price: number;
};