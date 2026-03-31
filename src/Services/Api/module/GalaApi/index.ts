import api from '../../api';

export const GalaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGalas: builder.query({
      query: () => ({
        url: '/user/gala',
        method: 'GET',
      }),
    }),
    getGalaById: builder.query({
      query: (id: string) => ({
        url: `/user/gala/${id}`,
        method: 'GET',
      }),
    }),
    applyGrant: builder.mutation({
      query: (payload) => ({
        url: '/user/grants/apply',
        method: 'POST',
        body: payload,
      }),
    }),
    getMyApplications: builder.query({
      query: () => ({
        url: '/user/grants/applications',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGalasQuery,
  useGetGalaByIdQuery,
  useGetMyApplicationsQuery,
  useApplyGrantMutation,
} = GalaApi;
