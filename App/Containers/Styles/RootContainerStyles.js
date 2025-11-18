import {StyleSheet} from 'react-native'
import {Fonts, Metrics, Colors} from '../../Themes/'
import { AndroidInsets, android15HeaderPadding,android15FooterPadding } from '../../Themes/AndroidInsets'
export default StyleSheet.create({
  applicationView: {
    flex: 1,
  paddingTop: android15HeaderPadding,
},
  applicationViewIos: {
    flex: 1,
    backgroundColor:'#000'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin
  },
  myImage: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  }
})
