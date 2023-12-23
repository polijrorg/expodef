import React, { useContext, useState, createContext, useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import api from '@services/api';
import { Subscription } from 'expo-modules-core';
import { Notification } from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface PushNotificationsContextData {
    registerForPushNotifications(): Promise<void>;
    expoPushToken : string;
}

const PushNotificationsContext = createContext<PushNotificationsContextData>({} as PushNotificationsContextData);

export const PushNotificationsProvider: React.FC<{ children?: React.ReactNode | undefined }> = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notification>();
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();


    useEffect(() => {

      // pede permissão para usar push notification e manda o Expo Push Token para o back
      registerForPushNotifications();
  
      // esse listener é ativado toda vez que o usuário recebe a notificação
      // serve praticamente como um useEffect que ativa com a chegada da notificação
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      // esse listener é ativado toda vez que o usuário clica na notificação
      // serve praticamente como um useEffect que ativa com o click na notificação
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    async function registerForPushNotifications(): Promise<void> {
        let token;

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          setExpoPushToken("Falha na obtenção do Expo Push Token");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        setExpoPushToken(token);

        await sendTokenToBackEnd(token);
      
    }
    
    const sendTokenToBackEnd = async (token : string) => {

        /* fazer o POST na api - ex: 

        api.post("/rota", {
            token: expoPushToken,
        })

        ou, se preferir, criar a rota dentro de um serviço e chamá-lo dentro
        dessa função

        */

    }

    return (
        <PushNotificationsContext.Provider value={{ registerForPushNotifications, expoPushToken }}>
            {children}
        </PushNotificationsContext.Provider>
    );
};

export default () => useContext(PushNotificationsContext);