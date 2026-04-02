import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { OrderStatus } from '../constants/orderStatus';
import { toNumber, toOptionalNumber } from '../lib/parsers';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryFee: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  addressSnapshot: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    phone?: string;
  };
  items: OrderItem[];
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  completed: boolean;
  deliveryPartner?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

const normalizeOrder = (order: Record<string, unknown>): Order => ({
  ...order,
  totalAmount: toNumber(order.totalAmount, 0),
  deliveryFee: toNumber(order.deliveryFee, 0),
  deliveryLatitude: toOptionalNumber(order.deliveryLatitude),
  deliveryLongitude: toOptionalNumber(order.deliveryLongitude),
  items: Array.isArray(order.items)
    ? order.items.filter(isRecord).map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: toNumber(item.unitPrice, 0),
      }))
    : [],
  statusHistory: Array.isArray(order.statusHistory) ? order.statusHistory : [],
}) as Order;

export function useOrders() {
  const token = useAuthStore((s) => s.accessToken);
  const [data, setData] = useState<Order[]>([]);
  // Start as loading when a token is present; idle when logged out
  const [isLoading, setIsLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;

    const es = new EventSource(`/api/orders/assigned/stream?token=${token}`);

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'orders' && Array.isArray(msg.orders)) {
          setData(msg.orders.filter(isRecord).map(normalizeOrder));
          setIsLoading(false);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
      setIsLoading(false);
    };

    return () => {
      es.close();
      setData([]);
    };
  }, [token]);

  // refetch is a no-op — updates arrive via SSE
  const refetch = () => {};

  return { data, isLoading, refetch };
}
