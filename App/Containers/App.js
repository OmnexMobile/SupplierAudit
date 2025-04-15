import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { View, Image, Dimensions, Alert } from 'react-native'
import { Images } from '../Themes';
import ResponsiveImage from 'react-native-responsive-image';
// import firebase from 'react-native-firebase';
import auth from "../Services/Auth";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
// create our store
const { store, persistor } = createStore()
console.disableYellowBox = true;
const window_width = Dimensions.get('window').width
const window_height = Dimensions.get('window').height

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  state = {
    isAppLoaded: false,
        deviceId: '',
        AppState: '',
        currentID: '',
        
  }

  onBeforeLift = () => {
    setTimeout(() => { 
      this.setState({ isAppLoaded: true}) 
    }, 500);
  }

  async componentDidMount() {
    DeviceInfo.getUniqueId().then(deviceId=>{
      this.setState({
        deviceId
      })
    })
   // AppState.addEventListener('change', this._handleAppStateChange);
    this.checkPermission();
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    // this.notificationListener = firebase.notifications().onNotification((notification) => {
    //   const { title, body } = notification;
    //   console.log('notif title:fg:', title)
    //   console.log('notif body:fg:', body)
    //   this.showAlert(title, body);
    // });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //     const { title, body } = notificationOpen.notification;
    //     console.log('notif title:bg:', title)
    //     console.log('notif body:bg:', body)
    //     this.showAlert(title, body);
    // });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    /* const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        console.log('notif title:', title)
        console.log('notif body:', body)
        this.showAlert(title, body);
    } */
    /*
    * Triggered for data only payload in foreground
    * */
    // this.messageListener = firebase.messaging().onMessage((message) => {
    //   //process data message
    //   console.log(JSON.stringify(message));
    // });
  }

  // Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    // this.notificationListener();
    // this.notificationOpenedListener();
    //AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
 
    this.setState({ appState: nextAppState });
 
    if (nextAppState === 'background') {
 this.setState({Appstate: "background"}) 
      // Do something here on app background.
      console.log("App is in Background Mode.",  this.state.deviceId)
    ( /*auth.AppStatus(
    
      this.state.deviceId,
       this.state.Appstate,
      (res, data) => {
        console.log("Background", data);
      
        }
     
    ); */) 
    }
 
    if (nextAppState === 'active') {

  this.setState({Appstate: "active"}) 
      // Do something here on app active foreground mode.
      console.log("App is in Active Foreground Mode.",  this.state.Appstate)
      (/* auth.AppStatus(
    
      this.state.deviceId,
       this.state.Appstate,
      (res, data) => {
        console.log("active", data);
      
        }
     
    );*/)
    }
 
    if (nextAppState === 'inactive') {
 
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode.")
    }
  };
 
  async checkPermission() {
    // const enabled = await firebase.messaging().hasPermission();
    // if (enabled) {
    //     this.getToken();
    // } else {
    //     this.requestPermission();
    // }
  }
  
  async getToken() {
    // let fcmToken = await AsyncStorage.getItem('fcmToken');
    // if(fcmToken) {
    //   console.log('FCM Token:',fcmToken.toString())
    // }    
    // if (!fcmToken) {
    //     fcmToken = await firebase.messaging().getToken();
    //     if (fcmToken) {
    //         // user has a device token
    //         await AsyncStorage.setItem('fcmToken', fcmToken);
    //     }
    // }
  }
  
  async requestPermission() {
    // try {
    //     await firebase.messaging().requestPermission();
    //     // User has authorised
    //     this.getToken();
    // } catch (error) {
    //     // User has rejected permissions
    //     console.log('permission rejected');
    // }
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  
  render () {
    return (
      <Provider store={store}>
        <PersistGate onBeforeLift={this.onBeforeLift} persistor={persistor}>
          {(this.state.isAppLoaded) ? 
            <RootContainer /> : 
            <View
              style={{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: "#CED0CE",
                width: window_width,
                height: 300,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: parseInt((window_height / 2) - 50),
                backgroundColor: '#fff'
              }}
            >
              {/* <ActivityIndicator animating size="large" /> */}
              {/* <DoubleBounce size={20} color="#1CAFF6" /> */}
              <ResponsiveImage source={Images.loadingLogo} initWidth="310" initHeight="69"/>
            </View>
          }
        </PersistGate>
      </Provider>
    )
  }
}



// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App