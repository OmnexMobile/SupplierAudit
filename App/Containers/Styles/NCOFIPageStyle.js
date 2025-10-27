import { StyleSheet, Dimensions} from 'react-native'
import Fonts from '../../Themes/Fonts'
import { width, height } from 'react-native-dimension'

let Window = Dimensions.get('window')

export default StyleSheet.create({
  // Header styles
  header: {
    width:'100%',
    zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
   // alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent:'center',
    height: 65,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  header1:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignContent:'center'
  },
  heading:{
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems:'center', 
    width: width(70),
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
    justifyContent: 'space-between',
    alignContent:'center',
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
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },

  // Card view styles
  scrollViewBody: {
    height:'100%', 
    backgroundColor: 'transparent' 
  },
  cardBox:{
    backgroundColor:'white',
    margin: 5,
    elevation: 3,
    flexDirection:'column',
    borderRadius: 5,
    padding: 5,
    borderWidth:0.5,
    borderColor:'lightgrey'
  },
  sectionTop:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
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
    fontSize: Fonts.size.small,
    fontFamily:'OpenSans-Regular'
  },
  boxContent: {
    width: '100%',
    color:'#485B9E', 
    fontSize: Fonts.size.regular,
    fontFamily:'OpenSans-Regular'
  },

  body:{
    width:Window.width,
    height:'90%' ,
    backgroundColor:'transparent',
    position :'absolute' ,
    top:height(10),
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  button1:{
    width:Window.width,
    height:height(32),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    bottom:20
  },
  btnbox:{
    width:width(80),
    height:height(38),
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },

  button2:{
    width:Window.width,
    height:height(14),
    backgroundColor: 'transparent',
    flexDirection: 'row',
     bottom:20
  },
  button12:{
    width:Window.width,
    height:height(14),
    backgroundColor: 'transparent',
    // flexDirection: 'row',
    //  bottom:20
  },
  button02:{
    width:Window.width,
    height:height(15),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    top:0
  },
  box1:{
    top:0.5,
    width:Window.width/2,
    height:height(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',

  },
  box2:{
    width:Window.width/2,
    height:height(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  box1img:{
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width:'80%',
    height:'80%',
    borderWidth: 1,
    borderRadius:8,
    backgroundColor:'white',
  },
  button3:{
    width:Window.width,
    height:height(40),
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center'
  },
  SectionHeaderStyle:{
    backgroundColor : '#b9ff87',
    fontSize: Fonts.size.regular,
    padding: 5,
    color: '#000',
    width:width(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius:5,
    borderTopLeftRadius:5
  },
  SectionListItemStyle:{
    fontSize: Fonts.size.regular,
    marginBottom: 5,
    color: 'black',
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8, 
    height:height(8),
    width:width(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius:5,
    borderBottomLeftRadius:5

    // fontWeight: 'bold'
  },
  modalBody:{
    width:width(100),
    height:height(100),
    backgroundColor:'white',
    borderRadius: 8
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
  modalfooter:{
    width:'100%',
    height:'10%',
    backgroundColor:'grey',
    position:'absolute',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    justifyContent:'center',
    alignItems:'center',
    bottom:height(2)
  },
  scrollView:{
    marginTop:height(10),
    height:'80%',
    width:'100%',
    backgroundColor:'transparent'
  },
  ///
  cardDiv:{
    width:Window.width,
    height:height(17),
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:5,
    padding: 20
  },
  cardDivBox:{
    width:width(95),
    height:height(16),
    backgroundColor:'white',
    elevation:5,
    flexDirection:'column',
    borderRadius:5
  },
  Box01:{
    width:'100%',
    height:height(8),
    backgroundColor:'transparent',
  },
  Box:{
    width:'100%',
    height:height(8),
    backgroundColor:'transparent',
    borderTopWidth: 0.5
  },
  Section1:{
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  Section2:{
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  Box1:{
    position:'absolute',
    height:height(8),
    width:'100%',
    padding: 5
  },
  Box2:{
    position:'absolute',
    height:height(8),
    width:'30%',
    backgroundColor:'transparent',
    right:0

  },
  /* footer:{
    //flex:1,
    position : 'absolute',
    bottom:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:width(100),
    backgroundColor:'transparent',
    height: 65
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
    // resizeMode:'cover',

  }, */
  ncModal: {
    justifyContent: 'center',
    alignItems: 'center', 
    width: width(90),
    height:500,
    backgroundColor: 'white',
    borderRadius: 10,    
    flexDirection:'column',
    // margin: 10,
    padding: 10
  },
  ModalBox:{
    width:'90%',
    height:height(50),
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column',
    top:height(40)
  },
  scrollview:{
    width:'100%',
    // height:350,
    backgroundColor:'transparent',
    // justifyContent:'center',
    alignContent:'center',
    flexDirection:'column'
  },
  modalheader:{
      width:'100%',
      height:60,
      backgroundColor:'white',
      // justifyContent:'center',
      alignContent:'center',
      borderBottomColor:'lightgrey',
      borderBottomWidth:0.5   
  },
  firstCard:{
    width:'100%',
    // height:60,
    backgroundColor:'transparent',
    flexDirection:'column'
  },
  commoncard:{
    width:'100%',
    // height:60,
    backgroundColor:'transparent',
    flexDirection:'column',
    borderTopColor:'lightgrey',
    borderTopWidth:0.4,
  },
  lastcard:{
    width:'100%',
    // height:60,
    backgroundColor:'transparent',
    flexDirection:'column',
    borderTopColor:'lightgrey',
    borderTopWidth:0.4,
    // paddingBottom:height(60)
  },
  modalbody:{
    width:'90%',
    height:height(42),
    backgroundColor:'white',
    padding: 20
  },
  modalfooter:{
    width:'90%',
    // height:height(9),
    backgroundColor:'transparent',
    paddingTop: 10,
    bottom:10,
    justifyContent:'center',
    alignItems:'center',
    
  },
  closeDiv:{
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    // justifyContent:'center',
    alignContent: 'center',
    borderTopColor: 'lightgrey',
    borderTopWidth: 0.5
  },
  norecordefound:{
    width: width(100),
    textAlign: 'center',
    marginTop: 45,
    fontSize: Fonts.size.h5,
    paddingTop: 40,
    color: 'grey',
    fontFamily:'OpenSans-Regular'
  },
  missingModal:{
    width:'100%',
    height:null,
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column'
  },
  missingMContainer:{
    width:'100%',
    height:80,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    justifyContent:'center',
    alignItems:'center',
    borderBottomColor:'lightgrey',
    borderBottomWidth:0.7
  },
  missingBody:{
    width:'100%',
    height:300,
  },
  missingBodyHeader:{
    width:'100%',
    height:null,
    padding:20,
    flexDirection:'column'
  },
  bodyText1:{
    color:'grey',
    fontSize:16,
    fontFamily:'OpenSans-Regular'
  },
  bodyText2:{
    color:'black',
    fontSize:18,
    fontFamily:'OpenSans-Regular'
  },
  scrollBody:{
    width:'100%',
    height:'65%',                
  },
  carddivMissing:{
    width:'100%',
    height:null,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10
  },
  cardContMissing:{
    width:'95%',
    height:90,
    borderLeftWidth:6,
    borderLeftColor:'red',
    borderRadius:10,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:0.5
  },
  cardSecMissing:{
    width:'95%',
    height:'50%',
    justifyContent:'center',
    borderBottomWidth:0.7,
    borderBottomColor:'grey',
    flexDirection:'column'
  },
  cardsec2Missing:{
    width:'95%',
    height:'50%',
    justifyContent:'center'
  },
  cardFooterMissing:{
    width:'100%',
    height:80,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    justifyContent:'center',
    alignItems:'center',
    borderTopColor:'lightgrey',
    borderTopWidth:0.7,
    flexDirection:'row'
  },
  cardBtnDiv:{
    width:'50%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    borderRightColor:'lightgrey',
    borderRightWidth:0.7
  },
  cardBtn2Div:{
    width:'50%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
  }

})
