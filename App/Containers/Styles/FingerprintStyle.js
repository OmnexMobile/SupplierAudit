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
    position: 'absolute',
    left: 20,
    top:height(5),
    backgroundColor:'transparent',
    width:width(15),
    height:height(6)
  },
  backgroundImage: {
    resizeMode:'stretch',
    width: '100%',
    height: '100%',
  },
  FieldContainer:{
    position: 'absolute',
    flexDirection: 'column',
    paddingTop : 170,
  },
  userField:{
    width: width(95),
    height: height(7),
  },
  pwdField:{
    marginTop: 40,
    width: width(90),
    height: height(7),
  },
  LoginDiv:{
    width: Window.width ,
    position: 'absolute',
    padding:10,
    top:height(45),
    // backgroundColor: 'black'
  },
  usrDiv:{
    position:'absolute',
    marginLeft: width(85),
    top: height(2),
  },
  usrImg:{
    width:25,// make responsive
    height:25,
    right:0
  },
  pwdDiv:{
    position:'absolute',
    marginLeft: width(85),
    top: height(2),
  },
  pwdImg:{
    width:21,// make responsive
    height:25,
    right:0
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
  LoginBtn:{
    alignItems: 'center'
  },
  logoDiv:{
    position: 'absolute',
    top: height(5),
  },
  logoPosition:{
    height:Window.height/1.75,
    width:Window.width
  },
  body:{
    width:Window.width,
    height:height(30),
    backgroundColor:'transparent'
  },
  inputBox1:{
    // width: '100%',
    //height:height(9),
    backgroundColor:'transparent',
    // margin: 1,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  labelTitle:{
    //width:Window.width,
    height:height(4),
    backgroundColor:'transparent',
    // margin: 1,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  inputBox01:{
    width:Window.width,
    top:0,
    height:height(8),
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  inputBoxSettings:{
    width:Window.width,
    top:0,
    height:height(8),
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column'
  },
  LoginBtn01:{
    width: width(90),
    height: 50,
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 25
  },
  SettingsBtn01:{
    width:width(90),
    height:50,
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 25
  },
  settingsIcon:{
    bottom: 20,
    right: 20,
    backgroundColor:'transparent',
    position: 'absolute',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: null
  },
  LangIcon01:{
    bottom: 20,
    // left: 20,
    backgroundColor:'transparent',
    position: 'absolute',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: null,
    flexDirection:'column'
  },
  LangIcon02:{
    bottom: 28,
    left: 60,
    backgroundColor:'transparent',
    position: 'absolute',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: null,
    flexDirection:'column'
  },
  buttonText: {
    textAlign: 'center',
    //margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: Fonts.size.input
  },
  AuditlogoDiv:{
    width:Window.width,
    height:null,
    bottom:height(15),
    backgroundColor:'transparent',
    justifyContent:'center',
    alignItems:'center'
    }

})
