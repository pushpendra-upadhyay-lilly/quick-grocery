import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
  parentId?: string | null;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  description: string;
  categoryId: string;
  tags: string[];
  inStock: boolean;
  stockQty: number;
  unit: string;
  brand: string;
}

export function useProducts(
  page = 1,
  limit = 20,
  categoryId?: string,
  search?: string,
  sort?: string,
) {
  return useQuery({
    queryKey: ['products', { page, limit, categoryId, search, sort }],
    queryFn: async () => {
      const response = await apiClient.get('/products', {
        params: {
          page,
          limit,
          categoryId,
          search,
          sort,
          inStock: true,
        },
      });
      return response.data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/products/categories');
      return response.data as Category[];
    },
  });
}

export function useSubcategories(parentSlug: string | undefined) {
  return useQuery({
    queryKey: ['categories', 'sub', parentSlug],
    queryFn: async () => {
      const response = await apiClient.get(
        `/products/categories/${parentSlug}/subcategories`,
      );
      return response.data as Category[];
    },
    enabled: !!parentSlug,
    staleTime: 60_000,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['products', 'top'],
    queryFn: async () => {
      const response = await apiClient.get('/products/top/trending');
      return response.data;
    },
  });
}

export function useMyFrequentProducts() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['products', 'my-frequent'],
    queryFn: async () => {
      const response = await apiClient.get('/products/recommendations/my-frequent');
      return response.data;
    },
    enabled: !!token,
  });
}
