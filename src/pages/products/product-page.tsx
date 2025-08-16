import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product
} from '@/services/product-service';
import { Loader2, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function ProductManagementPage() {
    const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Product>();

  useEffect(() => {
    console.log(isAuthenticated)
    if(isAuthenticated) {
        fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      toast.success("Data produk berhasil dimuat!");
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    //   toast.error("Gagal memuat data produk.");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddEdit = async (data: Product) => {
    try {
      if (currentProduct) {
        // Logika untuk mengedit produk
        await updateProduct(currentProduct.id!, data);
        toast.success("Produk berhasil diperbarui!");
      } else {
        // Logika untuk menambah produk baru
        await createProduct(data);
        toast.success("Produk baru berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      reset();
      fetchProducts();
    } catch (error) {
      console.error("Operasi produk gagal:", error);
      toast.error("Gagal menyimpan produk.");
    }
  };

  const onDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        toast.success("Produk berhasil dihapus!");
        fetchProducts();
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      reset(product);
    } else {
      setCurrentProduct(null);
      reset();
    }
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat data produk...</span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <Button onClick={() => openDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Produk</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Harga Beli</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>Rp {product.cost.toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(product.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada produk yang tersedia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog untuk Tambah/Edit Produk */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
            <DialogDescription>
              {currentProduct ? "Perbarui detail produk." : "Isi formulir untuk menambahkan produk baru."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddEdit)}>
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
      </Dialog>
    </div>
  );
}
