import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button } from 'react-native'
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function Search({ route, address }) {
  const [searchText, setSearchText] = useState([])
  const navigation = useNavigation()

  const handleSearch = (async () => {
    if (searchText === '') {
      alert("Search Product")
      return;
    }
    navigation.navigate("SearchView", { searchText: searchText, address: address });
  })

  return (
    <View>
      <View style={styles.searchContainer}>
        <View style={styles.search}>
          <Image source={require('./Images/search.png')} style={{ width: 20, height: 20 }} />
          <TextInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            style={styles.input}
            placeholder='Search for Services'
            placeholderTextColor="#999"
          />
        </View>
        <View style={{ flex: 1, paddingHorizontal:10, justifyContent: 'center',  alignItems: 'center' }}>
          <TouchableOpacity onPress={handleSearch} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: '70%',
    elevation: 3,
  },

  input: {
    flex: 1,
    padding: 8,
    color:"black"
  },
})