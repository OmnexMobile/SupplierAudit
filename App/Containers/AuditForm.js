import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Alert,
  TextInput,
  Keyboard,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import { Images } from '../Themes';
import styles from './Styles/AuditFormStyle';
import { width } from 'react-native-dimension';
import Modal from 'react-native-modal';
import CryptoJS from 'crypto-js';

import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import auth from '../Services/Auth';
import OfflineNotice from '../Components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ResponsiveImage from 'react-native-responsive-image';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { strings } from '../Language/Language';
var RNFS = require('react-native-fs');
import base64 from 'react-native-base64';
import NetInfo from '@react-native-community/netinfo';
import FileViewer from 'react-native-file-viewer';
import { create } from 'apisauce';
import { Dropdown } from 'react-native-element-dropdown';
import * as constant from '../Constants/AppConstants';
import DeviceInfo from 'react-native-device-info';
import Moment from 'moment';
import constants from '../Constants/AppConstants';

let Window = Dimensions.get('window');

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
  executionCount = 0;

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      CheckListbtn: false,
      isSyncing: false,
      Formname: '',
      ChecklistProp: [],
      Checkpointlogic: [],
      formDetails: [],
      TempList: [],
      RefList: [],
      OnlineList: [],
      Checkpointpass: [],
      dropvalue: [],
      AuditID: '',
      dialogVisible: false,
      isLoaderVisible: false,
      OnlineName: undefined,
      notifyRed: false,
      breadCrumbText: undefined,
      ActiveTab: 0,
      MandateCheck: false,
      isLowConnection: false,
      AuditOrderId: '',
      missingFileArr: [],
      isMissingFindings: false,
      mandatoryCheck: 0,
      confirmpwd: false,
      pwdentry: undefined,
      deviceId: '',
      isEmptyPwd: undefined,
      generarereport_param: '',
      auditObj: '',
      loopCount: 0,
    };
  }

  componentWillMount() {
    DeviceInfo.getUniqueId().then(deviceId => {
      this.setState({
        deviceId,
      });
    });
    if (this.props.navigation.state.params.SpeechCommand) {
      console.log('Coming from speech command');
      if (this.props.navigation.state.params.SpeechCommand == 'Template') {
        this.setState({ ActiveTab: 1 }, () => {
          console.log('Template Flag ', this.state.ActiveTab);
        });
      } else if (
        this.props.navigation.state.params.SpeechCommand == 'Reference'
      ) {
        this.setState({ ActiveTab: 2 }, () => {
          console.log('Reference Flag ', this.state.ActiveTab);
        });
      }
    }
  }

  componentDidMount() {
    let Files =
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');

    console.log('AuditForm:Ios-Android-Path', Files);
    RNFetchBlob.fs.exists(Files).then(exist => {
      if (!exist || exist == '') {
        RNFetchBlob.fs
          .mkdir(Files)
          .then(data => {
            console.log('AuditForm:data directory created', data);
          })
          .catch(err => {
            console.log('err', err);
          });
      } else if (RNFetchBlob.fs.isDir(Files)) {
        RNFetchBlob.fs.ls(Files).then(data => {
          console.log('AuditForm:All files', data);
        });
      }
    });
    console.log('Auditform mounted', this.props);
    console.log('checkinnngthis.props.navigation.state.params.datapass',this.props.navigation.state.params.datapass);
    // console.log('Recieved props in Audit Form', this.props.navigation.state.params)

    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage('en-US');
        this.setState({});
        console.log('Chinese script off', this.state.ChineseScript);
      });
    }

    if (this.props.navigation.state.params.ChecklistBtn === true) {
      this.setState({ CheckListbtn: true }, () => {
        // console.log('Check list button enabled',this.state.CheckListbtn)
      });
    }

    this.setState(
      {
        token: this.props.data.audits.token,
        AuditID: this.props.navigation.state.params.AuditID,
        Checkpointpass: this.props.navigation.state.params.CreateNCdataBundle,
        breadCrumbText:
          this.props.navigation.state.params.CreateNCdataBundle.breadCrumb,
        // breadCrumbText: this.props.navigation.state.params.CreateNCdataBundle.breadCrumb.length > 30 ? this.props.navigation.state.params.CreateNCdataBundle.breadCrumb.slice(0, 30) + '...' : this.props.navigation.state.params.CreateNCdataBundle.breadCrumb
        // dropPass: this.props.navigation.state.params.DropDownVal
        // formDetails : this.props.navigation.state.params.FormDetails /*=== undefined ? 'N/A' : this.props.navigation.state.params.FormDetails.FormName*/ ,
        // ChecklistProp : this.props.navigation.state.params.ChecklistProp,
        // Checkpointlogic: this.props.navigation.state.params.Checkpointlogic,
      },
      () => {
        // console.log('this.state.formdetails',this.state.formDetails)
        // console.log('Form name fetched')
        // console.log('BreadCrumb', this.state.breadCrumbText)
        console.log('AuditForm>-Checkpointpass', this.state.Checkpointpass);
        console.log('AuditForm>-AuditID', this.state.AuditID);

        var auditRecords = this.props.data.audits.auditRecords;

        console.log('AuditForm>-auditRecords', auditRecords);
        var AuditCheckpointDetail = undefined;
        var Formdata = undefined;

        for (var i = 0; i < auditRecords.length; i++) {
          if (this.state.AuditID == auditRecords[i].AuditId) {
            if (auditRecords[i].Formdata) {
              AuditCheckpointDetail =
                auditRecords[i].CheckpointLogic.AuditCheckpointDetail;
              Formdata = auditRecords[i].Formdata;
            }
          }
        }
        this.getFormdeTails();
        console.log('AuditForm>-AuditCheckpointDetail', AuditCheckpointDetail);
        console.log('AuditForm>-Formdata', Formdata);

        if (Formdata && AuditCheckpointDetail) {
          this.countStatistics(AuditCheckpointDetail, Formdata);
        }
      },
    );
  }

  componentWillReceiveProps(props) {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    console.log('--CurrentPage--->', CurrentPage);

    if (CurrentPage == 'AuditForm') {
      console.log('Audit form page focussed!');
      console.log('--AuditForm-PROPS-->', props);
      console.log('--AuditForm-this.PROPS-->', this.props);

      console.log('componentWillReceiveProps', props.data.audits.ncofiRecords);
      this.displayNCSync(props.data.audits.ncofiRecords);
    } else {
      console.log('AuditForm pass');
    }
  }

  countStatistics = (AuditCheckpointDetail, Formdata) => {
    var arr = [];
    for (var i = 0; i < Formdata.length; i++) {
      for (var j = 0; j < AuditCheckpointDetail.length; j++) {
        if (Formdata[i].FormId == AuditCheckpointDetail[j].FormId) {
          arr.push({
            Formdata: AuditCheckpointDetail[j].FormId,
            MandateCount: AuditCheckpointDetail[j].MandatoryCount,
          });
        }
      }
    }
    // var data = checkPointsDetails
    // var pendingCheck = []
    // var completed = []
    // var mandatoryCheck = 0
    // console.log('***',checkPointsDetails)

    // for (var i = 0; i < data.length; i++) {
    //   if (data[i].RemarkforNc === 1 && data[i].AttachforNc === 1) {
    //     mandatoryCheck = mandatoryCheck + 1
    //     if (checkPointsDetails[i].Remark === "" && checkPointsDetails[i].Attachment === "") {
    //       pendingCheck.push(data[i])
    //     }
    //     else if (checkPointsDetails[i].Remark === "" || checkPointsDetails[i].Attachment === "") {
    //       pendingCheck.push(data[i])
    //     }
    //     else {
    //       completed.push(data[i])
    //     }
    //   }
    //   else if (data[i].RemarkforNc === 1) {
    //     mandatoryCheck = mandatoryCheck + 1
    //     if (checkPointsDetails[i].Remark === "") {
    //       pendingCheck.push(data[i])
    //     }
    //     else {
    //       completed.push(data[i])
    //     }
    //   }
    //   else if (data[i].AttachforNc === 1) {
    //     mandatoryCheck = mandatoryCheck + 1
    //     if (checkPointsDetails[i].Attachment === "") {
    //       pendingCheck.push(data[i])
    //     }
    //     else {
    //       completed.push(data[i])
    //     }
    //   }
    //   else {
    //     completed.push(data[i])
    //   }
    // }

    // console.log('data length', data.length)
    // console.log('completed arr-->', completed)
    // console.log('pendingCheck', pendingCheck)
    // console.log('mandatoryCheck', mandatoryCheck)
    // console.log('Executed ---<>')

    this.setState(
      {
        //   mandateCheckpoints: pendingCheck.length,
        //   totalfilled: completed.length,
        //   optionalCheck: data.length - mandatoryCheck,
        //   totalCheck: data.length,
        mandatoryCheck: arr,
      },
      () => {
        //   console.log('total checkpoints filled', this.state.totalfilled)
        //   console.log('total pending checkpoints', this.state.mandateCheckpoints)
        //   console.log('total manadatory checkpoints', this.state.mandatoryCheck)
      },
    );
  };

  displayNCSync(ncofiRecords) {
    var checkNC = ncofiRecords;
    var pendingCount = 0;

    for (var i = 0; i < checkNC.length; i++) {
      if (this.state.AuditID === checkNC[i].AuditID) {
        pendingCount = checkNC[i].Pending.length;
      }
    }

    if (pendingCount === 0) {
      this.setState({ notifyRed: false }, () => {
        console.log('no unsave');
      });
      console.log('isauditing props value' + this.props.data.audits.isAuditing);
    } else if (pendingCount > 0) {
      this.setState({ notifyRed: true }, () => {
        console.log('notify save ncs');
      });
    }

    if (this.props.data.audits.isAuditing === true) {
      this.setState({ notifyRed: true }, () => {
        console.log('changes done in auditing');
      });
    }
  }

  getFormdeTails() {
    var AllData = this.props.data.audits.auditRecords;
    var AuditID = this.state.AuditID;
    var FormData = [];

    // console.log('AllData', AllData)
    // console.log('AuditID', this.state.AuditID)

    for (var i = 0; i < AllData.length; i++) {
      // console.log('AllData.AuditID', AllData[i].AuditId)
      if (this.state.AuditID.toString() == AllData[i].AuditId) {
        console.log('pass');
        FormData = AllData[i].Formdata;
        this.setState(
          {
            AuditOrderId: AllData[i].AuditTypeOrder,
          },
          () => {
            console.log('AuditOrderId', this.state.AuditOrderId);
          },
        );
      }
    }

    // console.log('local form fetch',FormData)
    this.setState({ formDetails: FormData }, () => {
      console.log('this.state.formDetails', this.state.formDetails);
      this.getForname();
    });
  }

  getForname() {
    var ReferenceArr = [];
    var TemplateArr = [];
    var OnlineArr = [];
    var formRefArr = [];
    var fromRefObj = '';
    var formObjArr = [];
    var fromObjobj = '';

    console.log('this.state.formDetails Arr', this.state.formDetails);

    if (this.state.formDetails) {
      for (var i = 0; i < this.state.formDetails.length; i++) {
        if (this.state.formDetails[i].FormType == 2) {
          formRefArr.push(this.state.formDetails[i]);
          console.log('ReferenceArr[i]', formRefArr);
        }
      }
      for (var i = 0; i < formRefArr.length; i++) {
        var fromRefObj = '';
        fromRefObj = {
          AttachedDocument: formRefArr[i].DocName, //uncontrolled link is in DocName
          Attachmenttype: formRefArr[i].Attachmenttype,
          DocName: formRefArr[i].DocName,
          DocumentId: formRefArr[i].DocumentId,
          FormId: formRefArr[i].FormId,
          FormName: formRefArr[i].FormName,
          FormType: formRefArr[i].FormType,
          isModified: formRefArr[i].isModified,
        };
        ReferenceArr.push(fromRefObj);
      }
      console.log('Referance Arr', ReferenceArr);
      for (var i = 0; i < this.state.formDetails.length; i++) {
        if (this.state.formDetails[i].FormType == 0) {
          formObjArr.push(this.state.formDetails[i]);
        }
      }
      for (var i = 0; i < formObjArr.length; i++) {
        var fromObjobj = '';
        fromObjobj = {
          AttachedDocument: formObjArr[i].DocName, //uncontrolled link is in DocName
          Attachmenttype: formObjArr[i].Attachmenttype,
          DocName: formObjArr[i].DocName,
          DocumentId: formObjArr[i].DocumentId,
          FormId: formObjArr[i].FormId,
          FormName: formObjArr[i].FormName,
          FormType: formObjArr[i].FormType,
          isModified: formObjArr[i].isModified,
        };
        TemplateArr.push(fromObjobj);
      }
      console.log('TemplateArr Arr', TemplateArr);
      for (var i = 0; i < this.state.formDetails.length; i++) {
        if (this.state.formDetails[i].FormType == 1) {
          OnlineArr.push(this.state.formDetails[i]);
          // this.setState({ OnlineName : formDetails[i].FormName  },()=>{console.log('Online form detcted')})
        }
      }
      // console.log('OnlineArr Arr',OnlineArr)
    }
    this.setState(
      { RefList: ReferenceArr, TempList: TemplateArr, OnlineList: OnlineArr },
      () => {
        console.log('this.state.Reflist', this.state.RefList);
        console.log('this.state.TempList', this.state.TempList);
        console.log('this.state.onlinelist', this.state.OnlineList);
        // console.log(
        //   'this.state.formID.online',
        // //  this.state.OnlineList[0].FormId,
        // );
      },
    );
  }

  getFormID = () => {
    var formlist = this.state.OnlineList;

    var formids = '';
    for (var i = 0; i < formlist.length; i++) {
      console.log(formlist[i].FormId, 'FormIds-AuditPageid');
      formids += formlist[i].FormId + ',';
    }
    formids = formids.substring(0, formids.length - 1);
    console.log(formids, formlist, 'FormIds-AuditPage');
    return formids;
  };

  onUploadPress() {
    console.log('Upload pressed');
  }

  onCheckPress(item) {
    console.log('Checklist pressed');
    if (this.state.CheckListbtn === false) {
      this.refs.toast.show(strings.No_checkpoint, DURATION.LENGTH_LONG);
    }
    if (this.state.CheckListbtn === true) {
      console.log('===>btnclick', item);
      this.props.navigation.navigate('CheckListMenu', {
        AuditID: this.state.AuditID,
        Checkpass: this.state.Checkpointpass,
        FormId: item.FormId,
        ChecklistHeading: item,
        notifyRed: this.state.notifyRed,
        // LogicPass: this.state.Checkpointlogic,
        // ChecklistProp:this.state.ChecklistProp,
        // dropProps: this.state.dropPass
      });
    }
  }

  onFormClick() {
    console.log('On form pressed');
  }

  syncAuditsToServer() {
    if (this.state.isLowConnection === false) {
      if (this.props.data.audits.isOfflineMode) {
        this.setState(
          {
            dialogVisible: false,
            isSyncing: false,
            isLoaderVisible: false,
          },
          () => {
            this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
          },
        );
      } else {
        NetInfo.fetch().then(isConnected => {
          if (isConnected.isConnected) {
            this.syncStatus = 0;
            this.setState(
              {
                isSyncing: true,
                dialogVisible: false,
                isLoaderVisible: true,
              },
              () => {
                console.log('Sync process started!');
                this.handleConnectionChange();
              },
            );
          } else {
            this.setState(
              {
                dialogVisible: false,
                isSyncing: false,
                isLoaderVisible: false,
              },
              () => {
                this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
              },
            );
          }
        });
      }
    } else {
      this.setState(
        {
          dialogVisible: false,
          isSyncing: false,
          isLoaderVisible: false,
        },
        () => {
          alert(strings.nc_reply_06);
        },
      );
    }
  }

  handleConnectionChange() {
    const TOKEN = this.state.token;
    var audits = this.props.data.audits.auditRecords;
    console.log('auditrecored.......',audits);
    
    var auditRecords = [];
    var auditCheckPoints = [];
    this.auditAttachments = [];
    this.checkListObjects = [];
    this.formObjects = [];
    this.ncOfiObjects = [];
    this.isDocsAvail = false;
    let AttachmentList = [];
    let NewAttachments = [];
    var FormIds = this.getFormID();
    var hasListData = false;
    console.log(FormIds, 'FormIds1');
    FormIds = FormIds != '' ? FormIds.split(',') : '';
    if (audits && this.state.MandateCheck === false) {
      for (var i = 0; i < audits.length; i++) {
        if (audits[i].AuditId == this.state.Checkpointpass.AuditID) {
          if (audits[i].Listdata) {
            console.log('FormIds1audits[i]1.Status', audits[i], FormIds);
            for (var kk = 0; kk < FormIds.length; kk++) {
              auditCheckPoints = [];
              for (var j = 0; j < audits[i].Listdata.length; j++) {
                AttachmentList = audits[i].Listdata[j].AttachmentList;
                NewAttachments = AttachmentList.length > 0 ? AttachmentList.filter((item) => item.Attachment !== "Downloaded" && item.Attachment !== "Synced") : [];


                if (
                  audits[i].Listdata[j].Modified == true &&
                  audits[i].Listdata[j].FormId == FormIds[kk]
                ) {
                  console.log(
                    'FormIds1audits[i]1.Listdata[j]1',
                    audits[i].Listdata[j], NewAttachments
                  );
                  hasListData = true;

                  if (
                    audits[i].Listdata[j].Approach == '' &&
                    NewAttachments.length == 0 &&
                    audits[i].Listdata[j].Correction == 0 &&
                    audits[i].Listdata[j].Remark == '' &&
                    audits[i].Listdata[j].Score == '' &&
                    audits[i].Listdata[j].RadioValue == 0
                  ) {
                    console.log('Nothing is modified');
                  } else {
                    if (NewAttachments.length > 0) {
                      console.log('auditAttachments : has Attachment');
                      this.isDocsAvail = true;
                      for (
                        let k = 0;
                        k < NewAttachments.length;
                        k++
                      ) {

                        let attachment = NewAttachments[k];
                        console.log('auditAttachments : has Attachment - in', attachment);
                        this.auditAttachments.push({
                          Type: 'CL',
                          Id: parseInt(
                            audits[i].Listdata[j].ChecklistTemplateId,
                          ),
                          Obj: '',
                          File: attachment.FileUri,
                          filename: attachment.FileName,
                          FormId:
                            audits[i].Listdata[j].FormId === -1
                              ? 0
                              : audits[i].Listdata[j].FormId,
                          // FileContent: audits[i].Listdata[j].FileContent,
                          SiteLevelId: 0,
                        });
                        console.log(
                          'auditAttachmentsvvvvvvvvvvvvv',
                          this.auditAttachments
                        );
                        console.log(
                          'auditAttachments',
                          this.auditAttachments, NewAttachments, '<-->', attachment
                        );
                      }
                    }

                    //finding score value based on score text....

                    var score_value = 0;
                    console.log(
                      'consolelogs',
                      audits[i].CheckpointLogic.ScoreType,
                    );
                    if (audits[i].Listdata[j].ScoreType == 3) {
                      console.log(
                        'if Score type ==3 then finding score value.. ',
                      );
                      for (
                        var k = 0;
                        k < audits[i].CheckpointLogic.ScoreType.length;
                        k++
                      ) {
                        if (
                          audits[i].CheckpointLogic.ScoreType[k]
                            .ChecklistTemplateId ==
                          audits[i].Listdata[j].ChecklistTemplateId &&
                          audits[i].Listdata[j].Score ==
                          audits[i].CheckpointLogic.ScoreType[k].ScoreText
                        ) {
                          score_value =
                            audits[i].CheckpointLogic.ScoreType[k].ScoreValue;
                          console.log('score value:' + score_value);
                        }
                      }
                    } else {
                      console.log(
                        'if Score type !=3 then set default score value.. ',
                      );
                      score_value =
                        audits[i].Listdata[j].Score !== 0
                          ? parseInt(audits[i].Listdata[j].Score)
                          : 0;
                    }
                    console.log(audits[i], 'formidlength');

                    //let addFiles = audits[i].Listdata[j].AttachmentList.filter((i) => i.Attachment !== 'Downloaded')
                                        let fileNames = NewAttachments.map((it) => it.FileName).join(',')
                    console.log("cjshjhgfsdjgfjsgjfgsjd",this.auditAttachments);
                    auditCheckPoints.push({
                      ChecklistTemplateId: parseInt(
                        audits[i].Listdata[j].ChecklistTemplateId,
                      ),
                      ParentId: audits[i].Listdata[j].ParentId
                        ? parseInt(audits[i].Listdata[j].ParentId)
                        : 0,
                      //AttachmentList: [],
                      Attachment: '',// audits[i].Listdata[j].Attachment,
                      File: '', //audits[i].Listdata[j].File
                      FileType: audits[i].Listdata[j].FileType,
                      FileName: fileNames, //audits[i].Listdata[j].FileName,
                      Remark: audits[i].Listdata[j].Remark,
                      IsNCAllowed: audits[i].Listdata[j].IsNCAllowed,
                      IsCorrect: audits[i].Listdata[j].IsCorrect,
                      ParamMode: audits[i].Listdata[j].ParamMode,
                      ParamValue: audits[i].Listdata[j].RadioValue,
                      Correction:
                        audits[i].Listdata[j].Correction == ''
                          ? 0
                          : audits[i].Listdata[j].Correction,
                      //Approach: audits[i].Listdata[j].Approach === '' ? undefined:audits[i].Listdata[j].Approach,
                      Approach:
                        audits[i].Listdata[j].ApproachId == ''
                          ? 0
                          : audits[i].Listdata[j].ApproachId,
                      //Score: (audits[i].Listdata[j].Score) ? parseInt(audits[i].Listdata[j].Score) : 0,
                      Score: audits[i].Listdata[j].Score
                        ? audits[i].Listdata[j].Score
                        : 0,
                      // Score: score_value,
                      ImmediateAction: audits[i].Listdata[j].immediateAction,
                      Status: audits[i].Status == '' || audits[i].Status == undefined || audits[i].Status == null  ? 0 : parseInt(audits[i].Status),
                      FailureCategoryId:
                        audits[i].Listdata[j].FailureCategoryId,
                      FailureReasonId: audits[i].Listdata[j].FailureReasonId,
                      FormId: audits[i].Listdata[j].FormId,

                      // FormId: audits[i].FormId == '' ? 0 : parseInt(audits[i].FormId),
                    });
                  }
                }
              }


              if (hasListData == true) {
                console.log(FormIds[kk], 'FormIds1entering loop');
                auditRecords.push({
                  // FormId: audits[i].FormId == '' ? 0 : parseInt(audits[i].FormId),
                  FormId: parseInt(FormIds[kk]), //parseInt(audits[i].Listdata[j].FormId),
                  //FormId:this.props.navigation.state.params.ChecklistHeading.FormId,
                  AuditId: parseInt(audits[i].AuditId),
                  AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : parseInt(audits[i].AuditTemplateId),
                  AuditTypeId: parseInt(audits[i].AuditTypeId),
                  AuditOrderId: parseInt(audits[i].AuditTypeOrder),
                  SiteId: parseInt(audits[i].SiteId),
                  UserId: parseInt(audits[i].UserId),
                  FromDocPro: parseInt(audits[i].FromDocPro),
                  DocumentId: parseInt(audits[i].DocumentId),
                  DocRevNo: parseInt(audits[i].DocRevNo),
                  // "Status": parseInt(audits[i].Status),
                  Listdata: auditCheckPoints,
                });
                hasListData = false;
              }

              console.log('FormIds1Checking here--->', auditCheckPoints);
              console.log(
                'FormIds1Checking attachements--->',
                this.auditAttachments,
              );
            }

            console.log(audits[i], 'FormIds1listdatalength===>');
          }
        }
      }
    }

    console.log('FormIds1syncAuditsToServer auditRecords', auditRecords);
    console.log('FormIds1syncAuditsToServer auditRecordsdataaudit', this.props.data.audits.ncofiRecords);


    if (auditRecords) {
      if (auditRecords.length > 0) {
        console.log('FormIds1auditreconethree', auditRecords);
        auth.syncAuditsToServer(auditRecords, TOKEN, (res, data) => {
          console.log('FormIds1120 syncAuditsToServer response', data);

          if (data.data) {
            console.log('logcheck-----', data.data);
            if (data.data.Message === 'Success') {
              console.log('logsuccesscheck-----', data.data.Message);
              if (data.data.Data[0]) {
                console.log(
                  'logsuccesscheckauditstatus-----',
                  data.data.Data[0],
                );

                var responseArray = data.data.Data[0];

                var objRespoonseArray = responseArray.Obj;
                const splitValues = objRespoonseArray.map(item =>
                  item.ObjIdValue.split(','),
                );

                // Flatten the array of arrays into a single array
                const flattenedArray = [].concat(...splitValues);
                console.log(
                  'LOGFOROBJJJJCHECKKKKK-------------',
                  flattenedArray,
                );
                var auditObjArr = []
                flattenedArray.map(item =>
                  auditObjArr.push({
                    obj: item.split('|')[0].trim(),
                    filename: item.split('|')[1].trim()
                  }
                  )

                );

                var auditNumber = responseArray.AuditNumber;
                var auditStatus = responseArray.CloseOutStatus;
                var auditObj = auditObjArr;
                var auditSiteLevelID = responseArray.SiteLevelId;

                this.setState({ auditObj: auditObj });


                console.log('OOBJARRAYLENGTH------------', auditObjArr.length);
                for (var i = 0; i < auditObjArr.length; i++) {
                  var splitTempID = auditObjArr[i].obj.split('-');
                  let smdata = this.props.data.audits.smdata
                  // let index = 3
                  let formid = splitTempID[3];

                  formid = (formid == "0" && (smdata == "1" || smdata == "2") ? -2 : formid == 0 && smdata != "1" ? -1 : parseInt(formid))

                  // if (formid == "") {formid = -2; index = 5;} else index = 4
                  // let templateid = parseInt(splitTempID[index])

                  this.checkListObjects.push({
                    formId: formid, // splitTempID[3] === "0" ? -2 : parseInt(splitTempID[3]),               
                    templateId: parseInt(splitTempID[4]),
                    obj: auditObjArr[i].obj.trim(),
                    filename: auditObjArr[i].filename.trim(),
                    siteLevelId: auditSiteLevelID,
                  });
                }

                console.log(
                  'ChecklistObjectArr',
                  this.checkListObjects,
                  this.auditAttachments,
                );
                console.log('auditAttachments1', this.auditAttachments);

                for (var i = 0; i < this.auditAttachments.length; i++) {
                  for (var j = 0; j < this.checkListObjects.length; j++) {
                    if (
                      this.auditAttachments[i].FormId ==
                      this.checkListObjects[j].formId &&
                      this.auditAttachments[i].Type == 'CL' &&
                      this.auditAttachments[i].Id ==
                      parseInt(this.checkListObjects[j].templateId)
                    ) {
                      console.log('CHECK---------------', this.checkListObjects[j]);
                      this.auditAttachments[i].Obj =
                        this.checkListObjects[j].obj;
                      this.auditAttachments[i].Id = parseInt(
                        this.checkListObjects[j].templateId,
                      );
                      this.auditAttachments[i].SiteLevelId =
                        this.checkListObjects[j].siteLevelId;
                    }
                  }
                }
                //console.log(this.auditAttachments[i].Obj,this.checkListObjects[j].obj,"compare obj")
                console.log(
                  'Request formed after audit formed',
                  this.auditAttachments,
                );

                if (auditStatus == 1) {
                  this.syncStatus = 1;
                  console.log('syncAuditsToServer Success!');
                  this.resetModifiedFlag();
                  // Sync NC/OFIs to server
                  this.handleNCOFIConnection();
                } else {
                  this.syncStatus = 0;
                  console.log('syncAuditsToServer Failed!');
                  this.resetModifiedFlag();

                  this.setState(
                    { isSyncing: false, isLoaderVisible: false },
                    () => {
                      this.refs.toast.show(
                        strings.AuditClosedOut,
                        DURATION.LENGTH_LONG,
                      );
                    },
                  );
                }
              }
            } else {
              this.syncStatus = 0;
              console.log('syncAuditsToServer Failed!');
              //this.resetModifiedFlag()
              // Sync NC/OFIs to server
              this.handleNCOFIConnection();
            }
          } else {
            this.syncStatus = 0;
            console.log('syncAuditsToServer Failed!');
            //this.resetModifiedFlag()
            // Sync NC/OFIs to server
            this.handleNCOFIConnection();
          }
        });
      } else {
        this.syncStatus = 1;
        console.log('syncAuditsToServer Skipped!');
        // Sync audit templates and references to server
        // this.refs.toast.show(strings.Nothing_is_modified,DURATION.LENGTH_LONG)
        this.resetModifiedFlag();
        // Sync NC/OFIs to server
        this.handleNCOFIConnection();
      }
    } else {
      this.syncStatus = 1;
      console.log('syncAuditsToServer Skipped!');
      // Sync audit templates and references to server
      // this.refs.toast.show(strings.Nothing_is_modified,DURATION.LENGTH_LONG)
      this.resetModifiedFlag();
      // Sync NC/OFIs to server
      this.handleNCOFIConnection();
    }
  }

  parseObj(objStr, objType) {
    var refId = 0;
    if (objType == 'CL') {
      var objArr = objStr.split('-');
      if (objArr.length == 6) {
        refId = parseInt(objArr[4]);
      }
    } else if (objType == 'AR') {
      var objArr = objStr.split('-');
      if (objArr.length == 4) {
        refId = parseInt(objArr[2]);
      }
    }
    return refId;
  }

  async syncFilesToDocPro() {
    this.docProRequest();
  }

  docProRequest() {
    return new Promise(async (resolve, reject) => {
      // Dynamic parameters
      // console.log('dksfskfhskdfhsdhfksdhfsdhf893393483993',this.props.data.audits.siteId);
      var dnum = this.state.Checkpointpass.AUDIT_NO;
      var siteId = this.props.data.audits.siteId;
      var UserId = this.props.data.audits.userId;
      var siteid = 'sit' + siteId;
      var effectivedate = Moment(new Date()).format('MM/DD/YYYY');
      var revdate = Moment(new Date()).format('MM/DD/YYYY');
      var deviceId = await DeviceInfo.getUniqueId();
      var token = this.props.data.audits.token;

      // Static parameters
      var langid = 1;
      var userdtfmt = 'MM/DD/YYYY';
      var UserDtFmtDlm = '/';
      var filepath = '';
      var fromdocpro = 0;
      var frommod = 'mod2';
      var doctypeid = 0;
      var mod = 'mod2';
      var link = '';
      var keyword = 'AuditPro';
      var reason = '';
      var rev = 1;
      var paginate = '';
      var chgs_reqd = '';
      var spublic = 0;
      var ModEmailConFig = 0;

      // Request object
      // var formRequestObj = []
      var formRequestArr = [];
      console.log('Forming docpro param', this.auditAttachments);
      let loopCount = 0;
      // console.log('CHECKLIST---------2222222', this.checkListObjects);

      const filteredNCArray = this.auditAttachments.filter(item => item.Type === 'NC');
      // console.log('filteredNCArray---------2222222', filteredNCArray);

        const newArray = filteredNCArray.map(({ File, Type, ...rest }) => rest);
      // console.log('filteredNCArray---------newArray', newArray);
        
    const combinedArray = newArray.concat(this.checkListObjects);
      console.log('filteredNCArray---------combinedArray', combinedArray);

      for (var i = 0; i < this.auditAttachments.length; i++) {
        var formRequestObj = '';

        //   for (var j = 0; j < this.auditAttachments[i].length; j++) {
        // console.log('CHECKLIST---------', this.checkListObjects);
        const parsedData = [];
        const objValues = this.checkListObjects.map(item => item.obj);
        console.log(
          'sdjgfhjsdgfjsgdfhjsdj   b3562536725372-------',
          objValues,
        );
        console.log('into the loop' + i, this.auditAttachments[i]);
        let getdname = this.auditAttachments[i].filename;
        let getfname = this.auditAttachments[i].filename;
        let getext = this.auditAttachments[i].filename.substr(
          this.auditAttachments[i].filename.lastIndexOf('.') + 1,
        );
        loopCount++;
        var FilePath = this.auditAttachments[i].File;

        // for (var k = 0; k < objValues.length; k++) {
        console.log('sdjfbsdvfhjdfghjlength000000000', objValues.length);
        // if (this.executionCount >= objValues.length) {
        //   break;
        // }
        const currentItem = objValues;
        console.log('sdjfbsdvfhjdfghj000000000', currentItem);
        this.executionCount++;
        console.log('loopcountj000000000', this.executionCount);
        let getobj = currentItem;
        console.log('obj===>', getobj);
        let getSitId = this.auditAttachments[i].SiteLevelId;
        console.log('-->33333333', getdname, getfname, getext, getobj, getSitId);
        console.log(
          'filePATH--------------',
          this.auditAttachments[i].File,
        );

        this.convertFile(this.auditAttachments[i].File, i, 0).then(res => {
          let attachment = this.auditAttachments[res.i];
          console.log('jjhjhsdjhsjdhjasdjhajsdh@@@@@@@@@@',attachment);
          let ngetfname = attachment.filename;
          console.log('jjhjhsdjhsjdhjasdjhajsdh@@@@@@@@@@ngetfname',ngetfname);
          
          let ntemplateid = attachment.Id;
          console.log('jjhjhsdjhsjdhjasdjhajsdh@@@@@@@@@@ntemplateid',ntemplateid);

          let nformid = attachment.FormId;
          console.log('jjhjhsdjhsjdhjasdjhajsdh@@@@@@@@@@nformid',nformid);
      console.log('filteredNCArray---------combinedArray12121212', combinedArray);
      console.log('filteredNCArray---------this.ncOfiObjects12121212', this.ncOfiObjects);

      let nobj = []
      if (attachment.Type == "NC"){
        nobj = combinedArray.filter(item => item.filename === ngetfname && item.FormId === nformid);
        console.log("attachment.Type777777",attachment.Type,nobj);
      }else{
        nobj = combinedArray.filter(item => item.filename === ngetfname && item.templateId == ntemplateid && item.formId === nformid);
        console.log("attachment.Type777777",attachment.Type,nobj)
      }
          console.log("Sync:conver", nobj, nobj[0]);
          formRequestObj = {
            dnum: dnum,
            dname: nobj[0].filename || undefined ? nobj[0].filename : '',
            filename: nobj[0].filename || undefined ? nobj[0].filename : '',
            ext: getext,
            filepath:  attachment.File,
            obj: attachment.Type == 'NC'? nobj[0].Obj : nobj[0].obj,
            fromdocpro: fromdocpro,
            frommod: frommod,
            doctypeid: doctypeid,
            siteid: siteid,
            mod: mod,
            sitelevelid: getSitId,
            link: link,
            keyword: keyword,
            reason: reason,
            rev: rev,
            effectivedate: effectivedate,
            revdate: revdate,
            paginate: paginate,
            chgs_reqd: chgs_reqd,
            spublic: spublic,
            ModEmailConFig: ModEmailConFig,
            deviceId: deviceId,

            filecontent: res.data ? res.data : '',
            lstUserPrefModel: [
              {
                siteid: siteId,
                UserId: UserId,
                langid: langid,
                userdtfmt: userdtfmt,
                UserDtFmtDlm: UserDtFmtDlm,
              },
            ],
          };
          formRequestArr.push(formRequestObj);
          console.log('Request array formed', formRequestArr);
          var arr = formRequestArr;
          resolve(arr);
          console.log(
            'formRequestArr.lengthcheck------',
            formRequestArr.length,
            this.auditAttachments.length,
            loopCount,
          );
          if (formRequestArr.length == loopCount) {
            console.log(
              'ArrayCHECKKKKKKK------->,formRequestArr',
              formRequestArr,
            );
            this.attachmentFileApiCall(formRequestArr);

          }
        });

        //  }
      }
      // this.setState({ loopCount });
      console.log('ledfjhxgdfjhsgdfjhs', formRequestArr.length, loopCount);
    });
  }
  attachmentFileApiCall(formRequestArr) {
    var token = this.props.data.audits.token;

    console.log('fromrequestArrayCHECK-------', formRequestArr);
    //const objValues = this.checkListObjects.map(item => item.obj);
    // console.log('fromrequestArrayCHECK--objjjj-----', objValues);

    const formRequestArrPush = [];
    console.log('arraychjdhfjshf-0', arraylistData);
    const arraylistData = formRequestArr;
    console.log('arraychjdhfjshf-1', arraylistData);
    //const objArray = objValues;
    console.log('arraychjdhfjshf-2', arraylistData);
    arraylistData.forEach((data, index) => {
      const formRequestObj = {
        dnum: data.dnum,
        dname: data.dname,
        filename: data.filename,
        ext: data.ext,
        filepath: data.filepath,
        fromdocpro: data.fromdocpro,
        frommod: data.frommod,
        doctypeid: data.doctypeid,
        siteid: data.siteid,
        mod: data.mod,
        sitelevelid: data.sitelevelid,
        link: data.link,
        keyword: data.keyword,
        reason: data.reason,
        rev: data.rev,
        effectivedate: data.effectivedate,
        revdate: data.revdate,
        paginate: data.paginate,
        chgs_reqd: data.chgs_reqd,
        spublic: data.spublic,
        ModEmailConFig: data.ModEmailConFig,
        filecontent: data.filecontent ? data.filecontent : '',
        deviceId: data.deviceId,
        obj: data.obj,
        lstUserPrefModel: data.lstUserPrefModel.map(userPrefModel => ({
          siteid: userPrefModel.siteid,
          UserId: userPrefModel.UserId,
          langid: userPrefModel.langid,
          userdtfmt: userPrefModel.userdtfmt,
          UserDtFmtDlm: userPrefModel.UserDtFmtDlm,
        })),

      };

      // Push the object into the array
      formRequestArrPush.push(formRequestObj);
    });
    auth.getdocProAttachment(formRequestArrPush, token, (res, data) => {
      console.log('120 formRequestArr response', data);
      console.log(
        '120 formRequestArr response formRequestArr---',
        formRequestArrPush,
      );

      if (data.data) {
        if (data.data.Message === 'Success') {
          console.log('syncFilesToDocPro Success!');
          this.syncStatus = parseInt(this.syncStatus) + 1;
          this.syncResponseHandle();
        } else {
          console.log('syncFilesToDocPro Failed!');
          console.log('auditlog2');
          this.setState({ isLoaderVisible: false }, () => {
            this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
          });
        }
      } else {
        console.log('syncFilesToDocPro Failed!');
        console.log('auditlog3');
        this.setState({ isLoaderVisible: false }, () => {
          this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
        });
      }
    });
    console.log('formRequestArrPush--------', formRequestArrPush);
  }
  // convertFile = (path, i, j) => {

  //   return new Promise((resolve, reject,) => {
  //     if (Platform.OS == 'ios') {
  //       let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
  //       console.log('IosFilesPath--->', IosFilesPath);
  //       const arr = path.split('/');
  //       var uripathIos = IosFilesPath + '/' + arr[arr.length - 1];
  //       const decodedPath = decodeURIComponent(uripathIos);
  //       RNFetchBlob.fs
  //         .readFile(decodedPath, 'base64')
  //         .then(data => {
  //           console.log(data, 'responseFIlecontent');
  //           if (data) {
  //             let retObj = {
  //               data: data,
  //               i: i,
  //               j: j
  //             }
  //             console.log('retObj', retObj);
  //             resolve(retObj);
  //             // console.log('path found',arrpath)
  //           }
  //         })
  //         .catch(err => {
  //           resolve(undefined);
  //           console.warn('path not found====>', err);
  //         });
  //     } else {
  //       RNFetchBlob.fs
  //         .readFile(path, 'base64')
  //         .then(data => {
  //           console.log('FILEPATHGETANDROID------', data);
  //           let retObj = {
  //             data: data,
  //             i: i,
  //             j: j
  //           }
  //           console.log('retObj', retObj);
  //           resolve(retObj);
  //         })
  //         .catch(err => {
  //           resolve(undefined);
  //           console.log('Error in converting', err);
  //         });
  //     }
  //   });
  // };
  convertFile = (path, i, j) => {
 
    return new Promise((resolve, reject,) => {
      if (Platform.OS == 'ios') {
        let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
        console.log('IosFilesPath--->', IosFilesPath);
        const arr = path.split('/');
        var uripathIos = IosFilesPath + '/' + arr[arr.length - 1];
        const decodedPath = decodeURIComponent(uripathIos);
        RNFetchBlob.fs
          .readFile(decodedPath, 'base64')
          .then(data => {
            console.log(data, 'responseFIlecontent');
            if (data) {
              let retObj = {
                data: data,
                i: i,
                j: j
              }
              console.log('retObj', retObj);
              resolve(retObj);
              // console.log('path found',arrpath)
            }
          })
          .catch(err => {
            resolve({data:null,i:i,j:j});
            console.warn('path not found====>', err);
          });
      } else {
        RNFetchBlob.fs
          .readFile(path, 'base64')
          .then(data => {
            console.log('FILEPATHGETANDROID------', data);
            let retObj = {
              data: data,
              i: i,
              j: j
            }
            console.log('retObj', retObj);
            resolve(retObj);
          })
          .catch(err => {
            resolve({data:null,i:i,j:j});
            console.log('Error in converting', err);
          });
      }
    });
  }
 
  handleNCOFIConnection() {
    console.log(
      'getting local unsaved data',
      this.props.data.audits.ncofiRecords,
    );
    var token = this.props.data.audits.token;
    var formRequest = [];
    var dataArr = this.props.data.audits.ncofiRecords;
    console.log(dataArr, 'duplicatees');

    for (var i = 0; i < dataArr.length; i++) {
      console.log(
        'dataArr[i].AuditID === this.state.AuditID' +
        dataArr[i].AuditID +
        '' +
        this.state.AuditID,
      );
      if (dataArr[i].AuditID === this.state.AuditID) {
        for (var j = 0; j < dataArr[i].Pending.length; j++) {
          // if (dataArr[i].Pending[j].ChecklistTemplateId !== 0) {
          console.log('syncing data:', dataArr[i].Pending[j]);
          console.log('file data:', dataArr[i].Pending[j].filedata);
          
          if (dataArr[i].Pending[j].filedata != '') {
            // Attachments for DocPro sync
            this.isDocsAvail = true;
            for (
              let k = 0;
              k < dataArr[i].Pending[j].filedata.length;
              k++
            ) {
              // let attachment = dataArr[i].Pending[j].AttachmentList[k];
              this.auditAttachments.push({
                Type: 'NC',
                Id: parseInt(dataArr[i].Pending[j].uniqueNCkey),
                // obj: '',
                File: dataArr[i].Pending[j].filedata[k].fileData,
                filename: dataArr[i].Pending[j].filedata[k].fileName,
                SiteLevelId: 0,
                FormId: parseInt(dataArr[i].Pending[j].Formid)
              });
            }
          }

          if (dataArr[i].Pending[j].Category === 'NC') {
            console.log('into NC targeted arr', [i], dataArr[i].Pending[j]);
            // console.log('into NC targeted arr221212121', dataArr?.[i]?.Pending?.[j]?.filedata[k].filename);
            const objValues = dataArr[i].Pending[j].filedata.map(item => item.fileName);
            const formattedImages = objValues.join("', '");
            console.log("dbdjbfjkshjkfhskjfhsk", formattedImages);
            const fileDataPath = dataArr[i].Pending[j].filedata.map(item => item.fileData);
            const fileDataPathNC = fileDataPath.join("', '");
            console.log("dbdjbfjkshjkfhskjfhskfileDataNC", fileDataPathNC);

            formRequest.push({
              Title: dataArr[i].Pending[j].NCNumber ? dataArr[i].Pending[j].NCNumber: ''  ,
              strProcess:
                dataArr[i].Pending[j].selectedItemsProcess.length > 0
                  ? dataArr[i].Pending[j].selectedItemsProcess.join(',')
                  : '',
              CorrectiveId: dataArr[i].Pending[j].AuditID,
              CategoryId: dataArr[i].Pending[j].categoryDrop
                ? dataArr[i].Pending[j].categoryDrop.id
                : 0,
              FileName: formattedImages,//dataArr[i].Pending[j].filename,
              AttachEvidence: fileDataPathNC,
              Department: dataArr[i].Pending[j].deptDrop == null || undefined ? 0 :  dataArr[i].Pending[j].deptDrop,
              AuditStatus:
                dataArr[i].Pending[j].auditstatus === ''
                  ? 0
                  : isNaN(parseInt(dataArr[i].Pending[j].auditstatus))
                  ? this.props.navigation.state.params.datapass
                  : parseInt(dataArr[i].Pending[j].auditstatus),
              NonConformity: dataArr[i].Pending[j].NonConfirmity,
              RequestedBy: dataArr[i].Pending[j].requestDrop
                ? dataArr[i].Pending[j].requestDrop
                : 0,
              FormId:
                dataArr[i].Pending[j].Formid === ''
                  ? 0
                  : parseInt(dataArr[i].Pending[j].Formid),
              SiteId: dataArr[i].Pending[j].SiteID,
              ChecklistId:
              dataArr[i].Pending[j].ChecklistTemplateId === ''
                ? 0
                : parseInt(dataArr[i].Pending[j].ChecklistTemplateId),
              // ChecklistId:1,
              //   dataArr[i].Pending[j].ChecklistTemplateId === ''
              //     ? 0
              //     : parseInt(dataArr[i].Pending[j].ChecklistTemplateId),
              // ElementID: dataArr[i].Pending[j].selectedItems
              //   ? dataArr[i].Pending[j].selectedItems.join(',')
              //   : 0,
              ResponsibilityUser: dataArr[i].Pending[j].userDrop.id,
              // dataArr[i].Pending[j].userDrop
              //   ? dataArr[i].Pending[j].userDrop.id
              //   : 0,
              NCIdentifier:
                dataArr[i].Pending[j].ncIdentifier === undefined
                  ? ''
                  : dataArr[i].Pending[j].ncIdentifier,
              ObjectiveEvidence:  dataArr[i].Pending[j].objEvidence,
                // dataArr[i].Pending[j].objEvidence === undefined
                //   ? ''
                //   : dataArr[i].Pending[j].objEvidence,
              RecommendedAction:
                dataArr[i].Pending[j].recommAction === undefined
                  ? ''
                  : dataArr[i].Pending[j].recommAction,
              uniqueNCkey: dataArr[i].Pending[j].uniqueNCkey,
              // ElementId:1,
              ElementID: dataArr[i].Pending[j].selectedItems
              ? dataArr[i].Pending[j].selectedItems.join(',')
              : 0,
              // Conformance: "",
              ProcessID:1,
              DocumentRef:dataArr[i].Pending[j].documentRef,
              FailureCategoryId:dataArr[i].Pending[j].failureDrop.value
            });
            console.log("sjkdfjjksdfkjsdfk45343formRequest",formRequest);
          } else if (dataArr[i].Pending[j].Category === 'OFI') {
            const objValues = dataArr[i].Pending[j].filedata.map(item => item.fileName);
            const formattedImages = objValues.join("', '");
            console.log("dbdjbfjkshjkfhskjfhsk", formattedImages);
            const fileDataPath = dataArr[i].Pending[j].filedata.map(item => item.fileData);
            const fileDataPathNC = fileDataPath.join("', '");
            console.log("dbdjbfjkshjkfhskjfhskfileDataNC", fileDataPathNC);
            console.log('into OFI targeted arr', [i], dataArr[i].Pending[j]);
            console.log("dbdjbfjkshjkfhskjfhsk", objValues);
            formRequest.push({
              strProcess:
                dataArr[i].Pending[j].selectedItemsProcess.length > 0
                  ? dataArr[i].Pending[j].selectedItemsProcess.join(',')
                  : '',
              CorrectiveId: dataArr[i].Pending[j].AuditID,
              CategoryId: dataArr[i].Pending[j].categoryDrop
                ? dataArr[i].Pending[j].categoryDrop.id
                : 0,
                Title: dataArr[i].Pending[j].NCNumber ? dataArr[i].Pending[j].NCNumber: ''  ,
                FileName: formattedImages,// dataArr[i].Pending[j].filename,
              // AttachEvidence:dataArr[i].Pending[j].filedata,
              Department: dataArr[i].Pending[j].deptDrop == null || undefined ? 0 :  dataArr[i].Pending[j].deptDrop,

              AuditStatus:
                dataArr[i].Pending[j].auditstatus === ''
                  ? 0
                  : isNaN(parseInt(dataArr[i].Pending[j].auditstatus))
                  ? this.props.navigation.state.params.datapass
                  : parseInt(dataArr[i].Pending[j].auditstatus),
              RequestedBy: dataArr[i].Pending[j].requestDrop
                ? dataArr[i].Pending[j].requestDrop.id
                : 0,
              NonConformity: dataArr[i].Pending[j].OFI,
              FormId:
                dataArr[i].Pending[j].Formid === ''
                  ? 0
                  : parseInt(dataArr[i].Pending[j].Formid),
              SiteId: dataArr[i].Pending[j].SiteID,
              ChecklistId:
                dataArr[i].Pending[j].ChecklistTemplateId === ''
                  ? 0
                  : parseInt(dataArr[i].Pending[j].ChecklistTemplateId),
              ElementID: dataArr[i].Pending[j].selectedItems
                ? dataArr[i].Pending[j].selectedItems.join(',')
                : 0,
              ResponsibilityUser: dataArr[i].Pending[j].userDrop
                ? dataArr[i].Pending[j].userDrop.id
                : 0,
              NCIdentifier:
                dataArr[i].Pending[j].ncIdentifier === undefined
                  ? ''
                  : dataArr[i].Pending[j].ncIdentifier,
              ObjectiveEvidence:
                dataArr[i].Pending[j].objEvidence === undefined
                  ? ''
                  : dataArr[i].Pending[j].objEvidence,
              RecommendedAction:
                dataArr[i].Pending[j].recommAction === undefined
                  ? ''
                  : dataArr[i].Pending[j].recommAction,
              uniqueNCkey: dataArr[i].Pending[j].uniqueNCkey,
            });
          }

          // }
        }//j
      }

    }

    console.log('Request array pushed', formRequest, token);
    this.setState({ generarereport_param: formRequest });
    console.log('api params stored in generarereport_param state..');

    if (formRequest) {
      if (formRequest.length > 0) {
        console.log('checkncsuccess now formrequest-------');
        this.formRequestArr(formRequest, token);
      } else {
        this.syncStatus = parseInt(this.syncStatus) + 1;
        console.log('syncNCOFIToServer Skipped!');
        // Sync audit templates and references to server
        this.syncAuditFormsToServer();
      }
    } else {
      this.syncStatus = parseInt(this.syncStatus) + 1;
      console.log('syncNCOFIToServer Skipped!');
      // Sync audit templates and references to server
      this.syncAuditFormsToServer();
    }
  }

  formRequestArr(formRequest, token) {
    var datapass = formRequest;
    var TOKEN = token;
    this.ncOfiObjects = [];

    console.log('keypass', datapass);

    auth.syncNCOFIToServer(datapass, TOKEN, (res, data) => {
      console.log("syncNCOFIToServer----------------------",data);
      if (data.data) {
        if (data.data.Message === 'Success') {
          for (var i = 0; i < data.data.Data.length; i++) {
            var auditObj = data.data.Data[i].DocProParameter.trim();
            var auditSiteLevelID = data.data.Data[i].SiteLevelId.trim();
            var uniqueNCkey = data.data.Data[i].UniqueNCkey.trim();
            let regex = /NC-\d+-\d+/g;

            console.log('syncNCOFIToServer auditObj', auditObj);
            console.log('syncNCOFIToServer auditSiteLevelID', auditSiteLevelID);
            console.log('syncNCOFIToServer uniqueNCkey', uniqueNCkey);
            let matches = auditObj.match(regex);

            var auditObjList = auditObj.split('|');
            console.log('gdhsjgdhjsdgfjhdsgfauditObjList',auditObjList);
            console.log('gdhsjgdhjsdgfjhdsgfauditObjListmatches',matches);
            if (matches) {
              matches.forEach(match => {
                // for(var j = 0; j < matches.length; j++){
                this.ncOfiObjects.push({
                  uniqueNCkey: uniqueNCkey,
                  obj: match,
                  siteLevelId: auditSiteLevelID,
                  
                });
              // }
              });
            }
          //   for (var j = 0; j < auditObjList.length; i++) {
          //   this.ncOfiObjects.push({
              
          //   });
          // }
            console.log('120 NCOFIObjectsArr', this.ncOfiObjects);
          }
          console.log('120 NCOFIObjectsArrauditAttachments', this.auditAttachments);

          // for (var i = 0; i < this.auditAttachments.length; i++) {
          //   for (var j = 0; j < this.ncOfiObjects.length; j++) {
          //     if (
          //       this.auditAttachments[i].FormId ==
          //       this.checkListObjects[j].formId &&
          //       this.auditAttachments[i].Type == 'NC' &&
          //       this.auditAttachments[i].Id ==
          //       parseInt(this.ncOfiObjects[j].uniqueNCkey)
          //     ) {
          // console.log('120 NCOFIObjectsArr3333333', this.auditAttachments[i]);
          // console.log('120 NCOFIObjectsArr3333333', this.ncOfiObjects[j]);

          // this.auditAttachments[i].Obj = this.ncOfiObjects[j].obj;
          //       this.auditAttachments[i].Id = parseInt(
          //         this.ncOfiObjects[j].uniqueNCkey,
          //       );
          //       this.auditAttachments[i].SiteLevelId =
          //         this.ncOfiObjects[j].siteLevelId;
          //     }
          //   }
          // }
          let replaceIndex = 0;

          this.auditAttachments.forEach((item1, index1) => {
      if (item1.Type === 'NC' || 'OFI') {
        console.log('jdfjdfjdjfh',item1,index1);
        const matchingItems2 = this.ncOfiObjects.filter(item2 => item2.uniqueNCkey === item1.Id.toString());
        console.log('jdfjdfjdjfhwewerererer',matchingItems2);

        if (matchingItems2.length > 0) {
          this.auditAttachments[index1].Obj = matchingItems2[replaceIndex % matchingItems2.length].obj;
          replaceIndex++;
        }
      }
    });
          console.log(
            'Request formed after audit formed4545454545',
            this.auditAttachments,
          );

          this.syncStatus = parseInt(this.syncStatus) + 1;
          console.log('syncNCOFIToServer Success!');
          this.deleteNCOFIAfterSync();
          // Sync audit templates and references to server
          this.syncAuditFormsToServer();
        } else {
          console.log('syncNCOFIToServer Failed!');
          // Sync audit templates and references to server
          this.syncAuditFormsToServer();
        }
      } else {
        console.log('syncNCOFIToServer Failed 2 !');
        // Sync audit templates and references to server
        this.syncAuditFormsToServer();
      }
    });
  }

  updateFormUploadDetails = () => {
    console.log('this.state.formDetails', this.state.formDetails);
    var auditRecordsOrg = this.props.data.audits.auditRecords;
    var auditRecords = [];

    for (var p = 0; p < auditRecordsOrg.length; p++) {
      var formDataArr = [];

      if (auditRecordsOrg[p].AuditId == this.state.Checkpointpass.AuditID) {
        if (auditRecordsOrg[p].Formdata) {
          for (q = 0; q < auditRecordsOrg[p].Formdata.length; q++) {
            for (var i = 0; i < this.state.formDetails.length; i++) {
              if (
                auditRecordsOrg[p].Formdata[q].FormId ==
                this.state.formDetails[i].FormId
              ) {
                formDataArr.push({
                  Attachmenttype: this.state.formDetails[i].Attachmenttype,
                  FormId: JSON.stringify(auditRecordsOrg[p].Formdata[q].FormId),
                  FormName: auditRecordsOrg[p].Formdata[q].FormName,
                  FormType: auditRecordsOrg[p].Formdata[q].FormType,
                  DocName: this.state.formDetails[i].DocName,
                  AttachedDocument: this.state.formDetails[i].AttachedDocument,
                  DocumentId: this.state.formDetails[i].DocumentId,
                  isModified: this.state.formDetails[i].isModified,
                });
              }
            }
          }
        }
      } else {
        if (auditRecordsOrg[p].Formdata) {
          for (q = 0; q < auditRecordsOrg[p].Formdata.length; q++) {
            formDataArr.push({
              Attachmenttype: auditRecordsOrg[p].Formdata[q].Attachmenttype,
              FormId: auditRecordsOrg[p].Formdata[q].FormId,
              FormName: auditRecordsOrg[p].Formdata[q].FormName,
              FormType: auditRecordsOrg[p].Formdata[q].FormType,
              DocName: auditRecordsOrg[p].Formdata[q].DocName,
              AttachedDocument: auditRecordsOrg[p].Formdata[q].AttachedDocument,
              DocumentId: auditRecordsOrg[p].Formdata[q].DocumentId,
              isModified: auditRecordsOrg[p].Formdata[q].isModified,
            });
          }
        }
      }
      auditRecords.push({
        AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
        AuditId: auditRecordsOrg[p].AuditId,
        AuditOrderId: auditRecordsOrg[p].AuditTypeOrder,
        AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : auditRecordsOrg[p].AuditTemplateId,
        AuditTypeId: auditRecordsOrg[p].AuditTypeId,
        SiteId: auditRecordsOrg[p].SiteId,
        Status:  auditRecordsOrg[p].Status == '' || auditRecordsOrg[p].Status == undefined || auditRecordsOrg[p].Status == null  ? 0 : auditRecordsOrg[p].Status,
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
        Formdata: formDataArr,
        CheckListPropData: auditRecordsOrg[p].CheckListPropData,
        CheckpointLogic: auditRecordsOrg[p].CheckpointLogic,
        DropDownProps: auditRecordsOrg[p].DropDownProps,
        NCdetailsprops: auditRecordsOrg[p].NCdetailsprops,
        Listdata: auditRecordsOrg[p].Listdata,
        UserId: auditRecordsOrg[p].UserId,
        FromDocPro: auditRecordsOrg[p].FromDocPro,
        DocumentId: auditRecordsOrg[p].DocumentId,
        DocRevNo: auditRecordsOrg[p].DocRevNo,
        AuditRecordStatus: constants.StatusNotSynced,
        AuditResults: auditRecordsOrg[p].AuditResults,
        AuditProcessList: auditRecordsOrg[p].AuditProcessList,
        PerformStarted: auditRecordsOrg[p].PerformStarted,
      });
    }

    console.log('auditRecords created.', auditRecords);
    // Store audit list in redux store to set it in persistant storage
    this.props.storeAuditRecords(auditRecords);

    // Update audit status in the audit list
    var auditListOrg = this.props.data.audits.audits;
    var auditList = [];

    for (var i = 0; i < auditListOrg.length; i++) {
      var auditStatus = auditListOrg[i].cStatus;
      var auditColor = auditListOrg[i].color;

      if (
        parseInt(auditListOrg[i].ActualAuditId) ==
        parseInt(this.state.Checkpointpass.AuditID)
      ) {
        if (auditListOrg[i].AuditStatus != 3) {
          auditStatus = constants.StatusNotSynced;
        }
      }

      // Set Audit Card color by checking its Status
      switch (auditStatus) {
        case constants.StatusScheduled:
          auditColor = '#F1EB0E';
          break;
        case constants.StatusDownloaded:
          auditColor = '#cd8cff';
          break;
        case constants.StatusNotSynced:
          auditColor = '#2ec3c7';
          break;
        case constants.StatusProcessing:
          auditColor = '#e88316';
          break;
        case constants.StatusSynced:
          auditColor = '#48bcf7';
          break;
        case constants.Completed:
          auditColor = 'green';
          break;
        case constants.StatusCompleted:
          auditColor = '#000';
          break;
        case constants.StatusDV:
          auditColor = 'red';
          break;
        case constants.StatusDVC:
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
        AuditProgramId:this.props.data.audits.smdata == 2 ? -2 : auditListOrg[i].AuditTemplateId,
        AuditProgramName: auditListOrg[i].AuditProgramName,
        // AuditStatus: auditListOrg[i].AuditStatus,
        AuditStatus: this.props.navigation.state.params.datapassParam.AuditStatus,
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
  };

  resetModifiedFlag() {
    var auditRecordsOrg = this.props.data.audits.auditRecords;
    var auditRecords = [];
    for (var p = 0; p < auditRecordsOrg.length; p++) {
      console.log('hellopconsole', auditRecordsOrg[p].Listdata);
      if (auditRecordsOrg[p].AuditId == this.state.AuditID) {
        var listDataArr = [];
        if (auditRecordsOrg[p].Listdata) {
          if (auditRecordsOrg[p].Listdata.length > 0) {
            for (var q = 0; q < auditRecordsOrg[p].Listdata.length; q++) {
              listDataArr.push({
                ChecklistTemplateId:
                  auditRecordsOrg[p].Listdata[q].ChecklistTemplateId,
                Attachment: auditRecordsOrg[p].Listdata[q].Attachment,
                File: auditRecordsOrg[p].Listdata[q].File,
                FormId: auditRecordsOrg[p].Listdata[q].FormId,
                IsNCAllowed: auditRecordsOrg[p].Listdata[q].IsNCAllowed,
                IsCorrect: auditRecordsOrg[p].Listdata[q].IsCorrect,
                ParentId: auditRecordsOrg[p].Listdata[q].ParentId,
                FileType: auditRecordsOrg[p].Listdata[q].FileType,
                FileName: auditRecordsOrg[p].Listdata[q].FileName,
                Approach: auditRecordsOrg[p].Listdata[q].Approach,
                ApproachId: auditRecordsOrg[p].Listdata[q].ApproachId,
                Remark: auditRecordsOrg[p].Listdata[q].Remark,
                ParamMode: auditRecordsOrg[p].Listdata[q].ParamMode,
                RadioValue: auditRecordsOrg[p].Listdata[q].RadioValue,
                Correction:
                  auditRecordsOrg[p].Listdata[q].Correction == ''
                    ? 0
                    : auditRecordsOrg[p].Listdata[q].Correction,
                Score: auditRecordsOrg[p].Listdata[q].Score,
                Scoretext: auditRecordsOrg[p].Listdata[q].Scoretext,
                RemarkforNc: auditRecordsOrg[p].Listdata[q].RemarkforNc,
                AttachforNc: auditRecordsOrg[p].Listdata[q].AttachforNc,
                RemarkforOfi: auditRecordsOrg[p].Listdata[q].RemarkforOfi,
                AttachforOfi: auditRecordsOrg[p].Listdata[q].AttachforOfi,
                Modified: false,
                AttachforComp: auditRecordsOrg[p].Listdata[q].AttachforComp,
                AuditId: auditRecordsOrg[p].Listdata[q].AuditId,
                ChecklistName: auditRecordsOrg[p].Listdata[q].ChecklistName,
                CompLevelId: auditRecordsOrg[p].Listdata[q].CompLevelId,
                LogicFormulae: auditRecordsOrg[p].Listdata[q].LogicFormulae,
                Maxscore: auditRecordsOrg[p].Listdata[q].Maxscore,
                MinScore: auditRecordsOrg[p].Listdata[q].MinScore,
                NeedScore: auditRecordsOrg[p].Listdata[q].NeedScore,
                ScoreType: auditRecordsOrg[p].Listdata[q].ScoreType,
                isScoreValid: auditRecordsOrg[p].Listdata[q].isScoreValid,
                scoreInvalidMsg: auditRecordsOrg[p].Listdata[q].scoreInvalidMsg,
                nc_available_status: true,
                ofi_avialable_status: true,
              });
            }
          }
        }
        console.log('RESETED', listDataArr);
        auditRecords.push({
          AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
          AuditId: auditRecordsOrg[p].AuditId,
          AuditOrderId: auditRecordsOrg[p].AuditTypeOrder,
          AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : auditRecordsOrg[p].AuditTemplateId,
          AuditTypeId: auditRecordsOrg[p].AuditTypeId,
          SiteId: auditRecordsOrg[p].SiteId,
          Status: auditRecordsOrg[p].Status == '' || auditRecordsOrg[p].Status == undefined || auditRecordsOrg[p].Status == null? 0 : auditRecordsOrg[p].Status,
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
          Listdata: listDataArr,
          UserId: auditRecordsOrg[p].UserId,
          FromDocPro: auditRecordsOrg[p].FromDocPro,
          DocumentId: auditRecordsOrg[p].DocumentId,
          DocRevNo: auditRecordsOrg[p].DocRevNo,
          AuditRecordStatus: constants.StatusSynced,
          AuditResults: auditRecordsOrg[p].AuditResults,
          AuditProcessList: auditRecordsOrg[p].AuditProcessList,
          PerformStarted: auditRecordsOrg[p].PerformStarted,
        });

        // Store audit list in redux store to set it in persistant storage
      } else {
        auditRecords.push({
          AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
          AuditId: auditRecordsOrg[p].AuditId,
          AuditOrderId: auditRecordsOrg[p].AuditTypeOrder,
          AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : auditRecordsOrg[p].AuditTemplateId,
          AuditTypeId: auditRecordsOrg[p].AuditTypeId,
          SiteId: auditRecordsOrg[p].SiteId,
          Status: auditRecordsOrg[p].Status == '' || auditRecordsOrg[p].Status == undefined || auditRecordsOrg[p].Status == null? 0 : auditRecordsOrg[p].Status,
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
          AuditResults: auditRecordsOrg[p].AuditResults,
          AuditProcessList: auditRecordsOrg[p].AuditProcessList,
          PerformStarted: auditRecordsOrg[p].PerformStarted,
        });
      }
    }
    console.log('auditRecords reseted.', auditRecords);
    // this.props.storeAuditRecords(auditRecords);
    // this.props.navigation.navigate('Table')
  }

  resetModifiedFlagFormData() {
    var Formdata = this.state.formDetails;
    var ModifiedformDataArr = [];
    for (var i = 0; i < Formdata.length; i++) {
      ModifiedformDataArr.push({
        Attachmenttype: this.state.formDetails[i].Attachmenttype,
        FormId: this.state.formDetails[i].FormId,
        FormName: this.state.formDetails[i].FormName,
        FormType: this.state.formDetails[i].FormType,
        DocName: this.state.formDetails[i].DocName,
        AttachedDocument: this.state.formDetails[i].AttachedDocument,
        DocumentId: this.state.formDetails[i].DocumentId,
        isModified: false,
      });
    }
    this.setState({ formDetails: ModifiedformDataArr }, () => {
      this.updateFormdataRecords();
      this.getForname();
    });
  }

  updateFormdataRecords() {
    var auditRecordsOrg = this.props.data.audits.auditRecords;
    var auditRecords = [];
    for (var p = 0; p < auditRecordsOrg.length; p++) {
      if (auditRecordsOrg[p].AuditId == this.state.AuditID) {
        if (auditRecordsOrg[p].Formdata) {
          if (
            auditRecordsOrg[p].Formdata.length == this.state.formDetails.length
          ) {
            auditRecords.push({
              AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
              AuditId: auditRecordsOrg[p].AuditId,
              AuditOrderId: auditRecordsOrg[p].AuditTypeOrder,
              AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : auditRecordsOrg[p].AuditTemplateId,
              AuditTypeId: auditRecordsOrg[p].AuditTypeId,
              SiteId: auditRecordsOrg[p].SiteId,
              Status: auditRecordsOrg[p].Status == '' || auditRecordsOrg[p].Status == undefined || auditRecordsOrg[p].Status == null ? 0 : auditRecordsOrg[p].Status,
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
              AuditeeContactPersonName:
                auditRecordsOrg[p].AuditeeContactPersonName,
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
              Formdata: this.state.formDetails,
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
              AuditResults: auditRecordsOrg[p].AuditResults,
              AuditProcessList: auditRecordsOrg[p].AuditProcessList,
              PerformStarted: auditRecordsOrg[p].PerformStarted,
            });
          }
        }
      } else {
        auditRecords.push(auditRecordsOrg[p]);
      }
    }
    console.log('auditRecords', auditRecords);
    this.props.storeAuditRecords(auditRecords);
  }

  syncAuditFormsToServer = () => {
    var documentList = [];
    const TOKEN = this.state.token;
    var userid = this.props.data.audits.userId;
    this.formObjects = [];
    console.log('this.state.formDetails', this.state.formDetails);

    if (this.state.formDetails) {
      for (var j = 0; j < this.state.formDetails.length; j++) {
        if (this.state.formDetails[j].FormType != 1) {
          if (
            this.state.formDetails[j].Attachmenttype == 0 &&
            this.state.formDetails[j].AttachedDocument != ''
          ) {
            this.isDocsAvail = true;
            this.auditAttachments.push({
              Type: 'AR',
              Id: parseInt(this.state.formDetails[j].FormId),
              Obj: '',
              File: this.state.formDetails[j].AttachedDocument,
              FileName: this.state.formDetails[j].DocName,
              SiteLevelId: 0,
            });
          }
          documentList.push({
            UploadedBy: userid,
            AuditId: parseInt(this.state.AuditID),
            AuditOrderId: parseInt(this.state.AuditTypeOrder),
            FormId: parseInt(this.state.formDetails[j].FormId),
            // UploadId: this.state.Checkpointpass.AUDIT_NO,
            FormType: this.state.formDetails[j].Attachmenttype == 0 ? 0 : 1,
            DocName:
              this.state.formDetails[j].Attachmenttype == 0
                ? this.state.formDetails[j].DocName
                : this.state.formDetails[j].AttachedDocument,
            AttachedDocument: '', // this.state.formDetails[j].Attachmenttype == 0 ? this.state.formDetails[j].AttachedDocument : ''
          });
        }
      }
      console.log('syncAuditFormsToServer request', documentList);
    }

    if (documentList) {
      if (documentList.length > 0) {
        console.log('syncAuditFormsToServer--->BF');
        auth.syncAuditFormsToServer(documentList, TOKEN, (res, data) => {
          console.log('120 syncAuditFormsToServer--->AF', data);
          if (data.data) {
            if (data.data.Message === 'Success') {
              if (data.data.Data[0].AuditAttachmentStatus) {
                console.log('template and reference response', data);
                console.log(
                  'checking data',
                  data.data.Data[0].AuditAttachmentStatus,
                );

                var audtFormRespArr =
                  data.data.Data[0].AuditAttachmentStatus.replace('{', '')
                    .replace('}', '')
                    .split(',');
                console.log('audtFormRespArr', audtFormRespArr);

                var auditObjArr = audtFormRespArr[1].split(':');
                var auditSiteLevelIDArr = audtFormRespArr[2].split(':');

                var auditObj = auditObjArr[1].trim();
                var auditSiteLevelID = auditSiteLevelIDArr[1].trim();

                console.log('syncAuditFormsToServer auditObj', auditObj);
                console.log(
                  'syncAuditFormsToServer auditSiteLevelID',
                  auditSiteLevelID,
                );

                var auditObjList = auditObj.split('|');
                for (var i = 0; i < auditObjList.length; i++) {
                  this.formObjects.push({
                    formId: this.parseObj(auditObjList[i].trim(), 'AR'),
                    obj: auditObjList[i].trim(),
                    siteLevelId: auditSiteLevelID,
                  });
                }
                console.log('AuditFormObjectsArr', this.formObjects);

                for (var i = 0; i < this.auditAttachments.length; i++) {
                  for (var j = 0; j < this.formObjects.length; j++) {
                    if (
                      this.auditAttachments[i].Type == 'AR' &&
                      this.auditAttachments[i].Id ==
                      parseInt(this.formObjects[j].formId)
                    ) {
                      this.auditAttachments[i].Obj = this.formObjects[j].obj;
                      this.auditAttachments[i].Id = parseInt(
                        this.formObjects[j].formId,
                      );
                      this.auditAttachments[i].SiteLevelId =
                        this.formObjects[j].siteLevelId;
                    }
                  }
                }

                console.log(
                  'Request formed after audit formed',
                  this.auditAttachments,
                );

                this.syncStatus = parseInt(this.syncStatus) + 1;
                console.log('this.syncStauss------>', this.syncStatus);
                this.resetModifiedFlagFormData();
                console.log('syncAuditFormsToServer Success!');

                if (this.isDocsAvail == true) {
                  // Sync attached documents to docpro
                  console.log('syncFilesToDocPro started.');
                  this.syncFilesToDocPro();
                } else {
                  this.syncStatus = parseInt(this.syncStatus) + 1;
                  this.syncResponseHandle();
                }
              }
            } else {
              this.setState({ isLoaderVisible: false }, () => {
                console.log('syncAuditFormsToServer Failed! 1');
                console.log('auditlog4');
                this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
              });
            }
          } else {
            this.setState({ isLoaderVisible: false }, () => {
              console.log('syncAuditFormsToServer Failure! 2');
              console.log('auditlog5');
              this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
            });
          }
        });
      } else {
        console.log('syncAuditFormsToServer Skipped!');
        this.syncStatus = parseInt(this.syncStatus) + 1;
        if (this.isDocsAvail == true) {
          // Sync attached documents to docpro
          console.log('syncFilesToDocPro 2');
          this.syncFilesToDocPro();
        } else {
          this.syncStatus = parseInt(this.syncStatus) + 1;
          this.syncResponseHandle();
        }
      }
    } else {
      console.log('syncAuditFormsToServer Skipped!');
      this.syncStatus = parseInt(this.syncStatus) + 1;
      if (this.isDocsAvail == true) {
        // Sync attached documents to docpro
        console.log('syncFilesToDocPro 3');
        this.syncFilesToDocPro();
      } else {
        this.syncStatus = parseInt(this.syncStatus) + 1;
        this.syncResponseHandle();
      }
    }
  };

  syncResponseHandle() {
    this.setState(
      {
        isSyncing: false,
      },
      () => {
        console.log('syncResponseHandle --> syncStatus: ' + this.syncStatus);
        if (parseInt(this.syncStatus) == 4) {
          var auditRecordsOrg = this.props.data.audits.auditRecords;
          var auditRecords = [];

          for (var p = 0; p < auditRecordsOrg.length; p++) {
            let ListData = [];
            for (let z = 0; z < auditRecordsOrg[p].Listdata.length; z++) {
              let AttachList = [];
              for (let b = 0; b < auditRecordsOrg[p].Listdata[z].AttachmentList.length; b++) {
                let attach = { ...auditRecordsOrg[p].Listdata[z].AttachmentList[b] }

                if (attach.Attachment.indexOf("Added") >= 0) {
                  attach.Attachment = 'Synced';
                }
                AttachList.push(attach);
              }
              ListData.push({ ...auditRecordsOrg[p].Listdata[z], AttachmentList: [...AttachList] })
            }

            auditRecords.push({
              AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
              AuditId: auditRecordsOrg[p].AuditId,
              AuditOrderId: auditRecordsOrg[p].AuditTypeOrder,
              AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : auditRecordsOrg[p].AuditTemplateId,
              AuditTypeId: auditRecordsOrg[p].AuditTypeId,
              SiteId: auditRecordsOrg[p].SiteId,
             Status: auditRecordsOrg[p].Status == '' || auditRecordsOrg[p].Status == undefined || auditRecordsOrg[p].Status == null ? 0 : auditRecordsOrg[p].Status,
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
              AuditeeContactPersonName:
                auditRecordsOrg[p].AuditeeContactPersonName,
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
              Listdata: ListData, //auditRecordsOrg[p].Listdata,
              UserId: auditRecordsOrg[p].UserId,
              FromDocPro: auditRecordsOrg[p].FromDocPro,
              DocumentId: auditRecordsOrg[p].DocumentId,
              DocRevNo: auditRecordsOrg[p].DocRevNo,
              AuditRecordStatus:
                auditRecordsOrg[p].AuditId == this.state.AuditID
                  ? constants.StatusSynced
                  : auditRecordsOrg[p].AuditRecordStatus,
              AuditResults: auditRecordsOrg[p].AuditResults,
              AuditProcessList: auditRecordsOrg[p].AuditProcessList,
              PerformStarted: auditRecordsOrg[p].PerformStarted,
              // ...auditRecords[0]?.Listdata[checkPointList[i].ActualIndex],
            });
          }

          // Store audit list in redux store to set it in persistant storage
          this.props.storeAuditRecords(auditRecords);

          console.log(auditRecords, 'auditlistarraydatarecords');

          // Update audit status in the audit list
          var auditListOrg = this.props.data.audits.audits;
          var auditList = [];

          for (var i = 0; i < auditListOrg.length; i++) {
            var auditStatus = auditListOrg[i].cStatus;
            var auditColor = auditListOrg[i].color;

            if (
              parseInt(auditListOrg[i].ActualAuditId) ==
              parseInt(this.state.Checkpointpass.AuditID)
            ) {
              if (auditListOrg[i].AuditStatus != 3) {
                auditStatus = constants.StatusSynced;
              }
            }

            // Set Audit Card color by checking its Status
            switch (auditStatus) {
              case constants.StatusScheduled:
                auditColor = '#F1EB0E';
                break;
              case constants.StatusDownloaded:
                auditColor = '#cd8cff';
                break;
              case constants.StatusNotSynced:
                auditColor = '#2ec3c7';
                break;
              case constants.StatusProcessing:
                auditColor = '#e88316';
                break;
              case constants.StatusSynced:
                auditColor = '#48bcf7';
                break;
              case constants.Completed:
                auditColor = 'green';
                break;
              case constants.StatusCompleted:
                auditColor = '#000';
                break;
              case constants.StatusDV:
                auditColor = 'red';
                break;
              case constants.StatusDVC:
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
              AuditProgramId: this.props.data.audits.smdata == 2 ? -2 : auditListOrg[i].AuditTemplateId,
              AuditProgramName: auditListOrg[i].AuditProgramName,
              // AuditStatus: auditListOrg[i].AuditStatus,
              AuditStatus: this.props.navigation.state.params.datapassParam.AuditStatus,
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
          console.log(auditList, 'auditlistarraydata');
          this.props.storeAudits(auditList);

          this.props.changeAuditState(false);

          this.setState({ isLoaderVisible: false }, () => {
            console.log('Sync process completed successfully!');
            console.log(!this.isDocsAvail, 'docavail');
            if (
              this.props.data.audits.smdata === 2 ||
              this.props.data.audits.smdata === 3
            ) {
              console.log('auditpagegoint');
              this.props.navigation.navigate('AuditPage', {
                isSubmitted: this.state.notifyRed,
                // isDownloaded : false
              });
            } else if (!this.isDocsAvail) {
              this.refs.toast.show(strings.AuditSync, DURATION.LENGTH_LONG);
              setTimeout(() => {
                this.props.navigation.navigate('AuditStatus', {
                  isSubmitted: true,
                  AuditID: this.state.AuditID,
                  breadCrumb: this.state.breadCrumbText,
                  generatereport:
                    this.state.generarereport_param.length > 0
                      ? this.state.generarereport_param
                      : 'empty',
                });
              }, 1000);
            } else {
              this.isDocsAvail = false;
              this.refs.toast.show(strings.AuditSync, DURATION.LENGTH_LONG);
              this.props.navigation.navigate('AuditStatus', {
                AuditID: this.state.AuditID,
                breadCrumb: this.state.breadCrumbText,
                generatereport:
                  this.state.generarereport_param.length > 0
                    ? this.state.generarereport_param
                    : 'empty',
              });
            }
          });
        } else {
          console.log('auditlog1');
          this.setState({ isLoaderVisible: false }, () => {
            this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
          });
        }
      },
    );
  }

  deleteNCOFIAfterSync() {
    // Update NC/OFI records in redux store
    var dupNCrecords = [];
    var NCrecords = this.props.data.audits.ncofiRecords;
    for (var i = 0; i < NCrecords.length; i++) {
      var pendingList = [];
      for (var j = 0; j < NCrecords[i].Pending.length; j++) {
        if (this.state.AuditID !== NCrecords[i].AuditID) {
          pendingList.push(NCrecords[i].Pending[j]);
        }
      }
      dupNCrecords.push({
        AuditID: NCrecords[i].AuditID,
        Uploaded: NCrecords[i].Uploaded,
        Pending: pendingList,
      });
    }
    this.props.storeNCRecords(dupNCrecords);
  }

  viewDocument(fileData, fileName) {
    const dirs = RNFetchBlob.fs.dirs;
    const fs = RNFetchBlob.fs;
    if (Platform.OS == 'android') {
      var path =
        dirs.DownloadDir.replace('/Download', '') +
        '/Android/data/com.omnex.suppliermanagement/cache/' +
        fileName.replace(/\s/g, '-');
    } else {
      var path =
        dirs.DocumentDir + '/' + 'Downloads/' + fileName.replace(/\s/g, '-');
    }
    console.log('path', path);

    // Check whether the file is already exists
    fs.exists(path)
      .then(exist => {
        console.log(`file ${exist ? '' : 'not'} exists`);
        if (exist) {
          fs.unlink(path)
            .then(() => {
              console.log('path', path);
              fs.createFile(path, fileData, 'base64')
                .then(success => {
                  console.log(
                    'File downloaded and stored in internal storage!',
                    success,
                  );
                  FileViewer.open(path, { showOpenWithDialog: true })
                    .then(() => {
                      console.log(success);
                    })
                    .catch(error => {
                      // error
                    });
                })
                .catch(err => {
                  console.log(err.message);
                });
            })
            .catch(err => {
              console.log(err.message);
            });
        } else {
          console.log('createFile path', path);
          if (Platform.OS == 'android') {
            console.log('path', path);
            fs.createFile(path, fileData, 'base64')
              .then(success => {
                console.log(
                  'File downloaded and stored in internal storage!',
                  success,
                );
                FileViewer.open(path, { showOpenWithDialog: true })
                  .then(() => {
                    // success
                  })
                  .catch(error => {
                    // error
                  });
              })
              .catch(err => {
                console.log('fs.createFile', err.message);
              });
          } else {
            fs.writeFile(path, fileData, 'base64')
              .then(success => {
                console.log(
                  'File downloaded and stored in internal storage!',
                  success,
                );
                FileViewer.open(path, { showOpenWithDialog: true })
                  .then(() => {
                    // success
                  })
                  .catch(error => {
                    // error
                  });
              })
              .catch(err => {
                console.log('fs.createFile', err.message);
              });
          }
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  FilePress(item) {
    if (item.Attachmenttype == 1) {
      return null;
    } else {
      console.log('item', item);
      var filepath = item.AttachedDocument;
      if (item.AttachedDocument !== '') {
        var DocId = item.DocumentId;
        console.log(DocId, 'docidlog');
        if (parseInt(DocId) > 0) {
          var Token = this.props.data.audits.token;

          auth.downloadFile(DocId, Token, (res, data) => {
            console.log('120 File download response', data);
            if (data.data.Message == 'Success') {
              var fileData = data.data.Data.FileData;
              var fileName = data.data.Data.FileName;
              this.viewDocument(fileData, fileName);
              this.refs.toast.show(strings.downloading, DURATION.LENGTH_SHORT);
            } else {
              this.refs.toast.show(strings.server_error, DURATION.LENGTH_LONG);
            }
          });
        } else {
          if (item.AttachedDocument != '') {
            var fileData = item.AttachedDocument;
            var fileName = item.DocName;
            this.viewDocument(fileData, fileName);
          } else {
            this.refs.toast.show(
              strings.No_documents_attached,
              DURATION.LENGTH_SHORT,
            );
          }
        }
      } else {
        FileViewer.open(filepath, { showOpenWithDialog: true })
          .then(() => {
            console.log(success);
          })
          .catch(error => {
            alert(strings.Filenotfound);
          });
      }
    }
  }

  syncPassword() { }

  StartSyncProcess() {
    console.log('StartSyncProcess called in Forms page...');

    /** Entry point for syncing */

    this.setState(
      {
        dialogVisible: false,
        isSyncing: true,
        isLoaderVisible: true,
        confirmpwd: false,
      },
      () => {
        var baseURL = this.props.data.audits.serverUrl;
        console.log('baseeeeurl', this.props.data.audits.serverUrl);
        const check = create({
          baseURL: baseURL + 'CheckConnection',
        });
        console.log('loggggcheckkkkkk',check);
        
        check.post().then(response => {
          if (response.duration > constant.ThresholdSpeed) {
            this.setState(
              {
                isLowConnection: true,
              },
              () => {
                this.syncAuditsToServer()

                // this.checkUser();
                console.log('Download response1', response);
                console.log('Low network', this.state.isLowConnection);
              },
            );
          } else {
            this.syncAuditsToServer()

            // this.checkUser();
            console.log('Download response2', response);
            console.log('Low network', this.state.isLowConnection);
          }
        });
      },
    );
  }

  checkUser() {
    console.log('user id', this.props.data.audits.userId);
    var userid = this.props.data.audits.userId;
    var token = this.props.data.audits.token;
    var UserStatus = '';
    var serverUrl = this.props.data.audits.serverUrl;
    var ID = this.props.data.audits.userId;
    var path = '';
    console.log(userid, token);

    auth.getCheckUser(userid, token, (res, data) => {
      console.log('120 User information', data);
      if (data.data.Message == 'Success') {
        console.log('Checking User status', data.data.Data.ActiveStatus);
        UserStatus = data.data.Data.ActiveStatus;
        if (UserStatus == 2) {
          console.log('User active');
          // we have to modify the flow here. we have to check the Path of all the files here

          // this.syncAuditsToServer()
          this.checkFilePath();
        } else if (UserStatus == 1) {
          console.log('deleting user details');

          var cleanURL = serverUrl.replace(/^https?:\/\//, '');
          var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          this.propsServerUrl = formatURL;

          console.log('cleanURL', this.propsServerUrl);
          // var ID = this.props.data.audits.userId
          console.log('path', this.propsServerUrl + ID);

          if (Platform.OS == 'android') {
            path =
              '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser' +
              '/' +
              this.propsServerUrl +
              ID;
            console.log('path storing-->', path);
          } else {
            var iOSpath = RNFS.DocumentDirectoryPath;
            path = iOSpath + '/' + this.propsServerUrl + ID;
          }
          console.log('*** path', path);
          // this.deleteUserFile(path)
          this.refs.toast.show(
            strings.user_disabled_text,
            DURATION.LENGTH_SHORT,
          );
          this.props.navigation.navigate('LoginUIScreen');
        } else if (UserStatus == 0) {
          this.refs.toast.show(
            strings.user_inactive_text,
            DURATION.LENGTH_SHORT,
          );
          this.props.navigation.navigate('LoginUIScreen');
        }
      }
    });
  }

  async checkFilePath() {
    var audits = this.props.data.audits.auditRecords;
    console.log(audits, 'RE====>');
    var pushCLpath = [];
    var pushFormpath = [];
    var pushErrPath = [];

    for (var i = 0; i < audits.length; i++) {
      if (audits[i].AuditId == this.state.Checkpointpass.AuditID) {
        for (var j = 0; j < audits[i].Listdata.length; j++) {
          let attach = audits[i].Listdata?.[j]?.AttachmentList
          console.log("RE====>Attach", attach)
          let len = audits[i].Listdata?.[j]?.AttachmentList ? attach.length : 0
          console.log("RE====>Len", len)
          if (
            len > 0 &&
            audits[i].Listdata[j].Modified
          ) {
            pushCLpath.push(audits[i].Listdata[j]);
          }
        }
      }
    }
    console.log('Checkpoint contains file', pushCLpath);

    // Para checkpoints

    for (var j = 0; j < pushCLpath.length; j++) {

      for (var k = 0; k < pushCLpath[j].AttachmentList.length; k++) {
        var attach = pushCLpath[j].AttachmentList[k];
        let checkPath = await this.isPathExist(attach.FileUri);
        console.log('checkPath', checkPath);

        var check404 = checkPath;
        if (check404 == '/404') {
          console.log('Error path found', checkPath);
          pushErrPath.push(pushCLpath[j]);
        } else {
          console.log('URL path is ok', checkPath);
        }
      }
    }
    // Para Refence and templates
    console.log(
      'this.state.Checkpointpass.AuditID----',
      this.state.Checkpointpass.AuditID,
    );
    console.log('checkaudits--------', audits);

    for (var i = 0; i < audits.length; i++) {
      if (audits[i].AuditId == this.state.Checkpointpass.AuditID) {
        for (var j = 0; j < audits[i].Formdata.length; j++) {
          console.log('audits[i].Formdata--------', audits[i]);

          if (
            audits[i].Formdata[j].AttachedDocument != '' &&
            audits[i].Formdata[j].Attachmenttype == 0
          ) {
            console.log('audits[i].Formdata', audits[i].Formdata);

            if (
              audits[i].Formdata[j].AttachedDocument !==
              audits[i].Formdata[j].DocName
            ) {
              if (audits[i].Formdata[j].isModified) {
                pushFormpath.push(audits[i].Formdata[j]);
              }
            }
          }
        }
      }
    }

    console.log('Forms contains file', pushFormpath);

    for (var j = 0; j < pushFormpath.length; j++) {
      if (pushFormpath[j].Attachmenttype == 0) {
        let checkPath = await this.isPathExist(
          pushFormpath[j].AttachedDocument,
        );
        // console.log('checkPath',checkPath)

        var check404 = checkPath.slice(-4);
        if (check404 == '/404') {
          console.log('Error path found', checkPath);
          pushErrPath.push(pushFormpath[j]);
        } else {
          console.log('URL path is ok', checkPath);
        }
      }
    }

    console.log('=pushErrPath=>', pushErrPath);
    if (pushErrPath.length > 0) {
      // perform
      console.log('Broken path detected =========');
      this.setState({ missingFileArr: pushErrPath, isMissingFindings: false });
    } else {
      this.syncAuditsToServer();
    }
  }

  async isPathExist(arrpath) {
    return new Promise((resolve, reject) => {
      // console.log('arrpath',arrpath)
      if (Platform.OS == 'ios') {
        let IosFilesPath = arrpath;

        //let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
        console.log('ARRAY:IosFilesPath--->', IosFilesPath);
        const arr = arrpath.split('/');
        // var uripathIos = IosFilesPath + '/' + arr[arr.length - 1];
        var uripathIos = IosFilesPath;
        RNFS.readFile(uripathIos, 'base64')
          .then(res => {
            if (res) {
              console.log(res, 'base64:ios');
              resolve(arrpath);
              // console.log('path found',arrpath)
            }
          })
          .catch(err => {
            resolve(arrpath + '/' + 404);
            // console.warn('path not found',arrpath)
          });
      } else {
        RNFS.readFile(arrpath, 'base64')
          .then(res => {
            if (res) {
              console.log('ANDROIDDDD-------->', res);
              resolve(arrpath);
              // console.log('path found',arrpath)
            }
          })
          .catch(err => {
            resolve(arrpath + '/' + 404);
            // console.warn('path not found',arrpath)
          });
      }
    });
  }

  deleteUserFile(path) {
    console.log('RNFS.DocumentDirectoryPath', path);
    var serURL = this.props.data.audits.serverUrl;
    RNFS.exists(path)
      .then(result => {
        console.log('path result', result);
        if (result) {
          RNFetchBlob.fs
            .unlink(path)
            .then(() => {
              console.log('deleted success');
              setTimeout(() => {
                RNFS.exists(path).then(res => {
                  console.log('path', res);
                  this.setState(
                    {
                      dialogVisible: false,
                    },
                    () => {
                      this.props.clearAudits();
                      setTimeout(() => {
                        this.props.storeServerUrl(serURL);
                        console.log('FILE DELETED!');
                        this.props.navigation.navigate('LoginUIScreen');
                        this.refs.toast.show(
                          strings.user_disabled_text,
                          DURATION.LENGTH_SHORT,
                        );
                        console.log('Check server url', this.props.data);
                      }, 600);
                    },
                  );
                }, 1500);
              });
            })
            .catch(err => {
              console.log('err', err);
            });
        } else {
          console.log('Patha not found');
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  deleteAttachments(item, type) {
    console.log('Item to be deleted', item);
    console.log('Type', type);
    //** Delete file from ios  files folder */
    // if(Platform.OS == 'ios'){
    //       let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir+'/'+'IosFiles'
    //       console.log("IosFilesPath--->",IosFilesPath)
    //       var uripathIos = IosFilesPath+'/'+item.DocName
    //       if(RNFetchBlob.fs.isDir(IosFilesPath)){
    //       RNFetchBlob.fs.unlink(uripathIos).then( () => {console.log("IosFilesPath deleted successfully--->")})
    //       }
    //   }

    if (type == 'ref') {
      var RefList = this.state.RefList;
      var RefDelete = [];
      var PushArr = [];

      for (var i = 0; i < RefList.length; i++) {
        if (item.FormId == RefList[i].FormId) {
          if (item.DocName == RefList[i].DocName) {
            console.log('item', item);
            console.log('RefList[i]', RefList[i]);
            var deleteObj = {
              AttachedDocument: '',
              Attachmenttype: RefList[i].Attachmenttype,
              DocName: '',
              DocumentId: RefList[i].DocumentId,
              FormId: RefList[i].FormId,
              FormName: RefList[i].FormName,
              FormType: RefList[i].FormType,
              isModified: false,
            };
            PushArr.push(deleteObj);
          }
        } else {
          PushArr.push(RefList[i]);
        }
      }
      this.setState(
        {
          RefList: PushArr,
        },
        () => {
          console.log('this.state.RefList **', this.state.RefList);
          console.log('this.state.formDetails **', this.state.formDetails);
          var formDetails = this.state.formDetails;
          var formFreshArr = [];

          for (var i = 0; i < formDetails.length; i++) {
            var obj = '';
            for (var j = 0; j < this.state.RefList.length; j++) {
              if (formDetails[i].FormId == this.state.RefList[j].FormId) {
                obj = {
                  Attachmenttype: this.state.RefList[j].Attachmenttype,
                  FormId: this.state.RefList[j].FormId,
                  FormName: this.state.RefList[j].FormName,
                  FormType: this.state.RefList[j].FormType,
                  DocName: this.state.RefList[j].DocName,
                  AttachedDocument: this.state.RefList[j].AttachedDocument,
                  DocumentId: this.state.RefList[j].DocumentId,
                  isModified: this.state.RefList[j].isModified,
                };
                break;
              } else {
                obj = formDetails[i];
              }
            }
            formFreshArr.push(obj);
          }

          console.log('Refreshing props', formFreshArr);
          this.setState(
            {
              formDetails: formFreshArr,
            },
            () => {
              this.updateFormUploadDetails();
            },
          );
        },
      );
    } else {
      var TempList = this.state.TempList;
      var PushArr = [];

      for (var i = 0; i < TempList.length; i++) {
        if (item.FormId == TempList[i].FormId) {
          if (item.DocName == TempList[i].DocName) {
            var deleteObj = {
              AttachedDocument: '',
              Attachmenttype: TempList[i].Attachmenttype,
              DocName: '',
              DocumentId: TempList[i].DocumentId,
              FormId: TempList[i].FormId,
              FormName: TempList[i].FormName,
              FormType: TempList[i].FormType,
              isModified: false,
            };
            PushArr.push(deleteObj);
          }
        } else {
          PushArr.push(TempList[i]);
        }
      }
      this.setState(
        {
          TempList: PushArr,
        },
        () => {
          console.log('this.state.TempList', this.state.TempList);
          console.log('this.state.formDetails **', this.state.formDetails);
          var formDetails = this.state.formDetails;
          var formFreshArr = [];

          for (var i = 0; i < formDetails.length; i++) {
            var obj = '';
            for (var j = 0; j < this.state.TempList.length; j++) {
              if (formDetails[i].FormId == this.state.TempList[j].FormId) {
                obj = {
                  Attachmenttype: this.state.TempList[j].Attachmenttype,
                  FormId: this.state.TempList[j].FormId,
                  FormName: this.state.TempList[j].FormName,
                  FormType: this.state.TempList[j].FormType,
                  DocName: this.state.TempList[j].DocName,
                  AttachedDocument: this.state.TempList[j].AttachedDocument,
                  DocumentId: this.state.TempList[j].DocumentId,
                  isModified: this.state.TempList[j].isModified,
                };
                break;
              } else {
                obj = formDetails[i];
              }
            }
            formFreshArr.push(obj);
          }

          console.log('Refreshing props', formFreshArr);
          this.setState(
            {
              formDetails: formFreshArr,
            },
            () => {
              this.updateFormUploadDetails();
            },
          );
        },
      );
    }
  }

  checkoffline() {
    if (this.props.data.audits.isOfflineMode) {
      this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
    } else {
      this.setState({ dialogVisible: true });
    }
  }

  onConfirmPwdPress() {
    if (!this.state.pwdentry) {
      this.setState(
        {
          isEmptyPwd: strings.enter_password,
        },
        () => {
          // this.refs.toast.show('Empty password attempt', DURATION.LENGTH_SHORT)
        },
      );
    } else {
      NetInfo.fetch().then(isConnected => {
        if (isConnected.isConnected) {
          Keyboard.dismiss();
          var username = this.props.data.audits.loginuser;
          var pwd = this.state.pwdentry;
          var auditRecords = this.props.data.audits.auditRecords;
          var auditid = this.state.AuditID;

          var isEmpty = false;

          auditRecords.forEach(item => {
            if (item.AuditId == auditid) {
              if (!item.Formdata || item.Formdata.length == 0) {
                isEmpty = true;
              }
            }
          });

          var key = CryptoJS.enc.Utf8.parse('8080808080808080');
          var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

          var encryptedpassword = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(pwd),
            key,
            {
              keySize: 128 / 8,
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            },
          );

          auth.loginUser(
            username,
            encryptedpassword.toString(),
            '',
            this.state.deviceId,
            undefined,
            (res, data) => {
              if (data.data.Success == true) {
                if (isEmpty) {
                  this.setState(
                    {
                      confirmpwd: false,
                      pwdentry: undefined,
                    },
                    () => {
                      this.refs.toast.show(
                        'No Forms found to sync',
                        DURATION.LENGTH_SHORT,
                      );
                    },
                  );
                } else {
                  this.setState(
                    {
                      confirmpwd: false,
                      pwdentry: undefined,
                    },
                    () => {
                      console.log('this.StartSyncProcess.......');
                      this.StartSyncProcess();
                    },
                  );
                }
              } else {
                this.setState(
                  {
                    // confirmpwd : false,
                    pwdentry: undefined,
                    isEmptyPwd: strings.invalidpassword,
                  },
                  () => { },
                );
              }
            },
          );
        } else {
          this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
        }
      });
    }
  }

  checkMandateCount(item) {
    var mandatoryCheck = this.state.mandatoryCheck;
    var count = 0;
    for (var i = 0; i < mandatoryCheck.length; i++) {
      if (mandatoryCheck[i].Formdata == item.FormId) {
        count = mandatoryCheck[i].MandateCount;
        break;
      }
    }
    return count;
  }

  render() {
    console.log('newformID', this.props.data.audits.auditRecords);

    const attachmentType = [
      {
        value: 'Controlled',
        id: 0,
      },
      {
        value: 'UnControlled',
        id: 1,
      },
    ];
    const attachmentType2 = [
      {
        value: 'Controlled',
        id: 0,
      },
      {
        value: 'UnControlled',
        id: 1,
      },
    ];

    return (
      <View style={styles.wrapper}>
        <OfflineNotice />

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65,
          }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={
                this.state.isLoaderVisible === false
                  ? () => this.props.navigation.goBack()
                  : () => {
                    console.log('please wait');
                  }
              }>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>{strings.Audit_Records}</Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: 'white',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {this.state.breadCrumbText}
              </Text>
            </View>
            {/* <View style={{width:Window.width,height:20,position:'absolute',backgroundColor:'yellow'}}>

            </View> */}
            <View style={styles.headerDiv}>
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() =>
                  this.props.navigation.navigate('AuditDashboard')
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* <View style={styles.secondDiv}>
          <View style={styles.checktBox}>
            <View style={{top:0,marginBottom: 5}}>
              <Text style={{color:'#A0A0A0',fontSize: Fonts.size.h5}}>Online Form</Text>
            </View>
            <TouchableOpacity
            onPress={
              (this.state.isLoaderVisible === false) ? 
              this.onCheckPress.bind(this) :
              () => {console.log('please wait')}
            }>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
              colors={['#14D0AE', '#1FBFD0', '#2EA4E2']} 
              style={styles.CheckButton}>
                <Text style={styles.buttonText}>
                  Check List
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View> */}

        {this.state.isLoaderVisible === false ? (
          <View style={styles.auditPageBody}>
            {/* Tab View */}
            <ScrollableTabView
              initialPage={this.state.ActiveTab}
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
                    fontSize: Fonts.size.regular,
                    fontFamily: 'OpenSans-Regular',
                  }}
                />
              )}
              tabBarPosition="overlayTop">
              <ScrollView
                tabLabel={strings.Online}
                style={styles.scrollViewBody}>
                {this.state.OnlineList.length > 0 ? (
                  <View style={{ marginTop: 60 }}>
                    {this.state.OnlineList.map((item, key) => (
                      <View key={key} style={styles.secondDiv}>
                        {console.log(this.state.OnlineList, 'onlinelist==>')}
                        <TouchableOpacity
                          onPress={
                            this.state.isLoaderVisible === false
                              ? this.onCheckPress.bind(this, item)
                              : () => {
                                console.log('please wait');
                              }
                          }>
                          <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
                            style={styles.CheckButton}>
                            {/* <View style={styles.madatecircleDiv}>
                              {this.checkMandateCount(item) == 0 ? null : (
                                <View style={styles.mandatecircle}>
                                  <Text
                                    style={{
                                      color: '#14D0AE',
                                      fontSize: 20,
                                      fontFamily: 'OpenSans-Regular',
                                    }}>
                                    {this.checkMandateCount(item)}
                                  </Text>
                                </View>
                              )}
                            </View> */}
                            {/* <View style={styles.mandatecircle}>
                                  <Text
                                    style={{
                                      color: '#14D0AE',
                                      fontSize: 20,
                                      fontFamily: 'OpenSans-Regular',
                                    }}>
                                    {this.checkMandateCount(item)}
                                  </Text>
                                </View> */}
                            <View style={{ width: '95%', height: null }}>
                              <Text style={styles.buttonText}>
                                {item.FormName.length > 30
                                  ? item.FormName.slice(0, 30) + '...'
                                  : item.FormName}
                              </Text>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={{ marginTop: 55 }}>
                    <Text
                      style={{
                        width: width(90),
                        textAlign: 'center',
                        marginTop: 45,
                        fontSize: Fonts.size.h5,
                        paddingTop: 40,
                        color: 'grey',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.No_online_form_found}
                    </Text>
                  </View>
                )}
              </ScrollView>
              <ScrollView
                tabLabel={strings.Templates}
                style={styles.scrollViewBody}>
                {this.state.TempList.length > 0 ? (
                  <View style={{ marginTop: 60 }}>
                    {this.state.TempList.map((item, key) => (
                      <View key={key} style={styles.cardBox}>
                        <View style={styles.sectionTop}>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxHeader}>
                              {strings.Form_Name}
                            </Text>
                          </View>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxContent}>
                              {item.FormName}
                            </Text>
                          </View>
                        </View>
                        {item.Attachmenttype == 0 ? (
                          <View style={styles.sectionBottom}>
                            <View style={styles.sectionContent}>
                              <Text numberOfLines={1} style={styles.boxHeader}>
                                {strings.Attach_Files}
                              </Text>
                            </View>
                            <View style={styles.sectionContent}>
                              <TouchableOpacity
                                onPress={() => this.FilePress(item)}
                                style={styles.AttBox}>
                                <Text
                                  numberOfLines={1}
                                  style={styles.boxContent}>
                                  {item.Attachmenttype == 1
                                    ? '-'
                                    : item.AttachedDocument == ''
                                      ? ' - '
                                      : item.AttachedDocument}
                                </Text>
                              </TouchableOpacity>
                              {item.AttachedDocument &&
                                item.Attachmenttype == 0 ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.deleteAttachments(item, 'temp')
                                  }>
                                  <Icon name="trash" size={20} color="red" />
                                </TouchableOpacity>
                              ) : null}
                              {item.Attachmenttype == 0 ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    // iPhone/Android
                                    if (Platform.OS == 'android') {
                                      DocumentPicker.pick(
                                        {
                                          type: [DocumentPicker.types.allFiles],
                                        },
                                        (error, res) => {
                                          console.log(
                                            'File upload error:',
                                            error,
                                          );
                                          console.log(
                                            'Document response:',
                                            res,
                                          );

                                          if (res) {
                                            // console.log('Form item', item)
                                            // console.log('Form item', this.state.formDetails)
                                            var formDetailsOrg =
                                              this.state.formDetails;
                                            var formDetails = [];

                                            for (
                                              var i = 0;
                                              i < formDetailsOrg.length;
                                              i++
                                            ) {
                                              formDetails.push({
                                                AttachedDocument:
                                                  formDetailsOrg[i]
                                                    .AttachedDocument,
                                                Attachmenttype:
                                                  formDetailsOrg[i]
                                                    .Attachmenttype,
                                                DocName:
                                                  formDetailsOrg[i].DocName,
                                                FormId:
                                                  formDetailsOrg[i].FormId,
                                                FormName:
                                                  formDetailsOrg[i].FormName,
                                                FormType:
                                                  formDetailsOrg[i].FormType,
                                                DocumentId:
                                                  formDetailsOrg[i].DocumentId,
                                                isModified:
                                                  formDetailsOrg[i].isModified,
                                                // Attachmenttype: data.data.Data[i].Attachmenttype,
                                                // FormId: data.data.Data[i].FormId,
                                                // DocumentId:data.data.Data[i].DocumentId,
                                                // FormName: data.data.Data[i].FormName,
                                                // DocName:data.data.Data[i].FileName,
                                                // FormType: data.data.Data[i].FormType,
                                                // AttachedDocument: '',
                                              });
                                            }

                                            for (
                                              var i = 0;
                                              i < formDetails.length;
                                              i++
                                            ) {
                                              if (
                                                formDetails[i].FormId ==
                                                item.FormId
                                              ) {
                                                formDetails[i].DocName =
                                                  res.fileName;
                                                formDetails[
                                                  i
                                                ].AttachedDocument = res.uri;
                                                formDetails[
                                                  i
                                                ].Attachmenttype = 0;
                                                formDetails[
                                                  i
                                                ].isModified = true;
                                              }
                                            }
                                            this.setState(
                                              { formDetails: formDetails },
                                              () => {
                                                console.log(
                                                  'formDetails',
                                                  this.state.formDetails,
                                                );
                                                this.updateFormUploadDetails();
                                                this.getForname();
                                              },
                                            );

                                            /**
                                    RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                        // handle the data ..
                                        res.data = data
                                        // Android
                                        console.log(
                                          res.uri,
                                          res.type, // mime type
                                          res.fileName,
                                          res.fileSize,
                                          res.data
                                        );
                                        // console.log('Form item', item)
                                        // console.log('Form item', this.state.formDetails)
                                      }) */
                                          }
                                        },
                                      );
                                    } else {
                                      DocumentPicker.pick(
                                        {
                                          type: ['public.content'],
                                        },
                                        (error, res) => {
                                          console.log(
                                            'File upload error:',
                                            error,
                                          );
                                          console.log(
                                            'Document response:',
                                            res,
                                          );
                                          if (res) {
                                            var getURI = res.uri;
                                            var uridata = getURI.slice(7);
                                            console.log('uridata', uridata);
                                            RNFetchBlob.fs
                                              .readFile(uridata, 'base64')
                                              .then(data => {
                                                res.data = data;
                                                console.log(
                                                  'fetchBlobdata',
                                                  res.uri,
                                                  res.type,
                                                  res.fileName,
                                                  res.fileSize,
                                                  res.data,
                                                );
                                                if (res.fileSize > 52428800) {
                                                  alert(strings.alert);
                                                } else {
                                                  let IosFilesPath =
                                                    RNFetchBlob.fs.dirs
                                                      .DocumentDir +
                                                    '/' +
                                                    'IosFiles';
                                                  console.log(
                                                    'IosFilesPath--->',
                                                    IosFilesPath,
                                                  );
                                                  const arr =
                                                    uridata.split('/');
                                                  var uripathIos =
                                                    IosFilesPath +
                                                    '/' +
                                                    arr[arr.length - 1];
                                                  RNFetchBlob.fs
                                                    .writeFile(
                                                      uripathIos,
                                                      data,
                                                      'base64',
                                                    )
                                                    .then(data => {
                                                      console.log(
                                                        'File added sucessfully',
                                                      );
                                                    });
                                                  var formDetailsOrg =
                                                    this.state.formDetails;
                                                  var formDetails = [];

                                                  for (
                                                    var i = 0;
                                                    i < formDetailsOrg.length;
                                                    i++
                                                  ) {
                                                    formDetails.push({
                                                      AttachedDocument:
                                                        formDetailsOrg[i]
                                                          .AttachedDocument,
                                                      Attachmenttype:
                                                        formDetailsOrg[i]
                                                          .Attachmenttype,
                                                      DocName:
                                                        formDetailsOrg[i]
                                                          .DocName,
                                                      FormId:
                                                        formDetailsOrg[i]
                                                          .FormId,
                                                      FormName:
                                                        formDetailsOrg[i]
                                                          .FormName,
                                                      FormType:
                                                        formDetailsOrg[i]
                                                          .FormType,
                                                      DocumentId:
                                                        formDetailsOrg[i]
                                                          .DocumentId,
                                                      isModified:
                                                        formDetailsOrg[i]
                                                          .isModified,
                                                      // Attachmenttype: data.data.Data[i].Attachmenttype,
                                                      // FormId: data.data.Data[i].FormId,
                                                      // DocumentId:data.data.Data[i].DocumentId,
                                                      // FormName: data.data.Data[i].FormName,
                                                      // DocName:data.data.Data[i].FileName,
                                                      // FormType: data.data.Data[i].FormType,
                                                      // AttachedDocument: '',
                                                    });
                                                  }

                                                  // check iOS
                                                  for (
                                                    var i = 0;
                                                    i < formDetails.length;
                                                    i++
                                                  ) {
                                                    if (
                                                      formDetails[i].FormId ==
                                                      item.FormId
                                                    ) {
                                                      formDetails[i].DocName =
                                                        res.fileName;
                                                      formDetails[
                                                        i
                                                      ].AttachedDocument =
                                                        uridata;
                                                      (formDetails[
                                                        i
                                                      ].Attachmenttype = 0),
                                                        (formDetails[
                                                          i
                                                        ].isModified = true);
                                                    }
                                                  }
                                                  console.log(
                                                    'Form item',
                                                    item,
                                                  );
                                                  console.log(
                                                    'Form item',
                                                    this.state.formDetails,
                                                  );

                                                  this.setState(
                                                    {
                                                      formDetails: formDetails,
                                                    },
                                                    () => {
                                                      // console.log('formDetails', this.state.formDetails)
                                                      this.updateFormUploadDetails();
                                                      this.getForname();
                                                    },
                                                  );
                                                }
                                              });
                                          }
                                        },
                                      );
                                    }
                                    // iPad
                                    /*const {pageX, pageY} = event.nativeEvent;
                              DocumentPicker.show({
                              top: pageY,
                              left: pageX,
                              filetype: ['public.image'],
                              }, (error, url) => {
                                alert(url);
                              });*/
                                  }}>
                                  <ResponsiveImage
                                    source={Images.AttachIcon}
                                    initWidth="24"
                                    initHeight="22"
                                  />
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        ) : null}
                        <View style={styles.sectionBottom}>
                          <View style={styles.sectionContent}>
                            {/* <Text numberOfLines={1} style={styles.boxHeader}>{strings.Attach_Files}</Text> */}
                          </View>
                          <View style={{ width: '100%', height: null }}>
                            <Dropdown
                              data={attachmentType2}
                              label={strings.attachmenttype}
                              labelField={'label'}
                              valueField={'value'}
                              value={
                                this.state.TempList[key]
                                  ? this.state.TempList[key].Attachmenttype == 0
                                    ? attachmentType2[0].value
                                    : attachmentType2[1].value
                                  : attachmentType2[0].value
                              }
                              fontSize={Fonts.size.regular}
                              labelFontSize={Fonts.size.small}
                              baseColor={'#A6A6A6'}
                              selectedItemColor="#000"
                              textColor="#000"
                              itemColor="#000"
                              itemPadding={5}
                              dropdownOffset={{ top: 10, left: 0 }}
                              itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                              onChange={value => {
                                var TempList = [];

                                TempList = this.state.TempList;
                                for (
                                  var i = 0;
                                  i < attachmentType2.length;
                                  i++
                                ) {
                                  if (value.value == attachmentType2[i].value) {
                                    console.log('selected', attachmentType2[i]);
                                    var typeID = attachmentType2[i].id;
                                  }
                                }
                                TempList[key].Attachmenttype = typeID;
                                TempList[key].AttachedDocument = '';
                                this.setState(
                                  {
                                    TempList: TempList,
                                  },
                                  () => {
                                    console.log('Modified', TempList);
                                  },
                                );
                              }}
                            />
                          </View>
                          {this.state.TempList[key].Attachmenttype == 1 ? (
                            <View
                              style={[
                                styles.sectionContent,
                                { width: '100%', flexDirection: 'column' },
                              ]}>
                              <View style={{ width: '100%', height: null }}>
                                {this.state.TempList[key].AttachedDocument !=
                                  '' ? (
                                  <Text
                                    style={{
                                      color: 'grey',
                                      left: 0,
                                      fontFamily: 'OpenSans-Regular',
                                    }}>
                                    {strings.UncontrolledLink}
                                  </Text>
                                ) : null}
                              </View>
                              <View style={{ width: '100%', height: null }}>
                                <TextInput
                                  multiline={true}
                                  value={
                                    this.state.TempList[key].AttachedDocument
                                  }
                                  style={{
                                    fontSize: 18,
                                    fontFamily: 'OpenSans-Regular',
                                  }}
                                  placeholder={strings.UncontrolledLink}
                                  placeholderTextColor="#A9A9A9"
                                  baseColor="#A6A6A6"
                                  textColor="#747474"
                                  onChangeText={text => {
                                    var TempList = [];

                                    TempList = this.state.TempList;
                                    TempList[key].AttachedDocument = text;
                                    TempList[key].DocName = text;
                                    TempList[key].isModified = true;
                                    this.setState(
                                      {
                                        TempList: TempList,
                                      },
                                      () => {
                                        console.log(
                                          'TempList modified',
                                          this.state.TempList,
                                        );
                                      },
                                    );
                                  }}
                                  onBlur={() => {
                                    Keyboard.dismiss();
                                    console.log(
                                      'this.state.formDetails',
                                      this.state.formDetails,
                                    );
                                    console.log(
                                      'this.state.RefList',
                                      this.state.TempList,
                                    );
                                    var formDetails = [];
                                    for (
                                      var i = 0;
                                      i < this.state.formDetails.length;
                                      i++
                                    ) {
                                      if (
                                        this.state.formDetails[i].FormId ==
                                        this.state.TempList[key].FormId
                                      ) {
                                        formDetails.push({
                                          AttachedDocument:
                                            this.state.TempList[key]
                                              .AttachedDocument,
                                          Attachmenttype:
                                            this.state.TempList[key]
                                              .Attachmenttype,
                                          DocName:
                                            this.state.TempList[key]
                                              .AttachedDocument,
                                          DocumentId:
                                            this.state.formDetails[i]
                                              .DocumentId,
                                          FormId:
                                            this.state.formDetails[i].FormId,
                                          FormName:
                                            this.state.formDetails[i].FormName,
                                          FormType:
                                            this.state.formDetails[i].FormType,
                                          isModified:
                                            this.state.TempList[key].isModified,
                                        });
                                        console.log(
                                          'Modified object',
                                          formDetails,
                                        );
                                      } else {
                                        formDetails.push(
                                          this.state.formDetails[i],
                                        );
                                      }
                                    }
                                    console.log('formDetails', formDetails);
                                    this.setState(
                                      {
                                        formDetails: formDetails,
                                      },
                                      () => {
                                        console.log(
                                          'formDetails modified',
                                          this.state.formDetails,
                                        );
                                        this.updateFormUploadDetails();
                                        this.getForname();
                                      },
                                    );
                                  }}
                                />
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 55,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Text
                      style={{
                        // width: width(90),
                        textAlign: 'center',
                        marginTop: 45,
                        fontSize: Fonts.size.h5,
                        paddingTop: 40,
                        color: 'grey',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.No_templates_found}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <ScrollView
                tabLabel={strings.References}
                style={styles.scrollViewBody}>
                {this.state.RefList.length > 0 ? (
                  <View style={{ marginTop: 60 }}>
                    {this.state.RefList.map((item, key) => (
                      <View key={key} style={styles.cardBox}>
                        <View style={styles.sectionTop}>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxHeader}>
                              {strings.Form_Name}
                            </Text>
                          </View>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxContent}>
                              {item.FormName}
                            </Text>
                          </View>
                        </View>
                        {item.Attachmenttype == 0 ? (
                          <View style={styles.sectionTop}>
                            <View style={styles.sectionContent}>
                              <Text numberOfLines={1} style={styles.boxHeader}>
                                {strings.Attach_Files}
                              </Text>
                            </View>
                            <View style={styles.sectionContent}>
                              <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                  onPress={() => this.FilePress(item)}
                                  style={styles.AttBox}>
                                  <Text
                                    numberOfLines={1}
                                    style={styles.boxContent}>
                                    {item.Attachmenttype == 1
                                      ? '-'
                                      : item.AttachedDocument == ''
                                        ? ' - '
                                        : item.AttachedDocument}
                                  </Text>
                                </TouchableOpacity>
                                {item.AttachedDocument &&
                                  item.Attachmenttype == 0 ? (
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.deleteAttachments(item, 'ref')
                                    }>
                                    <Icon name="trash" size={20} color="red" />
                                  </TouchableOpacity>
                                ) : null}
                              </View>

                              {item.Attachmenttype == 0 ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    if (Platform.OS == 'android') {
                                      // iPhone/Android
                                      DocumentPicker.pick(
                                        {
                                          filetype: [
                                            DocumentPicker.types.allFiles,
                                          ],
                                        },
                                        (error, res) => {
                                          console.log(
                                            'File upload error:',
                                            error,
                                          );
                                          console.log(
                                            'Document response:',
                                            res,
                                          );
                                          if (res) {
                                            // handle the data ..
                                            // res.data = data
                                            // Android
                                            console.log(
                                              res.uri,
                                              res.type, // mime type
                                              res.fileName,
                                              res.fileSize,
                                              res.data,
                                            );
                                            // console.log('Form item', item)
                                            var formDetailsOrg =
                                              this.state.formDetails;
                                            var formDetails = [];

                                            for (
                                              var i = 0;
                                              i < formDetailsOrg.length;
                                              i++
                                            ) {
                                              formDetails.push({
                                                AttachedDocument:
                                                  formDetailsOrg[i]
                                                    .AttachedDocument,
                                                Attachmenttype:
                                                  formDetailsOrg[i]
                                                    .Attachmenttype,
                                                DocName:
                                                  formDetailsOrg[i].DocName,
                                                FormId:
                                                  formDetailsOrg[i].FormId,
                                                FormName:
                                                  formDetailsOrg[i].FormName,
                                                FormType:
                                                  formDetailsOrg[i].FormType,
                                                DocumentId:
                                                  formDetailsOrg[i].DocumentId,
                                                isModified:
                                                  formDetailsOrg[i].isModified,
                                              });
                                            }
                                            for (
                                              var i = 0;
                                              i < formDetails.length;
                                              i++
                                            ) {
                                              if (
                                                formDetails[i].FormId ==
                                                item.FormId
                                              ) {
                                                formDetails[i].DocName =
                                                  res.fileName;
                                                formDetails[
                                                  i
                                                ].AttachedDocument = res.uri;
                                                formDetails[
                                                  i
                                                ].Attachmenttype = 0;
                                                formDetails[
                                                  i
                                                ].isModified = true;
                                              }
                                            }
                                            this.setState(
                                              { formDetails: formDetails },
                                              () => {
                                                console.log(
                                                  'formDetails',
                                                  this.state.formDetails,
                                                );
                                                this.updateFormUploadDetails();
                                                this.getForname();
                                              },
                                            );
                                          }
                                        },
                                      );
                                    } else {
                                      // iPhone/Android
                                      DocumentPicker.pick(
                                        {
                                          filetype: ['public.content'],
                                        },
                                        (error, res) => {
                                          console.log(
                                            'File upload error:',
                                            error,
                                          );
                                          console.log(
                                            'Document response:',
                                            res,
                                          );
                                          if (res) {
                                            var getURI = res.uri;
                                            var uridata = getURI.slice(7);
                                            console.log('uridata', uridata);

                                            RNFetchBlob.fs
                                              .readFile(uridata, 'base64')
                                              .then(data => {
                                                res.data = data;
                                                console.log(
                                                  'fetchBlobdata',
                                                  res.uri,
                                                  res.type,
                                                  res.fileName,
                                                  res.fileSize,
                                                  res.data,
                                                );
                                                if (res.fileSize > 52428800) {
                                                  alert(strings.alert);
                                                } else {
                                                  let IosFilesPath =
                                                    RNFetchBlob.fs.dirs
                                                      .DocumentDir +
                                                    '/' +
                                                    'IosFiles';
                                                  console.log(
                                                    'IosFilesPath--->',
                                                    IosFilesPath,
                                                  );
                                                  const arr =
                                                    uridata.split('/');
                                                  var uripathIos =
                                                    IosFilesPath +
                                                    '/' +
                                                    arr[arr.length - 1];
                                                  RNFetchBlob.fs
                                                    .writeFile(
                                                      uripathIos,
                                                      data,
                                                      'base64',
                                                    )
                                                    .then(data => {
                                                      console.log(
                                                        'File added sucessfully',
                                                      );
                                                    });

                                                  // console.log('Form item', item)
                                                  var formDetailsOrg =
                                                    this.state.formDetails;
                                                  var formDetails = [];

                                                  for (
                                                    var i = 0;
                                                    i < formDetailsOrg.length;
                                                    i++
                                                  ) {
                                                    formDetails.push({
                                                      AttachedDocument:
                                                        formDetailsOrg[i]
                                                          .AttachedDocument,
                                                      Attachmenttype:
                                                        formDetailsOrg[i]
                                                          .Attachmenttype,
                                                      DocName:
                                                        formDetailsOrg[i]
                                                          .DocName,
                                                      FormId:
                                                        formDetailsOrg[i]
                                                          .FormId,
                                                      FormName:
                                                        formDetailsOrg[i]
                                                          .FormName,
                                                      FormType:
                                                        formDetailsOrg[i]
                                                          .FormType,
                                                      DocumentId:
                                                        formDetailsOrg[i]
                                                          .DocumentId,
                                                      isModified:
                                                        formDetailsOrg[i]
                                                          .isModified,
                                                    });
                                                  }
                                                  for (
                                                    var i = 0;
                                                    i < formDetails.length;
                                                    i++
                                                  ) {
                                                    if (
                                                      formDetails[i].FormId ==
                                                      item.FormId
                                                    ) {
                                                      formDetails[i].DocName =
                                                        res.fileName;
                                                      formDetails[
                                                        i
                                                      ].AttachedDocument =
                                                        uridata;
                                                      formDetails[
                                                        i
                                                      ].Attachmenttype = 0;
                                                      formDetails[
                                                        i
                                                      ].isModified = true;
                                                    }
                                                  }
                                                  this.setState(
                                                    {
                                                      formDetails: formDetails,
                                                    },
                                                    () => {
                                                      // console.log('formDetails', this.state.formDetails)
                                                      this.updateFormUploadDetails();
                                                      this.getForname();
                                                    },
                                                  );
                                                }
                                              });
                                          }
                                        },
                                      );
                                    }
                                  }}>
                                  <ResponsiveImage
                                    source={Images.AttachIcon}
                                    initWidth="24"
                                    initHeight="22"
                                  />
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        ) : null}
                        <View style={styles.sectionBottom}>
                          <View style={styles.sectionContent}>
                            {/* <Text numberOfLines={1} style={styles.boxHeader}>{strings.Attach_Files}</Text> */}
                          </View>
                          <View style={{ width: '100%', height: null }}>
                            <Dropdown
                              data={attachmentType}
                              label={strings.attachmenttype}
                              labelField="text"
                              valueField="value"
                              value={
                                this.state.RefList[key]
                                  ? this.state.RefList[key].Attachmenttype == 0
                                    ? attachmentType[0].value
                                    : attachmentType[1].value
                                  : attachmentType[0].value
                              }
                              fontSize={Fonts.size.regular}
                              labelFontSize={Fonts.size.small}
                              baseColor={'#A6A6A6'}
                              selectedItemColor="#000"
                              textColor="#000"
                              itemColor="#000"
                              itemPadding={5}
                              dropdownOffset={{ top: 10, left: 0 }}
                              itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                              onChange={value => {
                                var RefList = [];

                                RefList = this.state.RefList;
                                for (
                                  var i = 0;
                                  i < attachmentType.length;
                                  i++
                                ) {
                                  if (value.value == attachmentType[i].value) {
                                    console.log('selected', attachmentType[i]);
                                    var typeID = attachmentType[i].id;
                                  }
                                }
                                RefList[key].Attachmenttype = typeID;
                                RefList[key].AttachedDocument = '';
                                this.setState(
                                  {
                                    RefList: RefList,
                                  },
                                  () => {
                                    console.log('Modified', RefList);
                                  },
                                );
                              }}
                            />
                          </View>
                          {this.state.RefList[key].Attachmenttype == 1 ? (
                            <View
                              style={[
                                styles.sectionContent,
                                { width: '100%', flexDirection: 'column' },
                              ]}>
                              <View style={{ width: '100%', height: null }}>
                                {this.state.RefList[key].AttachedDocument !=
                                  '' ? (
                                  <Text
                                    style={{
                                      color: 'grey',
                                      left: 0,
                                      fontFamily: 'OpenSans-Regular',
                                    }}>
                                    {strings.UncontrolledLink}
                                  </Text>
                                ) : null}
                              </View>
                              <View style={{ width: '100%', height: null }}>
                                <TextInput
                                  multiline={true}
                                  value={
                                    this.state.RefList[key].AttachedDocument
                                  }
                                  style={{
                                    fontSize: 18,
                                    fontFamily: 'OpenSans-Regular',
                                  }}
                                  placeholder={strings.UncontrolledLink}
                                  placeholderTextColor="#A9A9A9"
                                  baseColor="#A6A6A6"
                                  textColor="#747474"
                                  onChangeText={text => {
                                    var RefList = [];

                                    RefList = this.state.RefList;
                                    RefList[key].AttachedDocument = text;
                                    RefList[key].DocName = text;
                                    RefList[key].isModified = true;
                                    this.setState(
                                      {
                                        RefList: RefList,
                                      },
                                      () => {
                                        console.log(
                                          'RefList modified',
                                          this.state.RefList,
                                        );
                                      },
                                    );
                                  }}
                                  onBlur={() => {
                                    Keyboard.dismiss();
                                    console.log(
                                      'this.state.formDetails',
                                      this.state.formDetails,
                                    );
                                    console.log(
                                      'this.state.RefList',
                                      this.state.RefList,
                                    );
                                    var formDetails = [];
                                    for (
                                      var i = 0;
                                      i < this.state.formDetails.length;
                                      i++
                                    ) {
                                      if (
                                        this.state.formDetails[i].FormId ==
                                        this.state.RefList[key].FormId
                                      ) {
                                        // console.log('into for loop--->',this.state.RefList[key].AttachedDocument)
                                        // console.log('this.state.formDetails[i] before',formDetails[i])
                                        // formDetails[i].AttachedDocument = this.state.RefList[key].AttachedDocument
                                        // formDetails[i].Attachmenttype = this.state.RefList[key].Attachmenttype
                                        // console.log('this.state.formDetails[i] after',formDetails[i])
                                        formDetails.push({
                                          AttachedDocument:
                                            this.state.RefList[
                                              key
                                            ].AttachedDocument.toLowerCase(),
                                          Attachmenttype:
                                            this.state.RefList[key]
                                              .Attachmenttype,
                                          DocName:
                                            this.state.RefList[key]
                                              .AttachedDocument,
                                          DocumentId:
                                            this.state.formDetails[i]
                                              .DocumentId,
                                          FormId:
                                            this.state.formDetails[i].FormId,
                                          FormName:
                                            this.state.formDetails[i].FormName,
                                          FormType:
                                            this.state.formDetails[i].FormType,
                                          isModified:
                                            this.state.RefList[key].isModified,
                                        });
                                        console.log(
                                          'Modified object',
                                          formDetails,
                                        );
                                      } else {
                                        formDetails.push(
                                          this.state.formDetails[i],
                                        );
                                      }
                                    }
                                    console.log('formDetails', formDetails);
                                    this.setState(
                                      {
                                        formDetails: formDetails,
                                      },
                                      () => {
                                        console.log(
                                          'formDetails modified',
                                          this.state.formDetails,
                                        );
                                        this.updateFormUploadDetails();
                                        this.getForname();
                                      },
                                    );
                                  }}
                                />
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 55,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Text
                      style={{
                        // width: width(90),
                        textAlign: 'center',
                        marginTop: 45,
                        fontSize: Fonts.size.h5,
                        paddingTop: 40,
                        color: 'grey',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.No_references_found}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </ScrollableTabView>
            <View style={styles.floatingDiv}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AuditSummary', {
                    AuditID: this.state.AuditID,
                    breadCrumbText: this.state.breadCrumbText,
                  });
                }}
                style={styles.floatinBtn}>
                <Icon name="align-justify" size={20} color="#00b3d6" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.auditPageBody}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Bars size={20} color="#1CB8CA" />
              <Text
                style={{ textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>
                {strings.Syncing_Audits}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
            {/* <Image source={Images.Footer}/> */}
            <View style={styles.footerDiv}>
            <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
                            style={styles.CheckButton}>
              {!this.state.isSyncing ? (
                <TouchableOpacity onPress={() => this.checkoffline()}>
                  {this.state.notifyRed === true ? (
                    <View style={{ left: 0, top: 2 }}>
                      <Icon name="circle" size={10} color="red" />
                    </View>
                  ) : (
                    <View></View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ResponsiveImage
                      source={Images.uploadToServerIcon}
                      initWidth="30"
                      initHeight="20"
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.regular,
                        marginLeft: 5,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Sync_to_server}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: '#CED0CE',
                  }}>
                  <ActivityIndicator size={20} color="#fff" />
                </View>
              )}
                </LinearGradient>
            </View>
       
        </View>

        <Toast
          ref="toast"
          style={{ backgroundColor: 'black', margin: 20 }}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: 'white' }}
        />

        <ConfirmDialog
          title={strings.Sync_title}
          message={strings.Sync_message}
          titleStyle={{ fontFamily: 'OpenSans-SemiBold' }}
          messageStyle={{ fontFamily: 'OpenSans-Regular' }}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: strings.yes,
            onPress: this.StartSyncProcess.bind(this),
            //   onPress: () =>
            //     this.setState({confirmpwd: true, dialogVisible: false}),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({ dialogVisible: false }),
          }}
        />
        <Modal
          isVisible={this.state.confirmpwd}
          onBackdropPress={() => this.setState({ confirmpwd: false })}>
          <View
            style={{
              width: '100%',
              height: 360,
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.setState({ confirmpwd: false })}>
              <Icon
                name="times-circle"
                style={{ alignSelf: 'flex-end' }}
                size={30}
                color="#2EA4E2"
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    color: '#2EA4E2',
                    fontFamily: 'OpenSans-Bold',
                  }}>
                  {strings.enterthepasswordtocontinuesyncprocess}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'grey',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.Username}
                </Text>
                <TextInput
                  value={this.props.data.audits.loginuser}
                  editable={false}
                  style={{
                    fontSize: 20,
                    color: 'lightgrey',
                    fontFamily: 'OpenSans-Bold',
                    borderBottomColor: 'lightgrey',
                    borderBottomWidth: 0.7,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'grey',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.Password}
                </Text>
                <TextInput
                  value={this.state.pwdentry}
                  style={{
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'OpenSans-Bold',
                    borderBottomColor: 'lightgrey',
                    borderBottomWidth: 0.7,
                  }}
                  secureTextEntry={true}
                  onChangeText={text =>
                    this.setState({ pwdentry: text, isEmptyPwd: undefined })
                  }
                />
                {this.state.isEmptyPwd ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'red',
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {this.state.isEmptyPwd}
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.onConfirmPwdPress()}
                  style={{
                    width: null,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#2EA4E2',
                    borderRadius: 30,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 20,
                      color: 'white',
                    }}>
                    {strings.continue}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isMissingFindings}>
          <View style={styles.missingModal}>
            <View style={styles.missingMContainer}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#2EA4E2',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Missingattachmentalert}
              </Text>
            </View>

            {/* body */}
            <View style={styles.missingBody}>
              <View style={styles.missingBodyHeader}>
                <Text style={styles.bodyText1}>
                  {
                    strings.ThfollowingCheckpointFormaredetectedwithmissingattachmentfiles
                  }
                </Text>
                <Text style={styles.bodyText2}>
                  {strings.Doyouwishtocontinuethesyncprocess}
                </Text>
              </View>
              <ScrollView style={styles.scrollBody}>
                {this.state.missingFileArr.map((items, i) => (
                  <View key={i} style={styles.carddivMissing}>
                    <View style={styles.cardContMissing}>
                      <View style={styles.cardSecMissing}>
                        <Text style={{ fontFamily: 'OpenSans-Regular' }}>
                          {strings.Type}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'red',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {items.ChecklistTemplateId
                            ? strings.online_form
                            : strings.templaterefernceform}
                        </Text>
                      </View>
                      <View style={styles.cardsec2Missing}>
                        <Text style={{ fontFamily: 'OpenSans-Regular' }}>
                          {strings.Name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: '#070F6E',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {items.ChecklistName
                            ? items.ChecklistName
                            : items.FormName}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.cardFooterMissing}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isMissingFindings: false,
                    isSyncing: false,
                    isLoaderVisible: false,
                  })
                }
                style={styles.cardBtnDiv}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'red',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.goBack}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ isMissingFindings: false }, () => {
                    this.syncAuditsToServer();
                  })
                }
                style={styles.cardBtn2Div}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'green',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.skipandcontinue}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    changeAuditState: isAuditing =>
      dispatch({ type: 'CHANGE_AUDIT_STATE', isAuditing }),
    storeAuditRecords: auditRecords =>
      dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
    storeAudits: audits => dispatch({ type: 'STORE_AUDITS', audits }),
    storeNCRecords: ncofiRecords =>
      dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords }),
    clearAudits: () => dispatch({ type: 'CLEAR_AUDITS' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditForm);

// import React, { Component } from 'react';
// import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

// let Window = Dimensions.get('window');

// class AuditForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//     this.scrollView = React.createRef()
//   }

//   press = () => {
//     //
//     this.scrollView.scrollTo({x: 1*Window.width, y: 0, animated: true })

//   }

//   render() {
//     return (
//       <View>
//        <ScrollView
//        horizontal
//        pagingEnabled
//        ref={(scrollView) => { this.scrollView = scrollView; }}
//        >
//         <View style={{
//           height: 100,
//           width: Window.width,
//           backgroundColor: 'pink'
//         }} />
//         <View style={{
//           height: 100,
//           width: Window.width,
//           backgroundColor: 'skyblue'
//         }} />
//         <View style={{
//           height: 100,
//           width: Window.width,
//           backgroundColor: 'red'
//         }} />
//        </ScrollView>

//        <TouchableOpacity style={{
//         margin: 30
//        }} onPress={()=>{
//         this.press()

//        }}>
//         <Text>Press</Text>
//        </TouchableOpacity>
//       </View>
//     );
//   }
// }

// export default AuditForm;