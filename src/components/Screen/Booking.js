import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { baseUrl } from '../Constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useGlobalContext } from '../Context';
import BookingProducts from '../bookingProducts';


const Booking = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { isLoggedIn } = useGlobalContext();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const bookingOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/api/orderlist/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      // console.log("res",response.data.order[0].booking_products[0]);
      // console.log("data",response.data.order)
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const CancelBooking = async (item) => {
    const uid = item.uid;
    console.log(uid);
    const token = await AsyncStorage.getItem('token');
    await axios.post(`${baseUrl}/api/cancel-booking/`, { uid }, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        console.log("data", res.data);
        alert(res.data.message);
        bookingOrder();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleProductDetail = (item) => {
    navigation.navigate("ServicePart", { uid: item.product.sub_category, category: "" });
  };

  const handleProductDetailPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    console.log('ghjkl')
    setSelectedItem(null);
  };

  useEffect(() => {
    if (isLoggedIn) {
      bookingOrder();
    } else {
      setLoading(false);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Header showBackButton={true} />
      <View style={styles.bookingContainer}>
        <Text style={styles.bookingText}>My Booking</Text>
      </View>
      <View style={{ padding: 10, alignSelf: 'center' }}>
        <Text style={{ fontSize: 14, fontFamily:'Segoe UI Bold', color: 'red' }}>Note:- You Can Cancel Only before 1hr Booking Time/Date</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : isLoggedIn ? (
        <FlatList
          data={order}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.bookingContainer}>
              <TouchableOpacity onPress={() => handleProductDetailPress(item)} >
                <View style={styles.bookingCard}>
                  <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Image source={require('../Images/status.png')} style={{ height: 35, width: 35 }} />
                    <Text style={{
                      fontSize: 18,fontFamily:'Segoe UI Bold', color: item?.status === 'Pending' ? '#077E8C' :
                        item.status === 'Canceled' ? 'red' :
                          item.status === 'Accepted' ? 'darkorange' :
                            item.status === 'Completed' ? 'darkgreen' : "black"

                    }}>{item?.status}</Text>
                  </View>
                  <Text style={styles.bookingText}>Invoice No:{item.invoice_no}</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                    <Text style={styles.bookingText}>Booking Date:</Text>
                    <Text style={styles.bookingText}>{item?.booking_time}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                    <Text style={styles.bookingText}>Booking Time:</Text>
                    {item?.time_slot && item.time_slot.start_time ?
                      <Text style={styles.bookingText}>{item.time_slot.start_time}</Text>
                      : null
                    }
                  </View>
                  <Text style={styles.bookingText}>Total Price:{item.payble_amount}</Text>
                  {item.is_paid ? (
                    <Text style={styles.bookingText}>Payment Mode: Online</Text>
                  ) : (
                    <Text style={styles.bookingText}>Payment Mode: COD</Text>
                  )}
                  {item?.status === "Pending" && (
                    <View style={{ marginTop: 15, paddingHorizontal: 1 }}>
                      <TouchableOpacity onPress={() => CancelBooking(item)} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

            </View >
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "black", fontSize: 22, fontWeight: '500', marginBottom: 20 }}>You are not logged in.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
      <BookingProducts
        isVisible={modalVisible}
        item={selectedItem}
        onCancel={CancelBooking}
        onClose={handleCloseModal}
      />
    </View >
  );

};

export default Booking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  bookingContainer: {
    backgroundColor: "white",
    padding: 8,

  },
  bookingText: {
    fontSize: 14,
    color: 'black',
    fontFamily:'Segoe UI Bold',
  },
  productImage: {
    height: 65,
    width: 65,
  },
  productContainer: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    paddingVertical: 20,
    marginBottom: 15,

  },
  cancelBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    width: 80
  },
  cancelText: {
    fontFamily:'Segoe UI Bold',
    color: "white",
    fontSize: 14,
    alignSelf: "center"
  },
  loginBtn: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 5,
  },
  loginText: {
    fontWeight: '500',
    color: "white",
    fontSize: 16,
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,

  },
});
