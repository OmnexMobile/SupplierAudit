import { StyleSheet, Dimensions } from 'react-native'
import { width, height } from "react-native-dimension";
import Fonts from '../../Themes/Fonts'
const window_width = Dimensions.get('window').width

export default StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1
  },
  auditbg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 30
  },
  offlineText: {
    color: '#fff'
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  auditBodyContent: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    //height: height(24)
  },
  filterBox:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:"row",
    // borderLeftColor:"lightgrey",
    // borderLeftWidth:0.7
},
filterCont:{
    width:'100%',
    height:60,
    flexDirection:"row",
    borderBottomWidth:0.5,
    borderBottomColor:'lightgrey',
    marginTop:50
},
scrollViewBody: {
    height: '100%',
    backgroundColor: 'transparent'
},
calendarScrollViewBody: {
    height: '100%',
    paddingTop: 50,
    backgroundColor: 'transparent'
},
bgCont: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%'
  },
  bodyCont: {
    width: '100%',
    height: '90%',
  },
  headerCont: {
    width: "100%",
    height:60
  },
  container: {
    flex: 1
  },
  header: {
    width:'100%',
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
  heading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width(70),
    height: 65
  },
  headingText: {
    fontSize: Fonts.size.h6,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  backlogo: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: width(15),
    height: 65,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerDiv: {
    width: width(15),
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    right: 10,
    height: 80
  },
  auditBox: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    // borderColor: 'red',
    // borderWidth: 1,
    // borderRadius: 1,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 1,
    height: undefined,
    borderBottomColor: "#DEDBDB",
    borderBottomWidth: 0.7
  },
  progressVal: {
    fontSize: Fonts.size.medium,
    color: '#1d1d1d',
    fontFamily:'OpenSans-Regular'
  },
  statusText: {
    fontSize: Fonts.size.small,
    color: '#00A2E5',
    textAlign: 'center',
    fontFamily:'OpenSans-Regular'
  },
  circle: {
    /* width: width(15),
    height: width(15),
    borderRadius: width(15)/2,
    backgroundColor: 'white',
    padding: 3 */
    paddingBottom: 8
  },
  footerDiv:{
    //flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor:'transparent',
    zIndex: 3000
  },
  auditBoxContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 15
  },
  auditBoxStatusBar: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: width(1)
  },
  auditBoxStatus: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    padding: 10,
    position: 'absolute',
    right: 0,
    paddingLeft: 5
  },
  auditHeaderMain: {
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 180
  },
  auditListMain: {
    padding: 10,
    marginBottom: 15,
    paddingTop: 0
  },
  downloadIconImg: {
    width: width(17),
    height: width(17),
    marginTop: 0
  },
  wrapper: {
    flex: 1,
    zIndex: 10,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    //position: 'relative',
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    //height: height(100) - 213
    alignSelf: 'stretch'
  },
  content: {
    fontSize: Fonts.size.small,
    marginBottom: 10,
    lineHeight: 18,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    //backgroundColor: '#800000',
    //borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: Fonts.size.medium,
    textAlign: 'center',
  },
  empty_text_: {
    width: window_width,
    height: height(100) - 213,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: Fonts.size.h5,
    paddingTop: 40,
    fontFamily:'OpenSans-Regular'
  },
  renderFilterView: {
    // width:null,
    // height:null,
    padding:5,
    margin:5,
    borderRadius:5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'lightgrey',
    // flexDirection: 'row',
    // marginLeft: 6,
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderRadius: 5
  },
  errorWrapper:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  marginTop10:{
    marginTop:10
  },
  card:{
    width: '90%',
    marginLeft: '5%',
    borderRadius: 5,
    borderColor: '#4ACECD',
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 10,
    shadowColor: 'grey',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
    backgroundColor: 'white'
  },
  detailTitle:{
  fontSize: Fonts.size.medium,
  color: '#A6A6A6',
  paddingBottom:2,
  fontFamily:'OpenSans-Regular'
  },
  detailContent:{
    fontSize: Fonts.size.regular,
    color: '#1d1d1d',
    fontFamily:'OpenSans-Regular'
  },
  rowBorder:{
      backgroundColor:'lightgrey',
      width:'100%',
      height:0.5,
      marginVertical:5
  }
})
