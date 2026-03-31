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

export interface SuggestionProduct {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
}