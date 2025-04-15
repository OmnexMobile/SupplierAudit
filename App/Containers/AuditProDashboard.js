import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Image, Linking,Alert, Platform
} from 'react-native';
import {connect} from 'react-redux';
//lib
import Icon from 'react-native-vector-icons/FontAwesome';
import {DoubleBounce, Pulse} from 'react-native-loader';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import Toast, {DURATION} from 'react-native-easy-toast';
//assets
import styles from '../Containers/Styles/AuditProDashboardStyle';
import Images from '../Themes/Images';
import {strings} from '../Language/Language';
//Components
import OfflineNotice from '../Components/OfflineNotice';
import AuditDashboardFooter from '../Components/AuditDashboardFooter';
import AuditCard from '../Components/AuditCard';
import auth from '../Services/Auth';
import constant from '../Constants/AppConstants';
import {NavigationEvents} from 'react-navigation';
import VersionCheck from 'react-native-version-check';
import ToastNew, {ErrorToast} from 'react-native-toast-message';

class AuditProDashboard extends Component {
  constructor(props) {
    super(props);
    this.firstRequest = true;
    this.state = {
      dialogVisible: false,
      errorDialogVisible: false,
      progressVisible: false,
      errorMsg: '',
      searchFlag: false,
      deviceId: '',

      Username: '',
      recent_audits: this.props.data.audits.recentAudits
        ? this.props.data.audits.recentAudits.length > 0
          ? this.props.data.audits.recentAudits.asMutable().reverse()
          : []
        : [],
      todaysactivity: [],
      recentactivity: [],
      upcommingactivity: [],
      scheduled: '',
      completed: '',
      deadlineviolated: '',
      deadlineviolatedandcompleted: '',
      loading: true,
      todayLoading: true,

      auditList: [],
      auditListAll: [],
      token: '',
      userId: '',
      siteId: '',
      page: 1,
      isRefreshing: false,
      isLazyLoading: false,
      isLazyLoadingRequired: true,
      // filterType : '',
      // sortype: '',
      // dataSetArr: [],
      filterId: '',
      isMounted: false,
      isPageEmpty: false,
      // isLocalFilterApplied: false,
      // isSearchFinished: false,
      // enableScrollViewScroll: true,
      // selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
      AuditSearch: '',
      filterTypeFG: 0,
      SortBy: '',
      SortOrder: '',
      // cFilterVal: 0,
      // default: 1,
      default: 1, //todays activity

      //hardcode need to remove
      noaudits: 0,
      showMyAllAudits: false,
      notifybadge: [],
      ShowNotifyBadge: 0,
      isRecentAuditUpdate: false,
      isUpdate: false,
    };
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      () => {
        /** first request as it will be called in component did mount */
        if (!this.firstRequest) {
          this.getAuditLists();
          // Today's activity and Status api Added in Listener
          this.getAuditStatusDetails();
          this.getAuditlist();
        }
        this.firstRequest = false;
      },
    );
  }

  getAuditLists() { 
    var pageNo = this.state.page;
    var token = this.state.token;
    var userId = this.state.userId;
    var siteId = this.props.data.audits.siteId;
    var filterId = this.state.filterId;
    var pageSize = 10;
    var GlobalFilter =
      this.state.AuditSearch === undefined ? '' : this.state.AuditSearch;
    var StartDate = '';
    var EndDate = '';
    var SortBy = this.state.SortBy;
    var SortOrder = this.state.SortOrder;
    var SM = this.props.data.audits.smdata;

    NetInfo.fetch().then(netState => {
      this.setState({
        loading: true,
      });
      if (netState.isConnected) {
        auth.getauditlist(
          token,
          userId,
          siteId,
          pageNo,
          pageSize,
          filterId,
          GlobalFilter,
          StartDate,
          EndDate,
          SortBy,
          SortOrder,
          SM,
          1,
          (response, data) => {
            console.log('getauditlist count:' + data.data);
            if (data.data) {
              if (data.data.Message === 'Success') {
                var data = data.data.Data[0].AuditCount;
                console.log('Notification data', data);
                this.setState({noaudits: data, showMyAllAudits: true});
                /** inital request will be skipped so we have data and we request the notifications */
                this.getNotifications();
              } else {
                this.setState({noaudits: 0, showMyAllAudits: true});
              }
            }
          },
        );
      }
    });
  }

  getNotifications() {
    console.log('this.props.notifications', this.props.notifications);
    const {token, userId} = this.props.data.audits;
    const siteId = this.props.data.audits.siteId;
    const {noaudits} = this.state;
    const {auditCount, dynamicAuditCount} = this.props.notifications;
    /** First request skipped because we have initially zero */
    auth.getAuditNotification(
      auditCount,
      token,
      userId,
      siteId,
      (response, data) => {
        console.log('------------------------------');
        console.log('Audit notifications data', data);
        console.log('------------------------------');
        if (data.data) {
          if (data.data.Message == 'Success') {
            var auditList = [];
            var auditListProps = this.props.data.audits.audits;

            for (var i = 0; i < data.data.Data.length; i++) {
              var auditInfo = data.data.Data[i];
              auditInfo['color'] = '#1081de';
              auditInfo['cStatus'] = constant.StatusScheduled;
              auditInfo['key'] = this.keyVal + 1;

              // Set Audit Status
              if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus == "7" || auditInfo.CloseOutStatus === "9")) {
                auditInfo['cStatus'] = constant.StatusCompleted;
              }else if (auditInfo.AuditStatus == 3 && auditInfo.CloseOutStatus != "7" && auditInfo.CloseOutStatus != "9") {
                auditInfo['cStatus'] = constant.Completed;
              } 
               else if (
                data.data.Data[i].AuditStatus == 2 &&
                data.data.Data[i].PerformStarted == 0
              ) {
                auditInfo['cStatus'] = constant.StatusScheduled;
              } else if (
                data.data.Data[i].AuditStatus == 2 &&
                data.data.Data[i].PerformStarted == 1
              ) {
                auditInfo['cStatus'] = constant.StatusProcessing;
              } else if (data.data.Data[i].AuditStatus == 4) {
                auditInfo['cStatus'] = constant.StatusDV;
              } else if (data.data.Data[i].AuditStatus == 5) {
                auditInfo['cStatus'] = constant.StatusDVC;
              }

              for (var j = 0; j < auditListProps.length; j++) {
                if (
                  parseInt(auditListProps[j].ActualAuditId) ==
                  parseInt(data.data.Data[i].ActualAuditId)
                ) {
                  // Update Audit Status
                  if (
                    auditListProps[j].cStatus == constant.StatusDownloaded ||
                    auditListProps[j].cStatus == constant.StatusNotSynced ||
                    auditListProps[j].cStatus == constant.StatusSynced
                  ) {
                    auditInfo['cStatus'] = auditListProps[j].cStatus;
                  }
                  break;
                }
              }

              // Set Audit Card color by checking its Status
              switch (auditInfo['cStatus']) {
                case constant.StatusScheduled:
                  auditInfo['color'] = '#1081de';
                  break;
                case constant.StatusDownloaded:
                  auditInfo['color'] = '#cd8cff';
                  break;
                case constant.StatusNotSynced:
                  auditInfo['color'] = '#2ec3c7';
                  break;
                case constant.StatusProcessing:
                  auditInfo['color'] = '#e88316';
                  break;
                case constant.StatusSynced:
                  auditInfo['color'] = '#48bcf7';
                  break;
                case constant.Completed:
                  auditInfo['color'] = 'green';
                  break;
                case constant.StatusCompleted:
                  auditInfo['color'] = '#000';
                  break;
                case constant.StatusDV:
                  auditInfo['color'] = 'red';
                  break;
                case constant.StatusDVC:
                  auditInfo['color'] = 'green';
                  break;
                default:
                  auditInfo['color'] = '#1081de';
                  break;
              }

              auditList.push(auditInfo);
              this.keyVal = this.keyVal + 1;
            }           

            let bufferList = Array.from(new Set(auditList));
            
            if (dynamicAuditCount == noaudits) {
              console.log('no new notification');
              this.setState({ShowNotifyBadge: 0});
            } else {
              let badge = noaudits - dynamicAuditCount;
              console.log('badge', badge);
              this.setState({ShowNotifyBadge: badge});
            }
            this.setState({notifybadge: bufferList});
          } else {
            this.setState({ShowNotifyBadge: 0, notifybadge: []});
          }
        } else {
          this.setState({ShowNotifyBadge: 0, notifybadge: []});
        }
      },
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  checkUser = async()=> {
    console.log('user id', this.props.data.audits.userId);
    var userid = this.props.data.audits.userId;
    var token = this.props.data.audits.token;
    var UserStatus = '';
    var serverUrl = this.props.data.audits.serverUrl;
    var ID = this.props.data.audits.userId;
    var type = 3;
    var path = '';
    // var RegisterDevice = this.props.data.audits.deviceid;
    const deviceId = await AsyncStorage.getItem('loginDeviceId');

    console.log(userid, token);

    auth.getCheckUser(userid,deviceId,token, (res, data) => {
      console.log('User information', data);

      if (data.data.Message == 'Success') {
        console.log('Checking User status', data.data.Data.ActiveStatus);
        UserStatus = data.data.Data.ActiveStatus;
        if (this.props.data.audits.isOfflineMode) {
          this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
        } else {
          NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
              // this.props.navigation.navigate('AuditPage', {
              //   datapass: iAuditDetails,
              //   auditStatusPass: this.props.item.cStatus,
              // });
            } else {
              this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
            }
          });
        }

        if (UserStatus == 2) {
          console.log('User active');
          // this.syncAuditsToServerMethod()
          this.checkFilePath();
        } else if (UserStatus == 1) {
          console.log('deleting user details');

          var cleanURL = serverUrl.replace(/^https?:\/\//, '');
          var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          this.propsServerUrl = formatURL;

          console.log('cleanURL', this.propsServerUrl);
          // var ID = this.props.data.audits.userId
          console.log('path', this.propsServerUrl + ID);

          if (Platform.OS == 'android') {
            path =
              '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
              '/' +
              this.propsServerUrl +
              ID;
            console.log('path storing-->', path);
          } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            path = iOSpath + '/' + this.propsServerUrl + ID;
          }
          console.log('*** path', path);
          // this.deleteUserFile(path)
          this.refs.toast.show(
            strings.user_disabled_text,
            DURATION.LENGTH_SHORT,
          );
          this.props.navigation.navigate('LoginUIScreen');
        } else if (UserStatus == 0) {
          Alert.alert("Your session has expired,Please login again.")
          this.refs.toast.show(
            strings.user_inactive_text,
            DURATION.LENGTH_SHORT,
          );
          this.props.navigation.navigate('LoginUIScreen');
        }
      }
    });
  }

  componentDidMount() {
    console.log('reach component did mount------');
    console.log('recent_audit------', this.state.recent_audits);
    console.log('recent_auditRecords', this.props.data.audits.auditRecords);
    this.setState({
      isMounted: true,
    });
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
    console.log('getting App header props', this.props.data.audits);
    this.setState({
      dialogVisible: false,
      Username: this.props.data.audits.userName,
    });
    this.props.navigation.addListener('didFocus', () => {
      console.log('Audit List Component Focussed!');
      if (this.state.isMounted) {
        var recentAudits = this.loadRecentAudits();
        console.log('loadRecent audits', this.loadRecentAudits);
        console.log(
          'loadRecent this.props.data.audits',
          this.props.data.audits,
        );
        this.setState(
          {
            recentAudits,
            auditList: this.props.data.audits.audits,
            auditListAll: this.props.data.audits.audits,
            loading: false,
            isRefreshing: false,
            isPageEmpty: false,
          },
          () => {
            // console.warn('auditList',this.state.auditList);
          },
        );
      }
    });
    if(this.props.data.audits.isOfflineMode,"offlinecheck"){
      this.checkUser();

    }
    else {
      Alert.alert("You are in offline mode disable offline mode to proceed ")
    }
    
    this.checkAppVersion();
    this.getSessionValues();
  }
  //Version Check
  checkAppVersion = async () => {
      try {
        const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=org.omnex.auditpro`)
                .then(r => r.json())
                .then((res) => { return res?.results[0]?.version })
                : await VersionCheck.getLatestVersion({
                    provider: 'playStore',
                    packageName: 'com.omnex.suppliermanagement',
                    ignoreErrors: true,
                });
        
        const currentVersion = VersionCheck.getCurrentVersion();
        
        if (latestVersion > currentVersion) {
            const url = Platform.OS === 'ios'
            ? await VersionCheck.getAppStoreUrl({ appID: '6450008049' })
            :await  VersionCheck.getPlayStoreUrl({ packageName: 'com.omnex.suppliermanagement' })
            console.log("store url",await VersionCheck.getAppStoreUrl({ appID: '6450008049' }))
            Alert.alert(
              'Update Required',
              'A new version of the app is available. Please update to continue using the app.',
              [
                {
                  text: 'Update Now',
                  onPress: () => Linking.openURL(url)
                  ,
                },
                {
                  text: 'Later',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                ],
                { cancelable: false }
              );
            } else {
              // App is up-to-date; proceed with the app
            }
          } catch (error) {
            // Handle error while checking app version
            console.error('Error checking app version:', error);
          }
  };

        
  componentWillReceiveProps(nextProps) {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    console.log('--CurrentPage--->', CurrentPage);

    if (
      CurrentPage == 'AuditProDashboard' ||
      CurrentPage == 'AllTabAuditList' ||
      CurrentPage == 'AuditPage'
    ) {
      if (this.state.recent_audits) {
        var recent = this.props.data.audits.recentAudits;
        var arr = recent.asMutable();
       
        var reve_arr = arr.reverse();
        this.setState({recent_audits: reve_arr}, () => {
          console.log('recent_audits', this.state.recent_audits);
          // this.props.updateRecentAuditList(arr)
        });
      }
    }
  }

  getSessionValues = () => {
    this.setState({
      loading: true,
    });
    console.log(this.props.data.audits.isOfflineMode,"offlinecheck")
    console.log('getSessionValues called');
    try {
      const USERID = this.props.data.audits.userId;
      const TOKEN = this.props.data.audits.token;
      const SITEID = this.props.data.audits.siteId;
      if (TOKEN !== null) {
        this.setState(
          {
            token: TOKEN,
            userId: USERID,
            siteId: SITEID,
            loading: true,
          },
          () => {
            if (this.props.data.audits.isOfflineMode) {
              this.setState({
                auditList: this.props.data.audits.audits,
                auditListAll: this.props.data.audits.audits,
                completed: this.props.data.audits.completedAudits,
                scheduled: this.props.data.audits.scheduledAudits,
                deadlineviolated: this.props.data.audits.DeadlineViolatedAudits,
                deadlineviolatedandcompleted:
                  this.props.data.audits.CompletedDeadlineViolatedAudits,
               // noaudits: this.props.data.audits.audits[0].AuditCount,
                loading: false,
                isRefreshing: false,
                isPageEmpty: false,
                isMounted: true,
                showMyAllAudits: true,
              });
            } else {
              NetInfo.fetch().then(netState => {
                if (netState.isConnected) {
                  this.getAuditlist();
                  this.getAuditStatusDetails();
                  this.getAuditLists();
                } else {
                  this.setState(
                    {
                      scheduled: this.props.data.audits.scheduledAudits,
                      completed: this.props.data.audits.completedAudits,
                      deadlineviolated:
                        this.props.audits.DeadlineViolatedAudits,
                      deadlineviolatedandcompleted:
                        this.props.CompletedDeadlineViolatedAudits,

                      auditList: this.props.data.audits.audits,
                      auditListAll: this.props.data.audits.audits,
                      loading: false,
                      isRefreshing: false,
                      isPageEmpty: false,
                      isMounted: true,
                    },
                    () => {
                      // console.log('auditList',this.state.auditList);
                      // console.log('AuditDashBody Props After State Changing...', this.props)
                    },
                  );
                }
              });
            }
          },
        );
      }
    } catch (error) {
      // Error retrieving data
      // console.log('Failed to retrive a login session!!!',error)
    }
  };

  getAuditlist = (startDate, endDate) => {
    this.setState({
      loading: true,
    });
    if (this.props.data.audits.isOfflineMode) {
      // this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG)
      this.setState({
        auditList: this.props.data.audits.audits,
        auditListAll: this.props.data.audits.audits,
        loading: false,
        isRefreshing: false,
        isLazyLoading: false,
        isLazyLoadingRequired: false,
        isPageEmpty: false,
        isMounted: true,
      });
    }
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        // console.log('getAuditlist ------>')
        var pageNo = this.state.page;
        var token = this.state.token;
        var userId = this.state.userId;
        var siteId = this.state.siteId;
        var filterId = this.state.filterId;
        var pageSize = 10;
        var GlobalFilter =
          this.state.AuditSearch === undefined ? '' : this.state.AuditSearch;
        var StartDate = startDate == undefined ? '' : startDate;
        var EndDate = endDate == undefined ? '' : endDate;
        var SortBy = this.state.SortBy;
        var SortOrder = this.state.SortOrder;
        var Default = this.state.default;
        var SM = this.props.data.audits.smdata;

        auth.getauditlist(
          token,
          userId,
          siteId,
          pageNo,
          pageSize,
          filterId,
          GlobalFilter,
          StartDate,
          EndDate,
          SortBy,
          SortOrder,
          SM,
          Default,
          (response, data) => {
            console.log('AuditList todaysactivity data', data);
            if (data.data) {
              if (data.data.Message === 'Success') {
                var auditList = [];
                var auditListProps = this.props.data.audits.audits;
                console.log(
                  this.props.data.audits.audits,
                  '=========Au=========',
                );
                for (var i = 0; i < data.data.Data.length; i++) {
                  var auditInfo = data.data.Data[i];
                  auditInfo['color'] = '#1081de';
                  auditInfo['cStatus'] = constant.StatusScheduled;
                  auditInfo['key'] = this.keyVal + 1;

                  // Set Audit Status
                  if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === "7" || auditInfo.CloseOutStatus === "9")) {
                    auditInfo['cStatus'] = constant.StatusCompleted;
                  } 
                  else if (data.data.Data[i].AuditStatus == 3 && auditInfo.CloseOutStatus != "7" && auditInfo.CloseOutStatus != "9") {
                    auditInfo['cStatus'] = constant.Completed;
                  } else if (
                    data.data.Data[i].AuditStatus == 2 &&
                    data.data.Data[i].PerformStarted == 0
                  ) {
                    auditInfo['cStatus'] = constant.StatusScheduled;
                  } else if (
                    data.data.Data[i].AuditStatus == 2 &&
                    data.data.Data[i].PerformStarted == 1
                  ) {
                    auditInfo['cStatus'] = constant.StatusProcessing;
                  } else if (data.data.Data[i].AuditStatus == 4) {
                    auditInfo['cStatus'] = constant.StatusDV;
                  } else if (data.data.Data[i].AuditStatus == 5) {
                    auditInfo['cStatus'] = constant.StatusDVC;
                  }

                  for (var j = 0; j < auditListProps.length; j++) {
                    console.log('auditListProps', auditListProps);
                    if (
                      parseInt(auditListProps[j].ActualAuditId) ==
                      parseInt(data.data.Data[i].ActualAuditId)
                    ) {
                      // Update Audit Status
                      if (
                        auditListProps[j].cStatus ==
                          constant.StatusDownloaded ||
                        auditListProps[j].cStatus == constant.StatusNotSynced ||
                        auditListProps[j].cStatus == constant.StatusSynced
                      ) {
                        auditInfo['cStatus'] = auditListProps[j].cStatus;
                      }
                      break;
                    }
                  }

                  // Set Audit Card color by checking its Status
                  switch (auditInfo['cStatus']) {
                    case constant.StatusScheduled:
                      auditInfo['color'] = '#1081de';
                      break;
                    case constant.StatusDownloaded:
                      auditInfo['color'] = '#cd8cff';
                      break;
                    case constant.StatusNotSynced:
                      auditInfo['color'] = '#2ec3c7';
                      break;
                    case constant.StatusProcessing:
                      auditInfo['color'] = '#e88316';
                      break;
                    case constant.StatusSynced:
                      auditInfo['color'] = '#48bcf7';
                      break;
                    case constant.Completed:
                      auditInfo['color'] = 'green';
                      break;
                    case constant.StatusCompleted:
                        auditInfo['color'] = '#000';
                        break;
                    case constant.StatusDV:
                      auditInfo['color'] = 'red';
                      break;
                    case constant.StatusDVC:
                      auditInfo['color'] = 'green';
                      break;
                    default:
                      auditInfo['color'] = '#1081de';
                      break;
                  }

                  auditList.push(auditInfo);
                  this.keyVal = this.keyVal + 1;
                }

                this.setState({todaysactivity: auditList, todayLoading: false});
              } else {
                this.setState({todaysactivity: [], todayLoading: false});
              }
            } else {
              this.setState({todaysactivity: [], todayLoading: false});
            }
          }, 
        );

       
      } else {
        this.setState({todaysactivity: [], todayLoading: false});
      }
    });
  };

  // loadRecentAudits() {
  //   if (this.props.data.audits.recentAudits && this.props.data.audits.audits) {
  //     var recent = this.props.data.audits.recentAudits;
  //     var AllauditList = this.props.data.audits.audits;
  //     var AllauditRecordList = this.props.data.audits.auditRecords;
  //     console.log('AllauditList:AllauditRecordList>',AllauditRecordList);
  //     var total_arr = [];
  //     console.log('AllauditList:Audits>',AllauditList);
  //     for (var i = 0; i < recent.length; i++) {
  //       var flag = false;
  //       console.log('AllauditList:Recent>',i,recent[i]);
  //       for (var j = 0; j < AllauditList.length; j++) {
  //         console.log('AllauditList-j:>',j,AllauditList[j]);
  //         if (recent[i].ActualAuditId == AllauditList[j].ActualAuditId) {
  //           console.log('AllauditList:recent[i].ActualAuditId>',recent[i].ActualAuditId, AllauditList[j].ActualAuditId);
  //          var index = AllauditRecordList.findIndex(o => o.AuditId == AllauditList[j].ActualAuditId);
  //          console.log('AllauditList:index>',index);
  //          if (index != -1)
  //          console.log('AllauditList:AllauditRecordList[index].AuditRecordStatus>',AllauditRecordList[index].AuditRecordStatus);
  //            AllauditList[j].cStatus = AllauditRecordList[index].AuditRecordStatus;
  //           total_arr.push(AllauditList[j]);
  //           console.log('AllauditList:total_arr>',total_arr);
  //           flag = true;
  //         }
  //       }
  //       if (!flag) {
  //         total_arr.push(recent[i]);
  //       }
  //     }
  //     this.props.updateRecentAuditList(total_arr);
  //     return total_arr;
  //     // this.setState(
  //     //   {
  //     //     //   auditList: this.props.data.audits.recentAudits,
  //     //     recentAudits: total_arr.reverse(),
  //     //     //   loading: false,
  //     //     //   isRefreshing: false,
  //     //     //   isLazyLoading: false,
  //     //     //   isPageEmpty: false,
  //     //     //   isMounted: true,
  //     //     //   isLazyLoadingRequired: false
  //     //   },
  //     //   () => {
  //     //     // this.props.updateRecentAuditList(total_arr)
  //     //     // console.log('auditList',this.state.auditList);
  //     //   },
  //   //  );
  //   }
  // }

  loadRecentAudits() {
    let auditListOrg = this.props.data.audits.audits;
    console.log(
      'AllauditList:current-status updateRecentAuditStatus auditPro',
      auditListOrg,
    );
    if (this.props.data.audits.recentAudits && this.props.data.audits.audits) {
      var recent = this.props.data.audits.recentAudits;
      var AllauditList = this.props.data.audits.audits;
      var AllauditRecordList = this.props.data.audits.auditRecords;
      // console.log('AllauditList:AllauditRecordList1>',AllauditRecordList);

      var total_arr = [];

      console.log('AllauditList:>', AllauditList);

      for (var i = 0; i < recent.length; i++) {
        var flag = false;

        console.log('AllauditList:Recent>', i, recent[i]);

        if (recent[i].ActualAuditId == AllauditList[i].ActualAuditId) {
          // var auditListData = AllauditList.findIndex(o => o.ActualAuditId == recent[i].ActualAuditId)

          for (var j = 0; j < AllauditList.length; j++) {
            if (recent[i].ActualAuditId == AllauditList[j].ActualAuditId) {
              var index = AllauditRecordList.findIndex(
                o => o.AuditId == AllauditList[j].ActualAuditId,
              );

              if (index != -1) {
                console.log(
                  'AllauditList:index1>',
                  index,
                  AllauditList[j].ActualAuditId,
                  AllauditList[j],
                );

                AllauditList[j].cStatus =
                  AllauditRecordList[index].AuditRecordStatus;

                total_arr.push(AllauditList[j]);

                flag = true;

                console.log('AllauditList:total_arr>', total_arr);
              }
            }
          }
        } else {
          for (var j = 0; j < AllauditRecordList.length; j++) {
            console.log(
              'AllauditList:recent[i].ActualAuditId>',
              recent[i].ActualAuditId,
              AllauditRecordList[j].AuditId,
            );
            if (AllauditRecordList[j].AuditId == recent[i].ActualAuditId) {
              var index = AllauditRecordList.findIndex(
                o => o.AuditId == recent[i].ActualAuditId,
              );
              console.log(
                'AllauditList:indexrecent2>',
                index,
                recent[i],
                recent[i].ActualAuditId,
              );
              if (index != -1) {
                var AllauditListCopy = {...recent[i]};
                AllauditListCopy.cStatus =
                  AllauditRecordList[index]?.AuditRecordStatus;
                total_arr.push(AllauditListCopy);
                // recent[i].cStatus = AllauditRecordList[index].AuditRecordStatus;
                // total_arr.push(recent[i]);
                flag = true;
                console.log('AllauditList:total_arr---recent>', total_arr);
                // this.setState({
                //   isRecentAuditUpdate: true,
                // });
              }
            }
          }
        }
        if (!flag) {
          total_arr.push(recent[i]);
          console.log('AllauditList:!flag>', total_arr);
        }
      }
      this.props.updateRecentAuditList(total_arr);
      this.setState({
        recent_audits: total_arr.reverse(),
      });
      console.log(
        'AllauditList:total_arr_final----------------------------------------->',
        total_arr,
      );
      return total_arr;
    }
  }

  getAuditStatusDetails() {
    this.setState({
      loading: true,
    });
    auth.getStat(
      this.state.token,
      this.props.data.audits.userId,
      this.props.data.audits.siteId,
      this.props.data.audits.smdata,
      (response, data) => {
        if (data.data) {
          // console.log('getting stats response',response)
          // console.log('getting stats response',data)
          // console.log("stausScheduled---->",data.data.Data.Scheduled)
          // console.log("staus Completed---->",data.data.Data.Completed)
          // console.log("staus DeadlineViolated---->",data.data.Data.DeadlineViolated)
          // console.log("staus CompletedDeadlineViolated---->",data.data.Data.CompletedDeadlineViolated)
          this.props.storeAuditStats(
            data.data.Data.Scheduled,
            data.data.Data.Completed,
            data.data.Data.DeadlineViolated,
            data.data.Data.CompletedDeadlineViolated,
          );
          this.setState(
            {
              scheduled: data.data.Data.Scheduled,
              completed: data.data.Data.Completed,
              deadlineviolated: data.data.Data.DeadlineViolated,
              deadlineviolatedandcompleted:
                data.data.Data.CompletedDeadlineViolated,
              isInitialLoad: false,
              isLoading: false,
              loading: false,
            },
            () => {
              // console.log('this.state.completed',this.state.completed)
              // console.log('this.state.inprogress',this.state.inprogress)
              // console.log('this.state.scheduled',this.state.scheduled)
              this.isInitialLoad = false;
            },
          );
        } else {
          this.props.storeAuditStats(0, 0, 0, 0);
          this.setState(
            {
              scheduled: 0,
              completed: 0,
              deadlineviolated: 0,
              deadlineviolatedandcompleted: 0,
              isInitialLoad: false,
              isLoading: false,
              loading: false,
            },
            () => {
              // console.log('this.state.completed',this.state.completed)
              // console.log('this.state.inprogress',this.state.inprogress)
              // console.log('this.state.scheduled',this.state.scheduled)
              this.isInitialLoad = false;
            },
          );
        }
      },
    );
  }

  // openAuditPage(iAuditDetails) {
  //   var auditRecords = this.props.data.audits.auditRecords
  //   var isDownloadedDone = false

  //   for (var i = 0; i < auditRecords.length; i++) {
  //     if (auditRecords[i].AuditId == iAuditDetails.ActualAuditId) {
  //       isDownloadedDone = true
  //     }
  //   }

  //   if (isDownloadedDone) {
  //     this.props.navigation.navigate('AuditPage', {
  //       datapass: iAuditDetails
  //     })
  //   }
  //   else {
  //     if (this.props.data.audits.isOfflineMode) {
  //       this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG)
  //     }
  //     else {
  //       NetInfo.fetch().then(netState => {
  //         if (netState.isConnected) {
  //           this.props.navigation.navigate('AuditPage', {
  //             datapass: iAuditDetails
  //           })
  //         }
  //         else {
  //           this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG)
  //         }
  //       })
  //     }
  //   }
  // }

  // getAuditStatus = (status) => {
  //   // console.warn('======',status)
  //   var percent = 0
  //   // Set Audit Card color by checking its Status
  //   switch (status) {
  //     case constant.StatusScheduled:
  //       percent = 10
  //       break
  //     case constant.StatusDownloaded:
  //       percent = 30
  //       break
  //     case constant.StatusNotSynced:
  //       percent = 70
  //       break
  //     case constant.StatusProcessing:
  //       percent = 50
  //       break
  //     case constant.StatusSynced:
  //       percent = 90
  //       break
  //     case constant.StatusCompleted:
  //       percent = 100
  //       break
  //     case constant.StatusDV:
  //       percent = 60
  //       break
  //     case constant.StatusDVC:
  //       percent = 100
  //       break
  //     default:
  //       percent = 10
  //       break
  //   }

  //   return percent
  // }

  // changeDateFormatCard = (inDate) => {
  //   if (inDate) {
  //     var DefaultFormatL = this.state.selectedFormat
  //     var sDateArr = inDate.split('T')
  //     var sDateValArr = sDateArr[0].split('-')
  //     var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2])

  //     return Moment(outDate).format(DefaultFormatL)
  //   }
  // }

  goToNotification() {
    console.log('notifyNext------>', this.props.notifications);
    const {dynamicAuditCount} = this.props.notifications;
    if (this.props.data.notifications.auditCount == 0) {
      console.log('first time updating');
      this.props.updateAuditCount(this.state.noaudits);
      this.props.updateDynamicAuditCount(this.state.noaudits);
    }
    if (dynamicAuditCount !== this.state.noaudits) {
      console.log('updating dynamicCount');
      this.props.updateDynamicAuditCount(this.state.noaudits);
    }
    this.props.navigation.navigate('AuditNotifications', {
      notifications: this.state.notifybadge,
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <OfflineNotice />
        {this.render_header()}
        {this.state.loading ? this.render_loader() : this.render_statusBar()}
        {this.state.showMyAllAudits ? (
          <View style={styles.showMyAll}>
            <TouchableOpacity
              onPress={() => this.props.navigation.push('AllTabAuditList')}>
              <Text style={styles.auditNotifyTxt}>
                {strings.youhave +
                  ' ' +
                  this.state.noaudits +
                  ' ' +
                  strings.audits}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.showMyAll}>
            <TouchableOpacity
              style={{
                width: '100%',
                height: null,
                backgroundColor: 'white',
                padding: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.push('AllTabAuditList')}>
              <ActivityIndicator size={20} color="#1CAFF6" />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView style={{backgroundColor: 'lightgrey'}}>
          <View style={{backgroundColor: 'white'}}>
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleTxt}>{strings.recentactivity}</Text>
              {this.state.recent_audits.length > 2 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.push('AllTabAuditList', {
                      ActiveTab: 'recent',
                    })
                  }>
                  <Text style={styles.moreTxt}>{strings.more}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.renderMyCardSplit(
              this.state.recent_audits,
              // this.props.data.audits.auditRecords,
              strings.norecentactivity,
            )}
          </View>
          <View style={{backgroundColor: 'white', marginTop: 6}}>
            <View style={styles.cardTitle}>
              <Text style={styles.cardTitleTxt}>{strings.todaysactivity}</Text>
              {this.state.todaysactivity.length > 2 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.push('AllTabAuditList', {
                      ActiveTab: 'today',
                    })
                  }>
                  <Text style={styles.moreTxt}>{strings.more}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.state.todayLoading
              ? this.render_loader()
              : this.renderMyCardSplit(
                  this.state.todaysactivity,
                  strings.noactivity,
                )}
          </View>
        </ScrollView>
        {/* <View style={styles.floatingDiv}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('VoiceRecognition')}
            style={styles.floatinBtn}>
            <Icon name="microphone" size={25} color="white" />
          </TouchableOpacity>
        </View> */}
        <Toast
          ref="toast"
          style={{backgroundColor: 'black', margin: 20}}
          position="bottom"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />
        <AuditDashboardFooter
          navigation={this.props.navigation}></AuditDashboardFooter>
      </View>
    );
  }

  render_loader() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={20} color="#1CAFF6" />
      </View>
    );
  }

  renderMyCardSplit(myLists, errorMsg) {
    return (
      <View style={styles.bgWhite}>
        {myLists.length > 0 ? (
          myLists.slice(0, 2).map((item, index) => {
            console.log('mylist', myLists);
            return (
              <AuditCard  keyExtractor={item => item.ActualAuditId}
                dateFormat={this.props.data.audits.userDateFormat}
                item={item}
                index={index}
                length={myLists.slice(0, 2).length}
              />
            );
          })
        ) : (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 30,
              }}>
              <Image
                source={Images.emptybox}
                style={{height: 50, resizeMode: 'contain'}}
              />
            </View>
            <View style={{marginVertical: 20}}>
              <Text style={styles.noActivityTxt}>{errorMsg}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  render_header() {
    return (
      <ImageBackground source={Images.DashboardBG} style={styles.header}>
        <View style={styles.welcomeTxtView}>
          <Text style={styles.welcomeTxt}>
            {strings.welcome + '  '}
            {this.state.Username ? (
              <Text style={[styles.welcomeTxt]} numberOfLines={1}>
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
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <TouchableOpacity
            style={styles.SiteIcon}
            onPress={() => this.props.navigation.navigate('UserPreference')}>
            <Icon name="gear" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bellIcon}
            onPress={
              () => {
                this.goToNotification();
              }
              // this.state.notifybadge.length === 0 ? this.refs.toast.show(strings.nonewnotificationfound, DURATION.LENGTH_LONG)
              // : this.props.navigation.navigate('AuditNotifications', { notifications: this.state.notifybadge })
            }>
            <Icon name={'bell'} size={20} color={'white'} />
            {this.state.ShowNotifyBadge > 0 ? (
              <View style={styles.bellBadge}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {this.state.ShowNotifyBadge}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('FilterScreen', {
                fromDashBoard: true,
              })
            }>
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  render_statusBar() {
    return (
      <View style={styles.statusOuterView}>
        <TouchableOpacity
          style={[styles.statusView]}
          onPress={() =>
            this.props.navigation.navigate('AuditDashboardListing', {
              filterId: 2,
              title: strings.scheduled,
            })
          }>
          <Text style={styles.statusheaderTxt}>{this.state.scheduled}</Text>
          <Text style={styles.statusTxt}>{strings.scheduled}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statusView}
          onPress={() =>
            this.props.navigation.navigate('AuditDashboardListing', {
              filterId: 3,
              title: strings.completed,
            })
          }>
          <Text style={styles.statusheaderTxt}>{this.state.completed}</Text>
          <Text style={styles.statusTxt}>{strings.completed}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statusView}
          onPress={() =>
            this.props.navigation.navigate('AuditDashboardListing', {
              filterId: 4,
              title: strings.deadlineviolated,
            })
          }>
          <Text style={styles.statusheaderTxt}>
            {this.state.deadlineviolated}
          </Text>
          <Text style={styles.statusTxt}>{strings.abb_deadlineviolated}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statusView}
          onPress={() =>
            this.props.navigation.navigate('AuditDashboardListing', {
              filterId: 5,
              title: strings.abb_deadlineviolatedandcompleted,
            })
          }>
          <Text style={styles.statusheaderTxt}>
            {this.state.deadlineviolatedandcompleted}
          </Text>
          <Text style={styles.statusTxt}>
            {strings.abb_deadlineviolatedandcompleted}
          </Text>
        </TouchableOpacity>
      </View>
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
    storeAudits: audits => dispatch({type: 'STORE_AUDITS', audits}),
    updateAuditCount: auditCount =>
      dispatch({type: 'UPDATE_AUDIT_COUNT', auditCount}),
    updateDynamicAuditCount: data =>
      dispatch({type: 'UPDATE_DYNAMIC_AUDIT_COUNT', data}),
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
    updateRecentAuditList: recentAudits =>
      dispatch({type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditProDashboard);
