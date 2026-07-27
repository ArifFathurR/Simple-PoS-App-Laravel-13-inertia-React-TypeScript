import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Product } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { toast } from "sonner";

interface Props {
    categories: Category[];
    product?: Product | null;
    onClose: () => void;
}

export default function ProductForm({ categories, product, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: product?.name ?? '',
        category_id: product?.category_id?.toString() ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        stock: product?.stock ?? '',
        is_active: product?.is_active ?? true,
        image: null as File | null,
        _method: product ? 'PUT' : undefined,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => {
                toast.success(product ? 'Product updated' : 'Product created');
                reset();
                onClose();
            },
        };

        if (product) {
            post(`/products/${product.id}`, options);
        } else {
            post('/products', options);
        }
    }

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Product name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id}
                            onValueChange={v => setData('category_id', v)}
                        >
                            <SelectTrigger id="category_id">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Price (Rp)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                placeholder="0"
                            />
                            <InputError message={errors.price} />
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={data.stock}
                                onChange={e => setData('stock', e.target.value)}
                                placeholder="0"
                            />
                            <InputError message={errors.stock} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Product description (optional)"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={e => setData('image', e.target.files?.[0] ?? null)}
                        />
                        <InputError message={errors.image} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                        />
                        <Label htmlFor="is_active">Active (visible in POS)</Label>
                        <InputError message={errors.is_active} />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : product ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}