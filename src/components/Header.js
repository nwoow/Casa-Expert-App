import React, { useContext, useEffect, useState } from 'react'
import { Image, StatusBar, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from './Context';

function Header({ showBackButton, showCart }) {
    const [cartCount, setCartCount] = useState(0);
    const navigation = useNavigation();
     const { cartItems } = useGlobalContext()

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleCartButton = () => {
        navigation.navigate("Cart")
    };

    useEffect(() => {
        // Calculate the total count of unique items in the cart
        const uniqueItems = new Set(cartItems.map((item) => item?.uid));
        setCartCount(uniqueItems.size);
    }, [cartItems]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" />
            <View style={styles.header}>
                <View style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems:
                        "center",
                }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap:35 }}>
                        {showBackButton && (
                            <View>
                                <TouchableOpacity onPress={handleBackButton}>
                                    <Image style={styles.backImg} source={require('../components/Images/arrow.png')} />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View>
                            <Image style={styles.logoImg} source={require('../components/Images/icon.png')} />
                        </View>
                    </View>

                    {
                        showCart && (
                            <TouchableOpacity onPress={handleCartButton}>
                                <View style={{ position: 'relative' }}>
                                    <Image style={styles.cart} source={require('../components/Images/shopping-cart.png')} />
                                    {cartCount > 0 && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{cartCount}</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>

            </View>
        </View>

    )
}

export default Header;

const styles = StyleSheet.create({

    logoImg: {
        width: 200,
        height: 70,
        resizeMode: 'contain',
    },
    cart: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    header: {
        backgroundColor: 'white',
        elevation: 0.5,
        paddingHorizontal: 15
    },
    backImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        color:"black"
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
