import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { DataTable } from './data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ProductForm } from './product-form';
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

  // Form logic moved to ProductForm

  useEffect(() => {
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
      // reset();
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
    setCurrentProduct(product || null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat data produk...</span>
      </div>
    );
  }

  const header = (
    <>
      <h1 className="text-base font-medium">Manajemen Produk</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" onClick={() => openDialog()}>
          <PlusCircle className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>
    </>
  );

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Produk',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'cost',
      header: 'Harga Beli',
      cell: info => `Rp ${Number(info.getValue()).toLocaleString('id-ID')}`,
    },
    {
      accessorKey: 'price',
      header: 'Harga Jual',
      cell: info => `Rp ${Number(info.getValue()).toLocaleString('id-ID')}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stok',
      cell: info => info.getValue(),
    },
  ];

  return (
    <AuthenticatedLayout header={header}>
      <DataTable
        columns={columns}
        data={products}
        // actions={product => (
        //   <>
        //     <Button variant="outline" size="sm" onClick={() => openDialog(product)}>
        //       <Pencil className="h-4 w-4" />
        //     </Button>
        //     <Button variant="outline" size="sm" onClick={() => onDelete(product.id!)}>
        //       <Trash2 className="h-4 w-4" />
        //     </Button>
        //   </>
        // )}
      />

      {/* Dialog untuk Tambah/Edit Produk */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <ProductForm
          initialProduct={currentProduct}
          onSubmit={onAddEdit}
          onClose={() => setIsFormOpen(false)}
          open={isFormOpen}
        />
      </Dialog>
    </AuthenticatedLayout>
  );
}
