import apiClient from './apiClient';

let cachedVapidKey: string | null = null;

async function getVapidPublicKey(): Promise<string> {
  if (cachedVapidKey) return cachedVapidKey;
  const { data } = await apiClient.get<{ publicKey: string }>('/notifications/vapid-public-key');
  cachedVapidKey = data.publicKey;
  return cachedVapidKey;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function getPushPermissionState(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!('Notification' in window) || !('PushManager' in window)) return 'unsupported';
  return Notification.permission;
}

export async function isSubscribedToPush(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch {
    return false;
  }
}

export async function subscribeToPush(): Promise<boolean> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const reg = await navigator.serviceWorker.ready;
    const publicKey = await getVapidPublicKey();

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
    });

    const subJson = subscription.toJSON() as {
      endpoint: string;
      keys?: { p256dh: string; auth: string };
    };

    await apiClient.post('/notifications/push/subscribe', {
      endpoint: subJson.endpoint,
      keys: subJson.keys,
    });

    return true;
  } catch (err) {
    console.error('Push subscription failed:', err);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    if (!subscription) return true;

    await apiClient.post('/notifications/push/unsubscribe', {
      endpoint: subscription.endpoint,
    });

    await subscription.unsubscribe();
    return true;
  } catch (err) {
    console.error('Push unsubscribe failed:', err);
    return false;
  }
}
