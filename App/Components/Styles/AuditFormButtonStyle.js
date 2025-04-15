import { StyleSheet, Dimensions} from 'react-native'
let Window = Dimensions.get('window')

export default StyleSheet.create({
  container:{
    backgroundColor:'white',
    width: Window.width,
    height:150,
    justifyContent: 'center',
    alignItems: 'center',
  }
})