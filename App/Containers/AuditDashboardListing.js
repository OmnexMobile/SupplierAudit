import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
//styles
import styles from './Styles/AuditDashboardListingStyle';
//components
import OfflineNotice from '../Components/OfflineNotice';
import AuditCard from '../Components/AuditCard';
//library
import * as _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import {DoubleBounce} from 'react-native-loader';
import {connect} from 'react-redux';
//assets
import {Fonts, Images} from '../Themes';
import Icon from 'react-native-vector-icons/FontAwesome';
//services
import auth from '../Services/Auth';
//strings
import {strings} from '../Language/Language';
//const
import constant from '../Constants/AppConstants';

const {whitneyBook_18} = Fonts.style;
const {blackGrey} = Fonts.colors;

class AuditDashboardListing extends Component {
  constructor(props) {
    super(props);
    this.pageSize = 10;
    this.pageNo = 1;
    this.onEndReachedCalledDuringMomentum = false;
    this.filterId = this.props.navigation.getParam('filterId');
    this.state = {
      listEndReached: false,
      loader: true,
      error: false,
      subLoader: false,
      auditList: [],
      auditListAll: [],
    };
  }

  componentDidMount() {
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
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
    this.getAudits();
  }

  render() {
    return (
      <View style={styles.wrapper}>
        {/* Offline notification */}
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          {/* <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.backlogo}>
              <Icon name="angle-left" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text numberOfLines={1} style={styles.headingText}>
                {this.props.navigation.getParam('title')}
              </Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
              
                onPress={() =>
                  this.props.navigation.navigate('AuditDashboard')
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View> */}
          <View style={{flex:1,
            flexDirection:'row',justifyContent:'space-between',marginRight:30,marginLeft:30,marginTop:20,marginBottom:10}}>
            <View> 
              <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
             >
              <Icon name="angle-left" size={30} color="white" />
            </TouchableOpacity></View>
          <View>
            <Text numberOfLines={1} style={styles.headingText}>
                {this.props.navigation.getParam('title')}
              </Text></View>
              <View> 
                <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('AuditDashboard')
              }>
              <Icon name="home" size={30} color="white" />
            </TouchableOpacity></View></View>
        </ImageBackground>
        <View style={styles.auditPageBody}>
          {this.state.loader ? (
            <View style={styles.loaderParent}>
              <ActivityIndicator size={20} color="#1CAFF6" />
            </View>
          ) : this.state.error ? (
            <View style={styles.errorWrapper}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems:"center",
                  justifyContent: 'center',
                  marginRight:-25,
                  marginVertical: 10,
                }}>
                <Image
                  source={Images.emptybox}
                  style={{height: 65, resizeMode: 'contain'}}
                />
              </View>
              <Text
                style={[
                  whitneyBook_18,
                  blackGrey,
                  {fontFamily: 'OpenSans-Regular'},
                ]}>
                {strings.No_records_found}
              </Text>
            </View>
          ) : (
            this.renderFlatList()
          )}
        </View>
      </View>
    );
  }

  renderFlatList() {

    return (
      <FlatList
        contentContainerStyle={styles.listPadding}
        data={this.state.auditList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <AuditCard
            dateFormat={this.props.data.audits.userDateFormat}
            item={item}
            index={index}
            length={this.state.auditList.length + 1}
          />
        
        )}
        onEndReached={({distanceFromEnd}) => {
          /** we use this condition because will receive too many events after scroll end */
          if (!this.onEndReachedCalledDuringMomentum) {
            /** settng true user keep on dragging will elimintae unnecessary call */
            this.onEndReachedCalledDuringMomentum = true;
            this.setState({subLoader: true});
            this.getAudits();
          }
        }}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.5}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        ListFooterComponent={this.listFooter.bind(this)}
      />
    );
  }

  listFooter() {
    if (this.state.subLoader) {
      return (
        <View style={styles.subLoaderWrap}>
          <ActivityIndicator size={20} color="#1CAFF6" />
        </View>
      );
    } else {
      return null;
    }
  }

  getAudits() {
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        const {userId, token} = this.props.data.audits;
        const siteId = this.props.data.audits.siteId;

        var SM = this.props.data.audits.smdata;
        var GlobalFilter = '',
          StartDate = '',
          EndDate = '';
        var SortBy = '',
          SortOrder = '',
          Default = 1;
        let filterStr = '';

        if (this.filterId === 2) {
          filterStr = 'AuditStatus IN (2)';
        } else if (this.filterId === 3) {
          filterStr = 'AuditStatus IN (3)';
        } else if (this.filterId === 4) {
          filterStr = 'AuditStatus IN (4)';
        } else if (this.filterId === 5) {
          filterStr = 'AuditStatus IN (5)';
        }

        console.log('tret', auth.getauditlist);
        auth.getauditlist(
          token,
          userId,
          siteId,
          this.pageNo,
          this.pageSize,
          filterStr,
          GlobalFilter,
          StartDate,
          EndDate,
          SortBy,
          SortOrder,
          SM,
          Default,
          (response, data) => {
            console.log('get audit list', data);
            if (data.data) {
              if (data.data.Message === 'Success') {
                if (data.data.Data && data.data.Data.length === 0) {
                  if (this.state.auditList.length === 0) {
                    this.setState({
                      loader: false,
                      error: true,
                      subLoader: false,
                      listEndReached: false,
                    });
                  } else {
                    this.setState({
                      loader: false,
                      error: false,
                      subLoader: false,
                      listEndReached: false,
                    });
                  }
                  this.onEndReachedCalledDuringMomentum = true;
                } else {
                  /** Validating api returns same amount of data */
                  if (this.state.auditList.length === data.data.Data.length) {
                    this.onEndReachedCalledDuringMomentum = true;
                    this.setState({
                      loader: false,
                      error: false,
                      subLoader: false,
                      listEndReached: true,
                    });
                  } else {
                    //we are incrementing the next request form data
                    this.pageSize = this.pageSize + 10;
                    /** We have succes api repsonse we need to populate in UI */
                    this.transformAudits(data.data.Data);
                    this.onEndReachedCalledDuringMomentum = false;
                  }
                }
              } else {
                /**
                 * Failure response checking the list already having data
                 * If list having data we just hide the loader
                 * else there is no data for first request we have to show error
                 */
                if (this.state.auditList.length === 0) {
                  this.setState({
                    loader: false,
                    error: true,
                    subLoader: false,
                    listEndReached: true,
                  });
                } else {
                  /** Api error but we have data in the list */
                  this.onEndReachedCalledDuringMomentum = false;
                  this.setState({
                    loader: false,
                    error: false,
                    subLoader: false,
                    listEndReached: false,
                  });
                }
              }
            } else {
              /**
               * Failure response checking the list already having data
               * If list having data we just hide the loader
               * else there is no data for first request we have to show error
               */
              if (this.state.auditList.length === 0) {
                this.setState({
                  loader: false,
                  error: true,
                  subLoader: false,
                  listEndReached: true,
                });
              } else {
                /** Api error but we have data in the list */
                this.onEndReachedCalledDuringMomentum = false;
                this.setState({
                  loader: false,
                  error: false,
                  subLoader: false,
                  listEndReached: false,
                });
              }
            }
          },
        );
      } else {
        /** Users is offline */
        this.setState({
          loader: false,
          error: true,
        });
      }
    });
  }

  transformAudits(audits) {
    var auditList = [];
    var auditListProps = this.props.data.audits.auditRecords;
    console.log('AuditListProps', auditListProps);

    for (var i = 0; i < audits.length; i++) {
      var auditInfo = audits[i];
      auditInfo['color'] = '#1081de';
      auditInfo['cStatus'] = constant.StatusScheduled;
      auditInfo['key'] = this.keyVal + 1;

      // Set Audit Status

      // Set Audit Status
      if (audits[i].AuditStatus == 3 && (audits[i].CloseOutStatus == "9" || audits[i].CloseOutStatus == "7")) {
        auditInfo['cStatus'] = constant.StatusCompleted;
      } else {
        if (audits[i].AuditStatus == 3 && audits[i].CloseOutStatus !== "9" && audits[i].CloseOutStatus !== "7") {
          auditInfo['cStatus'] = constant.Completed;
        } else if (
          audits[i].AuditStatus == 2 &&
          audits[i].PerformStarted == 0
        ) {
          auditInfo['cStatus'] = constant.StatusScheduled;
        } else if (
          audits[i].AuditStatus == 2 &&
          audits[i].PerformStarted == 1
        ) {
          auditInfo['cStatus'] = constant.StatusProcessing;
        } else if (audits[i].AuditStatus == 4) {
          auditInfo['cStatus'] = constant.StatusDV;
        } else if (audits[i].AuditStatus == 5) {
          auditInfo['cStatus'] = constant.StatusDVC;
        }
      }
      for (var j = 0; j < auditListProps.length; j++) {
        if (
          parseInt(auditListProps[j].AuditId) ==
          parseInt(audits[i].ActualAuditId)
        ) {
          // Update Audit Status
          if (
            auditListProps[j].AuditRecordStatus == constant.StatusDownloaded ||
            auditListProps[j].AuditRecordStatus == constant.StatusNotSynced ||
            auditListProps[j].AuditRecordStatus == constant.StatusSynced
          ) {
            auditInfo['cStatus'] = auditListProps[j].AuditRecordStatus;
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
          auditInfo['color'] = '#000';
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
          auditInfo['color'] = '#000';
          break;
      }

      auditList.push(auditInfo);
      this.keyVal = this.keyVal + 1;
    }

    this.setState({
      auditList: auditList,
      auditListAll: auditList,
      loader: false,
      error: false,
      subLoader: false,
      listEndReached: false,
    });
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps)(AuditDashboardListing);
