import api from '../../api';
import { SubscriptionPlan, SubscriptionStatus, SubscriptionBillingCycle } from '../../../../Shared/SubscriptionEnums';

export interface SubscriptionResponse {
    planName: SubscriptionPlan;
    status: SubscriptionStatus;
    billingCycle: SubscriptionBillingCycle;
    autoPayEnabled: boolean;
    expiryDate: string | null;
    isTrial: boolean;
    trialEndsAt: string | null;
    transactionHash?: string;
    // These might be removed if the API strictly follows the sample, 
    // but keeping them optional for backward compatibility or future use.
    planType?: string;
    price?: string;
    nextBilling?: string;
    startDate?: string;
    paymentMethod?: string;
}

export interface SubscribePayload {
    Plan: number;
    BillingCycle: number;
    AutoPayEnabled: boolean;
    TransactionHash: string;
    WalletAddress: string;
    ExpiresAt: string;
}

export interface CancelPayload {
    TransactionHash: string;
    WalletAddress: string;
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
            query: (payload) => ({
                url: '/profile/subscription/subscribe',
                method: 'POST',
                body: { command: payload },
            }),
            invalidatesTags: ['Subscription'],
        }),
        cancelSubscription: builder.mutation({
            query: (payload) => ({
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
            })
        }),
        updateSubscription: builder.mutation({
            query: (payload) => ({
                url: '/profile/subscription/update',
                method: 'PUT',
                body: { command: payload },
            })
        }),
        getPlans: builder.query({
            query: () => ({
                url: "/user/plans",
                method: "GET",
            })
        })
    }),
    overrideExisting: false,
});

export const {
    useCancelSubscriptionMutation,
    useGetPlansQuery,
    useGetSubscriptionQuery,
    useRenewSubscriptionMutation,
    useSubscribeMutation,
    useUpdateSubscriptionMutation
} = SubscriptionApi;
