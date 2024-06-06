import { NavigationContainer } from '@react-navigation/native';
import MyStack from './src/components/Navigation';
import { AppProvider } from './src/components/Context';
import CheckInternet from './src/components/CheckInternet';


export default function App() {
  return (
    <NavigationContainer>
      <AppProvider>
        <CheckInternet/>
        <MyStack />
      </AppProvider>
    </NavigationContainer>
  );
}


