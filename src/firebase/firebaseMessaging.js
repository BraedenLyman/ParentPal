import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isStandalone = () => {
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
};

const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

let messaging = null;

try {
  if (isNotificationSupported()) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn("Firebase messaging not available:", error);
}

export const requestNotificationPermission = async () => {
  try {
    if (isIOS()) {
      const iosVersion = parseInt(navigator.userAgent.match(/OS (\d+)_/)?.[1] || '0');

      if (iosVersion < 16) {
        throw new Error("IOS_VERSION_NOT_SUPPORTED");
      }

      if (isStandalone()) {
        throw new Error("IOS_STANDALONE_NOT_SUPPORTED");
      }
    }

    if (!isNotificationSupported()) {
      throw new Error("NOTIFICATIONS_NOT_SUPPORTED");
    }

    if (!messaging) {
      throw new Error("MESSAGING_NOT_INITIALIZED");
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });

    await navigator.serviceWorker.ready;
    console.log("Service worker registered and ready");

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      const token = await getToken(messaging, {
        vapidKey: "BOX3uOx_HppAl0GFJ0Q13AMCdLqlsikqIXkf3N-6NKuNi0skWgdGqiSpHPJcsYxAr7fkjeEw4iUsQ1d0BExSnJA",
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("No registration token available.");
        throw new Error("TOKEN_GENERATION_FAILED");
      }
    } else {
      console.log("Notification permission denied.");
      throw new Error("PERMISSION_DENIED");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);

    if (error.message && error.message.includes("IOS_")) {
      throw error;
    } else if (error.message && (error.message.includes("NOTIFICATIONS_") || error.message.includes("MESSAGING_") || error.message.includes("PERMISSION_") || error.message.includes("TOKEN_"))) {
      throw error;
    } else {
      throw new Error("UNKNOWN_ERROR: " + error.message);
    }
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error("Messaging not initialized"));
      return;
    }
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      resolve(payload);
    });
  });

export { messaging };
