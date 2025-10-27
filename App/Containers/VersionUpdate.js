
import React, { Component } from 'react';
import { View, Text, StyleSheet,Button } from 'react-native';



const VersionUpdate = () => {
    return (
        <View style={styles.container}>
            <Text>{"Please Update your application to continue"}</Text>
            <Button onPress={()=>{
               title="Get Latest Version"
               color="#841584"
            }}/>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});


export default VersionUpdate;
