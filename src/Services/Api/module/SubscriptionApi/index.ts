import api from '../../api';

export interface SubscriptionResponse {
  planName: number;
  subscriptionPlan: string;
  status: number;
  subscriptionStatus: string;
  billingCycle: number;
  price: number;
  currency: string;
  autoPayEnabled: boolean;
  expiryDate: string | null;
  isTrial: boolean;
  trialEndsAt: string | null;
  transactionHash?: string;
  startDate?: string;
  paymentMethod?: string;
  isCancelled?: boolean;
}

export interface SubscribePayload {
  planId: string;
  autoPayEnabled: boolean;
  walletAddress: string;
  transactionHash: string;
}

export interface CancelPayload {
  transactionHash: string;
  walletAddress: string;
}

export const SubscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query({
      query: () => ({
        url: '/profile/subscription',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    subscribe: builder.mutation({
      query: (payload: SubscribePayload) => ({
        url: '/profile/subscription/subscribe',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Subscription'],
    }),
    cancelSubscription: builder.mutation({
      query: (payload: CancelPayload) => ({
        url: '/profile/subscription/cancel',
        method: 'DELETE',
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Subscription'],
    }),
    renewSubscription: builder.mutation({
      query: () => ({
        url: '/profile/subscription/renew',
        method: 'POST',
      }),
    }),
    updateSubscription: builder.mutation({
      query: (payload: any) => ({
        url: '/profile/subscription/update',
        method: 'PUT',
        body: { command: payload },
      }),
    }),
    getPlans: builder.query({
      query: () => ({
        url: '/user/plans',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCancelSubscriptionMutation,
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useRenewSubscriptionMutation,
  useSubscribeMutation,
  useUpdateSubscriptionMutation,
} = SubscriptionApi;
