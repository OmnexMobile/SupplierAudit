import React, { Component } from 'react'
import { View ,StyleSheet,Image, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native'
import PropTypes from 'prop-types';
import { width, height } from 'react-native-dimension';
import ResponsiveImage from 'react-native-responsive-image';
import Fonts from '../../Themes/Fonts'
import Icon from 'react-native-vector-icons/FontAwesome';


import { Images } from '../../Themes/index'

//00c3ea

export default class InputField extends Component{

  render() {
    // console.log('Type',this.props.type)

    return (
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor='#A7A9A4'
          // underlineColorAndroid="transparent"
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
        {this.props.type === 'Username' ?
          <TouchableOpacity style={{position:'absolute',right:40,top:height(1.5)}}>
            {/* <ResponsiveImage source={Images.usrLogo} initWidth="30" initHeight="30" /> */}
            <Icon  name="user" size={30} color="#00C3EA"/>
          </TouchableOpacity>
        : (this.props.type === 'Password') ?
          <TouchableOpacity style={{position:'absolute',right:40,top:height(1.5)}}>
            {/* <ResponsiveImage source={Images.pwdLogo} initWidth="30" initHeight="30" /> */}
            <Icon  name="lock" size={30} color="#00C3EA"/>
          </TouchableOpacity>
          :
          null
        }
      </View>
    );
  }
}

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
  type: PropTypes.string
};

const styles = StyleSheet.create({
  input: {
  //  backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //backgroundColor:'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginLeft:20,
    marginRight:20,
    alignItems: 'center',
    fontSize: Fonts.size.input,
    borderWidth:1,
    borderColor:'#c7c7c7',
    fontFamily:'OpenSans-Regular'
    // left:0
  },
  inputWrapper: {
    // flex: 1,
    paddingBottom: 10,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: width(22),
    height: height(7),
    left: 35,
    top: 9,
  },
});
