import { StyleSheet } from 'react-native'
import {width, height} from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    // flex: 1,
    flexDirection: 'row',
    //position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 65,
    bottom: 0,
    zIndex: 60000,
    borderTopWidth:1,
    borderTopColor:'lightgrey'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(51,51,51,1)'
  },
  header: {
    color: '#fff',
    fontSize: Fonts.size.regular,
    backgroundColor: 'transparent'
  },
  name: {
    color: '#fff',
    fontSize: Fonts.size.h4,
    marginLeft: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 80,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 50
  },
  normalIcon: {
    width: 30,
    height: 30
  },
  helpIcon: {
    width: 41,
    height: 33
  },
  smallIcon: {
    width: width(15),
    height: width(15)
  },
  mediumIcon: {
    width: width(20),
    height: width(20)
  },
  largeIcon: {
    width: width(25),
    height: width(25)
  },
  footerMenuItem: {
    flexDirection: 'column',
    // width: width(32),
    // width:'25%',
    height:60,
    flex:1,
    padding:10,
    alignItems: 'center',
    justifyContent:'center',
    // textAlign: 'center',
    // color: 'white',
    backgroundColor: 'transparent'
  },
  cardBox:{
    backgroundColor:'white',
    margin: 5,
    elevation: 3,
    flexDirection:'column',
    borderRadius: 3,
    padding: 3,
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
    padding: 5,
    paddingLeft: 10    
  },
  sectionBottom:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
    paddingLeft: 10       
  },
  sectionContent: {
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  boxContentFailed: {
    width: '100%',
    color: 'red', 
    fontSize: Fonts.size.regular,
    fontFamily:'OpenSans-Regular'
  },
  boxContentSuccess: {
    width: '100%',
    color: 'green', 
    fontSize: Fonts.size.regular,
    fontFamily:'OpenSans-Regular'
  },
  boxContentAtt: {
    width: '80%',
    color:'#485B9E', 
    fontSize: Fonts.size.regular
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
    height:null,
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
    height:null,
    justifyContent:'center',
    borderBottomWidth:0.7,
    borderBottomColor:'lightgrey',
    flexDirection:'column'
  },
  cardsec2Missing:{
    width:'95%',
    height:null,
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
