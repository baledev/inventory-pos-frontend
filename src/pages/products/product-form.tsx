import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import type { Product } from '@/services/product-service';
import { useEffect } from 'react';

interface ProductFormProps {
  initialProduct?: Product | null;
  onSubmit: (data: Product) => void;
  onClose: () => void;
  open: boolean;
}

export function ProductForm({ initialProduct, onSubmit, onClose, open }: ProductFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Product>({
    defaultValues: initialProduct || {}
  });

  // Reset form when dialog opens/closes or initialProduct changes
  useEffect(() => {
    if (open) {
      reset(initialProduct || {});
    }
  }, [open, initialProduct, reset]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{initialProduct ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
        <DialogDescription>
          {initialProduct ? "Perbarui detail produk." : "Isi formulir untuk menambahkan produk baru."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nama</Label>
            <Input id="name" {...register("name", { required: true })} className="col-span-3" />
            {errors.name && <span className="text-red-500 text-sm col-span-4 text-right">Nama wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">SKU</Label>
            <Input id="sku" {...register("sku", { required: true })} className="col-span-3" />
            {errors.sku && <span className="text-red-500 text-sm col-span-4 text-right">SKU wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">Harga Beli</Label>
            <Input id="cost" type="number" {...register("cost", { required: true, valueAsNumber: true })} className="col-span-3" />
            {errors.cost && <span className="text-red-500 text-sm col-span-4 text-right">Harga beli wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Harga Jual</Label>
            <Input id="price" type="number" {...register("price", { required: true, valueAsNumber: true })} className="col-span-3" />
            {errors.price && <span className="text-red-500 text-sm col-span-4 text-right">Harga jual wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Stok</Label>
            <Input id="stock" type="number" {...register("stock", { required: true, valueAsNumber: true })} className="col-span-3" />
            {errors.stock && <span className="text-red-500 text-sm col-span-4 text-right">Stok wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Kategori</Label>
            <Input id="category" {...register("category", { required: true })} className="col-span-3" />
            {errors.category && <span className="text-red-500 text-sm col-span-4 text-right">Kategori wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">Pemasok</Label>
            <Input id="supplier" {...register("supplier", { required: true })} className="col-span-3" />
            {errors.supplier && <span className="text-red-500 text-sm col-span-4 text-right">Pemasok wajib diisi</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Deskripsi</Label>
            <textarea id="description" {...register("description")} className="col-span-3 border rounded-md p-2" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
