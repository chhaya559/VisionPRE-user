/** Matches the GET /profile API response exactly (camelCase, all nullable). */
export interface UserProfile {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  passportStatus: string;
  companyName: string | null;
  industry: string | string[] | null;
  companySize: string | null;
  foundedYear: number | null;
  annualRevenue: string | null;
  website: string | null;
  stage: string | null;
  profileType: string[] | null;
  businessDescription: string | null;
  goal: string | null;
  isProfileCompleted: boolean;
  isEmailVerified: boolean;
  subscriptionPlan: number;
  subscriptionStatus: number;
  subscriptionBillingCycle: number;
  autoPayEnabled: boolean;
  subscriptionExpiryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  category: string;
  raw?: Record<string, unknown>;
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
export interface ApiError {
  data?: {
    success?: boolean;
    message?: string;
    errors?: Array<{
      message: string;
      code?: string;
    }>;
  };
  status?: number;
}
