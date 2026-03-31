import type { OrderStatus } from '../constants/orderStatus';

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  addressSnapshot: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  completed: boolean;
}