import { StyleSheet, Dimensions } from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height

export default StyleSheet.create({
  mainContainer: {
    width: "100%",
    height:"100%"
  },
  // header: {
  //   width: "100%",
  //   flexDirection: 'row',
  //   backgroundColor: '#03B0D2',
  //   padding: 5,
  //   height: 65,
  // },
  backlogo: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: width(10),
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDiv: {
    width: width(15),
    height: 65,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  slide: {
    width: '100%',
    height: '30%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  header: {
    width: '100%',
   // zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
    padding: 5,
    alignContent:'center',
    justifyContent: 'flex-start',
    height: 65,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  heading: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    height: 65
  },
  headingText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  headerDiv: {
    width: width(15),
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statistics: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderBottomColor: 'lightgrey'
  },
  statCard1: {
    width: '33.3%',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statCard2: {
    width: '33.3%',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.8,
    borderLeftColor: 'lightgray'
  },
  statCard3: {
    width: '33.3%',
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.8,
    borderLeftColor: 'lightgray'
  },
  cart: {
    width: '78%',
    paddingVertical: 5,
    marginTop: 10,
    // height: '90%',
    backgroundColor: 'white',
    shadowColor: 'grey',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 20,
    // bottom: 20,
    marginBottom: 10,
    marginLeft: 1,
    marginRight: 20,
    // flexDirection:'row'

  },
  body: {
    // height:'85%',
    flex:1,
    width:'100%',
    flexDirection: 'row',
    marginTop:5
    // bottom:30
    // height: Height/2+80,
  },
  leftBtn: {
    width: '95%',
    padding: 10,
    borderColor: 'grey',
    borderWidth: 0.4,
    marginLeft: 2,
    paddingVertical: 15,
    flexDirection: 'row',
    // bottom:5
  },
  bottomBtnView: {
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  backBtn: {
    width: '40%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#00BAC8',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextBtn: {
    width: '40%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#00BAC8',
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quesText: {
    fontSize: Fonts.size.mediump,
    width: '100%',
    color: 'black',
    fontFamily:'OpenSans-Regular',
    padding: 5,
    marginTop: 5
    // backgroundColor:'yellow',
  },
  boxsecRadio: {
    width: '99%',
    height: null,
    backgroundColor: 'transparent',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'row',
    paddingLeft: 5,
    justifyContent: 'space-between',
    paddingTop: 10,
    alignItems:'center',
  },
  ncofi: {
    position: 'absolute',
    //top:height(2),
    right: 0,
    //width: 100,
    padding: 8,
    backgroundColor: '#00BFFF',
    borderRadius: 20,
    bottom: 0
  },
  boxsecImageDisplay: {
    width: '50%',
    height: null,
    backgroundColor: 'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10
  },
  boxsecVideoDisplay: {
    //width: '50%',
    height: null,
    backgroundColor: 'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    //right: 10,
    //height: 80,
    paddingRight: 10
  },
  boxsec1: {
    width: '98%',
    height: null,
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 10
  },
  boxsecNone: {
    // width:'98%',
    // height: null,
    // backgroundColor:'yellow',
    // borderBottomColor: 'lightgrey',
    // borderBottomWidth: 0.5,
    // flexDirection: 'column',
    // paddingLeft: 10
    display: 'none'
  },
  checkPointsTextInputLabel: {
    fontSize: Fonts.size.mediump,
    paddingTop: 0,
    marginTop: 0,
    fontFamily:'OpenSans-Regular'

  },
  checkPointsTextInput: {
    fontSize: Fonts.size.mediump,
    paddingTop: 2,
    height: 50,
    fontFamily:'OpenSans-Regular'
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
  },
  attachIcon: {
    top: 3,
    position: 'absolute',
    right: 5,
    height: 40
  },
  scoreBox: {
    position: 'absolute',
     //top: height(2), -- changes done 16/12/2022
    left: 50
  },
  scoreText: {
    top: height(0),
    left: 0, //-- changes done 16/12/2022
    width: width(75),
  },
  LPAsec1: {
    //width:'100%',
    //height:'40%',
    // backgroundColor:'white'
    backgroundColor: 'transparent',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
  },
  LPAsec1Label: {
    //width:'100%',
    //height:'40%',
    // backgroundColor:'white'
    backgroundColor: 'transparent',
    // borderBottomColor: 'lightgrey',
    // borderTopWidth: 0.5,
    paddingTop: 0,
    marginTop: 0
  },
  LPAsec2: {
    //width:'100%',
    //height:'60%',
    // backgroundColor:'grey'
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderTopWidth: 0.5
  },
  boxsecRemark: {
    width: '98%',
    height: null,
    backgroundColor: 'white',
    /* borderBottomColor: '#808080',
    borderBottomWidth: 0.5, */
    flexDirection: 'row',
    paddingLeft: 5,
    // marginLeft: 5,
    justifyContent: 'space-between'
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
  ModalBox: {
    width: width(90),
    height: height(50),
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'column',
    top: height(40)
  },
  modalheader: {
    width: width(90),
    height: height(8),
    backgroundColor: 'transparent',
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  modalbody: {
    width: width(90),
    height: height(42),
    backgroundColor: 'white',
    padding: 20
  },
  sectionTop: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    padding: 10
  },
  modalheading: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  boxContent: {
    width: '100%',
    color: 'black',
    fontSize: Fonts.size.mediump,
    textAlign: 'center',
    fontFamily:'OpenSans-Regular'
  },
  sectionTopCancel: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10
  },
  boxContentClose: {
    width: '100%',
    color: '#000',
    textAlign: 'center',
    fontSize: Fonts.size.mediump,
    fontFamily:'OpenSans-Regular'
  },
  sectionBtn: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
    padding: 10
  },
  boxContentCam: {
    //width: '100%',
    color: '#485B9E',
    fontSize: Fonts.size.mediump,
    // textAlign: 'center',
    // paddingLeft: 20,
    fontFamily:'OpenSans-Regular'
  },
  modalavatar: {
    flex: 1,
    width: width(90),
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 20,
    margin: 20
  },
  modelImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignContent: 'center'
  },
  footer: {
    //flex:1,
    // position: 'absolute',
    // bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent:'center',
    width: '100%',
    backgroundColor: 'transparent',
    height: 65,
    // zIndex: 3000
  },
  footerDiv: {
    //flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent:'center',
    width: '100%',
    height: 65,
    //top:height(1),
    position: 'absolute',
    //resizeMode:'cover',
  },
  noRecordsFound: {
    width: '100%',
    textAlign: 'center',
    marginTop: 45,
    fontSize: Fonts.size.h5,
    paddingTop: 40,
    color: 'grey',
    fontFamily:'OpenSans-Regular'
  },


})
