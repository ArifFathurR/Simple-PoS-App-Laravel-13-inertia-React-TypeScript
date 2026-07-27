import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { toast } from "sonner";

interface Props {
    categori: Category | null;
    onClose: () => void;
}

export default function CategoriesForm({ categori, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: categori?.name ?? '',
        description: categori?.description ?? '',
        _method: categori ? 'PUT' : undefined,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => {
                toast.success(categori ? 'categori update' : 'categori created');
                reset();
                onClose();
            },
        };

        if (categori) {
            post(`/categories/${categori.id}`, options);
        } else {
            post('/categories');
        }
    }


    return (
        <>
            <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{categori ? 'Edit categori' : 'Add categori'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="categori name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="categori description (optional)"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : categori ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}