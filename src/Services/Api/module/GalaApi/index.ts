import api from '../../api';
import {
  GalaDetailsResponse,
  GalasResponse,
  PurchaseTicketPayload,
  SaveGalaPayload,
} from './types';

export const GalaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGalas: builder.query<GalasResponse, Record<string, never>>({
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
    applyGrant: builder.mutation<
      { success: boolean; message: string },
      Record<string, unknown>
    >({
      query: (payload) => ({
        url: '/user/grants/apply',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Grants', 'GalaDetails'],
    }),
    getMyApplications: builder.query<{ data: unknown[] }, Record<string, never>>({
      query: () => ({
        url: '/user/grants/applications',
        method: 'GET',
      }),
      providesTags: ['Grants'],
    }),
    purchaseTicket: builder.mutation<
      { success: boolean; message: string; data?: unknown },
      PurchaseTicketPayload
    >({
      query: (payload) => ({
        url: `/user/gala/purchase`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['GalaDetails', 'Galas'],
    }),
    getSavedGalas: builder.query<GalasResponse, void>({
      query: () => ({
        url: '/user/gala/saved',
        method: 'GET',
      }),
      providesTags: ['Galas'],
    }),
    toggleSaveGala: builder.mutation<
      { success: boolean; message: string },
      SaveGalaPayload
    >({
      query: (payload) => ({
        url: '/user/gala/saved',
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Galas', 'GalaDetails'],
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
