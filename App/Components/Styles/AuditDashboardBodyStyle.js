import { StyleSheet } from 'react-native'
import {width, height} from "react-native-dimension";
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  auditBox: {
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 1,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    elevation: 1,
    backgroundColor: 'black',
    height:undefined
  },
  progressVal: {
    fontSize: Fonts.size.medium,
    color: '#1d1d1d'
  },
  statusText: {
    fontSize: Fonts.size.small, 
    color: '#00A2E5', 
    textAlign: 'center'
  },
  circle: {
    /* width: width(15),
    height: width(15),
    borderRadius: width(15)/2,
    backgroundColor: 'white',
    padding: 3 */
    paddingBottom:8
  },
  auditBoxContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: width(75),
    padding: 15,
    backgroundColor:'black'
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
    backgroundColor: 'black',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    //height: height(100) - 213
    alignSelf:'stretch'
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
})
