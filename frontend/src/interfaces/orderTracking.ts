import type { OrderStatus } from "../constants/orderStatus";

export interface StatusEvent {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  note?: string;
}