import { Category } from './Category';

export type Product = {
  _id:string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imagesUrl?: string[];
  category: Category;
};

export type ProductResponse = {
  products: Product[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number;
    totalResults: number;
  };
};