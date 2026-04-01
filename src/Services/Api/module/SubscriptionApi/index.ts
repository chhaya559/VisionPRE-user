import api from '../../api';

export interface SubscriptionResponse {
    planName: string;
    planType: string;
    price: string;
    nextBilling: string;
    startDate: string;
    paymentMethod: string;
    status: string;
    transactionHash?: string;
}

export interface SubscribePayload {
    Plan: string;
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
