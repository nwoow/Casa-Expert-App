import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapComponent from '../MapComponent';
import TabNavigation from './TabNavigation';
import Otp from '../Otp';
import Login from '../Login';
import CheckOut from '../CheckOut';
import EditProfile from '../EditProfile';
import AddressSlot from '../AddressSlot';
import Payment from '../Payment';
import Search from '../Search';
import Thanku from '../Thanku';
import Term_conditions from '../Term_conditions';
import HelpCenter from '../HelpCenter';
import AboutCx from '../AboutCx';


const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="MapComponent" screenOptions={{ animation: 'slide_from_right' }}>
            <Stack.Screen name="MapComponent" component={MapComponent} options={{ headerShown: false }} />
            <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="CheckOut" component={CheckOut} options={{ headerShown: false }} />
            <Stack.Screen name="AddressSlot" component={AddressSlot} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="thanku" component={Thanku} options={{ headerShown: false }} />
            <Stack.Screen name="termsandconditions" component={Term_conditions} options={{ headerShown: false }} />
            <Stack.Screen name="helpcenter" component={HelpCenter} options={{ headerShown: false }} />
            <Stack.Screen name="about" component={AboutCx} options={{ headerShown: false }} />
            
        </Stack.Navigator>
    );
}

export default MyStack;
