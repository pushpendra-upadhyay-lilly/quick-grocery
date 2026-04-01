export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  imageUrl?: string;
  images?: string[];
  categoryId: string;
  tags?: string[];
  inStock: boolean;
  stockQty: number;
  unit?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder: number;
  children?: Category[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  inStockCount: number;
  outOfStockCount: number;
}
