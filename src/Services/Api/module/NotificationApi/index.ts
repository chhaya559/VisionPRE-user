import api from '../../api';

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    FCMtoken: builder.mutation<
      { success: boolean },
      { token: string; deviceType: string }
    >({
      query: (body) => ({
        url: '/notifications/device-token',
        method: 'POST',
        body,
      }),
    }),
    getNotifications: builder.query<
      Record<string, unknown>,
      Record<string, never>
    >({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: (result: unknown) => {
        const resultObj = result as Record<string, unknown> | null | undefined;
        const dataObj = (resultObj?.data as Record<string, unknown>) ?? {};
        const items: unknown[] =
          (dataObj?.items as unknown[] | undefined) ||
          (dataObj?.notifications as unknown[] | undefined) ||
          (Array.isArray(dataObj) ? dataObj : undefined) ||
          (resultObj?.items as unknown[] | undefined) ||
          (resultObj?.notifications as unknown[] | undefined) ||
          [];

        const listTags = Array.isArray(items)
          ? items
              .map((item: unknown) => {
                const itemObj = item as Record<string, unknown>;
                return itemObj?.id || itemObj?.Id || itemObj?._id;
              })
              .filter(Boolean)
              .map((id: unknown) => ({
                type: 'Notification' as const,
                id: id as string | number,
              }))
          : [];

        return [{ type: 'Notification' as const, id: 'LIST' }, ...listTags];
      },
    }),
    getNotificationById: builder.query<Record<string, unknown>, { id: string }>(
      {
        query: ({ id }) => ({
          url: `/notifications/${id}`,
          method: 'GET',
        }),
        providesTags: (_result, _error, { id }) => [
          { type: 'Notification' as const, id },
        ],
      }
    ),
    deleteNotification: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notification' as const, id },
        { type: 'Notification' as const, id: 'LIST' },
      ],
    }),
    readNotificationById: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notification' as const, id },
        { type: 'Notification' as const, id: 'LIST' },
      ],
    }),
    getAnnouncements: builder.query<Record<string, unknown>, void>({
      query: () => ({
        url: '/user/announcements',
        method: 'GET',
      }),
    }),
    readAllNotification: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification' as const, id: 'LIST' }],
    }),
    getNotificationSettings: builder.query<
      { emailNotifications: boolean; pushNotifications: boolean },
      void
    >({
      query: () => ({
        url: '/notifications/settings',
        method: 'GET',
      }),
      providesTags: ['NotificationSettings'],
    }),
    updateNotificationSettings: builder.mutation<
      void,
      { emailNotifications: boolean; pushNotifications: boolean }
    >({
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
