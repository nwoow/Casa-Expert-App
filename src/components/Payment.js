import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import { baseUrl } from './Constant'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import CryptoJS from 'crypto-js';
import base64 from 'react-native-base64';
import { useGlobalContext } from './Context'


function generateTransactionId() {
    const timeStamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000000);
    const merchantPrefix = 'CX';
    const transactionId = `${merchantPrefix}${timeStamp}${randomNumber}`
    return transactionId;
}


const Payment = ({ route, navigation }) => {

    const { title, bookingid, totalProductPrice, productUid } = route.params
    const { cartItems, setCartItems } = useGlobalContext();
    const [selectedPayment, setSelectedPayment] = useState(null);

    console.log(typeof (totalProductPrice))

    const handlePayment = (async () => {
        if (selectedPayment === null) {
            alert('Error', 'Please select a payment method.')
            return;
        }
        const token = await AsyncStorage.getItem('token')
        const uid = bookingid;

        if (selectedPayment === 'cash') {
            console.log('Processing Cash on Delivery');
            const paymenttype = 'cod'
            axios.post(`${baseUrl}/api/generate-booking/`, { uid, paymenttype }, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.status === 200) {
                        const orderedItem = { uid: productUid };
                        removeOrderedItems([orderedItem]);

                        navigation.navigate('thanku')
                    }
                    else (
                        console.log('Something Work')
                    )
                })
                .catch((error) => {
                    console.log(error)
                })


        } else if (selectedPayment === 'phonepay') {
            console.log('Processing PhonePe payment');
            console.log('PhonePe payment');
            // 
            const environmentForSDK = 'SANDBOX'; // or 'PRODUCTION', depending on your environment
            const merchantIds = 'PGTESTPAYUAT';
            const appId = null; // Replace with your app ID if available
            const isDebuggingEnabled = true; // or false, depending on your requirement
            PhonePePaymentSDK.init(
                environmentForSDK,
                merchantIds,
                appId,
                isDebuggingEnabled
            ).then(result => {
                console.log('Sucessfully initializing SDK', result)
            })
            const merchantid = generateTransactionId()
            const payload = {
                "merchantId": "PGTESTPAYUAT143",
                "merchantTransactionId": merchantid,
                "merchantUserId": "MUID123",
                "amount": totalProductPrice * 100,
                "callbackUrl": "https://casaxprt.com/paymentcallback",
                "mobileNumber": "9931589733",
                "paymentInstrument": {
                    "type": "PAY_PAGE"
                }
            };

            const jsonString = JSON.stringify(payload);

            // Convert JSON payload to Base64
            const base64EncodedPayload = base64.encode(jsonString);
            console.log('Base64', base64EncodedPayload)

            // Calculate checksum
            const endPoint = "/pg/v1/pay";
            const salt = 'ab3ab177-b468-4791-8071-275c404d8ab0'; // Replace with your salt
            const saltIndex = '1'; // Replace with your salt index
            const checksum = CryptoJS.SHA256(base64EncodedPayload + endPoint + salt).toString() + '###' + saltIndex;
            const body = base64EncodedPayload;
            const packageName = 'com.example.awesomeapp';
            const appSchema = 'app';
            console.log(checksum)
            // making server request before payment
            axios.post(`${baseUrl}/api/generate-booking/`, { uid, merchantid }, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.status === 200) {
                        PhonePePaymentSDK.startTransaction(body, checksum, packageName, appSchema)
                            .then(res => {
                                console.log(res)
                                if (res.status === "SUCCESS") {
                                    const orderedItem = { uid: productUid };
                                    removeOrderedItems([orderedItem]);
                                    navigation.navigate('thanku')
                                }

                            })
                            .catch(error => { console.log(error) })

                            .catch(error => {
                                console.error("Error initializing SDK:", error);
                            });


                    }
                    else (
                        console.log('Something Work')
                    )
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    })

    const removeOrderedItems = (orderedItems) => {
        const updatedCart = cartItems.filter(item => !orderedItems.some(orderedItem => orderedItem.uid === item.uid));
        setCartItems(updatedCart);
        AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", padding: 20, gap: 50, alignItems: "center", backgroundColor: "black" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.backImg} source={require('./Images/arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.editText}>{title}</Text>
            </View>
            <View style={styles.paymentContainer}>
                <TouchableOpacity
                    style={[styles.paymentOption, selectedPayment === 'cash' && styles.selectedOption]}
                    onPress={() => setSelectedPayment('cash')}
                >
                    <Text style={styles.optionText}>Cash on Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.paymentOption, selectedPayment === 'phonepay' && styles.selectedOption]}
                    onPress={() => setSelectedPayment('phonepay')}
                >
                    <Text style={styles.optionText}>Online Payment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.payButton, selectedPayment === null && styles.disabledButton]}
                    onPress={handlePayment}
                    disabled={selectedPayment === null}>
                    <Text style={styles.payButtonText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Payment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    paymentContainer: {
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    paymentOption: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    optionText: {
        fontSize: 18,
        alignSelf: "center",
        color: "black"
    },
    payButton: {
        marginTop: 20,
        backgroundColor: '#3498db', // Example button color
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: "center"
    },
    selectedOption: {
        backgroundColor: '#e6f7ff', // Example background color for selected option
        borderColor: '#3498db', // Example border color for selected option
    },
    disabledButton: {
        backgroundColor: '#ccc', // Example disabled button color
    },
})