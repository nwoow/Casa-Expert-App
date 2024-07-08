import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, Modal, View, Button, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState, useCallback, } from 'react'
import Header from '../Header'
import MostBookedService from '../MostBookedService'
import RepairService from '../RepairService'
import ServiceModel from '../ServiceModel'
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios'
import { baseUrl } from '../Constant'
import Search from '../Search'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import messaging from '@react-native-firebase/messaging';


const Home = ({ route, }) => {
    const { addressData } = route.params
    const [category, setCategory] = useState([])
    const [selectedUid, setSelectedUid] = useState(null);
    const [showModel, setShowModel] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [newAddress, setNewAddress] = useState(addressData.city);
    const [message, setMessage] = useState('');
    const [noServicesAvailable, setNoServicesAvailable] = useState(false);
    const [serviceType, setServiceType] = useState([])
    const [mostBooked, setMostBooked] = useState([])
    

    const useFocused = useIsFocused()

    const imageData = [
        { id: '1', videoUri: require('../Images/repairing.mp4') },
        { id: '2', videoUri: require('../Images/rec.mp4') },
        { id: '3', videoUri: require('../Images/repairing.mp4') },
    ];

    const handleAddressChange = useCallback(() => {
        if (!newAddress.trim()) {
            setMessage('Enter Address');
            setTimeout(() => {
                setMessage('');
            }, 2000);
            return;
        }
        setModalVisible(false);
        // Here you can perform any further action with the newAddress, such as updating it in the backend
    }, [newAddress]);

    const handleItemPress = ((uid) => {
        setSelectedUid(uid);
        setShowModel(true)
    })

    const closeModel = () => {
        setShowModel(false);
        if (!newAddress) {
            setNewAddress(addressData.city);
        }
    };

    const handleCategory = () => {
        setLoading(true);
        axios.get(`${baseUrl}/api/show-category/?address=${newAddress}`)
            .then((res) => {

                if (res.data.category.length === 0) {
                    setNoServicesAvailable(true);
                } else {
                    setCategory(res.data.category);
                    setServiceType(res.data.service)
                    setMostBooked(res.data.most_book_service)
                    setNoServicesAvailable(false);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    // let [fontsLoad] = useFonts({
    //     OpenSans_400Regular,
    //     OpenSans_600SemiBold
    // });


    useEffect(() => {
        async function prepare() {
            try {
                // Hide the default splash screen
                await SplashScreen.preventAutoHideAsync();

                // Perform any other initializations or tasks you need
                // ...

                // Simulate a delay (e.g., loading fonts, fetching data)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Once everything is ready, you can hide the custom splash screen
                SplashScreen.hideAsync();
            } catch (e) {
                console.warn(e); // Handle error appropriately
            }
        }
        handleCategory();
        setShowModel(false);


        // Run the prepare function
        prepare();

        // Load fonts and call other functions after it finishes
    }, [useFocused, newAddress]);


    const renderTextGroups = () => {
        const itemsPerRow = 3;
        const rows = Math.ceil(category.length / itemsPerRow);
        return Array.from({ length: rows }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
                {category.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow).map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <TouchableOpacity onPress={() => handleItemPress(item.uid)}>
                            <View style={{ display: "flex", alignItems: "center" }}>
                                <Image src={`${baseUrl}/${item.category_image}`} style={styles.image} />
                            </View>
                            <Text style={styles.servicetext}>{item.category_name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        ));
    };

    // if (!fontsLoad) {
    //     // Show AppLoading while fonts are loading
    //     return <ActivityIndicator size="large" color="red" />;
    // }

    // const renderVideoItem = ({ item,index}) => (
    //     <View style={styles.videoWrapper}>
    //         <Video
    //             source={item.videoUri}
    //             style={styles.video}
    //             resizeMode="cover"
    //             repeat
    //             paused={false}
    //             onLoad={() => {
    //                 // Ensure the video starts playing
    //                 if (videoRefs.current[index]) {
    //                     videoRefs.current[index].seek(0);
    //                 }
    //             }}
    //             ref={(ref) => {
    //                 videoRefs.current[index] = ref;
    //             }}
    //         />
    //     </View>
    // );

    // const videoRefs = useRef([]);

    // useEffect(() => {
    //     // Ensure all videos are playing
    //     videoRefs.current.forEach(ref => {
    //         if (ref) {
    //             ref.seek(0);
    //         }
    //     });
    // }, []);

   

    return (
        <View style={styles.container}>
            <ScrollView>
                <Header showCart={true} />
                <View style={{ backgroundColor: "#fff" }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={{ flexDirection: 'row', alignItems: "center", paddingHorizontal: 25, gap: 10 }}>
                            <Image source={require('../Images/location-pin.png')} style={{ height: 20, width: 20 }} />
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: "500", color: '#454545',fontFamily: 'Segoe UI Bold' }}>{newAddress}</Text>
                            </View>
                            <Image source={require('../Images/down-arrow.png')} style={{ width: 20, height: 20 }} />
                        </View>
                    </TouchableOpacity>

                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setModalVisible(false);
                            if (!newAddress) {
                                setNewAddress(addressData.city);
                            }
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: "80%", height: 200, position: 'relative' }}>
                                <TouchableOpacity
                                    style={{ position: 'absolute', top: 10, right: 10 }}
                                    onPress={() => {
                                        setModalVisible(false);
                                        if (!newAddress) {
                                            setNewAddress(addressData.city);
                                        }
                                    }}
                                >
                                    <Ionicons name="close" size={24} color="red" />
                                </TouchableOpacity>
                                {message && (
                                    <Text style={{ color: 'red', fontSize: 16, alignSelf: 'center',fontFamily: 'Segoe UI Bold' }}>{message}</Text>
                                )}
                                <TextInput
                                    placeholder="Enter new address"
                                    value={newAddress}
                                    onChangeText={setNewAddress}
                                    style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'grey', color: "black", marginTop: 30,fontFamily: 'Segoe UI Bold',fontSize:20 }}
                                />
                                <Button title="Update City" onPress={() => handleAddressChange(newAddress)} />
                            </View>
                        </View>
                    </Modal>


                    {/* Search component */}
                    <Search address={newAddress} />

                    {/* Service Container Start  */}
                    <View style={styles.serviceContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="red" />
                        ) : noServicesAvailable ? (
                            <Text style={{ fontSize: 18, fontWeight: "500", color: "red", alignSelf: "center" }}>No services available in this city.</Text>
                        ) : (
                            renderTextGroups()
                        )}

                        {
                            showModel && (
                                <ServiceModel visible={showModel} closeModel={closeModel} selectedUid={selectedUid} />
                            )
                        }
                    </View>

                </View>

                {/* Slider Services Start */}
                {/* <View style={{ backgroundColor: "#fff", marginTop: 10 }}> */}
                {/* <SliderImage /> */}
                {/* </View> */}

                {/* <FlatList
                    data={imageData}
                    keyExtractor={item => item.id}
                    renderItem={renderVideoItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={imageData.length}  // Ensures all videos are rendered
                /> */}

                {/* Most Booked service start */}
                <View style={styles.gapDesign}>
                    <MostBookedService service={mostBooked} />
                </View>

                <View style={styles.gapDesign}>
                    {
                        <FlatList
                            data={serviceType}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <RepairService
                                            title={item.service_name}
                                            serviceProduct={item.service_product}
                                            
                                        />
                                    </View>
                                )
                            }}
                        />
                    }
                </View>

                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" />
            </ScrollView>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        width: '30%',
        backgroundColor: "#f5f5f5",
        padding: 5,
        borderRadius: 3,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 50,
        objectFit: "contain"
    },
    servicetext: {
        fontFamily: 'Segoe UI',
        textAlign: "center",
        color: 'black',
        fontSize:18,
    },
    gapDesign: {
        backgroundColor: "#fff",
        marginTop: 10,
        padding: 10
    },
    serviceContainer: {
        marginTop: 10,
        padding: 10,
    },
    videoWrapper: {
        width: 140,
        height: 240,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        overflow: 'hidden', // This is crucial for borderRadius to work on the wrapper
        marginTop: 20,

    },
    video: {
        width: '100%',
        height: '100%',
    },
})

