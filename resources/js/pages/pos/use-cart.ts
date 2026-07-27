import { useReducer, useMemo } from "react";
import { CartItem, Product } from "@/types";

type CartAction =
    | { type: 'ADD'; product: Product }
    | { type: 'REMOVE'; productId: number }
    | { type: 'SET_QTY'; productId: number; quantity: number }
    | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case 'ADD': {
            const existing = state.find(i => i.product.id === action.product.id);
            if (existing) {
                return state.map(i =>
                    i.product.id === action.product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...state, { product: action.product, quantity: 1 }];
        }
        case 'REMOVE':
            return state.filter(i => i.product.id !== action.productId);

        case 'SET_QTY':
            if (action.quantity <= 0) {
                return state.filter(i => i.product.id !== action.productId);
            }
            return state.map(i =>
                i.product.id === action.productId
                    ? { ...i, quantity: action.quantity }
                    : i
            );

        case 'CLEAR':
            return [];

        default:
            return state;
    }
}

export function useCart(initialState: CartItem[] = []) {
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (product: Product) => {
        dispatch({ type: 'ADD', product });
    };

    const removeItem = (productId: number) => {
        dispatch({ type: 'REMOVE', productId });
    };

    const setQuantity = (productId: number, quantity: number) => {
        dispatch({ type: 'SET_QTY', productId, quantity });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR' });
    };

    const total = useMemo(() => {
        return cart.reduce((sum, item) => sum + parseFloat(item.product.price || '0') * item.quantity, 0);
    }, [cart]);

    const totalItems = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    return {
        cart,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        total,
        totalItems,
        dispatch,
    };
}