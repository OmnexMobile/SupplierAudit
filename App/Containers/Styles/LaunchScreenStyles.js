import { StyleSheet, Dimensions} from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'
import Fonts from '../../Themes/Fonts'
import { width, height } from 'react-native-dimension'

let CIRCLE_RADIUS = 45
let Window = Dimensions.get('window')

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  heading: {
    color: '#ffffff',
    marginLeft: 80,
    fontSize: 30,
    fontStyle: 'italic'
  },
  loginHead: {
    flex: 1,
    paddingBottom: 450
  },
  subHead: {
    top: 100,
    marginLeft: 130
  },
  subHeadText: {
    color: '#ff6347',
    fontSize: 35
  },
  devBtn: {
    flex: 1
  },
  inputDiv: {
    bottom: 50
  },
  /** draggable styles starts from here **/
  backgroundImage: {
    resizeMode:'stretch',
    width: '100%',
    height: '100%',
  },

  mainContainer: {
    flex: 1,
    backgroundColor:'white'
  },
  /* dropzone styling */
  dropZone: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'column',
    top: Window.height/3.5,
    right: 0,
    width:width(35)
  },
  LockView:{
    backgroundColor: 'transparent',
  },
  /* draggable zone */
  draggableContainer: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'column',
    top: Window.height/3.5,
    left: 55,
    zIndex:1000
  },
  draggableContainerTab: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'column',
    top: Window.height/3.5,
    left: Window.width/4.5,
    zIndex:1000
  },
  logoView:{

  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff'
  },
  circle: {
    backgroundColor: 'transparent',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
  textnote:{
    alignItems: 'center',
    top: 400
  },
  textFont:{
    fontSize: Fonts.size.regular
  },
  logoDiv:{
    position: 'absolute',
    bottom: 0,
  },
  logoPosition:{
    height:Window.height/1.75,
    width:Window.width,
  },
  logoPosition01:{
    height:Window.height/1.3,
    width:Window.width,
    top:100
  },
  OmnexlogoDiv:{
    position: 'absolute',
    width:Window.width,
    height:120,
    alignItems: 'center',
    justifyContent: 'center',
    top:height(5)
  },
  Omnex:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  Omnex00:{
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingBottom:30,
    width:'45%'
  },
  Omnex01:{
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingBottom:30,
    width:'55%'
  },
  msgbox:{
    width:Window.width,
    position:'absolute',
    bottom:0,
    // right: 3,
    flexDirection:'row',
    backgroundColor:'transparent',
    justifyContent:'space-around'
  },
  textMsg1:{


  },
  textFont1:{
    fontSize: Fonts.size.medium,
    color: '#606161',
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 5,
    paddingBottom: 2
  },
  textMsg2:{

  },
  textFont2:{
    fontSize: Fonts.size.medium,
    fontWeight: 'bold',
    color: '#73B52D',
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 5,
    paddingBottom: 2
  },
  textMsg3:{


  },
  textFont3: {
    fontSize: Fonts.size.medium,
    //marginLeft: Window.width/1.5,
    color: '#606161',
    //width:260,
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 5,
    paddingBottom: 2,
    fontFamily:'OpenSans-Regular'
  },
  hint1Div:{
    position:'absolute',
    width:Window.width,
    top: height(25),
    backgroundColor: 'transparent'
  },
  hint1Text: {
    color: '#606161',
    textAlign: 'center',
    alignSelf: 'stretch',
    fontFamily:'OpenSans-Regular'
  },
  hint2Text: {
    color: '#606161',
    textAlign: 'center',
    alignSelf: 'stretch',
    fontFamily:'OpenSans-Regular'
  },
  swipeLogo:{
    position:'absolute',
    width:Window.width,
    alignItems: 'center',
    justifyContent: 'center',
    top:height(32),
    backgroundColor: 'transparent'
  }
})
