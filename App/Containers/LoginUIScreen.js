import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  CheckBox,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
} from 'react-native';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import CryptoJS from 'crypto-js';
import styles from './Styles/LoginUIScreenStyle';
import InputField from '../Components/Shared/InputField';
import Images from '../Themes/Images';
import Toast, {DURATION} from 'react-native-easy-toast';
import auth from '../Services/Auth';
import {connect} from 'react-redux';
import OfflineNotice from '../Components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import Fonts from '../Themes/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import {width, height} from 'react-native-dimension';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'react-native-firebase';
import NetInfo from '@react-native-community/netinfo';
import {CheckBox as CheckedElement} from 'react-native-elements';
var RNFS = require('react-native-fs');

import {
  Dialog,
  ConfirmDialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import {create} from 'apisauce';
import {add} from 'lodash';
import {authorize, logout} from 'react-native-app-auth';

let Window = Dimensions.get('window');

class LoginUIScreen extends Component {
  TotalFile = [];
  FileArray = [];
  auditRecords = '';
  propsServerUrl = '';

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      userId: '',
      siteId: '',
      accessToken: '',
      Address: '',
      CompanyName: '',
      CompanyUrl: '',
      Logo: '',
      Phone: '',
      ChineseScript: false,
      fcmToken: '',
      //deviceId: DeviceInfo.getUniqueID(),
      //deviceId: this.props.data.audits.deviceregisterdetails,
      deviceId: '',
      existingFile: [],
      progressVisible: false,
      userFullName: '',
      isActiveDirectory: false,
      isAdvalue: true,
      loginFlag: parseInt('')
    };
  }

  componentDidMount() {
    this.getSsoCreds();
    this.getDeviceId();
    // this.checkActiveDirectory();
    console.log(this.props.data.audits, 'serverurllogin');
    var propsServerUrl = this.props.data.audits.serverUrl;
    var cleanURL = propsServerUrl?.replace(/^https?:\/\//, '');

    var formatURL = cleanURL?.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    this.propsServerUrl = formatURL;
    console.log('cleanURL', this.propsServerUrl);
     AsyncStorage.setItem('ssoenableflag',this.state.ssoEnabled);

  

    this.getToken();
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        // console.log('Chinese script on',this.state.ChineseScript)
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        // console.log('Chinese script off',this.state.ChineseScript)
      });
    }
  }

  async getDeviceId() {
    this.setState({
      deviceId: await AsyncStorage.getItem('deviceid'),
    });
  }

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

  // checkActiveDirectory() {
  //   auth.getActiveDirectory((res, data) => {
  //     console.log('Active directory response', data);
  //     if (data == 1) {
  //       this.setState({
  //         isActiveDirectory: true,
  //       });
  //     } else {
  //       this.setState({
  //         isActiveDirectory: false,
  //       });
  //     }
  //   });
  // }

  checkUser(ID, token) {
    var UserStatus = '';
    // console.log('Getting last user session',this.props.data)
    // console.log('User trying to log in',ID)
    var currentID = this.props.data.audits.userId;
    auth.getCheckUser(ID, token, (res, data) => {
      console.log('LoginUI:User information', data);

      if (data.data.Message == 'Success') {
        if (data.data.Data.ActiveStatus)
          UserStatus = data.data.Data.ActiveStatus;
        else {
          //alert('Active Status not getting..:'+data.data.Data.ActiveStatus)
        }
        console.log('LoginUI:Currnt:', currentID, '--', 'id:', ID);
        if (UserStatus == 2) {
          if (currentID != ID) {
            console.log('LoginUI:multipleAuditUser');
            this.multipleAuditUser(ID);
            // this.refillStoreValues(ID);
          } else {
            console.log('LoginUI:Same user detected');
            this.refillStoreValues(ID);
          }
        } else {
          this.setState(
            {
              progressVisible: false,
            },
            () => {
              this.refs.toast.show(
                strings.not_permitted,
                DURATION.LENGTH_SHORT,
              );
            },
          );
        }
      } else {
        this.setState(
          {
            progressVisible: false,
          },
          () => {
            this.refs.toast.show(
              strings.error_connecting,
              DURATION.LENGTH_SHORT,
            );
          },
        );
      }
    });
  }
  multipleAuditUser(ID) {
    //alert('Called multiple audit user')
    var index = undefined;
    var FillArr = [];
    var Files = [];
    var isFileExist = false;
    //alert('MultipleAudit user'+ID)
    // console.log('RNFS.DocumentDirectoryPath',RNFS.DocumentDirectoryPath)
    if (Platform.OS == 'android') {
      RNFS.readDir('/data/user/0/com.omnex.suppliermanagement/cache/AuditUser')
        .then(result => {
          console.log('LoginUI:GOT RESULT', result);
          //alert('got result - readed directory:/data/user/0/com.omnex.auditpro/cache/AuditUser --login'+result)
          //alert('server url:'+this.propsServerUrl+' ID:'+id)
          Files = result;
          for (var i = 0; i < Files.length; i++) {
            console.log('LoginUI:propsURl', this.propsServerUrl, '+', ID);
            if (Files[i].name.includes(this.propsServerUrl + ID)) {
              FillArr.push(Files[i]);
              console.log('LoginUI:FillArr', FillArr);
              //alert("fileArr ---login:"+FillArr)
              index = i;
              isFileExist = true;
              //alert('File exists')
              // console.log('index',i)
              // console.log('&&&',Promise.all([RNFS.stat(Files[index].path), Files[index].path]))
              return Promise.all([
                RNFS.stat(Files[index].path),
                Files[index].path,
              ]);
            }
          }
          if (isFileExist === false) {
            //alert('File exists false')
            index = 0;
            // this.WriteFile(ID)
          }
        })
        .then(statResult => {
          console.log('LoginUI:statResult', statResult);
          if (FillArr.length == 0) {
            this.WriteFile(ID);
            //alert("fill arr lenght --login data:0")
            console.log('LoginUI:hitting here');
          } else {
            console.log('LoginUI:statResult reading', statResult);
            //alert('start result reading --login')
            RNFS.readFile(statResult[1])
              .then(result => {
                console.log(result + 'LoginUI:result value');
                var read = JSON.parse(result);
                console.log('LoginUI:Reading', read);
                // console.log('ID value',ID)
                this.refillStoreValues(ID);
              })
              .catch(err => {
                console.log(err.message, err.code, 'LoginUI:ERR MSG');
              });
          }
        });
    } else {
      // console.log('Ios detected')
      var iOSpath = RNFS.DocumentDirectoryPath;
      RNFS.readDir(iOSpath)
        .then(result => {
          // console.log('GOT RESULT', result);
          Files = result;
          for (var i = 0; i < Files.length; i++) {
            if (Files[i].name.includes(this.propsServerUrl + ID)) {
              FillArr.push(Files[i]);
              // console.log('FillArr',FillArr)
              index = i;
              isFileExist = true;
              // console.log('index',i)
              // console.log('&&&',Promise.all([RNFS.stat(Files[index].path), Files[index].path]))
              return Promise.all([
                RNFS.stat(Files[index].path),
                Files[index].path,
              ]);
            }
          }
          if (isFileExist === false) {
            // console.log('--ios---')
            index = 0;
            // this.WriteFile(ID)
          }
        })
        .then(statResult => {
          // console.log("statResult",statResult)
          if (FillArr.length == 0) {
            // console.log('FillArr is 0')
            this.WriteFile(ID);
            // console.log('hitting here')
          } else {
            // console.log('statResult reading',statResult)
            RNFS.readFile(statResult[1]).then(result => {
              var read = JSON.parse(result);
              // console.log('Reading',read)
              // console.log('ID value',ID)
              this.refillStoreValues(ID);
            });
          }
        })
        .then(contents => {
          // log the file contents
          // console.log('Filestorage',contents)
        })
        .catch(err => {
          // console.log(err.message, err.code);
        });
    }
  }

  WriteFile(id) {
    //alert('write file id:'+id)
    console.log('getting from store', id);
    var UserId = id;
    if (Platform.OS == 'android') {
      var path =
        '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
        '/' +
        this.propsServerUrl +
        UserId;
      console.log('path-->', path);
      // console.log('Before clearing props',this.props.data)
      this.getProfileCall(this.state.accessToken);
      this.getYearAudit();

      setTimeout(() => {
        // console.log('Checking the props after refilling',this.props.data)
        var UserDetails = [];
        UserDetails.push({
          UserId: this.props.data.audits.userId,
          audits: this.props.data.audits,
        });

        // console.log('UserDetails',UserDetails)
        var stringify = JSON.stringify(UserDetails);

        // console.log('Writing new file',stringify)

        // write the file
        RNFS.writeFile(path, stringify, 'utf8')
          .then(success => {
            // console.log('FILE WRITTEN!');

            this.setState(
              {
                progressVisible: false,
              },
              () => {
                //this.props.navigation.navigate('SupplyManage')
                // this.props.navigation.navigate("AllTabAuditList");
                console.log(
                  'supplier management value' +
                    this.props.data.audits.suppliermanagementstatus,
                );
                if (this.props.data.audits.suppliermanagementstatus == 'true') {
                  this.props.navigation.navigate('SupplyManage');
                } else {
                  this.props.navigation.navigate('AllTabAuditList');
                }
              },
            );
          })
          .catch(err => {
            // console.log(err.message);
          });
      }, 500);
    } else {
      var iOSpath = RNFS.DocumentDirectoryPath;
      var path = iOSpath + '/' + this.propsServerUrl + UserId;
      // console.log('path-->',path)
      // console.log('Before clearing props',this.props.data)
      this.getProfileCall(this.state.accessToken);
      this.getYearAudit();
      setTimeout(() => {
        // console.log('Checking the props after refilling',this.props.data)
        var UserDetails = [];
        UserDetails.push({
          UserId: this.props.data.audits.userId,
          audits: this.props.data.audits,
        });

        // console.log('UserDetails',UserDetails)
        var stringify = JSON.stringify(UserDetails);

        // write the file
        RNFS.writeFile(path, stringify, 'utf8')
          .then(success => {
            // console.log('FILE WRITTEN!');
            this.setState(
              {
                progressVisible: false,
              },
              () => {
                //this.props.navigation.navigate('SupplyManage')
                console.log(
                  'supplier management value' +
                    this.props.data.audits.suppliermanagementstatus,
                );
                if (this.props.data.audits.suppliermanagementstatus == 'true') {
                  this.props.navigation.navigate('SupplyManage');
                } else {
                  this.props.navigation.navigate('AllTabAuditList');
                }

                //  this.props.navigation.navigate("AllTabAuditList");
              },
            );
          })
          .catch(err => {
            // console.log(err.message);
          });
      }, 500);
    }
  }

  refillStoreValues(ID) {
    console.log('Store refilling is in progress');
    console.log('getting id from store', ID);
    //alert('refilling store values'+ID)
    var isException = false;
    var UserId = ID;
    if (Platform.OS == 'android') {
      var path =
        '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
        '/' +
        this.propsServerUrl +
        UserId;
      console.log('path-->', path);
      RNFS.readFile(path).then(res => {
        // console.log('reading from the User file',JSON.parse(res))
        var LoggedUserDetails = JSON.parse(res);
        console.log(LoggedUserDetails[0].audits.userName + 'user name');
        if (LoggedUserDetails[0].audits.userName == null) {
          // console.log('Exception handled')
          console.log('not refilled props');
          this.WriteFile(ID);
          isException = true;
        } else {
          console.log('Refillign props', LoggedUserDetails[0].audits);
          var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
          this.props.updateAuditCount(auditCount);
          var dynamicAuditCount =
            LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
          this.props.updateDynamicAuditCount(dynamicAuditCount);

          this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
          this.props.storeUserSession(
            LoggedUserDetails[0].audits.userName,
            LoggedUserDetails[0].audits.userId,
            LoggedUserDetails[0].audits.token,
            LoggedUserDetails[0].audits.siteId,
            LoggedUserDetails[0].audits.address,
            LoggedUserDetails[0].audits.companyname,
            LoggedUserDetails[0].audits.companyurl,
            LoggedUserDetails[0].audits.logo,
            LoggedUserDetails[0].audits.phone,
          );
          //storing user details using asyncstorage
          this.storelogindetails(
            LoggedUserDetails[0].audits.userName,
            LoggedUserDetails[0].audits.userId,
            LoggedUserDetails[0].audits.token,
            LoggedUserDetails[0].audits.siteId,
            LoggedUserDetails[0].audits.address,
            LoggedUserDetails[0].audits.companyname,
            LoggedUserDetails[0].audits.companyurl,
            LoggedUserDetails[0].audits.logo,
            LoggedUserDetails[0].audits.phone,
          );

          var auditRecords = LoggedUserDetails[0].audits.auditRecords;
          this.props.storeAuditRecords(auditRecords);
          var auditList = LoggedUserDetails[0].audits.audits;
          this.props.storeAudits(auditList);
          var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
          this.props.storeYearAudits(getRawStartDate);
          var loginuser = LoggedUserDetails[0].audits.loginuser;
          this.props.storeUserName(loginuser);
          var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
          this.props.storeNCRecords(dupNCrecords);
          var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
          this.props.storeCameraCapture(cameraCapture);
          var newLanguage =
            this.state.ChineseScript === true ? 'Chinese' : 'English';
          this.props.storeLanguage(newLanguage);
          var recentAudits = LoggedUserDetails[0].audits.recentAudits;
          this.props.updateRecentAuditList(recentAudits);
          var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
          this.props.storeServerUrl(ServerUrl);
          var isConnected = LoggedUserDetails[0].audits.isConnected;
          this.props.changeConnectionState(isConnected);
          var bool = LoggedUserDetails[0].audits.isAuditing;
          this.props.changeAuditState(bool);
          var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
          this.props.storeDateFormat(selectedFormat);
          this.props.storeLoginSession(true);
          this.props.storeAuditStats(
            LoggedUserDetails[0].audits.scheduledAudits,
            LoggedUserDetails[0].audits.completedAudits,
            LoggedUserDetails[0].audits.DeadlineViolatedAudits
              .LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
          );
          var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
          this.props.registrationState(bool1);
        }
      });

      setTimeout(() => {
        // console.log('After refilling props',this.props.data)
        var UserDetails = [];
        UserDetails.push({
          UserId: this.props.data.audits.userId,
          audits: this.props.data.audits,
        });

        // console.log('UserDetails',UserDetails)
        var stringify = JSON.stringify(UserDetails);
        if (Platform.OS == 'android') {
          var path =
            '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
            '/' +
            this.propsServerUrl +
            UserId;

          // write the file
          RNFS.writeFile(path, stringify, 'utf8')
            .then(success => {
              // console.log('FILE WRITTEN!');
              this.setState(
                {
                  progressVisible: false,
                },
                () => {
                  //this.props.navigation.navigate('AuditProDashboard')
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
                  console.log(
                    this.props.data.audits.isDeviceRegistered,
                    '********DeviceID********',
                  );
                  // zthis.props.navigation.navigate("AllTabAuditList");z
                  //if (this.props.data.audits.siteId !=''&& this.props.data.audits.userId !=''){
                  //alert('navigated to alltabauditlist')
                  console.log(
                    'supplier management value' +
                      this.props.data.audits.suppliermanagementstatus,
                  );
                  if (
                    this.props.data.audits.suppliermanagementstatus == 'true'
                  ) {
                    this.props.navigation.navigate('SupplyManage');
                  } else {
                    this.props.navigation.navigate('AllTabAuditList');
                  }

                  //}else{
                  //alert('navigated to dashboard to avoid null issue')
                  //  this.props.navigation.navigate('AuditDashboard')
                  //}
                },
              );
            })
            .catch(err => {
              // console.log(err.message);
            });
        } else {
          var iOSpath = RNFS.DocumentDirectoryPath;
          var path = iOSpath + '/' + this.propsServerUrl + UserId;

          // write the file
          RNFS.writeFile(path, stringify, 'utf8')
            .then(success => {
              // console.log('FILE WRITTEN!');
              // this.props.navigation.navigate('AuditProDashboard')
            })
            .catch(err => {
              // console.log(err.message);
            });
        }
      }, 500);
    } else {
      var iOSpath = RNFS.DocumentDirectoryPath;
      var path = iOSpath + '/' + this.propsServerUrl + UserId;
      // console.log('path-->',path)
      RNFS.readFile(path).then(res => {
        // console.log('reading from the User file',JSON.parse(res))
        var LoggedUserDetails = JSON.parse(res);
        if (LoggedUserDetails[0].audits.userName == null) {
          // console.log('Exception handled')
          this.WriteFile(ID);
          isException = true;
        } else {
          console.log('Refillign props', LoggedUserDetails[0]);
          var auditCount = LoggedUserDetails[0].NotificationDetails.auditCount;
          this.props.updateAuditCount(auditCount);
          var dynamicAuditCount =
            LoggedUserDetails[0].NotificationDetails.dynamicAuditCount;
          this.props.updateDynamicAuditCount(dynamicAuditCount);
          this.props.storeSiteId(LoggedUserDetails[0].audits.siteId);
          this.props.storeUserSession(
            LoggedUserDetails[0].audits.userName,
            LoggedUserDetails[0].audits.userId,
            LoggedUserDetails[0].audits.token,
            LoggedUserDetails[0].audits.siteId,
            LoggedUserDetails[0].audits.address,
            LoggedUserDetails[0].audits.companyname,
            LoggedUserDetails[0].audits.companyurl,
            LoggedUserDetails[0].audits.logo,
            LoggedUserDetails[0].audits.phone,
          );
console.log( LoggedUserDetails[0].audits.siteId,"siteidinlogin");

          this.storelogindetails(
            LoggedUserDetails[0].audits.userName,
            LoggedUserDetails[0].audits.userId,
            LoggedUserDetails[0].audits.token,
            LoggedUserDetails[0].audits.siteId,
            LoggedUserDetails[0].audits.address,
            LoggedUserDetails[0].audits.companyname,
            LoggedUserDetails[0].audits.companyurl,
            LoggedUserDetails[0].audits.logo,
            LoggedUserDetails[0].audits.phone,
          );

          var auditRecords = LoggedUserDetails[0].audits.auditRecords;
          this.props.storeAuditRecords(auditRecords);
          var auditList = LoggedUserDetails[0].audits.audits;
          this.props.storeAudits(auditList);
          var getRawStartDate = LoggedUserDetails[0].audits.yearAudits;
          this.props.storeYearAudits(getRawStartDate);
          var dupNCrecords = LoggedUserDetails[0].audits.ncofiRecords;
          this.props.storeNCRecords(dupNCrecords);
          var loginuser = LoggedUserDetails[0].audits.loginuser;
          this.props.storeUserName(loginuser);
          var recentAudits = LoggedUserDetails[0].audits.recentAudits;
          this.props.updateRecentAuditList(recentAudits);
          var cameraCapture = LoggedUserDetails[0].audits.cameraCapture;
          this.props.storeCameraCapture(cameraCapture);
          var newLanguage =
            this.state.ChineseScript === true ? 'Chinese' : 'English';
          this.props.storeLanguage(newLanguage);
          var ServerUrl = LoggedUserDetails[0].audits.serverUrl;
          this.props.storeServerUrl(ServerUrl);
          var isConnected = LoggedUserDetails[0].audits.isConnected;
          this.props.changeConnectionState(isConnected);
          var bool = LoggedUserDetails[0].audits.isAuditing;
          this.props.changeAuditState(bool);
          var selectedFormat = LoggedUserDetails[0].audits.userDateFormat;
          this.props.storeDateFormat(selectedFormat);
          this.props.storeLoginSession(true);
          this.props.storeAuditStats(
            LoggedUserDetails[0].audits.scheduledAudits,
            LoggedUserDetails[0].audits.completedAudits,
            LoggedUserDetails[0].audits.DeadlineViolatedAudits
              .LoggedUserDetails[0].audits.CompletedDeadlineViolatedAudits,
          );
          var bool1 = LoggedUserDetails[0].audits.isDeviceRegistered;
          this.props.registrationState(bool1);
        }
      });

      if (isException == false) {
        setTimeout(() => {
          // console.log('After refilling props',this.props.data)
          var UserDetails = [];
          UserDetails.push({
            UserId: this.props.data.audits.userId,
            audits: this.props.data.audits,
          });

          // console.log('UserDetails',UserDetails)
          var stringify = JSON.stringify(UserDetails);
          if (Platform.OS == 'android') {
            var path =
              '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
              '/' +
              this.propsServerUrl +
              UserId;

            // write the file
            RNFS.writeFile(path, stringify, 'utf8')
              .then(success => {
                // console.log('FILE WRITTEN!');
                this.setState(
                  {
                    progressVisible: false,
                  },
                  () => {
                    //this.props.navigation.navigate('SupplyManage')
                    console.log(
                      'supplier management value' +
                        this.props.data.audits.suppliermanagementstatus,
                    );
                    if (
                      this.props.data.audits.suppliermanagementstatus == 'true'
                    ) {
                      this.props.navigation.navigate('SupplyManage');
                    } else {
                      this.props.navigation.navigate('AllTabAuditList');
                    }

                    //this.props.navigation.navigate("AllTabAuditList");
                  },
                );
              })
              .catch(err => {
                // console.log(err.message);
              });
          } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            var path = iOSpath + '/' + this.propsServerUrl + UserId;

            // write the file
            RNFS.writeFile(path, stringify, 'utf8')
              .then(success => {
                // console.log('FILE WRITTEN!');
                this.setState(
                  {
                    progressVisible: false,
                  },
                  () => {
                    //this.props.navigation.navigate('SupplyManage')
                    //this.props.navigation.navigate("AllTabAuditList");
                    console.log(
                      'supplier management value' +
                        this.props.data.audits.suppliermanagementstatus,
                    );
                    if (
                      this.props.data.audits.suppliermanagementstatus == 'true'
                    ) {
                      this.props.navigation.navigate('SupplyManage');
                    } else {
                      this.props.navigation.navigate('AllTabAuditList');
                    }
                  },
                );
              })
              .catch(err => {
                // console.log(err.message);
              });
          }
        }, 500);
      }
    }
  }
  getProfileCall(token) {
    var Token = token;
    // console.log('Profile getting details...',Token)
    //alert('profile called --login')
    auth.getProfile(Token, (res, data) => {
      // console.log('--->',data)
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
              this._storeToken();
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

  storelogindetails = async (
    username,
    userid,
    token,
    siteid,
    address,
    companyname,
    companyurl,
    logo,
    phone,
    deviceID
  ) => {
    try {
      console.log(
        'storing user session details..' +
          username +
          userid +
          token +
          siteid +
          address +
          companyname +
          companyurl +
          logo +
          phone,
      );
      await AsyncStorage.setItem('userName', username);
      await AsyncStorage.setItem('userId', userid);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('siteId', siteid);
      await AsyncStorage.setItem('address', address);
      await AsyncStorage.setItem('companyname', companyname);
      await AsyncStorage.setItem('companyurl', companyurl);
      await AsyncStorage.setItem('logo', logo);
      await AsyncStorage.setItem('phone', phone);
      await AsyncStorage.setItem('isdeviceregistered', 'yes');
      await AsyncStorage.setItem('isActive', 'yes');
      console.log('storing login details');
    } catch (error) {
      // Error saving data
    }
  };

  componentWillReceiveProps() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    // console.log('--CurrentPage--->',CurrentPage)

    if (CurrentPage == 'LoginUIScreen') {
      if (this.props.data.audits.language === 'Chinese') {
        this.setState({ChineseScript: true}, () => {
          // console.log('Chinese props',this.state.ChineseScript)
        });
      } else if (
        this.props.data.audits.language === null ||
        this.props.data.audits.language === 'English'
      ) {
        this.setState({ChineseScript: false}, () => {
          // console.log('English props',this.state.ChineseScript)
        });
      }

      this.getToken();
    } else {
      // console.log('LoginUIScreen Pass')
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      this.setState(
        {
          fcmToken: fcmToken,
        },
        () => {
          // console.log('login fcmToken',this.state.fcmToken)
        },
      );
    }
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        this.setState(
          {
            fcmToken: fcmToken,
          },
          () => {
            // console.log('login fcmToken',this.state.fcmToken)
          },
        );
      }
    }
  }

  ssoOnPress = async () => {
    let issuerurl = await AsyncStorage.getItem('sso_issuer');
    let clientid = await AsyncStorage.getItem('sso_clientid');
    let redirecturl = await AsyncStorage.getItem('sso_redirecturl');

    // this.state.ssoConfigObj -> is fetched from API so it makes sense to use it

    //Forvia SSO : https://aser0001.ww.faurecia.com/as/authorization.oauth2?
    //client_id=omnexmobile_backend
    //&response_type=code
    //&redirect_uri=https://qa2.ewqims.com/auditproapi/api/sso
    //&scope=openid
    //&client_secret=yMOU78zoII6iNe5dRfMp65gM5mKKIaXp8QBfYlT3IwGEmPfdxJlqhcFCwOg01Z4U
    //&grant_type=authorization_code
    const isDeviceRegisteredLog = await AsyncStorage.getItem('isdeviceregistered');

    if(isDeviceRegisteredLog == "no"){
      console.log('checking the device Registered or not-----------');
      alert('Register the device before login..')
    }else{

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
      this.setState({loginFlag:1})
      const redirectUri = 
        Platform.OS == 'ios' ? 'com.omnex.suppliermanagement' : 'com.omnex.suppliermanagement';
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
      await AsyncStorage.setItem('ssologinstatusbool', "true");
      this.loginCall(resultAuth.accessToken, '',this.state.loginFlag, {
        config: myConfig,
        token: {
          tokenToRevoke: resultAuth.accessToken,
          sendClientId: true,
        },
      });
    } catch (err) {
      this.setState({progressVisible: false});
      console.log('<==JS==> SSO LOGIN Catch', err);
    }
  }
  };

  async onPress ()  {
    console.log("nR===>",this.props.data.audits.isDeviceRegistered)
    const isDeviceRegisteredLog = await AsyncStorage.getItem('isdeviceregistered');
    console.log('loginscreenisDeviceRegisteredLog:::::=====',isDeviceRegisteredLog);
    if(isDeviceRegisteredLog == "no"){
      console.log('checking the device Registered or not-----------',this.props.data.audits.isDeviceRegistered);
      alert('Register the device before login..')
    }else{
    Keyboard.dismiss();
    let pwdfield = this.state.password;
    let usrfield = this.state.username;
    this.setState({
      loginFlag: 1
    })
    if (pwdfield === '' || usrfield === '') {
      // this.refs.toast.show(strings.LoginCred, DURATION.LENGTH_LONG);
      alert( strings.LoginCred)
    } else {
      // console.log('Email and password', this.state.username, this.state.password)
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice);
      } else {
        await AsyncStorage.setItem('ssologinstatusbool', "false");

        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.setState(
              {
                progressVisible: true,
              },
              () => {
                // check active directoery
                if (
                  this.state.isActiveDirectory == true &&
                  this.state.isAdvalue == true
                ) {
                  this.callActiveDirectory(usrfield, pwdfield);
                  //commented on 06-01-2023 to avoid login failure issue..
                  //this.loginCall(usrfield, pwdfield);
                } else {
                  this.loginCall(usrfield, pwdfield, this.state.loginFlag);
                }
              },
            );
          } else {
            this.refs.toast.show(strings.NoInternet);
          }
        });
      }
    }
  }
  };

  callActiveDirectory(username, password) {
    var activeURL = this.props.data.audits.serverUrl;
    var filterURL1 = activeURL.replace('AuditPro', 'EwQIMS');
    var filterURL2 = filterURL1.replace('api', 'common');
    var ADdomain =
      'ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=' +
      username +
      '&Password=' +
      password;

    // 1.22.172.237/EwQIMS/common/ActiveDirectory/ADCheck.aspx?IsADDomain=1&UserName=svibu&Password=P@ssw0rd

    const check = create({
      baseURL: filterURL2 + ADdomain,
    });
    check
      .post()
      .then(res => {
        // console.log('AD response',res)
        if (res.data == 'False') {
          this.setState(
            {
              progressVisible: false,
            },
            () => {
              alert(strings.usernotallowed);
            },
          );
        } else {
          this.loginCall(username, password);
        }
      })
      .catch(err => console.warn(err));
  }

   storeData = async (key, value) => {
    console.log('checking assync details----------',key , value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };
  loginCall = (email, password,loginflag, isSso) => {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    console.log('checkinglogin', loginflag)
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

   
    this.storeData('loginDeviceId', this.state.deviceId);
    this.storeData('loginFcmToken', this.state.fcmToken);
    this.storeData('loginEmail', email);
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
          this.props.storeLoginData(data.data.Data);
          this.props.storeSupplierManagement(
            data.data.Data[0].SupplierManagementAccess,
          );
          console.log('storeUserName', email);

          this.props.storeUserName(email);
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
              this.checkUser(this.state.userId, this.state.accessToken);

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
             Alert.alert(data.data.Message)
            },
          );
        }
      },
    );
  };
  usrFieldVal = () => {
    let usrfield = this.state.username;

    if (usrfield === '') {
      this.refs.toast.show(strings.NullUnm);
    } else if (usrfield !== '') {
      let lastAtPos = usrfield.lastIndexOf('@');
      let lastDotPos = usrfield.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          usrfield.indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          usrfield.length - lastDotPos > 2
        )
      ) {
        this.refs.toast.show(strings.EmailInvalid);
      } else {
        return true;
      }
    }
    return false;
  };

  pwdFieldVal = () => {
    let pwdfield = this.state.password;

    if (pwdfield === '') {
      this.refs.toast.show(strings.PwdNull);
    } else if (pwdfield !== '') {
      if (pwdfield.length < 8) {
        this.refs.toast.show(strings.Passwordlengthcannotbelessthan);
      } else if (!pwdfield.match(/^[a-zA-Z]+$/)) {
        this.refs.toast.show(strings.Passwordshouldnotcontainspecialcharacters);
      } else {
        return true;
      }
    }
    return false;
  };

  _usrHint = () => {
    // console.log('User hint pressed')
  };

  _pwdHint = () => {
    // console.log('Password hint pressed')
  };

  onPressSettings = () => {
    console.log('onPressSettings pressed');
    this.props.navigation.navigate('UnRegister', {
      openFrom: 'login',
      isDeviceRegistered: this.props.data.audits.isDeviceRegistered,
    });
  };

  LanguagePress = () => {
    // console.log('Language changed pressed')
    this.props.navigation.navigate('Languages');
  };
  _storeToken = () => {
    // console.log('*********',this.state.username)
    try {
      // Store audit list in redux store to set it in persistant storage
      this.props.storeSiteId(this.props.data.audits.siteId);
      this.props.storeUserSession(
        this.state.userFullName,
        this.state.userId,
        this.state.accessToken,
        this.state.siteId,
        this.state.Address,
        this.state.CompanyName,
        this.state.CompanyUrl,
        this.state.Logo,
        this.state.Phone,
      );
      console.log(this.state.siteId,'siteidinlogin1');
      
      this.storelogindetails(
        this.state.userFullName,
        this.state.userId,
        this.state.accessToken,
        this.state.siteId,
        this.state.Address,
        this.state.CompanyName,
        this.state.CompanyUrl,
        this.state.Logo,
        this.state.Phone,
      );
      this.props.storeLoginSession(true);
      // console.log('LoginUIScreen Props After Props Changing...', this.props)
      // console.log('Session created and stored the values.')
      this.setState(
        {
          progressVisible: false,
        },
        () => {
          //this.props.navigation.navigate('SupplyManage')
          //this.props.navigation.navigate("AllTabAuditList");
          console.log(
            'supplier management value' +
              this.props.data.audits.suppliermanagementstatus,
          );
          if (this.props.data.audits.suppliermanagementstatus == 'true') {
            this.props.navigation.navigate('SupplyManage');
          } else {
            this.props.navigation.navigate('AllTabAuditList');
          }
        },
      );
    } catch (error) {
      // Error saving data
      // console.log('Failed to create a login session!!!')
    }
  };

  getYearAudit() {
    const token = this.state.accessToken;
    const siteid = this.state.siteId;
    const userid = this.state.userId;

    auth.getYearAudit(siteid, userid, token, (res, data) => {
      // console.log('Calender filter api is called',data)
      if (data.data.Message == 'Success') {
        var GrossAudits = data.data.Data;
        var getRawStartDate = [];
        for (var i = 0; i < GrossAudits.length; i++) {
          getRawStartDate.push({
            StartDate: GrossAudits[i].StartDate,
          });
        }
        // console.log('getRawStartDate',getRawStartDate)
        // this.props.yearAudits(getStartDate)
        // storing the yearly audits in the store
        this.props.storeYearAudits(getRawStartDate);
      }
    });
  }

  render() {
    console.log(this.state.ssoEnabled, 'ssoenabled');
    
    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <OfflineNotice />
        {/*settings and language space*/}
        <ImageBackground
          source={Images.LoginBack2}
          style={styles.backgroundImage}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'space-between',
              margin: 15,
            }}>
            <TouchableOpacity onPress={this.LanguagePress}>
              <Icon name="globe" size={30} color="#2EA4E2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressSettings}>
              <Icon name="gear" size={30} color="#2EA4E2" />
            </TouchableOpacity>
          </View>
          {/*Omnex logo*/}
          <View
            style={{
              flex: 0.45,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ResponsiveImage
              source={Images.omnex_resizeLog}
              initWidth="310"
              initHeight="69"
            />
          </View>
          {/*Input field*/}
          {this.state.ssoEnabled === true ||
          this.state.checkboxSelection === 'sso' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent:'center',
                alignItems: 'center',
                marginTop: 20,
                marginLeft:10
              }}>
              <TouchableOpacity
                onPress={() => this.setState({checkboxSelection: 'sso'})}>
                <CheckedElement
                  checked={this.state.checkboxSelection === 'sso'}
                  checkedIcon="dot-circle-o"
                  onPress={() => this.setState({checkboxSelection: 'sso'})}
                  uncheckedIcon="circle-o"
                />
              </TouchableOpacity>
              <Text style={{marginRight:'15%'}}>SSO</Text>
              <TouchableOpacity
                onPress={() => this.setState({checkboxSelection: 'ewqims'})}
               >
                <CheckedElement
                  checked={this.state.checkboxSelection === 'ewqims'}
                  checkedIcon="dot-circle-o"
                  onPress={() => this.setState({checkboxSelection: 'ewqims'})}
                  uncheckedIcon="circle-o"
                />
              </TouchableOpacity>
              <Text style={{marginRight: '15%'}}>EwQIMS Login</Text>
            </View>
          ) : null}
          {this.state.ssoEnabled === false ||
          this.state.checkboxSelection === 'ewqims' ? (
            <View>
              <View>
                <InputField
                  placeholder={strings.Username}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  autoCorrect={false}
                  value={this.state.username}
                  onChangeText={username => this.setState({username})}
                  onBlur={this.usrFieldVal}
                  type={'Username'}
                />
              </View>
              <View>
                <InputField
                  placeholder={strings.Password}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  autoCorrect={false}
                  value={this.state.password}
                  onChangeText={password => this.setState({password})}
                  secureTextEntry
                  type={'Password'}
                />
              </View>
            </View>
          ) : null}
          <View>
            <TouchableOpacity
              onPress={() => {
                if (
                  this.state.checkboxSelection === 'ewqims' ||
                  this.state.ssoEnabled === false
                ) {
                  this.onPress();
                } else {
                  this.ssoOnPress();
                }
              }}>
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
                  style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>
                  {'Login'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
      // <KeyboardAvoidingView>
      //   <View style={styles.mainContainer}>
      //     <OfflineNotice />
      //     <Image source={Images.LoginBack2} style={styles.backgroundImage} />

      //     <View style={{flexDirection: 'column', position: 'absolute'}}>
      //       <View style={styles.loginOmnexlogoDiv}>
      //         <View style={styles.loginOmnexlogo}>
      //           <ResponsiveImage
      //             source={Images.loadingLogo}
      //             initWidth="310"
      //             initHeight="69"
      //           />
      //         </View>
      //       </View>
      //       <View style={[styles.loginOmnexlogoDiv2]}>
      //        {this.state.ssoEnabled === true || this.state.checkboxSelection === 'sso' ? (
      //           <View
      //             style={{
      //               width: '90%',
      //               flexDirection: 'row',
      //               alignItems: 'center',
      //               marginLeft: '5%',
      //               paddingVertical: 2,
      //             }}>
      //             <TouchableOpacity
      //               onPress={() => this.setState({checkboxSelection: 'sso'})}
      //               style={{
      //                 flex: 1,
      //                 flexDirection: 'row',
      //                 alignItems: 'center',
      //               }}>
      //               <CheckedElement
      //                 checked={this.state.checkboxSelection === 'sso'}
      //                 checkedIcon="dot-circle-o"
      //                 onPress={() => this.setState({checkboxSelection: 'sso'})}
      //                 uncheckedIcon="circle-o"
      //               />
      //               <Text>SSO</Text>
      //             </TouchableOpacity>
      //             <TouchableOpacity
      //               onPress={() => this.setState({checkboxSelection: 'ewqims'})}
      //               style={{
      //                 flex: 1,
      //                 flexDirection: 'row',
      //                 alignItems: 'center',
      //               }}>
      //               <CheckedElement
      //                 checked={this.state.checkboxSelection === 'ewqims'}
      //                 checkedIcon="dot-circle-o"
      //                 onPress={() =>
      //                   this.setState({checkboxSelection: 'ewqims'})
      //                 }
      //                 uncheckedIcon="circle-o"
      //               />
      //               <Text>EwQIMS Login</Text>
      //             </TouchableOpacity>
      //           </View>
      //           ) : null}
      //        {  this.state.ssoEnabled === false || this.state.checkboxSelection === 'ewqims' ?
      //        <View>
      //           <View style={styles.inputBox1}>
      //             <InputField
      //               placeholder={strings.Username}
      //               autoCapitalize={'none'}
      //               returnKeyType={'done'}
      //               autoCorrect={false}
      //               value={this.state.username}
      //               onChangeText={username => this.setState({username})}
      //               onBlur={this.usrFieldVal}
      //               type={'Username'}
      //             />
      //           </View>

      //           <View style={styles.inputBox1}>
      //             <InputField
      //               placeholder={strings.Password}
      //               autoCapitalize={'none'}
      //               returnKeyType={'done'}
      //               autoCorrect={false}
      //               value={this.state.password}
      //               onChangeText={password => this.setState({password})}
      //               secureTextEntry
      //               type={'Password'}
      //             />
      //           </View></View>
      //       : null}
      //         <View style={[styles.inputBox01]}>
      //           {/* <TouchableOpacity onPress={()=>this.onPress()}> */}
      //           <TouchableOpacity
      //             onPress={() => {
      //               if (
      //                 this.state.checkboxSelection === 'ewqims' ||
      //                 this.state.ssoEnabled === false
      //               ) {
      //                 this.onPress();
      //               } else {
      //                 this.ssoOnPress();
      //               }
      //             }}>
      //             {/* <ResponsiveImage source={Images.LOGIN} initWidth="370" initHeight="50" />
      //           <View style={{position:'absolute'}}>
      //             <Text style={{fontSize: Fonts.size.input, color:'#fff'}}>Login</Text>
      //           </View> */}
      //             <LinearGradient
      //               start={{x: 0, y: 0}}
      //               end={{x: 1, y: 0}}
      //               colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
      //               style={styles.LoginBtn01}>
      //               <Text style={styles.buttonText}>{strings.Login}</Text>
      //             </LinearGradient>
      //           </TouchableOpacity>
      //         </View>
      //         {/* {this.state.isActiveDirectory == true ? (
      //           <View style={styles.adbox}>
      //             <CheckBox
      //               onValueChange={() =>
      //                 this.setState({isAdvalue: !this.state.isAdvalue})
      //               }
      //               value={this.state.isAdvalue}
      //             />
      //             <Text
      //               style={{
      //                 fontSize: 18,
      //                 color: '#2EA4E2',
      //                 fontFamily: 'OpenSans-Regular',
      //               }}>
      //               {strings.Active_directory}
      //             </Text>
      //           </View>
      //         ) : null} */}
      //       </View>
      //     </View>
      //     <View style={styles.LangIcon01}>
      //       <View style={styles.AuditlogoDiv}>
      //         <ResponsiveImage
      //           source={Images.auditPro}
      //           initWidth="160"
      //           initHeight="35"
      //         />
      //       </View>
      //       <TouchableOpacity
      //         style={{flexDirection: 'row'}}
      //         onPress={this.LanguagePress}>
      //         <Icon style={{left: 20}} name="globe" size={40} color="white" />
      //         {/* <Text style={{top:20,left:5,fontSize:Fonts.size.medium}}>English (US)</Text> */}
      //       </TouchableOpacity>
      //     </View>
      //     <View style={styles.LangIcon02}>
      //       <TouchableOpacity
      //         style={{flexDirection: 'row'}}
      //         onPress={this.LanguagePress}>
      //         {/* <Icon  name="globe" size={40} color="white"/> */}
      //         {this.state.ChineseScript === true ? (
      //           <Text
      //             style={{
      //               fontSize: Fonts.size.regular,
      //               color: 'white',
      //               fontFamily: 'OpenSans-Regular',
      //             }}>
      //             Chinese (中文)
      //           </Text>
      //         ) : (
      //           <Text
      //             style={{
      //               fontSize: Fonts.size.regular,
      //               color: 'white',
      //               fontFamily: 'OpenSans-Regular',
      //             }}>
      //             English (US)
      //           </Text>
      //         )}
      //       </TouchableOpacity>
      //     </View>
      //     {Platform.OS == "android" ?  <View style={styles.settingsIcon}>
      //       <TouchableOpacity onPress={this.onPressSettings}>
      //         {/* <ResponsiveImage source={Images.settingsImg}  initWidth="40" initHeight="40" /> */}
      //         <Icon name="cogs" size={40} color="white" />
      //       </TouchableOpacity>
      //     </View>:  <View style={styles.settingsIconIOS}>
      //       <TouchableOpacity onPress={this.onPressSettings}>
      //         {/* <ResponsiveImage source={Images.settingsImg}  initWidth="40" initHeight="40" /> */}
      //         <Icon name="cogs" size={40} color="white" />
      //       </TouchableOpacity>
      //     </View>}
      //     <Toast ref="toast" position="top" opacity={0.8} />
      //     <ProgressDialog
      //       titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
      //       messageStyle={{fontFamily: 'OpenSans-Regular'}}
      //       visible={this.state.progressVisible}
      //       message={strings.loginpleaseWait}
      //     />
      //   </View>
      // </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
    notifications: state.notifications,
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
      }),
    storeYearAudits: yearAudits =>
      dispatch({type: 'STORE_YEAR_AUDITS', yearAudits}),
    storeLoginSession: isActive =>
      dispatch({type: 'STORE_LOGIN_SESSION', isActive}),
    clearAudits: () => dispatch({type: 'CLEAR_AUDITS'}),
    storeAuditRecords: auditRecords =>
      dispatch({type: 'STORE_AUDIT_RECORDS', auditRecords}),
    storeCameraCapture: cameraCapture =>
      dispatch({type: 'STORE_CAMERA_CAPTURE', cameraCapture}),
    storeAudits: audits => dispatch({type: 'STORE_AUDITS', audits}),
    storeLanguage: language => dispatch({type: 'STORE_LANGUAGE', language}),
    storeAuditStats: (
      scheduled,
      completed,
      DeadlineViolated,
      CompletedDeadlineViolated,
    ) =>
      dispatch({
        type: 'STORE_AUDIT_STATS',
        scheduled,
        completed,
        DeadlineViolated,
        CompletedDeadlineViolated,
      }),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
    storeServerUrl: serverUrl =>
      dispatch({type: 'STORE_SERVER_URL', serverUrl}),
    changeConnectionState: isConnected =>
      dispatch({type: 'CHANGE_CONNECTION_STATE', isConnected}),
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeDateFormat: userDateFormat =>
      dispatch({type: 'STORE_DATE_FORMAT', userDateFormat}),
    registrationState: isDeviceRegistered =>
      dispatch({type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered}),
    updateRecentAuditList: recentAudits =>
      dispatch({type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits}),
    storeUserName: loginuser => dispatch({type: 'STORE_USER_NAME', loginuser}),
    storeLoginData: logindata =>
      dispatch({type: 'STORE_LOGIN_DATA', logindata}),

    storeSupplierManagement: suppliermanagementstatus =>
      dispatch({type: 'STORE_SUPPLIER_MANAGEMENT', suppliermanagementstatus}),
    updateAuditCount: auditCount =>
      dispatch({type: 'UPDATE_AUDIT_COUNT', auditCount}),
    updateDynamicAuditCount: data =>
      dispatch({type: 'UPDATE_DYNAMIC_AUDIT_COUNT', data}),
    storeSiteId: siteId => dispatch({type: 'STORE_SITE_ID', siteId}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginUIScreen);
