import { Category, Product } from "@/types";
import { formatRupiah } from "./cart-panel";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
    products: Product[];
    categories?: Category[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
    onAdd: (product: Product) => void;
}

export function getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
        return imagePath;
    }
    if (imagePath.startsWith('/storage/')) {
        return imagePath;
    }
    if (imagePath.startsWith('storage/')) {
        return `/${imagePath}`;
    }
    return `/storage/${imagePath.replace(/^\/+/, '')}`;
}

export default function ProductGrid({
    products,
    categories = [],
    selectedCategory,
    onSelectCategory,
    onAdd,
}: Props) {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Categories Horizontal Scroll Pills */}
            {categories.length > 0 && (
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto border-b px-3 sm:px-4 py-2.5 sm:py-3 shrink-0 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => onSelectCategory(null)}
                        className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                            selectedCategory === null
                                ? 'bg-primary text-primary-foreground shadow-xs scale-105'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelectCategory(cat.id)}
                            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                                selectedCategory === cat.id
                                    ? 'bg-primary text-primary-foreground shadow-xs scale-105'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Product Cards Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-20 lg:pb-4">
                {products.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Package className="h-10 w-10 sm:h-12 sm:w-12 opacity-30 mb-2" />
                        <p className="font-semibold text-sm sm:text-base text-foreground">No Products Found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Try searching for a different item or select another category.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {products.map((product) => {
                            const isOutOfStock = product.stock <= 0;
                            const imageUrl = getImageUrl(product.image);

                            return (
                                <button
                                    key={product.id}
                                    type="button"
                                    disabled={isOutOfStock}
                                    onClick={() => onAdd(product)}
                                    className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-all duration-200 touch-manipulation ${
                                        isOutOfStock
                                            ? 'opacity-60 cursor-not-allowed border-dashed'
                                            : 'hover:border-primary hover:shadow-md active:scale-95'
                                    }`}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    target.style.display = 'none';
                                                    if (target.nextElementSibling) {
                                                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback Letter Avatar */}
                                        <div
                                            className={`flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-primary/5 text-xl sm:text-2xl font-black text-primary/40 uppercase ${
                                                imageUrl ? 'hidden' : 'flex'
                                            }`}
                                        >
                                            {product.name ? product.name.charAt(0) : '?'}
                                        </div>

                                        {/* Category Badge */}
                                        {product.category?.name && (
                                            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded-md bg-background/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-foreground shadow-xs border truncate max-w-[80%]">
                                                {product.category.name}
                                            </span>
                                        )}

                                        {/* Out of Stock Overlay */}
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-background/80 backdrop-blur-2xs flex items-center justify-center p-2 text-center">
                                                <Badge variant="destructive" className="text-[9px] sm:text-[10px] font-bold">
                                                    Out of Stock
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Body */}
                                    <div className="flex flex-col gap-0.5 sm:gap-1 p-2.5 sm:p-3">
                                        <h3 className="truncate text-xs font-semibold text-foreground" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <span className="text-xs sm:text-sm font-black text-primary font-mono">
                                                {formatRupiah(product.price)}
                                            </span>
                                            <span className={`text-[10px] sm:text-[11px] font-medium font-mono ${
                                                product.stock <= 5 ? 'text-amber-600 font-bold' : 'text-muted-foreground'
                                            }`}>
                                                Stk: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}