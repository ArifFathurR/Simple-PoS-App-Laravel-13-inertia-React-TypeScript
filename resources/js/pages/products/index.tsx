import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Category, Product } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Pencil, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProductForm from "./product-form";
import { getImageUrl } from "@/pages/pos/product-grid";

interface Props {
    products: Product[];
    categories: Category[];
}

export default function ProductsIndex({ products, categories }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    function handleEdit(product: Product) {
        setEditing(product);
        setShowForm(true);
    }

    function handleDelete(product: Product) {
        if (!confirm(`Delete "${product.name}"?`)) return;
        router.delete(`/products/${product.id}`, {
            onSuccess: () => toast.success('Product deleted.'),
        });
    }

    function handleClose() {
        setShowForm(false);
        setEditing(null);
    }

    return (
        <>
            <Head title="Products" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button onClick={() => { setEditing(null); setShowForm(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-primary text-primary-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left w-16">Gambar</th>
                                <th className="px-4 py-3 text-left">Nama Produk</th>
                                <th className="px-4 py-3 text-left">Kategori</th>
                                <th className="px-4 py-3 text-left">Harga</th>
                                <th className="px-4 py-3 text-left">Stok</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada produk
                                    </td>
                                </tr>
                            )}

                            {products.map((p) => {
                                const imageUrl = getImageUrl(p.image);
                                return (
                                    <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-2">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={p.name}
                                                    className="h-10 w-10 rounded-md object-cover border"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground border">
                                                    <ImageIcon className="h-4 w-4 opacity-50" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{p.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {p.category?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-semibold">Rp {p.price}</td>
                                        <td className={`px-4 py-3 font-mono ${p.stock <= 5 ? 'font-bold text-amber-600' : ''}`}>
                                            {p.stock}
                                            {p.stock === 0 && <span className="ml-1 text-xs text-destructive font-sans">(Out)</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={p.is_active ? 'default' : 'secondary'}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <ProductForm
                    categories={categories}
                    product={editing}
                    onClose={handleClose}
                />
            )}
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [{ title: 'Products', href: '/products' }],
};