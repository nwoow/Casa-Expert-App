import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
// import * as SplashScreen from 'expo-splash-screen';
// import { useFonts, Cantarell_400Regular } from '@expo-google-fonts/cantarell'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from './Constant';

const EditProfile = ({ navigation, route }) => {
  const { phone_number, fullName, email } = route.params;
  console.log(email)
  const [updateName, setUpdateName] = useState(fullName);
  const [emailUpdate, setEmailUpdate] = useState(email);
  const [message, setMessage] = useState('')

  // let [fontsLoad] = useFonts({
  //   Cantarell_400Regular,
  // });

  const ProfileUpdate = (async () => {
    const full_name = updateName;
    const email = emailUpdate;
    console.log(email)
    const token = await AsyncStorage.getItem('token')
    await axios.post(`${baseUrl}/api/updateprofile/`, { full_name, email }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        console.log(res.data)
        if (res.data.status === 200) {
          setMessage(res.data.message)
          setTimeout(() => {
            setMessage('')
          }, 2000)
        } else if (res.data.status === 400) {
          setMessage(res.data.message)
          setTimeout(() => {
            setMessage('')
          }, 2000)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  })

  // const GetProfile = (async () => {
  //   const token = await AsyncStorage.getItem('token')
  //   console.log(token)
  //   await axios.get(`${baseUrl}/api/updateprofile/`, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res.data.email)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // })

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Hide the default splash screen
  //       await SplashScreen.preventAutoHideAsync();

  //       // Perform any other initializations or tasks you need
  //       // ...

  //       // Simulate a delay (e.g., loading fonts, fetching data)
  //       await new Promise(resolve => setTimeout(resolve, 2000));

  //       // Once everything is ready, you can hide the custom splash screen
  //       SplashScreen.hideAsync();
  //     } catch (e) {
  //       console.warn(e); // Handle error appropriately
  //     }
  //   }
  //   prepare();

  // }, []);

  // if (!fontsLoad) {
  //   // Show AppLoading while fonts are loading
  //   return null;
  // }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", padding: 20, gap: 50, alignItems: "center", backgroundColor: "black" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backImg} source={require('./Images/arrow.png')} />
        </TouchableOpacity>
        <Text style={styles.editText}>Edit Profile Screen</Text>
      </View>

      <View style={styles.editContainer}>
        <Text style={styles.textColor}>Full Name</Text>
        <TextInput style={styles.textInput}
          value={updateName}
          onChangeText={text => setUpdateName(text)}
        />

        <Text style={styles.textColor}>Email Address</Text>
        <TextInput style={styles.textInput}
          value={emailUpdate}
          onChangeText={text => setEmailUpdate(text)}
        />
        <Text style={styles.textColor}>Phone Number</Text>
        <TextInput style={styles.textInput} value={`+91-${phone_number}`} />

        {message && (
          <View style={{ alignSelf: "center" }}>
            <Text style={{ color: "red", fontFamily: 'Cantarell_400Regular', fontSize: 18 }}>{message}</Text>
          </View>
        )}


        <View style={{ marginTop: 15 }}>
          <TouchableOpacity style={styles.btnUpdate}
            onPress={ProfileUpdate}
          >
            <Text style={styles.btnText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  editText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'white',
    fontFamily: 'Cantarell_400Regular',
  },
  backImg: {
    tintColor: "white",
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  editContainer: {
    padding: 30
  },
  textInput: {
    marginTop: 5,
    borderBottomWidth: 0.9,
    borderColor: "silver",
    marginBottom: 15,
    fontWeight: '500',
    fontFamily: 'Cantarell_400Regular',
    color:"black"
  },
  textColor: {
    color: 'grey',
    fontWeight: '500',
    fontSize: 14,
  },
  btnUpdate: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 15,
  },
  btnText: {
    color: "white",
    fontWeight: '500',
    alignSelf: "center"
  }
});
