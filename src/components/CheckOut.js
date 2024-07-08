import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from './Header';

const CheckOut = ({ navigation, route }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const { cartItems } = route.params;

    console.log(cartItems)

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((sum, item) => sum + (item.dis_price * item.quantity), 0);
        setTotalPrice(total);
    };

    useEffect(() => {
        calculateTotalPrice();
    }, []);

    return (
        <View style={styles.container}>
            <Header showBackButton={true} />
            <View style={styles.checkOutContainer}>
                <Image source={require('./Images/checkout.png')} style={styles.checkOutIcon} />
                <Text style={styles.checkOutHeading}>CheckOut</Text>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 20, borderWidth: 1, borderColor: 'silver' }}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemDetail}>Product: {item.product_name}</Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <View>
                                <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
                            </View>
                            <View>
                                <Text style={styles.itemDetail}>₹{item.totalPrice}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={styles.totalPrice}>Total Price</Text>
                <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>

            <View style={styles.payOutButtonContainer}>
                <TouchableOpacity style={styles.payOutButton} onPress={() => navigation.navigate('AddressSlot', {
                    title: 'Add address and slot',
                    cartItem: cartItems,
                    totalPrice: totalPrice
                })}>
                    <Text style={styles.payOutButtonText}>Add address and slot</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CheckOut;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    checkOutHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    payOutButtonContainer: {
        justifyContent: "flex-end",
        padding: 10,
    },
    payOutButton: {
        backgroundColor: '#4b0082',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        borderColor: 'silver',
    },
    payOutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    checkOutContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        padding: 10,
        gap: 8,
        alignItems: "center",
    },
    checkOutIcon: {
        width: 40,
        height: 40,
        tintColor: '#4b0082'
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginBottom: 10
    },
    itemDetail: {
        fontSize: 20,
        fontWeight: '400',
        color: 'black',
        fontFamily: 'Segoe UI'
    },
    totalPrice: {
        fontSize: 24,
        color: "black",
        fontFamily: 'Segoe UI Bold'
    }
});
