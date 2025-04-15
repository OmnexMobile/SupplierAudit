import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Button,
  ScrollView,
  Alert,
  BackHandler,
  Platform,
} from 'react-native';
import styles from './Styles/AuditDashboardStyle';
import Images from '../Themes/Images';
import auth from '../Services/Auth';
import {connect} from 'react-redux';
// import FilterSection from "./FilterSection";
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
import OfflineNotice from '../Components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
//component
import CalendarAgenda from './../Components/CalendarAgenda';
import {Dropdown} from 'react-native-element-dropdown';
import * as _ from 'lodash';
import { NavigationEvents } from 'react-navigation';

const moment = extendMoment(Moment);
const window_width = Dimensions.get('window').width;

const Reset = 'Reset';

class AllTabAuditList extends Component {
  keyVal = 0;
  sortType = 0;
  isCalender = undefined;
  dropdata = [
    {
      text: 'Reset',
      value: strings.reset,
    },
    {
      text: 'StartDate',
      value: strings.SortByStartDate,
    },
    {
      text: 'Auditee',
      value: strings.SortByAuditee,
    },

    {
      text: 'EndDate',
      value: strings.SortByEndDate,
    },
    {
      text: 'AuditNumber',
      value: strings.SortByAuditNo,
    },
    {
      text: 'AuditCycleName',
      value: strings.SortByAuditCycle,
    },
    /*{
          text: 'AuditProgramName',
          value: 'A.Program'
        },
        {
          text: 'AuditTypeName',
          value: 'A.Type'
        },
        {
          text: 'LeadAuditor',
          value: 'L.Auditor'
        },*/
    {
      text: 'cStatus',
      value: strings.SortByStatus,
    },
  ];
  constructor(props) {
    super(props);
this.keyVal = 0;
    this.state = {
      auditList: [],
      auditListAll: [],
      token: '',
      userId: '',
      siteId: '',
      page: 1,
      loading: true,
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
      SortBy: 'StartDate',
      SortOrder: '',
      cFilterVal: 0,
      default: 1, // existing workf
      // default: 0 // existing workf
      recentAudits: this.props.data.audits.recentAudits
        ? this.props.data.audits.recentAudits.length > 0
          ? this.props.data.audits.recentAudits.asMutable().reverse()
          : []
        : [],
      filterArrSplit: [],
      activeTab: 0,
      // default for SORT
      audit_sort: 0,
      audit_filterType: 'Sort',
      audit_sortText: '',
      agendaData: {},
      todayLoader: true,
      isErrorRefresh: false,
    };
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // this.backHandle();
      return true;
    });
  }

  deleteFilter() {
    this.props.navigation.state.params = undefined;
    this.setState(
      {
        filterArrSplit: [],
        AuditSearch: '',
        page: 1,
        loading: true,
        isErrorRefresh: false,
      },
      () => {
        this.getAuditlist();
      },
    );
  }
  onChangeText(value) {
    console.log(value);
    console.log('this.state.audit_sortText', this.state.audit_sortText);
    var dropvalue = value.value;
    var dropText = '';
    for (var i = 0; i < this.dropdata.length; i++) {
      if (this.dropdata[i].value == dropvalue) {
        dropText = this.dropdata[i].text;
      }
    }
    this.setState(
      {
        audit_sortText: dropText == Reset ? 'StartDate' : dropText,
      },
      () => {
        this.applyFilterChanges(
          this.state.audit_sort,
          this.state.audit_sortText,
          this.state.audit_filterType,
          null,
          null,
        );
      },
    );
  }

  changeAuditSort(value) {
    this.setState({audit_sort: value}, () => {
      console.log(this.state.audit_sort);
      this.applyFilterChanges(
        this.state.audit_sort,
        this.state.audit_sortText,
        this.state.audit_filterType,
        null,
        null,
      );
    });
  }

  backNavigation(){
    console.log("GETBACKNAVIGATION!!!!!!!!!!!!!!!",this.props.navigation.state);
    if(this.props.navigation.state.params == undefined){
      this.props.navigation.navigate('AuditDashboard')
    }else if (this.props.navigation.state.params.navagationPage == "CalandarList"){
this.props.navigation.goBack();
    }else{
      this.props.navigation.navigate('AuditDashboard')
      // !this.state.isLoading && !this.state.isDownloading
      // ? () => this.props.navigation.navigate('AuditDashboard')
      // : () => console.log('Component is not ready to goBack..')
    }
  }
  filterSection() {
    return (
      <View style={styles.filterCont}>
        <TouchableOpacity
          style={styles.filterBox}
          onPress={() => this.props.navigation.navigate('FilterScreen')}>
          <Icon name="filter" size={20} color="#89888A" />
          <Text
            style={{
              fontSize: Fonts.size.mediump,
              color: '#89888A',
              paddingLeft: 5,
              fontFamily: 'OpenSans-Regular',
            }}>
            {strings.filter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBox}>
          <View
            style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name="sort" size={20} color="#89888A" />
          </View>
          <View style={{flex: 2}}>
            <Dropdown
              value={strings.SortByStartDate}
              onChange={this.onChangeText.bind(this)}
              data={this.dropdata}
              labelField="text"
              valueField="value"
              containerStyle={{flex: 1}}
              itemPadding={5}
              dropdownOffset={{top: 20, left: 0}}
              width={300}
              baseColor="grey"
              itemTextStyle={{fontFamily: 'OpenSans-Regular'}}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
            />
          </View>
          {this.state.audit_sort == 0 ? (
            <TouchableOpacity
              onPress={() => this.changeAuditSort(1)}
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="long-arrow-down" size={20} color="#19BFC1" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.changeAuditSort(0)}
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="long-arrow-up" size={20} color="#19BFC1" />
            </TouchableOpacity>
          )}

          {/* <Text style={{ fontSize: Fonts.size.mediump, color: "#89888A", paddingLeft: 5}}>Sort</Text> */}
        </TouchableOpacity>
      </View>
    );
  }

  allAudits() {
    return (
      <View tabLabel={strings.allaudits} style={styles.scrollViewBody}>
        {this.filterSection()}
        {/*this.state.filterArrSplit.length > 0 ? this.renderFilter() : null*/}
        {!this.state.loading ? (
          this.state.auditList.length > 0 ? (
            <FlatList
              contentContainerStyle={{paddingBottom: 30}}
              data={this.state.auditList}
              extraData={this.state}
              onEndReached={this.handleEnd.bind(this)}
              onEndReachedThreshold={0.01}
              refreshing={this.state.isRefreshing}
              onRefresh={debounce(this.handleRefresh.bind(this), 800)}
              ListFooterComponent={this.listFooter.bind(this)}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                  <View style={{flex:0.5,backgroundColor:'#fff',margin:10,borderRadius:5,flexDirection:'row',elevation:3,shadowColor: Platform.OS === 'ios' ? '#D3D3D3' : '#000',
                shadowOffset: { width: 5, height: 5 }, shadowOpacity: 5,}}>
                    <View
                      style={
                        {flex:0.035,backgroundColor:item.color ? item.color : 'orange',margin:10}
                      }></View>
                    <View style={styles.auditBoxContent}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.regular,
                          color: '#485B9E',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {item.Auditee}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.small,
                          color: '#A6A6A6',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {this.changeDateFormatCard(item.StartDate)} -{' '}
                        {this.changeDateFormatCard(item.EndDate)}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          paddingTop: 5,
                          fontSize: Fonts.size.medium,
                          color: '#545454',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {item.AuditProgramName}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: '#545454',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {item.AuditNumber}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: '#545454',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {item.AuditCycleName}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: '#545454',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {item.cStatus == 'Deadline Violated and Completed'
                          ? 'D.Violated & Completed'
                          : item.cStatus}
                      </Text>
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
          ) : this.state.isErrorRefresh ? (
            <View
              style={{
                paddingVertical: 20,
                // borderTopWidth: 1,
                // borderColor: "#CED0CE",
                width: window_width,
                height: height(100) - 213,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({loading: true}, () => this.getAuditlist())
                }>
                <Icon name="retweet" color="#21AFD5" size={30} />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: Fonts.size.h5,
                    color: '#21AFD5',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
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
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.No_records_found}
            </Text>
          )
        ) : (
          <View
            style={{
              paddingVertical: 20,
              // borderTopWidth: 1,
              // borderColor: "#CED0CE",
              width: window_width,
              height: height(100) - 213,
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={20} color="#1CAFF6" />
          </View>
        )}
      </View>
    );
  }
  recentAudits() {
    console.log('this.state.recentAudits', this.state.recentAudits)
    return (
      <View tabLabel={strings.recentaudits} style={styles.scrollViewBody}>
        <View style={{marginTop: 60}}></View>
        {this.state.recentAudits.length > 0 ? (
          <FlatList
            contentContainerStyle={{paddingBottom: 40}}
            data={this.state.recentAudits}
            extraData={this.state}
            ListFooterComponent={this.listFooter.bind(this)}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                <View style={{flex:0.5,backgroundColor:'#fff',margin:10,borderRadius:5,flexDirection:'row',elevation:3,shadowColor: Platform.OS === 'ios' ? '#D3D3D3' : '#000',
                shadowOffset: { width: 5, height: 5 }, shadowOpacity: 5,
}}>
                  <View
                  style={{flex:0.020,
                    backgroundColor:this.getColorCode(item.cStatus), margin:10}}></View>
                  <View style={styles.auditBoxContent}>
                  <Text
                numberOfLines={1}
                style={[
                  {
                    fontFamily: 'OpenSans-Regular',
                    color: 'rgba(36,236,206,255)',
                  },
                ]}>
                      {item.Auditee}
                    </Text>
                    <Text
                numberOfLines={1}
                style={[{fontFamily: 'OpenSans-Regular', color: 'black'}]}>
                {this.changeDateFormatCard(item.StartDate)} - {' '}
                {this.changeDateFormatCard(item.EndDate)}
              </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        paddingTop: 5,
                        fontSize: Fonts.size.medium,
                        color: '#545454',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {item.AuditProgramName}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: Fonts.size.medium,
                        color: '#545454',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {item.AuditNumber}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: Fonts.size.medium,
                        color: '#545454',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {item.AuditCycleName}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: Fonts.size.medium,
                        color: '#545454',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {item.cStatus == 'Deadline Violated and Completed'
                        ? 'D.Violated & Completed'
                        : item.cStatus}
                    </Text>
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
          <Text style={styles.empty_text_}>{strings.No_records_found}</Text>
        )}
      </View>
    );
  }
//all tab offline mode
todayAudits() {
    return (
      <View
        tabLabel={strings.todaysaudits}
        style={styles.calendarScrollViewBody}>
          {this.props.data.audits.isOfflineMode ?
          <View style={{        
            width: window_width,           
            flex: 1,
            flexDirection: 'row',  
            justifyContent:'center',
            alignItems: 'center',
          }}><Text style={{fontFamily: "OpenSans-Regular", color:'grey' , fontSize: Fonts.size.h5 }}>
            Data will be visible only in the online mode</Text></View> :
          this.state.todayLoader ? (
            <View
              style={{
                paddingVertical: 20,
                width: window_width,
                height: height(100) - 213,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={20} color="#1CAFF6" />
            </View>
          ) : (
            <CalendarAgenda
              dateFormat={this.props.data.audits.userDateFormat}
              agendaData={this.state.agendaData}
            />
          )}
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableOpacity
         onPress={()=>{
          this.backNavigation()
         }}>
          <View style={styles.backlogo}>
            {!this.state.isLoading && !this.state.isDownloading ? (
              // <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" />
              <Icon name="angle-left" size={30} color="white" />
            ) : null}
          </View>
        </TouchableOpacity>
        <View style={styles.heading}>
          <Text style={styles.headingText}>{strings.audits}</Text>
        </View>
        <View style={styles.headerDiv}>
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={() => 
              this.props.navigation.navigate('AuditDashboard')}>
            <Icon name="home" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  backHandle() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
    console.log('Previous---->', PreviousPage);
    if (PreviousPage == 'LoginUIScreen' || PreviousPage == 'SupplyManage') {
      this.props.navigation.navigate('AuditDashboard');
    } else {
      if (this.backHandler) {
        this.backHandler.remove();
      }
    }
  }
  componentWillUnmount() {
    this.backHandler.remove();
    if (this.props.navigation?.removeListener) {
      this.props.navigation.removeListener('didFocus');
    }
  }

  UNSAFE_componentWillMount() {
    console.log(
      'this.props.navigation.state.params',
      this.props.navigation.state.params,
    );
    if (this.props.navigation.state.params) {
      if (this.props.navigation.state.params.ActiveTab) {
        if (this.props.navigation.state.params.ActiveTab == 'recent') {
          this.setState({activeTab: 1});
        } else if (this.props.navigation.state.params.ActiveTab == 'today') {
          this.setState({activeTab: 2});
        }
      }
    }
  }

  componentDidMount() {
    console.log('this.state.activetab', this.state.activeTab);
    console.log('checkkkkkkkkkkkthis.props.data.audits.smdata',this.props.data.audits.smdata);
    console.log('qqqcheckkkkkkkkkkkthisqqqqqqq',this.props);

    
    // console.log('AuditDashboardBody mounted',this.props.data.audits)
    // this.loadRecentAudits()
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

      if (this.props.navigation.getParam('filter_Arr')) {
        console.log(
          'Filter Applied',
          this.props.navigation.getParam('filter_Arr'),
        );
        this.filterApplied(this.props.navigation.getParam('filter_Arr'));
        // this.loadRecentAudits()
      } else {
        if (this.state.isMounted) {
          this.setState(
            {
              auditList: this.props.data.audits.audits,
              auditListAll: this.props.data.audits.audits,
              loading: false,
              isRefreshing: false,
              isPageEmpty: false,
              isErrorRefresh: false,
            },
            () => {
              // console.warn('auditList',this.state.auditList);
            },
          );
        }
        if (this.state.token == '') {
          this.getSessionValues();
        }
      }

      // this.componentWhenReceiveProps()
    });
    this.getYearAudits();
  }

  getYearAudits() {
    this.keyVal = 0;
    const {userId, token} = this.props.data.audits;
    const siteId = this.props.data.audits.siteId;
    console.log(this.props.data.audits,"SITEIDDDDD")
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        auth.getYearAudit(siteId, userId, token, (response, data) => {
          if (data.data) {
            if (data.data.Message === 'Success') {
              if (data.data.Data && data.data.Data.length > 0) {
                console.log('year Audits---->', data.data.Data);
                var auditList = data.data.Data;
                let agendaObj = {};
                var auditListProps = this.props.data.audits.auditRecords;
                let keyVal = 0
                _.forEach(auditList, function (Audit_res) {
                  var auditInfo = Audit_res;
                  auditInfo['color'] = '#1081de';
                  auditInfo['cStatus'] = constant.StatusScheduled;
                  auditInfo['key'] = Audit_res.ActualAuditId + '_' + (keyVal + 1)

                  // Set Audit Status
                  if (Audit_res.AuditStatus == 3 && (Audit_res.CloseOutStatus == "7" || Audit_res.CloseOutStatus === "9") ) {
                    auditInfo['cStatus'] = constant.StatusCompleted;
                  }
                  else if (Audit_res.AuditStatus == 3 && Audit_res.CloseOutStatus != "7" && Audit_res.CloseOutStatus != "9") {
                    auditInfo['cStatus'] = constant.Completed;
                  } 
                  else if (Audit_res.AuditStatus == 2) {
                    auditInfo['cStatus'] = constant.StatusScheduled;
                  } else if (
                    Audit_res.AuditStatus == 2 &&
                    Audit_res.PerformStarted == 1
                  ) {
                    auditInfo['cStatus'] = constant.StatusProcessing;
                  } else if (Audit_res.AuditStatus == 4) {
                    auditInfo['cStatus'] = constant.StatusDV;
                  } else if (Audit_res.AuditStatus == 5) {
                    auditInfo['cStatus'] = constant.StatusDVC;
                  }

                  for (var j = 0; j < auditListProps.length; j++) {
                    if (
                      parseInt(auditListProps[j].AuditId) ==
                      parseInt(Audit_res.ActualAuditId)
                    ) {
                      // Update Audit Status
                      if (
                        auditListProps[j].AuditRecordStatus ==
                          constant.StatusDownloaded ||
                        auditListProps[j].AuditRecordStatus ==
                          constant.StatusNotSynced ||
                        auditListProps[j].AuditRecordStatus ==
                          constant.StatusSynced
                      ) {
                        auditInfo['cStatus'] =
                          auditListProps[j].AuditRecordStatus;
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
                    case constant.StatusCompleted:
                      auditInfo['color'] = 'black';
                      break;
                    case constant.Completed:
                      auditInfo['color'] = 'green';
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
                  // auditList.push(auditInfo)
                  if (auditInfo.StartDate) {
                    const dateT = new Date(auditInfo.StartDate);
                    /** Adding prefix zero if not calendar will not shown any data */
                    let month =
                      dateT.getMonth() + 1 < 10
                        ? '0' + (dateT.getMonth() + 1)
                        : dateT.getMonth() + 1;
                    let datestr =
                      dateT.getDate() < 10
                        ? '0' + dateT.getDate()
                        : dateT.getDate();
                    let key = dateT.getFullYear() + '-' + month + '-' + datestr;
                    /** Mapping the audits based on the start date */
                    if (agendaObj[key]) {
                      agendaObj[key] = [...agendaObj[key], {...auditInfo}];
                    } else {
                      agendaObj[key] = [{...auditInfo}];
                    }
                  }
                  keyVal = keyVal + 1;
                });
                /**
                 * Finally we have a structure like
                 * { 2020-02-10: [{},{}], 2020-01-28: [{}] }
                 */
                this.setState({agendaData: agendaObj, todayLoader: false});
                // this.transformAuditForAgenda(auditList)
              } else {
                this.setState({todayLoader: false});
              }
            } else {
              this.setState({todayLoader: false});
            }
          } else {
            this.setState({todayLoader: false});
          }
        });
      } else {
        /** offline */
      }
    });
  }

  filterApplied(filter) {
    console.log('filterApplied', filter);
    var sortype = this.state.audit_sort;
    var droptext = this.state.audit_sortText;
    var FilterArray = [];
    if (filter[0].filterType === 'GlobalFilter') {
      filter[0].text.globalSearchText && filter[0].text.globalSearchText !== ''
        ? FilterArray.push(filter[0].text.globalSearchText)
        : null;
      filter[0].startDate !== '' && filter[0].endDate !== ''
        ? FilterArray.push(
            filter[0].startDate + ' ' + strings.to + ' ' + filter[0].endDate,
          )
        : null;
      filter[0].text.auditNumber && filter[0].text.auditNumber !== ''
        ? FilterArray.push(filter[0].text.auditNumber)
        : null;
      filter[0].text.auditCycle && filter[0].text.auditCycle !== ''
        ? FilterArray.push(filter[0].text.auditCycle)
        : null;
      filter[0].text.auditee && filter[0].text.auditee !== ''
        ? FilterArray.push(filter[0].text.auditee)
        : null;
      filter[0].text.auditProgram && filter[0].text.auditProgram !== ''
        ? FilterArray.push(filter[0].text.auditProgram)
        : null;
      filter[0].text.auditType && filter[0].text.auditType !== ''
        ? FilterArray.push(filter[0].text.auditType)
        : null;
    }
    if (filter[0].filterType === 'Status') {
      FilterArray = filter[0].text.split('and');
      filter[0].startDate !== '' && filter[0].endDate !== ''
        ? FilterArray.push(
            filter[0].startDate + ' ' + strings.to + ' ' + filter[0].endDate,
          )
        : null;
    }
    if (filter[0].filterType === 'Calendar') {
      FilterArray = [
        filter[0].startDate + ' ' + strings.to + ' ' + filter[0].endDate,
      ];
      // if(filter[0].startDate  !== '' && filter[0].endDate !== ''){
      //     var StartDateTimeStamp = new Date(filter[0].startDate)
      //     var EndDateTimeStamp = new Date(filter[0].endDate)
      //      if(StartDateTimeStamp < EndDateTimeStamp){
      //         FilterArray = [filter[0].startDate+' '+strings.to+' '+filter[0].endDate]
      //      }else{
      //          var temp = ''
      //          temp = filter[0].startDate
      //         filter[0].startDate = filter[0].endDate
      //         filter[0].endDate = temp

      //      }
      // }
    }
    console.log('FilterArray', FilterArray);
    this.setState(
      {
        AuditSearch: filter[0].globalSearch,
        filterArrSplit: FilterArray,
        loading: true,
        SortBy: droptext,
        SortOrder: sortype,
        isErrorRefresh: false,
        auditList: [],
        auditListAll: [],
        isMounted: false,
      },
      () => {
        console.log('SortBy', this.state.SortBy);
        console.log('SortOrder', this.state.SortOrder);
        console.log('SortOrder', this.state.SortOrder);

        console.log('getAuditlist ------>');
        var pageNo = this.state.page;
        var token = this.props.data.audits.token;
        var userId = this.props.data.audits.userId;
        var siteId = this.props.data.audits.siteId;
        var filterId = this.state.filterId;
        var pageSize = 10;
        var GlobalFilter = this.state.AuditSearch;
        // var StartDate = (startDate == undefined) ? '' : startDate
        // var EndDate = (endDate == undefined) ? '' : endDate
        var SortBy = this.state.SortBy;
        var SortOrder = this.state.SortOrder;
        var Default = this.state.default;
        var SM = this.props.data.audits.smdata;

        // this.getAuditlist(filter.startDate,filter.endDate)
        // console.log('jdata',getauditlist)
        auth.getauditlist(
          token,
          userId,
          siteId,
          pageNo,
          pageSize,
          filterId,
          GlobalFilter,
          filter[0].startDate,
          filter[0].endDate,
          SortBy,
          SortOrder,
          SM,
          Default,
          (response, data) => {
            console.log('Filter data', data);
            if (data.data.Message === 'Success') {
              var auditList = [];
              var auditListProps = this.props.data.audits.audits;

              for (var i = 0; i < data.data.Data.length; i++) {
                var auditInfo = data.data.Data[i];
                auditInfo['color'] = '#1081de';
                auditInfo['cStatus'] = constant.StatusScheduled;
                auditInfo['key'] = this.keyVal + 1;

                // Set Audit Status
                /*if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === "7" || auditInfo.CloseOutStatus === "9")) {
                  auditInfo['cStatus'] = constant.StatusCompleted;
                }
                else*/ 
                if (auditInfo.AuditStatus == 3){ //} && auditInfo.CloseOutStatus != "7" && auditInfo.CloseOutStatus != "9") {
                  auditInfo['cStatus'] = constant.Completed;
                }else if (
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
                 auditInfo['color'] =  this.getColorCode(auditInfo['cStatus']);
                
                auditList.push(auditInfo);
                this.keyVal = this.keyVal + 1;
              }

              // console.log('AuditDashBody Props Before Changing...', this.props)
              // var finalAuditListAll = this.state.auditListAll.concat(auditList)
              // var finalAuditList = this.state.auditList.concat(auditList)

              let bufferList = Array.from(new Set(auditList));
              this.setState({
                auditList: bufferList,
                loading: false,
                isRefreshing: false,
                isLazyLoading: false,
                isLazyLoadingRequired: true,
                isPageEmpty: false,
                isMounted: true,
                isErrorRefresh: false,
              });
            } else {
              this.setState({
                auditList: this.props.data.audits,
                loading: false,
                isRefreshing: false,
                isLazyLoading: false,
                isLazyLoadingRequired: true,
                isPageEmpty: false,
                isMounted: true,
                isErrorRefresh: false,
              });
            }
          },
        );
      },
    );
    // this.applyFilterChanges(sortype, droptext, filterType, startDate, endDate)
  }

  getColorCode(status){
    let statusColor = "#1081de";
    switch (status) {
      case constant.StatusScheduled:
        statusColor = '#1081de';
        break;
      case constant.StatusDownloaded:
        statusColor = '#cd8cff';
        break;
      case constant.StatusNotSynced:
        statusColor = '#2ec3c7';
        break;
      case constant.StatusProcessing:
        statusColor = '#e88316';
        break;
      case constant.StatusSynced:
        statusColor = '#48bcf7';
        break;
      case constant.StatusCompleted:
        statusColor = 'black';
        break;
      case constant.Completed:
        statusColor = 'green';
        break;
      case constant.StatusDV:
        statusColor = 'red';
        break;
      case constant.StatusDVC:
        statusColor = 'green';
        break;
      default:
        statusColor = '#1081de';
        break;
    }
    return statusColor;
  }

  componentWhenReceiveProps() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    // console.log('--CurrentPage--->',CurrentPage)

    if (CurrentPage == 'AllTabAuditList') {
      if (this.state.isMounted && this.state.isLazyLoadingRequired) {
        if (
          this.props.searchFlag == true &&
          this.props.onRecieveSearchSubmit != ''
        ) {
          // console.log('searchFlag is true -->',this.state.AuditSearch)
          if (this.state.AuditSearch != this.props.onRecieveSearchSubmit) {
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
                  this.props.data.audits.userDateFormat === null
                    ? 'DD-MM-YYYY'
                    : this.props.data.audits.userDateFormat,
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
    var SM = this.props.data.audits.smdata;

    Params.push({
      SiteID: SiteID,
      UserID: UserID,
      Page: Page,
      Size: Size,
      FilterString: FilterString,
      GlobalFilter: GlobalFilter,
      StartDate: StartDate,
      EndDate: EndDate,
      SM: SM,
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
        console.log('getAuditlist ------>');
        var pageNo = this.state.page;
        var token = this.props.data.audits.token;
        var userId = this.props.data.audits.userId;
        var siteId = this.props.data.audits.siteId;
        var filterId = this.state.filterId;
        var pageSize = 10;
        var GlobalFilter = this.state.AuditSearch;
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
          SM,
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
          SM,
          Default,
          (response, data) => {
            console.log('AuditList list data', data);

            if (data.data) {
              if (data.data.Message == 'Success') {
                var auditRecords = this.props.data.audits.auditRecords;
                console.log("audit Records",auditRecords)
                // console.log('auditList API response', data.data)
                // console.log('auditList from props', this.props.data.audits.audits)
                var auditList = [];
                var auditListProps = this.props.data.audits.audits;

                for (var i = 0; i < data.data.Data.length; i++) {
                  var auditInfo = data.data.Data[i];
                  auditInfo['color'] = '#1081de';
                  auditInfo['cStatus'] = constant.StatusScheduled;
                  auditInfo['key'] = this.keyVal + 1;

                  // Set Audit Status
                  if (auditInfo.AuditStatus == 3 && (auditInfo.CloseOutStatus === "7" || auditInfo.CloseOutStatus === "9")) {
                    auditInfo['cStatus'] = constant.StatusCompleted;
                  } else if (data.data.Data[i].AuditStatus == 3) {
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

                  for (var j = 0; j < auditRecords.length; j++) {
                    if (
                      parseInt(auditRecords[j].AuditId) ==
                      parseInt(data.data.Data[i].ActualAuditId)
                    ) {
                      // Update Audit Status
                      console.log(
                        'auditRecords AuditRecordStatus',
                        auditRecords[j].AuditRecordStatus,
                      );
                      if (
                        auditRecords[j].AuditRecordStatus ==
                          constant.StatusDownloaded ||
                        auditRecords[j].AuditRecordStatus ==
                          constant.StatusNotSynced ||
                        auditRecords[j].AuditRecordStatus ==
                          constant.StatusSynced
                      ) {
                        auditInfo['cStatus'] =
                          auditRecords[j].AuditRecordStatus;
                      }
                      break;
                    }
                  }

                  // Set Audit Card color by checking its Status
                  auditInfo['color'] =  this.getColorCode(auditInfo['cStatus']);
                

                  auditList.push(auditInfo);
                  this.keyVal = this.keyVal + 1;
                }

              
                try {
                  console.log(
                    'this.state.auditList.concat(auditList)',
                    this.state.auditList,
                  );

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
                      isErrorRefresh: false,
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
                      isErrorRefresh: false,
                    });
                  }
                } catch (e) {
                  console.warn('Error', e);
                  this.setState(
                    {
                      loading: false,
                      isRefreshing: false,
                      isLazyLoading: false,
                      isLazyLoadingRequired: true,
                      isMounted: true,
                      isPageEmpty: true,
                      isErrorRefresh: true,
                      auditList: [],
                      auditListAll: [],
                      SortBy: 'StartDate',
                    },
                    () => {
                      // this.getAuditlist()
                      // this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG)
                    },
                  );
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
                    isErrorRefresh: false,
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
                  isErrorRefresh: false,
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
            isErrorRefresh: false,
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

    //alert("MultiProcess:"+iAuditDetails.multiprocess);

    for (var i = 0; i < auditRecords.length; i++) {
      if (auditRecords[i].AuditId == iAuditDetails.ActualAuditId) {
        isDownloadedDone = true;
      }
    }

    console.log("AllTab:>To Audit Page :", iAuditDetails);

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
             //AllauditList[j].cStatus = AllauditRecordList[index].AuditRecordStatus;        
            total_arr.push({...AllauditList[j],cStatus:AllauditRecordList[index].AuditRecordStatus});
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
          //   loading: false,
          //   isRefreshing: false,
          //   isLazyLoading: false,
          //   isPageEmpty: false,
          //   isMounted: true,
          //   isLazyLoadingRequired: false
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
        isErrorRefresh: false,
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
              isErrorRefresh: false,
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
            isErrorRefresh: false,
          });
        }
      });
    }
    /* } */
  }

  applyFilterChanges(
    sortype,
    droptext,
    filterType,
    startDate,
    endDate,
    AuditSearch,
  ) {
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
              isErrorRefresh: false,
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
              isErrorRefresh: false,
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
              AuditSearch: AuditSearch,
            },
            () => {
              this.getAuditlist();
              //this.props.onFilterChange(sortype)
            },
          );
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
              isErrorRefresh: false,
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

  //Guru -- 26/09/2022 - cicle & statusbar color changed as per web dev shared..
  getAuditCircleColor = (status, status_or_circle) => {
    // console.warn('======',status)
    var circlecolor = 0;
    var statusbarcolor = 0;
    // Set Audit Card color by checking its Status
    switch (status) {
      case constant.StatusScheduled:
        circlecolor = '#0000FF';
        statusbarcolor = '#0000FF';
        break;
      case constant.StatusCompleted:
        circlecolor = '#00FF00';
        statusbarcolor = '#00FF00';
        break;
      case constant.StatusDV:
        circlecolor = '#FF0000';
        statusbarcolor = '#FF0000';
        break;
      case constant.StatusDVC:
        circlecolor = '#000000';
        statusbarcolor = '#000000';
        break;
      default:
        circlecolor = '';
        statusbarcolor = '';
        break;
    }
    if (status_or_circle == 0) {
      return circlecolor;
    } else if (status_or_circle == 1) {
      return statusbarcolor;
    }
    console.log(
      'circelcolor' + circlecolor + ' statue bar color' + statusbarcolor,
    );
  };

  changeDateFormatCard = inDate => {
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat;// + ' ' + 'HH:mm';
      var sDateArr = inDate.split('T');
      var sDateValArr = sDateArr[0].split('-');
      var sTimeValArr = sDateArr[1].split(':');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2]
      );
      return Moment(outDate).format(DefaultFormatL);
    }
  };

  render() {
console.log("!!!!!!!!!!!!!!!!!!!!!!!!ALLTABLIST",this.props.navigation.state.params);
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() =>  this.handleRefresh()} />
        <OfflineNotice />
        <View style={styles.headerCont}>
          <ImageBackground source={Images.DashboardBG} style={styles.bgCont}>
            {this.renderHeader()}
          </ImageBackground>
        </View>

        <View style={styles.bodyCont}>
          <ScrollableTabView
            initialPage={this.state.activeTab}
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
                  fontSize: Fonts.size.medium,
                  fontFamily: 'OpenSans-Regular',
                }}
              />
            )}
            tabBarPosition="overlayTop"
            onChangeTab={() => this.loadRecentAudits()}>
            {this.allAudits()}
            {this.recentAudits()}
            {this.todayAudits()}
          </ScrollableTabView>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllTabAuditList);
