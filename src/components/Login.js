import { Image, StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useGlobalContext } from './Context'

const Login = ({ navigation }) => {
    const [mobile, setMobile] = useState()
    const [message, setMessage] = useState('')
    const { login } = useGlobalContext()

    const handleLogin = ((mobile) => {
        if (mobile) {
            if (mobile.length === 10) {
                login(mobile);
                navigation.navigate('Otp', { mobile })
            }
            else {
                setMessage('Phone number should not be less or greater than 10 digits');
                setTimeout(() => {
                    setMessage('')
                }, 3000);
            }

        } else {
            // Display an error message or handle it as per your requirement
            setMessage("Please provide a Phone number");
            setTimeout(() => {
                setMessage('')
            }, 2000);
        }
    })


    return (
        <View style={styles.container}>
            <Image source={require('./Images/icon.png')} style={styles.loginImg} />
            <View>
                <Text style={styles.text}>Your Home Service Expert</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <Text style={styles.quicktext}>Quick</Text>
                <Text style={styles.dot}></Text>
                <Text style={styles.quicktext}>Affordable</Text>
                <Text style={styles.dot}></Text>
                <Text style={styles.quicktext}>Trusted</Text>
            </View>
            <View style={{ marginTop: 30, flexDirection: "row" }}>
                <View style={{}}>
                    <TextInput
                        style={styles.numberinput}
                        placeholder='+91'
                        placeholderTextColor="black" />
                </View>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder='Enter Mobile Number'
                    placeholderTextColor='grey'
                    onChangeText={(text) => setMobile(text)}
                />
            </View>

            {
                message && (
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 400, color: "red" }}>{message}</Text>
                    </View>
                )
            }

            <View style={{
                width: "95%", alignItems: 'center',
                justifyContent: "center",
            }}>
                <TouchableOpacity style={styles.btn} onPress={() => handleLogin(mobile)}>
                    <Text style={{ alignSelf: "center", color: "white", fontWeight: '500' }}>Get Verification Code</Text>
                </TouchableOpacity>
            </View>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" />
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#ffF",

    },
    loginImg: {
        width: '100%',
        height: 100,
        resizeMode: "contain"
    },
    text: {
        fontSize: 18,
        fontWeight: '400',
        color: "gray",
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 5,
        backgroundColor: 'grey',
    },
    quicktext: {
        fontSize: 13,
        color: "gray",
        fontWeight: '500'
    },
    input: {
        height: 50,
        borderColor: 'silver',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        fontWeight: 'bold',
        elevation: 1,
        backgroundColor: "#fff",
        width: 250,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        fontSize: 16,
        color:"black"
    },
    numberinput: {
        height: 50,
        borderColor: 'silver',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        fontWeight: 'bold',
        elevation: 1,
        backgroundColor: "#fff",
        width: 60,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        fontSize: 16,
    },
    btn: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        width: "90%",
        marginTop: 30,
    }
})