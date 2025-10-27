import { StyleSheet } from 'react-native'
import {width} from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    /*flex: 1,*/
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 5,
    height: 85
  },
  containerLeft: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 5
  },
  containerRight: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    color: 'white',
    fontSize: Fonts.size.h5
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 80,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 50
  },
  circle: {
    width: width(30),
    height: width(30),
    borderRadius: width(30)/2,
    backgroundColor: 'white',
    padding: 5
  },
  progressVal: {
    fontSize: Fonts.size.h4,
    // color: '#2BD8C4'
    color: 'white',
  },
  progressState: {
    fontSize: Fonts.size.medium,
    // color: '#2BD8C4'
    color: 'white',
  },
  progressValSelected: {
    fontSize: Fonts.size.h4,
    color: '#8ce7dc',
    // color: 'white',
    fontWeight: 'bold',
  },
  progressStateSelected: {
    fontSize: Fonts.size.medium,
    color: '#8ce7dc',
    // color: 'white',
    fontWeight: 'bold'
  },
  refreshSection: {
    flexDirection: 'column', 
    alignItems: 'flex-end', 
    width: 30, 
    height: null, 
    backgroundColor: 'transparent',
    marginLeft: 20
  },
  statsSection: {
    flexDirection: 'column', 
    alignItems: 'center', 
    width: width(32), 
    height: 80, 
    backgroundColor: 'transparent'
  },
  statsSectionSelected: {
    flexDirection: 'column', 
    alignItems: 'center', 
    width: width(32), 
    height: 80, 
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  },
  separatorSection: {
    flexDirection: 'column', 
    alignItems: 'center', 
    width: width(1), 
    height: 80, 
    backgroundColor: 'transparent',
    marginTop: 30
  },
  refreshIcon: {
    width: 20,
    paddingLeft: 5
  }
})
