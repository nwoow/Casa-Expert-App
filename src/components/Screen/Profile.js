import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { baseUrl } from '../Constant'
import { useGlobalContext } from '../Context'
import { useIsFocused, } from '@react-navigation/native'
import Header from '../Header'


const Profile = ({ navigation }) => {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState('')
    const { isLoggedIn, logout } = useGlobalContext()
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('')
    const useFocused = useIsFocused()

    const handlelogout = async () => {
        logout()
        navigation.navigate("Home")
    }

    const profileData = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await axios.get(
                `${baseUrl}/api/profile/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            console.log(response.data)
            setName(response.data.profile.full_name)
            setPhone(response.data.profile.phone_number)
            setEmail(response.data.profile.email)
            setIsLoading(false)

        } catch (error) {
            console.error(error);
            setIsLoading(false)

        }
    };

    useEffect(() => {
        console.log(isLoggedIn)
        if (isLoggedIn) {
            setIsLoading(true); // Set loading to true before fetching data
            profileData();
        } else {
            setIsLoading(false); // If not logged in, set loading to false
        }

        // Cleanup function to avoid memory leaks
        return () => {
            setIsLoading(false);
        };
    }, [useFocused, isLoggedIn]);

    return (
        <View style={styles.container}>

            {
                isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#0000FF" />
                    </View>
                ) :
                    isLoggedIn ? (
                        <>
                         <Header showBackButton={true} />
                            <View style={{ padding: 25, backgroundColor: "#fff" }}>
                                {name ? (
                                    <Text style={styles.name}>{name}</Text>
                                ) : (
                                    <Text style={styles.name}>Verified Customer</Text>
                                )}                               
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                                    <Text style={{ fontSize: 16, color: "black" }}>+91{phone}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { phone_number: phone, fullName: name, email: email })}>
                                        <Image source={require('../../components/Images/pencil.png')} style={{ alignSelf: 'center', marginLeft: 5, color: 'blue', height: 25, width: 25 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.profileContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate("booking")}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30, marginTop: 20 }}>
                                        <Image source={require('../../components/Images/event.png')} alt='bookIcon' style={{ width: 20, height: 20, }} />
                                        <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "space-between", flex: 1, alignItems: "center" }}>
                                            <Text style={styles.profileText}>My bookings</Text>
                                            <Image source={require('../../components/Images/right-arrow.png')} alt='rightIcon' style={{ height: 15, width: 15, tintColor: 'grey' }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { navigation.navigate("helpcenter") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
                                        <Image source={require('../Images/customer-support.png')} alt='bookIcon' style={{ width: 20, height: 20, }} />
                                        <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "space-between", flex: 1, alignItems: "center" }}>
                                            <Text style={styles.profileText}>Help center</Text>
                                            <Image source={require('../Images/right-arrow.png')} alt='rightIcon' style={{ height: 15, width: 15, tintColor: 'grey' }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { navigation.navigate("termsandconditions") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
                                        <Image source={require('../Images/shield.png')} alt='bookIcon' style={{ width: 20, height: 20, }} />
                                        <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "space-between", flex: 1, alignItems: "center" }}>
                                            <Text style={styles.profileText}>Terms&Condition</Text>
                                            <Image source={require('../Images/right-arrow.png')} alt='rightIcon' style={{ height: 15, width: 15, tintColor: 'grey' }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity onPress={() => { navigation.navigate("about") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
                                        <Image source={require('../Images/event.png')} alt='bookIcon' style={{ width: 20, height: 20, }} />
                                        <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "space-between", flex: 1, alignItems: "center" }}>
                                            <Text style={styles.profileText}>About</Text>
                                            <Image source={require('../Images/right-arrow.png')} alt='rightIcon' style={{ height: 15, width: 15, tintColor: 'grey' }} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.LogoutBtnContainer}>
                                <TouchableOpacity style={styles.LogoutBtn} onPress={handlelogout} >
                                    <Text style={styles.logoutbtnText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) :
                        (
                            
                            <View style={styles.container}>
                            
                                <View style={{ flexDirection: "row", padding: 20, gap: 50, alignItems: "center", backgroundColor: "black" }}>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Image style={styles.backImg} source={require('../Images/arrow.png')} />
                                    </TouchableOpacity>
                                    <Text style={styles.editText}>Profile</Text>
                                </View>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 10, width: 200 }}>
                                    <TouchableOpacity style={styles.login} onPress={() => navigation.navigate("Login")}>
                                        <Text style={styles.loginbtnText}>Login/Signup</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

            <StatusBar barStyle="white-content" hidden={false} backgroundColor="black" />
        </View >

    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: 'black'
    },

    LogoutBtnContainer: {
        marginTop: 10,
        justifyContent: "flex-end",
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    LogoutBtn: {
        borderWidth: 0.5,
        borderColor: "silver",
        marginHorizontal: '5%',
        alignItems: "center",
        padding: 15,
        borderRadius: 8
    },
    logoutbtnText: {
        color: "#8b0000",
        fontSize: 16,
        fontWeight: '500'
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
    login: {
        backgroundColor: "#311432",
        padding: 10,
        borderRadius: 10,
    },
    loginbtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '500',
        alignSelf: "center"
    },
    profileContainer: {
        backgroundColor: "#fff",
        padding: 10
    },
    profileText: {
        color: "black"
    }

})