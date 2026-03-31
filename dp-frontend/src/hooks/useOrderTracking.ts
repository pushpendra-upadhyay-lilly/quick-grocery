import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { OrderStatus } from '../constants/orderStatus';

export interface StatusEvent {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export function useOrderTracking(
  orderId: string | undefined,
  shouldConnect: boolean = true,
) {
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!orderId || !accessToken || !shouldConnect) return;

    const url = `/api/orders/${orderId}/events?token=${accessToken}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: StatusEvent = JSON.parse(event.data);
        setStatusEvents((prev) => [...prev, data]);
      } catch (error) {
        console.error('Failed to parse order tracking event:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [orderId, accessToken, shouldConnect]);

  return { statusEvents, isConnected };
}
