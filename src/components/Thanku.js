import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const Thanku = ({navigation}) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image source={require('./Images/checkmark.png')} style={styles.image} />
                <Text style={styles.thtext}>Thanku You</Text>
            </View>
            
            <TouchableOpacity style={styles.button}
            onPress={()=>{navigation.navigate('Home')}}
            >
                <Text style={styles.btntext}>GO TO HOME</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Thanku

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'lightgreen',
        width: 300,
        height: 300
    },
    image: {
        width: 100,
        height: 100,
    },
    thtext: {
        fontSize: 34,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 15,
        color:'white'
    },
    button: {
        backgroundColor: 'green', // Blue color
        paddingVertical: 15,
        paddingHorizontal: '25%',
        borderRadius: 5,
        marginTop:15,
      },
      btntext: {
        color: '#FFFFFF', // White color
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },

})
