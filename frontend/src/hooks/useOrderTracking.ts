import { useCallback, useEffect, useRef, useState } from 'react';
import type { StatusEvent } from '../interfaces/orderTracking';
import { useAuthStore } from '../stores/authStore';

const MAX_RETRY_DELAY = 30_000;
const INITIAL_RETRY_DELAY = 2_000;

export function useOrderTracking(orderId: string | undefined, shouldConnect: boolean = true) {
  const [statusEvents, setStatusEvents] = useState<StatusEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const retryDelayRef = useRef(INITIAL_RETRY_DELAY);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const connect = useCallback(
    (id: string, token: string) => {
      const baseUrl = import.meta.env.VITE_API_URL ?? '/api';
      const url = `${baseUrl}/orders/${id}/events?token=${token}`;
      const es = new EventSource(url, { withCredentials: true });

      es.onopen = () => {
        setIsConnected(true);
        retryDelayRef.current = INITIAL_RETRY_DELAY;
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
        retryTimerRef.current = setTimeout(() => {
          retryDelayRef.current = Math.min(
            retryDelayRef.current * 2,
            MAX_RETRY_DELAY,
          );
          connect(id, token);
        }, retryDelayRef.current);
      };

      return es;
    },
    [],
  );

  useEffect(() => {
    if (!orderId || !accessToken || !shouldConnect) return;

    retryDelayRef.current = INITIAL_RETRY_DELAY;
    const es = connect(orderId, accessToken);

    return () => {
      clearTimeout(retryTimerRef.current);
      es.close();
    };
  }, [orderId, accessToken, shouldConnect, connect]);

  return { statusEvents, isConnected };
}
