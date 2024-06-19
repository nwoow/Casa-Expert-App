import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { useGlobalContext } from './Context'
import { baseUrl } from './Constant'
import { useIsFocused, } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Cart = ({ navigation }) => {
  const { cartItems, message, setMessage, handleDecrement, QuantityInc, isLoggedIn, handleDeleteItem } = useGlobalContext()
  const [token, setToken] = useState(null);

  console.log(isLoggedIn)

  const useFocused = useIsFocused()


  const handleIncrement = (item) => {
    QuantityInc(item)
  }

  const handleDelete = (item) => {
    handleDeleteItem(item);
    ToastAndroid.show("Item deleted successfully", ToastAndroid.SHORT);
  };

  const handleQuantityDecrement = (item) => {
    handleDecrement(item)
  }

  const handleService = () => {
    navigation.navigate("Home");
  };

  const handleCheckout = async () => {
    if (isLoggedIn) {
      navigation.navigate("CheckOut", { cartItems });
    } else {
      navigation.navigate("Login");
    }
  };

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem("token");
    setToken(userToken);
  };

  useEffect(() => {
    checkToken()
  }, [useFocused]);

  return (
    <View style={styles.container}>
      <Header showBackButton={true} />
      <View style={styles.cartContainer}>
        <Image source={require('./Images/shopping-cart.png')} style={styles.cartIcon} />
        <Text style={styles.cartText}>Your cart</Text>
      </View>
      <View style={styles.horizontalLine} />

      {
        cartItems.length > 0 ?
          <View style={{ flex: 1 }}>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => (item ? item.uid.toString() : null)}
              renderItem={(({ item, index }) => {
                return (
                  <View>
                    <View style={{ alignItems: "flex-end", width: "98%" }}>
                      <TouchableOpacity onPress={() => handleDelete(item)}
                        style={styles.deleteButton}>
                        <Icon name="close" size={25} color="#900" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cartCheckout}>

                      <View>
                        <View style={{ width: '90%' }}>
                          <Text style={styles.productname}>{item.product_name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 8, marginTop: 10, alignItems: "center", }}>
                          <Text style={styles.servicePrice}>{item.quantity}</Text>
                          <Text style={styles.servicePrice}>service</Text>
                          <View style={styles.dot} />
                          <Text style={styles.servicePrice}>₹{item.dis_price * item.quantity}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity onPress={() => handleQuantityDecrement(item)}
                          >
                            <Text style={styles.quantityButton}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantity}>{item.quantity}</Text>
                          <TouchableOpacity onPress={() => handleIncrement(item)}
                          >
                            <Text style={styles.quantityButton}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Image src={`${baseUrl}${item.image}`} style={{ width: 80, height: 80 }} />
                      </View>

                    </View>
                    {/* <View style={{ flexDirection: "row", justifyContent: 'space-evenly', marginTop: 10, marginBottom: 10 }}>
                      <View>
                        <TouchableOpacity onPress={() => handleDelete(item)}

                          style={styles.deleteButton}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View> */}
                    <View style={styles.horizontalLine} />
                  </View>
                )

              })}
            />
          </View>
          : <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity onPress={handleService} style={styles.goToServiceBTn}>
                <Text style={styles.goToServiceBTnText}>Go to service </Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      {
        !token && (
          <View style={{ justifyContent: "flex-end", alignItems: "center", marginBottom: 10 }}>
            <TouchableOpacity style={[styles.checkOutButton, { width: '90%', }]} onPress={handleCheckout}>
              <Text style={styles.checkOutButtonText}>Login/Sign up to proceed</Text>
            </TouchableOpacity>
          </View>
        )
      }

      {cartItems.length > 0 && (
        <View style={{  justifyContent: "flex-end", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity style={styles.checkOutButton} onPress={() => handleCheckout(cartItems[0])}>
            <Text style={styles.checkOutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  )
}

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  cartContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 8,
    alignItems: "center",
  },
  cartText: {
    fontSize: 24,
    fontWeight: "500",
    color: "black"
  },
  horizontalLine: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  cartCheckout: {
    flexDirection: 'row',
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10
  },
  productname: {
    fontSize: 22,
    fontWeight: "400",
    color: "black"

  },
  servicePrice: {
    color: "grey",
    fontSize: 18,
    fontWeight: '400'
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 5,
    backgroundColor: 'grey',
  },
  deleteButton: {
    borderRadius: "50%",
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'silver',
    backgroundColor: 'white'
  },

  checkOutButton: {
    backgroundColor: '#4b0082',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "95%",
    alignItems: 'center',
    borderColor: 'silver'
  },
  checkOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cartIcon: {
    width: 30,
    height: 30,
    tintColor: '#4b0082'
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '500'
  },
  goToServiceBTn: {
    backgroundColor: '#4b0082',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  goToServiceBTnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: "bold"
  },
  messageText: {
    color: "red",
    fontSize: 18,
    fontWeight: '500',
    alignSelf: "center"
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: 100,
    backgroundColor: '#rgb(245, 242, 253)',
    borderColor: "#rgb(110, 66, 229)",
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    color: '#rgb(110, 66, 229)',
  },
  quantity: {
    color: '#rgb(110, 66, 229)',
  }
})