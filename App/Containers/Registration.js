import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  ImageBackground,
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
import NetInfo from '@react-native-community/netinfo';
import {isRegExp} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../Components/Shared/InputField';
let Window = Dimensions.get('window');
// Styles
//import styles from './Styles/RegistrationStyle'

class Registration extends Component {
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
      screenWidth: Dimensions.get('window').width,
    };
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
    );
    console.log('url:' + this.props.data.audits.serverUrl);
  }

  RestoringLoginData = async () => {
    try {
      const active = await AsyncStorage.getItem('isActive');
      console.log('isActive status:' + active);
      if (active !== null && active == 'yes') {
        this.setState({isDeviceRegistered: true});
        console.log('isdeviceregister status:' + this.isDeviceRegistered);
        this.props.registrationState(this.state.isDeviceRegistered);
        this.props.storeDeviceid(this.state.deviceId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleDimensionChange);

    async () =>{
      AsyncStorage.setItem('NCSettingvalue', JSON.stringify(data.data.Data.ncofisetting));

    }
    console.log('unregisterlog5');
    this.getdeviceRegisterStatus();
    console.log('******************* printing here *********************');
    DeviceInfo.getUniqueId().then(deviceId => {
      this.setState(
        {
          deviceId,
        },
        () => {
          console.log('Registration screen mounted successfully!');
          this.RestoringLoginData();
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
          // console.log('Received params',this.props.navigation.state.params)

          if (this.props.navigation.state.params) {
            this.isRedirectFromLogin = true;
            console.log('checking navigation state params');
          }

          console.log(
            'isredirectfromlogin ',
            this.isRedirectFromLogin,
            this.props.data.audits.isOfflineMode,
          );

          if (this.props.data.audits.isOfflineMode) {
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
                    await AsyncStorage.setItem('deviceid', this.state.deviceId);
                    this.props.storeDeviceid(this.state.deviceId);
                    // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                  },
                );
              }
            }
            console.log('Offline mode!');
            this.refs.toast.show(strings.Offline_Notice, 2000);
          } else {
            console.log(
              'this.state.deviceId',
              this.state.deviceId,
              this.state.serverUrl,
            );
            //this.checkRegistrationStatus(this.state.deviceId)
            if (this.state.serverUrl !== '') {
              this.checkRegistrationStatus(this.state.deviceId);
            } else {
              console.log('Hitting here 1 else component');
              this.setState(
                {
                  isDeviceRegistered: false,
                  isLoading: false,
                  deviceRegistration: 'no',
                },
                async () => {
                  await AsyncStorage.setItem('isdeviceregistered', 'no');
                  console.log('registere2');
                  this.props.registrationState(this.state.isDeviceRegistered);
                  await AsyncStorage.setItem('deviceid', this.state.deviceId);
                  this.props.storeDeviceid(this.state.deviceId);
                },
              );
              console.log('Server url is empty');
            }
          }
        },
      );
    });
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleDimensionChange);
  }
  async checkRegistrationStatus(deviceId) {
    NetInfo.fetch().then(netState => {
      console.log('netstate is', netState.isConnected);
      if (netState.isConnected) {
        console.log('this.state.deviceId', deviceId);
        //console.log('data value '+ data)
        auth.checkRegistrationStatus(
          deviceId, //this.state.deviceId,
          async (res, data) => {
            if (data.data) {
              let isRegistered = false;
              console.log('data.data', data.data);
              if (data.data.Data) {
                if (
                  data.data.Data.SSOActive !== null &&
                  data.data.Data.SSOActive !== undefined
                ) {
                  isRegistered = data.data.Data.SSOActive;
                  this.storeSSoCreds(isRegistered);
                  //1q1this.storeSSoCreds(true);
                }
                console.log('isRegistered::::----', isRegistered.toString());
                await AsyncStorage.setItem('isRegistered', isRegistered.toString())
                if (
                  data.data.Data.SSOFlags !== null &&
                  data.data.Data.SSOFlags !== undefined &&
                  Object.keys(data.data.Data.SSOFlags).length > 0 &&
                  isRegistered === true
                ) {
                  this.storeSSoConfig(data.data.Data.SSOFlags);
                } else {
                  //this.storeSSoConfig({});
                }
                console.log('data.data.Data', data.data.Data);
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
                );
                //if (data.data.Data.Active || data.data.Data.ServerUrl || data.data.Data.ServerUrl != '') {
                if (
                  data.data.Data.Active ||
                  this.props.data.audits.isDeviceRegistered == true
                ) {
                  console.log('if serverurl not empty then allowed!');
                  if (
                    data.data.Data.ServerUrl &&
                    data.data.Data.ServerUrl != ''
                  ) {
                    this.props.storeServerUrl(data.data.Data.ServerUrl);
                    await AsyncStorage.setItem(
                      'storedserverrul',
                      this.state.serverUrl,
                    );
                    auth.setServerUrl(data.data.Data.ServerUrl);
                  }

                  if (!this.isRedirectFromLogin) {
                    this.props.registrationState(true);
                    await AsyncStorage.setItem('deviceid', this.state.deviceId);
                    this.props.storeDeviceid(this.state.deviceId);
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
                await AsyncStorage.setItem('isRegistered', 'true')

                        this.props.registrationState(
                          this.state.isDeviceRegistered,
                        );
                        await AsyncStorage.setItem(
                          'deviceid',
                          this.state.deviceId,
                        );
                        this.props.storeDeviceid(this.state.deviceId);
                        // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                      },
                    );
                  }
                } else {
                  console.log('Device is not registered with us!');
                  this.setState(
                    {
                      isDeviceRegistered: false,
                      isLoading: false,
                      deviceRegistration: 'no',
                    },
                    async () => {
                      await AsyncStorage.setItem('isdeviceregistered', 'no');

                      console.log('registere1');
                      this.props.registrationState(
                        this.state.isDeviceRegistered,
                      );
                      await AsyncStorage.setItem(
                        'deviceid',
                        this.state.deviceId,
                      );
                      this.props.storeDeviceid(this.state.deviceId);
                      // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                      this.refs.toast.show(strings.NotReg, 2000);
                    },
                  );
                }
              } else {
                console.log('Hitting here 1');
                this.setState(
                  {
                    isDeviceRegistered: false,
                    isLoading: false,
                    deviceRegistration: 'no',
                  },
                  async () => {
                    await AsyncStorage.setItem('isdeviceregistered', 'no');
                    console.log('registere2');
                    this.props.registrationState(this.state.isDeviceRegistered);
                    await AsyncStorage.setItem('deviceid', this.state.deviceId);
                    this.props.storeDeviceid(this.state.deviceId);
                    // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                    this.refs.toast.show(strings.server_reach_error, 2000);
                  },
                );
              }
            }
          },
        );
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
                await AsyncStorage.setItem('deviceid', this.state.deviceId);
                this.props.storeDeviceid(this.state.deviceId);
                // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
              },
            );
          }
        }
        console.log('No Internet Connection found!');
        this.refs.toast.show(strings.NoInternet, 2000);
      }
    });
  }

  async getdeviceRegisterStatus() {
    this.setState({
      deviceRegistration: await AsyncStorage.getItem('isdeviceregistered'),
    });
    console.log(this.state.deviceRegistration, 'deviceregistrationstatus');
  }

  storeSSoCreds = async sso => {
    console.log('Registration:SSO_Status', sso);
    sso =
      sso === undefined ||
      sso === null ||
      sso === '' ||
      sso === false ||
      sso === 'false'
        ? 'false'
        : 'true';
    await AsyncStorage.setItem('sso_login_state', sso.toString());
  };

  storeSSoConfig = async ssoConfig => {
    console.log('in', ssoConfig);
    await AsyncStorage.setItem('sso_config_flags', JSON.stringify(ssoConfig));
    await AsyncStorage.setItem('sso_issuer', JSON.stringify(ssoConfig.issuer));
    await AsyncStorage.setItem(
      'sso_clientid',
      JSON.stringify(ssoConfig.clientId),
    );
    await AsyncStorage.setItem(
      'sso_redirecturl',
      JSON.stringify(ssoConfig.redirectUri),
    );
  };

  onPress = type => {
    console.log('typereg', type);

    var re = /^https?\:\/\/[^\/\s]+(\/.*)?$/;
    if (this.state.serverUrl === '') {
      this.refs.toast.show(strings.EmptyURL);
    } else if (!re.test(this.state.serverUrl)) {
      this.refs.toast.show(strings.InvURL);
    } else {
      console.log('serverUrl', this.state.serverUrl);
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
              async () => {
                if (
                  this.state.serverUrl != null &&
                  this.state.serverUrl != ''
                ) {
                  this.props.storeServerUrl(this.state.serverUrl);
                  await AsyncStorage.setItem(
                    'storedserverrul',
                    this.state.serverUrl,
                  );
                  auth.setServerUrl(this.state.serverUrl);
                }

                auth.registerDevice(
                  this.state.deviceId,
                  this.state.serverUrl,
                  type,
                  (res, data) => {
                    console.log('Response data', data.data);

                    if (data.data) {
                      if (data.data.Success === true) {
                        if (data.data.Data == 'Already 5 Device Registered!') {
                          // console.log('Device registration failed!')
                          this.setState(
                            {
                              isDeviceRegistered: false,
                              isLoading: false,
                              deviceRegistration: 'no',
                            },
                            async () => {
                              await AsyncStorage.setItem(
                                'isdeviceregistered',
                                'no',
                              );
                              console.log('registere3');
                              this.props.registrationState(
                                this.state.isDeviceRegistered,
                              );
                              await AsyncStorage.setItem(
                                'deviceid',
                                this.state.deviceId,
                              );
                              this.props.storeDeviceid(this.state.deviceId);
                              this.checkRegistrationStatus(this.state.deviceId);
                              // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
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
                                this.checkRegistrationStatus(
                                  this.state.deviceId,
                                );
                                this.props.storeDeviceid(this.state.deviceId);
                                // Forward to landing page
                                this.props.navigation.navigate('LaunchScreen');
                              },
                            );
                          } else {
                            console.log('Device is unregistered.');
                            this.setState(
                              {
                                isDeviceRegistered: false,
                                isLoading: false,
                                deviceRegistration: 'no',
                              },
                              async () => {
                                await AsyncStorage.setItem(
                                  'isdeviceregistered',
                                  'no',
                                );
                                console.log('registere4');
                                // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                                this.props.registrationState(
                                  this.state.isDeviceRegistered,
                                );
                                await AsyncStorage.setItem(
                                  'deviceid',
                                  this.state.deviceId,
                                );
                                console.log('helloenteringreg');
                                this.props.storeDeviceid(this.state.deviceId);
                                // Forward to landing page
                                this.refs.toast.show(strings.Unreg, 2000);
                              },
                            );
                          }
                        }
                      } else {
                        // console.log('Device registration failed!')
                        this.setState(
                          {
                            isDeviceRegistered: false,
                            isLoading: false,
                            deviceRegistration: 'no',
                          },
                          async () => {
                            await AsyncStorage.setItem(
                              'isdeviceregistered',
                              'no',
                            );
                            console.log('registere5');
                            // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
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
                          deviceRegistration: 'no',
                        },
                        async () => {
                          await AsyncStorage.setItem(
                            'isdeviceregistered',
                            'no',
                          );
                          console.log('registere6');
                          this.props.registrationState(
                            this.state.isDeviceRegistered,
                          );
                          await AsyncStorage.setItem(
                            'deviceid',
                            this.state.deviceId,
                          );
                          this.props.storeDeviceid(this.state.deviceId);
                          // console.log('isDeviceRegistered =>',this.state.isDeviceRegistered)
                          // this.refs.toast.show(strings.NotReg, 2000)
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
  goToRegister() {
    this.props.navigation.navigate('Registration');
  }
  handleDimensionChange = ({window}) => {
    this.setState({screenWidth: window.width});
  };

  render() {
    const {screenWidth} = this.state;

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
            {this.state.isDeviceRegistered == 'yes' ? (
              <TouchableOpacity
                onPress={this.backFromReg}
                style={styles.backlogo}>
                <Icon name={'angle-left'} size={30} color={'#2EA4E2'} />
              </TouchableOpacity>
            ) : null}
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
          <View style={{flex: 0.25}}>
            <InputField
              placeholder={'Enter Registration URL'}
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
                    {'Unregister'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
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
      // <View style={styles.mainContainer}>
      //   {
      //     this.state.isLoading ? (
      //       <View
      //         style={{
      //           paddingVertical: 20,
      //           borderTopWidth: 1,
      //           borderColor: '#CED0CE',
      //           width: Window.width,
      //           height: 300,
      //           flex: 1,
      //           flexDirection: 'column',
      //           alignItems: 'center',
      //           paddingTop: parseInt(Window.height / 2 - 50),
      //         }}>
      //         <ResponsiveImage
      //           source={Images.loadingLogo}
      //           initWidth="310"
      //           initHeight="69"
      //         />
      //       </View>
      //     ) : (
      //       /* (!this.state.isDeviceRegistered) ? */
      //       <View style={styles.mainContainer}>
      //         <OfflineNotice />
      //         <Image
      //           source={Images.LoginBack2}
      //           style={styles.backgroundImage}
      //         />

      //         {this.state.isDeviceRegistered == 'yes' ? (
      //           <TouchableOpacity
      //             onPress={this.backFromReg}
      //             style={styles.backlogo}>
      //             <View>
      //               {/* <ResponsiveImage source={Images.BackIcon} initWidth="13" initHeight="22" /> */}
      //               <Icon name="angle-left" size={40} color="#2EA4E2" />
      //             </View>
      //           </TouchableOpacity>
      //         ) : null}

      //         <View style={{flexDirection: 'column', position: 'absolute'}}>
      //           <View style={styles.loginOmnexlogoDiv}>
      //             <View style={styles.loginOmnexlogo}>
      //               <ResponsiveImage
      //                 source={Images.loadingLogo}
      //                 initWidth="310"
      //                 initHeight="69"
      //               />
      //               {/* <Text style={styles.headingText}>Registration</Text> */}
      //             </View>
      //           </View>

      //           <View style={styles.loginOmnexlogoDiv2}>
      //             {/* <View style={[styles.labelTitle]}>
      //               <Text style={styles.titleText}>{strings.Server_Url}</Text>
      //             </View> */}
      //             <View style={styles.inputBox1}>
      //               <TextInput
      //                 style={{
      //                   borderBottomWidth: 0.5,
      //                   borderBottomColor: 'lightgrey',
      //                   width: '87%',
      //                   fontSize: Fonts.size.regular,
      //                   padding: 15,
      //                   paddingTop: 10,
      //                   fontFamily: 'OpenSans-Regular',
      //                 }}
      //                 placeholder={strings.Server_Url}
      //                 // underlineColorAndroid='grey'
      //                 autoCapitalize={'none'}
      //                 //autoFocus={true}
      //                 returnKeyType={'done'}
      //                 autoCorrect={false}
      //                 value={this.state.serverUrl}
      //                 onChangeText={serverUrl => this.setState({serverUrl})}
      //                 onBlur={this.serverUrlVal}
      //                 multiline={true}
      //               />
      //               {/* <InputField
      //               placeholder='Server Url'
      //               autoCapitalize={'none'}
      //               returnKeyType={'done'}
      //               autoCorrect={false}
      //               value={this.state.serverUrl}
      //               onChangeText={(serverUrl) => this.setState({serverUrl})}
      //               onBlur={this.serverUrlVal}
      //               type={'ServerUrl'}
      //             /> */}
      //             </View>

      //             <View
      //               style={{
      //                 flexDirection: 'row',
      //                 width: '100%',
      //                 paddingTop: 10,
      //               }}>
      //               {this.state.deviceRegistration == 'no' || this.state.deviceRegistration == false || this.state.deviceRegistration == undefined ||
      //               this.state.deviceRegistration == null ? (
      //                 <View style={styles.inputBoxSettings}>
      //                   <TouchableOpacity onPress={this.onPress.bind(this, 1)}>
      //                     {/* <ResponsiveImage source={Images.LOGIN} initWidth="1000" initHeight="120" style={{width: width(90)}}/>
      //                 <View style={{position:'absolute'}}>
      //                   <Text style={{fontSize: Fonts.size.input , color:'#fff'}}>Register</Text>
      //                 </View> */}
      //                     <LinearGradient
      //                       start={{x: 0, y: 0}}
      //                       end={{x: 1, y: 0}}
      //                       colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
      //                       style={styles.SettingsBtn01}>
      //                       {this.state.deviceRegistration === 'yes' ? (
      //                         <Text style={styles.buttonText}>
      //                           {strings.Unregister}
      //                         </Text>
      //                       ) : (
      //                         <Text style={styles.buttonText}>
      //                           {strings.Register}
      //                         </Text>
      //                       )}
      //                     </LinearGradient>
      //                   </TouchableOpacity>
      //                 </View>
      //               ) : (
      //                 <View style={styles.inputBoxSettings}>
      //                   <TouchableOpacity onPress={this.onPress.bind(this, 2)}>
      //                     {/* <ResponsiveImage source={Images.LOGIN} initWidth="1000" initHeight="120" />
      //                 <View style={{position:'absolute'}}>
      //                   <Text style={{fontSize: Fonts.size.input , color:'#fff'}}>Unregister</Text>
      //                 </View> */}
      //                     <LinearGradient
      //                       start={{x: 0, y: 0}}
      //                       end={{x: 1, y: 0}}
      //                       colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
      //                       style={styles.SettingsBtn01}>
      //                       <Text style={styles.buttonText}>
      //                         {strings.Unregister}
      //                       </Text>
      //                     </LinearGradient>
      //                   </TouchableOpacity>
      //                 </View>
      //               )}
      //             </View>
      //           </View>
      //         </View>
      //       </View>
      //     )
      //     /* :
      //     <View></View> */
      //   }
      //   <Toast
      //     ref="toast"
      //     style={{backgroundColor: 'black', margin: 20}}
      //     position="top"
      //     positionValue={400}
      //     fadeInDuration={750}
      //     fadeOutDuration={1000}
      //     opacity={0.8}
      //     textStyle={{color: 'white'}}
      //   />
      // </View>
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
    storeDeviceid: deviceid => dispatch({type: 'STORE_DEVICEID', deviceid}),
    storeServerUrl: serverUrl =>
      dispatch({type: 'STORE_SERVER_URL', serverUrl}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
