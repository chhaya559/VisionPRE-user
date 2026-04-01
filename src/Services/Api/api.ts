/* eslint-disable import/no-cycle */
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../Store';
import { API_BASE_URL } from './Constants';
import { logout, setAuthData } from '../../Store/Common';

type RefreshResponse = {
  data?: {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  token?: string;
  refreshToken?: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers: Headers, { getState }) => {
    const { token } = (getState() as RootState).common;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Fix for ngrok CORS issues: skip the interstitial warning page
    headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const { refreshToken } = (api.getState() as RootState).common;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    const refreshPayload = refreshResult.data as RefreshResponse | undefined;
    const nextToken = refreshPayload?.data?.accessToken;
    const nextRefreshToken = refreshPayload?.data?.refreshToken;

    if (nextToken) {
      api.dispatch(
        setAuthData({
          token: nextToken,
          refreshToken: nextRefreshToken,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ['Notification', 'Profile', 'Subscription'],
  endpoints: () => ({}),
});

export default api;
