import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { PermissionsAndroid } from 'react-native';
import SplashScreen from 'react-native-splash-screen';


const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        console.log('granted', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use Geolocation');
            return true;
        } else {
            console.log('You cannot use Geolocation');
            return false;
        }
    } catch (err) {
        console.error('Error requesting location permission:', err);
        return false;
    }
};

const MapComponent = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [addressData, setAddressData] = useState('');
    const [manualLocation, setManualLocation] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                try {
                    Geolocation.getCurrentPosition(
                        (position) => { // Success callback
                            const { latitude, longitude } = position.coords;
                            setLocation(position);
                            getAddressFromCoordinates(latitude, longitude);
                        },
                        (error) => { // Error callback
                            console.error('Error getting location:', error);
                            setError('Error getting location: ' + error.message);
                            setLoading(false);
                        }
                    );
                } catch (err) {
                    console.error('Error getting location:', err);
                    setError('Error getting location: ' + err.message);
                    setLoading(false);
                }
            } else {
                setLoading(false);
                console.error('Permission denied for accessing location.');
                setError('Permission denied for accessing location.');
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        if (!loading && (location || addressData)) {
            navigation.replace('TabNavigation', { addressData });
        }
    }, [loading, location, addressData, navigation]);

    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDRrh9wAhF0e0iMc3a6LrfmdI2Z_CFGZ1A`
            );

            console.log('Geocoding API response:', response.data);

          
        if (response.data.results.length > 0) {
            const { address_components } = response.data.results[0];
            let city = 'City not found';

            // Look for locality component (usually represents the city)
            const cityComponent = address_components.find(component =>
                component.types.includes('locality')
            );

            if (cityComponent) {
                city = cityComponent.long_name;
            }

            setAddressData({ city });
            setLoading(false);
        }
        } catch (err) {
            console.error('Error getting address from coordinates:', err);
            setLoading(false);
        }
    };

    const handleManualLocationSubmit = () => {
        if (manualLocation.trim() === '') {
            Alert.alert('Error', 'Please enter a valid location');
            return;
        }
        setAddressData({ city: manualLocation });
        setLoading(false); // Assuming manual location entry is immediate
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../components/Images/map.png')} style={{ width: 100, height: 100 }} />
                    <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 10,color:"black" }}>Fetching your location...</Text>
                </View>
            ) : (
                <>
                    {addressData ? (
                        <View style={{ flex: 1, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../components/Images/checkmark.png')} style={{ width: 50, height: 50 }} />
                            <Text style={{ color: 'green', fontSize: 16, fontWeight: '500', marginTop: 19 }}>Delivering service at</Text>
                            <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 8,color:'black' }}>{addressData.city}</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: '500',color:"black" }}>Please enter your service location:</Text>
                            <TextInput
                                style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginTop: 10 }}
                                placeholder="Enter your location"
                                placeholderTextColor="gray"
                                onChangeText={text => setManualLocation(text)}
                                value={manualLocation}
                            />
                            <TouchableOpacity onPress={handleManualLocationSubmit} style={{ marginTop: 10, backgroundColor: 'blue', padding: 10 }}>
                                <Text style={{ color: 'white' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

export default MapComponent;
