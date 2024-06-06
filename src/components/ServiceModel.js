import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseUrl } from './Constant';
import { useNavigation } from '@react-navigation/native';

const ServiceModel = ({ showModel, closeModel, selectedUid, }) => {
    const [subCategory, setSubCategory] = useState([])
    const [categoryName, setCategoryName] = useState('')

    const navigation = useNavigation();
    const uid = selectedUid;
    console.log(uid)

    const handleSubCategoryService = (uid, category) => {
        navigation.navigate('ServicePart', { uid: uid, category: category, });
    }

    const handleSubCategory = async () => {
        axios.get(`${baseUrl}/api/show-subcategory/${uid}`)
            .then((res) => {
                console.log(res.data.subcategory[0].subcategory_image)
                setSubCategory(res.data.subcategory)
                setCategoryName(res.data.subcategory[0].category)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        handleSubCategory();
    }, []);

    return (
        <View>
            <Modal transparent={true} visible={showModel} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModel}>
                            <Image source={require('./Images/close.png')} style={{ width: 20, height: 20, marginLeft: 10, marginTop: 10 }} />
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 20, }}>
                            <Text style={{ fontSize: 24, fontWeight: 500 }}>{categoryName}</Text>
                        </View>
                        <View style={styles.horizontalLine} />

                        <FlatList
                            data={subCategory}
                            keyExtractor={(item, index) => item.uid}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={styles.imageRow}>
                                        <TouchableOpacity style={{}} onPress={() => handleSubCategoryService(item.uid, item.category)}>
                                            <View style={{ width: 90, }}>
                                                <Image source={{ uri: `${baseUrl}/${item.subcategory_image}` }} style={styles.demoImage} />
                                                <Text style={styles.textsubcategory}>{item.category_name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                            numColumns={3}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ServiceModel;

const styles = StyleSheet.create({
    btn: {
        padding: 10,
        backgroundColor: "yellow",
        borderRadius: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',

    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

    },
    closeButton: {
        position: 'absolute',
        top: -55,
        right: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    imageRow: {
        marginHorizontal: 10,
        marginBottom: 20,
    },
    demoImage: {
        width: 50,
        height: 50,
        alignSelf: "center"
    },
    textsubcategory: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: "center",
        color:"black",
    },
    horizontalLine: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
})