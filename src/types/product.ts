// Types for FarmaData products and lists
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  manufacturer?: string;
  activeIngredient?: string;
  dosage?: string;
  image: string;
  inStock: boolean;
  prescription?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductList {
  id: number;
  name: string;
  description?: string;
  total: number;
  products: ProductInList[];
  moreCount: number;
  color?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInList {
  productId: number;
  product?: Product;
  quantity: number;
  image: string;
  name: string;
  price: number;
}

export interface CreateListData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateListData extends Partial<CreateListData> {
  id: number;
}

export type ViewMode = "grid" | "list";
export type SortOption = "name" | "price" | "category" | "date";