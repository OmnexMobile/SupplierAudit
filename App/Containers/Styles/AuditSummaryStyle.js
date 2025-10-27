import { StyleSheet, Dimensions} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start',
  },
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
    flex:1
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width: width(15),
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
  },
  heading:{
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems:'center', 
    width: width(70),
    height: 65
  },  
  headingText:{
    fontSize: Fonts.size.h4,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  headerDiv:{
    width:width(15),
    height: 65,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer:{
    bottom:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:width(100),
    backgroundColor:'transparent',
    height: 65,
    zIndex: 3000
  },  
  footerDiv:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:width(100),
    height:65,
    position:'absolute'
  },
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
    backgroundColor: 'transparent' ,
    textAlign:'center',
    // backgroundColor:'red'
  },
  card1:{
    width:'95%',
    height:'95%',
    backgroundColor:'white',
    flexDirection:'column',
    borderWidth:0.5,
    borderColor:'lightgrey',
    elevation:8,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center'
  },
  card:{
    width:Window.width,
    height:290,
    backgroundColor:'white',
    marginTop:10,
    justifyContent:'center',
    alignItems:'center',
  },
  cardT:{
  backgroundColor:'white',
  width:width(100),
  flexDirection: 'column',
  borderBottomWidth: 0.5,
  borderBottomColor: 'lightgrey', 
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  paddingTop: 5,
  paddingLeft: 10,
  borderBottomColor:'lightgrey'
  },
  boxCard1:{
    width:'95%',
    height:'25%',
    backgroundColor:'white',
    borderBottomWidth:0.5,
    borderBottomColor:'lightgrey',
    flexDirection:'column',
    padding:10
  },
  boxCard2:{
    left: 0,
    //marginTop: 11
  },
  detailTitle: { 
    fontSize: Fonts.size.medium,
    color: '#A6A6A6'
  },
  detailContent: {
    fontSize: Fonts.size.regular, 
    color: '#1d1d1d'
  },
  div1:{
  width:Window.width,
  //height:height(10),
  backgroundColor:'transparent',
  marginTop:10,
  alignItems:'center',
  justifyContent:'center',
  flexDirection:'row'
  },
  input07:{
  backgroundColor:'transparent',
  width:'95%',
  height:'80%',
  },
  Carddiv1:{
  width:'100%',
  height:150,
  backgroundColor:'white',
  padding:0,
  flexDirection:'column'
},
cardS:{
  width:'95%',
  height:null,
  backgroundColor:'white',
  borderRadius:8,
  borderColor:'lightgrey',
  borderWidth:0.8,
  elevation:5
},
box1:{
  width:'100%',
  height:'50%',
  backgroundColor:'white',
  borderBottomColor:'lightgrey',
  borderBottomWidth:0.5,
  flexDirection:'row',
  borderTopWidth:0.5,
  borderTopColor:'lightgrey'
},
boxcard:{
  width:'50%',
  height:'100%',
  backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'column'
},
boxcard1:{
  width:'50%',
  height:'100%',
  backgroundColor:'white',
  borderLeftColor:'lightgrey',
  borderLeftWidth:0.5,
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'column'
},
boxcard3:{
  width:'50%',
  height:'100%',
  backgroundColor:'white',
  borderLeftColor:'lightgrey',
  borderLeftWidth:0.5,
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'column'
},
boxcard2:{
  width:'50%',
  height:'100%',
  backgroundColor:'white',
  borderLeftColor:'lightgrey',
  borderLeftWidth:0.5,
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'column'
},
boxcard31:{
  width:'50%',
  height:'100%',
  backgroundColor:'white',
  borderLeftColor:'lightgrey',
  // borderLeftWidth:0.5,
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'column'
},
TextStyle:{fontSize:Fonts.size.small,color:'grey',fontFamily:'OpenSans-Regular'},
TextStyle1:{fontSize:26,color:'black',fontFamily:'OpenSans-Regular'},
Carddiv2:{
  width:'100%',
  height:40,
  backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center',
  borderBottomColor:'lightgrey',
  borderBottomWidth:0.5,
  marginTop:10
},
Carddiv3:{
  width:'100%',
  height:120,
  backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center',
  marginTop:10,
  marginBottom:5
},
CarddivCont:{ 
  width:'95%',
  height:null,
  backgroundColor:'white',
  borderRadius:5,
  borderColor:'lightgrey',
  borderWidth:0.5,
  elevation:5,
  padding:10,
  flexDirection:'column'
},
box11:{
  width:'100%',
  height:'40%',
  backgroundColor:'white',
  borderBottomColor:'lightgrey',
  borderBottomWidth:0.5,
  alignItems:'center',
  justifyContent:'center'
},
box12:{
  width:'100%',
  height:'60%',
  backgroundColor:'white',
  flexDirection:'row'
},
leftBox:{
  width:'33.3%',
  height:'100%',
  backgroundColor:'white',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  borderRightColor:'lightgrey',
  borderRightWidth:0.5
},
middleBox:{
  width:'33.3%',
  height:'100%',
  backgroundColor:'white',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center'
},
rightBox:{
  width:'33.3%',
  height:'100%',
  backgroundColor:'white',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  borderLeftColor:'lightgrey',
  borderLeftWidth:0.5
},
subHeading:{
  width:'100%',
  height:50,
  backgroundColor:'#FFFFFF',
  borderBottomWidth:5,
  borderBottomColor:'#00BAC8',
  justifyContent:'center',
  alignItems:'center'
},
subText:{
  fontSize:18,
  color:'#00BAC8',
  fontFamily:'OpenSans-Regular'
}


})
