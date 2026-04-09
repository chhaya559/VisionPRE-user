import api from '../../api';
import { NotificationItem } from '../../../../Shared/Types';

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    FCMtoken: builder.mutation({
      query: (body) => ({
        url: '/notifications/device-token',
        method: 'POST',
        body,
      }),
    }),
    getNotifications: builder.query<any, any>({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: (result: unknown) => {
        const items =
          (result as any)?.data?.items ||
          (result as any)?.data?.notifications ||
          (result as any)?.data ||
          (result as any)?.items ||
          (result as any)?.notifications ||
          [];

        const listTags = Array.isArray(items)
          ? items
            .map(
              (item: NotificationItem | any) =>
                item?.id || item?.Id || item?._id
            )
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
      providesTags: (_result, _error, { id }) => [{ type: 'Notification', id }],
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
    getAnnouncements: builder.query<any, void>({
      query: () => ({
        url: '/user/announcements',
        method: 'GET',
      }),
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    getNotificationSettings: builder.query<{ emailNotifications: boolean; pushNotifications: boolean }, void>({
      query: () => ({
        url: '/notifications/settings',
        method: 'GET',
      }),
      providesTags: ['NotificationSettings'],
    }),
    updateNotificationSettings: builder.mutation<void, { emailNotifications: boolean; pushNotifications: boolean }>({
      query: (body) => ({
        url: '/notifications/settings',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['NotificationSettings'],
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
  useGetAnnouncementsQuery,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = NotificationApi;
