import { StyleSheet } from 'react-native'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 5,
    // alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 0,
    height: 50
  },
  prjName: {    
    width: '80%',    
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  welcomeTxt: {
    fontSize: Fonts.size.h5,
    color: 'white',
  },
  headerIcons: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  notifiIcon: {
    resizeMode: 'contain',
    width: 28,
    marginTop: -5
  },
  searchIcon: {
    resizeMode: 'contain',
    width: 28,
    marginLeft: 10
  }
})
