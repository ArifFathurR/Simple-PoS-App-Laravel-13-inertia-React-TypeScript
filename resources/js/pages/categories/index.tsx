import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CategoriesForm from "./categories-form";


interface Props {
    categories: Category[];
}

export default function CategoryIndex({ categories }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    function handleEdit(categories: Category) {
        setEditing(categories);
        setShowForm(true)
    }

    function handleDelete(categories: Category) {
        if (!confirm(`Delete "${categories.name}"?`)) return;
        router.delete(`/categories/${categories.id}`, {
            onSuccess: () => toast.success('Product Deleted'),
        });
    }

    function handleClose() {
        setShowForm(false);
        setEditing(null);
    }
    return (
        <>
            <Head title="Categories" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button onClick={() => { setEditing(null); setShowForm(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-black">
                            <tr className="text-white">
                                <th className="px-4 py-3 text-left">nama produk</th>
                                <th className="px-4 py-3 text-left">kategori</th>

                                <th className="px-4 py-3 text-left">aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada produk
                                    </td>
                                </tr>
                            )}

                            {categories.map((p) => (
                                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-200">
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {p.description}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <CategoriesForm
                    categori={editing}
                    onClose={handleClose}
                />
            )}
        </>
    );
}

CategoryIndex.layout ={
    breadcrumb: [{title: 'Categories', href: '/categories'}],
};