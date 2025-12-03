export type PaymentMethod = 'CARD' | 'CASH' | 'TRANSFER';

export type ShippingAddress = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type CreateOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingCost?: number;
};

export type OrderProduct = {
  product: string;
  quantity: number;
};

export type Order = {
  _id: string;
  user: string | { _id: string; displayName: string; email: string };
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingCost: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt?: string;
  updatedAt?: string;
};