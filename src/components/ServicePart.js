import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import HTML, { RenderHTML } from 'react-native-render-html';
import Header from './Header';
import { useWindowDimensions } from 'react-native';
import { useGlobalContext } from './Context';
import { useIsFocused } from '@react-navigation/native';
import ModalCart from './ModalCart';
import { baseUrl } from './Constant';


const ServicePart = ({ route }) => {
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State to manage loading indicator
    const { AddToCart, cartItems, QuantityInc, handleDecrement, message, isItemAddedToCart } = useGlobalContext();
    const { uid, category } = route.params;
    const isFocused = useIsFocused();
    const windowWidth = useWindowDimensions().width;

    const handleService = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/service/${uid}`);
            setProduct(res.data.service);
            console.log(res.data.service)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); // Once data is fetched, set loading to false
        }
    };

    useEffect(() => {
        handleService();
    }, [isFocused]);

    const handleAddToCart = (item) => {
        AddToCart(item);
    };

    const handleIncreaseQuantity = (item) => {
        QuantityInc(item);
    };

    const handleDecreaseQuantity = (item) => {
        handleDecrement(item);
    };


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header showBackButton={true} showCart={true} />
            <View style={[styles.shadow, { paddingHorizontal: 25, padding: 10 }]}>
                <Text style={{ fontSize: 22, fontFamily: 'Segoe UI Bold', color: "black" }}>{category}</Text>
            </View>
            {isLoading ? (
                <View style={[styles.loaderContainer, { backgroundColor: 'rgba(255, 0, 0, 0.1)' }]}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (
                <FlatList
                    data={product}
                    renderItem={({ item }) => {
                        const cartItem = cartItems.find(cartItem => cartItem.uid === item.uid);
                        return (
                            <View style={{ padding: 10, }}>
                                <View style={styles.card}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 200 }}>
                                            <Text style={[styles.servicetext, { marginBottom: 8 }]}>{item.product_name}</Text>
                                            <Text style={styles.servicetext}>Price: ₹{item.dis_price}</Text>

                                            <RenderHTML
                                                source={{ html: item.product_description }}
                                                contentWidth={windowWidth - 20}
                                                tagsStyles={{
                                                    li: {
                                                        color: 'black',
                                                        fontSize: 14,
                                                        fontFamily: 'Arial',
                                                        marginBottom: 8,
                                                    },
                                                    p: {
                                                        color: 'black',
                                                        fontSize: 14,
                                                        fontFamily: 'Arial',
                                                        marginBottom: 8,
                                                    },
                                                }}
                                            />

                                        </View>
                                        <View>
                                            <Image
                                                style={{ width: 130, height: 150, borderRadius: 15, resizeMode: 'contain' }}
                                                source={{ uri: `${baseUrl}${item.image}` }}
                                            />
                                            <View>
                                                {cartItem ? (
                                                    <View style={styles.QuantityContainer}>
                                                        <TouchableOpacity style={styles.cartbtn} onPress={() => handleDecreaseQuantity(cartItem)}>
                                                            <Text style={styles.cartbtnText}>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.cartbtnText}>{cartItem.quantity}</Text>
                                                        <TouchableOpacity style={styles.cartbtn} onPress={() => handleIncreaseQuantity(cartItem)}>
                                                            <Text style={styles.cartbtnText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity style={styles.cartbtnadd} onPress={() => handleAddToCart(item)}>
                                                        <Text style={styles.cartbtnaddText}>Add</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        );
                    }}
                    keyExtractor={(item) => item.uid}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
            {isItemAddedToCart && <ModalCart cartItems={cartItems} />}
        </View>
    );
};

export default ServicePart;

const styles = StyleSheet.create({
    card: {
        borderBottomWidth: 1,
        padding: 15,
        borderColor: 'lightgrey',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
    },
    cartbtn: {
        paddingVertical: 5,
        marginHorizontal: 8,
    },
    cartbtnadd: {
        borderWidth: 1,
        borderRadius: 10,
        width: '80%',
        borderColor: "#rgb(110, 66, 229)"
    },
    cartbtnaddText: {
        color: "#rgb(110, 66, 229)",
        fontSize: 16,
        padding: 8,
        alignSelf: "center",
        fontWeight: '600'
    },
    cartbtnText: {
        color: "#rgb(110, 66, 229)",
        alignSelf: 'center',
        fontWeight: '600',
        fontSize: 20,
        marginLeft: 5,
    },
    servicetext: {
        fontSize: 16,
        fontFamily: 'Segoe UI Bold',
        color: 'black',
    },
    QuantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        width: 100,
        backgroundColor: '#rgb(245, 242, 253)',
        borderColor: "#rgb(110, 66, 229)",
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});
