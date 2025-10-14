import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      const token = await getToken(messaging, {
        vapidKey: "BOX3uOx_HppAl0GFJ0Q13AMCdLqlsikqIXkf3N-6NKuNi0skWgdGqiSpHPJcsYxAr7fkjeEw4iUsQ1d0BExSnJA"
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("No registration token available.");
        return null;
      }
    } else {
      console.log("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      resolve(payload);
    });
  });

export { messaging };
