import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform
} from 'react-native'
import styles from './Styles/AuditResultStyle'
import { Images }from '../Themes/index'
import { width } from 'react-native-dimension'
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view'
import {connect} from "react-redux";
import Moment from 'moment';
import ResponsiveImage from 'react-native-responsive-image';
import OfflineNotice from '../Components/OfflineNotice'
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts'
import {strings} from '../Language/Language'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import auth from '../Services/Auth'
import Toast, { DURATION } from "react-native-easy-toast"
import NetInfo from "@react-native-community/netinfo";

class AuditResult extends Component{

  constructor(props){
    super(props);

    this.state={
      AuditResult:[],
      AuditResultTemplates:[],
      AuditResultReferences:[],
      AuditID:undefined,
      SiteID:undefined,
      AuditProgramId:undefined,
      AuditProgramOrder:undefined,
      AuditOrder:undefined,
      AuditTypeId:undefined,
      breadCrumbText:undefined,
      token: '',
      isLoading: false,
      selectedFormat:this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat
    }
  }

  componentDidMount(){
    if(this.props.data.audits.language === 'Chinese'){
      this.setState({ ChineseScript : true },() =>{
        strings.setLanguage('zh')
        this.setState({}) 
        console.log('Chinese script on',this.state.ChineseScript) })
    }
    else if(this.props.data.audits.language === null || this.props.data.audits.language === 'English'){
      this.setState({ ChineseScript : false },()=>{
        strings.setLanguage('en-US')           
        this.setState({})
        console.log('Chinese script off',this.state.ChineseScript)
      })
    }

    this.setState({
      token: this.props.data.audits.token,
      AuditID: this.props.navigation.state.params.AuditID,
      SiteID: this.props.navigation.state.params.SiteID,
      AuditProgramId: this.props.navigation.state.params.AuditProgramId,
      AuditProgramOrder: this.props.navigation.state.params.AuditProgramOrder,
      AuditOrder: this.props.navigation.state.params.AuditOrder,
      AuditTypeId: this.props.navigation.state.params.AuditTypeId,
      breadCrumbText:this.props.navigation.state.params.breadCrumb,
      // breadCrumbText: this.props.navigation.state.params.breadCrumb.length>30?this.props.navigation.state.params.breadCrumb.slice(0,30)+'...':this.props.navigation.state.params.breadCrumb
    }, () => {
      // this.getAuditResults()
      this.auditResultRefresh()
    })    
  }

  getAuditResults = () => {
    var auditResults = []
    var auditResultsTemplates = []
    var auditResultsReferences = []    

    var AllData = this.props.data.audits.auditRecords
    var AuditID = this.state.AuditID

    for(var i=0;i<AllData.length;i++){  
      if(AuditID.toString() == AllData[i].AuditId) {
        auditResults = AllData[i].AuditResults
      }
    }

    if(auditResults) {
      for(var i=0; i<auditResults.length; i++) {
        if(auditResults[i].FormType == 0) {
          auditResultsTemplates.push(auditResults[i])
        }
        else if(auditResults[i].FormType == 2) {
          auditResultsReferences.push(auditResults[i])
        }
      }
    }    

    this.setState({
      AuditResult: auditResults,
      AuditResultTemplates: auditResultsTemplates,
      AuditResultReferences: auditResultsReferences
    }, () => {      
      console.log('AuditResults', this.state.AuditResult)
      console.log('AuditResultTemplates', this.state.AuditResultTemplates)
      console.log('AuditResultReferences', this.state.AuditResultReferences)
    })
  }

  auditResultRefresh(){
    if(this.props.data.audits.isOfflineMode) {
      this.refs.toast.show(strings.Offline_Notice,DURATION.LENGTH_LONG)
    }
    else {
      var AuditRecordsorg = this.props.data.audits.auditRecords
      var AuditOrder = ''
      var AuditProgramId = ''
      for(var i=0; i<AuditRecordsorg.length; i++) {
        if(AuditRecordsorg[i].AuditId == this.state.AuditID) {
          AuditOrder = AuditRecordsorg[i].AuditOrderId
          AuditProgramId = AuditRecordsorg[i].AuditProgramId
          console.log("AuditOrder,AuditProgramId",AuditOrder,AuditProgramId)
        }
      }
      NetInfo.fetch().then(netState => {
        if(netState.isConnected) {
          this.setState({
            isLoading: true
          }, () => {
            const TOKEN = this.state.token
            const SiteID = this.state.SiteID
            const strSortBy = 'order by FormName asc'
            const iAuditId = this.state.AuditID
            const iAudProgId = AuditProgramId == '' ? this.state.AuditProgramId:AuditProgramId
            const iAudProgOrder = this.state.AuditProgramOrder
            const iAudTypeOrder = AuditOrder == '' ? this.state.AuditOrder:AuditOrder
            const iAudTypeId = this.state.AuditTypeId
            const strFunction = 'AuditResult'
        
            auth.getauditResult(SiteID,strSortBy,iAuditId,iAudProgId,iAudProgOrder,iAudTypeOrder,iAudTypeId,strFunction,TOKEN,(res,data) =>{
              console.log('Audit Result data',data)
              if(data.data) {
                if(data.data.Message === 'Success'){
                  var auditResults = data.data.Data
                  var auditResultsTemplates = []
                  var auditResultsReferences = [] 
          
                  if(auditResults) {
                    for(var i=0; i<auditResults.length; i++) {
                      if(auditResults[i].FormType == 0) {
                        auditResultsTemplates.push(auditResults[i])
                      }
                      else if(auditResults[i].FormType == 2) {
                        auditResultsReferences.push(auditResults[i])
                      }
                    }
                  }    
              
                  this.setState({
                    AuditResult: auditResults,
                    AuditResultTemplates: auditResultsTemplates,
                    AuditResultReferences: auditResultsReferences,
                    isLoading: false
                  }, () => {      
                    console.log('AuditResults', this.state.AuditResult)
                    console.log('AuditResultTemplates', this.state.AuditResultTemplates)
                    console.log('AuditResultReferences', this.state.AuditResultReferences)
                    // this.updateAuditResultsInStore()
                  })
                }
                else {
                  this.setState({
                    isLoading: false
                  })
                }
              }
              else {
                this.setState({
                  isLoading: false
                })
              }
            })
          })  
        }
        else {
          this.refs.toast.show(strings.No_sync,DURATION.LENGTH_LONG)
        }
      })
    }      
  }

  updateAuditResultsInStore = () => {
    var auditRecordsOrg = this.props.data.audits.auditRecords
    var auditRecords = []

    for(var p=0; p<auditRecordsOrg.length; p++) {
      auditRecords.push({ 
        AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,         
        AuditId: auditRecordsOrg[p].AuditId,
        AuditOrderId: auditRecordsOrg[p].AuditOrderId,
        AuditProgramId: auditRecordsOrg[p].AuditProgramId,
        AuditTypeId: auditRecordsOrg[p].AuditTypeId,
        SiteId: auditRecordsOrg[p].SiteId,
        Status: auditRecordsOrg[p].Status,
        AssignedTaskRoutes: auditRecordsOrg[p].AssignedTaskRoutes,
        AssociatesName: auditRecordsOrg[p].AssociatesName,
        AuditConductedByName: auditRecordsOrg[p].AuditConductedByName,
        AuditCycleCode: auditRecordsOrg[p].AuditCycleCode,
        AuditCycleName: auditRecordsOrg[p].AuditCycleName,
        AuditNumber: auditRecordsOrg[p].AuditNumber,
        AuditProgOrder: auditRecordsOrg[p].AuditProgOrder,
        AuditProgramName: auditRecordsOrg[p].AuditProgramName,
        AuditTemplateId: auditRecordsOrg[p].AuditTemplateId,
        AuditTemplateName: auditRecordsOrg[p].AuditTemplateName,
        AuditTypeName: auditRecordsOrg[p].AuditTypeName,
        Auditee: auditRecordsOrg[p].Auditee,
        AuditeeContactPersonName: auditRecordsOrg[p].AuditeeContactPersonName,
        AuditorName: auditRecordsOrg[p].AuditorName,
        CycleShortName: auditRecordsOrg[p].CycleShortName,
        EndDate: auditRecordsOrg[p].EndDate,        
        Formname: auditRecordsOrg[p].Formname,
        Formtype: auditRecordsOrg[p].Formtype,
        LeadAuditor: auditRecordsOrg[p].LeadAuditor,
        ProcessCategorysName: auditRecordsOrg[p].ProcessCategorysName,
        ProcessGroupsName: auditRecordsOrg[p].ProcessGroupsName,
        ProcessScopeName: auditRecordsOrg[p].ProcessScopeName,
        SchedulerName: auditRecordsOrg[p].SchedulerName,
        StartDate: auditRecordsOrg[p].StartDate,
        FormId: auditRecordsOrg[p].FormId,
        Formdata: auditRecordsOrg[p].Formdata,
        CheckListPropData: auditRecordsOrg[p].CheckListPropData,
        CheckpointLogic: auditRecordsOrg[p].CheckpointLogic,
        DropDownProps: auditRecordsOrg[p].DropDownProps,
        NCdetailsprops: auditRecordsOrg[p].NCdetailsprops,
        Listdata: auditRecordsOrg[p].Listdata,
        UserId: auditRecordsOrg[p].UserId,
        FromDocPro: auditRecordsOrg[p].FromDocPro,
        DocumentId: auditRecordsOrg[p].DocumentId,
        DocRevNo: auditRecordsOrg[p].DocRevNo,
        AuditRecordStatus: auditRecordsOrg[p].AuditRecordStatus,
        AuditResults: (this.state.AuditID.toString() == auditRecordsOrg[p].AuditId) ? this.state.AuditResult : auditRecordsOrg[p].AuditResults,
        AuditProcessList: auditRecordsOrg[p].AuditProcessList,
        PerformStarted:auditRecordsOrg[p].PerformStarted,
      })      
    }

    // Store audit list in redux store to set it in persistant storage 
    this.props.storeAuditRecords(auditRecords)
  }

  changeDateFormatCard = (inDate) => {
    console.log('==-->',inDate)
    console.log('selectedFormat==-->',this.state.selectedFormat)
    var DefaultFormatL = this.state.selectedFormat
    var sDateArr = inDate.split('T')
    var sDateValArr = sDateArr[0].split('-')
    var sTimeValArr = sDateArr[1].split(':')
    var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1])

    return Moment(outDate).format(DefaultFormatL)
  }

  render(){
    return(
      <View style={styles.wrapper}>
        <OfflineNotice />

        <ImageBackground 
          source={Images.DashboardBG}
          style={{
            resizeMode:'stretch',
            width: '100%',
            height: 65
        }}>
          <View style={styles.header}>            
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={40} color="white"/>
              </View>
            </TouchableOpacity>
            <View style={[styles.heading, {width: width(75)}]}>
              <Text style={styles.headingText}>{strings.Audit_Result_label}</Text>
              <Text numberOfLines={1} style={{fontSize:15,color:'white',fontFamily:'OpenSans-Regular'}}>{this.state.breadCrumbText}</Text>
            </View>
            <View style={[styles.headerDiv, {width: width(12)}]}>
                <TouchableOpacity style={{paddingRight:10}} onPress={()=>this.props.navigation.navigate("AuditDashboard")}>
                    <Icon name="home" size={35} color="white" />
                </TouchableOpacity> 
            </View>
          </View>
        </ImageBackground>        

        <View style={[styles.auditPageBody, {paddingTop: 20, padding: 0}]}>  

        <ImageBackground source={Images.BGlayerFooter} style={{
            resizeMode:'stretch',
            width: '100%',
            height: '100%'
        }}>      

        <ScrollableTabView
          renderTabBar={() =>
            <DefaultTabBar
              backgroundColor='white'
              activeTextColor='#2CB5FD'
              inactiveTextColor='#747474'              
              underlineStyle={{ backgroundColor: '#2CB5FD', borderBottomColor: '#2CB5FD', height: Platform.select({
                android: 0,
                ios: 5
              }) }}
              textStyle={{ fontSize: Fonts.size.h5,fontFamily:'OpenSans-Regular' }}
            />
          }
          tabBarPosition='overlayTop'          
        >
          <ScrollView tabLabel= {strings.Templates} style={styles.scrollViewBody}>
          {(!this.state.isLoading) ? (this.state.AuditResultTemplates) ? (this.state.AuditResultTemplates.length > 0) ?
            <View style={{marginTop: 60}}>

              {this.state.AuditResultTemplates.map((item,key) =>
                <View key={key} style={styles.cardBox}>

                  <View style={styles.sectionTop}>
                    <View style={styles.sectionContent}>
                      <Text numberOfLines={1} style={styles.boxHeader}>{strings.Form_Name}</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <Text numberOfLines={2} style={styles.boxContent}>{item.FormName}</Text>
                    </View>
                  </View>

                  <View style={styles.sectionTop}>
                    <View style={styles.sectionContent}>
                      <Text numberOfLines={1} style={styles.boxHeader}>{strings.Audit_Result}</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <Text style={styles.boxContent}>{item.AuditResultFile}</Text>
                    </View>
                  </View>

                  <View style={styles.sectionBottom}>
                    <View style={styles.sectionContent}>
                      <Text numberOfLines={1} style={styles.boxHeader}>{strings.Uploaded_on}</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <Text numberOfLines={1} style={styles.boxContent}>{this.changeDateFormatCard(item.UploadedOn)}</Text>
                    </View>
                  </View>

                </View>
              )}
            </View> : 
            <View style={{marginTop: 55}}>
              <Text style={{
                width: width(100),
                textAlign: 'center',
                marginTop: 45,
                fontSize: Fonts.size.h5,
                paddingTop: 40,
                color: 'grey',
                fontFamily:'OpenSans-Regular'
              }}>
                {strings.No_templates_found}
              </Text>
            </View> : <View style={{marginTop: 55}}>
              <Text style={{
                width: width(100),
                textAlign: 'center',
                marginTop: 45,
                fontSize: Fonts.size.h5,
                paddingTop: 40,
                color: 'grey',
                fontFamily:'OpenSans-Regular'
              }}>
                {strings.No_templates_found}
              </Text>
            </View> : 
            <View style={{
              marginTop: 55,
              width: width(100),
              alignItems: 'center',
              marginTop: 45,
              fontSize: Fonts.size.h5,
              paddingTop: 40,
              color: 'grey'}}>
              <Pulse size={30} color='#48BCF7'/>
            </View>
          }

          </ScrollView>

          <ScrollView tabLabel={strings.References} style={styles.scrollViewBody}>
            {(!this.state.isLoading) ? (this.state.AuditResultReferences) ? (this.state.AuditResultReferences.length > 0) ?
            <View style={{marginTop: 60}}>

            {this.state.AuditResultReferences.map((item,key) =>
              <View key={key} style={styles.cardBox}>

                <View style={styles.sectionTop}>
                  <View style={styles.sectionContent}>
                    <Text numberOfLines={1} style={styles.boxHeader}>{strings.Form_Name}</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    <Text numberOfLines={2} style={styles.boxContent}>{item.FormName}</Text>
                  </View>
                </View>

                <View style={styles.sectionTop}>
                  <View style={styles.sectionContent}>
                    <Text numberOfLines={1} style={styles.boxHeader}>{strings.Audit_Result}</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContent}>{item.AuditResultFile}</Text>
                  </View>
                </View>

                <View style={styles.sectionBottom}>
                  <View style={styles.sectionContent}>
                    <Text numberOfLines={1} style={styles.boxHeader}>{strings.Uploaded_on}</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    <Text numberOfLines={1} style={styles.boxContent}>{this.changeDateFormatCard(item.UploadedOn)}</Text>
                  </View>
                </View>

              </View>
            )}
            </View> : 
            <View style={{marginTop: 55}}>
              <Text style={{
                width: width(100),
                textAlign: 'center',
                marginTop: 45,
                fontSize: Fonts.size.h5,
                paddingTop: 40,
                color: 'grey',
                fontFamily:'OpenSans-Regular'
              }}>
                {strings.No_references_found}
              </Text>
            </View> : <View style={{marginTop: 55}}>
              <Text style={{
                width: width(100),
                textAlign: 'center',
                marginTop: 45,
                fontSize: Fonts.size.h5,
                paddingTop: 40,
                color: 'grey',
                fontFamily:'OpenSans-Regular'
              }}>
                {strings.No_references_found}
              </Text>
            </View> : 
            <View style={{
              marginTop: 55,
              width: width(100),
              alignItems: 'center',
              marginTop: 45,
              fontSize: Fonts.size.h5,
              paddingTop: 40,
              color: 'grey'}}>
              <Pulse size={30} color='#48BCF7'/>
            </View>
          }

          </ScrollView>
        </ScrollableTabView>

        </ImageBackground>  

        </View>
        <Toast ref="toast"
               style={{backgroundColor: 'black', margin: 20}}
               position='top'
               positionValue={200}
               fadeInDuration={750}
               fadeOutDuration={1000}
               opacity={0.8}
               textStyle={{color:'white'}}
        />        
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeAuditRecords: (auditRecords) => dispatch({type: 'STORE_AUDIT_RECORDS', auditRecords})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuditResult)
