import { StyleSheet, Dimensions} from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes'
import { width, height } from 'react-native-dimension';
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  fillcontainer:{
    flex: 1,
  },
  mainContainer:{
    backgroundColor:'#fff',
    flex: 1,
    width:Window.width,
    height:Window.height
  },
  headingText:{
    paddingTop: 20,
    fontSize: Fonts.size.h4,
    fontFamily : Fonts.type.base,
    color: '#1d1d1d',
  },
  titleText:{
    fontSize: Fonts.size.regular,
    fontFamily : Fonts.type.base,
    color: '#A6A6A6',
    width: '100%',
    textAlign: 'left',
    paddingLeft: 30,
    width: '95%'
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: width(15),
    height: 65,
    top:30,
    justifyContent: 'center', 
    alignItems:'center',
    zIndex:1000,
  },
  loginOmnexlogoDiv:{
    position: 'absolute',
    width:Window.width,
    height:height(22),
    alignItems: 'center',
    justifyContent: 'center',
    top:height(8),
    backgroundColor: 'transparent'
  },
  loginOmnexlogoDiv2:{
    position: 'absolute',
    width:Window.width,
    height:height(40),
    // alignItems: 'center',
    justifyContent: 'center',
    top:height(25),
    backgroundColor: 'transparent',
    flexDirection: 'column',

  },
  loginOmnexlogo:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    resizeMode:'stretch',
    width: '100%',
    height: '100%',
  },
  body:{
    position:'absolute',
    width:Window.width,
    height:height(40),
    backgroundColor:'transparent',
    marginTop:height(30),
    justifyContent:'center',
    alignItems:'center'
    },
    cont1:{
      width:width(90),
      height:300,
      backgroundColor:'transparent',
      flexDirection:'column'
  },
  cont2:{
    width:'100%',
    height:50,
    backgroundColor:'transparent',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:10
},
cont002:{
  width:'100%',
  height:50,
  backgroundColor:'transparent',
  flexDirection:'row',
  justifyContent:'space-between',
  marginTop:20
},
cont02:{
  width:'100%',
  height:70,
  backgroundColor:'transparent',
  flexDirection:'column',
  justifyContent:'space-between',
  paddingBottom:20
}

})
