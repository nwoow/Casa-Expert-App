import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const ModalCart = ({ cartItems }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        const total = cartItems.reduce((acc, item) => {
            acc.totalPrice += item.totalPrice;
            acc.totalItems += item.quantity;
            return acc;
        }, { totalPrice: 0, totalItems: 0 });

        setTotalPrice(total.totalPrice);
        setTotalItems(total.totalItems);
    }, [cartItems]);

    return (
        <View>
            <View style={styles.modalContent}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Text style={styles.text}>{totalItems}.</Text>
                        <Text style={styles.text}>₹{totalPrice}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutButton} onPress={() => { navigation.navigate("Cart") }}>
                        <Text style={styles.checkoutButtonText}>View Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
};

export default ModalCart;

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 15,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'lightgrey',
        width: "100%",
        alignSelf: "center",
        elevation: 5,
        position: 'absolute',
        bottom: 0,
    },
    text: {
        color: 'black',
        marginRight: 10,
        fontSize: 20,
    },
    checkoutButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 48,
        borderRadius: 5,
    },
    checkoutButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
});
