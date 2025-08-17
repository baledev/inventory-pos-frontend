import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInventoryReport, getSalesReport } from "@/services/report-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SalesReportData {
  totalRevenue: number | null;
  transactionCount: number | null;
  bestSellingProducts: { productName: string; totalSold: number }[];
}

interface InventoryReportData {
  lowStockProducts: { id: number; name: string; stock: number }[];
  totalInventoryValueByCost: number | null;
  totalInventoryValueByPrice: number | null;
}

export default function Page() {
  const [salesReport, setSalesReport] = useState<SalesReportData | null>(null);
  const [inventoryReport, setInventoryReport] = useState<InventoryReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesData = await getSalesReport();
        const inventoryData = await getInventoryReport();

        setSalesReport(salesData);
        setInventoryReport(inventoryData);

        toast.success("Data laporan berhasil dimuat.");
      } catch (error) {
        console.error("Gagal memuat data laporan:", error);
        toast.error("Gagal memuat data laporan. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const header = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">
            Building Your Application
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AuthenticatedLayout header={header} loadingState={isLoading}>
      {/* Laporan Penjualan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <span className="text-green-500">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {salesReport?.totalRevenue?.toLocaleString('id-ID') || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Berdasarkan penjualan.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Transaksi</CardTitle>
            <span className="text-blue-500">🛒</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesReport?.transactionCount || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total transaksi penjualan.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Produk Terlaris */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Terjual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesReport?.bestSellingProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.totalSold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Produk Stok Rendah */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Produk Stok Rendah</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryReport?.lowStockProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
