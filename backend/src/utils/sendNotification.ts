import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushNotification = async (
    pushToken: string, 
    title: string, 
    body: string, 
    data: any = {}
) => {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const messages: ExpoPushMessage[] = [{
        to: pushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data,
    }];

    try {
        const chunks = expo.chunkPushNotifications(messages);
        
        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("Notification sent successfully:", ticketChunk);
        }
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};