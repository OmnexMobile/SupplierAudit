import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    top: 0,
    zIndex: 50000
  },
  slowconnectionContainer: {
    backgroundColor: '#E27820',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    top: 0,
    zIndex: 50000
  },
  

  offlineModeContainer: {
    backgroundColor: '#FC9403',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    top: 0,
    zIndex: 50000
  },
  offlineText: { color: '#fff',fontFamily:'OpenSans-Regular' }
})
