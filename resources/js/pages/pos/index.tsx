import { useState } from "react";
import { Category, Product, Transaction } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { LayoutGrid, Search, History, ShoppingCart, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCart } from "./use-cart";
import { formatRupiah } from "./cart-panel";
import ProductGrid from "./product-grid";
import CartPanel from "./cart-panel";
import CheckoutModal from "./checkout-modal";
import ReceiptModal from "./receipt-modal";
import HistoryDialog from "./history-dialog";

interface Props {
    products: Product[];
    categories?: Category[];
    recentTransactions?: Transaction[];
}

export default function PosIndex({ products = [], categories = [], recentTransactions = [] }: Props) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Cart hook
    const {
        cart,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        total,
        totalItems,
    } = useCart([]);

    // Modal & Drawer States
    const [mobileCartOpen, setMobileCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);

    // Filter products by search and category
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.category?.name || '').toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === null || p.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCheckoutSuccess = (transaction: Transaction) => {
        setCheckoutOpen(false);
        setMobileCartOpen(false);
        setCompletedTransaction(transaction);
        setReceiptOpen(true);
        clearCart();
    };

    const handleSelectHistoryTransaction = (transaction: Transaction) => {
        setCompletedTransaction(transaction);
        setReceiptOpen(true);
    };

    return (
        <>
            <Head title="Point of Sale (POS)" />

            <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
                {/* Header Navbar */}
                <header className="flex h-14 sm:h-16 items-center justify-between border-b px-3 sm:px-6 bg-card shrink-0 gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/dashboard"
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground shrink-0"
                            title="Back to Dashboard"
                        >
                            <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                        <h1 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight hidden sm:inline-block">
                            Point of Sale
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-xs sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-8 sm:h-10 text-xs sm:text-sm bg-muted/30 focus-visible:bg-background"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Header Action Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                        {/* Mobile Cart Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMobileCartOpen(true)}
                            className="lg:hidden relative gap-1.5 h-8 sm:h-10 px-2.5 text-xs font-semibold"
                        >
                            <ShoppingCart className="h-4 w-4 text-primary" />
                            {totalItems > 0 && (
                                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1 font-mono">
                                    {totalItems}
                                </span>
                            )}
                        </Button>

                        {/* History Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setHistoryOpen(true)}
                            className="gap-1.5 h-8 sm:h-10 px-2.5 sm:px-3.5 font-semibold text-xs border"
                        >
                            <History className="h-4 w-4 text-primary" />
                            <span className="hidden sm:inline">History</span>
                            {recentTransactions.length > 0 && (
                                <span className="ml-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-extrabold text-primary font-mono">
                                    {recentTransactions.length}
                                </span>
                            )}
                        </Button>
                    </div>
                </header>

                {/* Main POS Content Body */}
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Catalog Section */}
                    <ProductGrid
                        products={filteredProducts}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        onAdd={addItem}
                    />

                    {/* Desktop Cart Order Sidebar */}
                    <CartPanel
                        cart={cart}
                        total={total}
                        totalItems={totalItems}
                        onUpdateQuantity={setQuantity}
                        onRemoveItem={removeItem}
                        onClearCart={clearCart}
                        onOpenCheckout={() => setCheckoutOpen(true)}
                        className="hidden lg:flex w-80 xl:w-96 border-l shrink-0"
                    />

                    {/* Mobile Floating Cart Action Bar */}
                    {cart.length > 0 && (
                        <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
                            <button
                                type="button"
                                onClick={() => setMobileCartOpen(true)}
                                className="w-full bg-primary text-primary-foreground p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition-all active:scale-98 font-sans"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20 font-mono font-bold text-sm">
                                        {totalItems}
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-primary-foreground/80 font-medium leading-none">Current Order</p>
                                        <p className="text-base font-black font-mono leading-tight mt-0.5">
                                            {formatRupiah(total)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 font-bold text-xs bg-primary-foreground/20 px-3 py-1.5 rounded-xl">
                                    <span>Checkout</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom-to-Top Pop-Up Drawer (Current Order) */}
            <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
                <SheetContent
                    side="bottom"
                    className="p-0 h-[88vh] max-h-[88vh] rounded-t-3xl border-t flex flex-col overflow-hidden bg-background shadow-2xl"
                >
                    <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto my-2.5 shrink-0" />
                    <CartPanel
                        cart={cart}
                        total={total}
                        totalItems={totalItems}
                        onUpdateQuantity={setQuantity}
                        onRemoveItem={removeItem}
                        onClearCart={clearCart}
                        onOpenCheckout={() => setCheckoutOpen(true)}
                        className="w-full flex-1 min-h-0 border-none"
                    />
                </SheetContent>
            </Sheet>

            {/* Checkout Payment Modal */}
            <CheckoutModal
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
                cart={cart}
                total={total}
                onSuccess={handleCheckoutSuccess}
            />

            {/* Receipt Modal */}
            <ReceiptModal
                open={receiptOpen}
                onOpenChange={setReceiptOpen}
                transaction={completedTransaction}
                onNewTransaction={() => setCompletedTransaction(null)}
            />

            {/* Transaction History Dialog */}
            <HistoryDialog
                open={historyOpen}
                onOpenChange={setHistoryOpen}
                transactions={recentTransactions}
                onSelectTransaction={handleSelectHistoryTransaction}
            />
        </>
    );
}

PosIndex.layout = {
    breadcrumbs: [{ title: 'POS', href: '/pos' }],
};