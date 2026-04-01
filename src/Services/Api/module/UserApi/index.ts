import api from '../../api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ProfileOnboarding: builder.mutation({
      query: (payload) => ({
        url: '/onboarding/complete',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Profile'],
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    editProfile: builder.mutation({
      query: (payload) => ({
        url: '/profile',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Profile'],
    }),
    uploadAvatar: builder.mutation({
      query: (payload) => ({
        url: '/profile/avatar',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/profile/change-password',
        method: 'PUT',
        body: payload,
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/profile/delete-account',
        method: 'DELETE',
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
  useDeleteAccountMutation
} = userApi;
