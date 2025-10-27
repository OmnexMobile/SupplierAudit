import React, { Component } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  CheckBox,
  Dimensions,
  Keyboard,
  Platform,
  BackHandler,
  Alert,
} from "react-native";
import CryptoJS from "crypto-js";
import styles from "./Styles/LoginUIScreenStyle";
import InputField from "../Components/Shared/InputField";
import Images from "../Themes/Images";
import Toast, { DURATION } from "react-native-easy-toast";
import auth from "../Services/Auth";
import { connect } from "react-redux";
import OfflineNotice from "../Components/OfflineNotice";
import ResponsiveImage from "react-native-responsive-image";
import Fonts from "../Themes/Fonts";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { strings } from "../Language/Language";
import { width, height } from "react-native-dimension";
import DeviceInfo from "react-native-device-info";
import firebase from "react-native-firebase";
import NetInfo from "@react-native-community/netinfo";
var RNFS = require("react-native-fs");

import {
  Dialog,
  ConfirmDialog,
  ProgressDialog,
} from "react-native-simple-dialogs";
import { create } from "apisauce";
import { add } from "lodash";

let Window = Dimensions.get("window");

// Form type -1- Online
// Form type -2- Reference
// Form type -0- Template

class AuditForm extends Component {
  syncStatus = 0;
  isDocsAvail = false;
  auditAttachments = [];
  checkListObjects = [];
  formObjects = [];
  ncOfiObjects = [];

  constructor(props) {
    super(props);

    this.state = {
      token: "",
      CheckListbtn: false,
      isSyncing: false,
      Formname: "",
      ChecklistProp: [],
      Checkpointlogic: [],
      formDetails: [],
      TempList: [],
      RefList: [],
      OnlineList: [],
      Checkpointpass: [],
      dropvalue: [],
      AuditID: "",
      dialogVisible: false,
      isLoaderVisible: false,
      OnlineName: undefined,
      notifyRed: undefined,
      breadCrumbText: undefined,
      ActiveTab: 0,
      MandateCheck: false,
      isLowConnection: false,
      AuditOrderId: "",
      missingFileArr: [],
      isMissingFindings: false,
      mandatoryCheck: 0,
      confirmpwd: false,
      pwdentry: undefined,
      deviceId: '',
      isEmptyPwd: undefined,
      siteID: "",
      SupplierManagementAccess: "",
    };
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.backAction();
      return true;
    });
  }

  backAction = () => {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var PreviousPage = getCurrentPage[getCurrentPage.length - 2].routeName;
    console.log("Previous---->", PreviousPage);

    if (PreviousPage == "LoginUIScreen") {
      /*
      Alert.alert("Hold on!", "You must to select any one option", [
        {
          text: "Ok",
          onPress: () => null,
          style: "cancel",
        },
      ]);
      */
     alert("Please select one option to proceed.")
    } else {
      this.backHandler.remove();
    }
  };

  componentDidMount() {
    console.log('logpropssssssssss',this.props);
    
    DeviceInfo.getUniqueId().then(deviceId=>{
      this.setState({
        deviceId
      })
    })
  }

  componentWillUnmount() {
    //    this.backHandler.remove();
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(props) {}

  render() {
    let data = [];
    var logindata = this.props.data.audits.logindata;
    if (logindata != null) {
      for (var i = 0; i < logindata.length; i++) {
        data.push({
          value: logindata[i].Siteid,

          UserId: logindata[i].UserId,

          FullName: logindata[i].FullName,

          EntityNode: logindata[i].EntityNode,

          SupplierManagementAccess: logindata[i].SupplierManagementAccess,
        });
      }
    }
    console.log(data + "data");
    /*
    let data = [
      {
        value: "1",
        UserId: 7,
        FullName: "Anthony John  ",
        EntityNode: "Corporate",
        SupplierManagementAccess: "false",
      },
      {
        value: "22",
        UserId: 7,
        FullName: "Anthony John  ",
        EntityNode: "FCM Augsburg ",
        SupplierManagementAccess: "false",
      },
      {
        value: "40",
        UserId: 7,
        FullName: "Anthony John  ",
        EntityNode: "FIS Blue Springs",
        SupplierManagementAccess: "false",
      },
      {
        value: "53",
        UserId: 7,
        FullName: "Anthony John  ",
        EntityNode: "FIS Greenville",
        SupplierManagementAccess: true,
      },
    ];
    */
    console.log('logpropssssssssss',this.state.ssoConfig)

    console.log("this.props.SiteID");
    return (

      <View style={styles.mainContainer}>
        <OfflineNotice />
        <Image source={Images.LoginBack2} style={styles.backgroundImage} />

        <View style={{ flexDirection: "column", position: "absolute" }}>
          <View style={styles.loginOmnexlogoDiv}>
            <View style={styles.loginOmnexlogo}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#14D0AE" }}
              >
                {strings.SUPPLIER_MANGEMENT}
              </Text>
            </View>
          </View>
          <View style={[styles.loginOmnexlogoDiv2]}>
            {/* <View style={styles.inputBox1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.storeSupplierData(1);
                  this.backHandler.remove();
                  this.props.navigation.navigate("AllTabAuditList");
                  //this.backHandler.remove();
                  
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#1FBFD0", "#2EA4E2", "#14D0AE"]}
                  style={styles.LoginBtn01}
                >
                  <Text style={styles.buttonText}>Audits</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}
            <View style={styles.inputBox1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.storeSupplierData(2);
                  this.backHandler.remove();
                  this.props.navigation.navigate('AllTabAuditList');
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#2EA4E2", "#14D0AE", "#1FBFD0"]}
                  style={styles.LoginBtn01}
                >
                  <Text style={styles.buttonText}>
                    {strings.Supplier_initial_assessment}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={[styles.suppliereng]}>
              <TouchableOpacity
                onPress={() => {
                  
                  this.props.storeSupplierData(3);
                  this.backHandler.remove();
                  this.props.navigation.navigate('AllTabAuditList');
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#14D0AE", "#1FBFD0", "#2EA4E2"]}
                  style={styles.LoginBtn01}
                >
                  <Text style={styles.buttonText}>
                    {strings.Supplier_routine_audit}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
    siteId: state.siteId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeAuditState: (isAuditing) =>
      dispatch({ type: "CHANGE_AUDIT_STATE", isAuditing }),
    storeAuditRecords: (auditRecords) =>
      dispatch({ type: "STORE_AUDIT_RECORDS", auditRecords }),
    storeAudits: (audits) => dispatch({ type: "STORE_AUDITS", audits }),
    storeNCRecords: (ncofiRecords) =>
      dispatch({ type: "STORE_NCOFI_RECORDS", ncofiRecords }),
    clearAudits: () => dispatch({ type: "CLEAR_AUDITS" }),
    storeSupplierData: (smdata) =>
      dispatch({ type: "STORE_SUPPLIER_DATA", smdata }),
    storeSiteId: (siteId) =>
      dispatch({ type: "STORE_SITE_ID", siteId }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditForm);
