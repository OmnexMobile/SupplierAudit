import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, FlatList, ScrollView, CheckBox, BackHandler, Platform } from 'react-native'
import AuditPageStyle from './Styles/AuditDashboardStyle'

import { Images } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts'
import { strings } from '../Language/Language'
import Modal from "react-native-modal"
import CalendarPicker from 'react-native-calendar-picker'
import { width, height } from 'react-native-dimension'
import Moment from 'moment';
import ProgressCircle from 'react-native-progress-circle'
import { extendMoment } from 'moment-range';

import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import auth from "../Services/Auth";
import OfflineNotice from '../Components/OfflineNotice'
import constant from '../Constants/AppConstants'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view'

const moment = extendMoment(Moment);
const window_width = Dimensions.get('window').width
class SyncStatus extends Component {

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
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
            AuditSearch: '',
            filterTypeFG: 0,
            SortBy: '',
            SortOrder: '',
            cFilterVal: 0,
            isSynced:true,
            isNotSynced:false,
            notSynced_auditList:[],
            synced_auditList:[],
            sync_History: []
        }
        this.willFocusSubscription = props.navigation.addListener('willFocus', () => {
            this.applyFilterChanges("Forms", 'StartDate', 1, null, null)
            this.applyFilterChanges("Forms", 'StartDate', 2, null, null)
        })
    }

    componentWillUnmount(){
        this.willFocusSubscription.remove()
    }

    componentDidMount() {
        console.log('AuditDashboardBody mounted', this.props.data.audits)
        if (this.props.data.audits.language === 'Chinese') {
            this.setState({ ChineseScript: true }, () => {
                strings.setLanguage('zh')
                this.setState({})
                // console.log('Chinese script on',this.state.ChineseScript) 
            })
        }
        else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
            this.setState({ ChineseScript: false }, () => {
                strings.setLanguage('en-US')
                this.setState({})
            })
        }
        // this.applyFilterChanges("Forms", 'StartDate', 1, null, null)
        // this.applyFilterChanges("Forms", 'StartDate', 2, null, null)
        this.getHistory()
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

    getHistory(){
        const UserId = this.props.data.audits.userId;
        const token = this.props.data.audits.token;
        auth.getSyncHistory(UserId, token, (res, data) => {
            if (data.data) {
                if (data.data.Success === true) {
                    this.setState({ sync_History: data.data.Data, loading: false })
                } else {
                    this.setState({ sync_History: [], loading: false })
                }
            } else {
                this.setState({ sync_History: [], loading: false })
            }
        })
    }

    applyFilterChanges(sortype, droptext, filterType, startDate, endDate) {
        console.log('sortype', sortype)
        console.log('droptext', droptext)
        console.log('filterType', filterType)
        console.log('startDate----->', startDate)
        console.log('endDate ---->', endDate)

        var data = this.props.data.audits.auditRecords
        var notsync = []
        var sync = []

        if(data){
            data.forEach((item)=>{
                if(item.AuditRecordStatus == constant.StatusNotSynced){
                    notsync.push(item)
                }
                if(item.AuditRecordStatus == constant.StatusSynced){
                    sync.push(item)
                }        
            })
        }

        this.setState({
            notSynced_auditList: notsync,
            loading: false,
            synced_auditList:sync,
            isLazyLoadingRequired: false
        })
    }


    openAuditPage(iAuditDetails) {
        console.log('iAuditDetails',iAuditDetails)
        var auditRecords = this.props.data.audits.auditRecords
        var isDownloadedDone = false

        for (var i = 0; i < auditRecords.length; i++) {
            if (auditRecords[i].AuditId == iAuditDetails.AuditId) {
                isDownloadedDone = true
            }
        }

        var obj = {
            ...iAuditDetails, ActualAuditId:iAuditDetails.AuditId ,  cStatus : constant.StatusDownloaded,  AuditStatus : parseInt(iAuditDetails.Status)
          };

        if (isDownloadedDone) {
            this.props.navigation.navigate('AuditPage', {
                datapass: {...iAuditDetails,ActualAuditId:iAuditDetails.AuditId , AuditStatus : iAuditDetails.Status }
            })
        }
        else {
            if (this.props.data.audits.isOfflineMode) {
                this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG)
            }
            else {
                NetInfo.fetch().then(netState => {
                    if (netState.isConnected) {
                        this.props.navigation.navigate('AuditPage', {
                            datapass: obj
                        })
                    }
                    else {
                        this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG)
                    }
                })
            }
        }
    }

    changeDateFormatCardWithTime = (inDate) => {
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat+' '+ 'HH:mm'
            var sDateArr = inDate.split('T')
            var sDateValArr = sDateArr[0].split('-')
            var sTimeValArr = sDateArr[1].split(':')
            var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1])
            return Moment(outDate).format(DefaultFormatL)
        }
    }

    changeDateFormatCard = (inDate) => {
        if (inDate) {
            var DefaultFormatL = this.state.selectedFormat
            var sDateArr = inDate.split('T')
            var sDateValArr = sDateArr[0].split('-')
            var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2])

            return Moment(outDate).format(DefaultFormatL)
        }
    }
    getAuditStatus = (status) => {
        // console.warn('======',status)
        var percent = 0
        // Set Audit Card color by checking its Status
        switch (status.AuditRecordStatus) {
            case constant.StatusScheduled:
                percent = 10
                break
            case constant.StatusDownloaded:
                percent = 30
                break
            case constant.StatusNotSynced:
                percent = 70
                break
            case constant.StatusProcessing:
                percent = 50
                break
            case constant.StatusSynced:
                percent = 90
                break
            case constant.StatusCompleted:
                percent = 100
                break
            case constant.StatusDV:
                percent = 60
                break
            case constant.StatusDVC:
                percent = 100
                break
            default:
                percent = 10
                break
        }

        return percent
    }

    getCardColor(id){
        var color = '#fff'
        switch (id.AuditRecordStatus) {
            case constant.StatusScheduled:
                color = '#F1EB0E'
                break
            case constant.StatusDownloaded:
                color = '#cd8cff'
                break
            case constant.StatusNotSynced:
                color = '#2ec3c7'
                break
            case constant.StatusProcessing:
                color = '#e88316'
                break
            case constant.StatusSynced:
                color = '#48bcf7'
                break
            case constant.StatusCompleted:
                color = 'black'
                break
            case constant.Completed:
                color = 'green'
                break
            case constant.StatusDV:
                color = 'red'
                break
            case constant.StatusDVC:
                color = 'green'
                break
            default:
                color = '#F1EB0E'
                break
        }

        return color
    }

    onSync(id,val){
        this.setState({
            isSynced:!this.state.isSynced, 
        })
    }
    onNotSync(){
        this.setState({
            isNotSynced:!this.state.isNotSynced,
        })
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
                <View style={{ flex: 1 }}>

                <ScrollableTabView
                        initialPage={this.state.activeTab}
                        renderTabBar={() =>
                            <DefaultTabBar
                                backgroundColor='white'
                                activeTextColor='#2CB5FD'
                                inactiveTextColor='#747474'
                                underlineStyle={{ backgroundColor: '#2CB5FD', borderBottomColor: '#2CB5FD', height: Platform.select({
                                    android: 0,
                                    ios: 5
                                  }) }}
                                textStyle={{ fontSize: Fonts.size.mediump,fontFamily:'OpenSans-Regular' }}
                            />
                        }
                        tabBarPosition="overlayTop"
                    >
                        {this.notSynced()}
                        {this.synced()}
                        {this.renderHistory()}
                    </ScrollableTabView>
                </View>
            </View>
        )
    }
    synced(){
        return(
            <View tabLabel={strings.Synced} style={AuditPageStyle.scrollViewBody}>
                <View style={{marginTop:50}}></View>
                {this.state.synced_auditList.length > 0 ?
                        <FlatList
                            data={this.state.synced_auditList}
                            extraData={this.state}
                            // onEndReached={this.handleEnd.bind(this)}
                            // onEndReachedThreshold={0.01}
                            // refreshing={this.state.isRefreshing}
                            // onRefresh={debounce(this.handleRefresh.bind(this), 800)}
                            // ListFooterComponent={this.listFooter.bind(this)}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                                    <View style={AuditPageStyle.auditBox}>
                                        <View style={[AuditPageStyle.auditBoxStatusBar, { backgroundColor: this.getCardColor(item) }]}></View>
                                        <View style={AuditPageStyle.auditBoxContent}>
                                            <Text numberOfLines={1} style={{ fontSize: Fonts.size.regular, color: '#485B9E',fontFamily:'OpenSans-Regular'}}>{item.Auditee}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: Fonts.size.small, color: '#A6A6A6' ,fontFamily:'OpenSans-Regular'}}>{this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}</Text>
                                            <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: Fonts.size.medium, color: '#545454',fontFamily:'OpenSans-Regular'}}>{item.AuditNumber}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: Fonts.size.medium, color: '#545454' ,fontFamily:'OpenSans-Regular'}}>{item.AuditCycleName}</Text>
                                        </View>
                                        <View style={AuditPageStyle.auditBoxStatus}>
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
                                            {/* <Text style={AuditPageStyle.statusText}>{item.AuditRecordStatus == 'Deadline Violated and Completed' ? 'D.Violated & Completed' : item.AuditRecordStatus}</Text> */}
                                        </View>
                                    </View>
                                </TouchableOpacity>}
                            keyExtractor={item => item.key}
                            ItemSeparatorComponent={() =>
                                <View style={{ width: window_width, height: 1, backgroundColor: 'transparent' }} />
                            }
                        />
                        : <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: Fonts.size.h5,fontFamily:'OpenSans-Regular'
                            }}>{strings.No_records_found}</Text>
                        </View>
                    }
            </View>
        )
    }

    notSynced(){
        return(
            <View tabLabel={strings.Not_Synced} style={AuditPageStyle.scrollViewBody}>
                                <View style={{marginTop:50}}></View>

            {this.state.notSynced_auditList.length > 0 ?
                        <FlatList
                            data={this.state.notSynced_auditList}
                            extraData={this.state}
                            // onEndReached={this.handleEnd.bind(this)}
                            // onEndReachedThreshold={0.01}
                            // refreshing={this.state.isRefreshing}
                            // onRefresh={debounce(this.handleRefresh.bind(this), 800)}
                            // ListFooterComponent={this.listFooter.bind(this)}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => this.openAuditPage(item)}>
                                    <View style={AuditPageStyle.auditBox}>
                                        <View style={[AuditPageStyle.auditBoxStatusBar, { backgroundColor: this.getCardColor(item) }]}></View>
                                        <View style={AuditPageStyle.auditBoxContent}>
                                            <Text numberOfLines={1} style={{ fontSize: Fonts.size.regular, color: '#485B9E',fontFamily:'OpenSans-Regular' }}>{item.Auditee}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: Fonts.size.small, color: '#A6A6A6',fontFamily:'OpenSans-Regular' }}>{this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}</Text>
                                            <Text numberOfLines={1} style={{ paddingTop: 5, fontSize: Fonts.size.medium, color: '#545454',fontFamily:'OpenSans-Regular' }}>{item.AuditNumber}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: Fonts.size.medium, color: '#545454',fontFamily:'OpenSans-Regular' }}>{item.AuditCycleName}</Text>
                                        </View>
                                        <View style={AuditPageStyle.auditBoxStatus}>
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
                                            {/* <Text style={AuditPageStyle.statusText}>{item.AuditRecordStatus == 'Deadline Violated and Completed' ? 'D.Violated & Completed' : item.AuditRecordStatus}</Text> */}
                                        </View>
                                    </View>
                                </TouchableOpacity>}
                            keyExtractor={item => item.key}
                            ItemSeparatorComponent={() =>
                                <View style={{ width: window_width, height: 1, backgroundColor: 'transparent' }} />
                            }
                        />
                       
             : 
             <View style={{ flex: 1, marginTop:100 ,justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{
                 fontSize: Fonts.size.h5,fontFamily:'OpenSans-Regular'
             }}>{strings.No_records_found}</Text>
         </View>}
         </View>   
        )  
    }
    renderHistory(){
        return(
            <View tabLabel={strings.History} style={AuditPageStyle.scrollViewBody}>
            <View style={{marginTop:50}}></View>
              {
                  this.state.sync_History.length > 0 ?
                      <FlatList
                          data={this.state.sync_History}
                          style={AuditPageStyle.marginTop10}
                          renderItem={({ item }) => {
                              return (
                                  <View style={AuditPageStyle.card}>
                                      <Text style={AuditPageStyle.detailTitle}>{strings.auditnumber}</Text>
                                      <Text style={AuditPageStyle.detailContent}>{item.AuditNumber}</Text>
                                      <Text style={AuditPageStyle.rowBorder}/>
                                      <Text style={AuditPageStyle.detailTitle}>{strings.Audit_SyncedOn} </Text>
                                      <Text style={AuditPageStyle.detailContent}>{this.changeDateFormatCardWithTime(item.DateTimeStamp)}</Text>
                                  </View>
                              )
                          }}
                      /> :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{
                              fontSize: Fonts.size.h5,fontFamily:'OpenSans-Regular'
                          }}>{strings.No_records_found}</Text>
                      </View>
              }
          </View>
        )

    }
    
    renderCard(){
        return(
            <View>
                
            </View>
        )
    }
    renderHeader() {
        return (
            <View style={AuditPageStyle.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={AuditPageStyle.backlogo}>
                        <Icon name="angle-left" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <View style={AuditPageStyle.heading}>
                    <Text style={AuditPageStyle.headingText}>{strings.syncstatus}</Text>
                </View>
                <View style={AuditPageStyle.headerDiv}>
                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.props.navigation.navigate("AuditDashboard")}>
                        <Icon name="home" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        data: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncStatus)