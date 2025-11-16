import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  BackHandler,
  ImageBackground,
  Platform
} from 'react-native';
import {Images} from '../Themes';
import {connect} from 'react-redux';
import auth from '../Services/Auth';
//import DeviceInfo from 'react-native-device-info'
import Toast, {DURATION} from 'react-native-easy-toast';
import {API_URL} from '../Constants/ApiConstants';
import styles from './Styles/LoginUIScreenStyle';
import OfflineNotice from '../Components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import DeviceInfo from 'react-native-device-info';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../Language/Language';
import {width, height} from 'react-native-dimension';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../Components/Shared/InputField';

let Window = Dimensions.get('window');

class UnRegister extends Component {
  isRedirectFromLogin = false;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isDeviceRegistered: '',
      deviceRegistration: '',
      serverUrl:
        this.props.data.audits.serverUrl == null ||
        this.props.data.audits.serverUrl == undefined ||
        this.props.data.audits.serverUrl == ''
          ? API_URL
          : this.props.data.audits.serverUrl,

      deviceId: '',
      type: 1,
      appVersion : ''
    };
  }

  componentDidMount() {
    this.getdeviceRegisterStatus();
    this.getDeviceId();
    console.log('unRegistration screen mounted successfully!');
     const version = DeviceInfo.getVersion();
    this.setState({ appVersion: version });

    auth.setServerUrl(this.state.serverUrl);
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
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
    // console.log('this.props', this.props)
    console.log('Received params', this.props.navigation.state.params);

    if (this.props.navigation.state.params) {
      this.isRedirectFromLogin = true;
      this.setState(
        {
          isDeviceRegistered: true,
          isLoading: false,
        },
        async () => {
          await AsyncStorage.setItem('isdeviceregistered', 'yes');
        },
      );
    }
    else {
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          auth.checkRegistrationStatus(this.state.deviceId, (res, data) => {
            console.log('Response data', data);
            if (data.data) {
              if (data.data.Data) {
                if (data.data.Data.Active) {
                  // console.log('Device is valid.')
                  // Update serverUrl in props
                  if (
                    data.data.Data.ServerUrl &&
                    data.data.Data.ServerUrl != ''
                  ) {
                    this.props.storeServerUrl(data.data.Data.ServerUrl);
                    auth.setServerUrl(data.data.Data.ServerUrl);
                  }

                  if (!this.isRedirectFromLogin) {
                    this.props.registrationState(true);
                    // Forward to landing page
                    this.props.navigation.navigate('LaunchScreen');
                  } else {
                    this.setState(
                      {
                        isDeviceRegistered: true,
                        isLoading: false,
                      },
                      async () => {
                        await AsyncStorage.setItem('isdeviceregistered', 'yes');
                        this.props.registrationState(
                          this.state.isDeviceRegistered,
                        );
                        // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                      },
                    );
                  }
                } else {
                  this.setState(
                    {
                      isDeviceRegistered: false,
                      isLoading: false,
                    },
                    () => {
                      this.props.registrationState(
                        this.state.isDeviceRegistered,
                      );
                      this.refs.toast.show(strings.NotReg, 2000);
                    },
                  );
                }
              }
            }
          });
        } else {
          if (this.props.data.audits.isDeviceRegistered) {
            if (!this.isRedirectFromLogin) {
              // Forward to landing page
              this.props.navigation.navigate('LaunchScreen');
            } else {
              this.setState(
                {
                  isDeviceRegistered: true,
                  isLoading: false,
                },
                async () => {
                  await AsyncStorage.setItem('isdeviceregistered', 'yes');
                  this.props.registrationState(this.state.isDeviceRegistered);
                },
              );
            }
          }
          console.log('No Internet Connection found!');
          this.refs.toast.show(strings.NoInternet, 2000);
        }
      });
    }
  
  }
  async getdeviceRegisterStatus() {
    this.setState({
      deviceRegistration: await AsyncStorage.getItem('isdeviceregistered'),
    });
    console.log(this.state.deviceRegistration, 'deviceregistrationstatus');
  }
  async getDeviceId() {
    this.setState({
      deviceId: await AsyncStorage.getItem('deviceid'),
    });
  }

 
  onPress = type => {
    console.log('typeunreg', type);

    var re = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
    if (this.state.serverUrl === '') {
      this.refs.toast.show(strings.EmptyURL);
    } else if (!re.test(this.state.serverUrl)) {
      this.refs.toast.show(strings.InvURL);
    } else {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, 2000);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.setState(
              {
                type: type,
                isLoading: true,
              },
              () => {
                if (
                  this.state.serverUrl != null &&
                  this.state.serverUrl != ''
                ) {
                  this.props.storeServerUrl(this.state.serverUrl);
                  auth.setServerUrl(this.state.serverUrl);
                }

                auth.registerDevice(
                  this.state.deviceId,
                  this.state.serverUrl,
                  type,
                  (res, data) => {
                    if (data.data) {
                      if (data.data.Success === true) {
                        if (data.data.Data == 'Already 5 Device Registered!') {
                          this.setState(
                            {
                              isDeviceRegistered: false,
                              isLoading: false,
                            },
                            async () => {
                              await AsyncStorage.setItem(
                                'isdeviceregistered',
                                'no',
                              );
                              console.log('unregisterlog1');
                              this.props.registrationState(
                                this.state.isDeviceRegistered,
                              );
                              this.refs.toast.show(strings.MaxCon, 2000);
                            },
                          );
                        } else {
                          if (type == 1) {
                            console.log('Device is registered.');
                            this.refs.toast.show(strings.DeviceRed);
                            this.setState(
                              {
                                isDeviceRegistered: true,
                                isLoading: false,
                              },
                              async () => {
                                await AsyncStorage.setItem(
                                  'isdeviceregistered',
                                  'yes',
                                );
                                console.log(
                                  'isDeviceRegistered =>',
                                  this.state.isDeviceRegistered,
                                );
                                this.props.registrationState(
                                  this.state.isDeviceRegistered,
                                );
                                // Forward to landing page
                                this.props.navigation.navigate('LaunchScreen');
                              },
                            );
                          } else {
                            console.log('Device is unregistered.');
                            this.setState(
                              {
                                isDeviceRegistered: false,
                                isLoading: true,
                              },
                              async () => {
                                await AsyncStorage.setItem(
                                  'isdeviceregistered',
                                  'no',
                                );

                                console.log('unregisterlog2');
                                await AsyncStorage.setItem('isRegistered', false.toString())

                                this.props.registrationState(
                                  this.state.isDeviceRegistered,
                                );
this.props.clearURL();
                                // Forward to landing page
                                this.props.navigation.navigate('LoginUIScreen');
                                // this.refs.toast.show(strings.Unreg, 2000);
                              },
                            );
                          }
                        }
                      } else {
                        this.setState(
                          {
                            isDeviceRegistered: false,
                            isLoading: false,
                          },
                          async () => {
                            await AsyncStorage.setItem(
                              'isdeviceregistered',
                              'no',
                            );
                            console.log('unregisterlog3');
                            this.refs.toast.show(strings.DevRegFail, 2000);
                          },
                        );
                      }
                    } else {
                      console.log('Error connecting to server!');
                      this.refs.toast.show(strings.DevError, 2000);
                      this.setState(
                        {
                          isDeviceRegistered: false,
                          isLoading: false,
                        },
                        async () => {
                          await AsyncStorage.setItem(
                            'isdeviceregistered',
                            'no',
                          );
                          console.log('unregisterlog4');
                          this.props.registrationState(
                            this.state.isDeviceRegistered,
                          );
                          // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                          this.refs.toast.show(strings.NotReg, 2000);
                        },
                      );
                    }
                  },
                );
              },
            );
          } else {
            this.refs.toast.show(strings.NoInternet, 2000);
          }
        });
      }
    }
  };

  serverUrlVal = () => {
    let serverUrl = this.state.serverUrl;

    if (serverUrl === '') {
      this.refs.toast.show(strings.EmptyURL);
    } else if (serverUrl !== '') {
      var re = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
      if (!re.test(serverUrl)) {
        this.refs.toast.show(strings.InvURL, 2000);
        return false;
      }
    }
    return false;
  };

  backFromReg = () => {
    if (this.state.isDeviceRegistered) {
      this.props.navigation.navigate('LoginUIScreen');
    }
  };
  goToRegister = () => {
    this.props.navigation.navigate('Registration');
  };

  render() {
    return (
      <View style={{flex: 1}}>
      {
      this.state.isLoading ? (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
            width: Window.width,
            height: 300,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: parseInt(Window.height / 2 - 50),
          }}>
          <ResponsiveImage
            source={Images.loadingLogo}
            initWidth="310"
            initHeight="69"
          />
        </View>
      ) : (
       
    <ImageBackground
      source={Images.LoginBack2}
      style={styles.backgroundImage}>
      <View style={{flex: 0.15, margin: 20}}>
      {/* {this.state.isDeviceRegistered == 'yes' ? (
  <TouchableOpacity
    onPress={this.backFromReg}
    style={styles.backlogo}>
    <Icon name={'angle-left'} size={30} color={'#2EA4E2'} />
  </TouchableOpacity>
) : null} */}

      </View>
      <View
        style={{
          flex: 0.25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ResponsiveImage
          source={Images.omnex_resizeLog}
          initWidth="310"
          initHeight="69"
        />
      </View>
      
      {this.state.deviceRegistration == "yes" ||
        this.state.deviceRegistration == false ||
        this.state.deviceRegistration == undefined ||
        this.state.deviceRegistration == null ? (
  <TouchableOpacity
    onPress={this.backFromReg}
    style={styles.backlogo}>
    <Icon name={'angle-left'} size={30} color={'#2EA4E2'} />
  </TouchableOpacity> ): null}

      
      <View style={{flex: 0.25}}>
        <InputField
          placeholder={strings.Enter_Registration_URL}
          autoCapitalize={'none'}
          //autoFocus={true}
          returnKeyType={'done'}
          autoCorrect={false}
          value={this.state.serverUrl}
          onChangeText={serverUrl => this.setState({serverUrl})}
          onBlur={this.serverUrlVal}
          multiline={true}
        />
        {this.state.deviceRegistration == 'no' ||
        this.state.deviceRegistration == false ||
        this.state.deviceRegistration == undefined ||
        this.state.deviceRegistration == null ? (
          <TouchableOpacity onPress={this.onPress.bind(this, 1)}>
            <View
              style={{
                backgroundColor: '#2EA4E2',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 10,
                marginLeft: 20,
                marginRight: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {this.state.deviceRegistration === 'yes' ? (
                  <Text style={styles.buttonText}>
                    {strings.Unregister}
                  </Text>
                ) : (
                  <Text style={styles.buttonText}>{strings.Register}</Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.onPress.bind(this, 2)}>
            <View
              style={{
                backgroundColor: '#2EA4E2',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 10,
                marginLeft: 20,
                marginRight: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {strings.Unregister}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
        {Platform.OS == 'android' ? <View style={styles.versionContainer}>
                                 <Text style={styles.versionText}>v{this.state.appVersion}</Text>
                               </View>: <View style={styles.regVersionContainer}>
                                 <Text style={styles.regVersionText}>v{this.state.appVersion}</Text>
                               </View>}
    </ImageBackground>
    
)}
<Toast
      ref="toast"
      style={{backgroundColor: 'black', margin: 20}}
      position="top"
      positionValue={400}
      fadeInDuration={750}
      fadeOutDuration={1000}
      opacity={0.8}
      textStyle={{color: 'white'}}
    />
  </View>
     
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    registrationState: isDeviceRegistered =>
      dispatch({type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered}),
    storeServerUrl: serverUrl =>
      dispatch({type: 'STORE_SERVER_URL', serverUrl}),
    clearURL: () => dispatch({type: 'CLEAR_URL'}),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnRegister);
