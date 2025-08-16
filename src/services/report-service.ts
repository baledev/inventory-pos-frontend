// src/services/reportService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reports';

// Tipe data untuk laporan
interface SalesReport {
  totalRevenue: number;
  transactionCount: number;
  bestSellingProducts: {
    productName: string;
    totalSold: number;
  }[];
}

interface InventoryReport {
  lowStockProducts: {
    id: number;
    name: string;
    stock: number;
  }[];
  totalInventoryValueByCost: number;
  totalInventoryValueByPrice: number;
}

// Mengambil laporan penjualan
export const getSalesReport = async (): Promise<SalesReport> => {
  const response = await axios.get<SalesReport>(`${API_BASE_URL}/sales`);
  return response.data;
};

// Mengambil laporan inventaris
export const getInventoryReport = async (): Promise<InventoryReport> => {
  const response = await axios.get<InventoryReport>(`${API_BASE_URL}/inventory`);
  return response.data;
};
