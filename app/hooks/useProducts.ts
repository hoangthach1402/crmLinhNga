'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Product {
  id: number;
  product_code: string;      // Mã hàng
  product_name: string;      // Tên hàng
  category: string;          // Loại (fabric, lace, beads)
  cost_price: number;        // Giá vốn
  stock_quantity: number;    // Tồn kho
  unit: string;             // ĐVT (piece, meter, kg)
  image_url: string;        // Hình ảnh
  supplier: string;         // Nhà cung cấp
  order_link: string;       // Link đặt hàng
  created_at: string;
}

// Query key factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// API functions
const fetchProducts = async (page: number = 1, limit: number = 50, search: string = ''): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  timestamp: string;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  const response = await fetch(`/api/products?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch products');
  }
  return data;
};

const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to create product');
  }
  
  return data.product;
};

const updateProduct = async ({ id, productData }: { id: number; productData: Partial<Product> }): Promise<Product> => {
  const response = await fetch(`/api/products?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to update product');
  }
  
  return data.product;
};

const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`/api/products?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete product');
  }
};

// Custom hooks
export const useProducts = (page: number = 1, limit: number = 50, search: string = '') => {
  return useQuery({
    queryKey: productKeys.list(`page=${page}&limit=${limit}&search=${search}`),
    queryFn: () => fetchProducts(page, limit, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
