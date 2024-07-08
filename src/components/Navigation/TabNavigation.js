import React, { useEffect } from 'react'
import Home from '../Screen/Home'
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View } from 'react-native';
import Cart from '../Cart';
import Profile from '../Screen/Profile';
import Booking from '../Screen/Booking';
import ServicePart from '../ServicePart';
import SearchView from '../Screen/SearchView';
// import { useGlobalContext } from '../Context';


function TabNavigation({ route }) {
    // const { isLoggedIn } = useGlobalContext();
    // console.log(isLoggedIn)

    const { addressData } = route.params || {};

    const Tab = createBottomTabNavigator();

    return (
        <>
            <Tab.Navigator screenOptions={{
                tabBarShowLabel: false, tabBarStyle: [{
                    display: "flex",
                    elevation: 1,
                    backgroundColor: '#fff',
                    height: 60,
                    ...styles.shadow
                }]
            }}>
                <Tab.Screen name="Home" component={Home} initialParams={{ addressData: addressData }} options={{
                    headerShown: false, tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                                <Image source={require('../Images/home-btn.png')} resizeMode='contain' style={{ height: 20, width: 20, tintColor: focused ? "#010203" : "#d3d3d3", marginBottom: 3 }} />
                                <Text style={{ color: focused ? "#010203" : "silver", fontSize: 18,  fontFamily:'Segoe UI Bold', marginBottom: 20 }}>Home</Text>
                            </View>
                        )
                    }
                }} />

                <Tab.Screen name="Booking" component={Booking} options={{
                    headerShown: false, tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                                <Image source={require('../Images/event.png')} resizeMode='contain' style={{ height: 20, width: 20, tintColor: focused ? "#010203" : "#d3d3d3", marginBottom: 3 }} />
                                <Text style={{ color: focused ? "#010203" : "#d3d3d3", fontSize: 18, fontFamily:'Segoe UI Bold', marginBottom: 20 }}>Booking</Text>
                            </View>
                        )
                    }
                }} />

                <Tab.Screen name="Profile" component={Profile} options={{
                    headerShown: false, tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                                <Image source={require('../Images/user.png')} resizeMode='contain' style={{ height: 20, width: 20, tintColor: focused ? "#010203" : "#d3d3d3", marginBottom: 3 }} />
                                <Text style={{ color: focused ? "#010203" : "#d3d3d3", fontSize: 18, fontFamily:'Segoe UI Bold', marginBottom: 20 }}>Profile</Text>
                            </View>
                        )
                    }
                }} />

                <Tab.Screen name="ServicePart" component={ServicePart} options={{
                    headerShown: false,
                    tabBarButton: () => null, tabBarVisible: false
                }} />

                <Tab.Screen name="Cart" component={Cart} options={{
                    headerShown: false,
                    tabBarButton: () => null, tabBarVisible: false

                }} />

                <Tab.Screen name="SearchView" component={SearchView} options={{
                    headerShown: false,
                    tabBarButton: () => null, tabBarVisible: false

                }} />
                <Tab.Screen name="booking" component={Booking} options={{
                    headerShown: false,
                    tabBarButton: () => null, tabBarVisible: true

                }} />
            </Tab.Navigator >
        </>
    )
}

export default TabNavigation;


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#7F5DF0",
        shadowOpacity: 0.25,
        elevation: 1,
        shadowRadius: 3.5,
    }

})