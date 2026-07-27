export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    price: string;
    stock: number;
    image: string | null;
    is_active: boolean;
    category?: Category;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface TransactionDetail {
    id: number;
    transaction_id: number;
    product_id: number;
    quantity: number;
    price: string;
    subtotal: string;
    product?: Product;
    created_at?: string;
    updated_at?: string;
}

export interface Transaction {
    id: number;
    invoice_number: string;
    user_id: number;
    total_amount: string;
    pay_amount: string;
    change_amount: string;
    payment_method: 'cash' | 'qris' | 'transfer' | 'card';
    notes: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    details?: TransactionDetail[];
}