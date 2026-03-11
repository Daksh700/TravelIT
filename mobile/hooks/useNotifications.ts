import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo'; 
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { savePushToken } from '../services/user'; 

export const useNotifications = (isAuthenticated: boolean) => {
  const { getToken } = useAuth();

  useEffect(() => {
    const setupNotifications = async () => {
      if (isAuthenticated) {
        const pushToken = await registerForPushNotificationsAsync();
        const authToken = await getToken();

        if (pushToken && authToken) {
          await savePushToken(authToken, pushToken);
          console.log("Push Token synced with backend");
        }
      }
    };

    setupNotifications();
  }, [isAuthenticated]);
};