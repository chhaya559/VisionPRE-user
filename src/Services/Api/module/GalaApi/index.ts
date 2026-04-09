import api from '../../api';
import { GalaDetailsResponse, GalasResponse, PurchaseTicketPayload, SaveGalaPayload } from './types';

export const GalaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGalas: builder.query<GalasResponse, any>({
      query: () => ({
        url: '/user/gala',
        method: 'GET',
      }),
    }),
    getGalaById: builder.query<GalaDetailsResponse, string>({
      query: (id: string) => ({
        url: `/user/gala/${id}`,
        method: 'GET',
      }),
    }),
    applyGrant: builder.mutation<any, any>({
      query: (payload) => ({
        url: '/user/grants/apply',
        method: 'POST',
        body: payload,
      }),
    }),
    getMyApplications: builder.query<any, any>({
      query: () => ({
        url: '/user/grants/applications',
        method: 'GET',
      }),
    }),
    purchaseTicket: builder.mutation<any, PurchaseTicketPayload>({
      query: (payload) => ({
        url: `/user/gala/purchase`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['GalaDetails' as any, 'Galas' as any],
    }),
    getSavedGalas: builder.query<GalasResponse, void>({
      query: () => ({
        url: '/user/gala/saved',
        method: 'GET',
      }),
      providesTags: ['Galas' as any],
    }),
    toggleSaveGala: builder.mutation<any, SaveGalaPayload>({
      query: (payload) => ({
        url: '/user/gala/saved',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Galas' as any, 'GalaDetails' as any],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGalasQuery,
  useGetGalaByIdQuery,
  useGetMyApplicationsQuery,
  useApplyGrantMutation,
  usePurchaseTicketMutation,
  useGetSavedGalasQuery,
  useToggleSaveGalaMutation,
} = GalaApi;
