import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import Header from '../Header'
import { useGlobalContext } from '../Context'
import { baseUrl } from '../Constant'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Cart = ({ navigation }) => {
  const { cartItems, message, setMessage, handleDecrement, QuantityInc,isLoggedIn, handleDeleteItem } = useGlobalContext()
  const [token, setToken] = useState(null);

  const useFocused = useIsFocused()


  const handleIncrement = (item) => {
    QuantityInc(item)
  }

  const handleDelete = (item) => {
    handleDeleteItem(item);
  };

  const handleQuantityDecrement = (item) => {
    handleDecrement(item)
  }

  // const reducer =  (state, action) => {
  //   console.log(state)
  //   switch (action.type) {
  //     case 'INCREMENT':
  //       const newCartIncrement = state.cartItems.map(item =>
  //         item.uid === action.item.uid
  //           ? {
  //             ...item,
  //             quantity: item.quantity + 1,
  //             totalPrice: (item.quantity + 1) * item.dis_price
  //           }
  //           : item
  //       );
  //       AsyncStorage.setItem('cart', JSON.stringify(newCartIncrement));
  //       return {
  //         ...state,
  //         cartItems: newCartIncrement
  //       };

  //     case 'DECREMENT':
  //       const newCartDecrement = state.cartItems.map(item =>
  //         item.uid === action.item.uid && item.quantity > 1
  //           ? {
  //             ...item,
  //             quantity: item.quantity - 1,
  //             totalPrice: (item.quantity - 1) * item.dis_price
  //           }
  //           : item
  //       );
  //     AsyncStorage.setItem('cart', JSON.stringify(newCartDecrement));
  //       return {
  //         ...state,
  //         cartItems: newCartDecrement
  //       };

  //     case 'DELETECART':
  //       const updatedCart = state.cartItems.filter((cartItem) => cartItem.uid !== action.item.uid);
  //       console.log("updatedCart", updatedCart)
  //       AsyncStorage.setItem('cart', JSON.stringify(updatedCart));

  //       return {
  //         ...state,
  //         cartItems: setCartItems(updatedCart)
  //       };
  //   }

  // };

  // const initialState = {
  //   cartItems: cartItems || [],
  // };

  // const [state, dispatch] = useReducer(reducer, cartItems);


  const handleService = () => {
    navigation.navigate("Home");
  };

  const handleCheckout = async (item) => {
    if (isLoggedIn) {
      console.log('token',isLoggedIn)
      const selectedProductDetails = {
        name: item.product_name,
        quantity: item.quantity,
        price: item.dis_price,
        totalPrice: item.totalPrice,
        uid: item.sub_category,
        productUid: item.uid,
      };
      // User is logged in, navigate to checkout page
      navigation.navigate("CheckOut", { selectedProductDetails });
    } else {
      // User is not logged in, navigate to login page
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
        <Image source={require('../../components/Images/shopping-cart.png')} style={styles.cartIcon} />
        <Text style={styles.cartText}>Your cart</Text>
      </View>
      <View style={styles.horizontalLine} />

      {
        cartItems.length > 0 ?
          <View>
            <FlatList data={cartItems}
              keyExtractor={(item) => (item ? item.uid.toString() : null)}
              renderItem={(({ item, index }) => {
                return (
                  <View>
                    <View style={styles.cartCheckout}>
                      <View>
                        <View style={{ width: '90%' }}>
                          <Text style={styles.productname}>{item.product_name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 8, marginTop: 10, alignItems: "center", }}>
                          <Text style={styles.servicePrice}>{item.quantity}</Text>
                          <Text style={styles.servicePrice}>service</Text>
                          <View style={styles.dot} />
                          <Text style={styles.servicePrice}>₹{item.totalPrice}</Text>
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
                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly', marginTop: 10, marginBottom: 10 }}>
                      <View>
                        <TouchableOpacity onPress={() => handleDelete(item)}

                          style={styles.deleteButton}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity style={styles.checkOutButton} onPress={() => handleCheckout(item)}>
                          <Text style={styles.checkOutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                    <View style={styles.horizontalLine} />
                  </View>
                )
              })} />
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
          <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", marginBottom: 10 }}>
            <TouchableOpacity style={[styles.checkOutButton, { width: '90%', }]} onPress={handleCheckout}>
              <Text style={styles.checkOutButtonText}>Login/Sign up to proceed</Text>
            </TouchableOpacity>
          </View>
        )
      }

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
    fontWeight: "500"
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
    fontSize: 24,
    fontWeight: "500"
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
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    borderColor: 'silver'
  },
  deleteButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  checkOutButton: {
    backgroundColor: '#4b0082',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 150,
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
    backgroundColor: '#BE9DD5',
    borderColor: '#4b0082'
  },
  quantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#4b0082',
  },
})