import { StyleSheet, Dimensions} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({

  // Header styles
  header: {
    width:width(100),
    zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: width(75),
    height: 65
  },
  checkPointsTextInput: {
    fontSize: Fonts.size.mediump,
    paddingTop:2,
    height:50
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
  },
  checkPointsTextInputLabel: {
    fontSize: Fonts.size.mediump,
    paddingTop: 0,
    marginTop: 0,
  },
  headingText:{
    fontSize: 23,
    color: '#fff',
    textAlign: 'center'
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: width(10),
    height: 65,
    justifyContent: 'center', 
    alignItems:'center',
    // left:15
  },
  headerDiv:{
    width:width(15),
    height: 65,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightHeader: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems:'center',
    //right: 10,
    //height: 80,
    paddingRight: 10
  },
  backgroundImage: {
    resizeMode:'stretch',
    width:width(30),
    height: 80,
    zIndex: 0
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },  
  auditCheckPointsBody: {
    flex: 1,
    zIndex: 20000,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf:'stretch'
  },
  checkpointCard: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems:'center', 
    padding: 5
  },
  separatorSection: {
    flexDirection: 'column', 
    alignItems: 'center', 
    width: width(1), 
    //height: 80, 
    backgroundColor: 'transparent',
    marginTop: 10
  },
  CheckPointBox:{
    width: Window.width,
    //height: null,
    flexDirection: 'column',
    backgroundColor:'transparent'
  },
  quesText:{
    fontSize: Fonts.size.mediump,
    color: 'black',
    fontFamily: Fonts.type.base,
    paddingLeft:5,
    // backgroundColor:'yellow',
  },
  quesBox:{
    //left: Window.width/5,
    paddingRight: 20,
    flexDirection:'row',
    justifyContent:'space-between',
    width:'95%'

  },
  radioBox:{
    //left: Window.width/5,
    //top:height(3)
  },
  commentBox:{
    //width:width(100),
    backgroundColor: 'white',
    flexDirection: 'column',
    elevation: 5,
    borderRadius: 5,
    borderWidth:0.5,
    borderColor:'lightgrey',
    margin: 10,
    padding: 10
  },
  boxsecRadio:{
    width:'98%',
    height: null,
    backgroundColor:'transparent',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'row',
    paddingLeft: 10,
    justifyContent:'space-between',
    paddingTop:10
  },
  boxsecImageDisplay:{
    width:'95%',
    height: null,
    backgroundColor:'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10
  },
  boxsec1:{
    width:'98%',
    height: null,
    backgroundColor:'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 10
  },
  boxsecNone:{
    // width:'98%',
    // height: null,
    // backgroundColor:'yellow',
    // borderBottomColor: 'lightgrey',
    // borderBottomWidth: 0.5,
    // flexDirection: 'column',
    // paddingLeft: 10
    display:'none'
  },
  boxsecRemark:{
    width:'98%',
    height: null,
    backgroundColor:'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'row',
    paddingLeft: 5,
    // marginLeft: 5,
    justifyContent:'space-between'
  },
  attachIcon:{
    top:3,
    position: 'absolute',
    right:5,
    height:40
  },
  boxsec2:{
    width:'98%',
    height:height(6),
    flexDirection: 'column',
    // backgroundColor:'yellow',
    backgroundColor:'white'
  },
  boxsec3:{
    width:'98%',
    height:height(12),
    flexDirection: 'column',
    // backgroundColor:'orange',
    backgroundColor:'white',
  },
  scoreBox:{
    position: 'absolute',
    top:height(2),
    left: 8
  },
  scoreText:{
    top:height(0),
    left: 25,
    width: width(75)
  },
  ncofi:{
    position: 'absolute',
    //top:height(2),
    right:0,
    //width: 100,
    padding: 10,
    backgroundColor: '#00BFFF',
    borderRadius: 20,
    bottom:0 
  },
  headerBar:{
    flexDirection: 'column',
    width:Window.width,
    height:height(9),
    position:'absolute'
  },
  optionSec:{
    flexDirection: 'column',
    right:0,
    top:height(4),
  },
  footerDiv:{
    //flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:width(100),
    height:65,
    //top:height(1),
    position:'absolute',
    //resizeMode:'cover',
  },
  footer:{
    //flex:1,
    //position : 'absolute',
    bottom:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:width(100),
    backgroundColor:'transparent',
    height: 65,
    zIndex: 3000
  },
  LPAsec1:{
    //width:'100%',
    //height:'40%',
    // backgroundColor:'white'
    backgroundColor:'transparent',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
  },
  LPAsec1Label:{
    //width:'100%',
    //height:'40%',
    // backgroundColor:'white'
    backgroundColor:'transparent',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
    paddingTop: 0,
    marginTop: 0
  },
  LPAsec2:{
    //width:'100%',
    //height:'60%',
    // backgroundColor:'grey'
    backgroundColor:'white',
    borderBottomColor: 'lightgrey',
    borderTopWidth: 0.5
  },
  noRecordsFound: {
    width: width(100),
    textAlign: 'center',
    marginTop: 45,
    fontSize: Fonts.size.h5,
    paddingTop: 40,
    color: 'grey'
  },
  // Modal styles
  ncModalBg: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%',
    height: '100%',
    backgroundColor: 'black'    
  },
  ncModal: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '90%',
    //height: '40%',
    backgroundColor: 'white',
    borderRadius: 10,    
    margin: 10,
    padding: 10,
    elevation: 8,
    borderColor: 'lightgrey',
    borderWidth: 0.5
  },
  modalOuterBox: {
    backgroundColor: 'rgba(0,0,0,0.8)', 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center',
    alignItems: 'center', 
    margin: 0, 
    top: 0, 
    left: 0
  },
  ModalBox:{
    width:width(90),
    height:height(50),
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column',
    top:height(40)
  },
  modalheader:{
    width:width(90),
    height:height(8),
    backgroundColor:'transparent',
    top:10,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  modalbody:{
    width:width(90),
    height:height(42),
    backgroundColor:'white',
    padding: 20
  },
  sectionTop:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    padding: 10    
  },
  sectionBtn:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    padding: 10    
  },
  modalheading:{
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor:'transparent',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    justifyContent:'center',
    alignItems:'center',
    padding: 20
  },
  sectionTopCancel:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10    
  },
  sectionBottom:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10     
  },
  sectionContent: {
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center'    
  },
  boxHeader: {
    width: '100%',
    color:'#A6A6A6', 
    fontSize: Fonts.size.small
  },
  boxContent: {
    width: '100%',
    color:'black', 
    fontSize: Fonts.size.mediump,
    textAlign: 'center',
  },
  boxContentCam: {
    //width: '100%',
    color:'#485B9E', 
    fontSize: Fonts.size.mediump,
    // textAlign: 'center',
    // paddingLeft: 20,
  },
  boxContentClose: {
    width: '100%',
    color:'#000', 
    textAlign: 'center',
    fontSize: Fonts.size.mediump,
  },
  statistics:{
    width:'100%',
    height:50,
    backgroundColor:'white',
    flexDirection:'row',
    borderBottomWidth: 0.8,
    borderBottomColor: 'lightgrey'
  },
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

  modalavatar:{
    flex:1,
    width: width(90),
    justifyContent:'center',
    alignContent:'center',
    paddingTop: 20,
    margin: 20
  },
  modelImage: {
    width:'100%', 
    height: '80%', 
    resizeMode: 'contain',
    justifyContent:'center',
    alignContent:'center'
  },

})
