export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  category: string;
  raw?: any;
}

export interface Plan {
  id: string;
  planCode: number;
  billingCycle: number;
  displayName: string;
  price: number;
  currency: string;
  features: string[];
  isPopular?: boolean;
}
