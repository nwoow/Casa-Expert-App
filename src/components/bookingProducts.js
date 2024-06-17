import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { baseUrl } from './Constant';

const BookingProducts = ({ isVisible, item, onCancel, onClose }) => {

    const renderItem = ({ item: product }) => (

        <View style={styles.productContainer}>
            {console.log("item", product.quantity)}
            <View style={{ flexDirection: "row", alignItems: 'center', gap: 20, backgroundColor: '#f5f5f5', borderRadius: 5, padding: 10 }}>
                <Image source={{ uri: `${baseUrl}/${product.product.image}` }} style={styles.productImage} />
                <View style={{ marginLeft: 20, width: '90%' }}>
                    <Text style={{ fontSize: 16, fontWeight: "500", color: 'black' }}>{product.product.product_name}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 5, gap:30 }}>
                        <Text style={{ fontSize: 16, color: 'black',fontWeight: "500" }}>Quantity: {product.quantity}</Text>
                        <Text style={{ fontSize: 16, fontWeight: "500", color: 'black' }}>Price: {product.product.dis_price * product.quantity}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Image source={require('./Images/close.png')} style={{ height: 25, width: 25 }} />
                    </TouchableOpacity>
                    <View style={{ maxHeight: 400, marginTop: 15 }}>
                        {item && item.booking_products && item.booking_products.length > 0 ? (
                            <FlatList
                                data={item.booking_products}
                                keyExtractor={(product) => product.product.uid}
                                renderItem={renderItem}
                            />
                        ) : (
                            <Text style={{ color: 'black', fontSize: 16 }}>No booking products available</Text>
                        )}
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '95%',
        borderRadius: 10,
        padding: 10,
    },
    closeButton: {
        alignSelf: 'flex-end',
        top: 10,
        right: 10,
        padding: 10,
    },
    productContainer: {
        marginBottom: 15,
    },
    productImage: {
        height: 65,
        width: 65,
        borderRadius: 10,
    },
    cancelBtn: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
        width: 80,
        alignSelf: "center",
    },
    cancelText: {
        fontWeight: '500',
        color: "white",
        fontSize: 16,
        alignSelf: "center",
    },
});

export default BookingProducts;
