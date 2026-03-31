// This empty service worker file satisfies Firebase's requirement for a file 
// at '/firebase-messaging-sw.js' to exist in order to fetch the FCM token.
// Actual push notification background handling can be configured here if necessary by importing scripts.

self.addEventListener('push', function(event) {
  console.log('[firebase-messaging-sw.js] Received a push message', event);
  
  // Custom background push handling logic can go here.
});

self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  event.notification.close();
});
