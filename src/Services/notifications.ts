import { getToken } from 'firebase/messaging';
import {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import { MutationActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { messaging } from './firebase';

export const requestNotificationPermission = async (sendToken: {
  (
    arg: any
  ): MutationActionCreatorResult<
    MutationDefinition<
      any,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      any,
      'api'
    >
  >;
  (arg0: { token: string; platform: string }): any;
}) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') return;

    const token = await getToken(messaging, {
      vapidKey:
        'BIvm-Gu57IPHIF7FCNjGOz7qbdTrBaDJGttKYVs7ZO5sXmc6rxpBzmHutVviKjTIRz4wJsM7D5PBhT9HhQvlFmU',
    });

    if (!token) {
      console.log('No token received');
      return;
    }

    console.log('FCM Token:', token);

    const response = await sendToken({
      token,
      platform: 'web',
    });

    console.log('respone for token send', response);
  } catch (err) {
    console.error('FCM Error:', err);
  }
};
