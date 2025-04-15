import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  PanResponder,
  Animated,
  BackHandler,
  Alert,
} from 'react-native';
import {Images} from '../Themes';
import * as Animatable from 'react-native-animatable';
import ResponsiveImage from 'react-native-responsive-image';
import {Dimensions} from 'react-native';
import {strings} from '../Language/Language';
import AsyncStorage from '@react-native-async-storage/async-storage';

let Window = Dimensions.get('window');
// Styles
import styles from './Styles/LaunchScreenStyles';

// Redux
import {connect} from 'react-redux';
import {act} from 'react-test-renderer';

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
    };

    // this.panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: () => true,
    //   onPanResponderMove: Animated.event([
    //     null,
    //     {
    //       dx: this.state.pan.x,
    //      // dy: this.state.pan.y,
    //     },
    //   ]),
    //   onPanResponderRelease: (e, gesture) => {
    //     if (this.isDropZone(gesture)) {
    //       console.log('Right location');
    //       // this.props.navigation.navigate('AuditForm')
    //       //this.RestoringLoginData()
    //       this._retrieveData();
    //       this.setState({
    //         showDraggable: false,
    //       });
    //     } else {
    //       Animated.spring(this.state.pan, {
    //         toValue: {x: 10, y: 0},
    //         useNativeDriver: false,
    //       }).start();
    //     }
    //     console.log('onPanResponderRelease working3');
    //   },
    // });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // Get the halfway mark
        let halfway = Window.width / 2;
    
        // Update animated position
        Animated.event(
          [null, { dx: this.state.pan.x }],
          { useNativeDriver: false }
        )(event, gesture);
    
        // If dragged past halfway, remove the lock
        if (gesture.moveX > halfway) {
          this.setState({ showDraggable: false });
          this._retrieveData(); // Unlock the app
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (this.isDropZone(gesture)) {
          console.log('Right location');
          this._retrieveData();
          this.setState({ showDraggable: false });
        } else {
          // Reset the draggable back if not dragged far enough
          Animated.spring(this.state.pan, {
            toValue: { x: 10, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    });
    
   
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.onScreenFocus();
    }
  }
  componentDidMount() {
    console.log('HomeScreen mounted');
    // console.log(data.data.Data.ncofisetting,"vb")
    this.onScreenFocus();
 
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
        console.log('ncbutton',this.props.data.audits.userFullName)

      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    console.log('Launchscreen mounted successfully!', Window.width);
    this.RestoringLoginData();
    /*
    if(this.props.data.audits.smdata == null || this.props.data.audits.smdata == 0)
    {
      this.props.storeSupplierData(1);
      console.log('sm data value stored as 1 instead of null..')
    }*/
    this.setState({
      showDraggable: true,
      width: Window.width,
    });
    console.log('onPanResponderRelease working1');
    Animated.spring(this.state.pan, {
      toValue: {x: 10, y: 0},
      useNativeDriver: false,
    }).start();
  }

  onScreenFocus = async () => {
    // Code to run every time the screen is focused
    const isDeviceRegisteredLog = await AsyncStorage.getItem('isRegistered');
    const NCSettingValue = await AsyncStorage.getItem('NCSettingValue');
    console.log('isDeviceRegisteredLog::::::::::',isDeviceRegisteredLog);
    console.log('NCSettingValue::::::::::',NCSettingValue);
 
    };
  componentWillReceiveProps() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    console.log('--CurrentPage--->', CurrentPage);
    if (CurrentPage == 'LaunchScreen') {
      console.log('Launchscreen mounted successfully!', this.props.data);
      console.log(
        'checking props' +
          this.props.data.audits.userFullName +
          this.props.data.audits.siteId +
          'user id:' +
          this.props.data.audits.userId +
          'token:' +
          this.props.data.audits.token +
          'isactive' +
          this.props.data.audits.isActive +
          'device registration status:' +
          this.props.data.audits.isDeviceRegistered, 
          'deviceId:' + this.props.data.audits.deviceid

      );
      this.setState({
        showDraggable: true,
      });
      console.log('onPanResponderRelease working2');
      Animated.spring(this.state.pan, {
        toValue: {x: 10, y: 0},
        useNativeDriver: false,
      }).start();
    } else if (CurrentPage == 'UnRegister') {
      this.props.navigation.navigate('Register');
    } else {
      console.log('LaunchScreen pass');
      //this.props.navigation.navigate('Register');
    }
  }

  isDropZone(gesture) {
    var dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  setDropZoneValues(event) {
    console.log('triggered');
    this.setState({
      dropZoneValues: event.nativeEvent.layout,
    });
  }

  RestoringLoginData = async () => {
    try {
      const active = await AsyncStorage.getItem('isActive');
      console.log('isActive status:' + active);
      if (active == 'yes' && this.props.data.audits.isActive == null) {
        this.props.storeLoginSession(true);
      }

      if (active == 'yes' && this.props.data.audits.userId == null) {
        const Userid = await AsyncStorage.getItem('userId');
        const userName = await AsyncStorage.getItem('userName');
        const Siteid = await AsyncStorage.getItem('siteId');
        const Token = await AsyncStorage.getItem('token');
        const address = await AsyncStorage.getItem('address');
        const companyname = await AsyncStorage.getItem('companyname');
        const companyurl = await AsyncStorage.getItem('companyurl');
        const logo = await AsyncStorage.getItem('logo');
        const phone = await AsyncStorage.getItem('phone');
        const deviceid = await AsyncStorage.getItem('deviceid');
        console.log(phone,userName,Userid,deviceid,"333 details")
        console.log('Started to store user session details in redux..');
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
          deviceid
        );
        console.log(
          'session value:' +
            userName +
            Userid +
            Token +
            Siteid +
            address +
            companyname +
            companyurl +
            logo +
            phone,
        );
        console.log('Stored user session details in redux..');
        //this.props.navigation.navigate('AuditDashboard')
      }
    } catch (error) {
      console.log(error);
    }
  };

  _retrieveData = () => {
    try {
      console.log('launch screen props ' + this.props.data.audits);
      const userid = this.props.data.audits.userId;
      const token = this.props.data.audits.token;
      const siteid = this.props.data.audits.siteId;
      const isActive = this.props.data.audits.isActive;
      console.log('isactve' + this.isActive);
      if (isActive == true) {
        console.log('----><-----', isActive);
        if (token !== null) {
          // this.props.navigation.navigate('AuditProDashboard')
          this.props.navigation.navigate('AuditDashboard');
        } else {
          console.log('token was empty. so navigated to loginUIScreen...');
          this.props.navigation.navigate('LoginUIScreen');
        }
      } else {
        this.props.navigation.navigate('LoginUIScreen');
        // this.props.navigation.navigate('AuditDashboard')
      }
    } catch (error) {
      // Error retrieving data
      console.log('Error in saving', error);
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.LoginBack} style={styles.backgroundImage} />

        <View style={styles.OmnexlogoDiv}>
          <View style={styles.Omnex}>
            <ResponsiveImage
              source={Images.loadingLogo}
              initWidth="310"
              initHeight="69"
            />
          </View>
        </View>

        {/* <View style={styles.hint1Div}>
          <View>
            <Text style={styles.hint1Text}>{strings.Swipe}</Text>
            <Text style={styles.hint2Text}>{strings.unlock}</Text>
          </View>
        </View> */}

        <View style={styles.swipeLogo}>
          <Animatable.View animation={'shake'} iterationCount={5000}>
            <ResponsiveImage
              source={Images.swipe}
              initWidth="30"
              initHeight="30"
            />
          </Animatable.View>
        </View>

        <View
          onLayout={this.setDropZoneValues.bind(this)}
          style={styles.dropZone}>
          <View style={styles.LockView}>
            <ResponsiveImage
              source={Images.LockLogo}
              initWidth="83"
              initHeight="83"
            />
          </View>
        </View>

        {this.renderDraggable()}

        <View style={styles.logoDiv}>
         
            {/* <ResponsiveImage
              initWidth="609"
              initHeight="577"
              source={Images.humanLogo}
              style={
                this.state.width < 500
                  ? styles.logoPosition
                  : styles.logoPosition01
              }
            /> */}
        
        </View>
        <View style={styles.msgbox}>
          <View style={styles.Omnex00}>
            <View>
              {/* <Text style={styles.textFont1}>{strings.COMPREHENSIVE}</Text> */}
            </View>
            <View>
              {/* <Text style={styles.textFont2}>{strings.MOBILE}</Text> */}
            </View>
            <View>
              {/* <Text style={styles.textFont3}>{strings.ENETER}</Text> */}
            </View>
          </View>
          {/* <View style={styles.Omnex01}>
            <ResponsiveImage
              source={Images.auditPro}
              initWidth="200"
              initHeight="42"
            />
          </View> */}
        </View>
      </View>
    );
  }

  renderDraggable() {
    if (this.state.showDraggable) {
      return (
        <View
          style={
            this.state.width < 500
              ? styles.draggableContainer
              : styles.draggableContainerTab
          }>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.state.pan.getLayout(), styles.circle]}>
            <View style={styles.logoView}>
              <ResponsiveImage
                source={Images.KeyLogo}
                initWidth="83"
                initHeight="83"
              />
            </View>
          </Animated.View>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
      deviceid
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
        deviceid
      }),
    storeLoginSession: isActive =>
      dispatch({type: 'STORE_LOGIN_SESSION', isActive}),
    //storeSupplierData: (smdata) =>
    //dispatch({ type: "STORE_SUPPLIER_DATA", smdata }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen);
