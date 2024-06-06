import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo';

const CheckInternet = () => {

    const [isConnected, setIsConnected] = useState(true);
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    const handleRetry = () => {
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                // If connected, show the data
                setShowData(true);
            }
        });
    };

    return (
        <View>
            <Modal visible={!isConnected} animationType="slide" transparent>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, marginBottom: 10, color: "black" }}>You are offline!</Text>
                        <Text style={{ fontSize: 18, marginBottom: 10, color: "black" }}>Please check your mobile data or Wi-Fi connection</Text>
                        <TouchableOpacity onPress={handleRetry} style={{ marginTop: 20 }}>
                            <Text style={{ color: 'blue' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default CheckInternet

const styles = StyleSheet.create({})