export const ORDER_STATUSES = [
  'pending',
  'accepted',
  'going_for_pickup',
  'out_for_delivery',
  'reached',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderStatusColor = {
  bg: string;
  border: string;
  text: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, { next: string; done: string }> = {
  pending: {
    next: 'Waiting for confirmation',
    done: 'Confirmed',
  },
  accepted: {
    next: 'Finding delivery partner',
    done: 'Accepted',
  },
  going_for_pickup: {
    next: 'Going for Pickup',
    done: 'Order Picked Up',
  },
  out_for_delivery: {
    next: 'Will be out for delivery soon',
    done: 'Out for Delivery',
  },
  reached: {
    next: 'Reaching to your Doorstep',
    done: 'Reached Destination',
  },
  delivered: {
    next: 'Delivered',
    done: 'Delivered',
  },
  cancelled: {
    next: 'Cancelled',
    done: 'Cancelled',
  },
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  pending: '⏳',
  accepted: '✅',
  going_for_pickup: '🏃',
  out_for_delivery: '🚚',
  reached: '📍',
  delivered: '✓',
  cancelled: '✗',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, OrderStatusColor> = {
  pending: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
  accepted: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  going_for_pickup: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
  },
  out_for_delivery: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
  },
  reached: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
  delivered: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
};

export const CUSTOMER_ACTIVE_TRACKING_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'going_for_pickup',
  'out_for_delivery',
  'reached',
  'delivered',
];

export const CUSTOMER_CANCELLED_TRACKING_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'cancelled',
];

export const COMPLETED_ORDER_FINAL_STATUSES: OrderStatus[] = [
  'delivered',
  'cancelled',
];

export const formatOrderStatus = (status: string): string => {
  const typedStatus = status as OrderStatus;
  if (ORDER_STATUS_LABELS[typedStatus]) {
    return ORDER_STATUS_LABELS[typedStatus].next;
  }

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
