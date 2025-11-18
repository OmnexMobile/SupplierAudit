import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  PanResponder,
  Animated,
  BackHandler,
  Alert,
  StyleSheet,
  I18nManager,
  Dimensions,
} from 'react-native';
import {Images} from '../Themes';
import * as Animatable from 'react-native-animatable';
import ResponsiveImage from 'react-native-responsive-image';
import {strings} from '../Language/Language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDraggable: true,
      dropZoneValues: null,
      pan: new Animated.ValueXY(),
      width: undefined,
      ChineseScript: undefined,
      userId: '',
      siteId: '',
      token: '',
      isActive: false,
      orientation: width > height ? 'landscape' : 'portrait',
    };

    this.thumbWidth = 50;
    this.trackPadding = 20;
    this.trackWidth = width - this.trackPadding * 2;
    this.maxSwipeDistance = this.trackWidth - this.thumbWidth;

    this.translateX = new Animated.Value(0);

    this.labelOpacity = this.translateX.interpolate({
      inputRange: [0, this.maxSwipeDistance],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    this.fillWidth = this.translateX.interpolate({
      inputRange: [0, this.maxSwipeDistance],
      outputRange: [0, this.maxSwipeDistance + this.thumbWidth],
      extrapolate: 'clamp',
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: this.translateX}], {
        useNativeDriver: false,
        listener: (_, gesture) => {
          const clamped = Math.min(
            Math.max(0, gesture.dx),
            this.maxSwipeDistance,
          );
          this.translateX.setValue(clamped);
        },
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > this.maxSwipeDistance / 2) {
          Animated.timing(this.translateX, {
            toValue: this.maxSwipeDistance,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            console.log('🎉 Swipe complete - unlocking!');
            this._retrieveData();

            setTimeout(() => {
              Animated.timing(this.translateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start();
            }, 1000);
          });
        } else {
          Animated.spring(this.translateX, {
            toValue: 0,
            useNativeDriver: false, // <-- FIXED
          }).start();
        }
      },
    });
  }

  componentDidMount() {
    this.dimensionListener = Dimensions.addEventListener(
      'change',
      this.handleDimensionChange,
    );

    this.onScreenFocus();
    const language = this.props.data.audits.language;
    if (language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
      });
    } else {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
      });
    }

    this.RestoringLoginData();
    this.setState({
      showDraggable: true,
      width: width,
    });
    Animated.spring(this.state.pan, {
      toValue: {x: 10, y: 0},
      useNativeDriver: false,
    }).start();
  }
  handleDimensionChange = ({window}) => {
    const orientation = window.width > window.height ? 'landscape' : 'portrait';
    this.setState({orientation});
    const newWidth = window.width;

    this.trackWidth = newWidth - this.trackPadding * 2;
    this.maxSwipeDistance = this.trackWidth - this.thumbWidth;

    this.fillWidth = this.translateX.interpolate({
      inputRange: [0, this.maxSwipeDistance],
      outputRange: [0, this.maxSwipeDistance + this.thumbWidth],
      extrapolate: 'clamp',
    });

    this.labelOpacity = this.translateX.interpolate({
      inputRange: [0, this.maxSwipeDistance],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    this.setState({width: newWidth});
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.onScreenFocus();
    }
  }

  componentWillUnmount() {
    if (this.dimensionListener?.remove) {
      this.dimensionListener.remove();
    } else {
      Dimensions.removeEventListener('change', this.handleDimensionChange); // for older RN
    }
  }

  componentWillReceiveProps() {
    const getCurrentPage = this.props.data.nav.routes;
    const CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;

    if (CurrentPage === 'LaunchScreen') {
      this.setState({showDraggable: true});
      Animated.spring(this.state.pan, {
        toValue: {x: 10, y: 0},
        useNativeDriver: false,
      }).start();
    } else if (CurrentPage === 'UnRegister') {
      this.props.navigation.navigate('Register');
    }
  }

  onScreenFocus = async () => {
    const isDeviceRegisteredLog = await AsyncStorage.getItem('isRegistered');
    const NCSettingValue = await AsyncStorage.getItem('NCSettingValue');
    console.log('isDeviceRegisteredLog::::::::::', isDeviceRegisteredLog);
    console.log('NCSettingValue::::::::::', NCSettingValue);
  };

  RestoringLoginData = async () => {
    try {
      const active = await AsyncStorage.getItem('isActive');
      if (active === 'yes' && this.props.data.audits.isActive == null) {
        this.props.storeLoginSession(true);
      }

      if (active === 'yes' && this.props.data.audits.userId == null) {
        const [
          Userid,
          userName,
          Siteid,
          Token,
          address,
          companyname,
          companyurl,
          logo,
          phone,
          deviceid,
        ] = await Promise.all([
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('userName'),
          AsyncStorage.getItem('siteId'),
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('address'),
          AsyncStorage.getItem('companyname'),
          AsyncStorage.getItem('companyurl'),
          AsyncStorage.getItem('logo'),
          AsyncStorage.getItem('phone'),
          AsyncStorage.getItem('deviceid'),
        ]);

        this.props.storeUserSession(
          userName,
          Userid,
          Token,
          Siteid,
          address,
          companyname,
          companyurl,
          logo,
          phone,
          deviceid,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  _retrieveData = () => {
    try {
      const {userId, token, siteId, isActive} = this.props.data.audits;
      if (isActive === true) {
        if (token !== null) {
          this.props.navigation.navigate('AuditDashboard');
        } else {
          this.props.navigation.navigate('LoginUIScreen');
        }
      } else {
        this.props.navigation.navigate('LoginUIScreen');
      }
    } catch (error) {
      console.log('Error in saving', error);
    }
  };

  render() {
    return (
      <LinearGradient
        colors={['#64C8FA', '#ffffff']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}>
        {/* <Image source={Images.LoginBack} style={styles.backgroundImage} /> */}

        <View style={styles.OmnexlogoDiv}>
          <View style={styles.Omnex}>
            <ResponsiveImage
              source={Images.loadingLogo}
              initWidth="310"
              initHeight="69"
            />
          </View>
        </View>

        <View
          style={[
            styles.swipeWrapper,
            {marginBottom: this.state.orientation === 'landscape' ? 20 : 60},
          ]}>
          <View style={styles.track}>
            <Animated.View
              style={[styles.fillTrack, {width: this.fillWidth}]}
            />
            <Animated.Text style={[styles.label, {opacity: this.labelOpacity}]}>
              Swipe to unlock
            </Animated.Text>
            <Animated.View
              style={[
                styles.thumb,
                {transform: [{translateX: this.translateX}]},
              ]}
              {...this.panResponder.panHandlers}>
              <Icon
                name={I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
                size={24}
                color="#fff"
              />
            </Animated.View>
          </View>
          {/* <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              //  paddingRight: 10,
            }}>
            <Image
              source={Images.auditPro}
              style={{height: 30, resizeMode: 'contain', aspectRatio: 20}}
            />
          </View> */}
        </View>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  data: state,
});

const mapDispatchToProps = dispatch => ({
  storeUserSession: (
    userName,
    userId,
    token,
    siteId,
    address,
    companyname,
    companyurl,
    logo,
    phone,
    deviceid,
  ) =>
    dispatch({
      type: 'STORE_USER_SESSION',
      userName,
      userId,
      token,
      siteId,
      address,
      companyname,
      companyurl,
      logo,
      phone,
      deviceid,
    }),
  storeLoginSession: isActive =>
    dispatch({type: 'STORE_LOGIN_SESSION', isActive}),
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  OmnexlogoDiv: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Omnex: {padding: 10},
  swipeWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 80,
    alignItems: 'center',
  },
  track: {
    width: width - 70,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  fillTrack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  label: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 1,
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#70c6f8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    elevation: 5,
    zIndex: 2,
  },
});
