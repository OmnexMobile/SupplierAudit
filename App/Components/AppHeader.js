import React, {Component} from 'react';
import {
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import styles from './Styles/AppHeaderStyle';
import Images from '../Themes/Images';
import {
  Dialog,
  ConfirmDialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import {connect} from 'react-redux';
import ResponsiveImage from 'react-native-responsive-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import AuditForeground from './AuditForeground';
var RNFS = require('react-native-fs');
import NetInfo from '@react-native-community/netinfo';
import auth from '../Services/Auth';
import DeviceInfo from 'react-native-device-info';
import {debounce, once} from 'underscore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {revoke} from 'react-native-app-auth';

class AppHeader extends Component {
  propsServerUrl = '';
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible: false,
      errorDialogVisible: false,
      progressVisible: false,
      errorMsg: '',
      Username: '',
      searchFlag: false,
      deviceId: '',
    };
  }

  componentDidMount() {
    DeviceInfo.getUniqueId().then(deviceId => {
      this.setState({
        deviceId,
      });
    });
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
    // console.log('getting App header props',this.props.data.audits)
    this.setState(
      {dialogVisible: false, Username: this.props.data.audits.userName},
      function () {
        // console.log('Hello',this.state.Username)
      },
    );
  }

  openLogoutDialog() {
    // console.log('Logout clicked!')
    this.setState({dialogVisible: true});
  }

  async doLogout() {
    var serverUrl = this.props.data.audits.serverUrl;
    var ID = this.props.data.audits.userId;
    var type = 3;
    var path = '';
    var cleanURL = serverUrl.replace(/^https?:\/\//, '');
    var formatURL = cleanURL.replace('/AuditPro/api/', '_');
    var formatURL2 = formatURL.replace('.', '-');
    var formatURL3 = formatURL2.replace('.', '-');
    this.propsServerUrl = formatURL3;
    console.log('cleanURL', this.propsServerUrl);

    let sso_login = await AsyncStorage.getItem('is_user_sso_login');
    let sso_login_obj = JSON.parse(sso_login);
    if (sso_login_obj && Object.keys(sso_login_obj).length > 0) {
      await revoke(sso_login_obj.config, sso_login_obj.token);
    }

    if (this.props.data.audits.isOfflineMode) {
      this.setState({
        dialogVisible: false,
        errorDialogVisible: true,
        errorMsg: strings.Offline_Notice,
      });
    } else {
      var SaveDetails = this.props.data.audits;
      var ID = this.props.data.audits.userId;
      var UserDetails = [];
      UserDetails.push({
        UserId: this.props.data.audits.userId,
        audits: SaveDetails,
      });

      console.log('UserDetails', UserDetails);
      var stringify = JSON.stringify(UserDetails);
      if (Platform.OS == 'android') {
        path =
          '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser/' +
          this.propsServerUrl +
          ID;
        console.log('path storing-->', path);
      } else {
        var iOSpath = RNFS.DocumentDirectoryPath;
        path = iOSpath + '/' + this.propsServerUrl + ID;
      }

      // write the file
      console.log('*** path', path);
      RNFS.writeFile(path, stringify, 'utf8')
        .then(success => {
          console.log('FILE WRITTEN!');
          this.props.storeServerUrl(serverUrl);
          this.props.storeLoginSession(false);
          this.setState({progressVisible: false});
        })
        .catch(err => {
          console.log('Logout error!', err.message);
          this.setState({
            progressVisible: false,
            errorDialogVisible: true,
            errorMsg: strings.LogoutFailed,
          });
        });
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          this.setState(
            {
              dialogVisible: false,
              progressVisible: true,
            },
            () => {
              auth.registerDevice(
                this.state.deviceId,
                this.props.data.audits.serverUrl,
                type,
                (res, data) => {
                  console.log('Logout response', data);
                  if (data.data) {
                    if (data.data.Success == true) {
                      this.props.navigation.navigate('LaunchScreen');
                    }
                  } else {
                    console.log('Logout service failure here!');
                    this.setState({
                      progressVisible: false,
                      errorDialogVisible: true,
                      errorMsg: strings.LogoutFailed,
                    });
                  }
                },
              );
            },
          );
        } else {
          this.setState({
            dialogVisible: false,
            errorDialogVisible: true,
            errorMsg: strings.NoInternet,
          });
        }
      });
    }
  }

  SearchCall() {
    console.log('presses', this.state.searchFlag);
    if (this.state.searchFlag === true) {
      this.setState({searchFlag: false}, () => {
        this.props.onSearch(this.state.searchFlag);
      });
    } else {
      this.setState({searchFlag: true}, () => {
        this.props.onSearch(this.state.searchFlag);
      });
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.prjName}>
          <Text style={styles.welcomeTxt}>{strings.welcome} </Text>
          {this.state.Username ? (
            <Text style={[styles.welcomeTxt, {fontWeight: 'bold'}]}>
              {(
                this.state.Username.charAt(0).toUpperCase() +
                this.state.Username.slice(1)
              ).length > 20
                ? (
                    this.state.Username.charAt(0).toUpperCase() +
                    this.state.Username.slice(1)
                  ).slice(0, 20) + '...'
                : this.state.Username.charAt(0).toUpperCase() +
                  this.state.Username.slice(1)}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={{padding: 5, display: 'none'}}>
            {/* <Image source={Images.notifImg} style={styles.notifiIcon}/> */}
            <Icon name="bell" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={debounce(this.SearchCall.bind(this), 600)}
            style={{paddingRight: 20}}>
            {/* <Image source={Images.searchImg} style={styles.searchIcon}/> */}
            {this.state.searchFlag === false ? (
              <Icon name="search" size={25} color="white" />
            ) : (
              <Icon name="window-close" size={25} color="white" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingRight: 17}}
            onPress={() =>
              this.props.navigation.navigate('AuditDashboardListing')
            }>
            <Icon name="microphone" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={this.openLogoutDialog.bind(this)}>
            {/* <Image source={Images.logoutImg} style={styles.searchIcon}/> */}
            <Icon name="power-off" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <ConfirmDialog
          title={strings.title_logout}
          message={strings.title_logout_message}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
            title: strings.yes,
            onPress: this.doLogout.bind(this),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({dialogVisible: false}),
          }}
        />

        <Dialog
          visible={this.state.errorDialogVisible}
          title={strings.LogoutFailed}
          onTouchOutside={() => this.setState({errorDialogVisible: false})}>
          <View>
            <Text style={{height: 50}}>{this.state.errorMsg}</Text>
            <Button
              onPress={() => this.setState({errorDialogVisible: false})}
              style={{width: 50, marginTop: 10}}
              title="OK"
            />
          </View>
        </Dialog>

        <ProgressDialog
          visible={this.state.progressVisible}
          title={strings.LoggingOut}
          message={strings.PleaseWait}
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
    clearAudits: () => dispatch({type: 'CLEAR_AUDITS'}),
    storeServerUrl: serverUrl =>
      dispatch({type: 'STORE_SERVER_URL', serverUrl}),
    storeLoginSession: isActive =>
      dispatch({type: 'STORE_LOGIN_SESSION', isActive}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
