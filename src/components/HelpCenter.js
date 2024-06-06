import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Header from './Header';

const HelpCenter = () => {
    return (
        <View style={styles.container}>
            <Header showBackButton={true} />
            <View style={{ padding: 20 }}>
                <Text style={styles.title}>Help Center</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flex: 1,marginVertical:20, }}>
                        <Text style={styles.description}>
                            Please get in touch and we will be happy to help you
                        </Text>
                        <Text style={styles.description}>Customer No. + 919297884500</Text>
                        <Text style={styles.description}>mail@casaxprt.com</Text>

                    </View>
                    <View>
                        <Image
                            style={styles.image}
                            source={require('./Images/customer-support.png')} // Ensure you have an image in the specified path
                        />
                    </View>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: "black",
        marginVertical:20,
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        color: "#3e4152"
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default HelpCenter;
