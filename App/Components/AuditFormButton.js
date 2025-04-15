import React, { Component } from 'react'
import {View, Text, Image, FlatList, TouchableOpacity, Dimensions, ImageBackground , ScrollView} from 'react-native'
import { Images }from '../Themes/index'
import styles from './Styles/AuditFormButtonStyle'


export default class AuditFormButton extends Component{
  render(){
    return(
      <View style={styles.container}>
        <Image source={Images.AuditFormButton}/>
        <Text style={{color:'#2fcf8f' , fontWeight: 'bold' }}>Audit form</Text>
      </View>
    );
  }

}
