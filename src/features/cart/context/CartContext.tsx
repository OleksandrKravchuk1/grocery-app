import {CartItem, Product} from "@/src/types/product";
import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addItem, getItemQuantity, normalizeCartItems, removeItem, updateItemQuantity} from "@/src/features/cart/utilities/cart";

const CART_STORAGE_KEY = "cart:v1";

type CartContextValue = {
    items: CartItem[];
    getQuantity: (product: Product) => number;
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    updateQuantity: (product: Product, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
    children: ReactNode
}

export function CartProvider({children}: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const isHydratedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const hydrateCart = async () => {
            try {
                const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
                if (!raw || !isMounted) return;

                const parsed = JSON.parse(raw) as CartItem[];
                if (Array.isArray(parsed)) {
                    setItems(normalizeCartItems(parsed));
                }
            } catch (error) {
                console.error("Failed to hydrate cart", error);
            } finally {
                if (isMounted) {
                    isHydratedRef.current = true;
                }
            }
        };

        void hydrateCart();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!isHydratedRef.current) return;

        const persistCart = async () => {
            try {
                await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (error) {
                console.error("Failed to persist cart", error);
            }
        };

        void persistCart();
    }, [items]);

    const getQuantity = useCallback((product: Product) => {
        return getItemQuantity(items, product);
    }, [items]);

    const addToCart = useCallback((product: Product) => {
        setItems((prev) => addItem(prev, product))
    }, [])

    const removeFromCart = useCallback((product: Product) => {
        setItems((prev) => removeItem(prev, product))
    }, [])

    const updateQuantity = useCallback((product: Product, quantity: number) => {
        setItems((prev) => updateItemQuantity(prev, product, quantity))
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const value = useMemo(
        () => ({
            items,
            getQuantity,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
        }),
        [items, getQuantity, addToCart, removeFromCart, updateQuantity, clearCart]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>

}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }

    return context
}
