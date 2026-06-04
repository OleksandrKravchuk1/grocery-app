import {CartItem, Product} from "@/types/product";

export function getCartItemKey(product: Product): string {
    return String(product.id);
}

export function normalizeCartItems(parsed: CartItem[]): CartItem[] {
    const merged = new Map<string, CartItem>();

    parsed.forEach((item) => {
        if (!item?.product) return;

        const key = item.key ?? getCartItemKey(item.product);
        const existing = merged.get(key);

        if (existing) {
            merged.set(key, {...existing, quantity: existing.quantity + item.quantity});
            return;
        }

        merged.set(key, {
            key,
            product: item.product,
            quantity: item.quantity,
        });
    });

    return Array.from(merged.values());
}

export function getItemQuantity(items: CartItem[], product: Product): number {
    const key = getCartItemKey(product);
    return items.find((item) => item.key === key)?.quantity ?? 0;
}

export function addItem(items: CartItem[], product: Product): CartItem[] {
    const key = getCartItemKey(product);
    const existing = items.find((item) => item.key === key);

    if (existing) {
        return items.map((item) =>
            item.key === key
                ? {...item, quantity: item.quantity + 1}
                : item
        );
    }

    return [...items, {key, product, quantity: 1}];
}

export function removeItem(items: CartItem[], product: Product): CartItem[] {
    const key = getCartItemKey(product);
    return items.filter((item) => item.key !== key);
}

export function updateItemQuantity(items: CartItem[], product: Product, quantity: number): CartItem[] {
    if (quantity <= 0) {
        return removeItem(items, product);
    }

    const key = getCartItemKey(product);
    return items.map((item) =>
        item.key === key ? {...item, quantity} : item
    );
}

export function getCartSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}
