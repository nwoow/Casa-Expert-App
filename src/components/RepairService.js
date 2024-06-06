import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { baseUrl } from './Constant'
import { useNavigation } from '@react-navigation/native';

const RepairService = ({ title, serviceProduct, }) => {

    const navigation = useNavigation();

    const handleProduct = ((item) => {
        navigation.navigate('ServicePart', { uid: item.subcat_uid, category: item.category })
    })

    const render = (({ item }) => {
        return (
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity onPress={() => handleProduct(item)}>
                    <Image source={{ uri: `${baseUrl}/${item.product_image}` }} style={{ width: 130, height: 130, resizeMode: "contain", borderRadius: 10 }} />
                    <View style={{ marginTop: 10, width: 150 ,}}>
                        <Text style={[styles.servicetext, { fontSize: 15, fontWeight: '500',  }]}>{item.product}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <View>
            <View style={styles.bookedservice}>
                <Text style={styles.bookedtxt}>{title}</Text>
            </View>
            <View style={styles.bookedImage}>
                <FlatList data={serviceProduct}
                    renderItem={render}
                    horizontal={true}
                />
            </View>
        </View>
    )
}

export default RepairService

const styles = StyleSheet.create({
    bookedservice: {
        padding: 10,
    },
    bookedtxt: {
        fontSize: 23,
        fontWeight: "bold",
        color:"black"

    }
})