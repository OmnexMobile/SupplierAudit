import { StyleSheet, Dimensions} from 'react-native'
import { width } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  statCard1:{
    width:'33.3%',
    flex:1,
    height:'100%',
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  statCard2:{
    width:'33.3%',
    flex:1,
    height:'100%',
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderLeftWidth: 0.8,
    borderLeftColor: 'lightgray'
  },
  statCard3:{
    width:'33.3%',
    flex:1,
    height:'100%',
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderLeftWidth: 0.8,
    borderLeftColor: 'lightgray'
  },
  statistics:{
    width:'100%',
    height:50,
    backgroundColor:'white',
    flexDirection:'row',
    borderBottomWidth: 0.8,
    borderBottomColor: 'lightgrey'
  },
  // Header styles
  header: {
    width:'100%',
   // zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    justifyContent: 'flex-start',
    alignContent:'center',
    height: 65,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  heading:{
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems:'center', 
    width: '70%',
    height: 65
  },
  headingText:{
    fontSize: Fonts.size.h6,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: width(10),
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
  },
  headerDiv:{
    width:'15%',
    height: 65,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightHeader: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems:'center',
    right: 10,
    height: 80
  },
  backgroundImage: {
    resizeMode:'stretch',
    width:width(30),
    height: 80,
    zIndex: 0
  },

  // Body styles
  auditPageBody: {
    flex: 1,
    zIndex: 10,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf:'stretch'
  },
  scrollViewBody: {
    height:'100%', 
    backgroundColor: 'transparent' 
  },
  cardBox:{
    //backgroundColor:'white',
    margin: 8,
    elevation: 2,
    flexDirection:'row',
    borderRadius: 5,
    padding: 10,
    //flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'transparent',
    //borderWidth:0.5,
    borderTopColor:'lightgrey',
    borderTopWidth: 0.5,
    borderBottomColor:'lightgrey',
    borderBottomWidth: 0.5,
    borderRightColor:'lightgrey',
    borderRightWidth: 0.5,
    //backgroundColor: 'transparent',
    //borderWidth: 0.1,
    //borderColor: 'lightgrey'
  },
  parentcardBox:{
    width:'100%',
    height:60,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',

  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  CheckListBox:{
    width:Window.width/2,
    //backgroundColor: 'black',
    height:200,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checktext:{
    color: '#ffffff',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.regular
  },
  checkDiv2:{
    //width:width(90),
    borderLeftWidth: 4,
    borderLeftColor : '#00a2e5',
    backgroundColor:'white'
  },
  checkDiv21:{
    //width:width(90),
    borderLeftWidth: 4,
    borderLeftColor : '#ff9772',
    backgroundColor:'white'    

  },
  checkLogo01:{
    //width:'20%',
    paddingLeft: 10,
    paddingRight: 15
  },
  checkText01:{
    // width:'90%',
    padding: 10
  },
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: Fonts.size.regular,
    textAlign: 'center',
    margin: 10,
    marginBottom: 10,
    marginTop: 20,
    fontFamily:'OpenSans-Regular',
    fontWeight: 'bold',

  },
  speechSamples: {
    width: '90%', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    backgroundColor:'white',
    margin: 10,
    elevation: 3,
    borderRadius: 5,
    padding: 10,
    borderWidth:0.5,
    borderColor:'lightgrey'
  },
  speechTextBlock: {
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    width: '90%',
    backgroundColor:'white',
    margin: 10,
    elevation: 3,
    borderRadius: 5,
    padding: 10,
    borderWidth:0.5,
    borderColor:'lightgrey'
  },
  speechTextHead: {
    fontSize: Fonts.size.medium, 
    color: '#333'
  },
  speechText: {
    fontSize: Fonts.size.regular, 
    color: 'green',
    paddingTop: 5,
    paddingBottom: 5
  },
  questionHead: {
    fontSize: 18,
    textAlign: 'left',
    width: '90%',
    padding: 5,
    // fontWeight:'bold',
    fontFamily:'OpenSans-SemiBold',
    color:'black',
  },
  questions: {
    fontSize: Fonts.size.medium,
    textAlign: 'left',
    width: '90%',
    padding: 5,
    fontFamily:'OpenSans-Regular'
    
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
    marginTop: 10,
    fontFamily:'OpenSans-Regular'
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  VoiceRecognition:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    // alignItems:'center',
    // justifyContent:'center',
    width:80,
    height:80,
    backgroundColor:'white',
    borderRadius:100,
    zIndex:1000,
    elevation:15,
    justifyContent:'center',
    alignItems:'center'
  },
  roundView:{
    width:35,
    height:35,
    borderRadius:35,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:"center"
  },
  roundViewLG3:{
    width:35,
    height:35,
    borderRadius:35,
    backgroundColor:'transparent',
    justifyContent:'center',
    alignItems:"center"
  },
  LG:{
    borderRadius:5,
    width:'90%',
    height:50,
    flexDirection:'row',
    },
    
  LG2:{
    borderRadius:5,
    width:'85%',
    height:50,
    flexDirection:'row',
    },
  LG3:{
    borderRadius:5,
    width:'80%',
    height:'100%',
    backgroundColor:'white',
    borderColor:'#00bec1',
    borderWidth:0.5,
    borderLeftWidth:3,
    elevation:5,
    justifyContent:'center',
    padding:10
    }



})

