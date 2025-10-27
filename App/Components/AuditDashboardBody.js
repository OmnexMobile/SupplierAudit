import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Button,
  ScrollView,
} from 'react-native';
import styles from './Styles/AuditDashboardBodyStyle';
import Images from '../Themes/Images';
import auth from '../Services/Auth';
import {connect} from 'react-redux';
import FilterSection from './FilterSection';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import Toast, {DURATION} from 'react-native-easy-toast';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {width, height} from 'react-native-dimension';
import ProgressCircle from 'react-native-progress-circle';
import ResponsiveImage from 'react-native-responsive-image';
import Fonts from '../Themes/Fonts';
import {strings} from '../Language/Language';
import NetInfo from '@react-native-community/netinfo';
import Immutable from 'seamless-immutable';
import {debounce, once} from 'underscore';
import constant from '../Constants/AppConstants';

const moment = extendMoment(Moment);
const window_width = Dimensions.get('window').width;

class AuditDashboardBody extends Component {
  keyVal = 0;
  sortType = 0;

  constructor(props) {
    super(props);

    this.state = {
      auditList: [],
      auditListAll: [],
      token: '',
      userId: '',
      siteId: '',
      page: 1,
      loading: false,
      isRefreshing: false,
      isLazyLoading: false,
      isLazyLoadingRequired: true,
      filterType: '',
      sortype: '',
      dataSetArr: [],
      filterId: '',
      isMounted: false,
      isPageEmpty: false,
      isLocalFilterApplied: false,
      isSearchFinished: false,
      enableScrollViewScroll: true,
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      AuditSearch: '',
      filterTypeFG: 0,
      SortBy: '',
      SortOrder: '',
      cFilterVal: 0,
      recentAudits: this.props.data.audits.recentAudits
      ? this.props.data.audits.recentAudits.length > 0
        ? this.props.data.audits.recentAudits.asMutable().reverse()
        : []
      : [],
      default: 1, // existing workf
      // default: 0 // existing workf
    };
  }

  componentDidMount() {
    console.log('AuditDashboardBody mounted', this.props.data.audits);
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
      });
    }
    this.props.navigation.addListener('didFocus', () => {
      // console.log('Audit List Component Focussed!')
      if (this.state.isMounted) {
        this.setState(
          {
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
    if (this.state.token == '') {
      this.getSessionValues();
    }
  }

  componentWillReceiveProps(props) {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    // console.log('--CurrentPage--->',CurrentPage)

    if (CurrentPage == 'AuditDashboard') {
      // console.log('Audit List Component Focussed!')
      // console.log('--AuditDashboard-PROPS-->',props)
      // console.log('--AuditDashboard-this.PROPS-->',this.props)

      // console.log('Search flag is now',props.searchFlag)
      // console.log('onRecieveSearchSubmit',props.onRecieveSearchSubmit)
      // console.log('filterType...',this.props.filterType)
      // console.log('filterTypeFG...',this.state.filterTypeFG)

      if (this.state.isMounted && this.state.isLazyLoadingRequired) {
        if (props.searchFlag == true && props.onRecieveSearchSubmit != '') {
          // console.log('searchFlag is true -->',this.state.AuditSearch)
          if (this.state.AuditSearch != props.onRecieveSearchSubmit) {
            // console.log('After check ====>',props.onRecieveSearchSubmit)
            this.setState(
              {
                AuditSearch: props.onRecieveSearchSubmit,
                page: 1,
                loading: true,
                isRefreshing: false,
                isSearchFinished: true,
                auditList: [],
                auditListAll: [],
              },
              () => {
                if (
                  parseInt(this.props.filterType) > 0 &&
                  this.state.filterTypeFG != parseInt(this.props.filterType)
                ) {
                  this.applyFilterChanges(
                    parseInt(this.props.filterType),
                    '',
                    'Status',
                    '',
                    '',
                  );
                } else if (
                  this.state.filterTypeFG > 0 &&
                  parseInt(this.props.filterType) == 0
                ) {
                  this.applyFilterChanges(0, '', 'Status', '', '');
                } else {
                  this.getAuditlist();
                }
              },
            );
          } else {
            if (
              parseInt(this.props.filterType) > 0 &&
              this.state.filterTypeFG != parseInt(this.props.filterType)
            ) {
              this.applyFilterChanges(
                parseInt(this.props.filterType),
                '',
                'Status',
                '',
                '',
              );
            } else if (
              this.state.filterTypeFG > 0 &&
              parseInt(this.props.filterType) == 0
            ) {
              this.applyFilterChanges(0, '', 'Status', '', '');
            }
          }
        } else {
          // console.log('searchFlag is false -->',this.state.AuditSearch)
          if (this.state.AuditSearch != '') {
            this.setState(
              {
                AuditSearch: '',
                page: 1,
                loading: true,
                isRefreshing: false,
                isSearchFinished: true,
                auditList: [],
                auditListAll: [],
              },
              () => {
                if (
                  parseInt(this.props.filterType) > 0 &&
                  this.state.filterTypeFG != parseInt(this.props.filterType)
                ) {
                  this.applyFilterChanges(
                    parseInt(this.props.filterType),
                    '',
                    'Status',
                    '',
                    '',
                  );
                } else if (
                  this.state.filterTypeFG > 0 &&
                  parseInt(this.props.filterType) == 0
                ) {
                  this.applyFilterChanges(0, '', 'Status', '', '');
                } else {
                  this.getAuditlist();
                }
              },
            );
          } else {
            this.setState(
              {
                auditList: this.props.data.audits.audits,
                auditListAll: this.props.data.audits.audits,
                loading: false,
                isRefreshing: false,
                isPageEmpty: false,
                selectedFormat:
                  props.data.audits.userDateFormat === null
                    ? 'DD-MM-YYYY'
                    : props.data.audits.userDateFormat,
              },
              () => {
                if (
                  parseInt(this.props.filterType) > 0 &&
                  this.state.filterTypeFG != parseInt(this.props.filterType)
                ) {
                  this.applyFilterChanges(
                    parseInt(this.props.filterType),
                    '',
                    'Status',
                    '',
                    '',
                  );
                } else if (
                  this.state.filterTypeFG > 0 &&
                  parseInt(this.props.filterType) == 0
                ) {
                  this.applyFilterChanges(0, '', 'Status', '', '');
                }
              },
            );
          }
        }
      }
    }
  }

  searchResult() {
    // console.log('Audit entered',this.state.AuditSearch)
    var Params = [];
    var SiteID = this.props.data.audits.siteId;
    var UserID = this.props.data.audits.userId;
    var Page = 1;
    var Size = 100;
    var FilterString = '';
    var GlobalFilter = this.state.AuditSearch;
    var TOKEN = this.props.data.audits.token;
    var StartDate = '';
    var EndDate = '';

    Params.push({
      SiteID: SiteID,
      UserID: UserID,
      Page: Page,
      Size: Size,
      FilterString: FilterString,
      GlobalFilter: GlobalFilter,
      StartDate: StartDate,
      EndDate: EndDate,
    });

    auth.getGlobalSearch(Params, TOKEN, (res, data) => {
      console.log('response', data);
      if (data.data.Message == 'Success') {
        this.setState(
          {
            auditList: data.data.Data,
            auditListAll: data.data.Data,
            loading: false,
            isRefreshing: false,
            isPageEmpty: false,
            selectedFormat:
              this.props.data.audits.userDateFormat === null
                ? 'DD-MM-YYYY'
                : this.props.data.audits.userDateFormat,
          },
          () => {
            // console.log('auditList',this.state.auditList);
          },
        );
      }
    });
  }

  getSessionValues = () => {
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
                loading: false,
                isRefreshing: false,
                isPageEmpty: false,
                isMounted: true,
              });
            } else {
              NetInfo.fetch().then(netState => {
                if (netState.isConnected) {
                  this.getAuditlist();
                } else {
                  this.setState(
                    {
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
    if (this.props.data.audits.isOfflineMode) {
      this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
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
        console.log(
          'api date',
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
          Default,
        );

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
          Default,
          SM,
          (response, data) => {
            console.log('AuditList list data', data);
            if (data.data) {
              if (data.data.Message === 'Success') {
                // console.log('auditList API response', data.data)
                console.log(
                  'auditList from props',
                  this.props.data.audits.audits,
                );
                var auditList = [];
                var auditListProps = this.props.data.audits.audits;

                for (var i = 0; i < data.data.Data.length; i++) {
                  var auditInfo = data.data.Data[i];
                  auditInfo['color'] = '#F1EB0E';
                  auditInfo['cStatus'] = constant.StatusScheduled;
                  auditInfo['key'] = this.keyVal + 1;

                  // Set Audit Status
                  if (audits[i].CloseOutStatus == 9 || audits[i].CloseOutStatus == 7) {
                    auditInfo['cStatus'] = constant.StatusCompleted;
                  } else 
                  {
                  if (data.data.Data[i].AuditStatus == 3) {
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
                }
                  for (var j = 0; j < auditListProps.length; j++) {
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
                      auditInfo['color'] = '#F1EB0E';
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

                // console.log('AuditDashBody Props Before Changing...', this.props)
                var finalAuditListAll =
                  this.state.auditListAll.concat(auditList);
                var finalAuditList = this.state.auditList.concat(auditList);

                let bufferList = Array.from(new Set(auditList));
                // console.warn(bufferList)

                // Store audit list in redux store to set it in persistant storage
                this.props.storeAudits(bufferList);

                if (StartDate != '' && EndDate != '') {
                  this.setState({
                    auditList: finalAuditList.filter(item => {
                      var isDateInRange = false;

                      if (item && StartDate && EndDate) {
                        var sDateArr = StartDate.split('-');
                        var eDateArr = EndDate.split('-');
                        var sAuditDateArr =
                          item.StartDate.split('T')[0].split('-');
                        var eAuditDateArr =
                          item.EndDate.split('T')[0].split('-');

                        var startDateFilter = new Date(
                          sDateArr[2],
                          sDateArr[0] - 1,
                          sDateArr[1],
                        );
                        var endDateFilter = new Date(
                          eDateArr[2],
                          eDateArr[0] - 1,
                          eDateArr[1],
                        );
                        var startDateAudit = new Date(
                          sAuditDateArr[0],
                          sAuditDateArr[1] - 1,
                          sAuditDateArr[2],
                        );
                        var endDateAudit = new Date(
                          eAuditDateArr[0],
                          eAuditDateArr[1] - 1,
                          eAuditDateArr[2],
                        );

                        var range = moment.range(
                          startDateFilter,
                          endDateFilter,
                        );

                        if (range.contains(startDateAudit)) {
                          isDateInRange = true;
                        }

                        if (range.contains(endDateAudit)) {
                          isDateInRange = true;
                        }
                      } else {
                        isDateInRange = true;
                      }

                      return isDateInRange;
                    }),
                    auditListAll: finalAuditListAll,
                    loading: false,
                    isRefreshing: false,
                    isLazyLoading: false,
                    isLazyLoadingRequired: true,
                    isPageEmpty: false,
                    isMounted: true,
                  });
                } else {
                  this.setState({
                    auditList: finalAuditList,
                    auditListAll: finalAuditListAll,
                    loading: false,
                    isRefreshing: false,
                    isLazyLoading: false,
                    isLazyLoadingRequired: true,
                    isPageEmpty: false,
                    isMounted: true,
                  });
                }
              } else {
                // console.warn('Error in here fetching list')
                this.setState(
                  {
                    loading: false,
                    isRefreshing: false,
                    isLazyLoading: false,
                    isLazyLoadingRequired: true,
                    isMounted: true,
                    isPageEmpty: true,
                  },
                  () => {
                    // console.log('auditList',this.state.auditList);
                    // console.log('AuditDashBody Props After State Changing...', this.props)
                    // this.props.onFilterChange(this.state.cFilterVal)
                  },
                );
              }
            } else {
              // console.error('Error in error fetching list')
              this.refs.toast.show(
                strings.Audit_List_Failed,
                DURATION.LENGTH_LONG,
              );
              this.setState(
                {
                  loading: false,
                  isRefreshing: false,
                  isLazyLoading: false,
                  isLazyLoadingRequired: true,
                  isMounted: true,
                  isPageEmpty: true,
                },
                () => {
                  // console.log('auditList',this.state.auditList);
                  // console.log('AuditDashBody Props After State Changing...', this.props)
                  //this.props.onFilterChange(this.state.cFilterVal)
                },
              );
            }
          },
        );
      } else {
        this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG);
        this.setState(
          {
            auditList: this.props.data.audits.audits,
            auditListAll: this.props.data.audits.audits,
            loading: false,
            isRefreshing: false,
            isLazyLoading: false,
            isLazyLoadingRequired: false,
            isPageEmpty: false,
            isMounted: true,
          },
          () => {
            // console.log('auditList',this.state.auditList);
            // console.log('AuditDashBody Props After State Changing...', this.props)
            //this.props.onFilterChange(this.state.cFilterVal)
          },
        );
      }
    });

    /**

    else{


      this.setState({
        auditList: this.props.data.audits.audits, 
        auditListAll: this.props.data.audits.audits, 
        loading: false, 
        isRefreshing: false,
        isLazyLoading: false,
        isLazyLoadingRequired: false,
        isPageEmpty: false,
        isMounted: true
      }, () => {
        // console.log('auditList',this.state.auditList);
        // console.log('AuditDashBody Props After State Changing...', this.props)
        //this.props.onFilterChange(this.state.cFilterVal)             
      });
      
        

    }
    '      */
  };

  listFooter() {
    console.log('footer enabled');
    return (
      <View>
        {this.state.isLazyLoading ? (
          <ActivityIndicator animating size="large" />
        ) : (
          <View></View>
        )}
      </View>
    );
  }

  handleEnd() {
    // console.log('handle reach')
    if (
      !this.state.isPageEmpty &&
      !this.state.isLocalFilterApplied &&
      !this.state.isLazyLoading &&
      this.state.isLazyLoadingRequired
    ) {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.setState({page: this.state.page + 1}, () => {
              console.log('page', this.state.page);
              if (this.props.navigation.getParam('filter_Arr')) {
                let filter_Arr = this.props.navigation.getParam('filter_Arr');
                let startDate = filter_Arr[0].startDate;
                let endDate = filter_Arr[0].endDate;
                if (startDate && endDate) {
                  this.getAuditlist(startDate, endDate);
                } else {
                  this.getAuditlist();
                }
              } else {
                this.getAuditlist();
              }
            });
          } else {
            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
          }
        });
      }
    }
  }

  openAuditPage(iAuditDetails) {
    var auditRecords = this.props.data.audits.auditRecords;

    var isDownloadedDone = false;

    for (var i = 0; i < auditRecords.length; i++) {
      if (auditRecords[i].AuditId == iAuditDetails.ActualAuditId) {
        isDownloadedDone = true;
      }
    }

    if (isDownloadedDone) {
      this.props.navigation.navigate('AuditPage', {
        datapass: iAuditDetails,
      });
    } else {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.props.navigation.navigate('AuditPage', {
              datapass: iAuditDetails,
            });
          } else {
            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
          }
        });
      }
    }
  }

  loadRecentAudits() {
    if (this.props.data.audits.recentAudits && this.props.data.audits.audits) {
      var recent = this.props.data.audits.recentAudits;
      var AllauditList = this.props.data.audits.audits;
      var AllauditRecordList = this.props.data.audits.auditRecords;
      console.log('AllauditList:AllauditRecordList>',AllauditRecordList);
      var total_arr = [];
      console.log('AllauditList:>',AllauditList);
      for (var i = 0; i < recent.length; i++) {
        var flag = false;
        console.log('AllauditList:Recent>',i,recent[i]);
        for (var j = 0; j < AllauditList.length; j++) {
          console.log('AllauditList-j:>',j,AllauditList[j]);
          if (recent[i].ActualAuditId == AllauditList[j].ActualAuditId) {
           var index = AllauditRecordList.findIndex(o => o.AuditId == AllauditList[j].ActualAuditId);
           if (index != -1)
             AllauditList[j].cStatus = AllauditRecordList[index].AuditRecordStatus;        
            total_arr.push(AllauditList[j]);
            flag = true;
          }
        }
        if (!flag) {
          total_arr.push(recent[i]);
        }
      }
      this.props.updateRecentAuditList(total_arr);
      this.setState(
        {
          //   auditList: this.props.data.audits.recentAudits,
          recentAudits: total_arr.reverse(),
             loading: false,
            isRefreshing: false,
             isLazyLoading: false,
             isPageEmpty: false,
             isMounted: true,
             isLazyLoadingRequired: false
        },
        () => {
          // this.props.updateRecentAuditList(total_arr)
          // console.log('auditList',this.state.auditList);
        },
      );
    }
  }

  handleRefresh() {
    /* if(this.props.data.audits.isAuditing) {
      this.refs.toast.show('Refresh restricted!!! Unsynced audit records found. Please sync it before refreshing!',DURATION.LENGTH_LONG)
    }
    else { */
    if (this.props.data.audits.isOfflineMode) {
      this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
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
    } else {
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          this.setState(
            {
              page: 1,
              loading: true,
              isRefreshing: true,
              isPageEmpty: false,
              //filterId: '',
              auditList: [],
              auditListAll: [],
            },
            () => {
              this.getAuditlist();
            },
          );
        } else {
          this.refs.toast.show(strings.No_refresh, DURATION.LENGTH_LONG);
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
      });
    }
    /* } */
  }

  applyFilterChanges(sortype, droptext, filterType, startDate, endDate) {
    console.log('sortype', sortype);
    console.log('droptext', droptext);
    console.log('filterType', filterType);
    console.log('startDate----->', startDate);
    console.log('endDate ---->', endDate);

    if (filterType == 'Forms' || filterType == 'Calendar') {
      this.setState({
        isLocalFilterApplied: true,
        SortBy: '',
        SortOrder: '',
        cFilterVal: 0,
      });
    } else {
      this.setState({
        isLocalFilterApplied: false,
      });
    }

    this.setState({loading: true}, () => {
      switch (filterType) {
        case 'All':
          this.setState(
            {
              filterId: '',
              page: 1,
              loading: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              auditList: [],
              auditListAll: [],
              SortBy: '',
              SortOrder: '',
              cFilterVal: 0,
            },
            () => {
              this.handleRefresh();
            },
          );
          break;
        case 'Recent':
          this.setState(
            {
              filterId: '',
              page: 1,
              loading: true,
              isRefreshing: true,
              isLazyLoadingRequired: false,
              auditList: [],
              auditListAll: [],
              SortBy: '',
              SortOrder: '',
              cFilterVal: 0,
            },
            () => {
              this.loadRecentAudits();
            },
          );
          break;
        case 'Forms':
          if (sortype == 0) {
            this.setState({
              auditList: this.state.auditListAll.filter(
                item => item.cStatus == constant.StatusDownloaded,
              ),
              loading: false,
              isLazyLoadingRequired: false,
            });
          } else if (sortype == 1) {
            this.setState({
              auditList: this.state.auditListAll.filter(
                item => item.cStatus == constant.StatusNotSynced,
              ),
              loading: false,
              isLazyLoadingRequired: false,
            });
          } else if (sortype == 2) {
            this.setState({
              auditList: this.state.auditListAll.filter(
                item => item.cStatus == constant.StatusSynced,
              ),
              loading: false,
              isLazyLoadingRequired: false,
            });
          }
          break;
        case 'Status':
          if (sortype == 0) {
            this.setState(
              {
                filterId: '',
                page: 1,
                loading: true,
                isRefreshing: true,
                isLazyLoadingRequired: true,
                auditList: [],
                auditListAll: [],
                filterTypeFG: 0,
                SortBy: '',
                SortOrder: '',
                cFilterVal: sortype,
              },
              () => {
                this.getAuditlist();
                //this.props.onFilterChange(sortype)
              },
            );
          } else if (sortype == 1) {
            this.setState(
              {
                filterId:
                  'AuditStatus IN (2) and DocApprovalStatus = 2 and AuditorStatus = 2  and AuditeeStatus = 2 and PerformStarted = 1',
                page: 1,
                loading: true,
                isRefreshing: true,
                isLazyLoadingRequired: true,
                auditList: [],
                auditListAll: [],
                filterTypeFG: parseInt(this.props.filterType),
                SortBy: '',
                SortOrder: '',
                cFilterVal: sortype,
              },
              () => {
                this.getAuditlist();
                //this.props.onFilterChange(sortype)
              },
            );
          } else if (sortype == 2) {
            this.setState(
              {
                filterId:
                  'AuditStatus IN (2) and DocApprovalStatus = 2 and AuditorStatus = 2 and AuditeeStatus = 2 and PerformStarted = 0',
                page: 1,
                loading: true,
                isRefreshing: true,
                isLazyLoadingRequired: true,
                auditList: [],
                auditListAll: [],
                filterTypeFG: parseInt(this.props.filterType),
                SortBy: '',
                SortOrder: '',
                cFilterVal: sortype,
              },
              () => {
                this.getAuditlist();
                //this.props.onFilterChange(sortype)
              },
            );
          } else if (sortype == 3) {
            this.setState(
              {
                filterId: 'AuditStatus IN (3)',
                page: 1,
                loading: true,
                isRefreshing: true,
                isLazyLoadingRequired: true,
                auditList: [],
                auditListAll: [],
                filterTypeFG: parseInt(this.props.filterType),
                SortBy: '',
                SortOrder: '',
                cFilterVal: sortype,
              },
              () => {
                this.getAuditlist();
                //this.props.onFilterChange(sortype)
              },
            );
          } else if (sortype == 4) {
            this.setState(
              {
                filterId: 'AuditStatus IN (4)',
                page: 1,
                loading: true,
                isRefreshing: true,
                isLazyLoadingRequired: true,
                auditList: [],
                auditListAll: [],
                filterTypeFG: parseInt(this.props.filterType),
                SortBy: '',
                SortOrder: '',
                cFilterVal: sortype,
              },
              () => {
                this.getAuditlist();
                //this.props.onFilterChange(sortype)
              },
            );
          } else if (sortype == 5) {
            this.setState(
              {
                filterId: 'AuditStatus IN (5)',
                page: 1,
                loading: true,
                isRefreshing: true,
                isLazyLoadingRequired: true,
                auditList: [],
                auditListAll: [],
                filterTypeFG: parseInt(this.props.filterType),
                SortBy: '',
                SortOrder: '',
                cFilterVal: sortype,
              },
              () => {
                this.getAuditlist();
                //this.props.onFilterChange(sortype)
              },
            );
          }
          break;
        case 'Sort':
          this.setState(
            {
              filterId: '',
              page: 1,
              loading: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              auditList: [],
              auditListAll: [],
              filterTypeFG: 0,
              SortBy: droptext,
              SortOrder: sortype == 0 ? 'desc' : 'asc',
              cFilterVal: 0,
            },
            () => {
              this.getAuditlist();
            },
          );
          // if(sortype == 0) {
          //   var auditListSort = Immutable.asMutable(this.state.auditListAll).sort(this.GetSortOrder(droptext, 1))
          //   this.setState({
          //     auditList: auditListSort,
          //     isLazyLoadingRequired: false,
          //     loading: false
          //   })
          // }
          // else if(sortype == 1) {
          //   var auditListSort = Immutable.asMutable(this.state.auditListAll).sort(this.GetSortOrder(droptext, 2))
          //   this.setState({
          //     auditList: auditListSort,
          //     isLazyLoadingRequired: false,
          //     loading: false
          //   })
          // }
          break;
        case 'Calendar':
          // console.log('cal filter...')
          // console.log('StartDate here',startDate)
          // console.log('EndDate here',endDate)

          this.setState(
            {
              filterId: '',
              page: 1,
              loading: true,
              isRefreshing: true,
              isLazyLoadingRequired: true,
              auditList: [],
              auditListAll: [],
              SortBy: '',
              SortOrder: '',
              cFilterVal: 0,
            },
            () => {
              this.getAuditlist(startDate, endDate);
            },
          );
          break;
        default:
          break;
      }
    });
  }

  //Comparer Function
  GetSortOrder(prop, type) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        if (type == 1) {
          return 1;
        } else {
          return -1;
        }
      } else if (a[prop] < b[prop]) {
        if (type == 1) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    };
  }

  getAuditStatus = status => {
    // console.warn('======',status)
    var percent = 0;
    // Set Audit Card color by checking its Status
    switch (status) {
      case constant.StatusScheduled:
        percent = 10;
        break;
      case constant.StatusDownloaded:
        percent = 30;
        break;
      case constant.StatusNotSynced:
        percent = 70;
        break;
      case constant.StatusProcessing:
        percent = 50;
        break;
      case constant.StatusSynced:
        percent = 90;
        break;
      case constant.StatusCompleted:
        percent = 100;
        break;
      case constant.StatusDV:
        percent = 60;
        break;
      case constant.StatusDVC:
        percent = 100;
        break;
      default:
        percent = 10;
        break;
    }

    return percent;
  };

  changeDateFormatCard = inDate => {
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat;
      var sDateArr = inDate.split('T');
      var sDateValArr = sDateArr[0].split('-');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
      );

      return Moment(outDate).format(DefaultFormatL);
    }
  };

  render() {
    const {auditList, isRefreshing} = this.state;
    // console.log('Received',this.props.searchFlag)

    return (
      <View style={styles.wrapper}>
        <FilterSection
          auditList={auditList}
          filterType={parseInt(this.props.filterType)}
          onFilterChange={this.applyFilterChanges.bind(this)}
        />
        {/* <FilterSection navigation={this.props.navigation}/> */}

        {!this.state.loading ? (
          this.state.recentAudits.length > 0 ? (
            <FlatList
              data={this.state.recentAudits}
              extraData={this.state}
              onEndReached={this.handleEnd.bind(this)}
              onEndReachedThreshold={0.01}
              refreshing={isRefreshing}
              onRefresh={debounce(this.handleRefresh.bind(this), 800)}
              ListFooterComponent={this.listFooter.bind(this)}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                  <View style={styles.auditBox}>
                    <View
                      style={[
                        styles.auditBoxStatusBar,
                        {backgroundColor: item.color},
                      ]}></View>
                    <View style={styles.auditBoxContent}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.regular,
                          color: '#485B9E',
                        }}>
                        {item.Auditee}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{fontSize: Fonts.size.small, color: '#A6A6A6'}}>
                        {this.changeDateFormatCard(item.StartDate)} -{' '}
                        {this.changeDateFormatCard(item.EndDate)}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          paddingTop: 5,
                          fontSize: Fonts.size.medium,
                          color: '#545454',
                        }}>
                        {item.AuditNumber}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: '#545454',
                        }}>
                        {item.AuditCycleName}
                      </Text>
                    </View>
                    <View style={styles.auditBoxStatus}>
                      {/* {(item.cStatus == 'Scheduled') ?
                        <ResponsiveImage source={Images.downloadIconImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : 
                        (item.cStatus == 'Not-synced') ? 
                        <ResponsiveImage source={Images.syncCardImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : */}
                      {/* <View style={styles.circle}>
                        <ProgressCircle
                          percent={this.getAuditStatus(item.cStatus)}
                          radius={28}
                          borderWidth={5}
                          color="#48BCF7"
                          shadowColor="lightgrey"
                          bgColor="#fff">
                          <Text style={styles.progressVal}>
                            {this.getAuditStatus(item.cStatus)}%
                          </Text>
                        </ProgressCircle>
                      </View> */}
                      {/* } */}
                      {/* <Text style={styles.statusText}>
                        {item.cStatus == 'Deadline Violated and Completed'
                          ? 'D.Violated & Completed'
                          : item.cStatus}
                      </Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: window_width,
                    height: 1,
                    backgroundColor: 'transparent',
                  }}
                />
              )}
            />
          ) : (
            <Text
              style={{
                width: window_width,
                height: height(100) - 213,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                fontSize: Fonts.size.h5,
                paddingTop: 40,
              }}>
              {strings.No_records_found}
            </Text>
          )
        ) : (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderColor: '#CED0CE',
              width: window_width,
              height: height(100) - 213,
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <ActivityIndicator size={20} color="#1CAFF6" />
          </View>
        )}

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
    storeAudits: audits => dispatch({type: 'STORE_AUDITS', audits}),
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
      updateRecentAuditList: recentAudits =>
      dispatch({type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditDashboardBody);
