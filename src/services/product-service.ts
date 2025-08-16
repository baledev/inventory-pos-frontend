import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

// Definisikan tipe data untuk produk
export interface Product {
  id?: number;
  name: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
  category: string;
  supplier: string;
  description: string;
}

// Mengambil semua produk dari API
export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_BASE_URL);
  return response.data;
};

// Membuat produk baru
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(API_BASE_URL, product);
  return response.data;
};

// Memperbarui produk yang sudah ada
export const updateProduct = async (id: number, product: Product): Promise<Product> => {
  const response = await axios.put<Product>(`${API_BASE_URL}/${id}`, product);
  return response.data;
};

// Menghapus produk
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
