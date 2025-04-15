import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  ImageBackground,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Images} from '../Themes';
import styles from './Styles/AuditStatusStyle';
import {width} from 'react-native-dimension';
import Moment from 'moment';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import auth from '../Services/Auth';
import OfflineNotice from '../Components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ResponsiveImage from 'react-native-responsive-image';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../Language/Language';
import {Dropdown} from 'react-native-material-dropdown';
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import NetInfo from '@react-native-community/netinfo';
import {debounce, once} from 'underscore';

let Window = Dimensions.get('window');

class AuditStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: '',
      isVisible: false,
      ChineseScript: false,
      endparam: false,
      AuditID: '',
      AppreciableComments: '',
      AuditCycle: '',
      AuditProgram: '',
      AuditResult: 2,
      AuditType: '',
      Auditee: '',
      ProfAuditor: '',
      Auditor: '',
      EndDate: '',
      EndDateAPI: '',
      LeadAuditor: '',
      Route: null,
      ScheduledEndDate: '',
      ScheduledStartDate: '',
      StartDate: '',
      StartDateAPI: '',
      dummyDropdown: [
        {value: 'No NC', id: 1},
        {value: 'NC identified', id: 2},
        {value: 'Re-audit', id: 3},
      ],
      dummyDropdownText: '',
      StatusHistory: [],
      dialogVisible: false,
      NetInfo: false,
      pageLoad: true,
      breadCrumbText: '',
      routesList: [],
      aRouteId: 0,
      disableBtn: false,
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      generatereportdata: '',
    };
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
  }

  componentDidMount() {
    console.log(
      'AuditStatus page mounted.',
      this.props.navigation.state.params,
    );
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
    //console.log('audit id & generate report dat:'+this.props.navigation.state.params.AuditID+''+this.props.navigation.state.params.generatereport)
    this.setState(
      {
        breadCrumbText: this.props.navigation.state.params.breadCrumb,
        // breadCrumbText: this.props.navigation.state.params.breadCrumb.length > 30 ? this.props.navigation.state.params.breadCrumb.slice(0, 30) + '...' : this.props.navigation.state.params.breadCrumb,
        AuditID: this.props.navigation.state.params.AuditID,
        //generatereportdata: this.props.navigation.state.params.generatereport,
        pageLoad: true,
        NetInfo: false,
      },
      () => {
        this.checkUser();
      },
    );

    /*
    var api_body_for_report_gen = []
    api_body_for_report_gen.push({ strProcess: '46',
           CorrectiveId: '4336',
           CategoryId: 63,
           Title: 'IATF-2021-JUL-6-2348',
           FileName: '',
           ElementID: '',
           Department: 0,
           AuditStatus: 2,
           NonConformity: 'O To FI',
           ResponsibilityUser: 19,
           SiteId: 1,
           RequestedBy: 16,
           FormId: 35,
           ChecklistId: 0,
           RecommendedAction: '',
           NCIdentifier: '',
           ObjectiveEvidence: '',
           uniqueNCkey: 1648458408 } )

      console.log('body data ..:'+api_body_for_report_gen[0].SiteId)

      this.setState({
        generatereportdata: api_body_for_report_gen
      })
      console.log('api body data hot coded..:'+ this.state.generatereportdata)
    // let dummyDropdown = [{ value: 'No NC', id: 1 }, { value: 'NC identified', id: 2 }, { value: 'Re-audit', id: 0 }]
    // this.setState({ dummyDropdown: dummyDropdown }, () => { console.log('this.state.dummyDropdown', this.state.dummyDropdown) })
    */
  }

  checkUser() {
    console.log('user id', this.props.data.audits.userId);
    var userid = this.props.data.audits.userId;
    var token = this.props.data.audits.token;
    var UserStatus = '';
    var serverUrl = this.props.data.audits.serverUrl;
    var ID = this.props.data.audits.userId;
    var path = '';
    console.log(userid, token);

    auth.getCheckUser(userid, token, (res, data) => {
      console.log('User information', data);
      if (data.data.Message == 'Success') {
        console.log('Checking User status', data.data.Data.ActiveStatus);
        UserStatus = data.data.Data.ActiveStatus;
        if (UserStatus == 2) {
          console.log('User active');
          this.getStatus();
        } else if (UserStatus == 1) {
          console.log('deleting user details');

          var cleanURL = serverUrl.replace(/^https?:\/\//, '');
          var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          this.propsServerUrl = formatURL;

          // var ID = this.props.data.audits.userId
          console.log('path', this.propsServerUrl + ID);

          if (Platform.OS == 'android') {
            path =
              '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
              '/' +
              this.propsServerUrl +
              ID +
              this.props.data.audits.siteId;
            console.log('path storing-->', path);
          } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            path =
              iOSpath +
              '/' +
              this.propsServerUrl +
              ID +
              this.props.data.audits.siteId;
          }
          console.log('*** path', path);
          // this.deleteUserFile(path)
          this.refs.toast.show(
            strings.user_disabled_text,
            DURATION.LENGTH_SHORT,
          );
          this.props.navigation.navigate('LoginUIScreen');
        } else if (UserStatus == 0) {
          this.refs.toast.show(
            strings.user_inactive_text,
            DURATION.LENGTH_SHORT,
          );
          this.props.navigation.navigate('LoginUIScreen');
        }
      }
    });
  }
  deleteUserFile(path) {
    console.log('RNFS.DocumentDirectoryPath', path);
    var serURL = this.props.data.audits.serverUrl;
    RNFS.exists(path)
      .then(result => {
        console.log('path result', result);
        if (result) {
          RNFetchBlob.fs
            .unlink(path)
            .then(() => {
              console.log('deleted success');
              setTimeout(() => {
                RNFS.exists(path).then(res => {
                  console.log('path', res);
                  this.setState(
                    {
                      dialogVisible: false,
                    },
                    () => {
                      this.props.clearAudits();
                      setTimeout(() => {
                        this.props.storeServerUrl(serURL);
                        console.log('FILE DELETED!');
                        this.refs.toast.show(
                          strings.user_disabled_text,
                          DURATION.LENGTH_SHORT,
                        );
                        this.props.navigation.navigate('LoginUIScreen');
                        console.log('Check server url', this.props.data);
                      }, 600);
                    },
                  );
                }, 1500);
              });
            })
            .catch(err => {
              console.log('err', err);
            });
        } else {
          console.log('Patha not found');
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  onStartDateChange = (date, index) => {
    console.log('onstartDateChange', date, index);
    this.setState(
      {
        StartDate: Moment(date).format('YYYY-MM-DD HH:mm:SS'),
        StartDateAPI: Moment(date).format('YYYY-MM-DD HH:mm:SS'),
        isVisible: false,
        endparam: false,
      },
      () => {
        console.log('start date', this.state.startdate);
      },
    );
  };

  onEndDateChange = (date, index) => {
    console.log('onendDateChange', date, index);
    this.setState(
      {
        EndDate: Moment(date).format('YYYY-MM-DD HH:mm:SS'),
        EndDateAPI: Moment(date).format('YYYY-MM-DD HH:mm:SS'),
        isVisible: false,
        endparam: false,
      },
      () => {
        console.log('start date', this.state.enddate);
      },
    );
  };

  getStatus() {
    if (this.props.data.audits.isOfflineMode) {
      this.setState({NetInfo: true, pageLoad: false}, () => {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      });
    } else {
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          var aRouteId = 0;
          console.log(
            'getting local props',
            this.props.data.audits.auditRecords,
          );
          console.log('this.state.AuditID', this.state.AuditID);
          var Token = this.props.data.audits.token;
          var SiteId = this.props.data.audits.siteId;
          var RequestParam = [];
          var auditRecords = this.props.data.audits.auditRecords;
          for (var i = 0; i < auditRecords.length; i++) {
            if (this.state.AuditID === auditRecords[i].AuditId) {
              RequestParam.push({
                AuditId: auditRecords[i].AuditId,
                AuditProgramId: auditRecords[i].AuditProgramId,
                AuditProgramOrder: auditRecords[i].AuditProgOrder,
                AuditTypeOrder: auditRecords[i].AuditTypeOrder,
                AuditTypeId: auditRecords[i].AuditTypeId,
                AuditOrder: auditRecords[i].AuditOrderId,
                SiteId: SiteId,
              });
            }
          }
          console.log('Token', Token);
          console.log('RequestParam', RequestParam);

          if (RequestParam[0].AuditProgramId == -1) {
            let dummyDropdown = [
              {value: 'No NC', id: 1},
              {value: 'NC identified', id: 2},
            ];
            this.setState({dummyDropdown: dummyDropdown}, () => {
              console.log('this.state.dummyDropdown', this.state.dummyDropdown);
            });
          }

          auth.getAuditStatus(RequestParam, Token, (res, data) => {
            console.log('getAuditStatus --->', data);
            if (data.data) {
              if (data.data.Message === 'Success') {
                var Details = data.data.Data.lstAuditStatus;
                var StHistory = data.data.Data.lstStatusHistory;
                var StatusHistory = [];
                var routes = data.data.Data.lstRoutes;
                var routesList = [];

                if (routes.length > 0) {
                  for (var i = 0; i < routes.length; i++) {
                    if (i == 0) {
                      aRouteId = routes[i].RouteID;
                    }
                    routesList.push({
                      id: routes[i].RouteID,
                      value: routes[i].RouteName,
                    });
                  }
                }

                console.log('lstRoutes', routesList);

                for (var i = 0; i < StHistory.length; i++) {
                  StatusHistory.push({
                    key: i + 1,
                    ChangedBy:
                      StHistory[i].ChangedBy === null
                        ? '-'
                        : StHistory[i].ChangedBy,
                    Comments:
                      StHistory[i].Comments === null
                        ? '-'
                        : StHistory[i].Comments,
                    DateofChange:
                      StHistory[i].DateofChange === null
                        ? '-'
                        : StHistory[i].DateofChange,
                    From: StHistory[i].From === null ? '-' : StHistory[i].From,
                    To: StHistory[i].To === null ? '-' : StHistory[i].To,
                  });
                }
                console.log('StatusHistory', StatusHistory);
                this.setState(
                  {
                    NetInfo: false,
                    pageLoad: false,
                    StatusHistory: StatusHistory,
                    AppreciableComments:
                      Details[0].AppreciableComments === null ||
                      Details[0].AppreciableComments === ''
                        ? '-'
                        : Details[0].AppreciableComments,
                    AuditCycle:
                      Details[0].AuditCycle === null ||
                      Details[0].AuditCycle === ''
                        ? '-'
                        : Details[0].AuditCycle,
                    AuditProgram:
                      Details[0].AuditProgram === null ||
                      Details[0].AuditProgram === ''
                        ? '-'
                        : Details[0].AuditProgram,
                    AuditResult: 2,
                    AuditType:
                      Details[0].AuditType === null ||
                      Details[0].AuditType === ''
                        ? '-'
                        : Details[0].AuditType,
                    Auditee:
                      Details[0].Auditee === null || Details[0].Auditee === ''
                        ? '-'
                        : Details[0].Auditee,
                    Auditor:
                      Details[0].Auditor === null || Details[0].Auditor === ''
                        ? '-'
                        : Details[0].Auditor,
                    ProfAuditor:
                      Details[0].ProvisionalAuditors === null ||
                      Details[0].ProvisionalAuditors === ''
                        ? '-'
                        : Details[0].ProvisionalAuditors,
                    EndDate: Details[0].EndDate,
                    LeadAuditor:
                      Details[0].LeadAuditor === null
                        ? '-'
                        : Details[0].LeadAuditor,
                    Route: Details[0].Route === null ? '-' : Details[0].Route,
                    ScheduledEndDate: this.changeDateFormat(
                      Details[0].ScheduledEndDate,
                    ),
                    ScheduledStartDate: this.changeDateFormat(
                      Details[0].ScheduledStartDate,
                    ),
                    StartDate: Details[0].StartDate,
                    StartDateAPI:
                      Details[0].StartDate === null
                        ? '-'
                        : Details[0].StartDate,
                    EndDateAPI:
                      Details[0].EndDate === null ? '-' : Details[0].EndDate,
                    routesList: routesList.length > 0 ? routesList : [],
                    aRouteId: aRouteId,
                  },
                  () => {
                    console.log('fetched details suucess');
                    console.log(
                      'this.state.StatusHistory',
                      this.state.StatusHistory,
                    );
                    console.log('this.state.aRouteId', this.state.aRouteId);
                  },
                );
              } else {
                this.setState({NetInfo: false, pageLoad: false}, () => {
                  this.refs.toast.show(
                    strings.Audit_Status_Failed,
                    DURATION.LENGTH_LONG,
                  );
                });
              }
            } else {
              this.setState({NetInfo: false, pageLoad: false}, () => {
                this.refs.toast.show(
                  strings.Audit_Status_Failed,
                  DURATION.LENGTH_LONG,
                );
              });
            }
          });
        } else {
          this.setState({NetInfo: true, pageLoad: false}, () => {
            this.refs.toast.show(strings.NoInternet, DURATION.LENGTH_LONG);
          });
        }
      });
    }
  }

  changeDateFormat = inDate => {
    console.log('==-->', inDate);
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat// + ' ' + 'HH:mm';
      var sDateArr = inDate.split('T');
      if (sDateArr.length === 1) {
        sDateArr = inDate.split(' ');
      }
      var sDateValArr = sDateArr[0].split('-');
      var sTimeValArr = sDateArr[1].split(':');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
        // sTimeValArr[0],
        // sTimeValArr[1],
      );
      return Moment(outDate).format(DefaultFormatL);
    }
  };

  listFooter() {
    console.log('footer enabled');
    return (
      <Button onPress={this.getStatus.bind(this)} title={strings.Refresh} />
    );
  }

  Refresh() {
    if (this.props.data.audits.isOfflineMode) {
      console.log('No internet connection');
    } else {
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          this.getStatus();
        } else {
          console.log('No internet connection');
        }
      });
    }
  }

  onSave() {
    if (this.props.data.audits.isOfflineMode) {
      this.setState(
        {NetInfo: true, pageLoad: false, dialogVisible: false},
        () => {
          this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
        },
      );
    } else {
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          this.setState({dialogVisible: false, pageLoad: true}, () => {
            console.log(
              'getting local props',
              this.props.data.audits.auditRecords,
            );
            console.log('this.state.AuditID', this.state.AuditID);
            var auditRecords = this.props.data.audits.auditRecords;
            var Token = this.props.data.audits.token;
            var ChangedBy = this.props.data.audits.userId;
            var AuditResult = this.state.AuditResult;
            var AuditCompletionDate = this.state.StartDateAPI;
            var ReUploadTime = this.state.EndDateAPI;
            var AuditID = this.state.AuditID;
            var Comments = this.state.AppreciableComments;
            var ActualStartDate = this.state.StartDateAPI;
            var ActualEndDate = this.state.EndDateAPI;
            var Request = [];
            var AuditStatus = this.state.AuditResult;
            var RouteID = this.state.aRouteId;
            var AddDays = 0;

            for (var i = 0; i < auditRecords.length; i++) {
              if (this.state.AuditID === auditRecords[i].AuditId) {
                var AuditOrder = auditRecords[i].AuditOrderId;
              }
            }
            Request.push({
              ChangedBy: ChangedBy,
              AuditResult: AuditResult,
              AuditCompletionDate: AuditCompletionDate,
              ReUploadTime: ReUploadTime,
              AuditID: AuditID,
              AuditOrder: AuditOrder,
              Comments: Comments,
              ActualStartDate: ActualStartDate,
              ActualEndDate: ActualEndDate,
              AuditStatus: AuditStatus,
              RouteID: RouteID,
              AddDays: AddDays,
            });
            console.log('Request', Request);

            auth.getAuditSaveStatus(Request, Token, (resp, data) => {
              console.log('Save response', data);
              if (data.data) {
                if (data.data.Message === 'Success') {
                  this.setState({pageLoad: false, NetInfo: false}, () => {
                    this.refs.toast.show(
                      strings.SavedStatus,
                      DURATION.LENGTH_LONG,
                    );
                    this.getStatus();
                    if (this.state.AuditType === 'LPA') {
                      this.props.navigation.navigate('LPAPublish', {
                        Auditid: this.state.AuditID,
                        Auditorder: 1,
                      });
                    }
                  });
                } else {
                  this.setState({pageLoad: false}, () => {
                    this.refs.toast.show(
                      strings.FailedStatus,
                      DURATION.LENGTH_LONG,
                    );
                  });
                }
              } else {
                this.setState({pageLoad: false}, () => {
                  this.refs.toast.show(
                    strings.FailedStatus,
                    DURATION.LENGTH_LONG,
                  );
                });
              }
            });
          });
        } else {
          this.setState(
            {NetInfo: true, pageLoad: false, dialogVisible: false},
            () => {
              this.refs.toast.show(strings.NoInternet, DURATION.LENGTH_LONG);
            },
          );
        }
      });
    }
  }

  handleEnd() {
    console.log('this.state.routesList', this.state.routesList);
    // this.getStatus()
  }

  render() {
    const dummyDropdown = this.state.dummyDropdown;
    console.log('dummyDropdown', dummyDropdown);
    const routesDropdown = this.state.routesList;
    const {StatusHistory} = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <OfflineNotice />
        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isVisible}
          onConfirm={
            this.state.endparam === false
              ? this.onStartDateChange
              : this.onEndDateChange
          }
          onCancel={() => this.setState({isVisible: false})}
        />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65,
          }}>
          <View style={styles.header}>
            {this.state.pageLoad === true ? (
              <TouchableOpacity>
                <View style={styles.backlogo}>
                  {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                  <Icon name="angle-left" size={40} color="white" />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View style={styles.backlogo}>
                  {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                  <Icon name="angle-left" size={40} color="white" />
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.heading}>
              <Text style={styles.headingText}>{strings.Audit_Result}</Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  color: 'white',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {this.state.breadCrumbText}
              </Text>
            </View>
            {/* <View style={{width:Window.width,height:20,position:'absolute',backgroundColor:'yellow'}}>

            </View> */}
            <View style={styles.headerDiv}>
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() =>
                  this.props.navigation.navigate('AuditDashboard')
                }>
                <Icon name="home" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {/* --------------------- */}
        <View style={styles.auditPageBody}>
          <ScrollableTabView
            onChangeTab={event => {
              console.log('event', event.i);
              if (event.i === 1) {
                this.setState({disableBtn: true}, () => {
                  console.log('Status history tab', this.state.disableBtn);
                });
              } else {
                this.setState({disableBtn: false}, () => {
                  console.log('A status', this.state.disableBtn);
                });
              }
            }}
            renderTabBar={() => (
              <DefaultTabBar
                backgroundColor="white"
                activeTextColor="#2CB5FD"
                inactiveTextColor="#747474"
                underlineStyle={{
                  backgroundColor: '#2CB5FD',
                  borderBottomColor: '#2CB5FD',
                  height: Platform.select({
                    android: 0,
                    ios: 5,
                  }),
                }}
                textStyle={{
                  fontSize: Fonts.size.regular,
                  fontFamily: 'OpenSans-Regular',
                }}
              />
            )}
            tabBarPosition="overlayTop">
            <ScrollView
              tabLabel={strings.AuditStatus}
              style={styles.scrollViewBody}>
              {this.state.routesList.length > 0 ? (
                <View style={{marginTop: 60, marginBottom: 20}}>
                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>{strings.Auditee}</Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.Auditee}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>
                        {strings.SortByAuditCycle}
                      </Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.AuditCycle}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>
                        {strings.AuditProgram}
                      </Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.AuditProgram}
                      </Text>
                    </View>
                  </View>

                  {this.state.AuditType != 'LPA' ? (
                    <>
                      <View style={styles.card}>
                        <View style={styles.boxCard1}>
                          <Text style={styles.detailTitle}>
                            {strings.Audit_type}
                          </Text>
                        </View>
                        <View style={styles.boxCard2}>
                          {console.log(this.state.AuditType, 'WWAuditType')}
                          <Text style={styles.detailContent}>
                            {this.state.AuditType}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.card}>
                        <View style={styles.boxCard1}>
                          <Text style={styles.detailTitle}>
                            {strings.Lead_Auditor}
                          </Text>
                        </View>
                        <View style={styles.boxCard2}>
                          <Text style={styles.detailContent}>
                            {this.state.LeadAuditor}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : null}

                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>{strings.Auditor_name}</Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.Auditor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>
                        {strings.ProfAuditor}
                      </Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.ProfAuditor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>
                        {strings.ScheduledStartDate}
                      </Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.ScheduledStartDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.boxCard1}>
                      <Text style={styles.detailTitle}>
                        {strings.ScheduledEndDate}
                      </Text>
                    </View>
                    <View style={styles.boxCard2}>
                      <Text style={styles.detailContent}>
                        {this.state.ScheduledEndDate}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({isVisible: true});
                    }}
                    style={[
                      styles.card,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <View>
                      <View style={styles.boxCard2}>
                        <Text style={styles.detailTitle}>
                          {strings.Start_date}
                        </Text>
                      </View>
                      <View style={styles.boxCard2}>
                        <Text style={styles.detailContent}>
                          {this.changeDateFormat(this.state.StartDate)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icon
                        style={{top: 5, right: 10}}
                        name="calendar"
                        size={20}
                        color="lightgrey"
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({endparam: true, isVisible: true});
                    }}
                    style={[
                      styles.card,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <View>
                      <View style={styles.boxCard2}>
                        <Text style={styles.detailTitle}>
                          {strings.End_date}
                        </Text>
                      </View>
                      <View style={styles.boxCard2}>
                        <Text style={styles.detailContent}>
                          {this.changeDateFormat(this.state.EndDate)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Icon
                        style={{top: 5, right: 10}}
                        name="calendar"
                        size={20}
                        color="lightgrey"
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.div1}>
                    <View style={styles.input07}>
                      <Dropdown
                        data={dummyDropdown}
                        labelField="text"
                        valueField="value"
                        label={strings.AuditStatus}
                        fontSize={Fonts.size.regular}
                        labelFontSize={Fonts.size.small}
                        value={
                          dummyDropdown
                            ? this.state.dummyDropdown[1]
                              ? this.state.dummyDropdown[1].value
                              : ''
                            : ' '
                        }
                        baseColor={'#A6A6A6'}
                        selectedItemColor="#000"
                        textColor="#000"
                        itemColor="#000"
                        itemPadding={5}
                        dropdownOffset={{top: 10, left: 0}}
                        itemTextStyle={{fontFamily: 'OpenSans-Regular'}}
                        onChange={text => {
                          this.setState({dummyDropdownText: text.value}, () => {
                            console.log(
                              'dummyDropdown ->',
                              this.state.dummyDropdownText,
                            );
                            var drop = 0;
                            for (
                              var i = 0;
                              i < this.state.dummyDropdown.length;
                              i++
                            ) {
                              if (
                                this.state.dummyDropdownText ===
                                this.state.dummyDropdown[i].value
                              ) {
                                drop = this.state.dummyDropdown[i].id;
                              }
                            }
                            console.log('drop', drop);
                            this.setState({AuditResult: drop}, () => {
                              console.log(
                                'this.state.AuditResult',
                                this.state.AuditResult,
                              );
                            });
                          });
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.div1}>
                    <View style={styles.input07}>
                      <Dropdown
                        data={routesDropdown}
                        label={strings.AssignRoute}
                        fontSize={Fonts.size.regular}
                        labelFontSize={Fonts.size.small}
                        baseColor={'#A6A6A6'}
                        selectedItemColor="#000"
                        textColor="#000"
                        itemColor="#000"
                        itemPadding={5}
                        value={this.state.routesList[0].value}
                        dropdownOffset={{top: 10, left: 0}}
                        itemTextStyle={{fontFamily: 'OpenSans-Regular'}}
                        onChange={text => {
                          var routeId = 0;
                          console.log('routeList', this.state.routesList);
                          for (
                            var i = 0;
                            i < this.state.routesList.length;
                            i++
                          ) {
                            if (text.value === this.state.routesList[i].value) {
                              routeId = this.state.routesList[i].id;
                            }
                          }
                          console.log('routeId', routeId);
                          this.setState({aRouteId: routeId}, () => {
                            console.log(
                              'this.state.aRouteId',
                              this.state.aRouteId,
                            );
                          });
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles.cardT,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    <View>
                      {this.state.AppreciableComments != '' ? (
                        <View style={styles.boxCard1}>
                          <Text style={styles.detailTitle}>
                            {strings.Comments}
                          </Text>
                        </View>
                      ) : (
                        <View></View>
                      )}
                      <TextInput
                        style={{fontFamily: 'OpenSans-Regular'}}
                        value={this.state.AppreciableComments}
                        placeholder={strings.Comments}
                        fontSize={Fonts.size.h6}
                        onChangeText={text =>
                          this.setState({AppreciableComments: text}, () => {
                            // console.log('printing')
                          })
                        }
                        onBlur={() => {
                          console.log(
                            'this.state.AppreciableComments',
                            this.state.AppreciableComments,
                          );
                        }}
                        returnKeyType="default"
                      />
                    </View>
                    <View>
                      <Icon
                        style={{top: 5, right: 13}}
                        name="edit"
                        size={20}
                        color="lightgrey"
                      />
                    </View>
                  </View>
                </View>
              ) : this.state.NetInfo ? (
                <View
                  style={{
                    marginTop: 60,
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    styles={{
                      fontSize: Fonts.size.h3,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.NoInternet}
                  </Text>
                </View>
              ) : null}
            </ScrollView>

            <View tabLabel={strings.StatusHistory}>
              {this.state.NetInfo ? (
                <View
                  style={{
                    marginTop: 60,
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    styles={{
                      fontSize: Fonts.size.h3,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.NoInternet}
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: 60, marginBottom: 10}}>
                  {this.state.StatusHistory.length > 0 ? (
                    <FlatList
                      data={StatusHistory}
                      extraData={this.state}
                      onEndReached={this.handleEnd.bind(this)}
                      onEndReachedThreshold={0.01}
                      // refreshing={isRefreshing}
                      // onRefresh={this.handleRefresh.bind(this)}
                      // ListFooterComponent={this.listFooter.bind(this)}
                      renderItem={({item}) => (
                        <View>
                          <View style={styles.auditBox}>
                            <View style={styles.Carddiv}>
                              <View style={styles.cardS}>
                                <Text style={styles.detailTitle}>
                                  {strings.Changed}
                                </Text>
                                <Text style={styles.detailContent}>
                                  {item.ChangedBy}
                                </Text>
                              </View>

                              <View style={styles.cardS}>
                                <Text style={styles.detailTitle}>
                                  {strings.AComments}
                                </Text>
                                <Text
                                  numberOfLines={2}
                                  style={styles.detailContent}>
                                  {item.Comments}
                                </Text>
                              </View>

                              <View style={styles.cardS}>
                                <Text style={styles.detailTitle}>
                                  {strings.DateChange}
                                </Text>
                                <Text style={styles.detailContent}>
                                  {this.changeDateFormat(item.DateofChange)}
                                </Text>
                              </View>

                              <View style={styles.cardS}>
                                <Text style={styles.detailTitle}>
                                  {strings.SFrom}
                                </Text>
                                <Text style={styles.detailContent}>
                                  {item.From == '1'
                                    ? 'No NC'
                                    : item.From == '2'
                                    ? 'NC identified'
                                    : item.From == '3'
                                    ? 'Re-audit'
                                    : '-'}
                                </Text>
                              </View>

                              <View style={styles.cardLast}>
                                <Text style={styles.detailTitle}>
                                  {strings.Sto}
                                </Text>
                                <Text style={styles.detailContent}>
                                  {item.To == '1'
                                    ? 'No NC'
                                    : item.To == '2'
                                    ? 'NC identified'
                                    : item.To == '3'
                                    ? 'Re-audit'
                                    : '-'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                      keyExtractor={item => item.key}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            width: Window.width,
                            height: 1,
                            backgroundColor: 'transparent',
                          }}
                        />
                      )}
                    />
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{fontSize: 18, fontFamily: 'OpenSans-Regular'}}>
                        {strings.No_records_found}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollableTabView>
        </View>

        {/** footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={debounce(
              this.state.pageLoad === true
                ? console.log('please wait')
                : () => {
                    this.state.disableBtn === false
                      ? this.setState({dialogVisible: true})
                      : this.Refresh();
                  },
              1000,
            )}
            style={styles.footer}>
            {/*Genereate report related code commented below.. */}
            {/*
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 65,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {this.state.pageLoad === true ?
              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Pulse size={20} color='white' />
                <Text style={{ color: 'white',fontFamily:'OpenSans-Regular'}}>{strings.sLoading}</Text>
              </View>

              :
            (this.state.AuditType == "LPA")  ?  
            <View 
                style={{
                flexDirection: 'row',                
                width: width(60)
 //               justifyContent: 'center',
   //             alignItems: 'center'
              }}
              >
              
              <View style={{alignItems:'center',flexDirection:'row',marginLeft:1}}>
                <View style={{alignItems:'center',flexDirection:'column'}}> 
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Table",{auditid:this.state.AuditID,generatereportData:this.state.generatereportdata})}>
                    <View style={{alignItems:'center'}}>
                    <Icon name="file-text-o" size={25} color="white" /> 
                    <Text style={{ color: 'white', fontSize: Fonts.size.regular,fontFamily:'OpenSans-Regular'}}>
                    Generate Report</Text>
                    </View>
                  </TouchableOpacity>
                </View>  
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: width(10), justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={Images.lineIcon} />
                  </View>
                </View>
              </View>                             
              
              <View style={{flexDirection:'column',alignItems:'center'}}>
                <TouchableOpacity onPress={
                  debounce(
                  (this.state.pageLoad === true) ? console.log('please wait') :
                  () => {
                  this.state.disableBtn === false ?
                  this.setState({ dialogVisible: true }) : this.Refresh()
                  }
                  , 1000)
                } >
                  <View style={{alignItems:'center'}}>
                {this.state.disableBtn === false ?
                  <Icon name="save" size={25} color="white" /> :
                  <Icon name="refresh" size={25} color="white" />}                 
                  <Text style={{ color: 'white', fontSize: Fonts.size.regular,fontFamily:'OpenSans-Regular'}}>
                    {this.state.disableBtn === false ?
                      strings.Save : strings.Refresh
                  }</Text>
                  </View>
                </TouchableOpacity>    
              </View>  

              </View>
            :              
            <View style={{
              flexDirection: 'column',
              width: width(45),
              justifyContent: 'center',
              alignItems: 'center',           

            }}
            >
              <TouchableOpacity onPress={
                debounce(
                (this.state.pageLoad === true) ? console.log('please wait') :
                () => {
                this.state.disableBtn === false ?
                this.setState({ dialogVisible: true }) : this.Refresh()
                }
              , 1000)} style={styles.footer}>
                <View style={{alignItems:'center'}}>
              {this.state.disableBtn === false ?
                <Icon name="save" size={25} color="white" /> :
                <Icon name="refresh" size={25} color="white" />
              }
              <Text style={{ color: 'white', fontSize: Fonts.size.regular,fontFamily:'OpenSans-Regular'}}>  
                {this.state.disableBtn === false ?
                  strings.Save : strings.Refresh
                }</Text>
                </View>
              </TouchableOpacity>  
            </View>

            }
          </ImageBackground>        
          */}

            {/*generate report related commented complete here*/}

            <ImageBackground
              source={Images.Footer}
              style={{
                resizeMode: 'stretch',
                width: '100%',
                height: 65,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.pageLoad === true ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Pulse size={20} color="white" />
                  <Text
                    style={{color: 'white', fontFamily: 'OpenSans-Regular'}}>
                    {strings.sLoading}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'column',
                    width: width(45),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {this.state.disableBtn === false ? (
                    <Icon name="save" size={25} color="white" />
                  ) : (
                    <Icon name="refresh" size={25} color="white" />
                  )}
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {this.state.disableBtn === false
                      ? strings.Save
                      : strings.Refresh}
                  </Text>
                </View>
              )}
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View></View>

        {/* <View style={[styles.calenderModalView, {display: 'none'}]}>
            <Modal isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}>
            <View style={styles.calenderView}>
                <View style={styles.calenderHeader}>
                <Text style={{fontSize:Fonts.size.h4}}>
                {(this.state.endparam === false) ?
                  strings.StartDate : strings.Enddate
                }</Text>
                </View>

                <View style={styles.calenderBody}>
                <CalendarPicker
                previousTitle={'<<'}
                nextTitle={'>>'}
                onDateChange={(this.state.endparam === false) ?
                this.onStartDateChange : this.onEndDateChange}
                width={width(95)}
                todayBackgroundColor="#e6ffe6"
                selectedDayColor="#66ff33"
                selectedDayTextColor="#000000"                
                 />
                 
                </View>
                <TouchableOpacity onPress={()=>{this.setState({ isVisible : false })}} style={styles.calenderFooter}>
                <Text style={{fontSize:Fonts.size.h5,color:'#00a1e2'}}>{strings.Close}</Text>
                </TouchableOpacity>

            </View>
            </Modal>
          </View> */}
        <Toast
          ref="toast"
          style={{backgroundColor: 'black', margin: 20}}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />
        <ConfirmDialog
          title={strings.StatusTitle}
          message={strings.Statusmsg}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
            title: strings.yes,
            onPress: this.onSave.bind(this),
            // onPress: this.refreshList.bind(this)
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({dialogVisible: false}),
          }}
        />
      </KeyboardAvoidingView>
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
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
    clearAudits: () => dispatch({type: 'CLEAR_AUDITS'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditStatus);
