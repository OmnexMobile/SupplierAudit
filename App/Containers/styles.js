import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
  },
  flexView: {flex: 1},
  tabView: {
    backgroundColor: 'blue',
    paddingVertical: 10,
  },
  header: {
    position: 'absolute',
    zIndex: 10,
    marginTop: Platform.OS === 'ios' ? 35 : 15,
  },
  bottomTab: {
    height: 60,
  },
  outerCircle: {
    backgroundColor: '#FFF',
    width: 75,
    height: 75,
    borderRadius: 38,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  innerCircle2: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  buttonsView: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rotateButton: {
    position: 'absolute',
    right: 40,
  },
  rotateImage: {
    width: 28,
    height: 28,
  },
  // Video Submitting
  videoTitle: {
    paddingVertical: 0,
    height: 45,
    fontSize: 14,
  },
  titleContainer: {
    flex: 0,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: 'yellow',
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {color: '#000'},
});

export default styles;
