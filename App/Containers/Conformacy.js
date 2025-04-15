import {TextInput} from 'react-native-gesture-handler';
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
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {Images} from '../Themes';
import styles from './Styles/CreateAttachStyle';
import {width} from 'react-native-dimension';
import Moment from 'moment';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import auth from '../Services/Auth';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ResponsiveImage from 'react-native-responsive-image';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import {debounce, once} from 'underscore';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConformacyText from './ConformacyText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
let Window = Dimensions.get('window');
const window_width = Dimensions.get('window').width;

class CreateAttach extends React.Component {
  documentID = null;
  sitelevelID = null;
  _filename = null;
  _extension = null;
  constructor(props) {
    super(props);
    this.onChangeTextDelayed = debounce(this.onChangeText, 2000);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    // this.state = {
    //   name: "",
    //   processId: "",
    //   auditId: "",
    //   conformance: "",
    // };

    this.state = {
      pageLoad: false,
      attachType: [
        {id: 1, name: 'one'},
        {id: 2, name: 'two'},
        {id: 3, name: 'three'},
      ],
      name: '',
      processId: '',
      auditId: '',
      conformance: '',
      AuditID: this.props.navigation.state.params.AuditID,
      AuditOrder: this.props.navigation.state.params.AuditOrder,
      attachText: '',
      TypeID: '',
      fileData: '',
      fileSize: '',
      ShowTypeDiv: false,
      comments: '',
      dialogVisible: false,
      EditFlag: false,
      Uploadedon: '',
      attachment: '',
      AuditID: '',
      AttachID: '',
      breadCrumbText: '',
      isErrorFound: false,
      isUrlInValid: false,
      isControllAttach: false,
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      saveLoader: false,
      commentFlag: true,
      type: '',
      auditDetailList: [],
      loading: false,
      loadingSync: false,
      startVoice: false,

    };
    // console.log(AuditID,"AuditID");
  }
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };
  handleFormSubmit(e) {
    e.preventDefault();
    localStorage.setItem('document', JSON.stringify(this.state));
  }
  async getAuditDetails() {
    this.setState({
      loading: true,
    });
   
    const Token = this.props.data.audits.token;
    const AuditID = this.props.navigation.state.params.AuditID;
    const AuditOrderId = this.props.data.audits.auditRecords[0].AuditOrderId;
    const AUDIT_NO = this.props.data.audits.auditRecords[0].AuditNumber;

    // this.setState({
    //   auditDetailList: this.props.data.audits.conformanceDetails,
    //   AUDIT_NO: this.state.AUDIT_NO,
    //   loading: false,
    // });
    const userID = this.props.data.audits.userId;
    console.log('CHECKUSERIID_-------------', userID);

    auth.Confermacy(AuditID, AuditOrderId, Token, userID, (resp, data) => {
      if (data.data.Data) {
        if (resp === true) {
          if (data.data.Message === 'Success') {
            console.log('CHECKUSERIID_----checking---------', data.data.Data);

            var auditDetailList = null;
            var ProcessID = null;
            var auditNumber = '';
            var auditStatus = '';
            if (data.data.Data.length > 0) {
              auditDetailList = data.data.Data;
            }
            this.setState(
              {
                auditDetailList: [...auditDetailList],
                AUDIT_NO: this.state.AUDIT_NO,
                loading: false,
              },
              this.getConformanceDetailsFromLocalStorage,
            );
          }
        }
      } else {
        this.setState(
          {
            loading: false,
          },
          this.getConformanceDetailsFromLocalStorage,
        );
       
        this.refs.toast.show(
          strings.Audit_Details_Failed,
          DURATION.LENGTH_LONG,
        );
      }
    });
  }

  Conformacy_Data = async () => {
    try {
      const active = await AsyncStorage.getItem('isActive');
      console.log('isActive status:' + active);
      if (active == 'yes' && this.props.data.audits.isActive == null) {
        this.props.storeLoginSession(true);
      }

      if (active == 'yes' && this.props.data.audits.userId == null) {
        const name = await AsyncStorage.getItem('name');
        const processId = await AsyncStorage.getItem('processId');
        const auditId = await AsyncStorage.getItem('auditId');
        const conformance = await AsyncStorage.getItem('conformance');

        console.log('conformacy', name, processId, auditId, conformance);
        //this.props.navigation.navigate('AuditDashboard')
      }
    } catch (error) {
      console.log(error);
    }
  };

  onSave() {
    this.props.navigation.goBack();
  }

  onsyncToServer() {
    
    this.setState({
      loadingSync: true,
    });
    var Token = this.props.data.audits.token;
    var auditList = this.state.auditDetailList;
    var newauditConformance = [];
    var UserId = this.props.data.audits.userId;
    var auditnumber = this.props.data.audits.auditRecords[0].AuditNumber;
    console.log;
    for (var y = 0; y < auditList.length; y++) {
      newauditConformance.push({
        strProcess: '',
        CorrectiveId: JSON.stringify(auditList[y].AuditId),
        CategoryId: 6444,
        Title: auditnumber,
        FileName: '',
        ElementID: '',
        Department: 0,
        ResponsibilityUser: UserId,
        NonConformity: '',
        RecommendedAction: '',
        NCIdentifier: '',
        ObjectiveEvidence: '',
        uniqueNCkey: '',
        DocumentRef: '',
        Conformance: auditList[y].Conformance,
        ProcessID: auditList[y].ProcessID,
        RequestedBy: UserId,
      });
    }

    console.log(newauditConformance, 'auditdetailconformance');
    auth.syncNCOFIToServer(newauditConformance, Token, (res, data) => {
      console.log('auditdetailconformance', data);
      if (data.data.Message == 'Success') {
        console.log(data, 'responsedata');
        this.setState({
          loadingSync: false,
        });

        this.refs.toast.show(
          strings.Conformance_success,
          DURATION.LENGTH_LONG,
        );
      } else {
        this.setState({
          loadingSync: false,
        });
        this.refs.toast.show(
          strings.Conformance_failed,
          DURATION.LENGTH_LONG,
        );
      }
    });
  }

  onSave_old() {
    this.setState({saveLoader: true, commentFlag: true}, () => {
      console.log('save clicked');
      var isValid = true;
      var isUrlInValid = false;
      if (this.state.TypeID == '') {
        isValid = false;
      }
      if (this.state.attachment == '') {
        isValid = false;
      }
      if (this.state.comments == '') {
        isValid = false;
        this.setState({
          commentFlag: false,
        });
        // this.commentFlag = false
      }
      if (this.state.TypeID == 2 && !this.isUrlValid(this.state.attachment)) {
        isValid = false;
        isUrlInValid = true;
      }

      if (!isValid) {
        this.setState({
          isErrorFound: true,
          isUrlInValid: isUrlInValid,
          saveLoader: false,
        });
      } else {
        this.setState(
          {
            isErrorFound: false,
          },
          () => {
            var auditRecords = this.props.data.audits.auditRecords;
            var Token = this.props.data.audits.token;
            var SiteId = this.props.data.audits.siteId;
            var UserId = this.props.data.audits.userId;
            var ProcessID = this.props.data.audits.ProcessID;
            var processName = this.props.data.audits.ProcessName;
            var RequestParam = [];

            var auditRecords = this.props.data.audits.auditRecords;
            console.log(
              'hello',
              auditRecords[i].AuditId,
              this.state.AuditID,
              this.props.navigation.state.params.AuditID,
            );
            for (var i = 0; i < auditRecords.length; i++) {
              if (this.state.AuditID === auditRecords[i].AuditId) {
                RequestParam.push({
                  AuditId: auditRecords[i].AuditId,
                  AuditProgramId: auditRecords[i].AuditProgramId,
                  AuditProgramOrder: auditRecords[i].AuditProgOrder,
                  AuditTypeOrder: auditRecords[i].AuditTypeOrder,
                  AuditTypeId: auditRecords[i].AuditTypeId,
                  AuditOrder: auditRecords[i].AuditOrderId,
                  ProcessID: auditRecords[i].ProcessID,
                  processName: auditRecords[i].ProcessName,
                });
              }
            }
            console.log('RequestParam-->', RequestParam);

            var Request =
              RequestParam[0].AuditId +
              '_' +
              RequestParam[0].AuditProgramId +
              '_' +
              RequestParam[0].AuditProgramOrder +
              '_' +
              RequestParam[0].AuditTypeId +
              '_' +
              RequestParam[0].AuditOrder;
            var param = [];
            if (this.state.TypeID == 1) {
              param.push({
                ObjectiveEvidence:
                  this.state.attachText === 'Controlled'
                    ? this.state.attachment.toLowerCase()
                    : null,
                Request: Request,
                RefPath:
                  this.state.attachText === 'UnControlled'
                    ? this.state.attachment.toLowerCase()
                    : null,
                SiteId: SiteId,
                Comments: this.state.comments,
                UploadedBy: UserId,
                UploadedOn: this.state.Uploadedon,
                VersionNo: 6,
                AttachmentType: this.state.attachText,
                File:
                  this.state.attachText === 'Controlled'
                    ? this.state.fileData == undefined
                      ? ''
                      : this.state.fileData
                    : null,
                Filename:
                  this.state.attachText === 'Controlled'
                    ? this.state.attachment.toLowerCase()
                    : null,
                Id: this.state.AttachID,
              });
              console.log('Param-->', param);
            } else {
              param.push({
                ObjectiveEvidence:
                  this.state.attachText === 'Controlled'
                    ? this.state.attachment.toLowerCase()
                    : null,
                Request: Request,
                RefPath:
                  this.state.attachText === 'UnControlled'
                    ? this.state.attachment.toLowerCase()
                    : null,
                SiteId: SiteId,
                Comments: this.state.comments,
                UploadedBy: UserId,
                UploadedOn: this.state.Uploadedon,
                VersionNo: 6,
                AttachmentType: this.state.attachText,
                //   File: this.state.attachText === 'Controlled' ? (this.state.fileData == undefined) ? '' : this.state.fileData  : null,
                //   Filename : this.state.attachText === 'Controlled' ? this.state.attachment.toLowerCase() : null,
                Id: this.state.AttachID,
              });
              console.log('Param-->', param);
            }

            auth.getSaveStatusHistory(param, Token, (res, data) => {
              console.log('Data ========>>', data);
              if (data.data.Message == 'Success') {
                console.log('===>', data.data);
                this.documentID = data.data.Data[0].DocProParameter;
                this.sitelevelID = data.data.Data[0].SiteLevelId;

                if (this.state.TypeID == 1) {
                  if (
                    this.documentID &&
                    this.sitelevelID &&
                    this.state.type == 'Add'
                  ) {
                    this.formDocProObject();
                    console.log('*****');
                  } else {
                    this.props.navigation.navigate('AuditAttach', {
                      AuditID: this.state.AuditID,
                      isDeleted: 2,
                      breadCrumb: this.state.breadCrumbText,
                    });
                  }
                } else {
                  this.props.navigation.navigate('AuditAttach', {
                    AuditID: this.state.AuditID,
                    isDeleted: 2,
                    breadCrumb: this.state.breadCrumbText,
                  });
                }
              } else {
                this.setState({saveLoader: false}, () => {
                  console.log('==error=>');
                  this.refs.toast.show(
                    strings.ErrUploading,
                    DURATION.LENGTH_LONG,
                  );
                });
              }
            });
          },
        );
      }
    });
  }
  state = {
    textInputs: [],
  };
  componentDidMount() {
    // var AuditDetailList = this.props.data.audits.auditRecords[0];
    // console.log(AuditDetailList,"ASingleRecord")
    var AuditDetailList = this.props.data.audits.auditRecords;
console.log('VoiceparamsCheckinggggg',this.props);
    console.log(this.props.data.audits.conformanceDetails, 'conformacyredux');

    var auditDetailList = null;

    for (var i = 0; i < AuditDetailList.length; i++) {
      if (
        AuditDetailList[i].AuditId ==
        this?.props?.navigation?.state?.params?.AuditID
      ) {
        auditDetailList = AuditDetailList[i];
      }
    }
    this._getLocalValues(auditDetailList);
    console.log(
      'this.props.navigation.state.params.datapass',
      this.props.audits,
    );
    console.log('Create attach mounted', this.props.navigation.state.params);
    this.getAuditDetails();
    // this.refreshConformance();
  }
  

  _startRecognizing = async () => {
    console.log('voice:_startRecognizing');
    this.setState(
      {
        recognized: '',
        pitch: '',
        error: '',
        started: '',
        results: [],
        partialResults: [],
        end: '',
        startVoice: true,
        flag1: false,
        // isVisible:true
      },
      () => {
        console.log('flag reset');
      },
    );
    try {
      if (this.props.data.audits.language === 'Chinese') {
        await Voice.start('zh');
      } else if (
        this.props.data.audits.language === null ||
        this.props.data.audits.language === 'English'
      ) {
        await Voice.start('en-US');
      }
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  }; 

  _stopRecognizing = async () => {
    try {
      console.log('voice:_stopRecognizing');
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      console.log('voice:_cancelRecognizing');
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      console.log('voice:_destroyRecognizer');
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };
  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log('voice:onSpeechResults: ', e);
    if (Platform.OS == 'android') {
     
      this.setState(
        {
          results: e.value[0],
        },
        () => {
          this.VoiceLogic();
        },
      );
    } else {
      this.setState({results: e.value});
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.stopRecording();
      }, 2000);
    }
  };

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log('voice:onSpeechPartialResults: ', e);
    this.setState(
      {
        partialResults: e.value,
      },
      () => {
        console.log('_----_', this.state.partialResults);
      },
    );
  };

  StartVoicePress() {
    console.log('voice:StartVoicePressdebouncer activate1');
    if (Platform.OS == 'ios') {
      Voice.removeAllListeners();
      this.InitVoice();
    }
    this._startRecognizing();
  }

  StopVoicePress() {
    console.log('voice:StopVoicePressdebouncer activate2');
      this._stopRecognizing();
      Voice.removeAllListeners();
      this.InitVoice();    
    
  }

  InitVoice() {
    console.log('voice:InitVoice');
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechPartialResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

    this.setState(
      {
        recognized: '',
        pitch: '',
        error: '',
        started: '',
        results: [],
        partialResults: [],
        end: '',
        startVoice: false,
      },
      () => {
        console.log('voice:setSTate called');
      },
    );
  }


  getConformanceDetailsFromLocalStorage = async () => {
    const details = await AsyncStorage.getItem(
      'ConformanceDetails' + this.state.AUDIT_ID,
    );
    const ModifiedConformanceArray = JSON.parse(details)?.map(
      (detail, index) => ({
        ...detail,
      }),
    );
    this.setState({
      auditDetailList: [...ModifiedConformanceArray],
    });
    console.log(
      'getConformanceDetailsFromLocalStorage ModifiedConformanceArray',
      this.state.auditDetailList,
      ModifiedConformanceArray,
    );
  };

  _getLocalValues(data) {
    // if (this.props.data.audits.isOfflineMode) {
    console.log('_getLocalValues', data);
    const AUDIT_ID = data.AuditId;
    const AUDITPROG_ID = data.AuditProgramId;
    const AUDITYPE_ORDER = data.AuditTypeOrder;
    const AUDITYPE_ID = data.AuditTypeId;
    const SITEID = data.SiteId;
    const AUDITPROGORDER = data.AuditProgOrder;
    const AUDIT_NO = data.AuditNumber;
    const AUDIT_SITE_ID = data.AuditAgendaUrl;
    const breadCrumb = data.Auditee;
    this.setState(
      {
        AUDIT_ID: AUDIT_ID,
        AUDITPROG_ID: AUDITPROG_ID,
        AUDITYPE_ORDER: AUDITYPE_ORDER,
        AUDITYPE_ID: AUDITYPE_ID,
        SITEID: SITEID,
        AUDITPROGORDER: AUDITPROGORDER,
        AUDIT_SITE_ID: AUDIT_SITE_ID,
        breadCrumb: breadCrumb,
        AUDIT_NO: AUDIT_NO,
      },
      () => {
        console.log('this.state.AUDIT_ID', this.state.AUDIT_ID);
        console.log('this.state.AUDITPROG_ID', this.state.AUDITPROG_ID);
        console.log('this.state.AUDITYPE_ORDER', this.state.AUDITYPE_ORDER);
        console.log('this.state.AUDITYPE_ID', this.state.AUDITYPE_ID);
        console.log('this.state.SITEID', this.state.SITEID);
        console.log('this.state.AUDITPROGORDER', this.state.AUDITPROGORDER);
        console.log('this.state.AUDIT_SITE_ID', this.state.AUDIT_SITE_ID);
        console.log('this.state.breadcrumb', this.state.breadCrumb);
      },
    );
    // }
  }
  handleInputChange = (value, index) => {
    console.log(value, index, 'value==>');
  };

  updateConformacyTextToAPI = async (value, processId) => {
    const details = await AsyncStorage.getItem('ConformanceDetails');

    await AsyncStorage.setItem(
      'ConformanceDetails' + this.state.AUDIT_ID,
      JSON.stringify(this.state.auditDetailList),
    );

    console.log(
      this.props.data.audits.conformanceDetails,
      'conformancedetailsredux',
    );
    // const token = await AsyncStorage.getItem('fcmToken');
    // auth.updateConformacyText(Conformance, ProcessID, token, (res, data) => {
    //     if (data.data.Success) {
    //         console.log('data value checking', data.data)
    //     } else {
    //     }
    // });
    // console.log('updateConformacyText value, processId', value, processId);
  };
  async refreshConformance() {
    this.setState({
      loading: true,
    });
    console.log('checkingaudiitdetials---------------------');

    const Token = this.props.data.audits.token;
    const AuditID = this.props.navigation.state.params.AuditID;
    const AuditOrderId = this.props.data.audits.auditRecords[0].AuditOrderId;
    const AUDIT_NO = this.props.data.audits.auditRecords[0].AuditNumber;
    const userID = this.props.data.audits.userId;
    auth.Confermacy(AuditID, AuditOrderId, Token, userID, (resp, data) => {
      console.log('confermacy data', data.data.Data);
      console.log('noti', this.props.data.audits.token);
      console.log('auditID8', AuditID);
      if (data.data.Data) {
        if (resp === true) {
          if (data.data.Message === 'Success') {
            console.log('getAuditDetails Successfull');
            var auditDetailList = null;
            var ProcessID = null;
            var auditNumber = '';
            var auditStatus = '';
            if (data.data.Data.length > 0) {
              auditDetailList = data.data.Data;
            }
            this.setState(
              {
                auditDetailList: [...auditDetailList],
                AUDIT_NO: AUDIT_NO,
                loading: false,
              },
              async () => {
                await AsyncStorage.setItem(
                  'ConformanceDetails' + this.state.AUDIT_ID,
                  JSON.stringify(this.state.auditDetailList),
                );

                console.log(
                  this.props.data.audits.conformanceDetails,
                  'conformancedetailsredux',
                );
              },
            );
          }
        }
      } else {
        this.setState(
          {
            loading: false,
          },
          this.getConformanceDetailsFromLocalStorage,
        );
        this.refs.toast.show(
          strings.Audit_Details_Failed,
          DURATION.LENGTH_LONG,
        );
      }
    });
  }
  updateConformacyDetails = (label, value) => {
   
    console.log('ccċ920423h4j23b4jn23label', label);
    console.log('ccċ920423h4j23b4jn23value', value);

    this.setState({
      [label]: value,
    });
  };



  render() {
    var conformacyVoiceVal = ''
    if(this.props.navigation.state.params.conformancyVoice == undefined){
      console.log('checkingValue123',conformacyVoiceVal);
    }else{
       conformacyVoiceVal = this.props.navigation.state.params.conformancyVoice.voiceText
      console.log('checkingValue000000000',conformacyVoiceVal);
    }
// console.log('VoiceparamsCheckingggggvoiceText',this.props.navigation.state);
// console.log('VoiceparamsCheckingggggvoiceData',this.props.navigation.state.params.conformancyVoice.voiceText);


    console.log(this.state, 'thisthis.state,');
    console.log(this.state.auditDetailList, 'auditdetailList');
    console.log('audit===>', this.props.navigation.state.params.AuditID);
    const attach = this.state.attachType;

    let {name} = this.state;
    const window_height = Dimensions.get('window').height;
    return (
      <>
        <KeyboardAvoidingView style={styles.wrapper}>
          <ImageBackground
            source={Images.DashboardBG}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 60,
            }}>
            <View style={styles.header} numberOfLines={1}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AuditPage', {
                    AuditID: this.state.AuditID,
                    isDeleted: 0,
                    breadCrumb: this.state.breadCrumbText,
                  })
                }>
                <View style={styles.backlogoConformance}>
                  {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                  <Icon name="angle-left" size={30} color="white" />
                </View>
              </TouchableOpacity>

              <View style={styles.headingConformance}>
                <Text numberOfLines={1} style={styles.headingText}>
                  {this.state.EditFlag === false
                    ? strings.conframacy
                    : strings.EditAttach}
                </Text>
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
              <View style={styles.headerDivConformance}>
              <TouchableOpacity
                  style={{paddingHorizontal: 5}}
                  onPress={() => this.onsyncToServer()}>
                  <Icon name="upload" size={22} color="white" />
                </TouchableOpacity>
                {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
                <TouchableOpacity
                  style={{paddingHorizontal: 5}}
                  onPress={() => this.refreshConformance()}>
                  <Icon name="refresh" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{paddingHorizontal: 5}}
                  onPress={() =>
                    this.props.navigation.navigate('AuditDashboard')
                  }>
                  <Icon name="home" size={25} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          {this.state.loading === true ? (
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: 25,
              }}>
              <ActivityIndicator size={20} color="#1CAFF6" />
            </View>
          ) : (
            <KeyboardAwareScrollView>
              <View style={{alignSelf: 'center', margin: 4}}>
                <Text style={{color: 'red'}}>
                  {'Note: Anything you type here is auto save'}
                </Text>
              </View>

              {this.state.attachType.length > 0 ? (
                <View style={{flex: 1, marginBottom: 50}}>
                  {/* <TouchableOpacity onPress={this._startRecognizing}>
                    <Text>_startRecognizing</Text>
                  </TouchableOpacity> */}
                  <FlatList style={{height:window_height-185}} 
                    contentContainerStyle={{paddingBottom: 10}}
                    data={this.state.auditDetailList}
                    // extraData={this.state}
                    onEndReachedThreshold={0.01}
                    refreshing={this.state.isRefreshing}
                    renderItem={({item, index}) => (
                      <ConformacyText
                        {...{
                          item,
                          index,
                          state: this.state,
                          auditId: this.props.navigation.state.params.AuditID,
                          navigation: this.props.navigation,
                          updateConformacyText: this.updateConformacyTextToAPI,
                          updateConformacyDetails: this.updateConformacyDetails,
                          clauseMandatory:
                            this.props.navigation.state.params
                              .CreateNCdataBundle.clauseMandatory,
                          userID: this.props.data.audits.userId,
                          multiprocess: this.props.navigation.state.params.CreateNCdataBundle.multiprocess,
                          startVoicePress: this.StartVoicePress,
                          stopVoicePress: this.StopVoicePress,
                          started: this.state.started,
                          conformTextValue: conformacyVoiceVal
                        }}
                      />
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

                  <View></View>
                </View>
              ) : (
                <View style={{marginTop: 55}}>
                  <Text style={styles.noRecordsFound}>
                    {strings.No_checkpoints_found}
                  </Text>
                </View>
              )}
              {/** --------footer-------- */}

              <Toast ref="toast" position="top" opacity={0.8}  />              
            </KeyboardAwareScrollView>
          )}
        </KeyboardAvoidingView>
        {this.state.loading !== true && (
          <View style={styles.footer}>
            <ImageBackground
              source={Images.Footer}
              style={{
                resizeMode: 'stretch',
                width: '100%',
                height: 70,
              }}>
              <TouchableOpacity
                onPress={() => this.onsyncToServer()}
                style={{alignItems: 'center'}}>
                <View>
                  {this.state.loadingSync ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: 10,
                      }}>
                      <ActivityIndicator size={20} color="#1CAFF6" />
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <ResponsiveImage
                          source={Images.syncImg}
                          initWidth="40"
                          initHeight="40"
                        />
                      </View>

                      <Text
                        style={{
                          color: 'white',
                          fontSize: Fonts.size.h5,
                          marginLeft: 5,
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {strings.Sync_to_server}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateAttach);
