import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from './Header'


const AboutCx = () => {
    return (
        <ScrollView style={{ flex: 1,backgroundColor:"white"}}>
            <Header showBackButton={true} />
            <View style={{ alignItems: "center", padding: 10 }}>
                <Text style={styles.text}>Who we are</Text>
                <View style={{ paddingVertical: 10 }}>
                    <Text style={{ fontSize: 16, color: "black",fontSize:18 }}>
                        At CasaXprt, we're your go-to for home services. From beauty treatments to plumbing, our platform connects you with skilled professionals who deliver quality service right to your door. With us, you can enjoy convenience and reliability, scheduling appointments at your convenience. We work closely with our service partners, providing them with technology, training, and support to ensure they meet our high standards. Our vision is to empower professionals globally to offer exceptional home services, making life easier for millions. Join us and experience home services like never before.

                        But we're more than just a service provider. CasaXprt is committed to maintaining high standards of quality and professionalism. We achieve this by working closely with our hand-picked service partners, equipping them with cutting-edge technology, comprehensive training, and ongoing support. Our goal is not just to deliver services but to deliver an unmatched experience, according  to your needs and preferences.
                        Our vision extends beyond just our platform. We aim to empower professionals worldwide, enabling them to excel in their craft and provide exceptional services at home. By leveraging technology, training, and support, we strive to revolutionize the way home services are delivered, making life easier and more convenient for millions around the globe. Join us in shaping the future of home services and experience the CasaXprt difference today.

                    </Text>
                </View>

            </View>
            <View>

            </View>
        </ScrollView>
    )
}

export default AboutCx

const styles = StyleSheet.create({
    text: {
        color: 'black',
        fontSize: 23
    }
})