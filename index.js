/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { DisplayNotification } from './src/components/NotificationHandler';

// Function to handle foreground messages

messaging().onMessage(async remoteMessage => {
    console.log('Message handled in the foreground!', remoteMessage);
    DisplayNotification(remoteMessage);
   
  });
  
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    DisplayNotification(remoteMessage);
    
  });
  
  messaging().getInitialNotification(async remoteMessage => {
    console.log('Message received in the kill state!', remoteMessage);
    DisplayNotification(remoteMessage);
    
  });

// Register the main component of your app
AppRegistry.registerComponent(appName, () => App);
