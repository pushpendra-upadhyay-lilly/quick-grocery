import { useEffect, useState } from 'react';
import type { StatusEvent } from '../interfaces/orderTracking';
import { useAuthStore } from '../stores/authStore';

export function useOrderTracking(orderId: string | undefined, shouldConnect: boolean = true) {
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!orderId || !accessToken || !shouldConnect) return;

    const url = `/api/orders/${orderId}/events?token=${accessToken}`;
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      setIsConnected(true);
    };

    es.onmessage = (e) => {
      try {
        const event: StatusEvent = JSON.parse(e.data);
        setStatusEvents((prev) => [...prev, event]);
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [orderId, accessToken, shouldConnect]);

  return { statusEvents, isConnected };
}
