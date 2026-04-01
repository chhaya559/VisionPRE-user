import api from '../../api';

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    FCMtoken: builder.mutation({
      query: (body) => ({
        url: '/notifications/device-token',
        method: 'POST',
        body,
      }),
    }),
    getNotifications: builder.query({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: (result) => {
        const items =
          (result as any)?.data?.items ||
          (result as any)?.data?.notifications ||
          (result as any)?.data ||
          (result as any)?.items ||
          (result as any)?.notifications ||
          [];

        const listTags = Array.isArray(items)
          ? items
              .map((item: any) => item?.id || item?.Id || item?._id)
              .filter(Boolean)
              .map((id: string | number) => ({
                type: 'Notification' as const,
                id,
              }))
          : [];

        return [{ type: 'Notification' as const, id: 'LIST' }, ...listTags];
      },
    }),
    getNotificationById: builder.query({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [
        { type: 'Notification', id },
      ],
    }),
    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),
    readNotificationById: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFCMtokenMutation,
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useGetNotificationByIdQuery,
  useLazyGetNotificationByIdQuery,
  useReadAllNotificationMutation,
  useReadNotificationByIdMutation,
} = NotificationApi;
