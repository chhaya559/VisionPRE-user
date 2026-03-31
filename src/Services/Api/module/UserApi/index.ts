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
    getProfile: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
    }),
    editProfile: builder.mutation({
      query: (payload) => ({
        url: '/profile',
        method: 'PUT',
        body: payload,
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (payload) => ({
        url: '/profile/avatar',
        method: 'POST',
        body: payload,
      }),
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/profile/change-password',
        method: 'PUT',
        body: payload,
      }),
    }),
    uploadFile: builder.mutation({
      query: ({ file, type = 'Image' }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/files/upload?type=${type}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useProfileOnboardingMutation,
  useChangePasswordMutation,
  useEditProfileMutation,
  useUploadAvatarMutation,
  useGetProfileQuery,
  useUploadFileMutation,
} = userApi;
