import { useState, useEffect, useCallback } from 'react';
import {
  getPushPermissionState,
  isSubscribedToPush,
  subscribeToPush,
  unsubscribeFromPush,
} from '../lib/pushNotifications';
import { useAuthStore } from '../stores/authStore';

export function usePushNotifications() {
  const user = useAuthStore((s) => s.user);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionState, setPermissionState] = useState(getPushPermissionState());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsSubscribed(false);
      return;
    }
    isSubscribedToPush().then(setIsSubscribed);
  }, [user]);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await subscribeToPush();
      setIsSubscribed(success);
      setPermissionState(getPushPermissionState());
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromPush();
      if (success) setIsSubscribed(false);
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSubscribed,
    isSupported: permissionState !== 'unsupported',
    isDenied: permissionState === 'denied',
    isLoading,
    subscribe,
    unsubscribe,
  };
}
