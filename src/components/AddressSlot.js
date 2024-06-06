import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios'
import { baseUrl } from './Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from './Context';
import { ToastAndroid } from 'react-native';

const getLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    });
};

const AddressSlot = ({ route, navigation }) => {
    //geting props 
    const { title, subCategoryUid, productUid, productQuantity, totalPrice } = route.params;
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [location, setLocation] = useState(null);
    const [pincode, setPinCode] = useState()
    const [address, setAddress] = useState()
    const [scity, setsCity] = useState()
    const [states, setStates] = useState()
    const [localitys, setLocalitys] = useState()
    const [timeSlot, setTimeSlot] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [styleDate,setStyleDate] =useState('')
    const { emailId, setEmailId, phoneNumber, setPhoneNumber, name, setName, profileData, setCartItems, cartItems } = useGlobalContext()

    //subCategoryUid 
    const uid = subCategoryUid;
    const totalProductPrice = totalPrice;

    const handleTime = (async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem('token')
        await axios.get(`${baseUrl}/api/time-slot/${uid}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((res) => {
                setTimeSlot(res.data.time_slot)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    })

    const handleDate = (item) => {
        // Format the selected date in 'yyyy-MM-dd' format
        const { date } = item; 
        // Assuming current year and month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed in JavaScript

        // Create a string in 'yyyy-MM-dd' format
        const formattedDate = `${currentYear}-${currentMonth}-${date}`;
        setStyleDate(item)
        setSelectedDate(formattedDate);
    };

    const handleTimeSelect = (item) => {
        setSelectedTime(item.uid)
    }

    const handleOrder = async () => {
        try {
            if (!selectedTime || !selectedDate || !pincode || !address || !scity || !states || !localitys) {
                console.log(selectedTime);
                setTimeout(() => {
                    setMessage('');
                }, 2000);

                setMessage("Please fill in all required fields");
                return;
            }

            const token = await AsyncStorage.getItem('token');
            const product_uid = `${productUid}`;
            const full_name = name;
            const email = emailId;
            const addressline = address;
            const city = scity;
            const state = states;
            const phone = phoneNumber;
            const locality = localitys;
            const zipcode = pincode;
            const time_slot = selectedTime;
            const booking_time = selectedDate;
            const quantity = `${productQuantity}`;
            const data = { full_name, email, addressline, city, state, phone, locality, zipcode, time_slot, booking_time, product_uid, quantity }
            const response = await axios.post(`${baseUrl}/api/orderlist/`, data, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setLoading(false);
            if (response.data.status === 200) {
                navigation.navigate("Payment", {
                    title: 'Choose Payment Option',
                    bookingid: response.data.orderuid,
                    totalProductPrice: totalProductPrice,
                    productUid: productUid,
                });
            } else {
                ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
            }
        } catch (error) {

            setLoading(false);
        }
    };


    useEffect(() => {
        // Get the current date
        const currentDate = new Date();

        // Create an array with tomorrow's date and the next 3 consecutive dates
        const nextThreeDays = [0, 1, 2, 3].map((day) => addDays(currentDate, day));

        // Format the dates to display both the day and date
        const formattedDates = nextThreeDays.map(date => {
            // You can include multiple statements here
            return {
                day: format(date, 'EEE'),
                date: format(date, 'dd'),
            };
            // format(date, 'yyyy-MM-dd');
        });

        // Set the dates in the state
        setDates(formattedDates);
        // getAddress();
        profileData();
        handleTime();
    }, [])

    const fetchLocationData = async () => {
      
        try {
            const location = await getLocation();
            console.log('tyui')
            const { coords } = location;
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=AIzaSyDRrh9wAhF0e0iMc3a6LrfmdI2Z_CFGZ1A`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                const { results } = data;
                const addressComponents = results[0].address_components;
                const addressData = {
                    city: addressComponents.find(component => component.types.includes('locality'))?.long_name || '',
                    state: addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '',
                    pincode: addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '',
                    locality: addressComponents.find(component => component.types.includes('sublocality'))?.long_name || '',
                    addressline: results[0].formatted_address.split(', ').slice(1, 4).join(', ') || ''
                };
                setsCity(addressData.city);
                setStates(addressData.state);
                setPinCode(addressData.pincode);
                setLocalitys(addressData.locality);
                setAddress(addressData.addressline);
            }
        } catch (error) {
            console.error('Error getting location:', error);
            setErrorMsg('Error getting location');
        }
    };

useEffect(()=>{
    fetchLocationData();
},[])
       
    return (
        <ScrollView style={styles.container}>
            <View >
                <View style={{ flexDirection: "row", padding: 20, gap: 50, alignItems: "center", backgroundColor: "black" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={styles.backImg} source={require('./Images/arrow.png')} />
                    </TouchableOpacity>
                    <Text style={styles.editText}>{title}</Text>
                </View>

                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 500, color: 'black' }}>Select Date</Text>
                    <FlatList
                        data={dates}
                        horizontal={true}
                        renderItem={({ item, index }) => {
                            console.log(item)
                            return (
                                <View style={[styles.dateContainer, styleDate === item && styles.selectedDateContainer]} >
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleDate(item)}>
                                        <Text style={styles.dayText}>{item.day}</Text>
                                        <Text style={styles.dateText}>{item.date}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 500, marginTop: 20, color: 'black' }}>Select Time</Text>
                    <FlatList
                        data={timeSlot}
                        horizontal={true}
                        renderItem={({ item, index }) => {
                            console.log('item', item)
                            return (
                                <View style={[styles.timeContainer, selectedTime === item.uid && styles.selectedDateContainer]}>
                                    {
                                        loading ?

                                            (<View>
                                                <ActivityIndicator size="large" color="red" />
                                            </View>)
                                            :
                                            (
                                                < TouchableOpacity onPress={() => handleTimeSelect(item)}>
                                                    <Text style={styles.timeText}>{item.start_time}</Text>
                                                </TouchableOpacity>
                                            )}
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: "row", gap: 45, justifyContent: 'space-evenly' }}>
                        <Text style={{ fontSize: 18, fontWeight: 500, marginTop: 20, color: "black" }}>Add Address</Text>
                        <View style={{ alignSelf: "center", paddingVertical: 20 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: "green", padding: 5, borderRadius: 8 }}
                                onPress={fetchLocationData}>
                                <Text style={{ color: "white", fontWeight: 500, fontSize: 14 }}>Use Current Location</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TextInput style={styles.textInput}
                        placeholder='Enter Name'
                        value={name}
                        onChangeText={(text) => {
                            setName(text)
                        }}
                        placeholderTextColor='black'
                    />

                    <TextInput style={styles.textInput}
                        value={emailId}
                        onChangeText={(text) => {
                            setEmailId(text)
                        }}
                        placeholder='Enter Email'
                        placeholderTextColor='black'
                    />

                    <TextInput style={styles.textInput}
                        value={phoneNumber}
                        onChangeText={(text) => {
                            setPhoneNumber(text)
                        }}
                        placeholder='Enter Phone'
                        placeholderTextColor='black'
                    />

                    <TextInput
                        style={styles.textInput}
                        value={address}
                        onChangeText={(text) => {
                            setAddress(text)
                        }}
                        placeholder='Address'
                        placeholderTextColor='black'
                    />

                    <TextInput
                        style={styles.textInput}
                        value={pincode}
                        onChangeText={(text) => {
                            setPinCode(text);
                        }}
                        placeholder='Pincode'
                        placeholderTextColor='black'
                    />

                    <TextInput style={styles.textInput}
                        value={states}
                        onChangeText={(text) => {
                            setStates(text)
                        }}
                        placeholder='State'
                        placeholderTextColor='black'
                    />

                    <TextInput style={styles.textInput}
                        value={localitys}
                        onChangeText={(text) => {
                            setLocalitys(text)
                        }}
                        placeholder='Locality'
                        placeholderTextColor='black'
                    />

                    <TextInput style={styles.textInput}
                        value={scity}
                        onChangeText={(text) => {
                            setsCity(text)
                        }}
                        placeholder='city'
                        placeholderTextColor='black'

                    />

                </View>

                {
                    message && (
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "red", fontSize: 16, fontWeight: "500" }}>{message}</Text>
                        </View>
                    )
                }

                <View style={{ flex: 1, justifyContent: 'flex-end', height: 120, padding: 10 }}>
                    <TouchableOpacity onPress={handleOrder}
                        style={{ backgroundColor: 'rgb(0, 0, 200)', padding: 15, alignItems: 'center', borderRadius: 8 }}>
                        {
                            loading && <ActivityIndicator color='white' />
                        }
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: "500" }}>Proceed</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    )
}

export default AddressSlot;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    editText: {
        fontSize: 20,
        fontWeight: '400',
        color: 'white',
    },
    backImg: {
        tintColor: "white",
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    dateContainer: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 8,
        marginRight: 20,
        borderWidth: 0.5,
        borderColor: "silver",
        borderRadius: 8,
        width: 60,
    },
    dayText: {
        color: '#63666A',
        marginBottom: 5,
        fontWeight: '400',
    },
    dateText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    selectedDateContainer: {
        backgroundColor: '#CCBCEE',
        borderColor: 'rgb(0, 0, 200)',
        borderWidth: 1.2,
    },
    timeContainer: {
        marginTop: 20,
        alignItems: 'center',
        padding: 8,
        marginRight: 20,
        borderWidth: 0.5,
        borderColor: "silver",
        borderRadius: 8,
        width: 100,
    },
    timeText: {
        fontSize: 18,
        fontWeight: '400',
        color: 'black'
    },
    textInput: {
        borderWidth: 0.8,
        marginTop: 10,
        height: 50,
        borderRadius: 8,
        borderColor: 'silver',
        fontSize: 16,
        paddingLeft: 15,
        color: 'black'
    },
    timeSlect: {
        backgroundColor: "red"
    }
})