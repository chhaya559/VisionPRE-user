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
    }),
    getNotificationById: builder.query({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'GET',
      }),
    }),
    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
    }),
    readNotificationById: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFCMtokenMutation,
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useGetNotificationByIdQuery,
  useReadAllNotificationMutation,
  useReadNotificationByIdMutation,
} = NotificationApi;
