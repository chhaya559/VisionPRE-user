import api from '../../api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ProfileOnboarding: builder.mutation({
      query: (payload) => ({
        url: '/onboarding/complete',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useProfileOnboardingMutation } = userApi;
