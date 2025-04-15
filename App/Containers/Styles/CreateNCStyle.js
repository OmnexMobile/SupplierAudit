import { StyleSheet, Dimensions,Platform} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  }, 
  // Header styles
  header: {
    width:'100%',
   // zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
   // alignItems: 'center',
   alignContent:'center',
    justifyContent: 'flex-start',
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
    width: width(15),
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
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
    right: 10,
    height: 80
  },
  backgroundImage: {
    resizeMode:'stretch',
    width:width(30),
    height: 80,
    zIndex: 0
  },

  // Footer styles
  footer:{
    bottom:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    backgroundColor:'transparent',
    height: 65,
    zIndex: 3000
  },  
  footerDiv:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:65,
    position:'absolute'
  },
  footerLoader: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%'
  },
  footerTextContent: {
    color:'white', 
    fontSize: Fonts.size.regular
  },
  footerDivContent: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
      separatorSection: {
        flexDirection: 'column', 
        alignItems: 'center', 
        width: width(1), 
        height: 140, 
        backgroundColor: 'transparent',
        marginTop: 10
      },

  inputSecond:{
    backgroundColor:'transparent',
  width:'90%',
  left:10,
  marginTop:10

  },
  inputAttach:{
      flexDirection:'row',
    // top:1,
    marginLeft: 10
  },

  boxCard1:{
    // position:'absolute',
    width:Window.width,
    height:height(9),
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxCard2:{
    width:Window.width,
    height:height(9),
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardL:{
    width:width(98),
    height:height(9),
    backgroundColor: 'white',
    borderRadius:1,
    borderLeftWidth: 4,
    borderLeftColor:'#C1EAFC',
    elevation: 10,
    marginTop:5
  },
  card0L:{
    width:width(90),
    height:height(9),
    backgroundColor: '#D6D3D3',
    borderRadius:1,
    borderLeftWidth: 4,
    borderLeftColor:'#C1EAFC',
    elevation: 10,
    marginTop:5

  },
  cardL1:{
    width:width(90),
    height:height(9),
    backgroundColor: 'white',
    borderRadius:1,
    borderLeftWidth: 4,
    borderLeftColor:'#DFFFEF',
    elevation: 10,
    marginTop:5

  },
  cardL01:{
    width:width(90),
    height:height(9),
    backgroundColor: '#D6D3D3',
    borderRadius:5,
    borderLeftWidth: 10,
    borderLeftColor:'#DFFFEF',
    elevation: 10,
  },
  input1:{
    backgroundColor:'transparent',
    width:'90%',
    top:height(3)
  },
  placeholderT1:{
    fontSize: Fonts.size.regular,
    borderBottomColor:'lightgrey',
    borderBottomWidth:0.5,
    fontFamily:'OpenSans-Regular'

  },
  placeholderT1Label:{
    fontSize: Fonts.size.regular,
    paddingTop: 5,
    borderBottomColor:'lightgrey',
    borderBottomWidth:0.5,
    width:'100%',
    paddingVertical:Platform.OS=== 'ios'?5:null,
    fontFamily:'OpenSans-Regular'
  },
  placeholderSR:{
    fontSize: Fonts.size.regular,
    width: '90%',
    fontFamily:'OpenSans-Regular'
  },
  placeholderSRLabel:{
    fontSize: Fonts.size.regular,
    paddingTop: 5,
    width: '95%',
    fontFamily:'OpenSans-Regular',
    // borderBottomColor:'lightgrey',
    // borderBottomWidth:0.5
    paddingVertical:Platform.OS=== 'ios'?5:null,
    // backgroundColor:'red'
  },
  
  input2:{
    backgroundColor:'transparent',
    width:'90%',
    left:10,
    // marginBottom:10,
    marginTop : 10
  },
  optionSec:{
      position:'absolute',
    flexDirection: 'column',
    right:0,
    top:height(4),
  },
  body:{
    position:'absolute',
    width:Window.width,
    height:'80%',
    backgroundColor:'transparent',
    top: height(11),
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:0.5
  },
  cardDiv:{
    width:width(90),
    height:'90%',
    backgroundColor:'white',
    elevation:10,

  },
  cardDiv3:{
    width:'90%',
    height:'85%',
    backgroundColor:'white',
    elevation:20,
  },
  viewOption:{
    // justifyContent:'center',
    // alignItems:'center',
    width:'100%',
    height:height(4.5),
    backgroundColor:'transparent',
    bottom:10
  },
  optionBox:{
    width:width(20),
    height:height(4.5),
    backgroundColor:'transparent',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:width(70)
  },
  ModalBox:{
    width:width(90),
    height:height(80),
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column'
  },
  modalheader:{
    width:width(90),
    height:height(9),
    backgroundColor:'transparent',
    top:10,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    
  },
  modalbody:{
    width:width(90),
    // height:height(65),
    backgroundColor:'white',
    padding: 20,
    borderTopWidth:0.5,
    borderTopColor:'lightgrey',
    marginBottom:15

  },
  modalfooter:{
    width:width(90),
    // height:height(9),
    backgroundColor:'white',
    paddingTop: 20,
    bottom:10,
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:0.5,
    borderTopColor:'lightgrey'
  },
  inputhigh:{
    backgroundColor:'transparent',
  width:'98%',
  // paddingLeft:3,
  // backgroundColor:'red'
  // height:'80%',
  // left:5,
  // marginBottom:40,
  // marginTop:20

},
div01:{
  width:Window.width,
  // height:height(10),
  backgroundColor:'transparent',
  // marginTop:10,
  // alignItems:'center',
  // justifyContent:'center',
  flexDirection:'row',
  paddingTop:5,

},
  div1:{
    width:Window.width,
    //height:height(10),
    backgroundColor:'transparent',
    marginTop:10,
    // alignItems:'center',
    // justifyContent:'center',
    flexDirection:'row',
    // backgroundColor:'yellow'
  },
    div2:{
    width:Window.width,
    // height:height(10),
    backgroundColor:'transparent',
    // marginTop:10,
    // alignItems:'center',
    // justifyContent:'center',
    flexDirection:'row',
    //marginBottom:30
    //backgroundColor:'red'
  },

  check:{
    position:'absolute',
    // height:'0%',
    width:'10%',
    backgroundColor:'transparent',
    // backgroundColor:'grey',
    right:0,
  },
  input01:{
    backgroundColor:'transparent',
    width:'90%',
    height:'80%',
},
input001:{
  backgroundColor:'transparent',
  width:'90%',
  height:'90%',
  paddingLeft:4
},
input002:{
  backgroundColor:'transparent',
  width:'90%',
  height:'90%',
  paddingLeft:4,
  paddingVertical:Platform.OS=== 'ios'?10:null,
  // backgroundColor:'red'
  // marginLeft:6
},
placeholderT:{
  fontSize: Fonts.size.regular,
  width:'90%'
},
input02:{
  backgroundColor:'transparent',
  width:'95%',
  // height:'100%',
  paddingLeft:3,
  marginTop:5,
  paddingVertical:Platform.OS=== 'ios'?10:null,
  // borderBottomWidth:1
  // backgroundColor:'red'
},
input03:{
  backgroundColor:'transparent',
  width:'95%',
  height:'80%',
  paddingLeft:7
},
input04:{
  backgroundColor:'transparent',
  width:'95%',
  height:'80%',
  paddingLeft:7,
  //backgroundColor:'red'

},
input05:{
  backgroundColor:'transparent',
  width:'95%',
  height:'80%',
  paddingLeft:7

},
input06:{
  backgroundColor:'yellow',
  width:'50%',
  height:'80%',
  flexDirection:'row'

},
input07:{
  backgroundColor:'transparent',
  width:'95%',
  height:'80%',
  paddingLeft:7
},
uploadButton:{
  backgroundColor:'transparent',
  width:'50%',
  height:'80%',
  paddingLeft:7,
  flexDirection:'row',
  
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
floatingDiv:{
  position:'absolute',
  // right:20,
  // bottom:90,
  zIndex:1000,
  justifyContent:'center',
  alignItems:'center',
},
floatinBtn:{
  borderWidth:1,
  borderColor:'rgba(0,0,0,0.2)',
  alignItems:'center',
  justifyContent:'center',
  width:60,
  height:60,
  // backgroundColor:'#00b3d6',
  borderRadius:100,
  zIndex:1000,
  elevation:15,
  justifyContent:'center',
  alignItems:'center'
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
sectionTop:{
  backgroundColor:'white',
  flexDirection:'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  borderBottomWidth: 0.5,
  borderBottomColor: '#C4C4C4',
  padding: 10    
},
sectionContent: {
  flexDirection:'row',
  justifyContent: 'flex-start',
  alignItems: 'center'    
},
boxContent: {
  width: '100%',
  color:'black', 
  fontSize: Fonts.size.mediump,
  textAlign: 'center',
  fontFamily:'OpenSans-Regular'
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
sectionTopCancel:{
  backgroundColor:'white',
  flexDirection:'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: 10    
},
boxContentClose: {
  width: '100%',
  color:'#000', 
  textAlign: 'center',
  fontSize: Fonts.size.mediump,
  fontFamily:'OpenSans-Regular'
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
modalbodyReset:{ 
  width:'90%',
  height:150,
  backgroundColor:'white',
  borderRadius:1,
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center'
  },
modalCont:{ 
width:'95%' ,
height:60 ,
flexDirection:'column', 
backgroundColor:'transparent' 
},
modalcont2:{ 
  width:'95%' ,
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'column',
  height:60 , 
  backgroundColor:'transparent' 
},
modalTouch:                 
{justifyContent:'center',
alignItems:'center', 
width:'95%' ,
height:30,
margin:2, 
backgroundColor:'transparent',
borderWidth:0.5,
borderColor:'lightgrey'
},
attachModal:{
  width:'100%',
  height:50,
  backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center'
},
attachModal1:{
  width:'100%',
  height:50,
  backgroundColor:'white',
  borderTopColor:'lightgrey',
  borderTopWidth:1,
  flexDirection:'row',
  alignItems:'center'
},
attachModal2:{
  width:'100%',
  height:50,
  backgroundColor:'white',
  borderTopColor:'lightgrey',
  borderTopWidth:1,
  flexDirection:'row',
  alignItems:'center'
},
attachModal3:{
  width:'100%',
  height:50,
  backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center',
  borderTopColor:'lightgrey',
  borderTopWidth:1,
},
boxContentCam: {
  //width: '100%',
  color:'#485B9E', 
  fontSize: Fonts.size.mediump,
  fontFamily:'OpenSans-Regular'
  // textAlign: 'center',
  // paddingLeft: 20,
},


})
