// import NavigationServices from './NavigationServices';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';

export async function checkNotificationPermission() {
  const settings = await notifee.getNotificationSettings();
  if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permissions has been authorized');
    getToken();
  } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    console.log('Notification permissions has been denied');
    requestUserPermission();
     NavigationServices.navigate('Permission', {Screen: 'Notification'});
  }
}

export const getToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('Token:', token);
  } catch (error) {
    console.error('Error getting token', error);
  }
};

const requestUserPermission = async () => {
  const token = await messaging().getToken();
  try {
    const permissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (!!permissions && permissions == 'granted') {
      console.log('granted');
      // axios function
    } else {
      console.log('notification permission denied', permissions);
       navigation.push('NotificationPermission');
    }
  } catch (error) {
    console.error('Failed to request permissions', error);
  }
};
