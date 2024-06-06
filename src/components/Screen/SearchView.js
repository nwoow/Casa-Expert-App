import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import HTML from 'react-native-render-html';
import { baseUrl } from '../Constant';
import { useGlobalContext } from '../Context';
import Header from '../Header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SearchView = ({ route, }) => {
    const { address, searchText } = route.params;
    const { AddToCart, message, setMessage } = useGlobalContext()
    const [searchCategory, setSearchCategory] = useState([])
    
    const navigation = useNavigation();

    const windowWidth = useWindowDimensions().width;

    const getProduct = async () => {
        await axios.get(`${baseUrl}/api/search-view/?address=${address}&query=${searchText}`)
            .then((res) => {
                setSearchCategory(res.data.subcategory)
                if (res.data.subcategory.length === 0) {
                    return alert('No Product Found')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        getProduct()
    }, [searchText])

   
    const handleSubCategory = (item) => {
        navigation.navigate("ServicePart", { uid: item.uid });
    }

    return (
        <View style={styles.container}>
            <Header showBackButton={true} showCart={true} />
                <View>
                    <FlatList
                        data={searchCategory}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => handleSubCategory(item)}>
                                        <View style={styles.categoryContainer}>
                                            <Image
                                                style={styles.categoryImage}
                                                source={{ uri: `${baseUrl}${item.subcategory_image}` }}
                                            />
                                            <Text style={styles.categoryText}>{item.category_name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            );
                        }}
                        horizontal={true}
                    />
                </View>


                {/* <FlatList data={searchProduct} renderItem={({ item, index }) => {
                return (
                    <View style={{ padding: 10, }}>
                        <View style={styles.card}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ width: 200 }}>
                                    <Text style={styles.servicetext}>{item.product_name}</Text>
                                    <Text style={styles.servicetext}>Price: ₹{item.dis_price}</Text>
                                    <HTML source={{ html: item.product_description }} contentWidth={windowWidth - 20} />
                                </View>
                                <View>
                                    <Image style={{ width: 130, height: 150, borderRadius: 15, resizeMode: 'contain' }} source={{ uri: `${baseUrl}${item.image}` }} />
                                    <View style={{ width: 115 }}>
                                        {message.uid === item.uid && message.text && (
                                            <View>
                                                <Text style={{ color: 'red', fontWeight: "700", fontSize: 16, alignSelf: "center" }}>{message.text}</Text>
                                            </View>
                                        )}
                                        <TouchableOpacity style={styles.cartbtn}
                                            onPress={() => handleAddToCart(item)}
                                        >
                                            <Text style={styles.cartbtnText}>ADD TO Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                )
            }} /> */}

            </View>
            )
}

            export default SearchView

            const styles = StyleSheet.create({
                container: {
                flex: 1,
            backgroundColor: "white"
    },
            card: {
                borderWidth: 2,
            padding: 15,
            borderRadius: 10,
            borderColor: "lightgrey",
            alignItems: "flex-start",
            boxSizing: "border-box",

    },
            cartbtn: {
                backgroundColor: '#FFAB00',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
    },
            line: {
                height: 1,
            backgroundColor: 'lightgrey',
    },
            cartbtnText: {
                color: "black",
            alignSelf: 'center',
            fontWeight: '700',
    },
            servicetext: {
                fontSize: 18,
            fontWeight: '700',
            color: "black",
    },
            dot: {
                width: 5,
            height: 5,
            borderRadius: 5,
            backgroundColor: 'grey',
    },
            description: {
                color: 'grey',
    },
            categoryContainer: {
                backgroundColor: '#f5f5f5',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 10,
            width: 100,
            width: 100
    },
            categoryImage: {
                width: 60,
            height: 60,
            resizeMode: 'contain',
            marginBottom: 5,
    },
            categoryText: {
                textAlign: 'center',
    },

})