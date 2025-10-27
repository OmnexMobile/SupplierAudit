import { StyleSheet, Dimensions} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  header: {
    width:'100%',
    zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    justifyContent:'flex-start',
    alignContent:'center',
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
    justifyContent: 'flex-start', 
alignContent:'center',
    width:'70%',
    height: 65,marginTop:20
  },  
  headingText:{
    fontSize: Fonts.size.h6,
        color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  headerDiv:{
    width:'15%',
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
    height:'85%', 
    // backgroundColor: 'transparent' ,
    // marginTop:65,
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
    color: '#A6A6A6',
    flex: 4,
    backgroundColor: 'white',
    height: 40,
    marginTop: -5,
    paddingBottom: 5
  },
  offlineDesc: {
    fontSize: Fonts.size.small, 
    color: '#A6A6A6',
    paddingTop: 2,
    fontFamily:'OpenSans-Regular'
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
  calenderModalView:{
  width:Window.width,
  height:null,
  justifyContent:'center',
  alignItems:'center'
  },
  calenderView:{ 
  width:width(90),
  height:'80%',
  backgroundColor:'white',
  borderRadius:10,
  flexDirection:'column',
  },
  calenderHeader:{
  width:'100%',
  height:'10%',
  backgroundColor:'white',
  top:20,
  justifyContent:'center',
  alignItems:'center',
  borderBottomWidth:0.5,
  borderBottomColor:'lightgrey'
  },
  calenderBody:{
  top:100,
  backgroundColor:'white',
  width:'100%',
  height:'80%',
  top:30,
  flex:1,
  backgroundColor:'white'
},
calenderFooter:{
  width:'100%',
  height:'10%',
  backgroundColor:'white',
  bottom:10,
  justifyContent:'center',
  alignItems:'center',
  borderTopWidth:0.5,
  borderTopColor:'lightgrey',
  paddingTop:10,
  marginTop:10
},
auditBox:{
  width:'100%',
  height:310,
  backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center',
  borderWidth:0.5,
  borderRadius:5,
  marginBottom:5,
  elevation:5,
  borderColor:'lightgrey'
},
Carddiv:{
  width:'95%',
  height:300,
  backgroundColor:'white',
  flexDirection:'column',
},
cardS:{
  width:'100%',
  height:'20%',
  backgroundColor:'white',
  borderBottomWidth:0.5,
  borderBottomColor:'lightgrey',
  flexDirection:'column',
  padding:5
  },
cardLast:{
  width:'100%',
  height:'20%',
  backgroundColor:'white',
  // borderBottomWidth:0.5,
  // borderBottomColor:'lightgrey',
  flexDirection:'column',
  padding:5
},
switchElement: {
  marginTop: -5,
  backgroundColor: 'white',
  flex: 1,
  height: 40
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
  fontSize:16,
  color:'#00BAC8',
  fontFamily:'OpenSans-Regular'
}


})
