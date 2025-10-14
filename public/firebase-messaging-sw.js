importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCTXx4ygbONWRCB4COjEqUtD2hIAnopuic",
  authDomain: "parent-pal-86b9a.firebaseapp.com",
  projectId: "parent-pal-86b9a",
  storageBucket: "parent-pal-86b9a.firebasestorage.app",
  messagingSenderId: "598071425149",
  appId: "1:598071425149:web:0d07b632041cab12f35914"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification.title || 'ParentPal Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/images/ParentPal.png',
    badge: '/images/ParentPal.png',
    data: payload.data,
    tag: payload.data?.notificationId || 'default',
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
