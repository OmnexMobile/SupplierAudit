import {StyleSheet , Dimensions} from 'react-native'
import { width,height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Width,
    height: 95,
    marginTop: 0
  },
  containerRecent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Width,
    height: 50,
    marginTop: 0
  },
  containerScroll:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Width,
    height: 45,
    marginTop: 0
  },
  calendarContainer:{
    width: Width,
    position: 'absolute',
    zIndex: 1000,
    top: height(6),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  filterDiv:{
    flex:1,
    /*width:Width/5,*/
    backgroundColor: 'white',
    padding: 5
  },
  textFontStyle:{
    fontSize: Fonts.size.medium,
    backgroundColor: 'white',
    color: 'grey',
    margin: 2,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
    textAlign: 'center',
    shadowColor: '#4b4b4b',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    overflow:'hidden',
    borderWidth:0.5,
    borderColor:'#E7EBEC',
  },
  textFontStyleSelected:{
    fontSize: Fonts.size.medium,
    backgroundColor: '#DDDCDA',
    color: 'grey',
    margin: 2,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
    textAlign: 'center',
    shadowColor: '#4b4b4b',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    overflow:'hidden',
    borderWidth:0.5,
    borderColor:'#E7EBEC',
  },
  checkBox:{
    /* position: 'absolute',
    top:height(5),
    padding: 2,
    margin: 2,
    marginBottom: 0,
    flexDirection: 'row' */
  },
  radioScroll:{
    position: 'absolute',
    top: 40,
    padding: 2,
    margin: 2,
    marginBottom: 0,
    flexDirection: 'row',
    width: '100%'
  },
  checkBoxnone:{
    display:'none'
  },
  dropBox:{
    position: 'absolute',
    top: height(2),
    right: 20,
    width: width(30),
    marginTop: 25
  },
  dateRange: {
    fontSize: Fonts.size.medium,
    color: 'grey',
    margin: 5,
    padding: 5,
    marginBottom: 0,
    textAlign: 'center',
  },
  calendarModal: {
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20
  },
  modalBody:{
    width:width(90),
    height:height(65),
    backgroundColor:'white',
    borderRadius: 8
  },
  modalheading:{
    width:'100%',
    height:'10%',
    backgroundColor:'transparent',
    position:'absolute',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    justifyContent:'center',
    alignItems:'center',
    top:height(2)
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
  }

})

export default styles
