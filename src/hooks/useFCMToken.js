import { useEffect, useState, useCallback } from 'react';
import { requestNotificationPermission, onMessageListener } from '../firebase/firebaseMessaging';
import { auth } from '../firebase/firebaseAuth';
import axios from 'axios';
import API_URL from '../config/api';

export const useFCMToken = () => {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
 
  const requestPermission = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('User not authenticated');
      return null;
    }

    try {
      const fcmToken = await requestNotificationPermission();

      if (fcmToken) {
        setToken(fcmToken);
        setPermissionStatus('granted');

        const idToken = await currentUser.getIdToken();
        const userResponse = await axios.post(
          `${API_URL}/api/sign-in`,
          { idToken },
          { withCredentials: true }
        );

        const accountId = userResponse.data.user.account_id;

        await axios.post(
          `${API_URL}/api/fcm-token`,
          {
            accountId,
            token: fcmToken,
            deviceType: 'web'
          },
          { withCredentials: true }
        );

        console.log('FCM token saved to backend');
        return fcmToken;
      } else {
        setPermissionStatus(Notification.permission);
        return null;
      }
    } catch (error) {
      console.error('Error setting up FCM:', error);
      setPermissionStatus(Notification.permission);
      return null;
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      console.log('Notification permission status:', Notification.permission);
    }
  }, []);

  useEffect(() => {
    const listenForMessages = async () => {
      try {
        const payload = await onMessageListener();
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          data: payload.data
        });

        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/images/ParentPal.png',
            badge: '/images/ParentPal.png'
          });
        }
      } catch (error) {
        console.error('Error listening for messages:', error);
      }
    };

    listenForMessages();
  }, []);

  return { token, notification, permissionStatus, requestPermission };
};
