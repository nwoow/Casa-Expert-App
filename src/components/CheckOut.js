import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Header from './Header';

const CheckOut = ({ navigation, route }) => {

    const [totalPrice, setTotalPrice] = useState(0);
    const { selectedProductDetails } = route.params;
    const quantity=selectedProductDetails.quantity;
    const subCategoryUid = selectedProductDetails.uid;
    const productUid=selectedProductDetails.productUid
    console.log(productUid)

    const calculateTotalPrice = () => {
        let total = 0;

        // Calculate total price for each item
        total += selectedProductDetails.totalPrice; // Product price
        total += 39; // Taxes and Fee
        total += 49; // Distance Fee

        // Set the total price to the state
        setTotalPrice(total);
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedProductDetails]);

    return (
        <View style={styles.container}>
            <Header showBackButton={true} />

            <View style={styles.checkOutContainer}>
                <Image source={require('./Images/checkout.png')} style={styles.checkOutIcon} />
                <Text style={styles.checkOutHeading}>CheckOut</Text>
            </View>

            <View style={{ padding: 20, borderWidth: 1, borderColor: 'silver', }}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemDetail}>Product:  {selectedProductDetails.name}</Text>
                    {/* <Text style={styles.itemDetail}>₹{selectedProductDetails.totalPrice}</Text> */}
                </View>
                <View style={styles.itemContainer}>
                    <View>
                        <Text style={styles.itemDetail}>Quantity:  {selectedProductDetails.quantity}</Text>
                    </View>
                    <View>
                        <Text style={styles.itemDetail}>{selectedProductDetails.quantity} * {selectedProductDetails.price}</Text>
                    </View>
                    <View>
                        <Text style={styles.itemDetail}>₹{selectedProductDetails.totalPrice}</Text>
                    </View>
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemDetail}>Taxes and Fee</Text>
                    <Text style={styles.itemDetail}>₹39</Text>
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemDetail}>Distance Fee</Text>
                    <Text style={styles.itemDetail}>₹49</Text>
                </View>
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={styles.totalPrice}>Total Price</Text>
                <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>
            <View style={styles.payOutButtonContainer}>
            <TouchableOpacity style={styles.payOutButton} onPress={() => navigation.navigate('AddressSlot', {
                    title: 'Add address and slot',
                    subCategoryUid:subCategoryUid,
                    productUid: productUid,
                    productQuantity: quantity,
                    totalPrice:totalPrice
                },)}>
                    <Text style={styles.payOutButtonText}>Add address and slot</Text>
                </TouchableOpacity>
            </View>
                                                            
        </View>
    )
}

export default CheckOut;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    checkOutHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color:'black'
    },
    payOutButtonContainer: {
        flex: 1,
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
        fontSize: 18,
        fontWeight: '400',
        color:'grey',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '500'
    }

})