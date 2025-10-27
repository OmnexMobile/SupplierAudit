import { StyleSheet } from 'react-native'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    padding: 10
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  header: {
    color: '#fff',
    fontSize: Fonts.size.h5,
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
  }
})
