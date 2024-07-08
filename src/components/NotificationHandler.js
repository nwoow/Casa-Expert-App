import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';

const rdata = {
  collapseKey: 'com.ballbyball',
  data: {
    channelId: 'greetings',
    channelName: 'greetings',
    image:
      'https://cdn.vectorstock.com/i/preview-1x/91/76/desi-indian-lady-namaste-traditional-colorful-vector-44199176.jpg',
    importance: '1',
    type: 'DEFAULT',
  },
  from: '589797898740',
  messageId: '0:1710157642652506%4f8dac224f8dac22',
  notification: {
    android: {},
    body: 'Hello Abhinav . Welcome to ball by ball. Hope you enjoy the app',
    title: 'user Registration Successful',
  },
  sentTime: 1710157642630,
  ttl: 2419200,
};

// greetings ->
// 	- welcome ( on signup )
// 	- priority (level)- MINIMUM
// 	- image ( large image )

// alert ->
// 	- prediction over alert , when upcoming match is live
// 	- priority ( level ) - HIGH
// 	- image - ( big icon )

// confirmation ->
// 	- over result declared , add money success , withdraw money success
// 	- priority ( level ) - DEFAULT
// 	- image ( small icon )

// promotions -> ( admin level notification access)
// 	- promotion and offer notification
// 	- priority ( level ) - DEFAULT
// 	- image ( set by admin panel )

export function NotificationCount(value) {
  let NotificationCount = false;
  NotificationCount = value;
  return NotificationCount;
}

export const DisplayNotification = async remotedata => {
  NotificationCount(true);
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'default',
      sound: 'default',
      importance: AndroidImportance.HIGH,
      badge: true,
    });

    await notifee.displayNotification({
      title: remotedata.notification.title,
      body: remotedata.notification.body,
      android: {
        channelId,
        // badgeCount: await notifee.getBadgeCount(),
        // sound: true,
        // importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher',
      },
    });
  } catch (error) {
    console.error('errror in display', error);
  }
};
