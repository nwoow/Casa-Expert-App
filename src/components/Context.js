import { createContext, useContext, useEffect, useRef, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from "./Constant";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

const AppContext = createContext();

const AppProvider = ({ children, }) => {
    const navigation = useNavigation();

    const [cartItems, setCartItems] = useState([]);
    const [message, setMessage] = useState('')
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [emailId, setEmailId] = useState("")
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isItemAddedToCart, setIsItemAddedToCart] = useState(false);

    const AddToCart = async (item) => {
        const isSameSubCategory = await checkSubCategory(item);

        if (!isSameSubCategory) {
            // If the item belongs to a different subcategory, clear the cart
            setCartItems([]);
            AsyncStorage.removeItem('cart');
            setMessage({ uid: item.uid, text: "Only items from the same category can be added to the cart" });
        }
        // console.log('sub_cateUid', item.subcat_uid);
        const existingItem = cartItems.find((cartItem) => {

            return cartItem.uid === item.uid;
        });

        if (existingItem) {
            setMessage({ uid: item.uid, text: "Already item in cart" });
        } else {
            setCartItems((prevCart) => {
                const newCart = [...prevCart, { ...item, quantity: 1, totalPrice: item.dis_price }];
                // Update AsyncStorage with the latest state
                setIsItemAddedToCart(true);
                AsyncStorage.setItem('cart', JSON.stringify(newCart));
                return newCart;
            });
        }
    };

    const checkSubCategory = async (item) => {
        const cartItemString = await AsyncStorage.getItem('cart');
        const cartItems = cartItemString ? JSON.parse(cartItemString) : [];

        if (cartItems.length === 0 || cartItems[0].subcat_uid === item.subcat_uid) {
            console.log("true");
            return true

        } else {
            console.log('false');
            await AsyncStorage.removeItem('cart');
            return false
        }
    };


    const QuantityInc = (item) => {
        const updatedCartInc = cartItems.map(cartItem =>
            cartItem.uid === item.uid
                ? { ...cartItem, quantity: cartItem.quantity + 1, totalPrice: (cartItem.quantity + 1) * cartItem.dis_price }
                : cartItem
        );
        setCartItems(updatedCartInc);
        setIsItemAddedToCart(true);
        AsyncStorage.setItem('cart', JSON.stringify(updatedCartInc));

    }

    const handleDecrement = (item) => {
        const updatedCartDec = cartItems.map(cartItem =>
            cartItem.uid === item.uid && cartItem.quantity > 1
                ? { ...cartItem, quantity: cartItem.quantity - 1, totalPrice: (cartItem.quantity - 1) * cartItem.dis_price }
                : cartItem
        );
        setCartItems(updatedCartDec);
        setIsItemAddedToCart(true);
        AsyncStorage.setItem('cart', JSON.stringify(updatedCartDec));
        setMessage({ uid: item.uid, text: "Item deleted successfully" });
    };

    const handleDeleteItem = (item) => {
        const updatedCart = cartItems.filter(cartItem => cartItem.uid !== item.uid);
        setCartItems(updatedCart);
        setIsItemAddedToCart(false);
        AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        setMessage("Item Deleted successfully");
    };

    const login = (mobile) => {
        axios.post(`${baseUrl}/api/user-login/`, { phone_number: mobile })
            .then((res) => {
                console.log(res.data)

            })
            .catch((error) => {
                console.log(error)
            })
    }

    const verifyOtp = (mobile, otp) => {
        const phone_number = mobile
        axios.post(`${baseUrl}/api/verify-otp/`, { phone_number, otp, })
            .then((res) => {
                if (res.data.status === 200) {
                    AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                    AsyncStorage.setItem('token', res.data.access);
                    setLoggedIn(true);
                    console.log("isLoggedIn", true);
                    navigation.navigate("Cart")

                } else {
                    setMessage('Login Failed');
                    setTimeout(() => {
                        setMessage('');
                    }, 2000);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem('isLoggedIn')
        setLoggedIn(false);
    }

    const profileData = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await axios.get(
                `${baseUrl}/api/profile/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            setName(response.data.profile.full_name)
            setPhoneNumber(response.data.profile.phone_number)
            setEmailId(response.data.profile.email)
        } catch (error) {
            console.error(error);

        }
    };


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setMessage("");
        },
            2000);
        return () => clearTimeout(timeoutId);
    }, [cartItems, setMessage]);


    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const cartData = await AsyncStorage.getItem('cart');
                if (cartData) {
                    const parsedCart = JSON.parse(cartData);
                    setCartItems(parsedCart);
                }
            } catch (error) {
                console.error('Error retrieving cart data:', error);
            }
        };
        fetchCartData();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const loggedInStatus = await AsyncStorage.getItem('isLoggedIn')
            console.log("login", loggedInStatus)
            if (loggedInStatus === 'true') {
                setLoggedIn(true);

            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            console.error('Error retrieving login status:', error);
        }
    };

    useEffect(() => {
        checkLoginStatus()
    }, [])


    useEffect(() => {
        // This effect will run only when isLoggedIn state changes
        if (isLoggedIn) {
            profileData(); // If user is logged in, fetch profile data
        } else {
            // If user is not logged in, clear profile data
            setName("");
            setPhoneNumber("");
            setEmailId("");
        }
    }, [isLoggedIn]);


    const contextValues = {
        cartItems, AddToCart, message, setMessage, handleDecrement, QuantityInc, handleDeleteItem, login, isLoggedIn, logout, setLoggedIn, profileData, emailId, name, phoneNumber, setName, setPhoneNumber, setCartItems, setEmailId, verifyOtp, isItemAddedToCart
    };

    return (
        <AppContext.Provider value={contextValues}>
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within an AppProvider');
    }
    return context;
};

export { AppProvider, useGlobalContext };