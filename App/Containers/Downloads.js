import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
} from 'react-native';
import AuditPageStyle from './Styles/AuditDashboardStyle';

import {Images} from '../Themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts';
import {strings} from '../Language/Language';
import Moment from 'moment';
import ProgressCircle from 'react-native-progress-circle';

import {connect} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import OfflineNotice from '../Components/OfflineNotice';
import constant from '../Constants/AppConstants';

const window_width = Dimensions.get('window').width;
class Downloads extends Component {
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
    };
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      () => {
        this.applyFilterChanges('Forms', 'StartDate', 0, null, null);
      },
    );
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
    // this.applyFilterChanges("Forms",'StartDate',0,null,null)

    // this.setState({
    //     auditList: this.props.data.audits.audits,
    //     auditListAll: this.props.data.audits.audits,
    //     loading: false,
    //     isRefreshing: false,
    //     isPageEmpty: false
    // }, () => {
    //     // console.warn('auditList',this.state.auditList);
    // });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  applyFilterChanges(sortype, droptext, filterType, startDate, endDate) {
    console.log('sortype', sortype);
    console.log('droptext', droptext);
    console.log('filterType', filterType);
    console.log('startDate----->', startDate);
    console.log('endDate ---->', endDate);

    if (filterType == 0) {
      this.setState({
        auditList: this.props.data.audits.auditRecords,
        // auditList: this.props.data.audits.audits.filter((item) => item.cStatus == constant.StatusDownloaded),
        loading: false,
        isLazyLoadingRequired: false,
      });
    } else if (filterType == 1) {
      this.setState({
        auditList: this.props.data.audits.audits.filter(
          item => item.cStatus == constant.StatusNotSynced,
        ),
        loading: false,
        isLazyLoadingRequired: false,
      });
    } else if (filterType == 2) {
      this.setState({
        auditList: this.props.data.audits.audits.filter(
          item => item.cStatus == constant.StatusSynced,
        ),
        loading: false,
        isLazyLoadingRequired: false,
      });
    }
  }

  openAuditPage(iAuditDetails) {
    console.log('iAuditDetails', iAuditDetails);
    var auditRecords = this.props.data.audits.auditRecords;
    var isDownloadedDone = false;

    for (var i = 0; i < auditRecords.length; i++) {
      if (auditRecords[i].AuditId == iAuditDetails.AuditId) {
        isDownloadedDone = true;
      }
    }

    var obj = {
      ...iAuditDetails, ActualAuditId:iAuditDetails.AuditId ,  cStatus : constant.StatusDownloaded,  AuditStatus : parseInt(iAuditDetails.Status)
    };

    if (isDownloadedDone) {
      this.props.navigation.navigate('AuditPage', {
        datapass: {...iAuditDetails, ActualAuditId:iAuditDetails.AuditId , AuditStatus : parseInt(iAuditDetails.Status) }
      });
    } else {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.props.navigation.navigate('AuditPage', {
              datapass: obj,
            });
          } else {
            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
          }
        });
      }
    }
  }

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
  getAuditStatus = status => {
    console.warn('======', status);
    var percent = 0;
    // Set Audit Card color by checking its Status
    switch (status.AuditRecordStatus) {
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

  getCardColor(id) {
    var color = '#fff';
    switch (id.AuditRecordStatus) {
      case constant.StatusScheduled:
        color = '#F1EB0E';
        break;
      case constant.StatusDownloaded:
        color = '#cd8cff';
        break;
      case constant.StatusNotSynced:
        color = '#2ec3c7';
        break;
      case constant.StatusProcessing:
        color = '#e88316';
        break;
      case constant.StatusSynced:
        color = '#48bcf7';
        break;
      case constant.StatusCompleted:
        color = 'black';
        break;
      case constant.Completed:
        color = 'green';
        break;
      case constant.StatusDV:
        color = 'red';
        break;
      case constant.StatusDVC:
        color = 'green';
        break;
      default:
        color = '#F1EB0E';
        break;
    }

    return color;
  }
  render() {
    return (
      <View style={AuditPageStyle.container}>
        <OfflineNotice />
        <View style={AuditPageStyle.headerCont}>
          <ImageBackground
            source={Images.DashboardBG}
            style={AuditPageStyle.bgCont}>
            {this.renderHeader()}
          </ImageBackground>
        </View>
        <View style={{flex: 1}}>
          {this.state.auditList.length > 0 ? (
            <FlatList
              data={this.state.auditList}
              extraData={this.state}
              keyExtractor={item => item.ActualAuditId}
              // onEndReached={this.handleEnd.bind(this)}
              // onEndReachedThreshold={0.01}
              // refreshing={this.state.isRefreshing}
              // onRefresh={debounce(this.handleRefresh.bind(this), 800)}
              // ListFooterComponent={this.listFooter.bind(this)}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                  <View style={AuditPageStyle.auditBox}>
                    <View
                      style={[
                        AuditPageStyle.auditBoxStatusBar,
                        {backgroundColor: this.getCardColor(item)},
                      ]}></View>
                    <View style={AuditPageStyle.auditBoxContent}>
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
                    </View>
                    <View style={AuditPageStyle.auditBstoxStatus}>
                      {/* {(item.cStatus == 'Scheduled') ?
                        <ResponsiveImage source={Images.downloadIconImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : 
                        (item.cStatus == 'Not-synced') ? 
                        <ResponsiveImage source={Images.syncCardImg} initWidth="90" initHeight="90" style={styles.downloadIconImg}/> : */}
                      {/* <View style={AuditPageStyle.circle}>
                                            <ProgressCircle
                                                percent={this.getAuditStatus(item)}
                                                radius={28}
                                                borderWidth={5}
                                                color="#48BCF7"
                                                shadowColor="lightgrey"
                                                bgColor="#fff"
                                            >
                                                <Text style={AuditPageStyle.progressVal}>{this.getAuditStatus(item)}%</Text>
                                            </ProgressCircle>
                                        </View> */}
                      {/* } */}
                      {/* <Text style={AuditPageStyle.statusText}>
                        {item.AuditRecordStatus ==
                        'Deadline Violated and Completed'
                          ? 'D.Violated & Completed'
                          : item.AuditRecordStatus}
                      </Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              )}              
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
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: Fonts.size.h5,
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.No_records_found}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
  renderHeader() {
    return (
      <View style={AuditPageStyle.header}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <View style={AuditPageStyle.backlogo}>
            <Icon name="angle-left" size={40} color="white" />
          </View>
        </TouchableOpacity>
        <View style={AuditPageStyle.heading}>
          <Text style={AuditPageStyle.headingText}>{strings.downloads}</Text>
        </View>
        <View style={AuditPageStyle.headerDiv}>
          <TouchableOpacity
            style={{paddingRight: 10}}
            onPress={() => this.props.navigation.navigate('AuditDashboard')}>
            <Icon name="home" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Downloads);
