import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from './Context';

const Otp = ({ route, navigation }) => {
    const { mobile } = route.params;
    const { login,verifyOtp,message } = useGlobalContext();

    const [box1, setBox1] = useState('');
    const [box2, setBox2] = useState('');
    const [box3, setBox3] = useState('');
    const [box4, setBox4] = useState('');
    const [box5, setBox5] = useState('');
    const [box6, setBox6] = useState('');

    const [showResendButton, setShowResendButton] = useState(false);
    const [timer, setTimer] = useState(120)

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);
    const input6Ref = useRef(null);
    

    const handleInputChange = (text, ref, nextRef, prevRef) => {
        if (text.length === 0) {
            if (prevRef) {
                prevRef.current.focus();
            }
        } else if (text.length === 1 && nextRef) {
            nextRef.current.focus();
        }
    };

    const handleVerifyOtp = () => {
        const otp = `${box1}${box2}${box3}${box4}${box5}${box6}`;
        verifyOtp(mobile, otp);
    }

    const handleResendOtp = () => {
        // Reset the timer for the decreasing timer
        setTimer(120);
        setShowResendButton(false);
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 0) {
                    clearInterval(interval);
                    setShowResendButton(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        login(mobile)

    };

    useEffect(() => {
        // Set an interval for the decreasing timer
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 0) {
                    clearInterval(interval);
                    setShowResendButton(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Text style={styles.verification}>Enter verification code</Text>
            <View style={{ padding: 20 }}>
                <Text style={styles.verificationText}>We have sent you a 6 digit verification code on phone number</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'center', gap: 10, marginTop: 40 }}>
                <TextInput
                    style={[styles.input, { borderColor: box1.length >= 1 ? "blue" : "grey" }]}
                    ref={input1Ref}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={(text) => { handleInputChange(text, input1Ref, input2Ref, null); setBox1(text) }}
                />

                <TextInput
                    ref={input2Ref}
                    onChangeText={(text) => { handleInputChange(text, input2Ref, input3Ref, input1Ref); setBox2(text) }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.input, { borderColor: box2.length >= 1 ? "blue" : "grey" }]}
                />

                <TextInput
                    ref={input3Ref}
                    onChangeText={(text) => { handleInputChange(text, input3Ref, input4Ref, input2Ref); setBox3(text) }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.input, { borderColor: box3.length >= 1 ? "blue" : "grey" }]}
                />

                <TextInput
                    ref={input4Ref}
                    onChangeText={(text) => { handleInputChange(text, input4Ref, input5Ref, input3Ref); setBox4(text) }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.input, { borderColor: box4.length >= 1 ? "blue" : "grey" }]}
                />

                <TextInput
                    ref={input5Ref}
                    onChangeText={(text) => { handleInputChange(text, input5Ref, input6Ref, input4Ref); setBox5(text) }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.input, { borderColor: box5.length >= 1 ? "blue" : "grey" }]}
                />

                <TextInput
                    ref={input6Ref}
                    onChangeText={(text) => { handleInputChange(text, input6Ref, null, input5Ref); setBox6(text) }}
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.input, { borderColor: box6.length >= 1 ? "blue" : "grey" }]}
                />
            </View>
            {
                message && (
                    <View style={{ alignSelf: "center", marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: "red" }}>{message}
                        </Text>
                    </View>
                )}


            <View style={styles.resendContainer}>
                {showResendButton ? (
                    <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
                        <Text style={styles.resendButtonText}>Resend OTP</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.resendText}>{`Valid OTP ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</Text>
                )}
            </View>

            <View style={styles.LoginBtnContainer}>
                <TouchableOpacity style={styles.LoginBtn} onPress={handleVerifyOtp}>
                    <Text style={styles.loginbtnText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default Otp;

const styles = StyleSheet.create({
    verification: {
        alignSelf: "center",
        marginTop: 100,
        fontSize: 30,
        fontWeight: "400",
        color: "#787878",
    },
    verificationText: {
        alignSelf: "center",
        fontSize: 18,
        color: "#787878",
        fontWeight: "400"
    },
    input: {
        borderWidth: 0.5,
        padding: 12,
        borderColor: '#B0B0B0',
        borderRadius: 5,
        width: 45,
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        color:'grey',
    },
    LoginBtnContainer: {
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 10,
    },
    LoginBtn: {
        backgroundColor: '#625BEE',
        marginHorizontal: '5%',
        alignItems: "center",
        padding: 15,
        borderRadius: 8
    },
    loginbtnText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: '500'
    },

    resendContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    resendText: {
        fontSize: 16,
        color: 'red',
    },
    resendButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#625BEE',
    },
    resendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },

})