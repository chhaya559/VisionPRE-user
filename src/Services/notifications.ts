import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';

export const requestNotificationPermission = async (
  sendToken: (arg: { token: string; platform: string }) => Promise<unknown>
) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') return;

    const token = await getToken(messaging, {
      vapidKey:
        'BIvm-Gu57IPHIF7FCNjGOz7qbdTrBaDJGttKYVs7ZO5sXmc6rxpBzmHutVviKjTIRz4wJsM7D5PBhT9HhQvlFmU',
    });

    if (!token) {
      return;
    }

    await sendToken({
      token,
      platform: 'web',
    });
  } catch (err) {
    // Silently fail or use a logger
  }
};
