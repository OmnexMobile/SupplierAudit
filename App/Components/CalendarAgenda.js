import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
//styles
import { Fonts } from "./../Themes";
//library
import * as _ from "lodash";
import NetInfo from "@react-native-community/netinfo";
import { DoubleBounce } from "react-native-loader";
import { Agenda } from "react-native-calendars";
import Toast, { DURATION } from "react-native-easy-toast";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import Moment from "moment";
//services
import auth from "../Services/Auth";
//strings
import { strings } from "../Language/Language";
import constant from "../Constants/AppConstants";

const {
  whitneyBook_10,
  whitneyBook_12,
  whitneyBook_14,
  whitneyBook_18,
  whitneyBook_20,
  whitneyBook_17,
} = Fonts.style;
const {
  viley,
  thickGrey,
  slideGrey,
  mildGrey,
  indicGrey,
  blackGrey,
  headBlue,
} = Fonts.colors;

const shortWeekText = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class CalendarAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loader: true,
      // error: false,
      agendaData: this.props.agendaData,
      selectedFormat:
        this.props.dateFormat === null ? "DD-MM-YYYY" : this.props.dateFormat,
      startDate: undefined,
      endDate: undefined,
    };
  }
  changeDateFormatCard = (inDate) => {
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat + " " + "HH:mm";
      var sDateArr = inDate.split("T");
      var sDateValArr = sDateArr[0].split("-");
      var sTimeValArr = sDateArr[1].split(":");
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
        sTimeValArr[0],
        sTimeValArr[1]
      );
      return Moment(outDate).format(DefaultFormatL);
    }
  };

  componentDidMount() {
    console.log('propsssssss-----', this.props);
    
    // this.getYearAudits()
    /** Fething details from the reducers */
    // const { siteId, userId, token } = this.props.data.audits
    // var filterId = "", pageSize = 10, GlobalFilter = "",StartDate = "",EndDate = ""
    // var SortBy= "",SortOrder= "",Default = 0,  pageNo = 1
    // /** Call the API get the agenda datas */
    // auth.getauditlist(token, userId, siteId, pageNo, pageSize, filterId,GlobalFilter,StartDate,EndDate,SortBy,SortOrder,Default, (response, data) => {
    // //   console.log('AuditList list data',data)
    //     if(data.data) {
    //         /** success response can push data to calendar */
    //         if(data.data.Message === "Success"){
    //             var auditList = []
    //             var auditListProps = this.props.data.audits.audits
    //             for (var i = 0; i < data.data.Data.length; i++) {
    //                 var auditInfo = data.data.Data[i]
    //                 auditInfo['color'] = '#F1EB0E'
    //                 auditInfo['cStatus'] = constant.StatusScheduled
    //                 auditInfo['key'] = (this.keyVal + 1)
    //                 // Set Audit Status
    //                 if (data.data.Data[i].AuditStatus == 3) {
    //                     auditInfo['cStatus'] = constant.StatusCompleted
    //                 }
    //                 else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 0) {
    //                     auditInfo['cStatus'] = constant.StatusScheduled
    //                 }
    //                 else if (data.data.Data[i].AuditStatus == 2 && data.data.Data[i].PerformStarted == 1) {
    //                     auditInfo['cStatus'] = constant.StatusProcessing
    //                 }
    //                 else if (data.data.Data[i].AuditStatus == 4) {
    //                     auditInfo['cStatus'] = constant.StatusDV
    //                 }
    //                 else if (data.data.Data[i].AuditStatus == 5) {
    //                     auditInfo['cStatus'] = constant.StatusDVC
    //                 }
    //                 for (var j = 0; j < auditListProps.length; j++) {
    //                     if (parseInt(auditListProps[j].ActualAuditId) == parseInt(data.data.Data[i].ActualAuditId)) {
    //                         // Update Audit Status
    //                         if (auditListProps[j].cStatus == constant.StatusDownloaded || auditListProps[j].cStatus == constant.StatusNotSynced || auditListProps[j].cStatus == constant.StatusSynced) {
    //                             auditInfo['cStatus'] = auditListProps[j].cStatus
    //                         }
    //                         break
    //                     }
    //                 }
    //                 // Set Audit Card color by checking its Status
    //                 switch (auditInfo['cStatus']) {
    //                     case constant.StatusScheduled:
    //                         auditInfo['color'] = '#F1EB0E'
    //                         break
    //                     case constant.StatusDownloaded:
    //                         auditInfo['color'] = '#cd8cff'
    //                         break
    //                     case constant.StatusNotSynced:
    //                         auditInfo['color'] = '#2ec3c7'
    //                         break
    //                     case constant.StatusProcessing:
    //                         auditInfo['color'] = '#e88316'
    //                         break
    //                     case constant.StatusSynced:
    //                         auditInfo['color'] = '#48bcf7'
    //                         break
    //                     case constant.StatusCompleted:
    //                         auditInfo['color'] = 'green'
    //                         break
    //                     case constant.StatusDV:
    //                         auditInfo['color'] = 'red'
    //                         break
    //                     case constant.StatusDVC:
    //                         auditInfo['color'] = 'green'
    //                         break
    //                     default:
    //                         auditInfo['color'] = '#F1EB0E'
    //                         break
    //                 }
    //                 auditList.push(auditInfo)
    //                 this.keyVal = this.keyVal + 1;
    //             }
    //             this.transformAuditForAgenda(auditList)
    //         } else {
    //             this.addNoRecord()
    //         }
    //     } else {
    //         this.addNoRecord()
    //     }
    // })
  }

  getYearAudits() {
    const {  userId, token } = this.props.data.audits;
    const siteId = this.props.data.audits.siteId;
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        auth.getYearAudit(siteId, userId, token, (response, data) => {
          if (data.data) {
            if (data.data.Message === "Success") {
              if (data.data.Data && data.data.Data.length > 0) {
                console.log("year Audits---->", data.data.Data);
                var auditList = data.data.Data;
                let agendaObj = {};
                var auditListProps = this.props.data.audits.auditRecords;

                _.forEach(auditList, function (Audit_res) {
                  var auditInfo = Audit_res;
                  auditInfo["color"] = "#F1EB0E";
                  auditInfo["cStatus"] = constant.StatusScheduled;
                  auditInfo["key"] = this.keyVal + 1;

                  // Set Audit Status
                  if (Audit_res.AuditStatus == 3) {
                    auditInfo["cStatus"] = constant.StatusCompleted;
                  } else if (Audit_res.AuditStatus == 2) {
                    auditInfo["cStatus"] = constant.StatusScheduled;
                  } else if (
                    Audit_res.AuditStatus == 2 &&
                    Audit_res.PerformStarted == 1
                  ) {
                    auditInfo["cStatus"] = constant.StatusProcessing;
                  } else if (Audit_res.AuditStatus == 4) {
                    auditInfo["cStatus"] = constant.StatusDV;
                  } else if (Audit_res.AuditStatus == 5) {
                    auditInfo["cStatus"] = constant.StatusDVC;
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
                        auditInfo["cStatus"] =
                          auditListProps[j].AuditRecordStatus;
                      }
                      break;
                    }
                  }

                  // Set Audit Card color by checking its Status
                  switch (auditInfo["cStatus"]) {
                    case constant.StatusScheduled:
                      auditInfo["color"] = "#F1EB0E";
                      break;
                    case constant.StatusDownloaded:
                      auditInfo["color"] = "#cd8cff";
                      break;
                    case constant.StatusNotSynced:
                      auditInfo["color"] = "#2ec3c7";
                      break;
                    case constant.StatusProcessing:
                      auditInfo["color"] = "#e88316";
                      break;
                    case constant.StatusSynced:
                      auditInfo["color"] = "#48bcf7";
                      break;
                    case constant.StatusCompleted:
                      auditInfo["color"] = "green";
                      break;
                    case constant.StatusDV:
                      auditInfo["color"] = "red";
                      break;
                    case constant.StatusDVC:
                      auditInfo["color"] = "green";
                      break;
                    default:
                      auditInfo["color"] = "#F1EB0E";
                      break;
                  }

                  // auditList.push(auditInfo)
                  if (auditInfo.StartDate) {
                    const dateT = new Date(auditInfo.StartDate);
                    /** Adding prefix zero if not calendar will not shown any data */
                    let month =
                      dateT.getMonth() + 1 < 10
                        ? "0" + (dateT.getMonth() + 1)
                        : dateT.getMonth() + 1;
                    let datestr =
                      dateT.getDate() < 10
                        ? "0" + dateT.getDate()
                        : dateT.getDate();
                    let key = dateT.getFullYear() + "-" + month + "-" + datestr;
                    /** Mapping the audits based on the start date */
                    if (agendaObj[key]) {
                      agendaObj[key] = [...agendaObj[key], { ...auditInfo }];
                    } else {
                      agendaObj[key] = [{ ...auditInfo }];
                    }
                  }
                  this.keyVal = this.keyVal + 1;
                });
                /**
                 * Finally we have a structure like
                 * { 2020-02-10: [{},{}], 2020-01-28: [{}] }
                 */
                this.setState({
                  agendaData: agendaObj,
                  loader: false,
                  error: false,
                });
                // this.transformAuditForAgenda(auditList)
              } else {
                this.setState({ loader: false, error: false });
              }
            } else {
              this.setState({ loader: false, error: false });
            }
          } else {
            this.setState({ loader: false, error: false });
          }
        });
      } else {
        /** offline */
      }
    });
  }

  // addNoRecord() {
  //     const dateN = new Date()
  //     /** Adding prefix zero if not calendar will not shown any data */
  //     let month = (dateN.getMonth() + 1) < 10 ? ("0"+(dateN.getMonth() + 1)) : (dateN.getMonth() + 1)
  //     let datestr = dateN.getDate() < 10 ? ("0"+dateN.getDate()) : dateN.getDate()
  //     let key = dateN.getFullYear() + "-" + month + "-" + datestr

  //     /**
  //      * Finally we api response deonst seem giving data
  //      * { current_date: [{nodata}] }
  //      */
  //     this.setState({
  //         agendaData: {
  //             [key] : [
  //                 { "norecordfound" : strings.No_records_found, dateText : datestr, weekText: shortWeekText[dateN.getDay()] }
  //             ] }, loader: false, error: false })
  // }

  /**
   * @param {*} audits will be Array of object
   * we need to transform as object to render in calendar agenda
   * [ { StartDate: '2020-01-18T08:00:00' }]
   */
  transformAuditForAgenda(audits) {
    let agendaObj = {};
    _.forEach(audits, function (audit_res) {
      if (audit_res.StartDate) {
        const dateT = new Date(audit_res.StartDate);
        /** Adding prefix zero if not calendar will not shown any data */
        let month =
          dateT.getMonth() + 1 < 10
            ? "0" + (dateT.getMonth() + 1)
            : dateT.getMonth() + 1;
        let datestr =
          dateT.getDate() < 10 ? "0" + dateT.getDate() : dateT.getDate();
        let key = dateT.getFullYear() + "-" + month + "-" + datestr;
        /** Mapping the audits based on the start date */
        if (agendaObj[key]) {
          agendaObj[key] = [...agendaObj[key], { ...audit_res }];
        } else {
          agendaObj[key] = [{ ...audit_res }];
        }
      }
    });
    /**
     * Finally we have a structure like
     * { 2020-02-10: [{},{}], 2020-01-28: [{}] }
     */
    this.setState({ agendaData: agendaObj, loader: false, error: false });
  }
  // startDate:undefined,
  // endDate:undefined
  selectedDays(days) {
    console.log("---Onday pressed->", days);
    // // console.log('---->',days[dateString])
    // console.log('----dateString>',days.dateString)
    // if(!this.state.agendaData[days.dateString]){
    //     var newAgenda ={...this.state.agendaData,[days.dateString]:{}}
    //     console.log('newAgenda',newAgenda)
    // }
  }

  render() {
    if (this.state.loader) {
      return (
        <View style={styles.wrapper}>
          <View style={styles.loaderParent}>
            <ActivityIndicator size={20} color="#1CAFF6" />
          </View>
        </View>
      );
    } else if (this.state.error) {
      return (
        <View style={styles.errorWrapper}>
          <Text
            style={{
              fontSize: Fonts.size.h5,
              fontFamily: "OpenSans-Regular",
            }}
          >
            {strings.noactivity}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Agenda
            // The list of items that have to be displayed in agenda. If you want to render item as empty date
            // the value of date key has to be an empty array []. If there exists no value for date key it is
            // considered that the date in question is not yet loaded
            items={this.state.agendaData}
            // Callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={(month) => {
              console.log("trigger items loading");
            }}
            // Callback that fires when the calendar is opened or closed
            onCalendarToggled={(calendarOpened) => {
              console.log("calendarOpened", calendarOpened);
            }}
            // Callback that gets called on day press
            onDayPress={(day) => {
              this.selectedDays(day);
            }}
            // Callback that gets called when day changes while scrolling agenda list
            // onDayChange={(day)=>{console.log('day changed')}}
            // Initially selected day
            // selected={'2012-05-16'}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // maxDate={'2012-05-30'}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // Specify how each item should be rendered in agenda
            renderItem={(item, firstItemInDay) => {
              console.log('itemmcheckkkk',item);
              
              return (
                <AgendaItem
                  item={item}
                  itemTouchCallBack={(itemT) => {
                    this.openAuditPage(itemT);
                  }}
                  changeDateFormatCard={(str) => this.changeDateFormatCard(str)}
                />
              );
            }}
            // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
            // renderDay={(day, item) => {return (<View />);}}
            // Specify how empty date content with no items should be rendered
            // renderEmptyDate={() => {return (<View style={{width:'96%',height:1,backgroundColor:'lightgrey',marginTop:30}}/>);}}
            // Specify how agenda knob should look like
            // renderKnob={() => {return (<View />);}}
            // Specify what should be rendered instead of ActivityIndicator
            renderEmptyData={() => {
              return <NoAgendaItem />;
            }}
            // Specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => {
              return r1.text !== r2.text;
            }}
            // Hide knob button. Default = false
            // hideKnob={true}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            // markedDates={{
            //     '2012-05-16': {selected: true, marked: true},
            //     '2012-05-17': {marked: true},
            //     '2012-05-18': {disabled: true}
            // }}
            // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
            disabledByDefault={false}
            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
            onRefresh={() => console.log("refreshing...")}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
            refreshControl={null}
            // Agenda theme
            theme={{
              ...calendarTheme,
              agendaDayTextColor: "#313131",
              agendaKnobColor: "lightgrey",
            }}
            // Agenda container style
            style={{ backgroundColor: "#F5F4F6" }}
          ></Agenda>
          <Toast
            ref="toast"
            style={{ backgroundColor: "black", margin: 20 }}
            position="bottom"
            positionValue={300}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: "white" }}
          />
        </View>
      );
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
      this.props.navigation.navigate("AuditPage", {
        datapass: iAuditDetails,
      });
    } else {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.props.navigation.navigate("AuditPage", {
              datapass: iAuditDetails,
            });
          } else {
            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
          }
        });
      }
    }
  }
}

const calendarTheme = {
  backgroundColor: "#F5F4F6",
  calendarBackground: "#F5F4F6",
  textSectionTitleColor: "#313131",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#313131",
  textDisabledColor: "#d9e1e8",
  monthTextColor: "#00BAC8",
  indicatorColor: "blue",
  textDayFontWeight: "300",
  // textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: "300",
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
  textDayFontFamily: "OpenSans-Regular",
  textMonthFontFamily: "OpenSans-Bold",
  textDayHeaderFontFamily: "OpenSans-Regular",
};

//Guru -- 26/09/2022 - cicle & statusbar color changed as per web dev shared..
getAuditCircleColor = (status,status_or_circle) => {
  // console.warn('======',status)
  var circlecolor = 0
  var statusbarcolor = 0
  // Set Audit Card color by checking its Status
  switch (status) {
    case constant.StatusScheduled:
      circlecolor = '#0000FF'
      statusbarcolor = '#0000FF'
      break
  case constant.StatusCompleted:
      circlecolor = '#00FF00'
      statusbarcolor = '#00FF00'
      break 
  case constant.StatusDV:
      circlecolor = '#FF0000'
      statusbarcolor = '#FF0000'
      break 
  case constant.StatusDVC:    
      circlecolor = '#000000'
      statusbarcolor = '#000000'
      break 
  default:
      circlecolor = ''
      statusbarcolor = ''
      break
}             
  if (status_or_circle == 0){
         return circlecolor;         
  }
  else if(status_or_circle == 1){
         return statusbarcolor;    
  }
  console.log('circelcolor'+circlecolor+' statue bar color'+statusbarcolor)              
}                                        


const AgendaItem = (props) => {
  console.log("agendaitem", props.item);
  return (
    <View style={styles.agendaWrapper}>
      {/* <View style={styles.agendaDater}>
                <Text style={[whitneyBook_18, indicGrey]}>{props.item.dateText}</Text>
                <Text style={[whitneyBook_20, indicGrey]}>{props.item.weekText}</Text>
            </View> */}
      <TouchableOpacity
        style={styles.agendaBody}
        onPress={() => props.itemTouchCallBack(props.item)}
      >
        <View style={styles.agendaBodyContent}>
          <Text
            style={[
              styles.agendaBodyLeftIndicator,
              //props.item.color
                //? { backgroundColor: props.item.color }
                this.getAuditCircleColor(props.item.cStatus,1)
                ? { backgroundColor: this.getAuditCircleColor(props.item.cStatus,1) }
                : (props.item.color? 
                  { backgroundColor: props.item.color }
                  :{ backgroundColor: "#faed27" }),
            ]}
          />
          <View style={styles.flexer}>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_17,
                viley,
                { fontFamily: "OpenSans-Regular" },
              ]}
            >
              {props.item.Auditee}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_12,
                slideGrey,
                { fontFamily: "OpenSans-Regular" },
                styles.marginT2,
              ]}
            >
              {props.changeDateFormatCard(props.item.StartDate) +
                " - " +
                props.changeDateFormatCard(props.item.EndDate)}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_14,
                thickGrey,
                { fontFamily: "OpenSans-Regular" },
                styles.marginT4,
              ]}
            >
              {props.item.AuditProgramName}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_14,
                { fontFamily: "OpenSans-Regular" },
                thickGrey,
              ]}
            >
              {props.item.AuditNumber}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                whitneyBook_14,
                thickGrey,
                { fontFamily: "OpenSans-Regular" },
              ]}
            >
              {props.item.AuditCycleName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const NoAgendaItem = (props) => {
  return (
    <View style={styles.agendaWrapper}>
      <View style={styles.norecord_agendaBody}>
        <View style={styles.agendaBodyContent}>
          <Text style={styles.agendaBodyLeftIndicator} />
          <Text
            style={[
              whitneyBook_18,
              blackGrey,
              { fontFamily: "OpenSans-Regular" },
            ]}
          >
            {strings.noactivity}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexer: { flex: 1, paddingRight: 4 },
  flex_one: {
    flex: 1,
    paddingRight: 2,
    backgroundColor: "grey",
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  loaderParent: {
    paddingVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  agendaWrapper: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  agendaDater: {
    alignItems: "center",
    justifyContent: "center",
  },
  agendaBody: {
    flex: 1,
    // marginLeft: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 4,
  },
  norecord_agendaBody: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 4,
  },
  agendaBodyContent: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
  },
  agendaBodyLeftIndicator: {
    height: "100%",
    width: 4,
    marginLeft: 4,
    marginRight: 8,
  },
  agendaDateText: {
    fontSize: Fonts.size.h5,
    color: "grey",
  },
  agendaWeekText: {
    fontSize: Fonts.size.h4,
    color: "grey",
  },
  marginT2: {
    marginTop: 2,
  },
  marginT4: {
    marginTop: 4,
  },
});

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps)(withNavigation(CalendarAgenda));
