import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Button,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import styles from "./Styles/AuditDashboardStyle";
import Images from "../Themes/Images";
import auth from "../Services/Auth";
import { connect } from "react-redux";
// import FilterSection from "./FilterSection";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import Toast, { DURATION } from "react-native-easy-toast";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { width, height } from "react-native-dimension";
import ProgressCircle from "react-native-progress-circle";
import ResponsiveImage from "react-native-responsive-image";
import Fonts from "../Themes/Fonts";
import { strings } from "../Language/Language";
import NetInfo from "@react-native-community/netinfo";
import Immutable from "seamless-immutable";
import { debounce, once } from "underscore";
import constant from "../Constants/AppConstants";
import OfflineNotice from "../Components/OfflineNotice";
import ScrollableTabView, {
  DefaultTabBar,
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/FontAwesome";
//component
import CalendarAgenda from "./../Components/CalendarAgenda";
import * as _ from "lodash";
import { TextInput } from "react-native-gesture-handler";

const moment = extendMoment(Moment);
const window_width = Dimensions.get("window").width;

const Reset = "Reset";

class AllTabAuditList extends Component {
  keyVal = 0;
  sortType = 0;
  isCalender = undefined;

  constructor(props) {
    super(props);

    this.state = {
      auditList: [],
      auditListAll: [],
      token: "",
      userId: "",
      siteId: "",
      page: 1,
      loading: true,
      isRefreshing: false,
      isLazyLoading: false,
      isLazyLoadingRequired: true,
      filterType: "",
      sortype: "",
      dataSetArr: [],
      filterId: "",
      isMounted: false,
      isPageEmpty: false,
      isLocalFilterApplied: false,
      isSearchFinished: false,
      enableScrollViewScroll: true,
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? "DD-MM-YYYY"
          : this.props.data.audits.userDateFormat,
      AuditSearch: "",
      filterTypeFG: 0,
      SortBy: "StartDate",
      SortOrder: "",
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
      audit_filterType: "Sort",
      audit_sortText: "",
      agendaData: {},
      todayLoader: true,
      isErrorRefresh: false,
      current_audit_id: "",
      //need to remove hot coded values...
      reportdata: "",
      Department_Workstation: "",
      Auditorname: "",
      AuditDate: "",
      PlantName: "",
      LeadAuditor: "",
    };
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.backHandle();
      return true;
    });
  }
  backHandle() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
    console.log("Previous---->", PreviousPage);
    if (PreviousPage == "LoginUIScreen") {
      this.props.navigation.navigate("AuditDashboard");
    } else {
      this.backHandler.remove();
    }
  }

  componentWillMount() {
    console.log(
      "this.props.navigation.state.params",
      this.props.navigation.state.params
    );

    this.setState(
      { current_audit_id: this.props.navigation.state.params.auditid },
      () =>
        console.log("audit id value checking:" + this.state.current_audit_id)
    );

    if (this.props.navigation.state.params) {
      if (this.props.navigation.state.params.ActiveTab) {
        if (this.props.navigation.state.params.ActiveTab == "recent") {
          this.setState({ activeTab: 1 });
        } else if (this.props.navigation.state.params.ActiveTab == "today") {
          this.setState({ activeTab: 2 });
        }
      }
    }
    console.log("audit id value checking:" + this.state.current_audit_id);
  }

  componentDidMount() {
    console.log("stored audit details:" + this.props.data.audits.auditRecords);
    if (this.props.data.audits.language === "Chinese") {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage("zh");
        this.setState({});
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === "English"
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage("en-US");
        this.setState({});
      });
    }

    console.log("navigation props" + this.props.navigation.state.params);
    const auditid = this.props.navigation.state.params.auditid;
    const datapass = this.props.navigation.state.params.generatereportData;
    const Token = this.props.data.audits.token;

    console.log(
      "current audit id & datapass:" +
        this.props.navigation.state.params.auditid +
        datapass
    );
    old_data = {
      Data: [
        {
          DocProParameter: "NC-1322-174",
          SiteLevelId: "dsl86",
          UniqueNCkey: "1648458408",
          AuditeeName: "George G  ",
          AuditorName: "Davis Martin  ",
          LeadAuditor: "Davis Martin  ",
          AuditCompletionDate: "",
          AuditStartDate: "08/31/23",
          AuditEndDate: "08/31/23",
          DepartmentName: "Department Area->BP Line 1->BPSL002",
          AuditNumber: "LPA-Supervisor-2023-AUG-2435",
          PlantName: "FIS Greenville",
          Commodities:
            "IATF-2021-JUL-6-2348-OFI-17@O To FI#$IATF-2021-JUL-6-2348-OFI-18@O To FI#$IATF-2021-JUL-6-2348-OFI-33@O To FI#$IATF-2021-JUL-6-2348-OFI-34@O To FI#$IATF-2021-JUL-6-2348-OFI-35@O To FI#$IATF-2021-JUL-6-2348-OFI-36@O To FI#$IATF-2021-JUL-6-2348-OFI-37@O To FI#$IATF-2021-JUL-6-2348-OFI-38@O To FI#$IATF-2021-JUL-6-2348-OFI-39@O To FI#$IATF-2021-JUL-6-2348-OFI-40@O To FI#$IATF-2021-JUL-6-2348-OFI-41@O To FI#$IATF-2021-JUL-6-2348-OFI-42@O To FI#$IATF-2021-JUL-6-2348-OFI-43@O To FI#$IATF-2021-JUL-6-2348-OFI-44@O To FI#$IATF-2021-JUL-6-2348-OFI-22@O To FI#$IATF-2021-JUL-6-2348-OFI-23@O To FI#$IATF-2021-JUL-6-2348-OFI-24@O To FI#$IATF-2021-JUL-6-2348-OFI-25@O To FI#$IATF-2021-JUL-6-2348-OFI-26@O To FI#$IATF-2021-JUL-6-2348-OFI-27@O To FI#$IATF-2021-JUL-6-2348-OFI-28@O To FI#$IATF-2021-JUL-6-2348-OFI-29@O To FI#$IATF-2021-JUL-6-2348-OFI-46@O To FI#$IATF-2021-JUL-6-2348-OFI-48@O To FI#$IATF-2021-JUL-6-2348-OFI-3@O To FI#$IATF-2021-JUL-6-2348-OFI-5@O To FI#$IATF-2021-JUL-6-2348-OFI-2@O To FI#$IATF-2021-JUL-6-2348-OFI-13@O To FI#$IATF-2021-JUL-6-2348-OFI-14@O To FI#$IATF-2021-JUL-6-2348-OFI-19@O To FI#$IATF-2021-JUL-6-2348-OFI-20@O To FI#$IATF-2021-JUL-6-2348-OFI-1@O To FI#$IATF-2021-JUL-6-2348-OFI-15@O To FI#$IATF-2021-JUL-6-2348-OFI-21@O To FI#$IATF-2021-JUL-6-2348-OFI-30@O To FI#$IATF-2021-JUL-6-2348-OFI-31@O To FI#$IATF-2021-JUL-6-2348-OFI-32@O To FI#$IATF-2021-JUL-6-2348-OFI-6@O To FI#$IATF-2021-JUL-6-2348-OFI-7@O To FI#$IATF-2021-JUL-6-2348-OFI-8@O To FI#$IATF-2021-JUL-6-2348-OFI-9@O To FI#$IATF-2021-JUL-6-2348-OFI-10@O To FI#$IATF-2021-JUL-6-2348-OFI-11@O To FI#$IATF-2021-JUL-6-2348-OFI-12@O To FI#$IATF-2021-JUL-6-2348-OFI-16@O To FI#$IATF-2021-JUL-6-2348-OFI-45@O To FI#$IATF-2021-JUL-6-2348-OFI-47@O To FI#$IATF-2021-JUL-6-2348-OFI-49@O To FI#$IATF-2021-JUL-6-2348-OFI-50@O To FI#$IATF-2021-JUL-6-2348-OFI-4@O To FI",
          ClientLogo:
            "iVBORw0KGgoAAAANSUhEUgAAAJoAAABACAIAAABtOPkJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIiGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMTAtMThUMTk6MDM6MzErMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMTAtMThUMTk6MDQ6MDErMDU6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTEwLTE4VDE5OjA0OjAxKzA1OjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNzY5MTE0YS0zOTNiLTVjNDktOTY4Yy1lZmIwMGRjOTBlY2UiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5MzM0NzVmZC03ZDdiLTBmNDMtYjZhYy1jMmRiODFmNjlhNDMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMjM1YWFkMC04ZmM0LTYwNDItYjI2MC02NGYxMmJmMDQ5MGQiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQyMzVhYWQwLThmYzQtNjA0Mi1iMjYwLTY0ZjEyYmYwNDkwZCIgc3RFdnQ6d2hlbj0iMjAyMi0xMC0xOFQxOTowMzozMSswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNzY4MWU3MC1mYTUzLWRjNDctOTgyYi0wZjNhNjgwZGMwZDEiIHN0RXZ0OndoZW49IjIwMjItMTAtMThUMTk6MDQ6MDErMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDc2OTExNGEtMzkzYi01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",
          EffectiveDate: "11/07/2022",
          RevID: 0,
          strNonconformance: "",
          AREA: "",
          Location: "",
          Time: "",
          ShiftName: "",
          FormatNo: "",
          AuditorSignature: null,
          AuditeeSignature: null,
          NCCount: 50,
          OpenNC: 50,
          ClosedNC: 0,
          StrongPoints: "",
          TotalClosedNC: 0,
          TotalNC: 0,
          ChecklistNCCount: 50,
          CheckpointCount: 0,
          RepeatCount: 1,
          auditorauditeeSupplierCheckListEN: [
            {
              iComplevelID: 3,
              iCheckListTemplateID: 100,
              iScore: 0.0,
              iTotalScore: 0.0,
              iParentID: 99,
              CheckListName: "P2.Project Management",
              aggregateValue: 100,
              QType: 2,
              EvaluationStatus: "",
              iFormID: 20,
              strFormName: "VDA Process Audit (P2-P4)",
              iTotalmaxScore: 0.0,
              strRemarks: "",
              Specification: "",
              Description: "",
              Reactionplan: "",
              Veto: 0,

              Sno: "",
              FailureCategoryID: 0,
              FailureReasonID: 0,

              ParamValue: 0,
              IsCloseOut: 0,
              strfailurecategory: "",
              strfailurereason: "",
              Type: 0,
              GSymbol: null,
              Gscore: null,
              YSymbol: null,
              Yscore: null,
              RSymbol: null,
              Rscore: null,
              ProcessId: 0,
              Processname: null,
              DocumentID: 0,
              DocumentName: "",
            },
            {
              iComplevelID: 4,
              iCheckListTemplateID: 104,
              iScore: -1.0,
              iTotalScore: 0.0,
              iParentID: 100,
              CheckListName:
                "Is the advanced product quality planning implemented within the project and monitored for compliance?",
              aggregateValue: 100,
              QType: 2,
              EvaluationStatus: "",
              iFormID: 20,
              strFormName: "VDA Process Audit (P2-P4)",
              iTotalmaxScore: 0.0,
              strRemarks: "",
              Specification: "",
              Description: "",
              Reactionplan: "",
              Veto: 0,
              Sno: "",
              FailureCategoryID: 0,
              FailureReasonID: 0,
              ParamValue: 0,
              IsCloseOut: 0,
              strfailurecategory: "",
              strfailurereason: "",
              Type: 0,
              GSymbol: null,
              Gscore: null,
              YSymbol: null,
              Yscore: null,
              RSymbol: null,
              Rscore: null,
              ProcessId: 0,
              Processname: null,
              DocumentID: 0,
              DocumentName: "",
            },
            {
              iComplevelID: 5,
              iCheckListTemplateID: 145,
              iScore: 36.0,
              iTotalScore: 50.0,
              iParentID: 144,
              CheckListName: "6.1 Process Input",
              aggregateValue: 100,
              QType: 2,
              EvaluationStatus: "",
              iFormID: 27,
              strFormName: "Injection",
              iTotalmaxScore: 0.0,
              strRemarks: "",
              Specification: "",
              Description: "",
              Reactionplan: "",
              Veto: 0,
              Sno: "",
              FailureCategoryID: 0,
              FailureReasonID: 0,
              ParamValue: 0,
              IsCloseOut: 0,
              strfailurecategory: "",
              strfailurereason: "",
              Type: 0,
              GSymbol: null,
              Gscore: null,
              YSymbol: null,
              Yscore: null,
              RSymbol: null,
              Rscore: null,
              ProcessId: 0,
              Processname: null,
              DocumentID: 0,
              DocumentName: "",
            },
          ],
        },
      ],
      Success: true,
      Message: "Success",
    };
    console.log(
      "old data " + old_data.Data[0].auditorauditeeSupplierCheckListEN
    );
    this.setState({
      reportdata: old_data.Data[0].auditorauditeeSupplierCheckListEN,
    });
    //header data storing here
    this.setState({
      Department_Workstation: old_data.Data[0].DepartmentName,
      AuditDate: old_data.Data[0].AuditStartDate,
      AuditorName: old_data.Data[0].LeadAuditor,
    });
    console.log("report data props" + this.state.reportdata);

    /*
    auth.getreportdata(datapass, Token, (res, data) => {
      console.log("getreportdata", data);

      if (data.data.Message == "Success") {
        //this.setState({nextAudit : data.data.Data[0]})
        console.log("received data successfuully");
      } else {
        //this.setState({ nextAudit: '' })
        console.log("data not received..");
      }
    });
    */

    this.props.navigation.addListener("didFocus", () => {
      // console.log('Audit List Component Focussed!')

      if (this.props.navigation.getParam("filter_Arr")) {
        console.log(
          "Filter Applied",
          this.props.navigation.getParam("filter_Arr")
        );
        this.filterApplied(this.props.navigation.getParam("filter_Arr"));
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
            }
          );
        }
        if (this.state.token == "") {
          this.getSessionValues();
        }
      }

      this.componentWhenReceiveProps();
    });
    //this.getYearAudits();
  }

  componentWhenReceiveProps() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    // console.log('--CurrentPage--->',CurrentPage)

    if (CurrentPage == "AllTabAuditList") {
      if (this.state.isMounted && this.state.isLazyLoadingRequired) {
        if (
          this.props.searchFlag == true &&
          this.props.onRecieveSearchSubmit != ""
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
                    "",
                    "Status",
                    "",
                    ""
                  );
                } else if (
                  this.state.filterTypeFG > 0 &&
                  parseInt(this.props.filterType) == 0
                ) {
                  this.applyFilterChanges(0, "", "Status", "", "");
                } else {
                  this.getAuditlist();
                }
              }
            );
          } else {
            if (
              parseInt(this.props.filterType) > 0 &&
              this.state.filterTypeFG != parseInt(this.props.filterType)
            ) {
              this.applyFilterChanges(
                parseInt(this.props.filterType),
                "",
                "Status",
                "",
                ""
              );
            } else if (
              this.state.filterTypeFG > 0 &&
              parseInt(this.props.filterType) == 0
            ) {
              this.applyFilterChanges(0, "", "Status", "", "");
            }
          }
        } else {
          // console.log('searchFlag is false -->',this.state.AuditSearch)
          if (this.state.AuditSearch != "") {
            this.setState(
              {
                AuditSearch: "",
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
                    "",
                    "Status",
                    "",
                    ""
                  );
                } else if (
                  this.state.filterTypeFG > 0 &&
                  parseInt(this.props.filterType) == 0
                ) {
                  this.applyFilterChanges(0, "", "Status", "", "");
                } else {
                  this.getAuditlist();
                }
              }
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
                    ? "DD-MM-YYYY"
                    : this.props.data.audits.userDateFormat,
              },
              () => {
                if (
                  parseInt(this.props.filterType) > 0 &&
                  this.state.filterTypeFG != parseInt(this.props.filterType)
                ) {
                  this.applyFilterChanges(
                    parseInt(this.props.filterType),
                    "",
                    "Status",
                    "",
                    ""
                  );
                } else if (
                  this.state.filterTypeFG > 0 &&
                  parseInt(this.props.filterType) == 0
                ) {
                  this.applyFilterChanges(0, "", "Status", "", "");
                }
              }
            );
          }
        }
      }
    }
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
                    }
                  );
                }
              });
            }
          }
        );
      }
    } catch (error) {
      // Error retrieving data
      // console.log('Failed to retrive a login session!!!',error)
    }
  };

  Apicalling_generatereport(auditid, audit_Records) {
    console.log("generation report..." + auditid + "" + audit_Records[0]);
    console.log("current audit:" + auditid);
    const Token = this.props.data.audits.token;
    console.log("token value" + Token);
    var RequestParam = [];

    //console.log('audit id::'+ this.state.current_audit_id)

    //  console.log('audit records'+ this.props.data.audits.auditRecords)
    var auditRecords = audit_Records;
    for (var i = 0; i < auditRecords.length; i++) {
      console.log("audit details one by one:" + auditRecords[0].AuditCycleName);
      if (auditid == auditRecords[i].AuditId) {
        console.log("audit id values matched..");
        RequestParam.push({
          auditid: auditRecords[i].AuditId,
          AuProgId: auditRecords[i].AuditProgramId,
          AuProgOrder: auditRecords[i].AuditProgOrder,
          AuTypeOrder: auditRecords[i].AuditTypeOrder,
          AuTypeId: auditRecords[i].AuditTypeId,
          auditorder: auditRecords[i].AuditOrderId,
          AuditTempId: auditRecords[i].AuditTemplateId,

          //SiteId: SiteId
        });
      }
    }
    console.log("requested param value:" + RequestParam[0].auditid);
/*
    auth.generatereportdata(RequestParam, Token, (res, data) => {
      console.log("getMynextAudit", data);
      if (data.data.Message == "Success") {
        //this.setState({ nextAudit: data.data.Data[0] });
        console.log(data)
      } else {
        //this.setState({ nextAudit: "" });
        console.log(data)
      }
    });
    */
  }

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
        console.log("getAuditlist ------>");
        var pageNo = this.state.page;
        var token = this.props.data.audits.token;
        var userId = this.props.data.audits.userId;
        var siteId = this.props.data.audits.siteId;
        var filterId = this.state.filterId;
        var pageSize = 10;
        var GlobalFilter = this.state.AuditSearch;
        var StartDate = startDate == undefined ? "" : startDate;
        var EndDate = endDate == undefined ? "" : endDate;
        var SortBy = this.state.SortBy;
        var SortOrder = this.state.SortOrder;
        var Default = this.state.default;

        console.log(
          "api date",
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
          Default
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
          (response, data) => {
            console.log("AuditList list data", data);

            if (data.data) {
              if (data.data.Message == "Success") {
                var auditRecords = this.props.data.audits.auditRecords;
                // console.log("audit Records",auditRecords)

                // console.log('auditList API response', data.data)
                // console.log('auditList from props', this.props.data.audits.audits)
                var auditList = [];
                var auditListProps = this.props.data.audits.audits;

                for (var i = 0; i < data.data.Data.length; i++) {
                  var auditInfo = data.data.Data[i];
                  auditInfo["color"] = "#F1EB0E";
                  auditInfo["cStatus"] = constant.StatusScheduled;
                  auditInfo["key"] = this.keyVal + 1;

                  // Set Audit Status
                  if (data.data.Data[i].AuditStatus == 3) {
                    auditInfo["cStatus"] = constant.StatusCompleted;
                  } else if (
                    data.data.Data[i].AuditStatus == 2 &&
                    data.data.Data[i].PerformStarted == 0
                  ) {
                    auditInfo["cStatus"] = constant.StatusScheduled;
                  } else if (
                    data.data.Data[i].AuditStatus == 2 &&
                    data.data.Data[i].PerformStarted == 1
                  ) {
                    auditInfo["cStatus"] = constant.StatusProcessing;
                  } else if (data.data.Data[i].AuditStatus == 4) {
                    auditInfo["cStatus"] = constant.StatusDV;
                  } else if (data.data.Data[i].AuditStatus == 5) {
                    auditInfo["cStatus"] = constant.StatusDVC;
                  }

                  for (var j = 0; j < auditRecords.length; j++) {
                    if (
                      parseInt(auditRecords[j].AuditId) ==
                      parseInt(data.data.Data[i].ActualAuditId)
                    ) {
                      // Update Audit Status
                      console.log(
                        "auditRecords AuditRecordStatus",
                        auditRecords[j].AuditRecordStatus
                      );
                      if (
                        auditRecords[j].AuditRecordStatus ==
                          constant.StatusDownloaded ||
                        auditRecords[j].AuditRecordStatus ==
                          constant.StatusNotSynced ||
                        auditRecords[j].AuditRecordStatus ==
                          constant.StatusSynced
                      ) {
                        auditInfo["cStatus"] =
                          auditRecords[j].AuditRecordStatus;
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

                  auditList.push(auditInfo);
                  this.keyVal = this.keyVal + 1;
                }

                // console.log('AuditDashBody Props Before Changing...', this.props)
                // if( data.data.Data.length > 10){
                //     var finalAuditListAll = this.state.auditListAll.concat(auditList)
                //     var finalAuditList = this.state.auditList.concat(auditList)
                // }
                // else{
                //     var finalAuditListAll = auditList
                //     var finalAuditList = auditList
                // }
                try {
                  console.log(
                    "this.state.auditList.concat(auditList)",
                    this.state.auditList
                  );

                  var finalAuditListAll =
                    this.state.auditListAll.concat(auditList);
                  var finalAuditList = this.state.auditList.concat(auditList);

                  let bufferList = Array.from(new Set(auditList));
                  // console.warn(bufferList)

                  // Store audit list in redux store to set it in persistant storage
                  this.props.storeAudits(bufferList);

                  if (StartDate != "" && EndDate != "") {
                    this.setState({
                      auditList: finalAuditList.filter((item) => {
                        var isDateInRange = false;

                        if (item && StartDate && EndDate) {
                          var sDateArr = StartDate.split("-");
                          var eDateArr = EndDate.split("-");
                          var sAuditDateArr =
                            item.StartDate.split("T")[0].split("-");
                          var eAuditDateArr =
                            item.EndDate.split("T")[0].split("-");

                          var startDateFilter = new Date(
                            sDateArr[2],
                            sDateArr[0] - 1,
                            sDateArr[1]
                          );
                          var endDateFilter = new Date(
                            eDateArr[2],
                            eDateArr[0] - 1,
                            eDateArr[1]
                          );
                          var startDateAudit = new Date(
                            sAuditDateArr[0],
                            sAuditDateArr[1] - 1,
                            sAuditDateArr[2]
                          );
                          var endDateAudit = new Date(
                            eAuditDateArr[0],
                            eAuditDateArr[1] - 1,
                            eAuditDateArr[2]
                          );

                          var range = moment.range(
                            startDateFilter,
                            endDateFilter
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
                  console.warn("Error", e);
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
                      SortBy: "StartDate",
                    },
                    () => {
                      // this.getAuditlist()
                      // this.refs.toast.show(strings.Audit_List_Failed, DURATION.LENGTH_LONG)
                    }
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
                  }
                );
              }
            } else {
              // console.error('Error in error fetching list')
              this.refs.toast.show(
                strings.Audit_List_Failed,
                DURATION.LENGTH_LONG
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
                }
              );
            }
          }
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
          }
        );
      }
    });
  };
  listFooter() {
    console.log("footer enabled");
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

  render() {
    return (
      <View style={styles.container}>
        <OfflineNotice />
        <View style={styles.headerCont}>
          <ImageBackground source={Images.DashboardBG} style={styles.bgCont}>
            {this.renderHeader()}
          </ImageBackground>
        </View>

        <View style={{ width: "100%", height: "82%" }}>
          {this.recentAudits()}
        </View>
        <View style={{ width: "100%", height: "15%" }}>
          {this.renderFooter()}
        </View>
        <Toast
          ref="toast"
          style={{ backgroundColor: "black", margin: 20 }}
          position="bottom"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }

  recentAudits() {
    return (
      <View
        //tabLabel='LPA Check Sheet'
        //style={styles.scrollViewBody}
        style={{
          height: "100%",
          //backgroundColor: "transparent",
        }}
      >
        <View style={{ marginTop: 10 }}></View>
        {this.state.reportdata.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingBottom: 40 }}
            data={this.state.reportdata}
            extraData={this.state}
            ListFooterComponent={this.listFooter.bind(this)}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    padding: 10,
                    marginLeft: 5,
                    marginRight: 10,
                    marginBottom: 3,
                    // borderColor: 'red',
                    // borderWidth: 1,
                    // borderRadius: 1,
                    shadowColor: "#000",
                    // shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    // elevation: 1,
                    //height: undefined,
                    borderBottomColor: "#DEDBDB",
                    borderBottomWidth: 1,

                  }}
                >
                  {/*<View style={styles.auditBoxContent}>*/}
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      width: width(50),
                      padding: 5,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.regular,
                          color: "#485B9E",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        Completed Level ID:{" "}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.regular,
                          color: "#485B9E",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.iComplevelID}
                      </Text>
                    </View>
                    {/*
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.small,
                          color: "#A6A6A6",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        Question Type:{" "}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.small,
                          color: "#A6A6A6",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.QType}
                      </Text>
                    </View>
                      */}
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          paddingTop: 5,
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        Check List Template ID:{" "}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{
                          paddingTop: 5,
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.iCheckListTemplateID}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        Failure Reason ID:{" "}
                      </Text>
                      <Text
                        //numberOfLines={2}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.FailureReasonID}
                      </Text>
                    </View>
                  </View>
                  {/*<View style={styles.auditBoxContent}>*/}
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      width: width(50),
                      padding: 5,
                      marginLeft:20
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        Form ID:{" "}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.iFormID}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        Process ID:{" "}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.ProcessId}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        ParentId ID:{" "}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: Fonts.size.medium,
                          color: "#545454",
                          fontFamily: "OpenSans-Regular",
                        }}
                      >
                        {item.iParentID}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.key}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: window_width,
                  height: 1,
                  backgroundColor: "transparent",
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

  renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={
            !this.state.isLoading && !this.state.isDownloading
              ? () => this.props.navigation.navigate("AuditDashboard")
              : () => console.log("Component is not ready to goBack..")
          }
        >
          <View style={styles.backlogo}>
            {!this.state.isLoading && !this.state.isDownloading ? (
              // <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" />
              <Icon name="angle-left" size={40} color="white" />
            ) : null}
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: width(70),
            height: 65,
          }}
        >
          {/*<Text style={styles.headingText}>LAP Check Sheet</Text>*/}
          <Text
            style={{
              fontSize: Fonts.size.h6,
              color: "#fff",
              textAlign: "center",
              fontFamily: "OpenSans-Bold",
            }}
          >
            LAP Check Sheet
          </Text>
        </View>
        <View style={{ marginLeft: -3 }}>
          <TouchableOpacity
            onPress={this.Apicalling_generatereport(
              this.props.navigation.state.params.auditid,
              this.props.data.audits.auditRecords
            )}
          >
            {/*<Text style={styles.headingText}>Generate</Text>*/}
            <Text
              style={{
                fontSize: Fonts.size.h7,
                color: "#fff",
                textAlign: "center",
                fontFamily: "OpenSans-Bold",
              }}
            >
              Generate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  renderFooter() {
    return (
      <View style={styles.footer}>
        <ImageBackground
          source={Images.Footer}
          style={{
            resizeMode: "stretch",
            width: "120%",
            height: 70,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/*Department_Workstation: "Department Area->BP Line 1->BPSL002",
      Auditorname: "Davis Martin",
      AuditDate: "2022-01-01",
            */}
              <Text
                style={{
                  color: "white",
                  fontSize: Fonts.size.regular,
                  fontFamily: "OpenSans-Regular",
                }}
              >
                {this.state.Department_Workstation}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: Fonts.size.regular,
                  fontFamily: "OpenSans-Regular",
                }}
              >
                Auditor Name: {this.state.AuditorName}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: Fonts.size.regular,
                  fontFamily: "OpenSans-Regular",
                }}
              >
                Audit Date: {this.state.AuditDate}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeAudits: (audits) => dispatch({ type: "STORE_AUDITS", audits }),
    changeAuditState: (isAuditing) =>
      dispatch({ type: "CHANGE_AUDIT_STATE", isAuditing }),
    updateRecentAuditList: (recentAudits) =>
      dispatch({ type: "UPDATE_RECENT_AUDIT_LIST", recentAudits }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTabAuditList);
