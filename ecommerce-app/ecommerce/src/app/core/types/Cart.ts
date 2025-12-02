import { User } from './User';
import { Product } from './Products';

export type Cart = {
  _id: string;
  user: User; // <- usa el público, sin hashPassword
  products: { product: Product; quantity: number }[];
};