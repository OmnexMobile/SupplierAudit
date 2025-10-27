import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Switch,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
  StyleSheet,
  Linking,
  Modal,
  Share,
} from 'react-native';
import {Images} from '../Themes';
import styles from './Styles/UserPreferenceStyle';
import {width} from 'react-native-dimension';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import OfflineNotice from '../Components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import {Dropdown} from 'react-native-element-dropdown';
import {debounce, once} from 'underscore';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {type} from 'ramda';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authorize, logout} from 'react-native-app-auth';
import CryptoJS from 'crypto-js';
import auth from '../Services/Auth';
import LinearGradient from 'react-native-linear-gradient';

let Window = Dimensions.get('window');

class UserPreference extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,

      enableOffline: this.props.data.audits.isOfflineMode ? true : false,
      SupplierManagementAccess: '',
      siteID: this.props.data.audits.siteId,
      SiteName: '',
      data: [],
      value: '',
      modalVisible: false,
      ssoConfig: '',
      ssoConfigObj: '',
      dateFormat: [
        {
          value: 'DD-MM-YYYY',
          id: 1,
        },
        {
          value: 'MM-DD-YYYY',
          id: 2,
        },
        {
          value: 'DD/MM/YYYY',
          id: 3,
        },
        {
          value: 'MM/DD/YYYY',
          id: 4,
        },
        {
          value: 'DD/MMM/YYYY',
          id: 5,
        },
        {
          value: 'DD-MMM-YYYY',
          id: 6,
        },
      ],
    };
    this.arrayNew = [
      {name: 'Robert'},
      {name: 'Bryan'},
      {name: 'Vicente'},
      {name: 'Tristan'},
      {name: 'Marie'},
      {name: 'Onni'},
      {name: 'sophie'},
      {name: 'Brad'},
      {name: 'Samual'},
      {name: 'Omur'},
      {name: 'Ower'},
      {name: 'Awery'},
      {name: 'Ann'},
      {name: 'Jhone'},
      {name: 'z'},
      {name: 'bb'},
      {name: 'cc'},
      {name: 'd'},
      {name: 'e'},
      {name: 'f'},
      {name: 'g'},
      {name: 'h'},
      {name: 'i'},
      {name: 'j'},
      {name: 'k'},
      {name: 'l'},
    ];
  }

  componentDidMount() {
    this.getSsoCreds();
    this.getDeviceId();

    // this.fetchSsoToken(); // Call the async function
  }
  updateFormat() {
    var selectedFormat = this.state.selectedFormat;
    this.props.storeDateFormat(selectedFormat);
    this.refs.toast.show(strings.SaveToast, DURATION.LENGTH_SHORT);
    setTimeout(() => {
      console.log('props updated', this.props);
    }, 1000);
  }

  onSave() {
    this.updateFormat();
  }
  setModalVisiblecheck = visible => {
    // this.setState({ modalVisible: visible });
    this.ssoOnPress(visible);
  };
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
    // this.ssoOnPress(visible);
  };
  getSsoCreds = async () => {
    try {
      let sso = await AsyncStorage.getItem('sso_login_state');
      console.log('sso_login_state', sso);
      //sso = true;
      if (
        sso !== null &&
        sso !== undefined &&
        (sso === 'true' || sso === true)
      ) {
        let ss_configs = await AsyncStorage.getItem('sso_config_flags');
        if (ss_configs && Object.keys(JSON.parse(ss_configs)).length > 0) {
          this.setState({
            ssoConfigObj: JSON.parse(ss_configs),
            ssoEnabled: true,
            checkboxSelection: 'sso',
          });
        }
      } else {
        //} if (sso === 'false' || sso === false) {
        this.setState({
          ssoEnabled: false,
          checkboxSelection: 'ewqims',
        });
      }
    } catch (err) {
      console.log('<==JS==>  getSsoCreds catch', err);
    }
  };
  ssoOnPress = async visible => {
    let issuerurl = await AsyncStorage.getItem('sso_issuer');
    let clientid = await AsyncStorage.getItem('sso_clientid');
    let redirecturl = await AsyncStorage.getItem('sso_redirecturl');
    console.log('insidessoooo');

    // this.state.ssoConfigObj -> is fetched from API so it makes sense to use it

    //Forvia SSO : https://aser0001.ww.faurecia.com/as/authorization.oauth2?
    //client_id=omnexmobile_backend
    //&response_type=code
    //&redirect_uri=https://qa2.ewqims.com/auditproapi/api/sso
    //&scope=openid
    //&client_secret=yMOU78zoII6iNe5dRfMp65gM5mKKIaXp8QBfYlT3IwGEmPfdxJlqhcFCwOg01Z4U
    //&grant_type=authorization_code
    const isDeviceRegisteredLog = await AsyncStorage.getItem(
      'isdeviceregistered',
    );

    if (isDeviceRegisteredLog == 'no') {
      console.log('checking the device Registered or not-----------');
      //  alert('Register the device before login..')
    } else {
      this.setState({progressVisible: true});
      try {
        console.log(
          'entersso-.this.state.ssoConfigObj,',
          this.state.ssoConfigObj,
        );
        var additionalParameters = JSON.parse([
          this.state.ssoConfigObj.discoveryUri.replace(/'/g, '"'),
        ]);
        var tokenEndPoint = this.state.ssoConfigObj.endSessionRedirectUri;
        tokenEndPoint =
          tokenEndPoint === ''
            ? this.state.ssoConfigObj.customUriScheme
            : tokenEndPoint;
        console.log('additionalParameters', additionalParameters);
        this.setState({loginFlag: 1});
        const redirectUri =
          Platform.OS == 'ios'
            ? 'com.omnex.suppliermanagement'
            : 'com.omnex.suppliermanagement';
        let myConfig = {
          issuer: this.state.ssoConfigObj.issuer, //'https://aser0001.ww.faurecia.com',
          serviceConfiguration: {
            authorizationEndpoint: this.state.ssoConfigObj.customUriScheme, //'https://aser0001.ww.faurecia.com/as/authorization.oauth2',//
            tokenEndpoint: this.state.ssoConfigObj.endSessionRedirectUri, //'https://aser0001.ww.faurecia.com/as/token.oauth2',//
            endSessionEndpoint: this.state.ssoConfigObj.redirectUrl, //logout
          },
          //grantType: 'authorization_code',
          clientId: this.state.ssoConfigObj.clientId, // 'omnexmobile_backend', //
          clientSecret: additionalParameters.client_secret, //'yMOU78zoII6iNe5dRfMp65gM5mKKIaXp8QBfYlT3IwGEmPfdxJlqhcFCwOg01Z4U',
          redirectUrl: redirectUri + ':/callback', //this.state.ssoConfigObj.redirectUrl,//'https://forvia.omnexewqims.com/auditproapi/api/sso', /// '#https://qa2.ewqims.com/auditproapi/api/sso',
          scopes: ['openid', 'email'], // [this.state.ssoConfigObj.scope],//[openid email]
          usePKCE: additionalParameters.usepkce,
          useNonce: additionalParameters.usenounce,
          responseTypes: additionalParameters.resptype,
          additionalParameters: {
            grant_type: additionalParameters.grant_type,
          },
        };

        console.log('SSO Config1:', myConfig);
        const resultAuth = await authorize(myConfig);
        /* const id = resultAuth.idToken;
       const logauth = await logout(myConfig, {
         idToken : id,
         postLogoutRedirectUrl : 'org.omnex.auditpro:/'
       });
     
       console.log('logauth', logauth);*/

        console.log(resultAuth, 'resultauth');
        this.loginCall(resultAuth.accessToken, '', this.state.loginFlag, {
          config: myConfig,
          token: {
            tokenToRevoke: resultAuth.accessToken,
            sendClientId: true,
          },
        });
      } catch (err) {
        console.log('<==JS==> SSO LOGIN Catchsign', err);
        this.setState({
          progressVisible: false,
          ssoConfig: err?.message || JSON.stringify(err),
          modalVisible: true,
        });
      }
    }
  };

  async getDeviceId() {
    this.setState({
      deviceId: await AsyncStorage.getItem('deviceid'),
    });
  }
  loginCall = (email, password, loginflag, isSso) => {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    console.log('checkinglogin', loginflag);
    var encryptedpassword = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    // console.log('login submit fcmToken',this.state.fcmToken)
    console.log('hi', auth.loginUser);
    console.log('Device ID:' + this.state.deviceId);
    console.log('Device ID:' + this.props.data.audits.deviceregisterdetails);

    //  this.storeData('loginDeviceId', this.state.deviceId);
    //  this.storeData('loginFcmToken', this.state.fcmToken);
    //  this.storeData('loginEmail', email);
    auth.loginUser(
      email,
      encryptedpassword.toString(),
      this.state.fcmToken,
      this.state.deviceId,
      loginflag,
      isSso,
      (res, data) => {
        console.log('loginUser', data);
        console.log('checkingloginUserresponse', res);
        //this.props.storeSupplierManagement("true");
        if (data.data.Success == true) {
          console.log(
            'data value checking' + data.data.Data[0].SupplierManagementAccess,
          );
          //  this.props.storeLoginData(data.data.Data);
          this.props.storeSupplierManagement(
            data.data.Data[0].SupplierManagementAccess,
          );
          console.log('storeUserName', email);
          this.setState({modalVisible: true, ssoConfig: email});

          //  this.props.storeUserName(email);
          this.setState(
            {
              userId: data.data.Data[0].UserId.toString(),
              siteId: data.data.Data[0].Siteid,
              accessToken: data.data.Token,
              userFullName: data.data.Data[0].FullName,
            },
            () => {
              // console.log('userFullName',this.state.userFullName)
              // call below 2 methods later zzzss
              // this.getProfileCall(this.state.accessToken)
              // this.getYearAudit()
              this.getProfileCall(this.state.accessToken);
              //  this.checkUser(this.state.userId, this.state.accessToken);

              // alert('ok')
            },
          );
        } else {
          this.setState(
            {
              progressVisible: false,
            },
            () => {
              // this.refs.toast.show(data.data.Message, DURATION.LENGTH_LONG);
              Alert.alert(data.data.Message);
            },
          );
        }
      },
    );
  };

  getProfileCall(token) {
    var Token = token;
    // console.log('Profile getting details...',Token)
    //alert('profile called --login')
    auth.getProfile(Token, (res, data) => {
      console.log('---88888>', data);
      if (data.data) {
        if (data.data.Message === 'Success') {
          // console.log('getting into if',data)
          //alert('Profile data get --login')
          this.setState(
            {
              Address: data.data.Data.Address,
              CompanyName: data.data.Data.CompanyName,
              CompanyUrl: data.data.Data.CompanyUrl,
              Logo: data.data.Data.Logo,
              Phone: data.data.Data.Phone,
            },
            () => {
              // console.log('settings address...',this.state.Address)
              // console.log('setting companyname...',this.state.CompanyName)
              // console.log('setting CompanyUrl',this.state.CompanyUrl)
              // console.log(' setting Logo...',this.state.Logo)
              // console.log('setting Phone...',this.state.Phone)
              //  this._storeToken();
            },
          );
        } else {
          this.refs.toast.show(
            strings.ProfileFetchFailed,
            DURATION.LENGTH_LONG,
          );
        }
      } else {
        this.refs.toast.show(strings.ProfileFetchFailed, DURATION.LENGTH_LONG);
      }
    });
  }

  async fetchSsoToken() {
    try {
      let sso_login_token = await AsyncStorage.getItem('token');
      console.log('checkkkkkfetchtoken', sso_login_token);
      this.setState({
        ssoConfig: sso_login_token,
      });
    } catch (error) {
      console.error('Error fetching SSO token:', error);
    }
  }
  copyToClipboard = async () => {
    // const jsonData = JSON.stringify(this.state.ssoConfig, null, 2);
    const jsonData = this.state.ssoConfig;

    // Convert JSON to string with formatting
    try {
      await Share.share({message: jsonData});
    } catch (error) {
      console.error('Error sharing text:', error);
    }
  };
  changeOfflineMode() {
    this.setState(
      {
        enableOffline: !this.state.enableOffline,
      },
      () => {
        this.props.changeOfflineModeState(this.state.enableOffline);
        setTimeout(
          function () {
            if (!this.state.enableOffline) {
              console.log(
                'Offline mode disabled.',
                this.props.data.audits.isOfflineMode,
              );
              this.refs.toast.show(
                strings.SaveOfflineDisabledToast,
                DURATION.LENGTH_SHORT,
              );
            } else {
              console.log(
                'Offline mode enabled.',
                this.props.data.audits.isOfflineMode,
              );
              this.refs.toast.show(
                strings.SaveOfflineEnabledToast,
                DURATION.LENGTH_SHORT,
              );
            }
          }.bind(this),
          50,
        );
      },
    );
  }

  componentWillReceiveProps() {
    var logindata = this.props.data.audits.logindata;

    if (logindata != null) {
      for (var j = 0; j < logindata.length; j++) {
        if (logindata[j].Siteid == this.props.data.audits.siteId) {
          this.setState({
            SiteName: logindata[j].SiteName,
          });
        }
      }
    }
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  searchItems = text => {
    const newData = this.arrayNew.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
      value: text,
    });
  };

  onSelectedItemsChange = selectedItems => {};
  icon = ({name, size = 18, style}) => {
    // flatten the styles
    const flat = StyleSheet.flatten(style);
    // remove out the keys that aren't accepted on View
    const {color, fontSize, ...styles} = flat;

    let iconComponent;

    const iconColor =
      color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '';

    const Down = <Icon name="caret-down" size={20} color="grey" />;

    switch (name) {
      case 'keyboard-arrow-down':
        iconComponent = Down;
        break;
      default:
    }
    return <View style={styles}>{iconComponent}</View>;
  };

  //Version Check
  checkAppVersion = async () => {
    try {
      const latestVersion =
        Platform.OS === 'ios'
          ? await fetch(
              `https://itunes.apple.com/in/lookup?bundleId=org.omnex.auditpro`,
            )
              .then(r => r.json())
              .then(res => {
                return res?.results[0]?.version;
              })
          : await VersionCheck.getLatestVersion({
              provider: 'playStore',
              packageName: 'com.omnex.suppliermanagement',
              ignoreErrors: true,
            });

      const currentVersion = VersionCheck.getCurrentVersion();

      if (latestVersion > currentVersion) {
        const url =
          Platform.OS === 'ios'
            ? await VersionCheck.getAppStoreUrl({appID: '6450008049'})
            : await VersionCheck.getPlayStoreUrl({
                packageName: 'com.omnex.suppliermanagement',
              });
        console.log(
          'store url',
          await VersionCheck.getAppStoreUrl({appID: '6450008049'}),
        );

        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue using the app.',
          [
            {
              text: 'Update Now',
              onPress: () => Linking.openURL(url),
            },
            {
              text: 'Later',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert('Update not required', 'This is the latest version');
        // App is up-to-date; proceed with the app
      }
    } catch (error) {
      // Handle error while checking app version
      console.error('Error checking app version:', error);
    }
  };

  render() {
    let data = [];
    var logindata = this.props.data.audits.logindata;
    let section_list = [];

    console.log(this.state.siteID, typeof this.state.siteID, 'section_list');

    if (logindata != null) {
      for (var i = 0; i < logindata.length; i++) {
        data.push({
          //value: logindata?.[i]?.Siteid,
          value: logindata?.[i]?.SiteName,
          SiteID: logindata?.[i]?.Siteid,
          UserId: logindata?.[i]?.UserId,

          FullName: logindata?.[i]?.FullName,

          EntityNode: logindata?.[i]?.EntityNode,

          SupplierManagementAccess: logindata?.[i]?.SupplierManagementAccess,
        });
        section_list.push({
          name: logindata?.[i]?.SiteName,
          id: logindata?.[i]?.Siteid,

          // EntityNode: logindata?.[i]?.EntityNode,

          // SupplierManagementAccess: logindata?.[i]?.SupplierManagementAccess,
        });

        if (logindata?.[i]?.Siteid == this.props.data.audits.siteId) {
          //this.setState({
          //SiteName: logindata?.[i]?.SiteName
          //})
        }
        console.log(
          'vs===>',
          this.props.data.audits.siteId,
          this.props.data.audits.logindata?.[i]?.EntityNode,
        );
      }
      /*
      for(var j=0;j<logindata.length;j++){
        if(logindata[j].Siteid== this.props.data.audits.siteId){
          this.setState({
            SiteName: logindata[j].SiteName
          })
        }
      }
      */
    }
    console.log(data + 'data');
    console.log(
      this.props.data.audits.siteId,
      this.props.data.audits.EntityNode,
      'csi',
    );
    console.log('SSiteid', this.state.siteID);
    return (
      <View style={styles.wrapper}>
        {/* <OfflineNotice /> */}
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>{strings.UserSetting}</Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() =>
                  this.props.navigation.navigate('AuditDashboard')
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/** ---------------------- */}
        <ImageBackground
          source={Images.BGlayerFooter}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: '100%',
          }}>
          {/* <ScrollableTabView
            renderTabBar={() =>
              <DefaultTabBar
                backgroundColor='white'
                activeTextColor='#2CB5FD'
                inactiveTextColor='#747474'
                underlineStyle={{ backgroundColor: '#2CB5FD', borderBottomColor: '#2CB5FD' }}
                textStyle={{ fontSize: Fonts.size.regular }}
              />
            }
            tabBarPosition='overlayTop'
          > */}
          <View style={styles.subHeading}>
            <Text style={styles.subText}>{strings.prefferedsettings}</Text>
          </View>
          <View style={styles.scrollViewBody}>
            <View
              style={{
                margin: 10,
                justifyContent: 'center',
              }}>
              <Dropdown
                value={this.state.selectedFormat}
                baseColor={'#A6A6A6'}
                selectedItemColor="#000"
                textColor="#000"
                itemColor="#000"
                labelField="value"
                valueField="value"
                data={this.state.dateFormat}
                label={strings.LabelText}
                fontSize={Fonts.size.regular}
                labelFontSize={Fonts.size.small}
                itemPadding={5}
                dropdownOffset={{top: 10, left: 0}}
                itemTextStyle={{fontFamily: 'OpenSans-Regular'}}
                onChange={value => {
                  console.log('*****', value);
                  for (var i = 0; i < this.state.dateFormat.length; i++) {
                    if (value.value === this.state.dateFormat[i].value) {
                      this.setState({selectedFormat: value.value}, () => {
                        console.log(
                          'selected format is',
                          this.state.selectedFormat,
                        );
                        this.updateFormat();
                      });
                    }
                  }
                }}
              />
            </View>

            {/* <View
              style={{
                margin: 10,
                justifyContent: "center",
              }}
            > */}
            {/* <Dropdown
                //value={this.state.Siteid}
                value={this.state.SiteName}
                baseColor={"#A6A6A6"}
                selectedItemColor="#000"
                textColor="#000"
                itemColor="#000"
                data={data}
                label={strings.siteID}
                fontSize={Fonts.size.regular}
                labelFontSize={Fonts.size.small}
                itemPadding={5}
                dropdownOffset={{ top: 10, left: 0 }}
                itemTextStyle={{ fontFamily: "OpenSans-Regular" }}
                onChangeText={(value) => {
                  console.log("Text", value);
                  for (let i = 0; i < data.length; i++)
                    if (data[i].value == value) {
                      this.setState({
                        SupplierManagementAccess:
                          data[i].SupplierManagementAccess,
                        //siteID: data[i].value,
                        siteID: data[i].SiteID,
                      });
                      this.props.storeSupplierManagement(
                        data[i].SupplierManagementAccess
                      );
                    }
                  console.log("data", data);
                  this.props.storeSiteId(this.state.siteID);
                  //this.props.storeSiteId(259);
                }}
              /> */}
            {/* </View> */}
            {/* <View style={{marginLeft:5}}><Text style={{fontSize:18}}>{"Choose Site here"}</Text></View> */}

            <SectionedMultiSelect
              items={section_list}
              IconRenderer={this.icon}
              single
              uniqueKey="id"
              subKey="children"
              selectText="Choose site..."
              showDropDowns={true}
              hideConfirm
              modalWithTouchable
              styles={{
                chipText: {
                  maxWidth: Dimensions.get('screen').width - 90,
                },
              }}
              onSelectedItemsChange={selectedItems => {
                console.log(selectedItems, 'selctedItems');
                const value = selectedItems[0];
                for (let i = 0; i < data.length; i++)
                  if (data[i].SiteID == value) {
                    console.log('Text', value, data);
                    this.setState({
                      SupplierManagementAccess:
                        data[i].SupplierManagementAccess,
                      //siteID: data[i].value,
                      siteID: data[i].SiteID,
                    });
                    this.props.storeSupplierManagement(
                      data[i].SupplierManagementAccess,
                    );
                  }
                console.log('data1', data);
                this.props.storeSiteId(value);
              }}
              selectedItems={[this.state.siteID]}
            />

            {/* <View
              style={{
                flex: 1,
                padding: 25,
                width: "98%",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <FlatList
                data={this.state.data}
                renderItem={({ item }) => (
                  <Text style={{ padding: 10 }}>{item.name} </Text>
                )}
                keyExtractor={(item) => item.SiteName}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
              />
            </View> */}
            <View
              style={{
                margin: 10,
                backgroundColor: 'white',
                justifyContent: 'center',
                flexDirection: 'row',
                borderBottomWidth: 0.8,
                borderBottomColor: 'lightgrey',
                marginTop: -5,
                paddingBottom: 7,
              }}>
              <View style={styles.detailTitle}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  Registration Device
                </Text>
                <Text style={styles.offlineDesc}>
                  {this.props.data.audits.serverUrl}
                </Text>
              </View>
            </View>
            <View
              style={{
                margin: 10,
                backgroundColor: 'white',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: -5,
                paddingBottom: 7,
              }}>
              <View style={styles.detailTitle}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  {strings.OfflineMode}
                </Text>
                <Text style={styles.offlineDesc}>
                  {strings.OfflineModeDesc}
                </Text>
              </View>
              <Switch
                style={[styles.switchElement, {marginTop: 5}]}
                value={this.state.enableOffline}
                onValueChange={debounce(this.changeOfflineMode.bind(this), 600)}
              />
            </View>
            {/* <View style={{ //flex: 0.1,
                            flexDirection: 'row',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            marginTop: -5,
                            paddingBottom: 7,backgroundColor:'red',
                          }}>
                <View style={{flex: .6,marginLeft:10}}>
                <TouchableOpacity  style={{ flexDirection: 'row',}}  onPress={this.checkAppVersion.bind(this)}>
                  <View>
                  <Icon name='arrow-circle-o-down' size={25} />
                  </View>
                  <View>
                  <Text style={{fontFamily: 'OpenSans-Regular', fontSize:15 , paddingLeft:5, marginTop:2}}>
                    Check for Update
                  </Text>
                  </View>
                </TouchableOpacity>
                </View>
                 <View style={{flex:.4,backgroundColor:'green',width:50}}>
                <TouchableOpacity style={{flexDirection: 'row', }} 
                  onPress={() => this.setModalVisible(true)}>
                    {/* <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 15, paddingLeft: 5, marginTop: 2 }}>
                    {/* Check for Update */}
            {/* </Text> */}
            {/* </TouchableOpacity>
                </View>
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                marginTop: -5,
                paddingBottom: 7,
              }}>
              <View style={{flex: 0.6, marginLeft: 10}}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={this.checkAppVersion.bind(this)}>
                  <View>
                    <Icon name="arrow-circle-o-down" size={25} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: 15,
                        paddingLeft: 5,
                        marginTop: 2,
                      }}>
                      Check for Update
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Green View with Curved Borders */}
            </View>
            <View
              style={{
                width: '30%',
                height: '5%',
                marginTop: 10,
                marginLeft: '2%',
                marginRight: 20,
                borderRadius: 15,
                overflow: 'hidden', // important for rounding edges
              }}>
              <LinearGradient
                colors={['#2EA4E2', '#14D0AE']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.setModalVisiblecheck(true)}
                  style={{
                    flexDirection: 'row',
                    width: '80%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    SSO
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          {/* </ScrollableTabView> */}
        </ImageBackground>

        {/** --------footer------ */}
        <TouchableOpacity
          onPress={() => this.onSave()}
          style={[styles.footer, {display: 'none'}]}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 65,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                width: width(45),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="save" size={25} color="white" />
              <Text
                style={{
                  color: 'white',
                  fontSize: Fonts.size.regular,
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Save}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <Toast
          ref="toast"
          style={{backgroundColor: 'black', margin: 20}}
          position="top"
          positionValue={300}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                width: 300,
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 10,
              }}>
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => this.setModalVisible(false)}
                style={{alignSelf: 'flex-end'}}>
                <Icon name="times" size={25} />
              </TouchableOpacity>

              {/* Copyable Text */}
              <TouchableOpacity onLongPress={this.copyToClipboard}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginVertical: 20,
                  }}>
                  {this.state.ssoConfig}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    storeDateFormat: userDateFormat =>
      dispatch({type: 'STORE_DATE_FORMAT', userDateFormat}),
    changeOfflineModeState: isOfflineMode =>
      dispatch({type: 'CHANGE_OFFLINE_MODE_STATE', isOfflineMode}),
    storeSupplierData: smdata =>
      dispatch({type: 'STORE_SUPPLIER_DATA', smdata}),
    storeSiteId: siteId => dispatch({type: 'STORE_SITE_ID', siteId}),
    supplierMange: supplierMangeT =>
      dispatch({type: 'STORE_SUPPLY_MANAGE', supplierMangeT}),
    storeSupplierManagement: suppliermanagementstatus =>
      dispatch({type: 'STORE_SUPPLIER_MANAGEMENT', suppliermanagementstatus}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPreference);
