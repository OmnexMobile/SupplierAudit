import React, {Component} from 'react';
import {
  View,
  Platform,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  ImageBackground,
  FlatList,
  Alert,
  ActivityIndicator,
  LogBox,
  SafeAreaView,
  Button,
} from 'react-native';
import styles from './Styles/CheckPointScreenPOCStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import OfflineNotice from '../Components/OfflineNotice';
import {Images} from '../Themes/index';
import {strings} from '../Language/Language';
import {width} from 'react-native-dimension';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {connect} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import {Dropdown} from 'react-native-material-dropdown';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import ResponsiveImage from 'react-native-responsive-image';
import Modal from 'react-native-modal';
import {ConfirmDialog} from 'react-native-simple-dialogs';
// import Slider from 'react-native-slider'
import {debounce, min, once} from 'underscore';
import Slider from '@react-native-community/slider';
import Moment from 'moment';
import constant from '../Constants/AppConstants';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastNew, {ErrorToast} from 'react-native-toast-message';
import {forEach, slice} from 'lodash';
import moment from 'moment';
import Video from 'react-native-video';
import FileViewer from 'react-native-file-viewer';
import RichText from './RichText';
import {
  Image as compressImage,
  Video as compressVideo,
  getVideoMetaData,
} from 'react-native-compressor';
import NetInfo from '@react-native-community/netinfo';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import auth from '../Services/Auth';
import {saveNavigationParams} from '../Redux/AuditRedux';
import Fonts from '../Themes/Fonts';
import { RichEditor} from 'react-native-pell-rich-editor';

const Width = Dimensions.get('window').width;
const Colors = {
  0: 'red',
  4: 'red',
  6: 'yellow',
  8: 'yellow',
  10: 'green',
  '-1': '#fff',
  '-2': '#fff',
};

const toastConfig = {
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 12,
      }}
    />
  ),
};

class CheckPointDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radiovalue: [],
      checkpointList: [],
      token: '',
      value: 0,
      RadioLogic: [],
      isBrowse: false,
      checkPointsDetails: [],
      checkPointList: [],
      dialogVisible: false,
      dialogVisibleReset: false,
      dialogVisibleNC: false,
      dialogVisibleAttach: false,
      dialogVisibleNCR: false,
      raiseID: [],
      dropProps: [],
      ischeckLPA: true,
      LPAdrop: [],
      dropdown: [],
      checkPointsValues: [],
      sumFileSizearray: [],
      totalFileSize: 0,
      auditId: '',
      fileDatabase: '',
      isSaving: false,
      isContentLoaded: true,
      isNCAllowed: 0,
      isFormValid: true,
      isUnsavedData: false,
      ChecklistTemplateId: 0,
      ncofiPassAuditId: 0,
      ncofiPassTemplateId: 0,
      checkListdata: [],
      displayData: [],
      autoscroll: false,
      breadCrumbText: undefined,
      CheckAttach: false,
      CheckRemark: false,
      count: 0,
      checkMandate: true,
      mandateCheckpoints: 0,
      mandatoryCheck: 0,
      totalfilled: 0,
      totalCheck: 0,
      optionalCheck: 0,
      attachSelectedItem: null,
      cAttachData: '',
      cAttachType: '',
      ncRemovalTemplateId: 0,
      scorevalue: 1,
      ActiveId: 0,
      go_home: false,
      AuditOrder: undefined,
      TemplateID: this.props.navigation.state.params.TemplateID,
      isPaused: false,
      Status_nc_ofi: 0,
      score_text_plsslct: false,
      radiovalue_ncofi: 0,
      nc_created: false,
      ofi_created: false,
      current_nc_ofi_count: 0,
      hasValue: false,
      newArrayState: '',
      ncAvailable_NC: false,
      ofiAvailable_OFI: false,
      FaliureCategoryStateList: [],
      FailureReasonStateList: [],
      clauseRecords: [],
      failCatId: 0,
      mincheckValue: 0,
      isLoaded: false,
      fileWrite: false,
      dialogVisibleVideo: false,
      isAttachmentLoaded: false,
      isCaroselLoaded: false,
      ncofiSetting: '',
      dropdownnotokvalue: 0,
      checkPointAttachment: '',
      deleteallattachment: 0,
      ncFormID: '',
      booleanNcofi: false,
      ncofisettingvalue: '',
      onpressRadio: false,
      radiovalue_ncofi: '',
      checkpointdetails: [],
      checklistName: '',
      selectedChecklistName: '',
      data: this.props.data.audits.auditRecords[0].CheckListPropData,
      selectedindex: '',
      selectedItem: '',
      failureloaded: false,
      radiovalueloaded: false,
      ReportId:''
    };
  }

  componentDidMount() {
    let Files =
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    //console.log('Attachment:Ios-Android-Path', Files);
    
    RNFetchBlob.fs.exists(Files).then(exist => {
      if (!exist || exist == '') {
        RNFetchBlob.fs
          .mkdir(Files)
          .then(data => {
            //console.log('Attachment:data directory created', data);
          })
          .catch(err => {
            //console.log('err', err);
          });
      } else if (RNFetchBlob.fs.isDir(Files)) {
        RNFetchBlob.fs.ls(Files).then(data => {
          //console.log('Attachment:All files', data);
        });
      }
    });

    LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
    LogBox.ignoreAllLogs(); //Ignore all log notifications
    setTimeout(() => {
      this.setState({
        isLoaded: true,
      });
    }, 100);

    if (this._carousel) {
      this._carousel.snapToItem(1);
    }
    this.LongTask();
    this.fetchData();
    console.log('checkpropsdataaaaaa',this.props);
    
    //console.log(this.state.checkPointsDetails, 'lostArr');
  }

  fetchData = async () => {
    try {
      const ncofisettingvalue = await AsyncStorage.getItem('NCSettingValue');
      //console.log(ncofisettingvalue, 'ncvalues');
      this.setState({
        ncofisettingvalue: ncofisettingvalue,
      });
    } catch {}
  };

  LongTask() {
    console.log('Load: AuditRecords', this.props.data.audits.auditRecords);
    console.log('Load: AuditRecordssdatacheckkkkk', this.props.data.audits);

    //console.log('consolenavigationparams', this.props.navigation.state.params);
    console.log(
      this.props.data.audits.auditRecords[0].CheckpointLogic,
      'auditdata',
    );
    if (this.props.data.audits.language == 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        //console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language == null ||
      this.props.data.audits.language == 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        //console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    var cameraCapture = [];
    this.props.storeCameraCapture(cameraCapture);

    //console.log('Loading checkpoints...', this.props.navigation.state.params);
    this.setState(
      {
        isContentLoaded: true,
        ChecklistTemplateId:
          this.props.navigation.state.params.ChecklistTemplateId,
        auditId: this.props.navigation.state.params.AuditID,
        clauseRecords: this.props.data.audits.auditRecords,
        displayData: this.props.navigation.state.params.CheckPointname,
        breadCrumbText: this.props.navigation.state.params.breadCrumbText,
      },
      () => {
        //console.log('Please wait...', this.state.breadCrumbText);
        //console.log('Venkat===>', this.state.displayData);
        // console.log(
        //   'CheckPopintDemo1>ChecklistTemplateId',
        //   this.state.ChecklistTemplateId,
        // );
        //console.log('K?V', this.state.MandatoryCount);
        this.getDropValue();
        var auditRecords = this.props.data.audits.auditRecords;
        //console.log(this.props.data.audits.smdata, 'smdata');
        var checkPoints = null;
        var getLPA = null;
        var AuditCheckpointDetail = null;
        var scoreTypes = null;
        var MandatoryCount = 0;
        var CheckpointAttachment = null;
        var checkpointNcValue = null;

        // console.log(
        //   'CheckPointDemo1>AuditRecords:Screen',
        //   auditRecords,
        //   this.props.navigation.state.params.Formid,
        // );
        // getting the particular checkpoint related to the checklist

        var RelatedCheckpoints = [];

        for (var i = 0; i < auditRecords.length; i++) {
          if (auditRecords?.[i]?.AuditId == this.state.auditId) {
            for (var j = 0; j < auditRecords?.[i]?.Listdata.length; j++) {
              console.log(
                '+++',
                auditRecords?.[i]?.Listdata?.[j]?.ParentId,
                auditRecords?.[i]?.Listdata?.[j]?.FormId,
              );
              if (
                this.state.ChecklistTemplateId ==
                  auditRecords?.[i]?.Listdata?.[j]?.ParentId &&
                this.props.navigation.state.params.Formid ==
                  auditRecords?.[i]?.Listdata?.[j]?.FormId
              ) {
                RelatedCheckpoints.push(auditRecords?.[i]?.Listdata[j]);
              }
            }
            if (auditRecords?.[i]?.Listdata) {
              checkPoints = RelatedCheckpoints;
            }
            getLPA = auditRecords?.[i]?.CheckpointLogic.LPAApproach;
            AuditCheckpointDetail =
              auditRecords?.[i]?.CheckpointLogic.AuditCheckpointDetail;
            scoreTypes = auditRecords?.[i]?.CheckpointLogic.ScoreType;
            CheckpointAttachment =
              auditRecords?.[i]?.CheckpointLogic.CheckpointAttachment;
            MandatoryCount = auditRecords?.[i]?.CheckpointLogic.MandatoryCount;
            checkpointNcValue = auditRecords?.[i]?.CheckpointLogicarray?.AuditCheckpointDetail;
          }
        }
        console.log(AuditCheckpointDetail, 'nn==>');
        console.log(checkpointNcValue, 'nn==>111111111');
        //console.log(AuditCheckpointDetail, 'nn==>');
        //console.log('AttachmentBundle', CheckpointAttachment);
        //console.log('CheckPointDemo1>RelatedCheckpoints', RelatedCheckpoints);

        // console.log(
        //   this.props.navigation.state.params.Formid,
        //   this.props.navigation.state.params,
        //   this.state.ChecklistTemplateId,
        //   (auditRecords?.[0]?.Listdata || [])?.filter(
        //     arr =>
        //       (arr?.ParentId).toString() === this.state.ChecklistTemplateId,
        //   ),
        //   (auditRecords?.[0]?.Listdata || [])?.filter(
        //     arr =>
        //       (arr?.ParentId).toString() === this.state.ChecklistTemplateId,
        //   ).length,
        //   auditRecords[0]?.Listdata,
        //   'sathish====>',
        // );
        var dropdata = [];
        var lpaList = getLPA;

        if (lpaList) {
          for (var i = 0; i < lpaList.length; i++) {
            dropdata.push({
              id: lpaList[i].ApproachId,
              value: lpaList[i].ApproachName.toString(),
            });
          }
        }

        var data = AuditCheckpointDetail;
        var checkPointList = [];
        var checkPointsDetails = [];
        // console.log(
        //   'Response data',
        //   data,
        //   AuditCheckpointDetail,
        //   CheckpointAttachment,
        // );
        let temp = this.props.data.audits.auditRecords.findIndex(
          obj => obj.AuditId === this.state.auditId,
        );

        // console.log(
        //   'CheckPopintDemo1>-temp',
        //   temp,
        //   data,
        //   AuditCheckpointDetail,
        // );
        if (data) {
          for (var i = 0; i < data.length; i++) {
            if (
              this.state.ChecklistTemplateId == data[i].ParentId &&
              data[i].FormId ==
                this.props.navigation.state.params.FormIdNavigate
            ) {
              // console.log(
              //   'index==>',
              //   i,
              //   temp,
              //   AuditCheckpointDetail,
              //   AuditCheckpointDetail[temp],
              // );
              var scoreTypesData = [];
              if (scoreTypes.length > 0) {
                for (var j = 0; j < scoreTypes.length; j++) {
                  if (
                    data[i].ChecklistTemplateId ==
                    scoreTypes[j].ChecklistTemplateId
                  ) {
                    scoreTypesData.push({
                      id: scoreTypes[j].ScoreValue.toString(),
                      value: scoreTypes[j].ScoreText.toString(),
                      status: scoreTypes[j].ScoreStatus.toString(),
                      color: '#' + scoreTypes[j].ScoreColor.toString(),
                      templateId: scoreTypes[j].ChecklistTemplateId,
                    });
                  }
                }
              } else {
                scoreTypesData.push({
                  id: data[i].Score.toString(),
                  value: data[i].Score.toString(),
                  status: data[i].Status,
                  color: '',
                  templateId: data[i].ChecklistTemplateId,
                });
              }
              var lFormOneArr = null;
              var lFormTwoArr = null;

              if (data[i].LogicFormulae && data[i].LogicFormulae.length > 0) {
                lFormOneArr = data[i].LogicFormulae.split('|');
                if (lFormOneArr && lFormOneArr.length > 1) {
                  lFormTwoArr = lFormOneArr[1].split('_');
                }
              }

              //console.log('scoretypedd', data[i]);
              //console.log('scoretypedemo', AuditCheckpointDetail[temp]);
              // console.log(
              //   AuditCheckpointDetail?.[temp]?.Scoretext,
              //   'scretextvalues',
              // );
              //console.log('CheckPointDemo1>scoretextext', scoreTypesData, i);
              console.log('checkstatus************12',checkpointNcValue);

              checkPointList.push({
                ActualIndex: i,
                AuditId: data[i].AuditId,
                SerialNo: data[i].SerialNo.toString(),
                LogicFormulae: data[i].LogicFormulae,
                IsVeto: data[i].IsVeto.toString(),
                MandatoryCount: data[i].MandatoryCount.toString(),
                immediateAction: data[i].immediateAction.toString(),
                Score: AuditCheckpointDetail?.[i]?.Score,
                Scoretext: AuditCheckpointDetail?.[i]?.Scoretext,
                show_nc_ofi_status: checkpointNcValue?.[i]?.show_nc_ofi_status,
                IsComplete: AuditCheckpointDetail?.[i]?.IsComplete,
                LPAValidation: data[i].LPAValidation,
                Values: data[i].Values,
                ChecklistName: data[i].ChecklistName,
                ChecklistTemplateId: data[i].ChecklistTemplateId,
                CompLevelId: data[i].CompLevelId,
                ParentId: data[i].ParentId,
                ansType:
                  lFormTwoArr && lFormTwoArr.length > 2 ? lFormTwoArr[2] : '',
                correctAnswer:
                  lFormTwoArr && lFormTwoArr.length > 1 ? lFormTwoArr[1] : '',
                scoreType: data[i].ScoreType,
                minScore: data[i].MinScore.toString(),
                maxScore: data[i].Maxscore.toString(),
                scoreTypesData: scoreTypesData,
                AttachforNc: data[i].AttachforNc,
                RemarkforNc: data[i].RemarkforNc,
                RemarkforOfi: data[i].RemarkforOfi,
                AttachforOfi: data[i].AttachforOfi,
                Status: data[i].Status,
                FormID: data[i].FormId,
                FailureCategoryId: data[i].FailureCategoryId,
                FailureReasonId: data[i].FailureReasonId,
                RadioValue: data[i].RadioValue,
                Remark: data[i].Remark,
              });
            }
          }
        }
        console.log('Radio values', checkPointList);
        if (checkPoints) {
          //console.log('dummycheckpointdemo', checkPoints);

          if (checkPoints.length > 0) {
            for (var i = 0; i < checkPoints.length; i++) {
              for (var j = 0; j < checkPointList.length; j++) {
                if (
                  checkPointList?.[j]?.ChecklistTemplateId ==
                  checkPoints?.[i]?.ChecklistTemplateId
                ) {
                  var showncofistatus = 0;
                  for (
                    var k = 0;
                    k < checkPointList?.[j]?.scoreTypesData.length;
                    k++
                  ) {
                    if (
                      checkPointList?.[j]?.scoreTypesData[k].value ==
                      checkPoints?.[i]?.Score
                    ) {
                      showncofistatus =
                        checkPointList?.[j]?.scoreTypesData[k].status;
                    }
                    //console.log('nc ofi status:' + showncofistatus);
                  }

                  var nc_available = false;
                  var ofi_avialable = false;

                  if (this.props.data.audits.ncofiRecords) {
                    for (
                      var n = 0;
                      n < this.props.data.audits.ncofiRecords.length;
                      n++
                    ) {
                      if (
                        this.props.navigation.state.params.AuditID ==
                        this.props.data.audits.ncofiRecords[n].AuditID
                      ) {
                        // console.log(
                        //   'this audit template have nc ofi records..',
                        // );

                        var pending_list =
                          this.props.data.audits.ncofiRecords[n].Pending;
                        if (pending_list) {
                          for (var p = 0; p < pending_list.length; p++) {
                            if (
                              pending_list[p].AuditID ==
                              this.props.data.audits.ncofiRecords[n].AuditID
                            ) {
                              if (
                                pending_list[p].ChecklistTemplateId ==
                                checkPoints?.[i]?.ChecklistTemplateId
                              ) {
                                if (pending_list[p].Category == 'OFI') {
                                  // console.log(
                                  //   'ofi_avialable for this template',
                                  // );
                                  ofi_avialable = true;
                                  this.setState({
                                    ofiAvailable_OFI: true,
                                  });
                                }
                                if (pending_list[p].Category == 'NC') {
                                  //console.log('Nc_avialable for this template');
                                  nc_available = true;
                                  this.setState({
                                    ncAvailable_NC: true,
                                  });
                                }
                              }
                            }
                          }
                        }

                        var uploaded_list =
                          this.props.data.audits.ncofiRecords[n].Uploaded;
                        if (uploaded_list) {
                          for (var p = 0; p < uploaded_list.length; p++) {
                            if (
                              this.props.data.audits.ncofiRecords[n].AuditID ==
                              this.props.navigation.state.params.AuditID
                            ) {
                              if (
                                uploaded_list[p].ChecklistTemplateId ==
                                checkPoints?.[i]?.ChecklistTemplateId
                              ) {
                                if (
                                  uploaded_list[p].Category == 'OFI' ||
                                  uploaded_list[p].Category.slice(0, 3) == 'OFI'
                                ) {
                                  // console.log(
                                  //   'ofi_avialable for this template',
                                  // );
                                  ofi_avialable = true;
                                  this.setState({
                                    ofiAvailable_OFI: true,
                                  });
                                }
                                if (
                                  uploaded_list[p].Category == 'NC' ||
                                  uploaded_list[p].Category == 'NC Minor' ||
                                  uploaded_list[p].Category == 'NC Major' ||
                                  uploaded_list[p].Category.slice(0, 2) == 'NC'
                                ) {
                                  //console.log('Nc_avialable for this template');
                                  nc_available = true;
                                  this.setState({
                                    ncAvailable_NC: true,
                                  });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  var temppp = '';
                  if (checkPointList?.[j]?.ansType == 'M3') {
                    //console.log('**ANSTYPE**', checkPointList?.[j]?.ansType);
                    if (checkPoints[i].RadioValue == 0) {
                      if (checkPointList?.[j]?.Status == 0) {
                        //console.log('**checkpoints details**', checkPoints);
                        console.log('checkdetailpush===>33', checkPointList);
                        temppp = '33';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPointList?.[j]?.Scoretext,
                          IsComplete: checkPoints?.[j].IsComplete,
                          // scoreTypesData: item.scoreTypesData,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 10,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPointList?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                          FailureCategoryId:
                            checkPointList?.[j]?.FailureCategoryId,
                          FailureReasonId: checkPointList?.[j]?.FailureReasonId,
                        });
                      } else if (checkPointList?.[j]?.Status == 1) {
                        //console.log('**checkpoints details**', checkPoints[i]);
                        console.log('checkdetailpush===>2', checkPointList[j]);
                        temppp = '2';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 9,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          IsComplete: checkPoints?.[i].IsComplete,
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                          FailureCategoryId:
                            checkPointList?.[j]?.FailureCategoryId,
                          FailureReasonId: checkPointList?.[j]?.FailureReasonId,
                        });
                        //console.log(checkPointsDetails, 'threefour1');
                      } else if (checkPointList?.[j]?.Status == 2) {
                        //console.log('**checkpoints details**', checkPoints[i]);
                        console.log('checkdetailpush===>3', checkPointList);
                        temppp = '3';
                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          IsComplete: checkPoints?.[i].IsComplete,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 11,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                          FailureCategoryId:
                            checkPointList?.[j]?.FailureCategoryId,
                          FailureReasonId: checkPointList?.[j]?.FailureReasonId,
                        });
                      } else if (checkPointList?.[j]?.Status == -1) {
                        console.log(
                          '**checkpoints details**03',
                          checkPoints[i],
                        );
                        console.log('checkdetailpush===>03', checkPointList);
                        temppp = '03';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          scoreTypesData: scoreTypesData,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          IsComplete: checkPoints?.[i].IsComplete,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          FileName: checkPoints?.[i]?.FileName,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else {
                        //console.log('**checkpoints details**', checkPoints[i]);
                        console.log('checkdetailpush===>4', checkPointList);
                        temppp = '4';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          IsComplete: checkPointList?.[i].IsComplete,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPointList?.[i]?.Scoretext,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          FileName: checkPoints?.[i]?.FileName,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      }
                    } else {
                      //console.log('**checkpoints details**', checkPoints[i]);
                      console.log('checkdetailpush===>5', checkPointList);
                      temppp = '5';
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId:
                          checkPoints?.[i]?.ChecklistTemplateId,
                        FormId: checkPointList[i].FormID,
                        IsVeto: checkPointList?.[j]?.IsVeto,
                        SerialNo: checkPointList?.[j]?.SerialNo,
                        MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                        IsComplete: checkPoints?.[i].IsComplete,
                        LPAValidation: checkPointList?.[j]?.LPAValidation,
                        Values: checkPointList?.[j]?.Values,
                        immediateAction: checkPointList?.[j]?.immediateAction,
                        ParentId: checkPoints?.[i]?.ParentId,
                        Score:
                          checkPoints?.[i]?.Score == 'N/A'
                            ? -1
                            : checkPoints?.[i]?.Score,
                        Scoretext: checkPoints?.[i]?.Scoretext,
                        // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                        Remark: checkPoints?.[i]?.Remark,
                        RadioValue: checkPoints?.[i]?.RadioValue,
                        Correction:
                          checkPoints?.[i]?.Correction == ''
                            ? 0
                            : checkPoints?.[i]?.Correction,
                        Approach: checkPoints?.[i]?.Approach,
                        ApproachId: checkPoints?.[i]?.ApproachId,
                        ParamMode: checkPoints?.[i]?.ParamMode,
                        IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                        IsCorrect: checkPoints?.[i]?.IsCorrect,
                        Attachment: checkPoints?.[i]?.Attachment,
                        AttachmentList: checkPoints?.[i]?.AttachmentList,
                        FileName: checkPoints?.[i]?.FileName,
                        File: checkPoints?.[i]?.File,
                        FileType: checkPoints?.[i]?.FileType,
                        FileSize: checkPoints?.[i].FileSize
                          ? checkPoints?.[i]?.FileSize
                          : 0,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                        AttachforNc: checkPoints?.[i]?.AttachforNc,
                        RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                        AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                        Modified: checkPoints?.[i]?.Modified,
                        checklistName: checkPointList?.[j]?.ChecklistName,
                        show_nc_ofi_status: showncofistatus,
                        nc_available_status: nc_available,
                        ofi_avialable_status: ofi_avialable,
                      });
                    }
                  } else if (checkPointList?.[j]?.ansType == 'M2') {
                    //console.log('**ANSTYPE**', checkPointList?.[j]?.ansType);
                    console.log('checkdetailpush===>6', checkPointList);
                    temppp = '6';
                    if (checkPoints[i].RadioValue == 0) {
                      if (checkPointList?.[j]?.Status == 0) {
                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 13,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 1) {
                        console.log('checkdetailpush===>7', checkPointList);
                        temppp = '7';
                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 12,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == -1) {
                        console.log('checkdetailpush===>8', checkPointList);
                        temppp = '8';
                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 2) {
                        console.log('checkdetailpush===>08', checkPointList);
                        temppp = '08';
                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 11,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else {
                        console.log('checkdetailpush===>10', checkPointList);
                        temppp = '10';
                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      }
                    } else {
                      console.log('checkdetailpush===>11', checkPointList);
                      temppp = '11';
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId:
                          checkPoints?.[i]?.ChecklistTemplateId,
                        FormId: checkPointList[i].FormID,
                        IsVeto: checkPointList?.[j]?.IsVeto,
                        SerialNo: checkPointList?.[j]?.SerialNo,
                        MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                        LPAValidation: checkPointList?.[j]?.LPAValidation,
                        Values: checkPointList?.[j]?.Values,
                        immediateAction: checkPointList?.[j]?.immediateAction,
                        ParentId: checkPoints?.[i]?.ParentId,
                        Score:
                          checkPoints?.[i]?.Score == 'N/A'
                            ? -1
                            : checkPoints?.[i]?.Score,
                        Scoretext: checkPoints?.[i]?.Scoretext,
                        IsComplete: checkPoints?.[i].IsComplete,
                        // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                        Remark: checkPoints?.[i]?.Remark,
                        RadioValue: checkPoints?.[i]?.RadioValue,
                        Correction:
                          checkPoints?.[i]?.Correction == ''
                            ? 0
                            : checkPoints?.[i]?.Correction,
                        Approach: checkPoints?.[i]?.Approach,
                        ApproachId: checkPoints?.[i]?.ApproachId,
                        ParamMode: checkPoints?.[i]?.ParamMode,
                        IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                        IsCorrect: checkPoints?.[i]?.IsCorrect,
                        Attachment: checkPoints?.[i]?.Attachment,
                        AttachmentList: checkPoints?.[i]?.AttachmentList,
                        FileName: checkPoints?.[i]?.FileName,
                        File: checkPoints?.[i]?.File,
                        FileType: checkPoints?.[i]?.FileType,
                        FileSize: checkPoints?.[i].FileSize
                          ? checkPoints?.[i]?.FileSize
                          : 0,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                        AttachforNc: checkPoints?.[i]?.AttachforNc,
                        RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                        AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                        Modified: checkPoints?.[i]?.Modified,
                        checklistName: checkPointList?.[j]?.ChecklistName,
                        show_nc_ofi_status: showncofistatus,
                        nc_available_status: nc_available,
                        ofi_avialable_status: ofi_avialable,
                      });
                    }
                  } else if (checkPointList?.[j]?.ansType == 'M4') {
                    // //console.log('**ANSTYPE**', checkPointList?.[j]?.ansType)
                    // //console.log("checkPoints[i].Modified",checkPointList[j])

                    if (checkPoints[i].RadioValue == 0) {
                      if (checkPointList?.[j]?.Status == 0) {
                        // console.log(
                        //   'checkPoints[i].Modified',
                        //   checkPoints?.[i]?.Modified,
                        // );
                        console.log('checkdetailpush===>12', checkPointList);
                        temppp = '12';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 15,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 1) {
                        // console.log(
                        //   'checkPoints[i].Modified',
                        //   checkPoints?.[i]?.Modified,
                        // );
                        console.log('checkdetailpush===>14', checkPointList);
                        temppp = '14';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 14,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 2) {
                        // console.log(
                        //   'checkPoints[i].Modified',
                        //   checkPoints?.[i]?.Modified,
                        // );
                        console.log('checkdetailpush===>15', checkPointList);
                        temppp = '15';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 11,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == -1) {
                        // console.log(
                        //   'checkPoints[i].Modified',
                        //   checkPoints?.[i]?.Modified,
                        // );
                        console.log('checkdetailpush===>16', checkPointList);
                        temppp = '16';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else {
                        console.log('checkdetailpush===>17', checkPointList);
                        temppp = '17';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      }
                    } else {
                      console.log('checkdetailpush===>18', checkPointList);
                      temppp = '18';
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId:
                          checkPoints?.[i]?.ChecklistTemplateId,
                        FormId: checkPointList[i].FormID,
                        IsVeto: checkPointList?.[j]?.IsVeto,
                        SerialNo: checkPointList?.[j]?.SerialNo,
                        MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                        LPAValidation: checkPointList?.[j]?.LPAValidation,
                        Values: checkPointList?.[j]?.Values,
                        immediateAction: checkPointList?.[j]?.immediateAction,
                        ParentId: checkPoints?.[i]?.ParentId,
                        IsComplete: checkPoints?.[i].IsComplete,
                        Score:
                          checkPoints?.[i]?.Score == 'N/A'
                            ? -1
                            : checkPoints?.[i]?.Score,
                        Scoretext: checkPoints?.[i]?.Scoretext,
                        // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                        Remark: checkPoints?.[i]?.Remark,
                        RadioValue: checkPoints?.[i]?.RadioValue,
                        Correction:
                          checkPoints?.[i]?.Correction == ''
                            ? 0
                            : checkPoints?.[i]?.Correction,
                        Approach: checkPoints?.[i]?.Approach,
                        ApproachId: checkPoints?.[i]?.ApproachId,
                        ParamMode: checkPoints?.[i]?.ParamMode,
                        IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                        IsCorrect: checkPoints?.[i]?.IsCorrect,
                        Attachment: checkPoints?.[i]?.Attachment,
                        AttachmentList: checkPoints?.[i]?.AttachmentList,
                        FileName: checkPoints?.[i]?.FileName,
                        File: checkPoints?.[i]?.File,
                        FileType: checkPoints?.[i]?.FileType,
                        FileSize: checkPoints?.[i].FileSize
                          ? checkPoints?.[i]?.FileSize
                          : 0,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                        AttachforNc: checkPoints?.[i]?.AttachforNc,
                        RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                        AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                        Modified: checkPoints?.[i]?.Modified,
                        checklistName: checkPointList?.[j]?.ChecklistName,
                        show_nc_ofi_status: showncofistatus,
                        nc_available_status: nc_available,
                        ofi_avialable_status: ofi_avialable,
                      });
                    }
                  } else if (checkPointList?.[j]?.ansType == 'M1') {
                    //console.log('**ANSTYPE**', checkPointList?.[j]?.ansType);
                    if (checkPoints[i].RadioValue == 0) {
                      if (checkPointList?.[j]?.Status == 0) {
                        console.log('checkdetailpush===>018', checkPointList);
                        temppp = '018';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 10,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 1) {
                        console.log('checkdetailpush===>19', checkPointList);
                        temppp = '19';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 9,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == -1) {
                        console.log('checkdetailpush===>20', checkPointList);
                        temppp = '20';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 2) {
                        console.log('checkdetailpush===>21', checkPointList);
                        temppp = '21';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 11,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else {
                        console.log('checkdetailpush===>22', checkPointList);
                        temppp = '22';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      }
                    } else {
                      console.log('checkdetailpush===>23', checkPointList);
                      temppp = '23';
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId:
                          checkPoints?.[i]?.ChecklistTemplateId,
                        FormId: checkPointList[i].FormID,
                        IsVeto: checkPointList?.[j]?.IsVeto,
                        SerialNo: checkPointList?.[j]?.SerialNo,
                        MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                        LPAValidation: checkPointList?.[j]?.LPAValidation,
                        Values: checkPointList?.[j]?.Values,
                        immediateAction: checkPointList?.[j]?.immediateAction,
                        ParentId: checkPoints?.[i]?.ParentId,
                        Score:
                          checkPoints?.[i]?.Score == 'N/A'
                            ? -1
                            : checkPoints?.[i]?.Score,
                        Scoretext: checkPoints?.[i]?.Scoretext,
                        IsComplete: checkPoints?.[i].IsComplete,
                        // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                        Remark: checkPoints?.[i]?.Remark,
                        RadioValue: checkPoints?.[i]?.RadioValue,
                        Correction:
                          checkPoints?.[i]?.Correction == ''
                            ? 0
                            : checkPoints?.[i]?.Correction,
                        Approach: checkPoints?.[i]?.Approach,
                        ApproachId: checkPoints?.[i]?.ApproachId,
                        ParamMode: checkPoints?.[i]?.ParamMode,
                        IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                        IsCorrect: checkPoints?.[i]?.IsCorrect,
                        Attachment: checkPoints?.[i]?.Attachment,
                        AttachmentList: checkPoints?.[i]?.AttachmentList,
                        FileName: checkPoints?.[i]?.FileName,
                        File: checkPoints?.[i]?.File,
                        FileType: checkPoints?.[i]?.FileType,
                        FileSize: checkPoints?.[i].FileSize
                          ? checkPoints?.[i]?.FileSize
                          : 0,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                        AttachforNc: checkPoints?.[i]?.AttachforNc,
                        RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                        AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                        Modified: checkPoints?.[i]?.Modified,
                        checklistName: checkPointList?.[j]?.ChecklistName,
                        show_nc_ofi_status: showncofistatus,
                        nc_available_status: nc_available,
                        ofi_avialable_status: ofi_avialable,
                      });
                    }
                  } else {
                    if (checkPoints[i].RadioValue == 0) {
                      if (checkPointList?.[j]?.Status == 0) {
                        console.log('checkdetailpush===>24', checkPointList);
                        temppp = '24';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 10,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 1) {
                        console.log('checkdetailpush===>25', checkPointList);
                        temppp = '25';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 9,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == -1) {
                        console.log('checkdetailpush===>26', checkPointList);
                        temppp = '26';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else if (checkPointList?.[j]?.Status == 2) {
                        console.log('checkdetailpush===>27', checkPointList);
                        temppp = '27';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          // RadioValue: 11,
                          RadioValue: checkPoints?.[i]?.RadioValue,

                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      } else {
                        console.log('checkdetailpush===>28', checkPointList);
                        temppp = '28';

                        checkPointsDetails.push({
                          AuditId: this.props.navigation.state.params.AuditID,
                          ChecklistTemplateId:
                            checkPoints?.[i]?.ChecklistTemplateId,
                          FormId: checkPointList[i].FormID,
                          IsVeto: checkPointList?.[j]?.IsVeto,
                          SerialNo: checkPointList?.[j]?.SerialNo,
                          MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                          LPAValidation: checkPointList?.[j]?.LPAValidation,
                          Values: checkPointList?.[j]?.Values,
                          immediateAction: checkPointList?.[j]?.immediateAction,
                          ParentId: checkPoints?.[i]?.ParentId,
                          Score:
                            checkPoints?.[i]?.Score == 'N/A'
                              ? -1
                              : checkPoints?.[i]?.Score,
                          Scoretext: checkPoints?.[i]?.Scoretext,
                          IsComplete: checkPoints?.[i].IsComplete,
                          // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                          Remark: checkPoints?.[i]?.Remark,
                          RadioValue: checkPoints?.[i]?.RadioValue,
                          Correction:
                            checkPoints?.[i]?.Correction == ''
                              ? 0
                              : checkPoints?.[i]?.Correction,
                          Approach: checkPoints?.[i]?.Approach,
                          ApproachId: checkPoints?.[i]?.ApproachId,
                          ParamMode: checkPoints?.[i]?.ParamMode,
                          IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                          IsCorrect: checkPoints?.[i]?.IsCorrect,
                          Attachment: checkPoints?.[i]?.Attachment,
                          AttachmentList: checkPoints?.[i]?.AttachmentList,
                          FileName: checkPoints?.[i]?.FileName,
                          File: checkPoints?.[i]?.File,
                          FileType: checkPoints?.[i]?.FileType,
                          FileSize: checkPoints?.[i].FileSize
                            ? checkPoints?.[i]?.FileSize
                            : 0,
                          isScoreValid: true,
                          scoreInvalidMsg: '',
                          RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                          AttachforNc: checkPoints?.[i]?.AttachforNc,
                          RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                          AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                          Modified: checkPoints?.[i]?.Modified,
                          checklistName: checkPointList?.[j]?.ChecklistName,
                          show_nc_ofi_status: showncofistatus,
                          nc_available_status: nc_available,
                          ofi_avialable_status: ofi_avialable,
                        });
                      }
                    } else {
                      console.log('checkdetailpush===>29', checkPointList);
                      temppp = '29';
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId:
                          checkPoints?.[i]?.ChecklistTemplateId,
                        FormId: checkPointList[i].FormID,
                        IsVeto: checkPointList?.[j]?.IsVeto,
                        SerialNo: checkPointList?.[j]?.SerialNo,
                        MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                        LPAValidation: checkPointList?.[j]?.LPAValidation,
                        Values: checkPointList?.[j]?.Values,
                        immediateAction: checkPointList?.[j]?.immediateAction,
                        ParentId: checkPoints?.[i]?.ParentId,
                        Score:
                          checkPoints?.[i]?.Score == 'N/A'
                            ? -1
                            : checkPoints?.[i]?.Score,
                        Scoretext: checkPoints?.[i]?.Scoretext,
                        IsComplete: checkPoints?.[i].IsComplete,
                        // Score: checkPointList?.[j]?.scoreType == 1? parseInt(checkPointList?.[j]?.minScore) :((checkPoints[i].Score < 0) ? -1 :checkPoints?.[i]?.Score),
                        Remark: checkPoints?.[i]?.Remark,
                        RadioValue: checkPoints?.[i]?.RadioValue,
                        Correction:
                          checkPoints?.[i]?.Correction == ''
                            ? 0
                            : checkPoints?.[i]?.Correction,
                        Approach: checkPoints?.[i]?.Approach,
                        ApproachId: checkPoints?.[i]?.ApproachId,
                        ParamMode: checkPoints?.[i]?.ParamMode,
                        IsNCAllowed: checkPoints?.[i]?.IsNCAllowed,
                        IsCorrect: checkPoints?.[i]?.IsCorrect,
                        Attachment: checkPoints?.[i]?.Attachment,
                        AttachmentList: checkPoints?.[i]?.AttachmentList,
                        FileName: checkPoints?.[i]?.FileName,
                        File: checkPoints?.[i]?.File,
                        FileType: checkPoints?.[i]?.FileType,
                        FileSize: checkPoints?.[i].FileSize
                          ? checkPoints?.[i]?.FileSize
                          : 0,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints?.[i]?.RemarkforNc,
                        AttachforNc: checkPoints?.[i]?.AttachforNc,
                        RemarkforOfi: checkPoints?.[i]?.RemarkforOfi,
                        AttachforOfi: checkPoints?.[i]?.AttachforOfi,
                        Modified: checkPoints?.[i]?.Modified,
                        checklistName: checkPointList?.[j]?.ChecklistName,
                        show_nc_ofi_status: showncofistatus,
                        nc_available_status: nc_available,
                        ofi_avialable_status: ofi_avialable,
                      });
                    }
                  }
                }
              }
            }
          } else {
            for (var i = 0; i < checkPointList.length; i++) {
              console.log('11==>', checkPointList, checkPoints);
              // console.log(
              //   'checkdetailpush===>30',
              //   checkPointList[i].MandatoryCount,
              //   checkPointsDetails,
              // );
              temppp = '30';
              // console.log(
              //   auditRecords[0]?.Listdata[checkPointList[i].ActualIndex],
              //   'sat===>/',
              // );
              //console.log(checkPointList[i], 'checkpointdemogettingprops');

              checkPointsDetails.push({
                ActualIndex: checkPointList[i].ActualIndex,
                FormId: checkPointList[i].FormID,
                AuditId: this.props.navigation.state.params.AuditID,
                ChecklistTemplateId: checkPointList?.[i]?.ChecklistTemplateId,
                IsVeto: checkPointList?.[j]?.IsVeto,
                MandatoryCount: checkPointList?.[j]?.MandatoryCount,
                LPAValidation: checkPointList?.[j]?.LPAValidation,
                Values: checkPointList?.[j]?.Values,
                SerialNo: checkPointList?.[j]?.SerialNo,
                immediateAction: checkPointList?.[i]?.immediateAction,
                ParentId: checkPointList?.[i]?.ParentId,
                Score: checkPointList?.[i]?.Score,
                Scoretext: checkPointList?.[i]?.Scoretext,
                IsComplete: checkPointList?.[i].IsComplete,
                FailureCategoryId: checkPointList?.[i].FailureCategoryId,
                FailureReasonId: checkPointList?.[i].FailureReasonId,
                Remark: '',
                RadioValue: 14,
                Correction: 0,
                Approach: '',
                ApproachId: 0,
                ParamMode: 0,
                IsNCAllowed: 0,
                IsCorrect: -1,
                Attachment: '',
                AttachmentList: [],
                FileName: '',
                File: '',
                FileType: '',
                FileSize: 0,
                isScoreValid: true,
                scoreInvalidMsg: '',
                RemarkforNc: checkPointList?.[i]?.RemarkforNc,
                AttachforNc: checkPointList?.[i]?.AttachforNc,
                RemarkforOfi: checkPointList?.[i]?.RemarkforOfi,
                AttachforOfi: checkPointList?.[i]?.AttachforOfi,
                Modified: checkPointList?.[i]?.Modified,
                checklistName: checkPointList?.[j]?.ChecklistName,
                show_nc_ofi_status: showncofistatus,
                nc_available_status: nc_available,
                ofi_avialable_status: ofi_avialable,
                ...auditRecords[temp]?.Listdata[checkPointList[i].ActualIndex],
              });
              //console.log(checkPointsDetails, 'threefour2');
              //console.log(checkPointList, 'threefour3');
              if (checkPointsDetails[i].Score === '-2') {
                console.log(
                  checkPointsDetails?.[i]?.Score,
                  'enteringcheckconsole',
                );
                this.setState({
                  mincheckValue: this.state.mincheckValue++,
                });
              }
              //console.log(this.state.mincheckValue, 'mincheckValue');
            }
          }
        } else {
          for (var i = 0; i < checkPointList.length; i++) {
            //console.log('12==>');
            console.log('checkdetailpush===>31', checkPointList);
            temppp = '31';
            checkPointsDetails.push({
              AuditId: this.props.navigation.state.params.AuditID,
              ChecklistTemplateId: checkPointList?.[i]?.ChecklistTemplateId,
              FormId: checkPointList[i].FormID,
              //  IsVeto: checkPointList?.[j]?.IsVeto,
              SerialNo: checkPointList?.[j]?.SerialNo,
              MandatoryCount: checkPointList?.[j]?.MandatoryCount,
              LPAValidation: checkPointList?.[j]?.LPAValidation,
              Values: checkPointList?.[j]?.Values,
              immediateAction: checkPointList?.[j]?.immediateAction,
              ParentId: checkPointList?.[i]?.ParentId,
              Score: '',
              Scoretext: '',
              IsComplete: '',
              Remark: '',
              RadioValue: 0,
              Correction: 0,
              Approach: '',
              ApproachId: 0,
              ParamMode: 0,
              IsNCAllowed: 0,
              IsCorrect: -1,
              Attachment: '',
              AttachmentList: [],
              FileName: '',
              File: '',
              FileType: '',
              FileSize: 0,
              isScoreValid: true,
              scoreInvalidMsg: '',
              RemarkforNc: checkPointList?.[i]?.RemarkforNc,
              AttachforNc: checkPointList?.[i]?.AttachforNc,
              RemarkforOfi: checkPointList?.[i]?.RemarkforOfi,
              AttachforOfi: checkPointList?.[i]?.AttachforOfi,
              Modified: checkPointList?.[i]?.Modified,
              checklistName: checkPointList?.[j]?.ChecklistName,
              show_nc_ofi_status: showncofistatus,
              nc_available_status: nc_available,
              ofi_avialable_status: ofi_avialable,
            });
          }
        }

        //console.log('checkPointsDetails updated2', temppp, checkPointsDetails);
        //console.log(checkPointList, 'checkpointslist');
        this.countStatistics(checkPointsDetails);
        // console.log(
        //   'checkPointsDetails updated2sadsdsdsdsdfsd',
        //   this.props.navigation.state.params,
        // );

        this.setState(
          {
            raiseID: this.props.navigation.state.params.Check,
            // dropProps: this.props.navigation.state.params.Drops,
            // RadioLogic: this.props.navigation.state.params.LogicPass,
            ncFormID: this.props.navigation.state.params.FormId,
            ischeckLPA:
              this.props.navigation.state.params.AuditProgramId == -1
                ? true
                : false,
            AuditOrder: this.props.navigation.state.params.AuditProgramId,
            //ischeckLPA: true,
            LPAdrop: getLPA,
            checkPointsValues: checkPoints,
            auditId: this.props.navigation.state.params.AuditID,
            dropdown: dropdata,
            checkpointList: checkPointList,
            checkPointsDetails: checkPointsDetails,
            isContentLoaded: false,
            isAttachmentLoaded: true,
            selectedindex: checkPointList[0],
          },
          () => {
            // //console.log('this.stat e.checkPointsValues',this.state.checkPointsValues)
            // //console.log('this.state.dropProps',this.state.dropProps)
            // //console.log('this.state.raiseId',this.state.raiseID)
            // //console.log('this.state.Radiologic',this.state.RadioLogic)
            // //console.log('this.state.ischeckLPA',this.state.ischeckLPA)
            // //console.log('--drop-->',this.state.dropdown)
            // //console.log('checkpointList loaded',this.state.checkpointList)
            // console.log(
            //   'checkPointsDetails loaded',
            //   temppp,
            //   this.state.checkPointsDetails,
            // );
            // console.log(
            //   'checkPointsDetails loadedischeckLPA',

            //   this.state.ischeckLPA,
            // );
            // console.log(
            //   'checkPointsDetails loadedLPAdrop',

            //   this.state.LPAdrop,
            // );
            //console.log('checkPointsDetails dropdown', this.state.dropdown);

            console.log(
              'Load: checkPointsDetails',
              temppp,
              this.state.checkpointList,
            );
          },
        );
        // }
      },
    );
  }

  radioValue = (value, i) => {
    //  //console.log('value', value)
    //  //console.log('pos', i)
    this.setState({...this.state.radiovalue, [i]: value}, () => {
      //  //console.log('RadioValue',this.state.radiovalue)
    });
  };
  forceGoBackToChecklist = () => {
    this.setState(
      {
        dialogVisible: false,
        dialogVisibleNC: false,
      },
      () => {
        //console.log('goBack1');
        this.props.navigation.goBack();
      },
    );
  };

  componentWillReceiveProps(props) {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    console.log('--CurrentPage--->', CurrentPage);

    if (CurrentPage == 'CheckPointDemo') {
      //console.log('Checkpoints page focussed!');
      //console.log('--CheckPointScreen-PROPS-->', props);
      //console.log('--CheckPointScreen-this.PROPS-->', this.props);

      if (this.state.attachSelectedItem) {
        var cameraCapture = props.data.audits.cameraCapture;
        var checkPointsDetails = this.state.checkPointsDetails;
        var templateId = this.state.attachSelectedItem.ChecklistTemplateId;

        if (cameraCapture.length > 0 && checkPointsDetails.length > 0) {
          for (var i = 0; i < checkPointsDetails.length; i++) {
            if (checkPointsDetails[i].ChecklistTemplateId == templateId) {
              // checkPointsDetails[i].Attachment = cameraCapture[0].name;
              // checkPointsDetails[i].File = cameraCapture[0].uri;
              // // checkPointsDetails[i].FileName = cameraCapture[0].name.length > 30 ? cameraCapture[0].name.slice(0, 30) + '...' : cameraCapture[0].name
              // checkPointsDetails[i].FileName = cameraCapture[0].name;
              // checkPointsDetails[i].FileType = cameraCapture[0].type;

              checkPointsDetails[i].Modified = true;
              let FileArrayTemp = checkPointsDetails[i].AttachmentList;
              let FileArrayTempOne = [
                {
                  id: Moment().unix() + '_' + i,
                  FileUri: cameraCapture[0].uri,
                  AuditID: parseInt(this.state.auditId),
                  ChecklistTemplateID: templateId,
                  Docid: 0,
                  FormId: checkPointsDetails[i].FormId,
                  FileName: cameraCapture[0].name,
                  FileType: cameraCapture[0].type,
                  Attachment: cameraCapture[0].data,
                },
              ];
              //console.log(FileArrayTemp.length, 'filearraytemp');

              let fileMergeResult = FileArrayTemp.concat(FileArrayTempOne);
              //console.log(fileMergeResult, 'filearraytemp2');
              checkPointsDetails[i].AttachmentList = fileMergeResult;
            }
          }
          this.setState(
            {
              checkPointsDetails: checkPointsDetails,
              isUnsavedData: true,
              isAttachmentLoaded: true,
            },
            () => {
              console.log(
                'Checkpoint page - checkPointsDetails',
                this.state.checkPointsDetails,
                cameraCapture,
              );
              this.countStatistics(this.state.checkPointsDetails);
            },
          );
          this.props.storeCameraCapture([]);
        } else {
          this.setState(
            {
              isAttachmentLoaded: true,
            },
            () => {
              //console.log('Attachment: photo cancelled');
            },
          );
        }
      }
    } else {
      //console.log('CheckPointScreen pass');
    }

    //nc -ofi --if new nc/ofi raised then showed circles in templaes...

    if (this.props.data.audits.ncofiRecords) {
      var ncofi_details = props.data.audits.ncofiRecords;
   //   //console.log('ncofi_details', ncofi_details);
      
      var checkPointsDetails = this.state.checkPointsDetails;
   //   //console.log(checkPointsDetails, 'checkPointsDetailsve');
      
      if (ncofi_details.length > 0 && checkPointsDetails.length > 0) {
        for (var i = 0; i < checkPointsDetails.length; i++) {
          for (var j = 0; j < ncofi_details.length; j++) {
        //    //console.log(ncofi_details.length, 'ncofi_details.length');
            
            if (ncofi_details[j].AuditID == checkPointsDetails[i].AuditId) {
              //pending
              var pending_ncofi = ncofi_details[j].Pending;
              for (var k = 0; k < pending_ncofi.length; k++) {
                if (
                  pending_ncofi[k].AuditID == checkPointsDetails[i].AuditId &&
                  pending_ncofi[k].ChecklistTemplateId ==
                    checkPointsDetails[i].ChecklistTemplateId
                ) {
                  if (pending_ncofi[k].Category == 'NC') {
                    checkPointsDetails[i].nc_available_status = true;
                  }
                  if (pending_ncofi[k].Category == 'OFI') {
                    checkPointsDetails[i].ofi_avialable_status = true;
                  }
                }
              }
              //uploaded
              var Uploaded_ncofi = ncofi_details[j].Uploaded;
              console.log(
                'NC_AVAILABLE_STATUS',
                checkPointsDetails[i].nc_available_status,
              );
              for (var k = 0; k < Uploaded_ncofi.length; k++) {
                if (
                  //Uploaded_ncofi[k].AuditID == checkPointsDetails[i].AuditId &&
                  Uploaded_ncofi[k].ChecklistTemplateId ==
                  checkPointsDetails[i].ChecklistTemplateId
                ) {
                  if (Uploaded_ncofi[k].Category == 'NC') {
                    checkPointsDetails[i].nc_available_status = true;
                  }
                  if (Uploaded_ncofi[k].Category == 'OFI') {
                    checkPointsDetails[i].ofi_avialable_status = true;
                  }
                }
              }
            }
          }
        }

        this.setState(
          {checkPointsDetails: checkPointsDetails, isUnsavedData: true},
          () => {
            console.log(
              'Checkpoint page - checkPointsDetails --nc/ofi',
              this.state.checkPointsDetails,
            );
            this.countStatistics(this.state.checkPointsDetails);
          },
        );
      }
    }
  }

  countStatistics = checkPointsDetails => {
    ////console.log("reset count statistics")
    // //console.log('***',this.state.checkPointsDetails)
    //console.log('Sathish==>', checkPointsDetails);
    var data = checkPointsDetails;
    var pendingCheck = [];
    var completed = [];
    var mandatoryCheck = 0;

    for (var i = 0; i < data.length; i++) {
      if (data[i].RemarkforNc == 1 && data[i].AttachforNc == 1) {
        //console.log('mqn1');
        mandatoryCheck = mandatoryCheck + 1;
        if (
          checkPointsDetails[i].Remark == '' &&
          checkPointsDetails[i].Attachment == ''
        ) {
          pendingCheck.push(data[i]);
        } else if (
          checkPointsDetails[i].Remark == '' ||
          checkPointsDetails[i].Attachment == ''
        ) {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].RemarkforOfi === 1 && data[i].AttachforOfi === 1) {
        //console.log('mqn2');

        mandatoryCheck = mandatoryCheck + 1;
        if (
          checkPointsDetails[i].Remark === '' &&
          checkPointsDetails[i].Attachment === ''
        ) {
          pendingCheck.push(data[i]);
        } else if (
          checkPointsDetails[i].Remark === '' ||
          checkPointsDetails[i].Attachment === ''
        ) {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].RemarkforOfi === 1) {
        //console.log('mqn3');

        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Remark === '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].RemarkforNc == 1) {
        //console.log('mqn4');

        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Remark == '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].AttachforNc == 1) {
        //console.log('mqn5');

        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Attachment == '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].AttachforOfi == 1) {
        //console.log('mqn6');

        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Attachment == '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].IsVeto == 1) {
        //console.log('mqn7');

        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Attachment == '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else {
        console.log(
          'mqn8',
          data[i].IsVeto,
          mandatoryCheck,
          this.state.checkpointList,
          this.state.checkPointsDetails,
        );
        if (this.state.checkpointList[i]?.IsVeto == 1) {
          mandatoryCheck = mandatoryCheck + 1;
        }
        completed.push(data[i]);
      }
    }

    //console.log('data length', data.length);
    //console.log('completed arr-->', completed);
    //console.log('pendingCheck', pendingCheck);
    //console.log('mandatoryCheck', mandatoryCheck);
    //console.log('Executed ---<>');

    this.setState(
      {
        checkPointsDetails: this.state.checkPointsDetails,
        mandateCheckpoints: pendingCheck.length,
        totalfilled: completed.length,
        optionalCheck: data.length - mandatoryCheck,
        totalCheck: data.length,
        mandatoryCheck: mandatoryCheck,
        isCaroselLoaded: true,
      },
      () => {
        //console.log('total checkpoints filled', this.state.totalfilled);
        //console.log('total pending checkpoints', this.state.mandateCheckpoints);
        //console.log('total manadatory checkpoints', this.state.mandatoryCheck);
      },
    );
  };

  goHome = () => {
    if (this.state.isUnsavedData == true) {
      this.setState({
        dialogVisible: true,
        dialogVisibleNC: false,
        go_home: true,
      });
    } else {
      this.props.navigation.navigate('AuditDashboard');
      this.getTotalNCStatus();
    }
  };

  goBackToChecklist = () => {
    if (this.state.isUnsavedData == true) {
      this.setState({
        dialogVisible: true,
        dialogVisibleNC: false,
      });
    } else {
      //console.log('goBack2');
      this.props.navigation.goBack();
    }
  };

  ShowToast = () => {
    this.refs.toast.show(this.state.displayData, 6000);
  };

  updateCheckPointsValues = () => {
    //console.log('updateCheckPointsValues executed');
    let bcontinue = false;
    //  this.updatecheckpointvalues_new();
    var notifyRed = this.props.navigation.state.params?.notifyRed;
    // if (this.state.TemplateID == 5) {
    // if (this.state.isUnsavedData == true) {
    const allowedMinimum = (2 / 3).toFixed(2);
    var totalCheckPoint = this.state.checkPointsDetails.length;
    const filledData = this.state.checkPointsDetails.filter(
      checkPoint => checkPoint.Score !== '-2',
    );

    const filledCount = filledData.length;

  if (filledCount > 0) {
    const filledMin = (filledCount / totalCheckPoint).toFixed(2);
    if (filledMin >= allowedMinimum) {
      bcontinue = true;
    }
  }
  if (this.state.ischeckLPA !== 'true' ) {
    
    if (!bcontinue   ) {
      ToastNew.show({
        type: 'error',
        text1: 'Minimum number of Questions is not answered',
      });
    } else {
      //return;
      //this.updatecheckpointvalues_new();
    } //else {
    this.updatecheckpointvalues_new();
  }
  //}
};

updatecheckpointvalues_new = () => {
  console.log('save button pressed');
  this.setState(
    {
      isContentLoaded: true,
      dialogVisible: false,
    },
    () => {
      var m = 0;

      var checkPointsDetails = this.state.checkPointsDetails;
      console.log('checkcheckpoinntdetails***********',checkPointsDetails);
      
      //console.log(this.state.checkPointsDetails, 'hellodataone');
      this.setState({checkMandate: true});
      var arr = [];

      for (var i = 0; i < checkPointsDetails.length; i++) {
        if (
          checkPointsDetails[i].RemarkforNc == 1 ||
          checkPointsDetails[i].RemarkforOfi == 1
        ) {
          if (checkPointsDetails[i].Remark == '') {
            this.setState({checkMandate: false}, () => {
              //console.log('Please save remark manadatory fields.');
            });
          }
        } else if (
          checkPointsDetails[i].AttachforNc == 1 ||
          checkPointsDetails[i].AttachforOfi == 1
        ) {
          if (checkPointsDetails[i].AttachmentList.length == 0) {
            this.setState({checkMandate: false}, () => {
              //console.log('Please save attach manadatory fields.');
            });
          }
        } else if (
          checkPointsDetails[i].AttachforNc == 1 &&
          checkPointsDetails[i].RemarkforNc == 1
        ) {
          if (
            checkPointsDetails[i].AttachmentList.length == 0 &&
            checkPointsDetails[i].Remark == ''
          ) {
            this.setState({checkMandate: false}, () => {
              //console.log('Please save attach manadatory fields.');
            });
          }
        } else if (
          checkPointsDetails[i].AttachforOfi == 1 &&
          checkPointsDetails[i].RemarkforOfi == 1
        ) {
          if (
            checkPointsDetails[i].AttachmentList.length == 0 &&
            checkPointsDetails[i].RemarkforOfi == ''
          ) {
            this.setState({checkMandate: false}, () => {
              //console.log('Please save attach manadatory fields.');
            });
          }
        } else if (
          checkPointsDetails[i].Remark == '' &&
          checkPointsDetails[i].Values !== checkPointsDetails[i].RadioValue &&
          this.state.checkPointsDetails[i].Remark
        ) {
          this.setState({checkMandate: false}, () => {
            //console.log('Please enter remarks.');
          });
          //console.log('checkpoint details:::' + checkPointsDetails[i]);
          alert('Please enter remarks');
        }
      }
      var isFormValid = true;
      var index = 0;

      for (var i = 0; i < checkPointsDetails.length; i++) {
        if (!checkPointsDetails[i].isScoreValid) {
          isFormValid = false;
        }
      }
      if (!isFormValid) {
        this.setState(
          {
            isContentLoaded: false,
            ActiveId: index,
          },
          () => {
            this.refs.toast.show(strings.InvalidScore, DURATION.LENGTH_LONG);
          },
        );
      } else {
        this.setState(
          {
            isSaving: true,
            ActiveId: index,
          },
          () => {
            //console.log('Save button clicked');
            var auditRecordsOrg = this.props.data.audits.auditRecords;
            var auditRecords = [];
            var checkPointsDetails = this.state.checkPointsDetails;
            var listData = [];
            var isAuditFound = false;
            //console.log('checkPointsDetails1 &&&', checkPointsDetails);
            //console.log('checkPointsDetails1 &&', auditRecordsOrg);

            for (var p = 0; p < auditRecordsOrg.length; p++) {
              var listDataArr = [];
              if (auditRecordsOrg[p].AuditId == this.state.auditId) {
                if (auditRecordsOrg[p].Listdata) {
                  if (auditRecordsOrg[p].Listdata.length > 0) {
                    for (
                      var q = 0;
                      q < auditRecordsOrg[p].Listdata.length;
                      q++
                    ) {
                      console.log(
                        'org data====>',
                        auditRecordsOrg[p].Listdata[q],
                      );
                      console.log(
                        'org data====>',
                        auditRecordsOrg[p].Listdata[q],
                      );
                      const formid =
                        this.props.navigation.state.params.FormIdNavigate;

                      listDataArr.push({
                        ParentId: auditRecordsOrg[p].Listdata[q].ParentId,
                        FormId: auditRecordsOrg[p].Listdata[q].FormId,
                        Attachment: auditRecordsOrg[p].Listdata[q].Attachment,
                        AttachmentList:
                          auditRecordsOrg[p].Listdata[q].AttachmentList,
                        File: auditRecordsOrg[p].Listdata[q].File,
                        FileName: auditRecordsOrg[p].Listdata[q].FileName,
                        FileType: auditRecordsOrg[p].Listdata[q].FileType,
                        Remark: auditRecordsOrg[p].Listdata[q].Remark,
                        ParamMode: auditRecordsOrg[p].Listdata[q].ParamMode,
                        IsNCAllowed:
                          auditRecordsOrg[p].Listdata[q].IsNCAllowed,
                        IsCorrect: auditRecordsOrg[p].Listdata[q].IsCorrect,
                        IsComplete:
                          auditRecordsOrg[p]?.Listdata[q]?.IsComplete,
                        RadioValue: auditRecordsOrg[p].Listdata[q].RadioValue,
                        Correction:
                          auditRecordsOrg[p].Listdata[q].Correction == ''
                            ? 0
                            : auditRecordsOrg[p].Listdata[q].Correction,
                        Approach: auditRecordsOrg[p].Listdata[q].Approach,
                        ApproachId: auditRecordsOrg[p].Listdata[q].ApproachId,
                        Score: auditRecordsOrg[p].Listdata[q].Score,
                        Scoretext: auditRecordsOrg[p].Listdata[q].Scoretext,
                        show_nc_ofi_status: auditRecordsOrg[p].Listdata[q].show_nc_ofi_status,
                        RemarkforNc:
                          auditRecordsOrg[p].Listdata[q].RemarkforNc,
                        AttachforOfi:
                          auditRecordsOrg[p].Listdata[q].AttachforOfi,
                        RemarkforOfi:
                          auditRecordsOrg[p].Listdata[q].RemarkforOfi,
                        //getting extra
                        AttachforComp:
                          auditRecordsOrg[p].Listdata[q].AttachforComp,
                        AttachforNc:
                          auditRecordsOrg[p].Listdata[q].AttachforNc,
                        Modified: auditRecordsOrg[p].Listdata[q].Modified,
                        AuditId: auditRecordsOrg[p].Listdata[q].AuditId,
                        ChecklistName:
                          auditRecordsOrg[p].Listdata[q].ChecklistName,
                        //  MandatoryCount: auditRecordsOrg[p].Listdata[q].MandatoryCount,
                        ChecklistTemplateId:
                          auditRecordsOrg[p].Listdata[q].ChecklistTemplateId,
                        CompLevelId:
                          auditRecordsOrg[p].Listdata[q].CompLevelId,
                        LogicFormulae:
                          auditRecordsOrg[p].Listdata[q].LogicFormulae,
                        Maxscore: auditRecordsOrg[p].Listdata[q].Maxscore,
                        MinScore: auditRecordsOrg[p].Listdata[q].MinScore,
                        NeedScore: auditRecordsOrg[p].Listdata[q].NeedScore,
                        ScoreType: auditRecordsOrg[p].Listdata[q].ScoreType,
                        isScoreValid:
                          auditRecordsOrg[p].Listdata[q].isScoreValid,
                        scoreInvalidMsg:
                          auditRecordsOrg[p].Listdata[q].scoreInvalidMsg,
                        immediateAction:
                          auditRecordsOrg[p].Listdata[q].immediateAction,
                        deleteallattachment:
                          auditRecordsOrg[p].Listdata[q].FormId == formid
                            ? this.state.deleteallattachment
                            : auditRecordsOrg[p].Listdata[q]
                                .deleteallattachment,
                      });
                    }
                  }
                }
                var AuditRecordStatus = auditRecordsOrg[p].AuditRecordStatus;

                if (auditRecordsOrg[p].AuditId == this.state.auditId) {
                  AuditRecordStatus = constant.StatusNotSynced;
                }
                //console.log('LISTDATAARR', listDataArr, checkPointsDetails);
                for (var i = 0; i < listDataArr.length; i++) {
                  for (var j = 0; j < checkPointsDetails.length; j++) {
                    if (
                      listDataArr[i].FormId == checkPointsDetails[j].FormId &&
                      listDataArr[i].ChecklistTemplateId ==
                        checkPointsDetails[j].ChecklistTemplateId &&
                      listDataArr[i].ParentId ==
                        checkPointsDetails[j].ParentId
                    ) {
                      {
                        // //console.log(checkPointsDetails[j], 'LIST===>');
                      }

                      //console.log(checkPointsDetails[j], 'LISTDATAFINAL');
                      listDataArr[i] = {
                        ParentId: listDataArr[i].ParentId,
                        FormId: listDataArr[i].FormId,
                        Attachment: checkPointsDetails[j].Attachment,
                        AttachmentList: checkPointsDetails[j].AttachmentList,
                        File: checkPointsDetails[j].File,
                        FileName: checkPointsDetails[j].FileName,
                        FileType: checkPointsDetails[j].FileType,
                        Remark: checkPointsDetails[j].Remark,
                        ParamMode: checkPointsDetails[j].ParamMode,
                        IsNCAllowed: checkPointsDetails[j].IsNCAllowed,
                        IsCorrect: checkPointsDetails[j].IsCorrect,
                        RadioValue: checkPointsDetails[j].RadioValue,
                        Correction:
                          checkPointsDetails[j].Correction == ''
                            ? 0
                            : checkPointsDetails[j].Correction,
                        Approach: listDataArr[i].Approach,
                        ApproachId: checkPointsDetails[j].ApproachId,
                        Score: checkPointsDetails[j].Score,
                        Scoretext: checkPointsDetails[j].Scoretext,
                        show_nc_ofi_status: checkPointsDetails[j].show_nc_ofi_status,
                        IsComplete: checkPointsDetails[j]?.IsComplete,
                        RemarkforNc: checkPointsDetails[j].RemarkforNc,
                        AttachforOfi: checkPointsDetails[j].AttachforOfi,
                        RemarkforOfi: checkPointsDetails[j].RemarkforOfi,
                        //getting extra
                        AttachforComp: listDataArr[i].AttachforComp,
                        AttachforNc: checkPointsDetails[j].AttachforNc,
                        Modified: checkPointsDetails[j].Modified,
                        AuditId: checkPointsDetails[j].AuditId,
                        ChecklistName: listDataArr[i].ChecklistName,
                        // MandatoryCount: listDataArr[i].MandatoryCount,
                        ChecklistTemplateId:
                          listDataArr[i].ChecklistTemplateId,
                        CompLevelId: listDataArr[i].CompLevelId,
                        LogicFormulae: listDataArr[i].LogicFormulae,
                        Maxscore: listDataArr[i].Maxscore,
                        MinScore: listDataArr[i].MinScore,
                        NeedScore: listDataArr[i].NeedScore,
                        ScoreType: listDataArr[i].ScoreType,
                        isScoreValid: checkPointsDetails[j].isScoreValid,
                        scoreInvalidMsg:
                          checkPointsDetails[j].scoreInvalidMsg,
                        immediateAction:
                          checkPointsDetails[j].immediateAction,
                        FailureCategoryId:
                          checkPointsDetails[j].FailureCategoryId,
                        FailureReasonId:
                          checkPointsDetails[j].FailureReasonId,
                        // FileContent:checkPointsDetails[j].FileContent
                        deleteallattachment:
                          listDataArr[i]?.deleteallattachment,
                      };
                    }
                  }
                }

                //console.log(listDataArr, 'listdataarray/venkat');

                console.log(
                  'ModifiedData',
                  listDataArr,
                  auditRecordsOrg[p],
                  checkPointsDetails,
                  this.props.navigation.state.params,
                );
                // let newArray = [];
                let AuditCheckpointDetailList = listDataArr;
                console.log('AuditCheckpointDetailList**********',AuditCheckpointDetailList);
                
                let FailureCategoryList =
                  auditRecordsOrg[p].CheckpointLogic.FailureCategory;
                let FailureReasonList =
                  auditRecordsOrg[p].CheckpointLogic.FailureReason;
                let ImmediateActionList =
                  auditRecordsOrg[p].CheckpointLogic.ImmediateAction;
                let LPAApproachList =
                  auditRecordsOrg[p].CheckpointLogic.LPAApproach;
                let ScoreTypeList =
                  auditRecordsOrg[p].CheckpointLogic.ScoreType;
                let newArray = {
                  AuditCheckpointDetail: AuditCheckpointDetailList,
                  FailureCategory: FailureCategoryList,
                  FailureReason: FailureReasonList,
                  ImmediateAction: ImmediateActionList,
                  LPAApproach: LPAApproachList,
                  ScoreType: ScoreTypeList,
                };
                console.log('newArray************',newArray);
                
                this.setState({
                  newArrayState: newArray,
                });

                const filteredArr = listDataArr.reduce((acc, current) => {
                  const x = acc.find(
                    item =>
                      item.ChecklistTemplateId ===
                      current.ChecklistTemplateId,
                  );
                  if (!x) {
                    return acc.concat([current]);
                  } else {
                    return acc;
                  }
                }, []);

                //console.log('enteringauditone', newArray);
                //console.log('enteringauditone', auditRecordsOrg[p]);
                console.log(
                  'FormID===>',
                  this.props.navigation.state.params.FormIdNavigate,
                );
                //Assign Empty checkpoints to Store
                let checklistpropdata = [];

                for (
                  let m = 0;
                  m < auditRecordsOrg[p].CheckListPropData.length;
                  m++
                ) {
                  let chckpropdata = auditRecordsOrg[p].CheckListPropData[m];
                  let ChecklistTemplateId = chckpropdata.ChecklistTemplateId;
                  let FormId = chckpropdata.FormId;
                  let ParentId = chckpropdata.ParentId;

                  if (chckpropdata.CompLevelId === 3) {
                    let emptycount = listDataArr.filter(
                      item =>
                        item.FormId === FormId &&
                        item.ParentId.toString() === ChecklistTemplateId &&
                        item.Score === '-2',
                    );
                    //console.log('Empty Count', emptycount);
                    checklistpropdata.push({
                      ...chckpropdata,
                      MandatoryCount: emptycount.length,
                    });
                  } else {
                    checklistpropdata.push({...chckpropdata});
                  }
                }

                // console.log(
                //   'Empty Count:checklistpropdata',
                //   checklistpropdata,
                // );

                // let delattach = auditRecordsOrg[p].deleteallattachment;
                // delattach = delattach == undefined || delattach == null || delattach == '1' ? '|' : delattach + '|';
                // if (delattach.indexOf('|'+formid+'~') > 0){

                // }
                // delattach = delattach +  auditRecordsOrg[p].FormId == formid ? auditRecordsOrg[p].FormId + '~' +this.state.deleteallattachment : auditRecordsOrg[p].FormId + '~0';
                auditRecords.push({
                  AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
                  FormId: auditRecordsOrg[p].FormId,
                  AuditId: auditRecordsOrg[p].AuditId,
                  AuditOrderId: auditRecordsOrg[p].AuditOrderId,
                  AuditProgramId: auditRecordsOrg[p].AuditProgramId,
                  AuditTypeId: auditRecordsOrg[p].AuditTypeId,
                  SiteId: auditRecordsOrg[p].SiteId,
                  Status: auditRecordsOrg[p].Status,
                  RadioValue: auditRecordsOrg[p].RadioValue,
                  AssignedTaskRoutes: auditRecordsOrg[p].AssignedTaskRoutes,
                  AssociatesName: auditRecordsOrg[p].AssociatesName,
                  AuditConductedByName:
                    auditRecordsOrg[p].AuditConductedByName,
                  AuditCycleCode: auditRecordsOrg[p].AuditCycleCode,
                  AuditCycleName: auditRecordsOrg[p].AuditCycleName,
                  AuditNumber: auditRecordsOrg[p].AuditNumber,
                  AuditProgOrder: auditRecordsOrg[p].AuditProgOrder,
                  AuditProgramName: auditRecordsOrg[p].AuditProgramName,
                  AuditTemplateId: auditRecordsOrg[p].AuditTemplateId,
                  AuditTemplateName: auditRecordsOrg[p].AuditTemplateName,
                  AuditTypeName: auditRecordsOrg[p].AuditTypeName,
                  Auditee: auditRecordsOrg[p].Auditee,
                  AuditeeContactPersonName:
                    auditRecordsOrg[p].AuditeeContactPersonName,
                  AuditorName: auditRecordsOrg[p].AuditorName,
                  CycleShortName: auditRecordsOrg[p].CycleShortName,
                  EndDate: auditRecordsOrg[p].EndDate,
                  Formname: auditRecordsOrg[p].Formname,
                  Formtype: auditRecordsOrg[p].Formtype,
                  LeadAuditor: auditRecordsOrg[p].LeadAuditor,
                  ProcessCategorysName:
                    auditRecordsOrg[p].ProcessCategorysName,
                  ProcessGroupsName: auditRecordsOrg[p].ProcessGroupsName,
                  ProcessScopeName: auditRecordsOrg[p].ProcessScopeName,
                  SchedulerName: auditRecordsOrg[p].SchedulerName,
                  StartDate: auditRecordsOrg[p].StartDate,
                  Listdata: listDataArr,
                  Formdata: auditRecordsOrg[p].Formdata,
                  CheckListPropData: auditRecordsOrg[p].CheckListPropData,
                  CheckpointLogic: auditRecordsOrg[p].CheckpointLogic,
                  CheckpointLogicarray: newArray,
                  DropDownProps: auditRecordsOrg[p].DropDownProps,
                  NCdetailsprops: auditRecordsOrg[p].NCdetailsprops,
                  UserId: auditRecordsOrg[p].UserId,
                  FromDocPro: auditRecordsOrg[p].FromDocPro,
                  DocumentId: auditRecordsOrg[p].DocumentId,
                  DocRevNo: auditRecordsOrg[p].DocRevNo,
                  AuditRecordStatus: AuditRecordStatus,
                  AuditResults: auditRecordsOrg[p].AuditResults,
                  AuditProcessList: auditRecordsOrg[p].AuditProcessList,
                  PerformStarted: auditRecordsOrg[p].PerformStarted,
                });
                //console.log(auditRecords, 'auditrecordsview');
                // console.log(
                //   'ModifiedData===>',
                //   listDataArr,
                //   auditRecordsOrg[p],
                //   checkPointsDetails,
                //   this.props.navigation.state.params.FormIdNavigate,
                // );
                console.log('checke***************',auditRecords);

              } else {
                //console.log('enteringaudittwo');
                auditRecords.push(auditRecordsOrg[p]);
                console.log('checkelsepintjrjj***************');
                
              }
            }

            // Store audit list in redux store to set it in persistant storage
            //auditRecords = mapListToCheckPointDetail(auditRecords);
            this.props.storeAuditRecords(auditRecords);
            //console.log('AE===>AE===>AE===>AE===>', auditRecords);
            // Audit process started, So we are marking isAuditing flag as true
            this.props.changeAuditState(true);

            // Update audit status in the audit list
            var auditListOrg = this.props.data.audits.auditRecords;
            var auditList = [];

            for (var i = 0; i < auditListOrg.length; i++) {
              var auditStatus = auditListOrg[i].cStatus;
              var auditColor = auditListOrg[i].color;

              if (
                parseInt(auditListOrg[i].AuditId) ==
                parseInt(this.state.auditId)
              ) {
                if (auditListOrg[i].AuditStatus != 3) {
                  auditStatus = constant.StatusNotSynced;
                }
              }

              // Set Audit Card color by checking its Status
              switch (auditStatus) {
                case constant.StatusScheduled:
                  auditColor = '#F1EB0E';
                  break;
                case constant.StatusDownloaded:
                  auditColor = '#cd8cff';
                  break;
                case constant.StatusNotSynced:
                  auditColor = '#2ec3c7';
                  break;
                case constant.StatusProcessing:
                  auditColor = '#e88316';
                  break;
                case constant.StatusSynced:
                  auditColor = '#48bcf7';
                  break;
                case constant.Completed:
                  auditColor = 'green';
                  break;
                case constant.StatusCompleted:
                  auditColor = 'black';
                  break;
                case constant.StatusDV:
                  auditColor = 'red';
                  break;
                case constant.StatusDVC:
                  auditColor = 'green';
                  break;
                default:
                  auditColor = '#2db816';
                  break;
              }

              auditList.push({
                ActualAudit: auditListOrg[i].ActualAudit,
                ActualAuditId: auditListOrg[i].ActualAuditId,
                ActualAuditOrderNo: auditListOrg[i].ActualAuditOrderNo,
                AssociatesName: auditListOrg[i].AssociatesName,
                AuditConductedByName: auditListOrg[i].AuditConductedByName,
                AuditCycleName: auditListOrg[i].AuditCycleName,
                AuditNumber: auditListOrg[i].AuditNumber,
                AuditPeriodId: auditListOrg[i].AuditPeriodId,
                AuditProgramId: auditListOrg[i].AuditProgramId,
                AuditProgramName: auditListOrg[i].AuditProgramName,
                AuditStatus: auditListOrg[i].AuditStatus,
                AuditTemplateId: auditListOrg[i].AuditTemplateId,
                AuditTypeId: auditListOrg[i].AuditTypeId,
                AuditTypeName: auditListOrg[i].AuditTypeName,
                Auditee: auditListOrg[i].Auditee,
                EndDate: auditListOrg[i].EndDate,
                EntityId: auditListOrg[i].EntityId,
                LeadAuditor: auditListOrg[i].LeadAuditor,
                ProcessScopeName: auditListOrg[i].ProcessScopeName,
                SchedulerName: auditListOrg[i].SchedulerName,
                SiteId: auditListOrg[i].SiteId,
                StartDate: auditListOrg[i].StartDate,
                cStatus: auditStatus,
                color: auditColor,
                key: auditListOrg[i].key,
              });
            }

            this.props.storeAudits(auditList);

            var cameraCapture = [];
            this.props.storeCameraCapture(cameraCapture);
            this.refs.toast.show(strings.CheckpointSave, 7000);

            setTimeout(() => {
              //  //console.log('AuditDashBody Props After Props Changing...', this.props)
              var auditRecords = this.props.data.audits.auditRecords;
              var checkPoints = null;
              for (var i = 0; i < auditRecords.length; i++) {
                if (
                  auditRecords?.[i]?.AuditId ==
                  this.props.navigation.state.params.AuditID
                ) {
                  if (auditRecords?.[i]?.Listdata)
                    checkPoints = auditRecords?.[i]?.Listdata;
                }
              }

              this.setState(
                {
                  checkPointsValues: checkPoints,
                  isSaving: false,
                  isUnsavedData: false,
                  isContentLoaded: false,
                },
                () => {
                  // this.refs.toast.show(strings.CheckpointSave, 5000);
                  if (this.state.go_home) {
                    this.props.navigation.navigate('AuditDashboard');
                    this.getTotalNCStatus();
                  } else {
                    //console.log('goBack3');
                    this.props.navigation.goBack();
                    this.getTotalNCStatus();
                  }
                },
              );
              //console.log('enteringtoast');
              // alert('saved');
            }, 200);
            this.setState({isSaving: false}, () => {
              //console.log('Loader off');
            });
          },
        );
      }

      // })
      // } else {
      //  this.setState({ isContentLoaded: false });
      //  alert("Please Answer Minimum Number of Questions");
      //  }
    },
  );
};

  async getTotalNCStatus() {
    //console.log('enteringtotalnc');
    var checkNC = this.props.data.audits.ncofiRecords;
    var TotalNCValue = 0;

    for (var i = 0; i < checkNC.length; i++) {
      for (var j = 0; j < checkNC[i].Uploaded.length; j++) {
        if (checkNC[i].Uploaded[j].CheckNC == 0) {
          TotalNCValue++;
        }
      }
      for (var k = 0; k < checkNC[i].Pending.length; k++) {
        if (checkNC[i].Pending[k].Category == 'NC') {
          TotalNCValue++;
        }
      }
    }
    ////console.log(TotalNCValue, 'TotalNCValuelocal');
    await AsyncStorage.setItem('TotalNCValues', JSON.stringyfy(TotalNCValue));
  }

  popupModal(checkPointDetail,checklist) {
    //console.log('detailsfornc/ofi', checkPointDetail);
    //console.log('nc ofi status:' + checkPointDetail?.show_nc_ofi_status);
    //console.log('Radio value in state:' + checkPointDetail.RadioValue);
    console.log(
      'checkPointDetailpopup' ,
        checkPointDetail,
    );
    console.log(
      'checklistpopup' ,
      checklist
    );
    
    if (checkPointDetail.Score == '0'){
      checkPointDetail.show_nc_ofi_status = 1
    }
    if (checkPointDetail.Score == '1'){
      checkPointDetail.show_nc_ofi_status = 3
    }
    console.log(
      'checkPointDetailpopup2222' ,
        checkPointDetail,
    );
    this.setState(
      {
        dialogVisibleNC: true,
        isNCAllowed: checkPointDetail.IsNCAllowed,
        ncofiPassAuditId: checkPointDetail.AuditId,
        ncofiPassTemplateId: checkPointDetail.ChecklistTemplateId,
        Status_nc_ofi: checkPointDetail.show_nc_ofi_status,
        radiovalue_ncofi: checkPointDetail.RadioValue,
        current_nc_ofi_count: this.props.data.audits,
        // checklistName: this.state.checklistName,
      },
      () => {
        // //console.log('NC/OFI pressed',this.state.dialogVisibleNC)
        // //console.log('IsNCAllowed',this.state.isNCAllowed)
        //console.log('checking Details::::----', this.state.radiovalue_ncofi);
        console.log(
          'checking Details::::----Status_nc_ofi',
          this.state.Status_nc_ofi,
        );
      },
    );
  }

  openAttachmentImage = (item, index) => {
    //console.log(index, 'indexvalue');
    //console.log(item, 'cattachdata');

    this.setState(
      {
        cAttachData: 'file://' + item.FileUri, // finalpath,
        cAttachType: item.FileType,
        dialogVisibleAttach: true,
      },
      () => {
        //console.log('cAttachDatavalue', this.state.cAttachData);
        //console.log('cAttachType' + this.state.cAttachType);
      },
    );
  };

  openAttachmentVideo = (item, index) => {
    //console.log(index, 'indexvalue');
    //console.log(item, 'cattachdata');

    this.setState(
      {
        cAttachData: 'file:/' + item.File, // finalpath,
        cAttachType: item.FileType,
        dialogVisibleVideo: true,
      },
      () => {
        //console.log('cAttachDatavalue', this.state.cAttachData);
        //console.log('cAttachType', this.state.cAttachType);
      },
    );
  };

  openAttachmentFile = (item, index) => {
    //console.log(index, 'indexvalue');
    //console.log(item, 'cattachdata');

    const path = FileViewer.open('file://' + item.FileUri) // absolute-path-to-my-local-file.
      .then(() => {
        //console.log('file opened');
      })
      .catch(err => {
        //console.log('file opened error', err);
      });
  };

  markStatus = items => {
    var checkPointsDetails = this.state.checkPointsDetails;
    //console.log('markStatus', items);
    //console.log('checkPointsDetails', checkPointsDetails);
    for (var i = 0; i < checkPointsDetails.length; i++) {
      if (
        items.ChecklistTemplateId == checkPointsDetails[i].ChecklistTemplateId
      ) {
        //console.log('hello');
        if (parseInt(items.correctAnswer) == checkPointsDetails[i].RadioValue) {
          //console.log('correct answer');
        } else {
          //console.log('wrong  answer');
        }
      }
    }
  };

  removeAttachment = (index, attach, cpIndex) => {
    //** Delete file from ios  files folder */

    //console.log('one:removeattach', attach, this.state.checkPointsDetails);
    let FilesPath =
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    //console.log('FilesPath--->', FilesPath);

    var checkPointsDetails = this.state.checkPointsDetails;
    for (var j = 0; j < checkPointsDetails.length; j++) {
      // let index = checkPointsDetails[j].AttachmentList.indexOf(attach);
      // if (index === -1) {
      //   continue;
      // }
      let attachment = checkPointsDetails[j].AttachmentList.filter(
        item => item.id === attach.id,
      );
      //console.log('one:removeattach>findattachment', attachment, index);
      if (attachment.length == 0) {
        continue;
      }
      if (attach.id == attachment[0].id) {
        checkPointsDetails[j].Modified = true;
        if (RNFetchBlob.fs.isDir(FilesPath)) {
          RNFetchBlob.fs
            .unlink(attach.FileUri)
            .then(() => {
              //console.log('one:Attachment:Files deleted successfully--->');
              var newAttachmentList = checkPointsDetails[
                j
              ].AttachmentList.filter(item => item.id !== attachment[0].id);
              checkPointsDetails[j].AttachmentList = newAttachmentList;
              this.setState(
                {
                  CheckAttach: false,
                  checkPointsDetails: checkPointsDetails,
                  isUnsavedData: true,
                },
                () => {
                  console.log(
                    'one:Attachment: delete attachment checkpoint--->',
                    this.state.checkPointsDetails,
                  );
                  this.refs.toast.show('Attachment deleted successfully.', 100);
                  this.countStatistics(this.state.checkPointsDetails);
                  this.props.storeCameraCapture([]);
                  this.renderAttachment(0);
                  // //console.log('checkPointsDetails', this.state.checkPointsDetails)
                },
              );
            })
            .catch(err => {
              //this.refs.toast.show('Attachment deleted successgully.', DURATION.LENGTH_LONG);
              //console.log('one:Attachment:Files not deleted successfully--->');
            });
        }
        break;
      }
    }
  };

  chooseCameraOption = (item, index) => {
    const checkpoint = this.state.checkPointsDetails[index];
    const attachment = checkpoint.AttachmentList.filter(
      checks => checks.Attachment === 'EMPTY',
    );

    if (attachment.length > 0) {
      this.downloadFile(attachment[0]);
      this.refs.toast.show(
        'Downloading the attachments...',
        DURATION.LENGTH_LONG,
      );
    }
    this.setState(
      {
        dialogVisibleCamera: true,
        attachSelectedItem: item,
      },
      () => {
        //console.log('attachSelectedItem', item);
      },
    );
  };

  navigateTo(id) {
    //console.log('navigation route', id);
    //console.log('ncofiRecords ---->', this.props.data.audits.ncofiRecords);
    var NCrecords = this.props.data.audits.ncofiRecords;
    var pendingList = null;
    var uploadedList = null;
    var isNCOFIExists = false;
    var isUploaded = false;
    var data = null;
    const selectedChecklist = this.state.selectedindex;
    console.log('selecteddncvaluescheckkkkkkk',NCrecords);
    console.log(
      'selectedindexnnamecheckkkkkkkkk',
      selectedChecklist,
      this.state.selectedindex.ChecklistName,
      this.state.selectedindex.ChecklistTemplateId,
      this.state.selectedindex.ActualIndex,
      this.state.selectedindex.AuditId,
      this.state.selectedindex.FormID
    );

    // const selectedChecklist =
    //   this.props.data.audits.auditRecords[0].CheckListPropData[this.state.selectedindex].ChecklistName

    // //console.log(selectedChecklist,"")
    // //console.log(this.props.data.audiselectedcheckts.auditRecords[0].CheckListPropData,"selectedcheck1");

    this.setState({
      selectedChecklistName: selectedChecklist.ChecklistName,
    });

    for (var i = 0; i < NCrecords.length; i++) {
      if (NCrecords[i].AuditID == this.state.auditId) {
        pendingList = NCrecords[i].Pending;
        uploadedList = NCrecords[i].Uploaded;
      }
    }
    //console.log(this.state.auditId, 'Audot');
    if (pendingList) {
      //console.log('entering NC?OFI');
      for (var i = 0; i < pendingList.length; i++) {
        //console.log(i, 'pend====>');
        if (
          pendingList[i].AuditID == this.state.ncofiPassAuditId &&
          pendingList[i].ChecklistTemplateId ==
            this.state.ncofiPassTemplateId &&
          pendingList[i].Category == id
        ) {
          isNCOFIExists = true;
          isUploaded = false;
          data = pendingList[i];
        }
      }
    }
    if (data == null && uploadedList) {
      var checkNC = 0;
      var maxOrder = 0;
      var recordIndex = 0;

      if (id == 'OFI') {
        checkNC = 1;
      }
      //console.log('Venkat entering OFI 1');

      for (var i = 0; i < uploadedList.length; i++) {
        if (
          uploadedList[i].ChecklistTemplateId ==
            this.state.ncofiPassTemplateId &&
          uploadedList[i].CheckNC == checkNC
        ) {
          isNCOFIExists = true;
          isUploaded = true;
          if (maxOrder < uploadedList[i].CorrectiveOrder) {
            maxOrder = uploadedList[i].CorrectiveOrder;
            recordIndex = i;
          } else if (maxOrder == 0 && recordIndex == 0 && i > 0) {
            maxOrder = uploadedList[i].CorrectiveOrder;
            recordIndex = i;
          }
        }
        console.log('checkkthemaxorderlog',maxOrder);
        
      }

      if (isNCOFIExists) {
        var uploadedData = uploadedList[recordIndex];
        var selectedItems =
          uploadedData.ElementId == '0'
            ? []
            : uploadedData.ElementId
            ? uploadedData.ElementId.split(',')
            : [];
        var selectedItemsProcess =
          uploadedData.ProcesssId == '0'
            ? []
            : uploadedData.ProcesssId
            ? uploadedData.ProcesssId.split(',')
            : [];
        var changetoInt = selectedItemsProcess;
        var IntArr = [];
        for (var i = 0; i < changetoInt.length; i++) {
          IntArr.push(parseInt(changetoInt[i]));
        }
        var selectedProcess = uploadedData.ProcesssId ? IntArr : [];
        var auditRecords = this.props.data.audits.auditRecords;
        var categoryObj = null;
        var requestObj = null;
        var userObj = null;
        var departmentObj = null;
        var requirementStr = '';

        for (var i = 0; i < auditRecords.length; i++) {
          if (this.state.ncofiPassAuditId == auditRecords?.[i]?.AuditId) {
            var dropdowns = auditRecords?.[i]?.DropDownProps;
            // Requirements
            for (var j = 0; j < dropdowns.ClauseList.length; j++) {
              for (var k = 0; k < selectedItems.length; k++) {
                if (selectedItems[k] == dropdowns.ClauseList[j].id) {
                  requirementStr =
                    requirementStr + dropdowns.ClauseList[j].Requirement;
                }
              }
            }
            // Category
            if (uploadedData.CategoryId) {
              for (var j = 0; j < dropdowns.Category.length; j++) {
                if (
                  uploadedData.CategoryId == dropdowns.Category[j].CategoryId
                ) {
                  categoryObj = {
                    id: dropdowns.Category[j].CategoryId,
                    value: dropdowns.Category[j].CategoryName,
                  };
                  break;
                }
              }
            }
            // User - Responsibility
            if (uploadedData.RequestedByID) {
              for (var j = 0; j < dropdowns.Users.length; j++) {
                if (uploadedData.RequestedByID == dropdowns.Users[j].userid) {
                  requestObj = {
                    id: dropdowns.Users[j].userid,
                    value: dropdowns.Users[j].Name,
                  };
                  break;
                }
              }
            }
            // Requested by
            if (uploadedData.ResponsibilityId) {
              for (var j = 0; j < dropdowns.RequestBy.length; j++) {
                if (
                  uploadedData.ResponsibilityId ==
                  dropdowns.RequestBy[j].AuditeeContactPersonId
                ) {
                  userObj = {
                    id: dropdowns.RequestBy[j].AuditeeContactPersonId,
                    value: dropdowns.RequestBy[j].AuditeeContactPersonName,
                  };
                  break;
                }
              }
            }
            // Department
            if (uploadedData.DepartmentId) {
              for (var j = 0; j < dropdowns.Department.length; j++) {
                if (
                  uploadedData.DepartmentId ==
                  dropdowns.Department[j].DepartmentId
                ) {
                  departmentObj = {
                    id: dropdowns.Department[j].DepartmentId,
                    value: dropdowns.Department[j].DepartmentName,
                  };
                  break;
                }
              }
            }
          }
        }

        data = {
          requiretext: requirementStr,
          OFI: checkNC == 1 ? uploadedData.NonConfirmity : '',
          categoryDrop: categoryObj,
          userDrop: userObj,
          requestDrop: requestObj,
          deptDrop: departmentObj,
          filename: uploadedData.FileName,
          filedata: '',
          AuditID: this.state.ncofiPassAuditId,
          AuditOrder: this.state.AuditOrder,
          ChecklistID: this.state.raiseID.ChecklistID,
          Formid: this.state.raiseID.Formid,
          SiteID: this.state.raiseID.SiteID,
          auditstatus: this.state.raiseID.auditstatus,
          title: this.state.raiseID.title,
          NCNumber: this.state.raiseID.AUDIT_NO+'-'+id+'-'+maxOrder,
          Category: id,
          NonConfirmity: uploadedData.NonConfirmity,
          uniqueNCkey: Moment().unix(),
          selectedItems: selectedItems,
          ResponsibilityUser:userObj,
          selectedItemsProcess: selectedProcess,
          ChecklistTemplateId: uploadedData.ChecklistTemplateId,
          ncIdentifier: uploadedData.NCIdentifier,
          objEvidence: uploadedData.ObjectiveEvidence,
          recommAction: uploadedData.RecommendedAction,
        };
      }
      if(maxOrder == 0){
        AsyncStorage.setItem('ncNumberUpdate',this.state.raiseID.AUDIT_NO);
      }else{
        AsyncStorage.setItem('ncNumberUpdate',this.state.raiseID.AUDIT_NO+'-'+id+'-'+maxOrder);
      }
    }
    console.log('CheckPoint2>Odata', data);
    if (isNCOFIExists) {
      console.log('Venkat Entering NC 1');
      if (id == 'NC') {
        this.setState({dialogVisibleNC: false});
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'NC',
          AuditID: this.state.auditId,
          name: 1,
          NCOFIDetails: {
            AuditID: this.state.auditId,
            AuditOrder: this.state.AUDITYPE_ORDER,
            Title: 'order by FormName asc',
            auditstatus: this.state.raiseID.auditstatus,
            SiteID: this.state.raiseID.SiteID,
            Formid: this.state.ncFormID,
            ChecklistID: this.state.checklistID,
            AUDIT_NO: this.state.raiseID.AUDIT_NO,
            breadCrumb: this.state.Auditee,
            ResponsibilityUser: this.state.ResponsibilityUser,
            SiteId: this.state.raiseID.SiteID,
            RequestedBy: '',
            FailureCategoryId: '',
            DocumentRef: '',
            ProcessID: '',
            Conformance: '',
            navigationfrom: 'checkpointDemo',
          },
          Formid: this.state.ncFormID,
          navigationfrom: 'checkpointDemo',
          templateId: this.state.ncofiPassTemplateId,
          radiovalue: this.state.radiovalue_ncofi,
          checklistName: selectedChecklist.ChecklistName,
          type: 'EDIT',
          data: data,
          isUploaded: isUploaded,
        });
      }
      if (id == 'OFI') {
        console.log('Venkat Entering NC 2');

        this.setState({dialogVisibleNC: false});
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'OFI',
          name: 2,
          AuditID: this.state.raiseID.AUDIT_NO,
          NCOFIDetails: this.state.raiseID,
          templateId: this.state.ncofiPassTemplateId,
          type: 'EDIT',
          data: data,
          isUploaded: isUploaded,
          Formid: this.state.ncFormID,
          radiovalue: this.state.radiovalue_ncofi,
          checklistName: selectedChecklist.ChecklistName,
          navigationfrom: 'checkpointDemo',
        });
      }
    } else {
      if (id == 'NC') {
        console.log('Venkat Entering NC 3', this.state.raiseID);

        this.setState({dialogVisibleNC: false});
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'NC',
          NCOFIDetails: this.state.raiseID,
          name: 3,
          AuditID: this.state.auditId,
          templateId: this.state.ncofiPassTemplateId,
          type: 'ADD',
          data: null,
          isUploaded: isUploaded,
          Formid: this.state.ncFormID,
          radiovalue: this.state.radiovalue_ncofi,
          checklistName: selectedChecklist.ChecklistName,
          navigationfrom: 'checkpointDemo',
        });
      }
      if (id == 'OFI') {
        console.log('Venkat Entering NC 4');
        console.log(
          this.state.auditId,
          this.state.raiseID,
          this.state.ncofiPassTemplateId,
          this.state.ncAvailable_NC,
          this.state.ofiAvailable_OFI,
          'AuditID in entering 4',
        );
        this.setState({dialogVisibleNC: false});
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'OFI',
          NCOFIDetails: this.state.raiseID,
          name: 4,
          AuditID: this.state.auditId,
          templateId: this.state.ncofiPassTemplateId,
          type: 'ADD',
          data: null,
          isUploaded: isUploaded,
          Formid: this.state.ncFormID,
          radiovalue: this.state.radiovalue_ncofi,
          navigationfrom: 'checkpointDemo',
        });
      }
    }
  }

  clearNcCheckpoint = () => {
    this.setState({dialogVisibleNCR: false}, () => {
      var dupNCrecords = [];
      var NCrecords = this.props.data.audits.ncofiRecords;
      for (var i = 0; i < NCrecords.length; i++) {
        if (this.state.auditId == NCrecords[i].AuditID) {
          var pendingList = [];
          for (var j = 0; j < NCrecords[i].Pending.length; j++) {
            if (
              NCrecords[i].Pending[j].ChecklistTemplateId !=
              this.state.ncRemovalTemplateId
            ) {
              pendingList.push(NCrecords[i].Pending[j]);
            }
          }
          dupNCrecords.push({
            AuditID: NCrecords[i].AuditID,
            Uploaded: NCrecords[i].Uploaded,
            Pending: pendingList,
          });
        } else {
          dupNCrecords.push({
            AuditID: NCrecords[i].AuditID,
            Uploaded: NCrecords[i].Uploaded,
            Pending: NCrecords[i].Pending,
          });
        }
      }
      this.props.storeNCRecords(dupNCrecords);
      //console.log(this.props.storeNCRecords, 'storeNCRecords');
      this.refs.toast.show(strings.NCremoved, DURATION.LENGTH_LONG);
    });
  };

  cameraAction = type => {
    this.setState(
      {
        dialogVisibleCamera: false,
      },
      () => {
        if (type == 'Browse') {
          this.setState({
            isBrowse: true,
          });
        }
        if (type == 'Camera') {
          this.setState(
            {
              isAttachmentLoaded: false,
            },
            () => {
              this.props.navigation.navigate('CameraCapture');
            },
          );
        } else if (type == 'Video') {
          this.setState(
            {
              isAttachmentLoaded: false,
            },
            () => {
              this.props.navigation.navigate('VideoCapture', {
                ByScreen: 'CheckPointDemo',
              });
            },
          );
        } else {
          //console.log('Closing pop up first');
          setTimeout(() => {
            this.attachFiles();
          }, 500);
          // })
        }
      },
    );
  };

  isFailedCheckpoint = items => {
    var checkPointsDetails = this.state.checkPointsDetails;
    for (var i = 0; i < checkPointsDetails.length; i++) {
      if (
        checkPointsDetails[i].ChecklistTemplateId ==
          items.ChecklistTemplateId &&
        checkPointsDetails[i].RadioValue == 10
      ) {
        return true;
      }
    }
    return false;
  };

  checkFileAlreadyExist = (checkPointsDetails, items, response) => {
    for (var i = 0; i < checkPointsDetails.length; i++) {
      //console.log('one:third');
      //console.log('one:thirdentering', checkPointsDetails);
      if (
        checkPointsDetails[i].ChecklistTemplateId ==
          items.ChecklistTemplateId &&
        checkPointsDetails[i].FormId === items.FormID
      ) {
        var fileExist = checkPointsDetails[i].AttachmentList.filter(
          item => item.FileName === response.name,
        );
        if (fileExist.length > 0) return true;
      }
    }
    return false;
  };

  callAttach = (checkPointsDetails, items, finalpath, response) => {
    var sumArray = [];
    //console.log(checkPointsDetails.length, 'checkdlength');
    for (var i = 0; i < checkPointsDetails.length; i++) {
      //console.log('one:third');
      //console.log('one:thirdentering', checkPointsDetails);
      if (
        checkPointsDetails[i].ChecklistTemplateId ==
          items.ChecklistTemplateId &&
        checkPointsDetails[i].FormId === items.FormID
      ) {
        //console.log('one:third-in loop');
        let AttachmentList = [...checkPointsDetails[i].AttachmentList];

        AttachmentList.push({
          id: Moment().unix() + '_' + i,
          Attachment: 'Browse File Added', //response.name.replace(/ /g, '_'),
          AuditID: parseInt(this.state.auditId),
          ChecklistTemplateID: checkPointsDetails[i].ChecklistTemplateId,
          Docid: 0,
          FileName: response.name.replace(/ /g, '_'),
          FormId: items.FormID,
          FileUri:
            Platform.OS === 'ios' ? decodeURIComponent(finalpath) : finalpath,
          FileType: response.type,
          FileSize: response.size,
        });
        //console.log('one:third-in-out loop');
        checkPointsDetails[i].Attachment = ''; //response.name.replace(/ /g, '_');
        checkPointsDetails[i].File = ''; //Platform.OS === 'ios' ? decodeURIComponent(finalpath) : finalpath;
        checkPointsDetails[i].FileSize = ''; //response.size;
        checkPointsDetails[i].FileName = ''; //response.name.replace(/ /g, '_');
        checkPointsDetails[i].FileType = ''; //response.type;
        checkPointsDetails[i].Modified = true;
        //console.log('one:third-in-out loop', checkPointsDetails[i]);
        checkPointsDetails[i].AttachmentList = AttachmentList;
      }
    }
    this.setState(
      {
        CheckAttach: true,
        checkPointsDetails: checkPointsDetails,
        isUnsavedData: true,
        isAttachmentLoaded: true,
      },
      () => {
        this.countStatistics(this.state.checkPointsDetails);
        for (var i = 0; i < this.state.checkPointsDetails.length; i++) {
          sumArray.push(this.state.checkPointsDetails[i].FileSize);
        }
        this.setState(
          {
            sumFileSizearray: sumArray,
          },
          () => {
            //console.log(this.state.sumFileSizearray, 'sumFileSizearray');
            this.sumFileSize();
          },
        );
      },
    );
  };

  getVideoMetaData = async filePath => {
    const metaData = await getVideoMetaData(filePath);
    metaData.then(res => {
      return res;
    });
  };

  doCompressImage = async fileRes => {
    //console.log('one:first-6', fileRes);
    return new Promise((resolve, reject) => {
      try {
        const result = compressImage
          .compress(fileRes, {
            compressionMethod: 'auto',
            input: 'base64',
            maxWidth: 1000,
            quality: 0.8,
            returnableOutputType: 'base64',
          })
          .then(res => {
            //console.log('one: Method - Compressed Image response');
            resolve(res);
          })
          .catch(err => {
            //console.log(err, 'one:doCompressImage');
            resolve(fileRes);
          });
      } catch (err) {
        //console.log('one:compres Image Method Error', err);
        resolve(fileRes);
      }
    });
  };

  doCompress = async response => {
    let FilesPath =
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    const fileuri =
      Platform.OS == 'ios'
        ? decodeURIComponent(response.uri.slice(6))
        : response.uri;
    var fileName =
      'file_' +
      Moment().unix() +
      '.' +
      response.name.substring(response.name.lastIndexOf('.') + 1);
    let finalpath = '/' + FilesPath + '/' + fileName.replace(/ /g, '_');
    //console.log('fileuri', fileuri);
    //console.log(fileuri, '-Attachment:fileuri');
    //console.log('one:first-1');
    if (response.size > 5000000) {
      alert('You can"t upload files more than 5 MB');
      resolve('');
    } else if (response.size < 5000000) {
      //console.log('one:first-2');
      //console.log(response, 'Attachment: below 5MB');
      return new Promise((resolve, reject) => {
        //console.log('one:first-3');
        var data = RNFS.readFile(fileuri, 'base64').then(res => {
          //console.log('one:first-4');
          //console.log('response===>', res);
          if (response.type.indexOf('image') >= 0) {
            //console.log('one:first-5 Image Type');
            this.doCompressImage(res).then(res => {
              //console.log('one:first-Compressed');
              RNFetchBlob.fs
                .writeFile(finalpath, res, 'base64')
                .then(res => {
                  //console.log('one:first-6 Image File Written', finalpath);
                  resolve(finalpath);
                })
                .catch(err => {
                  //console.log(err, 'one:errorin_writefile');
                });
            });
          } else if (response.type.indexOf('video') >= 0) {
            //console.log('one:first-5 Video Type');
            RNFetchBlob.fs
              .writeFile(finalpath, res, 'base64')
              .then(res => {
                //console.log('one:first-6 Video File Written', finalpath, res);
                this.doCompressVideo(finalpath).then(res => {
                  resolve(res);
                });
              })
              .catch(err => {
                //console.log(err, 'one:errorin_writefile');
              });
          } else {
            RNFetchBlob.fs
              .writeFile(finalpath, res, 'base64')
              .then(res => {
                resolve(finalpath);
              })
              .catch(err => {
                //console.log(err, 'one:errorin_writefile');
                reject(err);
              });
          }
        });
      });
    }
  };

  doCompressVideo = async uri => {
    if (!uri) return;

    //console.log('one:first-7 - Inside Compress video method');
    return new Promise((resolve, reject) => {
      try {
        const result = compressVideo.compress(
          'file:/' + uri,
          {
            compressionMethod: 'auto',
            minimumFileSizeForCompress: 0,
          },
          progress => {
            //console.log('Compression Progress: ', progress);
          },
        );
        result.then(path => {
          //console.log('one:first-8 Method Compressed Video', path);
          RNFetchBlob.fs
            .writeFile(uri, path, 'uri')
            .then(res => {
              //console.log('one:Video writefile', res);
              resolve(uri);
            })
            .catch(err => {
              //console.log(err, 'one:errorin_writefile');
              resolve(uri);
            });
        });
      } catch (error) {
        //console.log({error}, 'compression error');
        reject(err);
      }
    });
  };

  attachFiles = async () => {
    var items = this.state.attachSelectedItem;
    var checkPointsDetails = this.state.checkPointsDetails;
    //console.log(items, '"Items==>"');
    var sumArray = [];
    var fileuri = '';
    var finalpath = '';
    let FilesPath =
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    //console.log('one:FilesPath--->', FilesPath);
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        allowMultiSelection: finalPropsSelectorFactory,
      });
      //console.log('one:DocumentPicker:', response);
      if (response) {
        //console.log('one:first');
        if (
          this.checkFileAlreadyExist(checkPointsDetails, items, response) ===
          true
        ) {
          this.setState(
            {
              CheckAttach: false,
              checkPointsDetails: checkPointsDetails,
              isUnsavedData: false,
              isAttachmentLoaded: true,
            },
            () => {
              alert('File already Exist, Kindly add a different file');
            },
          );
          return;
        }
        this.setState(
          {
            isAttachmentLoaded: false,
          },
          () => {
            this.doCompress(response).then(finalpath => {
              if (finalpath === '') {
                this.setState(
                  {
                    CheckAttach: true,
                    checkPointsDetails: checkPointsDetails,
                    isUnsavedData: true,
                    isAttachmentLoaded: true,
                  },
                  () => {
                    return;
                  },
                );
              }
              //console.log('one:Compression Done', finalpath);
              this.callAttach(checkPointsDetails, items, finalpath, response);
              //this.renderAttachment(index)
              //console.log('one:File added sucessfully');

              //console.log(items, '==>fileForm:');
              this.setState(
                {
                  CheckAttach: true,
                  checkPointsDetails: checkPointsDetails,
                  isUnsavedData: true,
                },
                () => {
                  this.countStatistics(this.state.checkPointsDetails);
                  for (
                    var i = 0;
                    i < this.state.checkPointsDetails.length;
                    i++
                  ) {
                    sumArray.push(this.state.checkPointsDetails[i].FileSize);
                  }
                  this.setState(
                    {
                      sumFileSizearray: sumArray,
                    },
                    () => {
                      console.log(
                        this.state.sumFileSizearray,
                        'sumFileSizearray',
                      );
                      this.sumFileSize();
                    },
                  );
                },
              );
            });
          },
        );
      }
    } catch (err) {
      //console.log(err, 'one:err');
    }
  };

  sumFileSize() {
    var sumarr = this.state.sumFileSizearray;
    let result = sumarr.reduce((a, b) => {
      return a + b;
    }, 0);
    this.setState(
      {
        totalFileSize: result,
      },
      () => {
        //console.log(this.state.totalFileSize, 'tofalfileseze');
      },
    );
  }

  clearCheckpoints = () => {
    this.setState(
      {isSaving: true, dialogVisibleReset: false, deleteallattachment: 1},
      () => {
        var checkPointsDetails = [];
        var index = 0;
        for (var i = 0; i < this.state.checkpointList.length; i++) {
          //console.log('13==>');
          //console.log('reset check', this.state.checkpointList);
          checkPointsDetails.push({
            AuditId: this.state.auditId,
            ChecklistTemplateId:
              this.state.checkpointList?.[i]?.ChecklistTemplateId,
            ParentId: this.state.checkpointList?.[i]?.ParentId,
            FormId: this.state.checkpointList?.[i]?.FormID,
            Score: '-2',
            Scoretext: '',
            IsComplete: '',
            Remark: '',
            RadioValue: 0,
            Correction: 0,
            Approach: '',
            ApproachId: '',
            ParamMode: 0,
            IsNCAllowed: 0,
            IsCorrect: -1,
            Attachment: '',
            AttachmentList: [],
            FileName: '',
            File: '',
            FileType: '',
            FileSize: 0,
            isScoreValid: true,
            scoreInvalidMsg: '',
            AttachforNc: this.state.checkpointList?.[i]?.AttachforNc,
            RemarkforNc: this.state.checkpointList?.[i]?.RemarkforNc,
            AttachforOfi: this.state.checkpointList?.[i]?.AttachforOfi,
            RemarkforOfi: this.state.checkpointList?.[i]?.RemarkforOfi,
            MandatoryCount: this.state.checkpointList?.[i]?.MandatoryCount,
            IsVeto: this.state.checkpointList?.[i]?.IsVeto,
            // immediateAction: this.state.checkpointList?.[i]?.immediateAction,
            immediateAction: '',
            Modified: true,
          });
        }
        this.setState(
          {
            checkPointsDetails: checkPointsDetails,
          },
          () => {
            //console.log('AFter reset', this.state.checkPointsDetails);
            setTimeout(() => {
              this.setState({isSaving: false, ActiveId: index});
              // this.countStatistics(this.state.checkPointsDetails)
            }, 200);
            this.refs.toast.show(
              strings.CheckpointClear,
              DURATION.LENGTH_SHORT,
            );
          },
        );
      },
    );
  };
  btnDatapress(index, item) {
    console.log("Button pressed for index:", index);
  
    const checkpoint = this.state.checkPointsDetails[index];
    const attachment = checkpoint.AttachmentList.filter(
      checks => checks.Attachment === 'EMPTY'
    );
  
    this.setState(
      {
        selectedindex: item,
        ActiveId: index,
        isCaroselLoaded: Platform.OS !== 'ios' ? false : this.state.isCaroselLoaded,
      },
      () => {
        if (attachment.length > 0) {
          this.downloadFile(attachment[0]);
          this.refs.toast.show(
            'Downloading the attachments...',
            DURATION.LENGTH_LONG
          );
        }
  
        // Carousel snapping logic
        if (Platform.OS !== 'ios') {
          setTimeout(() => {
            this.setState({ isCaroselLoaded: true }, () => {
              this._carousel.snapToItem(index, true);
            });
          }, 250);
        } else {
          this._carousel.snapToItem(index, true);
        }
      }
    );
  }
  

  btnData(index, item) {
    //console.log('index=====?', index);
    //console.log('item=====?', item);

    this.setState({selectedindex: item});
    if (Platform.OS == 'ios') {
      this.setState(
        {
          ActiveId: index,
        },

        () => {
          const checkpoint = this.state.checkPointsDetails[index];
          const attachment = checkpoint.AttachmentList.filter(
            checks => checks.Attachment === 'EMPTY',
          );

          if (attachment.length > 0) {
            this.downloadFile(attachment[0]);
            this.refs.toast.show(
              'Downloading the attachments...',
              DURATION.LENGTH_LONG,
            );
          }
          this._carousel.snapToItem(index, true);
        },
      );
    } else {
      this.setState(
        {
          ActiveId: index,
          isCaroselLoaded: false,
        },
        () =>
          setTimeout(() => {
            this.setState({isCaroselLoaded: true}, () => {
              const checkpoint = this.state.checkPointsDetails[index];

             // this.setOnLoadFailureReason(checkpoint);
             // this.setOnLoadRadioValue(checkpoint,item);
              const attachment = checkpoint.AttachmentList.filter(
                checks => checks.Attachment === 'EMPTY',
              );

              if (attachment.length > 0) {
                this.downloadFile(attachment[0]);
                this.refs.toast.show(
                  'Downloading the attachments...',
                  DURATION.LENGTH_LONG,
                );
              }
              this._carousel.snapToItem(index, true);
            });
          }, 250),
      );
    }
  }
  onNext(carosule_index, checklist) {
    let index = carosule_index + 1;
    //console.log('carosule_index index', carosule_index);
    console.log('LoadCategory:Next Button Clikced', index);
    if (index <= this.state.checkpointList.length - 1) {
      console.log('LoadCategory:Next Clikced2', index);
      if (Platform.OS === 'ios') {
        this.setState(
          {
            ActiveId: index,
          },
          () => {
            const checkpoint = this.state.checkPointsDetails[index];
            
this.setState({selectedindex: checkpoint});  
      
           // this.setOnLoadFailureReason(checkpoint);
           // this.setOnLoadRadioValue(checkpoint,checklist);

            const attachment = checkpoint.AttachmentList.filter(
              checks => checks.Attachment === 'EMPTY',
            );

            if (attachment.length > 0) {
              this.downloadFile(attachment[0]);
              this.refs.toast.show(
                'Downloading the attachments...',
                DURATION.LENGTH_LONG,
              );
            }
            this._carousel.snapToItem(index, true);
          },
        );
      } else {
        console.log('LoadCategory:Next Clikced3', index);
        this.setState(
          {
            ActiveId: index,
          },
          () => {
            //setTimeout(() => {
              //() => {
                console.log('LoadCategory:Next Clikced4', index);
                const checkpoint = this.state.checkPointsDetails[index];
                console.log(checkpoint, 'checkpointinonnext');

this.setState({selectedindex: checkpoint});

                const FailureCategoryId = checkpoint.FailureCategoryId;
              console.log("LoadCategory:Next",FailureCategoryId);
              
              if (typeof FailureCategoryId !== "undefined" && FailureCategoryId !== "0" ){
                  this.failurereasonArray(FailureCategoryId);
              }
                const attachment = checkpoint.AttachmentList.filter(
                  checks => checks.Attachment === 'EMPTY',
                );

                if (attachment.length > 0) {
                  this.downloadFile(attachment[0]);
                  this.refs.toast.show(
                    'Downloading the attachments...',
                    DURATION.LENGTH_LONG,
                  );
                }
                //this._carousel.snapToItem(index, true);
              //};

              this._carousel.snapToItem(index, true);
            //}, 550),
          }
        );
      }
    }
  }
  onBack(carosule_index) {
    let index = carosule_index - 1;
    //console.log('carosule_index index', carosule_index);
    //console.log('back index', index);
    if (index >= 0) {
      if (Platform.OS == 'ios') {
        this.setState(
          {
            ActiveId: index,
          },

          () => {
            const checkpoint = this.state.checkPointsDetails[index];
            const attachment = checkpoint.AttachmentList.filter(
              checks => checks.Attachment === 'EMPTY',
            );

            if (attachment.length > 0) {
              this.downloadFile(attachment[0]);
              this.refs.toast.show(
                'Downloading the attachments...',
                DURATION.LENGTH_LONG,
              );
            }
            this._carousel.snapToItem(index, true);
          },
        );
      } else {
        this.setState(
          {
            ActiveId: index,
          },
          () =>
            setTimeout(() => {
              () => {
                const checkpoint = this.state.checkPointsDetails[index];
                const attachment = checkpoint.AttachmentList.filter(
                  checks => checks.Attachment === 'EMPTY',
                );

                if (attachment.length > 0) {
                  this.downloadFile(attachment[0]);
                  this.refs.toast.show(
                    'Downloading the attachments...',
                    DURATION.LENGTH_LONG,
                  );
                }
                this._carousel.snapToItem(index, true);
              };

              this._carousel.snapToItem(index, true);
            }, 250),
        );
      }
    }
  }
  IosPath(path) {
    //console.log(path, 'pathvariable');
    let IosFiles = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
    let arr = path.split('/');
    let iosPath = IosFiles + '/' + arr[arr.length - 1];
    let iosPathfile = decodeURIComponent(iosPath);
    //console.log(iosPathfile, 'pathvariable1');
    return iosPath;
  }

  approachText(value) {
    var Approach_value = value;
    var LPAdrop_Arr = this.state.LPAdrop;
    var text = '';

    if (LPAdrop_Arr.length > 0) {
      LPAdrop_Arr.forEach(element => {
        if (element.ApproachId == Approach_value) {
          text = element.ApproachName;
        }
      });
      return text;
    } else {
      return text;
    }
  }

  failureCategoryText(value) {
    //console.log('helloid2', value, this.state.LPAdrop);
    var Failcat_value = value;
    var LPAdrop_Arr = this.state.FaliureCategoryStateList;
    var text = '';

    if (LPAdrop_Arr.length > 0) {
      LPAdrop_Arr.forEach(element => {
        //console.log(element, 'helloid5');
        if (element.FailureCategoryId == Failcat_value) {
          text = element.FailureCategoryName;
        }
      });
      
      //console.log(text, 'helloid3');
      return text;
    } else {
      //console.log(text, 'helloid31');
      return text;
    }
  }

  failurereasonArray(value) {
    //console.log(value, 'failurereasondata');
    const results = this.state.FailureReasonStateList.filter(obj => {
      return obj.FailureCategoryId === value;
    });
    //console.log(results, 'filteredfailreason');
    const FailReasArray = results.map(obj => ({
      label: obj.FailureReasonName,
      value: obj.FailureReasonId,
    }));
    this.setState(
      {
        FailReasArraySt: FailReasArray,
      },
      () => {
        //console.log(this.state.FailReasArraySt, 'filteredfailreason');
      },
    );
  }
  failureReasonText(value) {
    //console.log('FailureReasonId:', value); // Debugging
    var Failres_value = value;
    var LPAdrop_Arr = this.state.FailureReasonStateList;
    var text = '';
  
    if (LPAdrop_Arr.length > 0) {
      LPAdrop_Arr.forEach(element => {
        if (element.FailureReasonId == Failres_value) {
          text = element.FailureReasonName;
        }
      });
    }
  
    console.log('Mapped FailureReasonText:', text); // Debugging
    return text || ''; // Return empty string if no match
  }

  getDropValue() {
    var AuditID = this.state.auditId;
    var Data = this.state.clauseRecords;
    // //console.log('enteringthreefive', this.state.auditId);
    if (Data) {
      //console.log('Dropdatathree', Data);
      for (var i = 0; i < Data.length; i++) {
        if (AuditID === Data[i].AuditId) {
          this.setState({
            FaliureCategoryStateList: Data[i].CheckpointLogic.FailureCategory,
            FailureReasonStateList: Data[i].CheckpointLogic.FailureReason,
          });
          //console.log('enteringfive', Data[i].CheckpointLogic);
        }
      }
    } else {
      this.getClauseList(this.state.clauseRecords);
    }
  }

  getClauseList = Records => {
    // //console.log('getting records',Records)
    var RecordList = Records;
    var Clausedropdown = [];
    //console.log('loDER==>');
    if (RecordList) {
      for (var i = 0; i < RecordList.length; i++) {
        if (RecordList[i].AuditId === this.state.AuditID) {
          //console.log('AuditID===>>', this.state.AuditID);
          if (RecordList[i].DropDownProps.ClauseList) {
            for (
              var j = 0;
              j < RecordList[i].DropDownProps.ClauseList.length;
              j++
            ) {
              Clausedropdown.push({
                name:
                  RecordList[i].DropDownProps.ClauseList[j].Element +
                    ' ' +
                    RecordList[i].DropDownProps.ClauseList[j]
                      .StandardDescription.length >
                  40
                    ? RecordList[i].DropDownProps.ClauseList[j].Element +
                      ' ' +
                      RecordList[i].DropDownProps.ClauseList[
                        j
                      ].StandardDescription.substring(0, 40) +
                      '...'
                    : RecordList[i].DropDownProps.ClauseList[j].Element +
                      ' ' +
                      RecordList[i].DropDownProps.ClauseList[j]
                        .StandardDescription,
                id: RecordList[i].DropDownProps.ClauseList[j].ElementId,
                Requirement:
                  RecordList[i].DropDownProps.ClauseList[j].StandardRequirement,
              });
            }
          }
        }
      }
    }

    Clausedropdown.sort(function (a, b) {
      const idA = a.id;
      const idB = b.id;
      let comparison = 0;
      if (idA > idB) {
        comparison = 1;
      } else if (idA < idB) {
        comparison = -1;
      }
      return comparison;
    });

    this.setState({clausedata: Clausedropdown}, () => {
      // //console.log('Clause dropdown',this.state.clausedata)
      //console.log('Dropdatathree1');
      // this.onSelectedItemsChange(this.state.selectedItems);
      // this.onSelectedItemsProcessChange(this.state.selectedItemsProcess)
      // this.setProcessList();
    });
  };


  downloadFile(attach) {
    const checkpointList = this.state.checkPointsDetails;
    let newCheckPointDetails = [];
    let downloadAttachment = [];
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected) {
        for (var j = 0; j < checkpointList.length; j++) {
          var checkpoint = checkpointList[j];
          if (
            checkpoint.FormId == attach.FormId &&
            checkpoint.ChecklistTemplateId == attach.ChecklistTemplateID
          ) {
            let AttachmentList = [];
            for (let i = 0; i < checkpoint.AttachmentList.length; i++) {
              var attachment = checkpoint.AttachmentList[i];
              var DocId = attachment.Docid;
              //console.log(DocId, 'docidlog');
              if (parseInt(DocId) > 0) {
                AttachmentList.push({...attachment, Attachment: 'DOWNLOADING'});
                downloadAttachment.push(attachment);
              }
            }
            newCheckPointDetails.push({
              ...checkpoint,
              AttachmentList: AttachmentList,
            });
          } else {
            newCheckPointDetails.push(checkpoint);
          }
        }
        this.setState({checkPointsDetails: newCheckPointDetails}, () => {
          //console.log('Attachment:Downloded', this.state.checkPointsDetails);
          ToastNew.show({
            type: 'info',
            text1: 'Click save button after download the attachments',
          });
          this.getFiles(downloadAttachment);
        });
      }
    });
  }
  getFiles(attachments) {
    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      if (attachment.Attachment === 'FAILED') {
        RNFetchBlob.fs.unlink(attachment.FileUri).then(() => {
          const newFileName = this.getNewFilePath(attachment);
          let attachObj = {...attachment, FileUri: newFileName};
          this.initiateDownload(attachObj);
        });
      } else if (attachment.Attachment === 'EMPTY') {
        this.initiateDownload(attachment);
      }
    }
  }
  initiateDownload(attachment) {
    var Token = this.props.data.audits.token;
    auth.downloadFile(attachment.Docid, Token, (res, data) => {
      //console.log('getFiles File download response', data);
      if (data.data.Message == 'Success') {
        this.WriteAttachments(data.data.Data.FileData, attachment);
      } else {
        this.refs.toast.show(strings.server_error, DURATION.LENGTH_LONG);
      }
    });
  }
  async WriteAttachments(fileContent, attach) {
    await RNFetchBlob.fs
      .writeFile(attach.FileUri, fileContent, 'base64')
      .then(res => {
        //console.log('Attachment:File Written', res);
        this.updateCheckPoints(attach, false);
      })
      .catch(err => {
        //console.log('Attachment:Err:' + err);
        this.updateCheckPoints(attach, true);
      });
  }
  getNewFilePath(attach) {
    let extn = attach.FileName.substring(attach.FileName.lastIndexOf('.') + 1);
    var newFileName = 'file_' + attach.Docid + extn;
    return (
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles') +
      '/' +
      newFileName
    );
  }
  updateCheckPoints(attach, error) {
    const checkpointList = this.state.checkPointsDetails;
    let newCheckPointDetails = [];
    for (var j = 0; j < checkpointList.length; j++) {
      var checkpoint = checkpointList[j];

      if (
        checkpoint.FormId == attach.FormId &&
        checkpoint.ChecklistTemplateId == attach.ChecklistTemplateID
      ) {
        let AttachmentList = [];
        for (let i = 0; i < checkpoint.AttachmentList.length; i++) {
          var attachment = checkpoint.AttachmentList[i];
          var DocId = attachment.Docid;
          if (attach.Docid == DocId) {
            AttachmentList.push({
              ...attachment,
              Attachment: !error ? 'Downloaded' : 'FAILED',
            });
            error &&
              this.refs.toast.show(
                'Download attachment Failed, Try again!!',
                DURATION.LENGTH_LONG,
              );
          } else {
            AttachmentList.push(attachment);
          }
        }
        newCheckPointDetails.push({
          ...checkpoint,
          AttachmentList: AttachmentList,
        });
      } else {
        newCheckPointDetails.push(checkpoint);
      }
    }
    this.setState({checkPointsDetails: newCheckPointDetails}, () => {
      //console.log('Attachment:Downloded', this.state.checkPointsDetails);
    });
  }

  renderAttachment(index) {
    return (
      <ScrollView horizontal={true}>
        {this.state.checkPointsDetails[index].AttachmentList.map((item, key) =>
          item.Attachment === 'EMPTY' || item.Attachment === 'FAILED' ? (
            <View
              style={{
                flexDirection: 'row',
                borderColor: 'darkgrey',
                paddingVertical: 10,
                margin: 2,
                borderWidth: 1,
                borderRadius: 5,
              }}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={this.downloadFile.bind(this, item)}>
                  {this.getFileIcon(item)}
                  <View
                    style={{
                      width: width(65),
                      marginTop: 5,
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text style={{}}>{item.FileName}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : item.FileType.split('/')[0] == 'image' ? (
            item.Attachment === 'DOWNLOADING' ? (
              this.getDownloadLoadingIcon(item.FileName)
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  margin: 2,
                  borderColor: 'darkgrey',
                  borderWidth: 1,
                  height: '90%',
                  borderRadius: 5,
                }}>
                <TouchableOpacity
                  key={key}
                  onPress={this.openAttachmentImage.bind(
                    this,
                    item,
                    this.state.isBrowse == true ? 1 : 0,
                  )}>
                  <View
                    style={{
                      paddingVertical: 10,
                      margin: 2,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Image
                          source={{
                            uri: 'file:/' + item.FileUri,
                          }}
                          style={{
                            width: width(65),
                            height: 200,
                            resizeMode: 'cover',
                            marginRight: 15,
                          }}
                        />
                        <View
                          style={{
                            width: width(65),
                            marginTop: 5,
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}>
                          <Text style={{}}>{item.FileName}</Text>
                        </View>
                      </View>

                      <View>
                        <TouchableOpacity
                          onPress={this.removeAttachment.bind(
                            this,
                            key,
                            item,
                            index,
                          )}>
                          <Icon name="trash" size={20} color="red" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* )} */}

                    <View style={{display: 'none'}}>
                      {/* {this.state.checkPointsDetails[index].Modified = true} */}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          ) : item.FileType.indexOf('image') === -1 ? (
            item.Attachment === 'DOWNLOADING' ? (
              this.getDownloadLoadingIcon(item.FileName)
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  borderColor: 'darkgrey',
                  borderWidth: 1,
                  borderRadius: 5,
                  height: '90%',
                  paddingVertical: 10,
                  margin: 2,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this.openAttachmentFile.bind(
                      this,
                      item,
                      this.state.isBrowse == true ? 1 : 0,
                    )}>
                    {this.getFileIcon(item)}
                    <View
                      style={{
                        width: width(65),
                        marginTop: 5,
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <Text style={{}}>{item.FileName}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity
                    // style={styles.rightHeader}
                    onPress={this.removeAttachment.bind(
                      this,
                      key,
                      item,
                      index,
                    )}>
                    <View>
                      <Icon name="trash" size={20} color="red" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )
          ) : null,
        )}
      </ScrollView>
    );
  }

  render_loader() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#1CAFF6" />
      </View>
    );
  }

  async ncofisetting(value) {
    var ncofiSetting = await AsyncStorage.getItem('NCOFISetting');
    //console.log(ncofiSetting, value, 'heloncofisetting');
    var dropdownnotokvalue = value;
    this.setState({
      ncofiSetting: ncofiSetting,
      dropdownnotokvalue: dropdownnotokvalue,
    });
  }

  getDownloadLoadingIcon(FileName) {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity>
            <ActivityIndicator
              style={{
                paddingTop: 70,
                height: 200,
                zIndex: 1,
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              name="hourglass"
              size={45}
              color="#48BCF7"
            />
            <View
              style={{
                width: width(65),
                marginTop: 5,
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text style={{}}>{FileName}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  getFileIcon(attach) {
    let icon = 'file';
    const filename = attach.FileName;
    if (filename == null || typeof filename == 'undefined' || filename == '')
      return null;
    let type =
      filename !== ''
        ? filename.substring(filename.lastIndexOf('.') + 1)
        : 'file';
    switch (type) {
      case 'pdf': {
        icon = 'file-pdf-o';
        break;
      }
      case 'doc':
      case 'docx': {
        icon = 'file-word-o';
        break;
      }
      case 'ppt':
      case 'pps': {
        icon = 'file-powerpoint-o';
        break;
      }
      case 'xls':
      case 'xlsx':
      case 'xlsm': {
        icon = 'file-excel-o';
        break;
      }
      case 'video':
      case 'mp4':
      case 'mpeg': {
        icon = 'play';
        break;
      }
      case 'image':
      case 'jpg':
      case 'png':
      case 'gif': {
        icon = 'image';
        break;
      }
      default: {
        icon = 'file';
      }
    }

    return (
      <View>
        {(attach.Attachment === 'EMPTY' || attach.Attachment === 'FAILED') && (
          <Icon
            style={{
              position: 'absolute',
              paddingTop: 85,
              zIndex: 1,
              flex: 1,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            name="download"
            size={35}
            color="#888584"
          />
        )}
        <Icon
          name={icon}
          size={65}
          color="black"
          style={{
            paddingTop: 70,
            height: 200,
            flex: 1,
            // zIndex:0,
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        />
        {attach.Attachment === 'FAILED' && (
          <Text
            style={{
              zIndex: 1,
              position: 'absolute',
              paddingTop: 135,
              flex: 1,
              color: 'red',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            Retry
          </Text>
        )}
      </View>
    );
  }
  renderAttachmentLoading = () => {
    return (
      <View style={{flexDirection: 'row', paddingBottom: 10}}>
        <Icon name="hourglass" size={15} color="#A6A6A6" style={{padding: 5}} />
        <Text
          numberOfLines={1}
          style={{
            color: '#A6A6A6',
            fontFamily: 'OpenSans-Regular',
            alignSelf: 'flex-start',
            padding: 5,
          }}>
          Loading Attachments...
        </Text>
      </View>
    );
  };
  deleteScore = item => {
    var checkPointsDetails = this.state.checkPointsDetails;
    for (var i = 0; i < checkPointsDetails.length; i++) {
      if (
        checkPointsDetails[i].ChecklistTemplateId == item.ChecklistTemplateId
      ) {
        checkPointsDetails[i].Modified = true;
        checkPointsDetails[i].Score = '-2';
      }
    }
    this.setState(
      {
        checkPointsDetails: checkPointsDetails,
        isUnsavedData: true,
      },
      () => {
        //console.log('checkPointsDetails****', this.state.checkPointsDetails);
      },
    );
  };
  deleteImmediateAction(item) {
    var checkPointsDetails = this.state.checkPointsDetails;
    for (var i = 0; i < checkPointsDetails.length; i++) {
      if (
        checkPointsDetails[i].ChecklistTemplateId == item.ChecklistTemplateId
      ) {
        checkPointsDetails[i].Modified = true;
        checkPointsDetails[i].immediateAction = 0;
      }
    }
    this.setState(
      {
        checkPointsDetails: checkPointsDetails,
        isUnsavedData: true,
      },
      () => {
        //console.log('checkPointsDetails****', this.state.checkPointsDetails);
      },
    );
  }

  renderStatus = (checkpoint, scoreTypes) => {
    let scoreTypesData = scoreTypes.scoreTypesData;
    //console.log('renderStatus:scoreTypesData', scoreTypesData, checkpoint);
    let status = '';
    if (checkpoint.Score_Type === 3) {
      let scores = scoreTypesData.filter(
        item => item.value === checkpoint.Score,
        //console.log('item==>', scores),
      );
      let scoreStatus = scores.length > 0 ? parseInt(scores[0].status) : -2; //checkpoint.AnsStatus
      //console.log('renderStatus:scoreStatus', scoreStatus);
      status =
        scoreStatus >= 0 && scoreStatus <= 1 && checkpoint.Scoretext !== ''
          ? '0'
          : scoreStatus === 4
          ? '1'
          : '';
    } else {
      status =
        checkpoint.IsCorrect == 1 && checkpoint.RadioValue != 11
          ? '1'
          : checkpoint.IsCorrect == 0 && checkpoint.RadioValue != 11
          ? '0'
          : '';
    }
    //console.log('renderStatus:RENDERSTATUS', status);
    return status === '1' ? (
      <Icon name="check" size={20} color="green" />
    ) : status === '0' ? (
      <Icon name="times" size={20} color="red" style={{marginTop: 10}} />
    ) : null;
  };
  toggleDropdown = () => {
    // Toggle the boolean value
    //console.log('booleancheck', this.state.booleanNcofi);
    this.setState(prevState => ({
      booleanNcofi: !prevState.booleanNcofi,
    }));
  };
 


  handleNotOkClick = () => {
    var NCrecords = this.props.data.audits.ncofiRecords || [];
    
    console.log('NCrecords:', NCrecords);
    console.log("be here");
const responseData = this.state.clauseRecords[0].DropDownProps.Users
 
const filteredData = responseData.filter((item) => item.ISSelection === "True").map((item) => item.userid);
console.log("filteredDataforres",filteredData)
 
    console.log('Selected AuditId:', this.state.selectedindex);
  

    if (NCrecords.length === 0) {
      console.warn('No NC records found');
      return;
    }
 
    var dupNCrecords = [];
    var BundleArr = {
      requiretext: "-",
      NonConfirmity: this.state.selectedindex.ChecklistName + ": No",
      categoryDrop: this.state.clauseRecords[0].DropDownProps.Category[0].CategoryId,
      ResponsibilityUser: filteredData,
      requestDrop: "24",
      deptDrop: 0,
      failureDrop: 0,
      filename: [],
      filedata: [],
      AuditID: this.state.selectedindex.AuditId,
      ChecklistID: "",
      Formid: '-1',
      SiteID: 1,
      auditstatus: "2",
      title: "order by FormName asc",
      NCNumber: this.state.raiseID.AUDIT_NO,
      Category: "NC",
      uniqueNCkey: this.state.selectedindex.uniqueNCkey === undefined ? Moment().unix() : this.state.selectedindex.uniqueNCkey,
      selectedItems: [],
      selectedItemsProcess: [],
      ChecklistTemplateId: this.state.selectedindex.ChecklistTemplateId,
      ncIdentifier: "",
      objEvidence: "",
      documentRef: "",
      recommAction: "",
    };
    console.log('BundleArr:', BundleArr);
 
    for (var i = 0; i < NCrecords.length; i++) {
      console.log("Processing AuditID:", NCrecords[i].AuditID);
      if (String(NCrecords[i].AuditID) === String(this.state.selectedindex.AuditId)) {
        console.log('Match found for AuditID:', NCrecords[i].AuditID);
 
        var Information = [...(NCrecords[i].Pending || [])];
 
        // Ensure each BundleArr is added as a separate entry in Pending
        Information.push(BundleArr);
 
        // Ensure the Pending array has the correct order and structure (with indexes 0, 1, 2, etc.)
        dupNCrecords.push({
          AuditID: NCrecords[i].AuditID,
          Uploaded: NCrecords[i].Uploaded,
          Pending: Information,
        });
      } else {
        dupNCrecords.push(NCrecords[i]);
      }
    }
 
    console.log('Updated NC Records:', dupNCrecords);
    this.props.storeNCRecords(dupNCrecords);
};
 

isFailureReasonValid(failureReasonId, categoryId) {
  const validReasons = this.state.FailReasArraySt.filter(reason => reason.categoryId === categoryId);
  return validReasons.some(reason => reason.id === failureReasonId);
}

//  setOnLoadRadioValue(checkpoint,checklist){
//   console.log("Load:Radio:",checkpoint,checklist);
//   var RadioValue = -1;
//   if (checklist?.ansType === 'M3'){                             
//     RadioValue = parseInt(checklist?.Status) == 1 || parseInt(checklist?.RadioValue) == 9 ? 9
//       : parseInt(checklist.Status) == 0 || parseInt(checklist.RadioValue) == 10 ? 10 
//       : parseInt(checklist.Status) == 2 || parseInt(checklist.RadioValue) == 11 ? 11
//       : -1 
//   } else if (checklist?.ansType === 'M4'){                             
//     RadioValue = parseInt(checkpoint.Status) == 1 || parseInt(checkpoint.RadioValue) == 14 ? 14
//       : parseInt(checklist.Status) == 0 || parseInt(checklist.RadioValue) == 15 ? 15
//       : parseInt(checklist.Status) == 2 || parseInt(checklist.RadioValue) == 11 ? 11
//       : -1 
//   }
//   console.log("Load:Radio:VAlue",RadioValue);

//   for (var i = 0; i < this.state.checkPointsDetails.length; i++) {
//     if (this.state.checkPointsDetails[i].ChecklistTemplateId == checklist.ChecklistTemplateId) {
//       this.state.checkPointsDetails[i].RadioValue = RadioValue;
//         return true;    
//     }
//   } 
//   return false;
// }

// setOnLoadFailureReason(checkpoint){                  
//     const FailureCategoryId = checkpoint?.FailureCategoryId;
//     console.log("Load:Category:1",FailureCategoryId);
//     if (typeof FailureCategoryId !== "undefined" && FailureCategoryId !== "0" ){     
//        this.failurereasonArray(FailureCategoryId);
//        return true;
//    }
// }


  render() {
    //console.log(this.state.radiovalue_ncofi,"valuesincoming");

    console.log("Load:Category:1:render")
    const {booleanNcofi} = this.state;
    let data = [
      {
        value: 'X',
      },
    ];

    const Item = ({title}) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );

    const FailCatarray = this.state.FaliureCategoryStateList?.map(obj => ({
      label: obj?.FailureCategoryName,

      value: obj?.FailureCategoryId,
    }));
    // const CheckAttachment = this.state.
    const FailReasArray = this.state.FailureReasonStateList?.map(obj => ({
      label: obj?.FailureReasonName,

      value: obj?.FailureReasonId,
    }));
    //  //console.log("$$$",this.state.CheckpointAttachment)
    console.log(
      this.props.data.audits.auditRecords[0].CheckpointLogic
        .CheckpointAttachment,
      '###',
    );
    //console.log(FailReasArray, 'failreasonarray');
    
    //console.log('failurecategorystate', FailCatarray);
    //console.log('Dta', this.state.checkPointsDetails);
    // //console.log("this.state.checkpointList", this.state.checkpointList);
    console.log(
      'ÃƒÂ§',
      this.state.checkpointList,
      this.state.checkPointsDetails,
    );

    //console.log(this.props.data, 'data');
    const dropdata = this.state.dropdown;
    const radio_props1 = [
      {label: strings.yes, value: 9},
      {label: strings.no, value: 10},
    ];
    const radio_props2 = [
      {label: strings.true, value: 12},
      {label: strings.false, value: 13},
    ];
    const radio_props3 = [
      {label: strings.yes, value: 9},
      {label: strings.no, value: 10},
      {label: strings.NA, value: 11},
    ];
    const radio_props4 = [
      {label: strings.ok, value: 14},
      {label: strings.Notok, value: 15},
      {label: strings.NA, value: 11},
    ];
    //console.log('CheckPointDemo~checkpointList:>', this.state.checkpointList);
   
    // if (this.state.failureloaded === false){                              
    //   const ret = this.setOnLoadFailureReason(this.state.checkpointList[0])
    // if (ret)
    //   this.setState({failureloaded:true});
    // }

    // const checkpoint =  this.state.checkPointsDetails[0];

    // if (this.state.radiovalueloaded === false) { 
    //   //  const ret = this.setOnLoadRadioValue(checkpoint,this.state.checkpointList[0]);
    //     if (ret)
    //       this.setState({radiovalueloaded:true});
    // }
  
    return (
      <View style={styles.mainContainer}>
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.goBackToChecklist()}>
              <View style={styles.backlogo}>
                {!this.state.isSaving ? (
                  // <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" />
                  <Icon name="angle-left" size={30} color="white" />
                ) : null}
              </View>
            </TouchableOpacity>

            <View style={styles.heading}>
              <Text
                numberOfLines={2}
                style={styles.headingText}
                onPress={() => this.ShowToast()}>
                {this.state.displayData}
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

            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() => this.goHome()}>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {/* <View style={{flex:1}}> */}
        {this.state.isContentLoaded == false && !this.state.isSaving ? (
          <View style={{flex: 1}}>
            {this.props.data.audits.smdata !== 2 &&
            this.props.data.audits.smdata !== 3 ? (
              <View style={styles.statistics}>
                <View style={styles.statCard1}>
                  <Text
                    numberOfLines={1}
                    style={{fontSize: 14, fontFamily: 'OpenSans-Regular'}}>
                    {strings.Total_checkpoints}
                  </Text>
                  <Text
                    style={{
                      fontSize: Fonts.size.h5,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {this.state.totalCheck}
                  </Text>
                </View>

                <View style={styles.statCard3}>
                  <Text style={{fontSize: 14, fontFamily: 'OpenSans-Regular'}}>
                    {'Asterisk Questions'}
                  </Text>
                  <Text
                    style={{
                      fontSize: Fonts.size.h5,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {this.state.mandatoryCheck}
                    {console.log(
                      'MAndatoryCheck===>',
                      this.state.mandatoryCheck,
                    )}
                  </Text>
                </View>
              </View>
            ) : null}

            {this.state.checkpointList.length ? (
              <View style={styles.body}>
                {//console.log('venkat/yag', this.state.checkpointList)
                }
                <View
                  style={{flex: 1, height: '100%', marginTop: 5, bottom: 5}}>
                  <FlatList
                    data={this.state.checkpointList}
                    keyExtractor={item => item.ActualIndex}
                    showsVerticalScrollIndicator={false}
                    extraData={this.state}
                    renderItem={({item, index}) => {
                      {
                        console.log(
                          'CheckPointDemo~checkpointList[index]',
                          this.state.checkpointList[index],
                          'checkPointsDetails[index]',
                          this.state.checkPointsDetails[index],
                        );
                      }
                      return (
                        <TouchableOpacity
                          style={[
                            styles.leftBtn,
                            {
                              backgroundColor:
                                this.state.ActiveId == index
                                  ? '#00BAC8'
                                  : '#FFFFFF',
                            },
                          ]}
                          onPress={() => this.btnDatapress(index, item)}>
                          <View style={{width: '90%'}}>
                            <Text
                              style={[
                                {
                                  fontSize: 16,
                                  textAlign: 'center',
                                  fontFamily: 'OpenSans-Regular',
                                },
                                {
                                  color:
                                    this.state.ActiveId == index
                                      ? 'white'
                                      : 'black',
                                },
                              ]}>
                              {this.state.checkpointList[index].SerialNo}
                            </Text>
                            {console.log(
                              this.state.checkPointsDetails[index],

                              '===>check no',
                            )}
                          </View>
                          <View style={{width: '10%', marginRight: 5}}>
                            {
                              // NC validation
                              (this.state.checkPointsDetails[index]
                                .Attachment == '' &&
                                this.state.checkPointsDetails[index]
                                  .AttachforNc == 1 &&
                                this.state.checkPointsDetails[index]
                                  .RemarkforNc == 0) ||
                              (this.state.checkPointsDetails[index].Remark ==
                                '' &&
                                this.state.checkPointsDetails[index]
                                  .RemarkforNc == 1 &&
                                this.state.checkPointsDetails[index]
                                  .AttachforNc == 0) ||
                              (this.state.checkPointsDetails[index]
                                .Attachment == '' &&
                                this.state.checkPointsDetails[index].Remark ==
                                  '' &&
                                this.state.checkPointsDetails[index]
                                  .AttachforNc == 1 &&
                                this.state.checkPointsDetails[index]
                                  .RemarkforNc == 1) ||
                              // OFI validation
                              (this.state.checkPointsDetails[index]
                                .Attachment == '' &&
                                this.state.checkPointsDetails[index]
                                  .AttachforOfi == 1 &&
                                this.state.checkPointsDetails[index]
                                  .RemarkforOfi == 0) ||
                              (this.state.checkPointsDetails[index].Remark ==
                                '' &&
                                this.state.checkPointsDetails[index]
                                  .RemarkforOfi == 1 &&
                                this.state.checkPointsDetails[index]
                                  .AttachforOfi == 0) ||
                              (this.state.checkPointsDetails[index]
                                .Attachment == '' &&
                                this.state.checkPointsDetails[index].Remark ==
                                  '' &&
                                this.state.checkPointsDetails[index]
                                  .AttachforOfi == 1 &&
                                this.state.checkPointsDetails[index]
                                  .AttachforOfi == 1) ? (
                                <View
                                  style={{
                                    bottom: 15,
                                    marginLeft:
                                      Platform.OS === 'ios' ? 2 : null,
                                  }}>
                                  <ResponsiveImage
                                    source={Images.ManIcon1}
                                    initHeight={15}
                                    initWidth={15}
                                  />
                                </View>
                              ) : // NC validation
                              (this.state.checkPointsDetails[index]
                                  .AttachforNc == 1 &&
                                  this.state.checkPointsDetails[index]
                                    .RemarkforNc == 0) ||
                                (this.state.checkPointsDetails[index]
                                  .RemarkforNc == 1 &&
                                  this.state.checkPointsDetails[index]
                                    .AttachforNc == 0) ||
                                (this.state.checkPointsDetails[index]
                                  .AttachforNc == 1 &&
                                  this.state.checkPointsDetails[index]
                                    .RemarkforNc == 1) ||
                                // OFI validation
                                (this.state.checkPointsDetails[index]
                                  .AttachforOfi == 1 &&
                                  this.state.checkPointsDetails[index]
                                    .RemarkforOfi == 0) ||
                                (this.state.checkPointsDetails[index]
                                  .RemarkforOfi == 1 &&
                                  this.state.checkPointsDetails[index]
                                    .AttachforOfi == 0) ||
                                (this.state.checkPointsDetails[index]
                                  .AttachforOfi == 1 &&
                                  this.state.checkPointsDetails[index]
                                    .RemarkforOfi == 1) ? (
                                <View
                                  style={{
                                    bottom: 15,
                                    marginLeft:
                                      Platform.OS === 'ios' ? 2 : null,
                                  }}>
                                  <ResponsiveImage
                                    source={Images.ManIcon3}
                                    initHeight={15}
                                    initWidth={15}
                                  />
                                </View>
                              ) : null
                            }
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
                <View style={{flex: 4, height: '100%', marginBottom: 10}}>
                  {this.state.isLoaded == true ? (
                    <Carousel
                      layout={'default'}
                      scrollEnabled={false}
                      data={this.state.checkpointList}
                      extraData={this.state}
                      ref={c => {
                        this._carousel = c;
                      }}
                      startAutoplay
                      renderItem={({item, index}) => {
                       // console.log(item, 'LoadCategory:1',index);
                        if (Platform.OS === 'ios') {
                          if (index == 0) {
                            const checkpoint =
                              this.state.checkPointsDetails[index];
                            const attachment = checkpoint.AttachmentList.filter(
                              checks => checks.Attachment === 'EMPTY',
                            );
                           

                            if (attachment.length > 0) {
                              this.downloadFile(attachment[0]);
                              this.refs.toast.show(
                                'Downloading the attachments...',
                                DURATION.LENGTH_LONG,
                              );
                            }
                          }
                        }  
                                                                                                         
                     
                        return (
                          <ScrollView style={{flex: 1, marginBottom: 20}}>
                            <View style={styles.cart}>
                              <View
                                style={{flexDirection: 'row', width: '100%'}}>
                                <View style={{width: '85%'}}>
                                  <View style={{flexDirection: 'row'}}>
                                    <RichText
                                      content={item.ChecklistName}
                                      height={300}
                                    />
                                    {this.state.checkPointsDetails[index]
                                      .nc_available_status ? (
                                      <View
                                        style={{
                                          marginLeft: 5,
                                        }}>
                                        <Icon
                                          name="circle"
                                          size={12}
                                          color="red"
                                        />
                                      </View>
                                    ) : null}
                                    {this.state.checkPointsDetails[index]
                                      .ofi_avialable_status ? (
                                      <View
                                        style={{
                                          marginLeft: 5,
                                          //marginTop: 10,
                                        }}>
                                        <Icon
                                          name="circle"
                                          size={12}
                                          color="yellow"
                                        />
                                      </View>
                                    ) : null}

                                    {/*Change done - 16/12/2022*/}
                                    {item.IsVeto == '1' ? (
                                      <View
                                        style={{
                                          justifyContent: 'flex-start',
                                          marginLeft: 10,
                                          marginTop: 5,
                                        }}>
                                        <Icon
                                          name="asterisk"
                                          size={10}
                                          color="red"
                                        />
                                      </View>
                                    ) : (
                                      <View></View>
                                    )}
                                  </View>
                                  <View
                                    style={{
                                      alignItems: 'flex-end',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',

                                      height: 5,
                                      width: '100%',
                                      marginLeft: 40,
                                    }}></View>
                                  {this.renderStatus(
                                    this.state.checkPointsDetails[index],
                                    item,
                                  )}
                                </View>

                                <View style={{width: '10%'}}>
                                  {
                                    // NC validation
                                    (this.state.checkPointsDetails[index]
                                      .Attachment == '' &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforNc == 1 &&
                                      this.state.checkPointsDetails[index]
                                        .RemarkforNc == 0) ||
                                    (this.state.checkPointsDetails[index]
                                      .Remark == '' &&
                                      this.state.checkPointsDetails[index]
                                        .RemarkforNc == 1 &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforNc == 0) ||
                                    (this.state.checkPointsDetails[index]
                                      .Attachment == '' &&
                                      this.state.checkPointsDetails[index]
                                        .Remark == '' &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforNc == 1 &&
                                      this.state.checkPointsDetails[index]
                                        .RemarkforNc == 1) ||
                                    // OFI validation
                                    (this.state.checkPointsDetails[index]
                                      .Attachment == '' &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforOfi == 1 &&
                                      this.state.checkPointsDetails[index]
                                        .RemarkforOfi == 0) ||
                                    (this.state.checkPointsDetails[index]
                                      .Remark == '' &&
                                      this.state.checkPointsDetails[index]
                                        .RemarkforOfi == 1 &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforOfi == 0) ||
                                    (this.state.checkPointsDetails[index]
                                      .Attachment == '' &&
                                      this.state.checkPointsDetails[index]
                                        .Remark == '' &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforOfi == 1 &&
                                      this.state.checkPointsDetails[index]
                                        .AttachforOfi == 1) ? (
                                      <View style={{bottom: 5, marginLeft: 2}}>
                                        <ResponsiveImage
                                          source={Images.ManIcon1}
                                          initHeight={30}
                                          initWidth={30}
                                        />
                                      </View>
                                    ) : // NC validation
                                    (this.state.checkPointsDetails[index]
                                        .AttachforNc == 1 &&
                                        this.state.checkPointsDetails[index]
                                          .RemarkforNc == 0) ||
                                      (this.state.checkPointsDetails[index]
                                        .RemarkforNc == 1 &&
                                        this.state.checkPointsDetails[index]
                                          .AttachforNc == 0) ||
                                      (this.state.checkPointsDetails[index]
                                        .AttachforNc == 1 &&
                                        this.state.checkPointsDetails[index]
                                          .RemarkforNc == 1) ||
                                      // OFI validation
                                      (this.state.checkPointsDetails[index]
                                        .AttachforOfi == 1 &&
                                        this.state.checkPointsDetails[index]
                                          .RemarkforOfi == 0) ||
                                      (this.state.checkPointsDetails[index]
                                        .RemarkforOfi == 1 &&
                                        this.state.checkPointsDetails[index]
                                          .AttachforOfi == 0) ||
                                      (this.state.checkPointsDetails[index]
                                        .AttachforOfi == 1 &&
                                        this.state.checkPointsDetails[index]
                                          .RemarkforOfi == 1) ? (
                                      <View style={{bottom: 5, marginLeft: 2}}>
                                        <ResponsiveImage
                                          source={Images.ManIcon3}
                                          initHeight={30}
                                          initWidth={30}
                                        />
                                      </View>
                                    ) : null
                                  }
                                </View>
                              </View>
                              <View style={{flexDirection: 'column'}}>
                                {item.ansType == 'M1' &&
                                item.scoreType !== 3 ? ( //Radio button
                                  <View style={styles.boxsecRadio}>
                                    <RadioForm
                                      radio_props={radio_props1}
                                      initial={
                                        this.state.checkPointsDetails.length >
                                          0 ||
                                        this.state.checkpointList.length > 0
                                          ? parseInt(
                                              this.state.checkPointsDetails[
                                                index
                                              ].RadioValue,
                                            ) == 9 ||
                                            parseInt(
                                              this.state.checkpointList[index]
                                                .Status,
                                            ) == 1
                                            ? 0
                                            : parseInt(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].RadioValue,
                                              ) == 10 ||
                                              parseInt(
                                                this.state.checkpointList[index]
                                                  .Status,
                                              ) == 0
                                            ? 1
                                            : -1
                                          : -1
                                      }
                                      onPress={value => {
                                        // this.markStatus(item)
                                        this.ncofisetting(value);
                                        var checkPointsDetails =
                                          this.state.checkPointsDetails;
                                        var isNCClearRequired = false;
                                        var ncRemovalTemplateId = 0;
                                        for (
                                          var i = 0;
                                          i < checkPointsDetails.length;
                                          i++
                                        ) {
                                          if (
                                            checkPointsDetails[i]
                                              .ChecklistTemplateId ==
                                            item.ChecklistTemplateId
                                          ) {
                                            checkPointsDetails[i].RadioValue =
                                              value;
                                            checkPointsDetails[i].ParamMode = 1;
                                            checkPointsDetails[
                                              i
                                            ].Modified = true;
                                            if (value == item.correctAnswer) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 1;
                                              //console.log('correct answer');
                                              console.log(
                                                'checkPointsDetails now',
                                                checkPointsDetails[i].IsCorrect,
                                              );
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 0; // NC is not allowed & OFI is allowed
                                              }
                                            } else if (value == 11) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 2;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 2; // Both NC & OFI is not allowed
                                              }
                                            } else {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              checkPointsDetails[
                                                i
                                              ].IsNCAllowed = 1; // Both NC & OFI is allowed
                                            }
                                            if (item.scoreType == 2) {
                                              if (
                                                value ==
                                                parseInt(item.correctAnswer)
                                              ) {
                                                checkPointsDetails[i].Score =
                                                  item.maxScore;
                                              } else {
                                                checkPointsDetails[i].Score =
                                                  item.minScore;
                                              }
                                            }
                                          }
                                        }
                                        if (isNCClearRequired) {
                                          this.setState(
                                            {
                                              ncRemovalTemplateId:
                                                ncRemovalTemplateId,
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                              dialogVisibleNCR: true,
                                            },
                                            () => {
                                            },
                                          );
                                        } else {
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                            },
                                          );
                                        }
                                      }}
                                      formHorizontal={true}
                                      labelHorizontal={true}
                                      buttonSize={15}
                                      labelStyle={{
                                        color: 'black',
                                        paddingRight: 12,
                                      }}
                                    />

                                    {this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 2 &&
                                    this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 0 &&
                                    this.state.TemplateID !== 5 &&
                                    this.state.ischeckLPA !== true &&
                                    this.state.ncofiSetting === true &&
                                    this.state.dropdownnotokvalue === 15 ? (
                                      <TouchableOpacity
                                        onPress={this.popupModal.bind(
                                          this,
                                          this.state.checkPointsDetails[index],
                                        )}
                                        style={styles.ncofi}>
                                        <Text
                                          style={{
                                            color: 'white',
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          NC/OFI
                                        </Text>
                                      </TouchableOpacity>
                                    ) : null} 
                                  </View>
                                ) : item.ansType == 'M2' &&
                                  item.scoreType !== 3 ? (
                                  <View style={styles.boxsecRadio}>
                                    <RadioForm
                                      radio_props={radio_props2}
                                      initial={
                                        this.state.checkPointsDetails.length >
                                          0 ||
                                        this.state.checkpointList.length > 0
                                          ? parseInt(
                                              this.state.checkpointList[index]
                                                .Status,
                                            ) == 1 ||
                                            parseInt(
                                              this.state.checkPointsDetails[
                                                index
                                              ].RadioValue,
                                            ) == 12
                                            ? 0
                                            : parseInt(
                                                this.state.checkpointList[index]
                                                  .Status,
                                              ) == 0 ||
                                              parseInt(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].RadioValue,
                                              ) == 13
                                            ? 1
                                            : -1
                                          : -1
                                      }
                                      onPress={value => {
                                        //console.log('====>value', value);
                                        this.ncofisetting(value);
                                        var checkPointsDetails =
                                          this.state.checkPointsDetails;
                                        var isNCClearRequired = false;
                                        var ncRemovalTemplateId = 0;
                                        for (
                                          var i = 0;
                                          i < checkPointsDetails.length;
                                          i++
                                        ) {
                                          if (
                                            checkPointsDetails[i]
                                              .ChecklistTemplateId ==
                                            item.ChecklistTemplateId
                                          ) {
                                            checkPointsDetails[i].RadioValue =
                                              value;
                                            checkPointsDetails[i].ParamMode = 2;
                                            checkPointsDetails[
                                              i
                                            ].Modified = true;
                                            if (value == item.correctAnswer) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 1;
                                              //console.log('correct answer');
                                              console.log(
                                                'checkPointsDetails now',
                                                checkPointsDetails[i].IsCorrect,
                                              );
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                console.log(
                                                  'checkPointsDetailsd',
                                                  checkPointsDetails,
                                                );
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 0; // NC is not allowed & OFI is allowed
                                              }
                                            } else if (value == 11) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 2;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 2; // Both NC & OFI is not allowed
                                              }
                                            } else {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              checkPointsDetails[
                                                i
                                              ].IsNCAllowed = 1; // Both NC & OFI is allowed
                                            }
                                            if (item.scoreType == 2) {
                                              if (
                                                value ==
                                                parseInt(item.correctAnswer)
                                              ) {
                                                checkPointsDetails[i].Score =
                                                  item.maxScore;
                                              } else {
                                                checkPointsDetails[i].Score =
                                                  item.minScore;
                                              }
                                            }
                                          }
                                        }
                                        if (isNCClearRequired) {
                                          this.setState(
                                            {
                                              ncRemovalTemplateId:
                                                ncRemovalTemplateId,
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                              dialogVisibleNCR: true,
                                            },
                                            () => {
                                           },
                                          );
                                        } else {
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                            },
                                          );
                                        }
                                      }}
                                      formHorizontal={true}
                                      labelHorizontal={true}
                                      buttonSize={15}
                                      labelStyle={{
                                        color: 'black',
                                        paddingRight: 12,
                                      }}
                                    />
                                    {this.state.ncofiSetting === 'true' &&
                                      this.state.dropdownnotokvalue === 11 && (
                                        <TouchableOpacity
                                          onPress={this.popupModal.bind(
                                            this,
                                            this.state.checkPointsDetails[
                                              index
                                            ],
                                          )}
                                          style={styles.ncofi}>
                                          <Text
                                            style={{
                                              color: 'white',
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            NC/OFI
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    {this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 2 &&
                                    this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 0 &&
                                    this.state.TemplateID !== 5 &&
                                    this.state.ischeckLPA !== true ? (
                                      <TouchableOpacity
                                        onPress={this.popupModal.bind(
                                          this,
                                          this.state.checkPointsDetails[index],
                                        )}
                                        style={styles.ncofi}>
                                        <Text
                                          style={{
                                            color: 'white',
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                        NC/OFI
                                      </Text>
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                ) : item.ansType == 'M3' &&
                                  item.scoreType !== 3 ? (
                                  <View style={styles.boxsecRadio}>
                                    <RadioForm
                                      radio_props={radio_props3}
                                      initial={
                                        this.state.checkpointList.length > 0 ||
                                        this.state.checkPointsDetails.length > 0
                                          ? parseInt(
                                              this.state.checkpointList[index]
                                                .Status,
                                            ) == 1 ||
                                            parseInt(
                                              this.state.checkPointsDetails[
                                                index
                                              ].RadioValue,
                                            ) == 9
                                            ? 0
                                            : parseInt(
                                                this.state.checkpointList[index]
                                                  .Status,
                                              ) == 0 ||
                                              parseInt(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].RadioValue,
                                              ) == 10
                                            ? 1
                                            : parseInt(
                                                this.state.checkpointList[index]
                                                  .Status,
                                              ) == 2 ||
                                              parseInt(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].RadioValue,
                                              ) == 11
                                             
                                            ? 2
                                            : -1
                                          : -1
                                      }
                                      onPress={value => {
                                        console.log("Load:Category:Radio Press",value)
                                        {value === 10 ?
                                          this.handleNotOkClick() :
                                        this.ncofisetting(value);
                                        //console.log('==--->', value);
                                        //console.log('v+', value);
                                        console.log(
                                          this.state.checkpointList[index]
                                            .Status,
                                          'v++',
                                        );
                                        var checkPointsDetails =
                                          this.state.checkPointsDetails;
                                        var isNCClearRequired = false;
                                        var ncRemovalTemplateId = 0;
                                        for (
                                          var i = 0;
                                          i < checkPointsDetails.length;
                                          i++
                                        ) {
                                          if (
                                            checkPointsDetails[i]
                                              .ChecklistTemplateId ==
                                            item.ChecklistTemplateId
                                          ) {
                                            checkPointsDetails[i].RadioValue =
                                              value;
                                            checkPointsDetails[i].ParamMode = 3;
                                            checkPointsDetails[
                                              i
                                            ].Modified = true;
                                            if (value == item.correctAnswer) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 1;
                                              //console.log('correct answer');
                                              console.log(
                                                'checkPointsDetails now',
                                                checkPointsDetails[i].IsCorrect,
                                              );
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                  //].IsNCAllowed = 0; // NC is not allowed & OFI is allowed
                                                ].IsNCAllowed = 2; // NC is not allowed & OFI is not allowed
                                              }
                                            } else if (value == 11) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 2;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 2; // Both NC & OFI is not allowed
                                              }
                                            } else {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              checkPointsDetails[
                                                i
                                              ].IsNCAllowed = 1; // Both NC & OFI is allowed
                                            }
                                            if (item.scoreType == 2) {
                                              if (
                                                value ==
                                                parseInt(item.correctAnswer)
                                              ) {
                                                checkPointsDetails[i].Score =
                                                  item.maxScore;
                                              } else {
                                                checkPointsDetails[i].Score =
                                                  item.minScore;
                                              }
                                            }
                                          }
                                        }
                                        if (isNCClearRequired) {
                                          this.setState(
                                            {
                                              ncRemovalTemplateId:
                                                ncRemovalTemplateId,
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                              dialogVisibleNCR: true,
                                            },
                                            () => {
                                            },
                                          );
                                        } else {
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                            },
                                          );
                                        }
                                      }}}
                                      formHorizontal={true}
                                      labelHorizontal={true}
                                      buttonSize={15}
                                      labelStyle={{
                                        color: 'black',
                                        paddingRight: 12,
                                      }}
                                    />
                                    {this.state.ncofiSetting === 'true' &&
                                      this.state.dropdownnotokvalue === 10 && (
                                        <TouchableOpacity
                                          onPress={this.popupModal.bind(
                                            this,
                                            this.state.checkPointsDetails[
                                              index
                                            ],
                                          )}
                                          style={styles.ncofi}>
                                          <Text
                                            style={{
                                              color: 'white',
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            NC/OFI
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    {this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 2 &&
                                    this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 0 &&
                                    this.state.TemplateID !== 5 &&
                                    this.state.ischeckLPA !== true ? (
                                      <TouchableOpacity
                                        onPress={this.popupModal.bind(
                                          this,
                                          this.state.checkPointsDetails[index],
                                        )}
                                        style={styles.ncofi}>
                                        <Text
                                          style={{
                                            color: 'white',
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          NC/OFI
                                        </Text>
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                ) : item.ansType == 'M4' &&
                                  item.scoreType !== 3 ? (
                                  <View style={styles.boxsecRadio}>
                                    <RadioForm
                                      radio_props={radio_props4}
                                      initial={
                                        this.state.checkpointList.length > 0 ||
                                        this.state.checkPointsDetails.length > 0
                                          ? parseInt(
                                              this.state.checkpointList[index]
                                                .Status,
                                            ) == 1 ||
                                            parseInt(
                                              this.state.checkPointsDetails[
                                                index
                                              ].RadioValue,
                                            ) == 14
                                            ? 0
                                            : parseInt(
                                                this.state.checkpointList[index]
                                                  .Status,
                                              ) == 0 ||
                                              parseInt(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].RadioValue,
                                              ) == 15
                                            ? 1
                                            : parseInt(
                                                this.state.checkpointList[index]
                                                  .Status,
                                              ) == 2 ||
                                              parseInt(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].RadioValue,
                                              ) == 11
                                             
                                            ? 2
                                            : -1
                                          : -1
                                      }
                                      onPress={value => {
                                        console.log("Load:Category:Radio Press",value)
                                     {value === 15 ?
                                      this.handleNotOkClick() :
                                                                                                                 
                                     this.ncofisetting(value);
                                        //console.log('v+', value);
                                        console.log(
                                          this.state.checkpointList[index]
                                            .Status,
                                          'v++',
                                        );
                                        var checkPointsDetails =
                                          this.state.checkPointsDetails;
                                        var isNCClearRequired = false;
                                        var ncRemovalTemplateId = 0;
                                        for (
                                          var i = 0;
                                          i < checkPointsDetails.length;
                                          i++
                                        ) {
                                          if (
                                            checkPointsDetails[i]
                                              .ChecklistTemplateId ==
                                            item.ChecklistTemplateId
                                          ) {
                                            checkPointsDetails[i].RadioValue =
                                              value;
                                            checkPointsDetails[i].ParamMode = 4;
                                            checkPointsDetails[
                                              i
                                            ].Modified = true;
                                            if (value == item.correctAnswer) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 1;
                                              //console.log('correct answer');
                                              console.log(
                                                'checkPointsDetails now',
                                                checkPointsDetails[i].IsCorrect,
                                              );
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 0; // NC is not allowed & OFI is allowed
                                              }
                                            } else if (value == 11) {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              if (
                                                checkPointsDetails[i]
                                                  .IsNCAllowed == 1
                                              ) {
                                                var dataArr =
                                                  this.props.data.audits
                                                    .ncofiRecords;
                                                var isNCExists = false;
                                                for (
                                                  var k = 0;
                                                  k < dataArr.length;
                                                  k++
                                                ) {
                                                  if (
                                                    dataArr[k].AuditID ==
                                                    this.state.auditId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      dataArr[k].Pending.length;
                                                      j++
                                                    ) {
                                                      if (
                                                        dataArr[k].Pending[j]
                                                          .ChecklistTemplateId ==
                                                          item.ChecklistTemplateId &&
                                                        dataArr[k].Pending[j]
                                                          .Category == 'NC'
                                                      ) {
                                                        isNCExists = true;
                                                      }
                                                    }
                                                  }
                                                }
                                                if (isNCExists) {
                                                  isNCClearRequired = true;
                                                  ncRemovalTemplateId =
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId;
                                                }
                                              }
                                              if (
                                                item.scoreType == 3 &&
                                                checkPointsDetails[i].Score !=
                                                  ''
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j <
                                                  item.scoreTypesData.length;
                                                  j++
                                                ) {
                                                  if (
                                                    item.ChecklistTemplateId ==
                                                      item.scoreTypesData[j]
                                                        .templateId &&
                                                    checkPointsDetails[i]
                                                      .Score ==
                                                      item.scoreTypesData[j].id
                                                  ) {
                                                    if (
                                                      item.scoreTypesData[j]
                                                        .status == '1'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 1;
                                                      break;
                                                    } else if (
                                                      item.scoreTypesData[j]
                                                        .status == '2' ||
                                                      item.scoreTypesData[j]
                                                        .status == '3'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 0;
                                                      break;
                                                    } else {
                                                      checkPointsDetails[
                                                        i
                                                      ].IsNCAllowed = 2;
                                                      break;
                                                    }
                                                  }
                                                }
                                              } else {
                                                checkPointsDetails[
                                                  i
                                                ].IsNCAllowed = 2; // Both NC & OFI is not allowed
                                              }
                                            } else {
                                              checkPointsDetails[
                                                i
                                              ].IsCorrect = 0;
                                              checkPointsDetails[
                                                i
                                              ].IsNCAllowed = 1; // Both NC & OFI is allowed
                                            }
                                            if (item.scoreType == 2) {
                                              if (
                                                value ==
                                                parseInt(item.correctAnswer)
                                              ) {
                                                checkPointsDetails[i].Score =
                                                  item.maxScore;
                                              } else {
                                                checkPointsDetails[i].Score =
                                                  item.minScore;
                                              }
                                            }
                                          }
                                        }
                                        if (isNCClearRequired) {
                                          this.setState(
                                            {
                                              ncRemovalTemplateId:
                                                ncRemovalTemplateId,
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                              dialogVisibleNCR: true,
                                            },
                                            () => {
                                            },
                                          );
                                        } else {
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                            },
                                          );
                                        }
                                      }}}
                                      formHorizontal={true}
                                      labelHorizontal={true}
                                      buttonSize={15}
                                      labelStyle={{
                                        color: 'black',
                                        paddingRight: 12,
                                      }}
                                    />
                                    {this.state.ncofiSetting === 'true' &&
                                      this.state.dropdownnotokvalue === 15 && (
                                        <TouchableOpacity
                                          onPress={this.popupModal.bind(
                                            this,
                                            this.state.checkPointsDetails[
                                              index
                                            ],
                                          )}
                                          style={styles.ncofi}>
                                          <Text
                                            style={{
                                              color: 'white',
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            NC/OFI
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    {this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 2 &&
                                    this.state.checkPointsDetails[index]
                                      .IsNCAllowed != 0 &&
                                    this.state.TemplateID !== 5 &&
                                    this.state.ischeckLPA !== true &&
                                    this.state.ReportId === 11 ? (
                                      <TouchableOpacity
                                        onPress={this.popupModal.bind(
                                          this,
                                          this.state.checkPointsDetails[index],
                                        )}
                                        style={styles.ncofi}>
                                        <Text
                                          style={{
                                            color: 'white',
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          NC/OFI
                                        </Text>
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                ) : null}
                                {/*new nc button*/}

                                {/* <View>
                                  {this.state.ncofisettingvalue === 'true' &&
                                  this.state.TemplateID !== 5 &&
                                  this.state.TemplateID < 8 ? (
                                    <TouchableOpacity
                                      onPress={this.popupModal.bind(
                                        this,
                                        this.state.checkPointsDetails[index],
                                      )}
                                      style={styles.ncofi}>
                                      <Text
                                        style={{
                                          color: 'white',
                                          fontFamily: 'OpenSans-Regular',
                                        }}>
                                        NC/OFI8
                                      </Text>
                                    </TouchableOpacity>
                                  ) : null}
                                </View> */}
                                
  {this.state.checkPointsDetails[index].Score == -1 || this.state.checkPointsDetails[index].Score == 2 || this.state.checkPointsDetails[index].Score == 'N/A' || this.state.checkPointsDetails[index].Score == -2 ? null:<>{
                                    item.scoreType == 3 &&
                                    this.state.checkPointsDetails[index].Score !==
                                      '' &&
                                    this.state.checkPointsDetails[index].Score !==
                                      'N/A' &&
                                    this.state.checkPointsDetails[index].Score !=
                                      '-2' &&
                                    // this.state.checkPointsDetails[index].Score ==
                                    //   0 &&
                                    this.state.score_text_plsslct == false &&
                                    (this.state.checkPointsDetails[index]
                                      .show_nc_ofi_status == 1 ||
                                      this.state.checkPointsDetails[index]
                                        .show_nc_ofi_status == 2 ||
                                      this.state.checkPointsDetails[index]
                                        .show_nc_ofi_status == 3 || this.state.checkPointsDetails[index]
                                        .show_nc_ofi_status == 4) &&
                                    this.state.TemplateID !== 5 &&
                                    this.state.ischeckLPA !== true ?null:<><View
                                    style={{
                                      width: '100%',
                                      //marginTop:25,
                                      height: 40,
                                    }}>
                                    <TouchableOpacity
                                      onPress={
                                        this.popupModal.bind(
                                          this,
                                          this.state.checkPointsDetails[index],
                                          this.state.checkPointList[index]
                                      )}
                                      style={styles.ncofi}>
                                      <Text
                                        style={{
                                          color: 'white',
                                          fontFamily: 'OpenSans-Regular',
                                        }}>
                                        NC/OFI
                                       </Text>
                                   </TouchableOpacity>
                                  </View></>
                                  }</>} 


                                  {item.scoreType == 3 &&
                                  this.state.checkPointsDetails[index].Score !==
                                    '' &&
                                  this.state.checkPointsDetails[index].Score !==
                                    'N/A' &&
                                  this.state.checkPointsDetails[index].Score !=
                                    '-2' &&
                                  // this.state.checkPointsDetails[index].Score ==
                                  //   0 &&
                                  this.state.score_text_plsslct == false &&
                                  (this.state.checkPointsDetails[index]
                                    .show_nc_ofi_status == 1 ||
                                    this.state.checkPointsDetails[index]
                                      .show_nc_ofi_status == 2 ||
                                    this.state.checkPointsDetails[index]
                                      .show_nc_ofi_status == 3) &&
                                  this.state.TemplateID !== 5 &&
                                  this.state.ischeckLPA !== true ?
                                  // &&
                                  // this.state.ReportId === 11 ? 
                                  (
                                    <View
                                      style={{
                                        width: '100%',
                                        //marginTop:25,
                                        height: 40,
                                      }}>
                                      <TouchableOpacity
                                        onPress={this.popupModal.bind(
                                          this,
                                          this.state.checkPointsDetails[index],
                                        )}
                                        style={styles.ncofi}>
                                        <Text
                                          style={{
                                            color: 'white',
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          NC/OFI
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  ) : null}

                                {this.state.isAttachmentLoaded ? (
                                  this.state.checkPointsDetails[index] ? (
                                    this.state.checkPointsDetails[index]
                                      .AttachmentList.length !== 0 ? (
                                      this.renderAttachment(index)
                                    ) : null
                                  ) : null
                                ) : (
                                  <></>
                                  // this.render_loader()
                                )}
                                <View
                                  style={
                                    styles.boxsec1
                                  }>
                                  <View>
                                    {this.state.checkPointsDetails[index] ? (
                                      this.state.checkPointsDetails[index]
                                        .FileName != '' ? (
                                        <Text
                                          style={{
                                            paddingBottom: 10,
                                            margin: 0,
                                            color: '#A6A6A6',
                                            width: '90%',
                                            fontSize: Fonts.size.medium,
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          {strings.Attachment}
                                        </Text>
                                      ) : null
                                    ) : null}
                                    <TextInput
                                      style={
                                        this.state.checkPointsDetails[index]
                                          ? this.state.checkPointsDetails[index]
                                              .FileName != ''
                                            ? styles.checkPointsTextInputLabel
                                            : styles.checkPointsTextInput
                                          : styles.checkPointsTextInput
                                      }
                                      placeholderTextColor={
                                        item.AttachforNc == 1
                                          ? 'red'
                                          : '#A9A9A9'
                                      }
                                      textColor="#747474"
                                      editable={false}
                                      // placeholder={strings.Attachment}
                                    />
                                  </View>

                                  <View style={styles.attachIcon}>
                                    <TouchableOpacity
                                      onPress={this.chooseCameraOption.bind(
                                        this,
                                        item,
                                        index,
                                      )}>
                                      <Icon
                                        name="plus"
                                        size={25}
                                        color="grey"
                                        style={{bottom: 2}}
                                      />
                                      {item.AttachforNc == 1 ||
                                      item.AttachforOfi ? (
                                        <Icon
                                          name="asterisk"
                                          style={{bottom: 20, right: 10}}
                                          size={8}
                                          color="red"
                                        />
                                      ) : (
                                        <View></View>
                                      )}
                                    </TouchableOpacity>
                                  </View>
                                </View>

                                <View
                                  style={
                                    this.state.checkPointsDetails[index]
                                      .RadioValue == 11 ||
                                    (item.scoreType == 1 &&
                                      parseInt(item.maxScore) == 0) ||
                                    (item.scoreType == 2 &&
                                      this.state.checkPointsDetails[index]
                                        .Score == '') ||
                                    (item.scoreType == 3 &&
                                      item.scoreTypesData.length == 0) ||
                                    item.scoreType == 0
                                      ? styles.boxsecNone
                                      : //? styles.boxsec1
                                        styles.boxsec1
                                  }>
                                
                                  <View style={styles.scoreText}>
                                    {this.state.checkPointsDetails[index] ? (
                                      this.state.checkPointsDetails[index]
                                        .Score != '' ? (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            width: '15%',
                                          }}>
                                          <Text
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                              color: '#A6A6A6',
                                              width: '90%',
                                              fontSize: Fonts.size.medium,
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {/* {strings.Score} */}
                                          </Text>
                                          {item.scoreType == 1 ? (
                                            <Text
                                              style={{
                                                paddingLeft: 10,
                                                fontFamily: 'OpenSans-Regular',
                                              }}>
                                              {Math.round(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].Score,
                                              )}
                                            </Text>
                                          ) : null}
                                        </View>
                                      ) : (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            width: '15%',
                                          }}>
                                          <Text
                                            style={{
                                              padding: 0,
                                              margin: 0,
                                              color: '#A6A6A6',
                                              width: '100%',
                                              fontSize: Fonts.size.medium,
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {strings.Score}
                                          </Text>
                                        </View>
                                      )
                                    ) : null}
                                    {item.scoreType == 1 ? (
                                      <View style={{flexDirection: 'column'}}>
                                        <Slider
                                          value={
                                            this.state.checkPointsDetails[index]
                                              .Score == ''
                                              ? Number(item.minScore)
                                              : Number(
                                                  this.state.checkPointsDetails[
                                                    index
                                                  ].Score,
                                                )
                                          }
                                          maximumValue={parseInt(item.maxScore)}
                                          minimumValue={parseInt(item.minScore)}
                                          style={{width: '80%'}}
                                          thumbTintColor={'#343434'}
                                          minimumTrackTintColor={'#00B0D9'}
                                          maximumTrackTintColor={'#00B0D9'}
                                          animationType={'timing'}
                                          thumbStyle={{
                                            elevation: 5,
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth: 0.5,
                                          }}
                                          onSlidingComplete={value => {
                                            var isValid = false;
                                            if (
                                              Math.round(value) <=
                                                parseInt(item.maxScore) &&
                                              Math.round(value) >=
                                                parseInt(item.minScore)
                                            ) {
                                              isValid = true;
                                            }
                                            if (!isValid) {
                                              this.refs.toast.show(
                                                strings.Score_alert +
                                                  '(' +
                                                  strings.Min +
                                                  ': ' +
                                                  item.minScore +
                                                  ', ' +
                                                  strings.Max +
                                                  ': ' +
                                                  item.maxScore +
                                                  ')',
                                                DURATION.LENGTH_LONG,
                                              );
                                            }
                                            var checkPointsDetails =
                                              this.state.checkPointsDetails;
                                            for (
                                              var i = 0;
                                              i < checkPointsDetails.length;
                                              i++
                                            ) {
                                              if (
                                                checkPointsDetails[i]
                                                  .ChecklistTemplateId ==
                                                item.ChecklistTemplateId
                                              ) {
                                                checkPointsDetails[i].Score =
                                                  Math.round(value);
                                                if (!isValid) {
                                                  checkPointsDetails[
                                                    i
                                                  ].isScoreValid = false;
                                                  checkPointsDetails[
                                                    i
                                                  ].scoreInvalidMsg =
                                                    strings.Score_alert +
                                                    '(' +
                                                    strings.Min +
                                                    ': ' +
                                                    item.minScore +
                                                    ', ' +
                                                    strings.Max +
                                                    ': ' +
                                                    item.maxScore +
                                                    ')';
                                                } else {
                                                  checkPointsDetails[
                                                    i
                                                  ].isScoreValid = true;
                                                  checkPointsDetails[
                                                    i
                                                  ].scoreInvalidMsg = '';
                                                  checkPointsDetails[
                                                    i
                                                  ].Modified = true;
                                                }
                                              }
                                            }
                                            this.setState(
                                              {
                                                checkPointsDetails:
                                                  checkPointsDetails,
                                                isFormValid: isValid,
                                                isUnsavedData: true,
                                              },
                                              () => {
                                                // //console.log('checkPointsDetails', this.state.checkPointsDetails)
                                              },
                                            );
                                          }}
                                        />
                                        <View
                                          style={{
                                            padding: 6,
                                            bottom: 12,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: '80%',
                                          }}>
                                          <Text
                                            style={{
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {parseInt(item.minScore)}
                                          </Text>
                                          <Text
                                            style={{
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {parseInt(item.maxScore)}
                                          </Text>
                                        </View>
                                      </View>
                                    ) : item.scoreType == 2 ? (
                                      <TextInput
                                        style={[
                                          this.state.checkPointsDetails[index]
                                            ? this.state.checkPointsDetails[
                                                index
                                              ].Score != ''
                                              ? styles.checkPointsTextInputLabel
                                              : styles.checkPointsTextInput
                                            : styles.checkPointsTextInput,
                                        ]}
                                        placeholderTextColor="#A9A9A9"
                                        textColor="#747474"
                                        value={
                                          this.state.checkPointsDetails.length >
                                          0
                                            ? this.state.checkPointsDetails[
                                                index
                                              ].Score
                                            : ''
                                        }
                                        placeholder={strings.Score}
                                        editable={false}
                                      />
                                    ) : item.scoreType == 3 ? (
                                      //) : item.scoreType == 0 ? (
                                      <View>
                                        {this.props.data.audits.smdata !== 2 ||
                                        this.props.data.audits.smdata !== 3 ? (
                                          <Dropdown
                                            itemPadding={7}
                                            baseColor={'black'}
                                            textColor="black"
                                            itemColor="black"
                                            fontSize={Fonts.size.medium}
                                            labelFontSize={Fonts.size.small}
                                            dropdownOffset={{top: 10, left: 0}}
                                            itemTextStyle={{
                                              fontFamily: 'OpenSans-Regular',
                                              backgroundColor: '#fff',
                                            }}
                                            selectedItemColor={'black'}
                                            dropdownTextStyle={{
                                              numberOfLines: 2,
                                            }}
                                            label={
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  justifyContent:
                                                    'space-between',
                                                  width: '100%',
                                                }}>
                                                <View>
                                                  <Text
                                                    style={{
                                                      color: 'black',
                                                    }}>
                                                    {strings.Score}
                                                  </Text>
                                                </View>
                                                <View
                                                  style={{
                                                    marginHorizontal: 5,
                                                  }}>
                                                  <Icon
                                                    name="circle"
                                                    size={12}
                                            color={this.state.checkPointsDetails[index].IsComplete === 0 && this.state.checkPointsDetails[index].Modified === false ? '#fff' : Colors[this.state.checkPointsDetails[index].Score]}
                                                  />

                                                </View>
                                              </View>
                                            }
                                            value={
                                              this.state.checkPointsDetails[
                                                index
                                              ].Score === '-2'
                                                ? 'Please Select'
                                                : this.state.checkPointsDetails[
                                                    index
                                                  ].Scoretext
                                            }
                                            onChangeText={(
                                              value,
                                              index,
                                              data,
                                            ) => {
                                              console.log(
                                                value,
                                                data[index].id,
                                                'ttvalue',
                                              );
                                              this.toggleDropdown();
                                              const scoreindex = data[index].id;
                                              const text =
                                                value == 'Please select'
                                                  ? '-3'
                                                  : value;
                                              //console.log('Text', text);

                                              if (text == 'Please select') {
                                                this.setState({
                                                  score_text_plsslct: true,
                                                });
                                              }

                                              if (text !== 'Please select') {
                                                var checkPointsDetails =
                                                  this.state.checkPointsDetails;
                                                for (
                                                  var i = 0;
                                                  i < checkPointsDetails.length;
                                                  i++
                                                ) {
                                                  if (
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId ==
                                                    item.ChecklistTemplateId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      item.scoreTypesData
                                                        .length;
                                                      j++
                                                    ) {
                                                      if (
                                                        item.ChecklistTemplateId ==
                                                          item.scoreTypesData[j]
                                                            .templateId &&
                                                        text ==
                                                          item.scoreTypesData[j]
                                                            .value
                                                        //item.scoreTypesData[j].id
                                                      ) {
                                                        console.log(
                                                          'textvalue' +
                                                            item.scoreTypesData[
                                                              j
                                                            ].value,
                                                        );
                                                        console.log(
                                                          'status in score type data: ' +
                                                            item.scoreTypesData[
                                                              j
                                                            ].status,
                                                        );

                                                        console.log(
                                                          'ColorVerification',
                                                          item.scoreTypesData[j]
                                                            .color,
                                                        );
                                                        this.setState({
                                                          Status_nc_ofi:
                                                            item.scoreTypesData[
                                                              j
                                                            ].status,
                                                        });
                                                        checkPointsDetails[
                                                          i
                                                        ].show_nc_ofi_status =
                                                          item.scoreTypesData[
                                                            j
                                                          ].status;

                                                        if (
                                                          item.scoreTypesData[j]
                                                            .status == '1'
                                                        ) {
                                                          checkPointsDetails[
                                                            i
                                                          ].IsNCAllowed = 1;
                                                          break;
                                                        } else if (
                                                          item.scoreTypesData[j]
                                                            .status == '2' ||
                                                          item.scoreTypesData[j]
                                                            .status == '3'
                                                        ) {
                                                          if (
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                              item.correctAnswer ||
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                              11 ||
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue == 0
                                                          ) {
                                                            checkPointsDetails[
                                                              i
                                                            ].IsNCAllowed = 0;
                                                            break;
                                                          }
                                                        } else {
                                                          if (
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                              11 ||
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue == 0
                                                          ) {
                                                            checkPointsDetails[
                                                              i
                                                            ].IsNCAllowed = 2;
                                                            break;
                                                          } else if (
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                            item.correctAnswer
                                                          ) {
                                                            checkPointsDetails[
                                                              i
                                                            ].IsNCAllowed = 0;
                                                            break;
                                                          }
                                                        }
                                                      }
                                                    }
                                                    checkPointsDetails[
                                                      i
                                                    ].Scoretext =
                                                      text == 'N/A'
                                                        ? text
                                                        : text;
                                                    // : parseInt(text);
                                                    checkPointsDetails[
                                                      i
                                                    ].Score =
                                                      scoreindex == 'N/A'
                                                        ? scoreindex
                                                        : scoreindex;
                                                    if (
                                                      checkPointsDetails[i]
                                                        .Scoretext !=
                                                      'Please select'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].Modified = true;
                                                    }
                                                  }
                                                }
                                                this.setState(
                                                  {
                                                    checkPointsDetails:
                                                      checkPointsDetails,
                                                    isUnsavedData: true,
                                                    value: this.state.value + 1,
                                                    score_text_plsslct: false,
                                                    hasValue: true,
                                                  },
                                                  () => {
                                                    // //console.log('checkPointsDetails', this.state.checkPointsDetails)
                                                  },
                                                );
                                              } else {
                                                this.setState({
                                                  hasValue: false,
                                                });
                                              }
                                            }}
                                            data={item.scoreTypesData}
                                          />
                                        ) : (
                                          <Dropdown
                                            itemPadding={7}
                                            label={
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  justifyContent:
                                                    'space-between',
                                                  width: '100%',
                                                }}>
                                                <View>
                                                  <Text
                                                    style={{
                                                      color: 'black',
                                                    }}>
                                                    {strings.Score}
                                                  </Text>
                                                </View>
                                                <View
                                                  style={{
                                                    marginHorizontal: 5,
                                                  }}>
                                                  <Icon
                                                    name="circle"
                                                    size={12}
                                                    color={
                                                      this.state
                                                        .checkPointsDetails[
                                                        index
                                                      ].IsComplete === 0 &&
                                                      this.state
                                                        .checkPointsDetails[
                                                        index
                                                      ].Modified === false
                                                        ? '#fff'
                                                        : Colors[
                                                            this.state
                                                              .checkPointsDetails[
                                                              index
                                                            ].Score
                                                          ]
                                                    }
                                                  />
                                                </View>
                                              </View>
                                            }
                                            labelTextStyle={{marginBottom: 10}}
                                            baseColor={'black'}
                                            containerStyle={{
                                              backgroundColor: '#fff',
                                              marginVertical: 5,
                                            }}
                                            textColor="black"
                                            itemColor="black"
                                            fontSize={Fonts.size.medium}
                                            labelFontSize={Fonts.size.medium}
                                            dropdownOffset={{
                                              top: 10,
                                              left: 0,
                                            }}
                                            itemTextStyle={{
                                              fontFamily: 'OpenSans-Regular',
                                              backgroundColor:
                                                this.state.checkPointsDetails[
                                                  index.Score
                                                ] == 0
                                                  ? 'red'
                                                  : dropdata.color,
                                            }}
                                            selectedItemColor={'black'}
                                            dropdownTextStyle={{
                                              numberOfLines: 2,
                                            }}
                                            value={
                                              this.state.checkPointsDetails[
                                                index
                                              ].Score === '-2'
                                                ? 'Please select'
                                                : this.state.checkPointsDetails[
                                                    index
                                                  ].Scoretext
                                            }
                                            onChangeText={(
                                              value,
                                              indexvalue,
                                              data,
                                            ) => {
                                              console.log(
                                                Colors[
                                                  this.state.checkPointsDetails[
                                                    index
                                                  ].Score
                                                ],
                                                'colorconsolecheck',
                                              );
                                              console.log(
                                                value,
                                                indexvalue,
                                                'helloconsolecheck',
                                              );
                                              const text =
                                                value == 'Please select'
                                                  ? 'Please select'
                                                  : value;
                                              //console.log('Text', text);

                                              if (text == 'Please select') {
                                                this.setState({
                                                  score_text_plsslct: true,
                                                });
                                              }

                                              if (text !== 'Please select') {
                                                var checkPointsDetails =
                                                  this.state.checkPointsDetails;
                                                for (
                                                  var i = 0;
                                                  i < checkPointsDetails.length;
                                                  i++
                                                ) {
                                                  if (
                                                    checkPointsDetails[i]
                                                      .ChecklistTemplateId ==
                                                    item.ChecklistTemplateId
                                                  ) {
                                                    for (
                                                      var j = 0;
                                                      j <
                                                      item.scoreTypesData
                                                        .length;
                                                      j++
                                                    ) {
                                                      if (
                                                        item.ChecklistTemplateId ==
                                                          item.scoreTypesData[j]
                                                            .templateId &&
                                                        text ==
                                                          item.scoreTypesData[j]
                                                            .value
                                                        //item.scoreTypesData[j].id
                                                      ) {
                                                        console.log(
                                                          'status of this checkpoint:' +
                                                            checkPointsDetails[
                                                              i
                                                            ]
                                                              .show_nc_ofi_status,
                                                        );
                                                        console.log(
                                                          'status in score type data: ' +
                                                            item.scoreTypesData[
                                                              j
                                                            ].status,
                                                        );

                                                        this.setState({
                                                          Status_nc_ofi:
                                                            item.scoreTypesData[
                                                              j
                                                            ].status,
                                                        });
                                                        checkPointsDetails[
                                                          i
                                                        ].show_nc_ofi_status =
                                                          item.scoreTypesData[
                                                            j
                                                          ].status;

                                                        if (
                                                          item.scoreTypesData[j]
                                                            .status == '1'
                                                        ) {
                                                          checkPointsDetails[
                                                            i
                                                          ].IsNCAllowed = 1;
                                                          break;
                                                        } else if (
                                                          item.scoreTypesData[j]
                                                            .status == '2' ||
                                                          item.scoreTypesData[j]
                                                            .status == '3'
                                                        ) {
                                                          if (
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                              item.correctAnswer ||
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                              11 ||
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue == 0
                                                          ) {
                                                            checkPointsDetails[
                                                              i
                                                            ].IsNCAllowed = 0;
                                                            break;
                                                          }
                                                        } else {
                                                          if (
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                              11 ||
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue == 0
                                                          ) {
                                                            checkPointsDetails[
                                                              i
                                                            ].IsNCAllowed = 2;
                                                            break;
                                                          } else if (
                                                            checkPointsDetails[
                                                              i
                                                            ].RadioValue ==
                                                            item.correctAnswer
                                                          ) {
                                                            checkPointsDetails[
                                                              i
                                                            ].IsNCAllowed = 0;
                                                            break;
                                                          }
                                                        }
                                                      }
                                                    }
                                                    checkPointsDetails[
                                                      i
                                                    ].Score =
                                                      text == 'N/A' ? -1 : text;
                                                    //: parseInt(text);

                                                    if (
                                                      checkPointsDetails[i]
                                                        .Score !=
                                                      'Please select'
                                                    ) {
                                                      checkPointsDetails[
                                                        i
                                                      ].Modified = true;
                                                    }
                                                  }
                                                }
                                                this.setState(
                                                  {
                                                    checkPointsDetails:
                                                      checkPointsDetails,
                                                    isUnsavedData: true,
                                                    value: this.state.value + 1,
                                                    score_text_plsslct: false,
                                                    hasValue: true,
                                                  },
                                                  () => {
                                                    // //console.log('checkPointsDetails', this.state.checkPointsDetails)
                                                  },
                                                );
                                              } else {
                                                this.setState({
                                                  hasValue: false,
                                                });
                                              }
                                            }}
                                            data={item.scoreTypesData}
                                          />
                                        )}
                                      </View>
                                    ) : (
                                      <View
                                        style={
                                          item.scoreTypesData.length == 0
                                            ? {
                                                padding: 15,
                                                flexDirection: 'column',
                                                backgroundColor: 'lightgrey',
                                                width: '80%',
                                                height: undefined,
                                                borderRadius: 10,
                                                display: 'none',
                                              }
                                            : {
                                                padding: 15,
                                                flexDirection: 'column',
                                              }
                                        }>
                                        {this.state.checkPointsDetails[index]
                                          .Score != '' ? (
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              width: '15%',
                                            }}>
                                            <Text
                                              style={
                                                this.state.checkPointsDetails[
                                                  index
                                                ].isScoreValid == true
                                                  ? {
                                                      padding: 0,
                                                      margin: 0,
                                                      color: '#A6A6A6',
                                                      width: '90%',
                                                      fontSize:
                                                        Fonts.size.medium,
                                                      fontFamily:
                                                        'OpenSans-Regular',
                                                    }
                                                  : {
                                                      padding: 0,
                                                      margin: 0,
                                                      color: 'red',
                                                      width: '90%',
                                                      fontSize:
                                                        Fonts.size.medium,
                                                      fontFamily:
                                                        'OpenSans-Regular',
                                                    }
                                              }>
                                              {strings.Score}
                                            </Text>
                                            {/* <Text style={{paddingLeft:10}}>{Math.round(this.state.checkPointsDetails[i].Score) == 0 ? 0:Math.round(this.state.checkPointsDetails[i].Score) }</Text>  */}
                                          </View>
                                        ) : null}
                                        {parseInt(item.maxScore) == 0 &&
                                        parseInt(item.minScore) == 0 ? (
                                          <Text
                                            style={{
                                              fontSize: Fonts.size.regular,
                                              fontFamily: 'OpenSans-Regular',
                                            }}>
                                            {item.maxScore}
                                          </Text>
                                        ) : (
                                          <Slider
                                            value={
                                              this.state.checkPointsDetails[
                                                index
                                              ].Score == ''
                                                ? Number(item.minScore)
                                                : Number(
                                                    this.state
                                                      .checkPointsDetails[index]
                                                      .Score,
                                                  )
                                            }
                                            maximumValue={parseInt(
                                              item.maxScore,
                                            )}
                                            minimumValue={parseInt(
                                              item.minScore,
                                            )}
                                            style={{width: '80%'}}
                                            thumbTintColor={'#343434'}
                                            minimumTrackTintColor={'#00B0D9'}
                                            maximumTrackTintColor={'#00B0D9'}
                                            animationType={'timing'}
                                            thumbStyle={{
                                              elevation: 5,
                                              backgroundColor: 'white',
                                              borderColor: 'black',
                                              borderWidth: 0.5,
                                            }}
                                            onSlidingComplete={value => {
                                              // this.setState({ scorevalue : Math.round(value) })
                                              var isValid = false;
                                              if (
                                                Math.round(value) <=
                                                  parseInt(item.maxScore) &&
                                                Math.round(value) >=
                                                  parseInt(item.minScore)
                                              ) {
                                                isValid = true;
                                              }
                                              if (!isValid) {
                                                this.refs.toast.show(
                                                  strings.Score_alert +
                                                    '(' +
                                                    strings.Min +
                                                    ': ' +
                                                    item.minScore +
                                                    ', ' +
                                                    strings.Max +
                                                    ': ' +
                                                    item.maxScore +
                                                    ')',
                                                  DURATION.LENGTH_LONG,
                                                );
                                              }
                                              var checkPointsDetails =
                                                this.state.checkPointsDetails;
                                              for (
                                                var i = 0;
                                                i < checkPointsDetails.length;
                                                i++
                                              ) {
                                                if (
                                                  checkPointsDetails[i]
                                                    .ChecklistTemplateId ==
                                                  item.ChecklistTemplateId
                                                ) {
                                                  checkPointsDetails[i].Score =
                                                    Math.round(value);
                                                  if (!isValid) {
                                                    checkPointsDetails[
                                                      i
                                                    ].isScoreValid = false;
                                                    checkPointsDetails[
                                                      i
                                                    ].scoreInvalidMsg =
                                                      strings.Score_alert +
                                                      '(' +
                                                      strings.Min +
                                                      ': ' +
                                                      item.minScore +
                                                      ', ' +
                                                      strings.Max +
                                                      ': ' +
                                                      item.maxScore +
                                                      ')';
                                                  } else {
                                                    checkPointsDetails[
                                                      i
                                                    ].isScoreValid = true;
                                                    checkPointsDetails[
                                                      i
                                                    ].scoreInvalidMsg = '';
                                                    checkPointsDetails[
                                                      i
                                                    ].Modified = true;
                                                  }
                                                }
                                              }
                                              this.setState(
                                                {
                                                  checkPointsDetails:
                                                    checkPointsDetails,
                                                  isFormValid: isValid,
                                                  isUnsavedData: true,
                                                },
                                                () => {
                                                  // //console.log('checkPointsDetails', this.state.checkPointsDetails)
                                                },
                                              );
                                            }}
                                          />
                                        )}
                                        {parseInt(item.maxScore) == 0 &&
                                        parseInt(item.minScore) == 0 ? null : (
                                          <View
                                            style={{
                                              padding: 5,
                                              bottom: 15,
                                              flexDirection: 'row',
                                              justifyContent: 'space-between',
                                              width: '80%',
                                            }}>
                                            <Text
                                              style={{
                                                fontFamily: 'OpenSans-Regular',
                                              }}>
                                              {parseInt(item.minScore)}
                                            </Text>
                                            <Text
                                              style={{
                                                fontFamily: 'OpenSans-Regular',
                                              }}>
                                              {parseInt(item.maxScore)}
                                            </Text>
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                </View>

                                {this.state.ischeckLPA ? (
                                  <View
                                    style={
                                      this.state.checkPointsDetails[index]
                                        .RadioValue == 11 ||
                                      this.state.checkPointsDetails[index]
                                        .RadioValue == 9
                                        ? styles.boxsecNone
                                        : styles.boxsec1
                                    }>
                                    {this.state.checkPointsDetails[index] ? (
                                      this.state.checkPointsDetails[index]
                                        .Correction != '' ? (
                                        <Text
                                          style={{
                                            padding: 0,
                                            margin: 0,
                                            color: '#A6A6A6',
                                            width: '90%',
                                            fontSize: Fonts.size.small,
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          {strings.Correction}
                                        </Text>
                                      ) : null
                                    ) : null}
                                    <View
                                      style={
                                        this.state.checkPointsDetails[index]
                                          ? this.state.checkPointsDetails[index]
                                              .Correction != ''
                                            ? styles.LPAsec1Label
                                            : styles.LPAsec1
                                          : styles.LPAsec1
                                      }>
                                      <TextInput
                                        style={styles.checkPointsTextInput}
                                        placeholderTextColor="#A9A9A9"
                                        textColor="#747474"
                                        value={
                                          this.state.checkPointsDetails.length >
                                          0
                                            ? this.state.checkPointsDetails[
                                                index
                                              ].Correction
                                            : ''
                                        }
                                        placeholder={strings.Correction}
                                        onChangeText={text => {
                                          //console.log('Writing', text);
                                          var checkPointsDetails =
                                            this.state.checkPointsDetails;
                                          for (
                                            var i = 0;
                                            i < checkPointsDetails.length;
                                            i++
                                          ) {
                                            if (
                                              checkPointsDetails[i]
                                                .ChecklistTemplateId ==
                                              item.ChecklistTemplateId
                                            ) {
                                              checkPointsDetails[i].Correction =
                                                text;
                                              checkPointsDetails[
                                                i
                                              ].Modified = true;
                                            }
                                          }
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                              // //console.log('checkPointsDetails', this.state.checkPointsDetails)
                                            },
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>
                                ) : (
                                  <View></View>
                                )}

                                {this.state.ischeckLPA ? (
                                  <View
                                    style={
                                      this.state.checkPointsDetails[index]
                                        .RadioValue == 11 ||
                                      this.state.checkPointsDetails[index]
                                        .RadioValue == 9
                                        ? styles.boxsecNone
                                        : styles.boxsec1
                                    }>
                                    {dropdata.length > 0 ? (
                                      <Dropdown
                                        label={
                                          this.state.checkPointsDetails[
                                            index
                                          ].Approach.toString() == ''
                                            ? ''
                                            : strings.Choose_Approach
                                        }
                                        containerStyle={{paddingTop: 5}}
                                        itemPadding={5}
                                        baseColor={dropdata.color}
                                        selectedItemColor="black"
                                        textColor="black"
                                        itemColor="black"
                                        fontSize={Fonts.size.medium}
                                        labelFontSize={Fonts.size.small}
                                        dropdownOffset={{top: 10, left: 0}}
                                        itemTextStyle={{
                                          fontFamily: 'OpenSans-Regular',
                                          backgroundColor: dropdata.color,
                                        }}
                                        value={
                                          this.state.checkPointsDetails[index]
                                            .ApproachId !== 0
                                            ? this.approachText(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].ApproachId,
                                              )
                                            : strings.Choose_Approach
                                        }
                                        onChangeText={(value, index, data) => {
                                          var checkPointsDetails =
                                            this.state.checkPointsDetails;
                                          for (
                                            var i = 0;
                                            i < checkPointsDetails.length;
                                            i++
                                          ) {
                                            if (
                                              checkPointsDetails[i]
                                                .ChecklistTemplateId ==
                                              item.ChecklistTemplateId
                                            ) {
                                              for (
                                                var j = 0;
                                                j < data.length;
                                                j++
                                              ) {
                                                if (value == data[j].value) {
                                                  console.log(
                                                    'Approach dropdown',
                                                    value,
                                                  );
                                                  checkPointsDetails[
                                                    i
                                                  ].ApproachId = data[j].id;
                                                  checkPointsDetails[
                                                    i
                                                  ].Modified = true;
                                                  checkPointsDetails[
                                                    i
                                                  ].Approach = value;
                                                }
                                              }
                                            }
                                          }
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                              console.log(
                                                'checkPointsDetails****',
                                                this.state.checkPointsDetails,
                                              );
                                            },
                                          );
                                        }}
                                        data={dropdata}
                                      />
                                    ) : (
                                      <Text
                                        style={{
                                          height: 40,
                                          color: 'grey',
                                          padding: 5,
                                          paddingTop: 10,
                                          fontFamily: 'OpenSans-Regular',
                                        }}>
                                        {strings.No_Approaches_found}
                                      </Text>
                                    )}
                                    <View style={{marginTop: 5}}>
                                      {console.log(
                                        this.state.checkPointsDetails[index],
                                        'helloid6',
                                      )}
                                   <Dropdown
                                        label={'Failure Category'}
                                        value={
                                          this.state.checkPointsDetails[index]
                                            .FailureCategoryId !== 0
                                            ? this.failureCategoryText(
                                                this.state.checkPointsDetails[
                                                  index
                                                ].FailureCategoryId,
                                              )
                                            : 'Choose Failure Category'
                                        }
                                        containerStyle={{ paddingTop: 5 }}
                                        itemPadding={5}
                                        baseColor={dropdata.color}
                                        selectedItemColor="black"
                                        textColor="black"
                                        itemColor="black"
                                        fontSize={Fonts.size.medium}
                                        labelFontSize={Fonts.size.small}
                                        dropdownOffset={{ top: 10, left: 0 }}
                                        itemTextStyle={{
                                          fontFamily: 'OpenSans-Regular',
                                          backgroundColor: dropdata.color,
                                        }}
                                        data={FailCatarray}
                                       
                                        onChangeText={(value, index, data) => {
                                          console.log("Load:Category:",value)
                                          this.failurereasonArray(value);
                                          var checkPointsDetails = this.state.checkPointsDetails;
                                          for (var i = 0; i < checkPointsDetails.length; i++) {
                                            if (checkPointsDetails[i].ChecklistTemplateId == item.ChecklistTemplateId) {
                                              // Reset FailureReasonId when a new FailureCategoryId is selected
                                              checkPointsDetails[i].FailureReasonId = 0;
                                              for (var j = 0; j < data.length; j++) {
                                                if (value == data[j].value) {
                                                  //console.log('Failcat dropdown0', data[j].value);
                                                  checkPointsDetails[i].FailureCategoryId = data[j].id;
                                                  checkPointsDetails[i].Modified = true;
                                                  checkPointsDetails[i].FailureCategoryId = value;
                                                }
                                              }
                                            }
                                          }
                                          this.setState({  checkPointsDetails:
                                            checkPointsDetails,
                                            isUnsavedData: true }, () => {
                                           });
                                        }}
                                      />
                                    </View>
                                    <View style={{ marginTop: 5 }}>
                                      <Dropdown
                                        label={'Failure Reason'}
                                        value={
                                          this.state.checkPointsDetails[index]
                                            .FailureReasonId !== 0
                                            ? this.failureReasonText(
                                              this.state.checkPointsDetails[
                                                index
                                              ].FailureReasonId,
                                            )
                                            : 'Choose Failure Reason'
                                        }
                                        containerStyle={{ paddingTop: 5 }}
                                        itemPadding={5}
                                        baseColor={dropdata.color}
                                        selectedItemColor="black"
                                        textColor="black"
                                        itemColor="black"
                                        fontSize={Fonts.size.medium}
                                        labelFontSize={Fonts.size.small}
                                        dropdownOffset={{ top: 10, left: 0 }}
                                        itemTextStyle={{
                                          fontFamily: 'OpenSans-Regular',
                                          backgroundColor: dropdata.color,
                                        }}
                                        data={this.state.FailReasArraySt}
                                        onChangeText={(value, index, data) => {
                                          var checkPointsDetails =  this.state.checkPointsDetails;      
                                          for ( var i = 0; i < checkPointsDetails.length;  i++

                                          ) {
                                            if (
                                              checkPointsDetails[i]
                                                .ChecklistTemplateId ==
                                              item.ChecklistTemplateId
                                            ) {
                                              for (
                                                var j = 0;
                                                j < data.length;
                                                j++
                                              ) {
                                                if (value == data[j].value) {
                                                  console.log(
                                                    'Failcat dropdown',
                                                    data[j],
                                                    value,
                                                  );
                                                  checkPointsDetails[
                                                    i
                                                  ].FailureReasonId =
                                                    data[j].id;
                                                  checkPointsDetails[
                                                    i
                                                  ].Modified = true;
                                                  checkPointsDetails[
                                                    i
                                                  ].FailureReasonId = value;
                                                }
                                              }
                                            }
                                          }
                                          this.setState(
                                            {
                                              checkPointsDetails:
                                                checkPointsDetails,
                                              isUnsavedData: true,
                                            },
                                            () => {
                                              console.log(
                                                'checkPointsDetails****',
                                                this.state.checkPointsDetails,
                                              );
                                            },
                                          );
                                        }}
                                      />
                                    </View>   
                                  </View>
                                ) : (
                                  <View></View>
                                )}

                                <View style={styles.boxsecRemark}>
                                  <View style={{width: '100%'}}>
                                    {(this.state.TemplateID == '5' ||
                                      this.state.TemplateID == '11') &&
                                    this.state.checkPointsDetails[index]
                                      .Score !== '10' &&
                                    this.state.checkPointsDetails[index]
                                      .Score !== '-1' &&
                                    this.state.checkPointsDetails[index]
                                      .Score !== 'N/A' ? (
                                      <View>
                                        <Text
                                          style={{
                                            padding: 0,
                                            margin: 0,
                                            color: '#A6A6A6',
                                            width: '90%',
                                            fontSize: Fonts.size.small,
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          Immediate Action
                                        </Text>

                                        <Dropdown
                                          label="Please Select"
                                          containerStyle={{paddingTop: 5}}
                                          itemPadding={5}
                                          baseColor={'transparent'}
                                          selectedItemColor="black"
                                          textColor="black"
                                          itemColor="black"
                                          fontSize={Fonts.size.medium}
                                          labelFontSize={Fonts.size.small}
                                          dropdownOffset={{top: 10, left: 0}}
                                          itemTextStyle={{
                                            fontFamily: 'OpenSans-Regular',
                                          }}
                                          value={
                                            this.state.checkPointsDetails[index]
                                              .immediateAction == 'X' ||
                                            this.state.checkPointsDetails[index]
                                              .immediateAction == '1'
                                              ? 'X'
                                              : 'Please Select'
                                          }
                                          onChangeText={(
                                            value,
                                            index,
                                            data,
                                          ) => {
                                            var checkPointsDetails =
                                              this.state.checkPointsDetails;
                                            for (
                                              var i = 0;
                                              i < checkPointsDetails.length;
                                              i++
                                            ) {
                                              if (
                                                checkPointsDetails[i]
                                                  .ChecklistTemplateId ==
                                                item.ChecklistTemplateId
                                              ) {
                                                for (
                                                  var j = 0;
                                                  j < data.length;
                                                  j++
                                                ) {
                                                  if (value == data[j].value) {
                                                    console.log(
                                                      'Approach dropdown',
                                                      value,
                                                    );
                                                    checkPointsDetails[
                                                      i
                                                    ].Modified = true;
                                                    checkPointsDetails[
                                                      i
                                                    ].immediateAction = value;
                                                  }
                                                }
                                              }
                                            }
                                            this.setState(
                                              {
                                                checkPointsDetails:
                                                  checkPointsDetails,
                                                isUnsavedData: true,
                                              },
                                              () => {
                                                console.log(
                                                  'checkPointsDetails****',
                                                  this.state.checkPointsDetails,
                                                );
                                              },
                                            );
                                          }}
                                          data={data}
                                        />
                                      </View>
                                    ) : (
                                      <View></View>
                                    )}
                                    {this.state.checkPointsDetails ? (
                                      this.state.checkPointsDetails[index]
                                        .Remark != '' ? (
                                        <Text
                                          style={{
                                            padding: 0,
                                            margin: 0,
                                            color: '#A6A6A6',
                                            width: '90%',
                                            fontSize: Fonts.size.small,
                                            fontFamily: 'OpenSans-Regular',
                                          }}>
                                          {strings.Remark}
                                        </Text>
                                      ) : null
                                    ) : null}
                                    <TextInput
                                      style={
                                        this.state.checkPointsDetails
                                          ? this.state.checkPointsDetails[index]
                                              .Remark != ''
                                            ? styles.checkPointsTextInputLabel
                                            : styles.checkPointsTextInput
                                          : styles.checkPointsTextInput
                                      }
                                      placeholderTextColor={
                                        item.RemarkforNc ||
                                        item.RemarkforOfi == 1 ||
                                        this.state.checkPointsDetails[index]
                                          .Values !==
                                          this.state.checkPointsDetails[index]
                                            .RadioValue
                                          ? 'red'
                                          : '#A9A9A9'
                                      }
                                      multiline={true}
                                      textColor="#747474"
                                      value={
                                        this.state.checkPointsDetails
                                          ? this.state.checkPointsDetails[index]
                                              .Remark
                                          : ''
                                      }
                                      placeholder={strings.Remark}
                                      onBlur={this.countStatistics.bind(
                                        this,
                                        this.state.checkPointsDetails,
                                      )}
                                      onChangeText={text => {
                                        //console.log('Writing remark', text);
                                        var checkPointsDetails =
                                          this.state.checkPointsDetails;
                                        for (
                                          var i = 0;
                                          i < checkPointsDetails.length;
                                          i++
                                        ) {
                                          if (
                                            checkPointsDetails[i]
                                              .ChecklistTemplateId ==
                                            item.ChecklistTemplateId
                                          ) {
                                            checkPointsDetails[i].Remark = text;
                                            checkPointsDetails[
                                              i
                                            ].Modified = true;
                                          }
                                        }
                                        this.setState(
                                          {
                                            checkPointsDetails:
                                              checkPointsDetails,
                                            isUnsavedData: true,
                                          },
                                          () => {
                                            console.log(
                                              'checkPointsDetails',
                                              this.state.checkPointsDetails,
                                            );
                                          },
                                        );
                                      }}
                                    />
                                  </View>

                                  {item.RemarkforNc == 1 ||
                                  item.RemarkforOfi ? (
                                    <Icon
                                      name="asterisk"
                                      style={{right: 10, top: 10}}
                                      size={8}
                                      color="red"
                                    />
                                  ) : (
                                    <View></View>
                                  )}
                                </View>

                                <View style={styles.bottomBtnView}>
                                  <TouchableOpacity
                                    style={[
                                      styles.backBtn,
                                      {
                                        backgroundColor:
                                          index === 0 ? 'lightgrey' : '#00BAC8',
                                      },
                                    ]}
                                    onPress={() => this.onBack(index)}>
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        color: index === 0 ? 'grey' : 'white',
                                        fontFamily: 'OpenSans-Regular',
                                      }}>
                                      {strings.previous}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      styles.nextBtn,
                                      {
                                        backgroundColor:
                                          index ===
                                          this.state.checkpointList.length - 1
                                            ? 'lightgrey'
                                            : '#00BAC8',
                                      },
                                    ]}
                                    onPress={() => this.onNext(index,item)}>
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        color:
                                          index ===
                                          this.state.checkpointList.length - 1
                                            ? 'grey'
                                            : 'white',
                                        fontFamily: 'OpenSans-Regular',
                                      }}>
                                      {strings.next}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                            <View style={{width: '100%', height: 400}}></View>
                          </ScrollView>
                        );
                      }}
                      sliderWidth={Width}
                      itemWidth={Width}
                    />
                  ) : (
                    this.render_loader
                  )}
                </View>
              </View>
            ) : (
              <View style={{marginTop: 55}}>
                <Text style={styles.noRecordsFound}>
                  {strings.No_checkpoints_found}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            {/* <Bars size={20} color='#48BCF7'/> */}
            <ResponsiveImage
              source={Images.ContentLoader}
              initHeight={100}
              initWidth={100}
            />
            <Text
              style={{
                fontSize: Fonts.size.regular,
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.cp_01}
            </Text>
            <Text
              style={{
                fontSize: Fonts.size.small,
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.cp_02}
            </Text>
          </View>
        )}

        {this.state.checkpointList.length > 0 ? (
          <View style={styles.footer}>
            <Image
              style={{
                width: '100%',
                height: 65,
              }}
              source={Images.Footer}
            />

            {this.state.isSaving == false ? (
              <View style={styles.footerDiv}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'column',
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.setState({dialogVisibleReset: true})}>
                    <Icon name="undo" size={25} color="white" />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.regular,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Reset}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: width(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={Images.lineIcon} />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'column',
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={debounce(
                      this.updateCheckPointsValues.bind(this),
                      1500,
                    )}>
                    <Icon name="save" size={25} color="white" />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.regular,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Save}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{right: 70, position: 'absolute'}}>
                <Pulse size={20} color="white" />
              </View>
            )}
          </View>
        ) : null}

        <Modal
          isVisible={this.state.dialogVisibleNC}
          onBackdropPress={() => this.setState({dialogVisibleNC: false})}
          style={styles.modalOuterBox}>
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>
              <View style={styles.modalheading}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Make_your_selection}
                  </Text>
                </View>
              </View>

              {(this.state.radiovalue_ncofi == 9 ||
              //  this.state.radiovalue_ncofi == 10 ||
              this.state.radiovalue_ncofi == 14 ||
              //   this.state.radiovalue_ncofi == 15 ||
              this.state.Status_nc_ofi == 1 ||
             ( this.state.Status_nc_ofi == 2 &&
              this.state.radiovalue_ncofi !== 11)) && this.state.radiovalue_ncofi !==""? (
                <TouchableOpacity
                  onPress={this.navigateTo.bind(
                    this,
                    'NC',
                    this.state.radiovalue_ncofi,
                  )}>
                  <View style={styles.sectionTop}>
                    <View style={styles.sectionContent}>
                      <Text style={styles.boxContent}>{strings.NC}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : this.state.radiovalue_ncofi !== 11 && this.state.radiovalue_ncofi !== "" ? (
                <TouchableOpacity
                  onPress={this.navigateTo.bind(
                    this,
                    'NC',
                    this.state.radiovalue_ncofi,
                  )}>
                  <View style={styles.sectionTop}>
                    <View style={styles.sectionContent}>
                      {this.state.radiovalue_ncofi == 10 || this.state.radiovalue_ncofi == 15 ? (
                      <Text style={styles.boxContent}>{'EDIT NC'}</Text>):null}
                    </View>
                  </View>
                </TouchableOpacity>
              ):null}

              {this.state.radiovalue_ncofi == 9 ||
              this.state.radiovalue_ncofi == 10 ||
              this.state.radiovalue_ncofi == 14 ||
              this.state.radiovalue_ncofi == 15 ||
              this.state.Status_nc_ofi == 3 ||
              this.state.Status_nc_ofi == 2 ? (
                <TouchableOpacity onPress={this.navigateTo.bind(this, 'OFI')}>
                  <View style={styles.sectionTop}>
                    <View style={styles.sectionContent}>
                      <Text style={styles.boxContent}>{strings.OFI}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => this.setState({dialogVisibleNC: false})}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.Cancel}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal */}

        <Modal
          isVisible={this.state.dialogVisible}
          onBackdropPress={() =>
            this.setState({dialogVisible: false, go_home: false})
          }
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}>
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>
              <View style={styles.modalheading}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Confirm}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionTop}>
                <View style={styles.sectionContent}>
                  <Text style={styles.boxContent}>
                    {strings.Confirm_message}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={this.updateCheckPointsValues.bind(this)}>
                <View style={styles.sectionBtn}>
                  <Text style={styles.boxContent}>{strings.yes}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({dialogVisible: false}, () => {
                    this.state.go_home
                      ? this.props.navigation.navigate('AuditDashboard')
                      : this.props.navigation.goBack();
                  })
                }>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.dialogVisibleNCR}
          onBackdropPress={() => this.setState({dialogVisibleNCR: false})}
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}>
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>
              <View style={styles.modalheading}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Confirm}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionTop}>
                <View style={styles.sectionContent}>
                  <Text style={styles.boxContent}>
                    {strings.NC_Confirm_message}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={this.clearNcCheckpoint}>
                <View style={styles.sectionBtn}>
                  <Text style={styles.boxContent}>{strings.yes}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({dialogVisibleNCR: false})}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal design */}
        <Modal
          isVisible={this.state.dialogVisibleCamera}
          onBackdropPress={() => this.setState({dialogVisibleCamera: false})}
          style={styles.modalOuterBox}>
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>
              <View style={styles.modalheading}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Make_your_selection}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={this.cameraAction.bind(this, 'Camera')}>
                <View style={styles.sectionTop}>
                  <View style={[styles.sectionContent, styles.boxContent]}>
                    <View style={{width: '12%', height: null}}>
                      <Icon name="camera" size={25} color="grey" />
                    </View>
                    <View
                      style={{
                        width: '88%',
                        height: null,
                        justifyContent: 'flex-start',
                      }}>
                      <Text style={styles.boxContentCam}>
                        {strings.Camera_Capture_Head}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.cameraAction.bind(this, 'Browse')}>
                <View style={styles.sectionTop}>
                  <View style={[styles.sectionContent, styles.boxContent]}>
                    <View style={{width: '12%', height: null}}>
                      <Icon name="file-image-o" size={25} color="grey" />
                    </View>
                    <View style={{width: '88%', height: null}}>
                      <Text style={styles.boxContentCam}>
                        {strings.Camera_Browse_Files}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({dialogVisibleCamera: false})}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.Cancel}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.dialogVisibleReset}
          onBackdropPress={() => this.setState({dialogVisibleReset: false})}
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}>
          <View style={styles.ncModal}>
            <View>
              <View style={styles.modalheading}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Fonts.size.regular,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.Confirm}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionTop}>
                <View style={styles.sectionContent}>
                  <Text style={styles.boxContent}>{strings.ResetField}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={this.clearCheckpoints}>
                <View style={styles.sectionBtn}>
                  <Text style={styles.boxContent}>{strings.yes}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({dialogVisibleReset: false})}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.dialogVisibleAttach}
          onBackdropPress={() => this.setState({dialogVisibleAttach: false})}
          style={styles.modalOuterBox}>
          <View style={styles.modalavatar}>
            <TouchableOpacity
              onPress={() => this.setState({dialogVisibleAttach: false})}
              style={{backgroundColor: 'transparent', height: 60, width: 80}}>
              <View style={{backgroundColor: 'transparent', top: 18}}>
                <Icon
                  style={{left: 8}}
                  name="times-circle"
                  size={40}
                  color="white"
                />
              </View>
            </TouchableOpacity>
            <Image
              style={styles.modelImage}
              source={{uri: this.state.cAttachData}}
            />
          </View>
        </Modal>

        <Modal
          isVisible={this.state.dialogVisibleVideo}
          onBackdropPress={() => this.setState({dialogVisibleVideo: false})}
          style={styles.modalOuterBox}>
          <View style={styles.modalavatar}>
            <TouchableOpacity
              onPress={() => this.setState({dialogVisibleVideo: false})}
              style={{backgroundColor: 'transparent', height: 60, width: 80}}>
              <View style={{backgroundColor: 'transparent', top: 18}}>
                <Icon
                  style={{left: 8}}
                  name="times-circle"
                  size={40}
                  color="white"
                />
              </View>
            </TouchableOpacity>
            <View style={{backgroundColor: 'black', flex: 1}}>
              <View
                style={{
                  height: '80%',
                }}>
                <Video
                  source={{uri: this.state.cAttachData}}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  controls={true}
                  resizeMode={'cover'}
                  ref={ref => {
                    this.player = ref;
                  }}
                  paused={this.state.isPaused}
                  onVideoEnd={() => {
                    this.setState({isPaused: !this.state.isPaused});
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

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
        <ToastNew config={toastConfig} />
      </View>
    );
  }
}
const mapStateToProps = state => {
  //console.log(state, 'propsdataincoming1');

  return {
    data: state,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    storeAuditRecords: auditRecords =>
      dispatch({type: 'STORE_AUDIT_RECORDS', auditRecords}),
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeAudits: audits => dispatch({type: 'STORE_AUDITS', audits}),
    storeCameraCapture: cameraCapture =>
      dispatch({type: 'STORE_CAMERA_CAPTURE', cameraCapture}),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
    saveNavigationParams: navigationParams =>
      dispatch({type: 'SAVE_NAVIGATION_PARAMS', navigationParams}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckPointDemo);
