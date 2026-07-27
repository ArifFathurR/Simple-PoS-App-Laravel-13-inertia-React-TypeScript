import { CartItem } from "@/types";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    cart: CartItem[];
    total: number;
    totalItems: number;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onClearCart: () => void;
    onOpenCheckout: () => void;
    className?: string;
}

export function formatRupiah(amount: number | string): string {
    const val = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val || 0);
}

export default function CartPanel({
    cart,
    total,
    totalItems,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onOpenCheckout,
    className = "",
}: Props) {
    return (
        <div className={`flex flex-col bg-card/80 backdrop-blur-xs h-full ${className}`}>
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b px-4 sm:px-5 py-3.5 bg-muted/30 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground text-sm sm:text-base">Current Order</h2>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                {cart.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearCart}
                        className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 h-8 px-2"
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
                {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center p-6 text-muted-foreground">
                        <div className="mb-3 rounded-full bg-muted p-4">
                            <ShoppingBag className="h-8 w-8 opacity-40" />
                        </div>
                        <p className="font-medium text-sm text-foreground">Cart is Empty</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                            Tap products to add them to this order.
                        </p>
                    </div>
                ) : (
                    cart.map(({ product, quantity }) => {
                        const price = parseFloat(product.price || '0');
                        const itemSubtotal = price * quantity;
                        return (
                            <div
                                key={product.id}
                                className="group relative flex flex-col gap-2 rounded-xl border bg-background/90 p-3 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{product.name}</h4>
                                        <p className="text-[11px] text-muted-foreground">{formatRupiah(price)} / item</p>
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-foreground font-mono">
                                        {formatRupiah(itemSubtotal)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-0.5 pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5 border">
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground active:scale-95"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-7 text-center text-xs font-bold font-mono">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                                            disabled={quantity >= product.stock}
                                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onRemoveItem(product.id)}
                                        className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Cart Summary & Footer */}
            <div className="border-t bg-background p-3.5 sm:p-4 space-y-3 shadow-lg shrink-0">
                <div className="space-y-1">
                    <div className="flex justify-between text-muted-foreground text-xs">
                        <span>Total Items</span>
                        <span className="font-mono">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="font-semibold text-sm sm:text-base text-foreground">Total Bill</span>
                        <span className="text-lg sm:text-xl font-black text-primary font-mono">
                            {formatRupiah(total)}
                        </span>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all gap-2"
                    disabled={cart.length === 0}
                    onClick={onOpenCheckout}
                >
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    Process Payment
                </Button>
            </div>
        </div>
    );
}