import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { baseUrl } from './Constant'
import { useNavigation } from '@react-navigation/native'


const MostBookedService = ({ service }) => {

    const navigation = useNavigation()

    const handleItemClick = ((item) => {
        navigation.navigate('ServicePart', { uid: item.sub_category, category: "Most Booked Service" })
    })


    const render = (({ item }) => {
        return (
            <View style={{ flex: 1, marginTop: 10, }}>
                <TouchableOpacity onPress={() => handleItemClick(item)}>
                    <Image source={{ uri: `${baseUrl}/${item.image}` }} style={{ width: 130, height: 130, resizeMode: "cover", borderRadius: 10, }} />
                    <View style={{ width: 140, marginTop: 10, width: 150, }}>
                        <Text style={[styles.servicetext, { fontSize: 15, fontWeight: '500',color:"black" }]}>{item.product_name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <View>
            <View style={styles.bookedservice}>
                <Text style={styles.bookedtxt}>Most booked Service</Text>
            </View>
            <View style={styles.bookedImage}>
                <FlatList data={service}
                    renderItem={render}
                    horizontal={true}
                />
            </View>
        </View>
    )
}

export default MostBookedService;

const styles = StyleSheet.create({
    bookedservice: {
        padding: 10
    },
    bookedtxt: {
        fontSize: 23,
        fontWeight: "bold",
        color:'black'
    }
})