import { useGetSubscriptionQuery } from '../Services/Api/module/SubscriptionApi';

export const useSubscription = () => {
  const {
    data: subscriptionResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const subscription = subscriptionResponse?.data || subscriptionResponse;

  // Checking for 'Active' status based on the pattern seen in AccountSettings.tsx
  const isActive =
    subscription?.subscriptionStatus === 'Active' || subscription?.status === 1;
  const planName = subscription?.subscriptionPlan || 'Free';
  const billingCycle = subscription?.billingCycle;
  const expiryDate = subscription?.expiryDate;

  return {
    isActive,
    planName,
    billingCycle,
    expiryDate,
    isLoading,
    isError,
    subscription,
    refetch,
  };
};
