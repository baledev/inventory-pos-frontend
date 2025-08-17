import axios from 'axios';
import { z } from 'zod';

const API_BASE_URL = 'http://localhost:8080/api/products';

// Definisikan tipe data dan schema zod untuk produk
export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  sku: z.string(),
  cost: z.number(),
  price: z.number(),
  stock: z.number(),
  category: z.string(),
  description: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

// Mengambil semua produk dari API dan validasi dengan zod
export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_BASE_URL);
  const arrSchema = z.array(ProductSchema);
  const result = arrSchema.safeParse(response.data);
  if (!result.success) {
    throw new Error('Produk tidak valid: ' + JSON.stringify(result.error));
  }
  return result.data;
};

// Membuat produk baru dan validasi dengan zod
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post(API_BASE_URL, product);
  const result = ProductSchema.safeParse(response.data);
  if (!result.success) {
    throw new Error('Produk tidak valid: ' + JSON.stringify(result.error));
  }
  return result.data;
};

// Memperbarui produk yang sudah ada dan validasi dengan zod
export const updateProduct = async (id: number, product: Product): Promise<Product> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, product);
  const result = ProductSchema.safeParse(response.data);
  if (!result.success) {
    throw new Error('Produk tidak valid: ' + JSON.stringify(result.error));
  }
  return result.data;
};

// Menghapus produk
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

type PaginatedProductResponse = {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number; // page number (mulai dari 0)
  size: number;   // page size
  // ...field lain dari response bisa diabaikan jika tidak dipakai
};

type GetProductsPaginatedParams = {
  page: number; // mulai dari 1 (frontend), backend biasanya mulai dari 0
  size: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: any; // bisa diubah sesuai kebutuhan filter
};

export const getProductsPaginated = async ({
  page,
  size,
  sort,
  order,
  filters,
}: GetProductsPaginatedParams): Promise<{ data: Product[]; total: number; totalPages: number; }> => {
  // Backend biasanya page mulai dari 0
  const params: Record<string, any> = {
    page: page - 1,
    size,
  };
  if (sort) {
    params.sort = `${sort},${order ?? "asc"}`;
  }
  // Implementasi filter jika backend mendukung, misal: params.name = filters?.find(f => f.id === "name")?.value
  // Silakan sesuaikan dengan API backend Anda

  const response = await axios.get<PaginatedProductResponse>(API_BASE_URL + "/search", { params });
  const arrSchema = z.array(ProductSchema);
  const result = arrSchema.safeParse(response.data.content);
  if (!result.success) {
    throw new Error("Produk tidak valid: " + JSON.stringify(result.error));
  }
  return {
    data: result.data,
    total: response.data.totalElements,
    totalPages: response.data.totalPages,
  };
};