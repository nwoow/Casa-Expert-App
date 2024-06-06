import { StyleSheet, Text, View, StatusBar, Image, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header';
import { baseUrl } from '../Constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Booking = ({ navigation }) => {

  const useFocused = useIsFocused()

  const [order, setOrder] = useState([])
  const [loading, setLoading] = useState(true)

  const bookingOrder = (async () => {
    const token = await AsyncStorage.getItem('token')
    await axios.get(`${baseUrl}/api/orderlist/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {

        setOrder(res.data.order)
        setLoading(false)

      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  })

  const CancelBooking = async (item) => {
    const uid = item.uid
    console.log(uid)
    const token = await AsyncStorage.getItem('token')
    await axios.post(`${baseUrl}/api/cancel-booking/`, { uid }, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res.data)
        alert(res.data.message)
        bookingOrder();
      })
      .catch((error) => {
        console.log(error)

      })
  }

  const handleProductDetail = ((item) => {
    navigation.navigate("ServicePart", { uid: item.product.sub_category, category: "" })

  })

  useEffect(() => {
    bookingOrder()
  }, [useFocused])

  return (
    <View style={styles.container}>
      <Header showBackButton={true} />
      <View style={styles.bookingContainer}>
        <Text style={styles.bookingText}>My Booking</Text>
      </View>
      <View style={{ padding: 10, alignSelf: 'center' }}>
        <Text style={{ fontSize: 11, fontWeight: '500', color: 'red' }}>Note:-You Can Cancel Only before 1hr Booking Time/Date</Text>
      </View>

      {
        loading ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
          :
          <FlatList
            data={order}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => {
              return (
                <>
                  {
                    item && item.product ? (
                      <View style={styles.productContainer} >
                        <View style={{ marginHorizontal: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View>
                            <Image source={require('../Images/status.png')} style={{ height: 35, width: 35 }} />
                          </View>
                          <Text style={{ fontSize: 16, fontWeight: 500, color: 'black' }}>{item.status}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: 'center', gap: 20, backgroundColor: '#f5f5f5', borderRadius: 5, padding: 10 }}>
                          <Image src={`${baseUrl}/${item.product.image}`} alt='product image' style={styles.productImage} />
                          <TouchableOpacity onPress={() => handleProductDetail(item)}>
                            <View style={{ marginLeft: 20, width: '90%' }}>
                              <View >
                                <Text style={{ fontSize: 16, fontWeight: "500", color: 'black' }}>{item.product.product_name}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                                <Text style={{ fontSize: 14, color: 'black' }}>Booking Date:</Text>
                                <Text style={{ fontSize: 14, color: 'black' }}>{item.booking_time}</Text>
                              </View>
                              <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                                <Text style={{ fontSize: 14, color: 'black' }}>Booking Time:</Text>
                                {item.time_slot && item.time_slot.start_time ?
                                  <Text style={{ fontSize: 14, color: 'black' }}>{item.time_slot.start_time}</Text>
                                  : null
                                }

                              </View>

                            </View>
                            {
                              item.status === "Pending" && (
                                <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
                                  <TouchableOpacity onPress={() => CancelBooking(item)}
                                    style={styles.cancelBtn}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                  </TouchableOpacity>
                                </View>
                              )
                            }
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                      : (
                        <View style={{ flex: 1,justifyContent: "center", alignItems: "center" }}>
                          <Text style={{color:"black",fontSize:22,fontWeight:'500'}}>No Booking Available</Text>
                        </View>
                      )
                  }
                </>
              )
            }}
          />
      }

      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" />

    </View >
  )
}

export default Booking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingContainer: {
    backgroundColor: "white",
    padding: 20,

  },
  bookingText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black'
  },

  productImage: {
    height: 65,
    width: 65,
  },
  productContainer: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingVertical: 20,
    marginBottom: 15
  },
  cancelBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    width: 80
  },
  cancelText: {
    fontWeight: '500',
    color: "white",
    fontSize: 16,
    alignSelf: "center"
  }
})