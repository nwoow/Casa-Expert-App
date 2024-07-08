import { NavigationContainer } from '@react-navigation/native';
import MyStack from './src/components/Navigation';
import { AppProvider } from './src/components/Context';
import CheckInternet from './src/components/CheckInternet';
import { useEffect } from 'react';
import { checkNotificationPermission } from './src/components/NotificationServices';


export default function App() {
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  return (
    <NavigationContainer>
      <AppProvider>
        <CheckInternet/>
        <MyStack />
      </AppProvider>
    </NavigationContainer>
  );
}


