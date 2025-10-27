import React, {Component} from 'react';
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import {Images} from '../Themes/index';
import styles from './Styles/NCOFIPageStyle';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import FooterButton from '../Components/Shared/FooterButton';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import auth from '../Services/Auth';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import Moment from 'moment';
import {width, height} from 'react-native-dimension';
import OfflineNotice from '../Components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import {debounce, once} from 'underscore';
import NetInfo from '@react-native-community/netinfo';
import {create} from 'apisauce';
import * as constant from '../Constants/AppConstants';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-fetch-blob';
import CryptoJS from 'crypto-js';
import FileViewer from 'react-native-file-viewer';

var RNFS = require('react-native-fs');

let Window = Dimensions.get('window');
// const getFileFormat = filename => {
//   const parts = filename.split('.');
//   return parts[parts.length - 1].toLowerCase();
// };

const fileFormatToIcon = {
  txt: 'file-text-o',
  xls: 'file-excel-o',
  pdf: 'file-pdf-o',
  png: 'file-image-o',
};

const getFileFormat = fileName => {
  const splitFileName = fileName.split('.');
  return splitFileName[splitFileName.length - 1];
};
class NCOFIPage extends Component {
  // isAttachmentPresent = false;
  attatchedFindings = [];
  formRequestObj = [];
  count = [];
  brokenPath = undefined;
  pathDetails = [];

  constructor(props) {
    super(props);
    this.state = {
      token: '',
      NCdisplay: [],
      isModalVisible: false,
      NCtext: '',
      AUDIT_ID: '',
      AUDITPROG_ID: '',
      AUDITYPE_ORDER: '',
      AUDITYPE_ID: '',
      SITEID: '',
      AUDITPROGORDER: '',
      dropdownprops: [],
      NCdetails: [],
      CreateNCpass: [],
      localdata: [],
      NCmodalheader: '',
      isMounted: false,
      NCUpload: [],
      isLoaderVisible: true,
      isLoaderUploader: false,
      dialogVisible: false,
      deleteDialogVisible: false,
      isVisible: false,
      UploadDate: '',
      Responsible: '',
      Request: '',
      Category: '',
      Response: '',
      Standard: '',
      StandText: '',
      miniLoading: false,
      CorrectiveOrder: null,
      loadingData: true,
      breadCrumbText: undefined,
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      isLowConnection: false,
      missingFindings: [],
      isMissingFindings: false,
      confirmpwd: false,
      pwdentry: undefined,
      deviceId: '',
      isEmptyPwd: undefined,
      AuditOrder: undefined,
      CheckNC: 0,
      objectiveEvidence: '',
      Clause: '',
      FailureCategory: '',
      Process: '',
      DocumentReference: '',
      AttachEvidence: '',
      fileData: undefined,
      filepath: '',
      filepathArray: [],
      ncLoader: false,
      coombinedArray: [],
      fileName: '',
      lengthCheck: [],
      allParamsArr: [],
      AttachmentList: [],
      isAttachmentLoaded: false,
      isAttachmentPresent: false,
      deleteNCkey: '',
      uploadIndex : 0,
      totalFiles:0,
      AuditAttachments : [],
      FailedAttachments: [],
      syncStatusLabel : '',
      syncMode: 0,
    };
  }

  componentDidMount() {
    console.log('navigationprops', this.props.navigation.state.params);
    console.log('ncrecordsconsole', this.props.data.audits.ncofiRecords);
    DeviceInfo.getUniqueId().then(deviceId => {
      this.setState({
        deviceId,
      });
    });
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        console.log('Chinese script on', this.state.ChineseScript);
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
        console.log('Chinese script off', this.state.ChineseScript);
      });
    }
    console.log('Redux store...', this.props.data.audits);
    console.log('NCOFI mounted', this.props.navigation.state.params);
    console.log('NCOFI mountedparamcheck', this.props);

    this.setState(
      {
        // dropdownprops:this?.props?.navigation?.state?.params?.DropDownVal,
        CreateNCpass:
          this?.props?.navigation?.state?.params?.CreateNCdataBundle,
        AUDIT_ID:
          this?.props?.navigation?.state?.params?.CreateNCdataBundle?.AuditID,
        SITEID:
          this?.props?.navigation?.state?.params?.CreateNCdataBundle?.SiteID,
        breadCrumbText:
          this?.props?.navigation?.state?.params?.CreateNCdataBundle
            ?.breadCrumb,
        // breadCrumbText: this?.props?.navigation?.state?.params?.CreateNCdataBundle.breadCrumb.length > 30 ? this?.props?.navigation?.state?.params?.CreateNCdataBundle.breadCrumb.slice(0, 30) + '...' : this?.props?.navigation?.state?.params?.CreateNCdataBundle.breadCrumb,
        NCdetails: this.props.data.audits?.ncofiRecords,
        AuditOrder:
          this?.props?.navigation?.state?.params?.CreateNCdataBundle
            ?.AuditOrder,
        RouteParam: this?.props?.navigation?.state?.params?.RouteValue,
        isMounted: true,
      },
      () => {
        console.log(
          'NCDTA',
          this?.props?.navigation?.state?.params?.CreateNCdataBundle?.AuditID,
        );
        console.log('AuditOrder', this.state.AuditOrder);
        console.log('Mohan---->', this.state.NCdetails);
        this.getDetails();
        // this.setUpload()
        this.refreshList();
      },
    );
  }

  componentWillReceiveProps() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    console.log('--CurrentPage--->', CurrentPage);

    if (CurrentPage == 'NCOFIPage') {
      console.log('NCOFI Component Focussed!');
      if (this.state.isMounted) {
        this.setState(
          {
            NCdetails: this.props.data.audits.ncofiRecords,
          },
          () => {
            console.log('NCdetails', this.state.NCdetails);
            this.getDetails();
            this.setUpload();
          },
        );
      }
    } else {
      console.log('NCOFIPage pass');
    }
  }

  getDetails = () => {
    setTimeout(() => {
      var compArr = [];
      var Data = this.props.data.audits.ncofiRecords;
      console.log('NC Data', Data);

      for (var i = 0; i < Data.length; i++) {
        if (this.state.AUDIT_ID === Data[i].AuditID) {
          for (var j = 0; j < Data[i].Pending.length; j++) {
            if (Data[i].Pending[j].ChecklistTemplateId == 0) {
              if (Data[i].Pending[j].Category === 'NC') {
                console.log(Data[i].Pending[j], 'OFI===>');
                compArr.push({
                  AuditID: Data[i].Pending[j].AuditID,
                  AuditOrder: Data[i].Pending[j].AuditOrder,
                  ChecklistID: Data[i].Pending[j].ChecklistID,
                  Formid: Data[i].Pending[j].Formid,
                  SiteID: Data[i].Pending[j].SiteID,
                  title: Data[i].Pending[j].NCNumber,
                  failureDrop: Data[i].Pending[j].failureDrop,
                  requiretext: Data[i].Pending[j].requiretext,
                  OFI: Data[i].Pending[j].ofitext || Data[i].Pending[j].OFI,
                  categoryDrop: Data[i].Pending[j].categoryDrop,
                  userDrop: Data[i].Pending[j].userDrop,
                  requestDrop: Data[i].Pending[j].requestDrop,
                  deptDrop: Data[i].Pending[j].deptDrop,
                  NCNumber: Data[i].Pending[j].NCNumber + '-' + 'NC',
                  Category: Data[i].Pending[j].Category,
                  filename: Data[i].Pending[j].filename,
                  filedata: Data[i].Pending[j].filedata,
                  auditstatus: Data[i].Pending[j].auditstatus,
                  NonConfirmity: Data[i].Pending[j].NonConfirmity,
                  uniqueNCkey: Data[i].Pending[j].uniqueNCkey,
                  selectedItems: Data[i].Pending[j].selectedItems,
                  selectedItemsProcess: Data[i].Pending[j].selectedItemsProcess,
                  ChecklistTemplateId: Data[i].Pending[j].ChecklistTemplateId,
                  ncIdentifier: Data[i].Pending[j].ncIdentifier,
                  objEvidence: Data[i].Pending[j].objEvidence,
                  recommAction: Data[i].Pending[j].recommAction,
                  documentRef: Data[i].Pending[j].documentRef,
                  Conformance:
                    this?.props?.navigation?.state?.params?.CreateNCdataBundle
                      .Conformance,
                  ProcessID:
                    this?.props?.navigation?.state?.params?.CreateNCdataBundle
                      .ProcessID,
                  data: [
                    Data[i].Pending[j].NonConfirmity === undefined
                      ? 'N/a'
                      : Data[i].Pending[j].NonConfirmity,
                  ],
                });
              } else if (Data[i].Pending[j].Category === 'OFI') {
                console.log(Data[i].Pending[j], 'OFI===>');
                compArr.push({
                  AuditID: Data[i].Pending[j].AuditID,
                  AuditOrder: Data[i].Pending[j].AuditOrder,
                  Category: Data[i].Pending[j].Category,
                  ChecklistID: Data[i].Pending[j].ChecklistID,
                  Formid: Data[i].Pending[j].Formid,
                  NCNumber: Data[i].Pending[j].NCNumber + '-' + 'OFI',
                  NonConfirmity: Data[i].Pending[j].NonConfirmity,
                  failureDrop: Data[i].Pending[j].failureDrop,
                  OFI: Data[i].Pending[j].ofitext || Data[i].Pending[j].OFI,
                  SiteID: Data[i].Pending[j].SiteID,
                  auditstatus: Data[i].Pending[j].auditstatus,
                  categoryDrop: Data[i].Pending[j].categoryDrop,
                  deptDrop: Data[i].Pending[j].deptDrop,
                  filedata: Data[i].Pending[j].filedata,
                  filename: Data[i].Pending[j].filename,
                  requestDrop: Data[i].Pending[j].requestDrop,
                  requiretext: Data[i].Pending[j].requiretext,
                  title: Data[i].Pending[j].NCNumber,
                  uniqueNCkey: Data[i].Pending[j].uniqueNCkey,
                  userDrop: Data[i].Pending[j].userDrop,
                  selectedItems: Data[i].Pending[j].selectedItems,
                  selectedItemsProcess: Data[i].Pending[j].selectedItemsProcess,
                  ChecklistTemplateId: Data[i].Pending[j].ChecklistTemplateId,
                  ncIdentifier: Data[i].Pending[j].ncIdentifier,
                  objEvidence: Data[i].Pending[j].objEvidence,
                  recommAction: Data[i].Pending[j].recommAction,
                  documentRef: Data[i].Pending[j].documentRef,
                  Conformance:
                    this?.props?.navigation?.state?.params?.CreateNCdataBundle
                      .Conformance,
                  ProcessID:
                    this?.props?.navigation?.state?.params?.CreateNCdataBundle
                      .ProcessID,
                  data: [
                    Data[i].Pending[j].OFI === undefined
                      ? 'N/a'
                      : Data[i].Pending[j].OFI,
                  ],
                });
              }
            }
          }
        }
      }

      console.log('compArr', compArr);

      let abc = Array.from(new Set(compArr));

      console.log('Checking for duplicate', abc);

      this.setState({NCdisplay: compArr, isMounted: true}, () => {
        console.log('this.state.NCdisplay2', this.state.NCdisplay);
      });
    }, 500);
  };

  setUpload = () => {
    setTimeout(() => {
      var Data = this.props.data.audits.ncofiRecords;
      console.log('NC Data', Data);
      var compArr2 = [];

      for (var i = 0; i < Data.length; i++) {
        if (this.state.AUDIT_ID === Data[i].AuditID) {
          for (var j = 0; j < Data[i].Uploaded.length; j++) {
            compArr2.push({
              title: Data[i].Uploaded[j].NCNumber,
              CorrectiveOrder: Data[i].Uploaded[j].CorrectiveOrder,
              CheckNC: Data[i].Uploaded[j].CheckNC,
              data: [
                Data[i].Uploaded[j].NonConfirmity === undefined
                  ? 'N/a'
                  : Data[i].Uploaded[j].NonConfirmity,
              ],
            });
          }
        }
      }
      console.log('compArr2', compArr2);
      this.setState(
        {NCUpload: compArr2, isMounted: true, isLoaderVisible: false},
        () => {
          console.log('this.state.NCUpload', this.state.NCUpload);
        },
      );
    }, 500);
  };

  openEditBox = item => {
    console.log('111111111');
    console.log('ncpass==>', this.state.CreateNCpass);
    console.log('ncpasses', item);
    console.log('Process:pm', this.props.navigation.state.params);

    this.setState({
      AttachmentList: [],
      isAttachmentLoaded: false,
    });

    this.props.navigation.navigate('CreateNC', {
      auditDetailsList: this.props.navigation.state.params?.auditDetailsList,
      clauseMandatory: this.props.navigation.state.params?.clauseMandatory,
      CheckpointRoute: item.Category,
      AuditID: this.state.AUDIT_ID,
      NCOFIDetails: this.state.CreateNCpass,
      templateId: 0,
      type: 'EDIT',
      data: item,
      isUploaded: false,
      Conformance:
        this?.props?.navigation?.state?.params?.CreateNCdataBundle.Conformance,
      ProcessID:
        this?.props?.navigation?.state?.params?.CreateNCdataBundle.ProcessID,
    });
    console.log(
      this?.props?.navigation?.state?.params?.CreateNCdataBundle,
      'Conformance==>',
    );
  };

  getSectionListItem = item => {
    console.log('Item opened:fetchnc', item);

    this.setState(
      {
        NCmodalheader: item.title,
        CorrectiveOrder: item.CorrectiveOrder,
        CheckNC: item.CheckNC,
        isVisible: false,
        AttachmentList: [],
      },
      () => {
        console.log(
          'modal set:fetchnc',
          this.state.NCmodalheader,
          this.state.NCtext,
        );
        this.setState({isVisible: true}, () => {
          console.log('Modal opened:fetchnc!');
        });

        if (this.props.data.audits.isOfflineMode) {
          console.log('Offline mode:fetchnc');
        } else {
          NetInfo.fetch().then(isConnected => {
            if (isConnected.isConnected) {
              // call NC details here
              this.fetchNCdetails();
            }
          });
        }
      },
    );
  };

  fetchNCdetails() {
    var token = this.props.data.audits.token;
    // var Data = this.props.data.audits.audits
    var Data = this.props.data.audits.auditRecords;
    console.log('forming sds:fetchnc', this.state.AUDIT_ID, Data);

    for (var i = 0; i < Data.length; i++) {
      if (this.state.AUDIT_ID == Data[i].AuditId) {
        var AuditOrder = Data[i].AuditOrderId;
      }
    }

    console.log('forming:fetchnc', this.state.AUDIT_ID, this.state.AuditOrder);

    const CorrectiveId = this.state.AUDIT_ID;
    const CorrectiveOrder = this.state.CorrectiveOrder;
    console.log('corrective id:fetchnc', CorrectiveId, CorrectiveOrder);

    auth.getAllNCDetails(CorrectiveId, CorrectiveOrder, token, (res, data) => {
      console.log('incoming:fetchnc', res, data);
      // if (!res.ok) {
      //   throw new Error('Something went wrong!');
      // }

      if (data?.data) {
        console.log('entering:fetchnc', data.data);
        if (data?.data?.Message === 'Success') {
          console.log('response:fetchnc', data.data.Message);
          console.log('all nc details:fetchnc', data);
          // console.log(
          //   'data?.data?.Data?.NcDetails:fetchnc',
          //   data?.data?.Data?.FailureCategory[0]?.FailureCategoryName,
          //   data?.data?.Data?.NcDetails[0],
          // );
          // console.log("attachment:fetchnc",data?.data?.Data?.NCAttachment[0].Attachment,data?.data?.Data?.RequestedBy[0].RequestedBy)
          console.log(':fetchnc', data.data.Message);
          console.log(
            ':fetchncsss reach1',
            data?.data?.Data?.ResponseDate?.length,
            data?.data?.Data?.NcDetails?.length,
          );
          if (data?.data?.Data?.ResponseDate && data?.data?.Data?.NcDetails) {
            console.log(
              ':fetchnc reach2',
              data?.data?.Data?.ResponseDate?.length,
              data?.data?.Data?.NcDetails?.length,
            );
            var UploadDate = data?.data?.Data?.NcDetails
              ? data?.data?.Data?.NcDetails?.length == 0
                ? '-'
                : data?.data?.Data?.NcDetails[0]?.DateofUpload
              : '-';
            var Responsible = data?.data?.Data?.Responsibility
              ? data?.data?.Data?.Responsibility?.length == 0
                ? '-'
                : data?.data?.Data?.Responsibility[0]?.ResponsibilityPerson
              : '-';
            var FailureCategory = data?.data?.Data?.FailureCategory
              ? data?.data?.Data?.FailureCategory?.length == 0
                ? '-'
                : data?.data?.Data?.FailureCategory[0]?.FailureCategoryName
              : '-';
            var objectiveEvidence =
              data?.data?.Data?.NcDetails[0]?.ObjectiveEvidence;

            var Request = data?.data?.Data?.RequestedBy
              ? data?.data?.Data?.RequestedBy?.length == 0
                ? '-'
                : data?.data?.Data?.RequestedBy[0]?.RequestedByUsers
              : '-';
            var Category = data?.data?.Data?.CategoryDetail
              ? data?.data?.Data?.CategoryDetail?.length == 0
                ? '-'
                : data?.data?.Data?.CategoryDetail[0]?.Category
              : '-';
            var Response = data?.data?.Data?.ResponseDate
              ? data?.data?.Data?.ResponseDate?.length == 0
                ? '-'
                : data?.data?.Data?.ResponseDate[0]?.ResponseExtDate
              : '-';
            var Standard =
              data?.data?.Data?.StandardRequirement === null
                ? '-'
                : data?.data?.Data?.StandardRequirement;
            var FileName =
              data?.data?.Data?.NcDetails[0]?.FileName === null
                ? '-'
                : data?.data?.Data?.NcDetails[0]?.FileName;
            var Clause =
              data?.data?.Data?.StandardRequirement === null
                ? '-'
                : data?.data?.Data?.StandardRequirement[0]?.Element;

            var NCtext = data?.data?.Data?.NcDetails[0]?.Nonconformity;

            var DocumentReference = data?.data?.Data?.NcDetails
              ? data?.data?.Data?.NcDetails?.length > 0
                ? data?.data?.Data?.NcDetails[0]?.DocumentProcedure
                : '-'
              : '-';
            var Process = data?.data?.Data?.NCProcess
              ? data?.data?.Data?.NCProcess?.length == 0
                ? '-'
                : data?.data?.Data?.NCProcess[0]?.ProcessName
              : '-';
            var fileData = data?.data?.Data?.NCAttachment
              ? data?.data?.Data?.NCAttachment?.length == 0
                ? []
                : data?.data?.Data?.NCAttachment
              : [];

            this.setState(
              {
                isAttachmentPresent: fileData.length > 0,
              },
              () => {
                console.log(
                  'Attachment: Present:',
                  this.state.isAttachmentPresent,
                );
              },
            );

            this.WriteAttachments(fileData);
            // console.log("filepath",filepath)
            // console.log('ncdetails:nc text reah set', NCtext)
            this.setState(
              {
                UploadDate: UploadDate,
                Responsible: Responsible,
                Request: Request,
                Category: Category,
                Response: Response,
                Standard: Standard,
                loadingData: false,
                NCtext: NCtext,
                objectiveEvidence: objectiveEvidence,
                FileName: FileName,
                fileName: FileName,
                FailureCategory: FailureCategory,
                Clause: Clause,
                Process: Process,
                DocumentReference: DocumentReference,
                fileData: fileData,
                filepath: '',
                filepathArray: '',
                miniLoading: false,
              },
              () => {
                var standText = '';
                if (this.state.Standard !== '-') {
                  for (var i = 0; i < Standard.length; i++) {
                    standText = standText.concat(Standard[i].StdRequirement);
                  }
                  this.setState({StandText: standText}, () => {
                    console.log('StandText', this.state.StandText);
                  });
                } else {
                  this.setState({StandText: '-', loadingData: false}, () => {
                    console.log(
                      'this.state.StandText',
                      this.state.StandText,
                      this.state.loadingData,
                    );
                  });
                }
              },
            );
          }
        } else {
          /* this.setState({ miniLoading : true },() =>{
            console.log('cant reach server',this.state.miniLoading)
          }) */
          this.refs.toast.show(
            strings.Audit_NCOFI_Failed,
            DURATION.LENGTH_LONG,
          );
        }
      } else {
        console.log();
        this.refs.toast.show(strings.Audit_NCOFI_Failed, DURATION.LENGTH_LONG);
      }
    });
  }

  getImageType(extn) {
    console.log(extn, ':Extension');

    switch (extn) {
      case 'image':
        case 'jpg':
        case 'png':
        case 'jpeg':     
        case 'heic' :
        case 'gif':
        return 'image/' + extn;
      case 'pdf':
        return 'application/pdf';
      case 'doc':
      case 'docx':
        return 'application/msword';
      case 'xls':
      case 'xlsx':
      case 'numbers':
      case 'xlsm': 
        return 'application/vnd.ms-excel';    
      case 'mp4':
      case 'mpeg':
      case 'mpg':
        return 'video/' + extn;
      default:
        return 'application/octet-stream';
    }
  }

  onNavigaTo(id) {
    //this.CheckSync();
    if (id === 1) {
      this.props.navigation.navigate('CreateNC', {
        auditDetailsList: this.props.navigation.state.params?.auditDetailsList,
        CheckpointRoute: 'NC',
        AuditID: this.state.AUDIT_ID,
        NCOFIDetails: this.state.CreateNCpass,
        templateId: 0,
        type: 'ADD',
        data: null,
        isUploaded: false,
      });
    }
    if (id === 2) {
      this.props.navigation.navigate('CreateNC', {
        auditDetailsList: this.props.navigation.state.params?.auditDetailsList,
        CheckpointRoute: 'OFI',
        AuditID: this.state.AUDIT_ID,
        NCOFIDetails: this.state.CreateNCpass,
        templateId: 0,
        type: 'ADD',
        data: null,
        isUploaded: false,
      });
    }
  }

  RefreshUpload() {
    if (this.props.data.audits.isOfflineMode) {
      this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
    } else {
      NetInfo.fetch().then(isConnected => {
        if (isConnected.isConnected) {
          this.refreshList();
        } else {
          this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
        }
      });
    }
  }

  CheckInternetConnectivityNCOFI() {
    this.setState(
      {
        isLoaderVisible: true,
        dialogVisible: false,
        confirmpwd: false,
      },
      () => {
        var baseURL = this.props.data.audits.serverUrl;
        const check = create({
          baseURL: baseURL + 'CheckConnection',
        });
        check.post().then(response => {
          if (response.duration > constant.ThresholdSpeed) {
            this.setState(
              {
                isLowConnection: true,
              },
              () => {
                this.syncNCOFIToServer();
                this.checkUser();
                console.log('Download response', response);
                console.log('Low network', this.state.isLowConnection);
              },
            );
          } else {
            this.syncNCOFIToServer();
            this.checkUser();
            console.log('Download response', response);
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
    var type = 3;
    var path = '';
    console.log(userid, token);

    auth.getCheckUser(userid, token, (res, data) => {
      console.log('User information', data);
      if (data.data.Message == 'Success') {
        UserStatus = data.data.Data.ActiveStatus;
        if (UserStatus == 2) {
          console.log('User active');

          /** add one more layer for detecting deleted files. */

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
    try {
      console.log('Checking file path');

      var AUDIT_ID = this.state.AUDIT_ID;
      var ncofiRecords = this.props.data.audits.ncofiRecords;
      var pushPath = [];

      console.log('Checking file path', AUDIT_ID);
      console.log('Checking file path', ncofiRecords);

      if (ncofiRecords) {
        for (var i = 0; i < ncofiRecords.length; i++) {
          if (AUDIT_ID == ncofiRecords[i].AuditID) {
            for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
              console.log('Loop running', j);
              const filedata = ncofiRecords[i].Pending[j].filedata;
              if (filedata.length > 0) {
                for (var k = 0; k < filedata.length; k++) {
                  let filePath = filedata[k].fileData;

                  let res = await this.isPathExist(filePath);
                  console.log(res, 'resconsole===>');
                  var check404 = res.slice(-4);
                  console.log(check404, 'resconsole');
                  if (check404 == '/404') {
                    console.log('Error path found', res);
                    pushPath.push(filedata[k]);
                  } else {
                    console.log('URL path is ok', res);
                  }
                }
              }
              console.log('pushPath ==>', pushPath);
              if (pushPath.length > 0) {
                this.alertUser(pushPath);
              } else {
                // the file path are ok. continue to sync
                // this.syncNCOFIToServer();
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('checkFilePath', e);
    }
  }

  alertUser(pushPath) {
    console.log('getting broken path', pushPath);

    var AUDIT_ID = this.state.AUDIT_ID;
    var ncofiRecords = this.props.data.audits.ncofiRecords;
    var missingFindings = [];

    for (var i = 0; i < ncofiRecords.length; i++) {
      if (AUDIT_ID == ncofiRecords[i].AuditID) {
        for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
          for (var p = 0; p < pushPath.length; p++) {
            if (pushPath[p] == ncofiRecords[i].Pending[j].filedata) {
              // this nc is missing filename
              // make the filedata as empty field
              console.log(ncofiRecords[i].Pending[j]);
              var findings = {
                NCNumber: ncofiRecords[i].Pending[j].NCNumber,
                NonConfirmity: ncofiRecords[i].Pending[j].NonConfirmity,
              };
              missingFindings.push(findings);
            }
          }
        }
      }
    }
    this.setState(
      {
        missingFindings: missingFindings,
        isMissingFindings: false,
      },
      () => {
        console.log('missingFindings', this.state.missingFindings);
      },
    );
  }

  async isPathExist(arrpath) {
    try {
      return new Promise((resolve, reject) => {
        console.log('arrpath', arrpath);
        RNFS.readFile(arrpath, 'base64')
          .then(res => {
            if (res) {
              // resolve(arrpath);
              console.log(res, 'helloresconsole');
              console.log('path found', arrpath);
            }
          })
          .catch(err => {
            // resolve(arrpath + '/' + 404);
            console.warn('path not found', arrpath);
          });
      });
    } catch (e) {
      console.warn('isPathExist', e);
    }
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
                        this.refs.toast.show(
                          strings.user_disabled_text,
                          DURATION.LENGTH_SHORT,
                        );
                        this.props.navigation.navigate('LoginUIScreen');
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

  syncNCOFIToServer() {
    console.log('one:helloenter1');
    if (this.state.isLowConnection === false) {
      console.log('one:helloenter');
      if (this.props.data.audits.isOfflineMode) {
        this.setState({isLoaderVisible: false, dialogVisible: false, syncMode : 0});
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(isConnected => {
          if (isConnected.isConnected) {
            this.setState({dialogVisible: false, syncMode: 3}, function () {
              console.log('Processing...', this.state.dialogVisible);
            });
            console.log(
              'one:getting local unsaved data',
              this.props.data.audits.ncofiRecords,
            );
            var token = this.props.data.audits.token;
            var formRequest = [];
            var dataArr = this.props.data.audits.ncofiRecords;
            for (var i = 0; i < dataArr.length; i++) {
              if (dataArr[i].AuditID === this.state.AUDIT_ID) {
                for (var j = 0; j < dataArr[i].Pending.length; j++) {
                  if (dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId == 0) {
                    if (dataArr?.[i]?.Pending?.[j]?.Category == 'NC') {
                      const finalFileName = [
                        ...dataArr?.[i]?.Pending?.[j]?.filename,
                      ].join(', ');
                      // // dataArr?.[i]?.Pending?.[j]?.filename.concat(); // Concatenate the array
                      const finalFileData = [
                        ...dataArr?.[i]?.Pending?.[j]?.filedata.map(
                          item => item.fileData,
                        ),
                      ].join(', ');
                      console.log(finalFileName, '----one:concatenatedData1');
                      // , dataArr?.[i]?.Pending?.[j]?.filename, dataArr?.[i]?.Pending?.[j]?.filename[0])
                      console.log(
                        finalFileData,
                        dataArr?.[i]?.Pending?.[j]?.filedata,
                        '----one:concatenatedData2',
                      );
                      console.log(
                        'one:into NC targeted arr',
                        [i],
                        dataArr[i].Pending[j],
                      );
                      let reqBy = dataArr?.[i]?.Pending?.[j]?.requestDrop;
                      formRequest.push({
                        strProcess:
                          dataArr?.[i]?.Pending?.[j]?.selectedItemsProcess
                            .length > 0
                            ? dataArr?.[i]?.Pending?.[
                                j
                              ]?.selectedItemsProcess.join(',')
                            : '',
                        CorrectiveId: dataArr?.[i]?.Pending?.[j]?.AuditID,
                        CategoryId: dataArr?.[i]?.Pending?.[j]?.categoryDrop.id,
                        Title: dataArr?.[i]?.Pending?.[j]?.NCNumber,
                        FileName: finalFileName, //dataArr?.[i]?.Pending?.[j]?.filename,
                        ElementID: dataArr?.[i]?.Pending?.[j]?.selectedItems
                          ? dataArr?.[i]?.Pending?.[j]?.selectedItems.join(',')
                          : 0,
                        Department:
                          dataArr?.[i]?.Pending?.[j]?.deptDrop.id === undefined
                            ? 0
                            : dataArr?.[i]?.Pending?.[j]?.deptDrop.id,
                        AuditStatus:
                          dataArr?.[i]?.Pending?.[j]?.auditstatus == '' || dataArr?.[i]?.Pending?.[j]?.auditstatus == undefined || dataArr?.[i]?.Pending?.[j]?.auditstatus == null
                            ? 0
                            : parseInt(dataArr?.[i]?.Pending?.[j]?.auditstatus),
                        NonConformity:
                          dataArr?.[i]?.Pending?.[j]?.NonConfirmity,
                        ResponsibilityUser:
                          dataArr?.[i]?.Pending?.[j]?.userDrop.id,
                        SiteId: dataArr?.[i]?.Pending?.[j]?.SiteID,
                        RequestedBy: reqBy !== '' ? parseInt(reqBy) : reqBy,
                        FormId:
                          dataArr?.[i]?.Pending?.[j]?.Formid === ''
                            ? 0
                            : parseInt(dataArr?.[i]?.Pending?.[j]?.Formid),
                        ChecklistId:
                          dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId === ''
                            ? 0
                            : parseInt(
                                dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId,
                              ),
                        RecommendedAction:
                          dataArr?.[i]?.Pending?.[j]?.recommAction === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.recommAction,
                        FailureCategoryId:
                          dataArr?.[i]?.Pending[j]?.failureDrop?.value,

                        NCIdentifier:
                          dataArr?.[i]?.Pending?.[j]?.ncIdentifier === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.ncIdentifier,
                        ObjectiveEvidence:
                          dataArr?.[i]?.Pending?.[j]?.objEvidence === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.objEvidence,
                        uniqueNCkey: dataArr?.[i]?.Pending?.[j]?.uniqueNCkey,
                        AttachEvidence: finalFileData, //dataArr?.[i]?.Pending?.[j]?.fileData,
                        DocumentRef:
                          dataArr?.[i]?.Pending?.[j]?.documentRef === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.documentRef,
                        Conformance:
                          this?.props?.navigation?.state?.params
                            ?.CreateNCdataBundle.Conformance,
                        ProcessID:
                          this?.props?.navigation?.state?.params
                            ?.CreateNCdataBundle.ProcessID,
                        // AttachEvidence:dataArr?.[i]?.Pending?.[j]?.filedata,
                      });
                    } else if (dataArr?.[i]?.Pending?.[j]?.Category == 'OFI') {
                      const finalFileName = [
                        ...dataArr?.[i]?.Pending?.[j]?.filename,
                      ].join(', ');
                      const finalFileData = [
                        ...dataArr?.[i]?.Pending?.[j]?.filedata.map(
                          item => item.fileData,
                        ),
                      ].join(', ');
                      console.log(
                        'one:into OFI targeted arr',
                        [i],
                        dataArr[i].Pending[j],
                      );
                      formRequest.push({
                        strProcess:
                          dataArr?.[i]?.Pending?.[j]?.selectedItemsProcess
                            .length > 0
                            ? dataArr?.[i]?.Pending?.[
                                j
                              ]?.selectedItemsProcess.join(',')
                            : '',
                        CorrectiveId: dataArr?.[i]?.Pending?.[j]?.AuditID,
                        CategoryId: dataArr?.[i]?.Pending?.[j]?.categoryDrop.id,
                        Title: dataArr?.[i]?.Pending?.[j]?.NCNumber,
                        FileName: finalFileName, //dataArr?.[i]?.Pending?.[j]?.filename,
                        Department:
                          dataArr?.[i]?.Pending?.[j]?.deptDrop.id === undefined
                            ? 0
                            : dataArr?.[i]?.Pending?.[j]?.deptDrop.id,
                        AuditStatus:
                          dataArr?.[i]?.Pending?.[j]?.auditstatus == '' || dataArr?.[i]?.Pending?.[j]?.auditstatus == undefined || dataArr?.[i]?.Pending?.[j]?.auditstatus == null
                            ? 0
                            : parseInt(dataArr?.[i]?.Pending?.[j]?.auditstatus),
                        RequestedBy: dataArr?.[i]?.Pending?.[j]?.requestDrop,
                        NonConformity: dataArr?.[i]?.Pending?.[j]?.OFI,
                        FormId:
                          dataArr?.[i]?.Pending?.[j]?.Formid === ''
                            ? 0
                            : parseInt(dataArr?.[i]?.Pending?.[j]?.Formid),
                        SiteId: dataArr?.[i]?.Pending?.[j]?.SiteID,
                        ChecklistId:
                          dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId === ''
                            ? 0
                            : parseInt(
                                dataArr?.[i]?.Pending?.[j]?.ChecklistTemplateId,
                              ),
                        ElementID: dataArr?.[i]?.Pending?.[j]?.selectedItems
                          ? dataArr?.[i]?.Pending?.[j]?.selectedItems.join(',')
                          : 0,
                        ResponsibilityUser:
                          dataArr?.[i]?.Pending?.[j]?.userDrop.id,
                        NCIdentifier:
                          dataArr?.[i]?.Pending?.[j]?.ncIdentifier === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.ncIdentifier,
                        ObjectiveEvidence:
                          dataArr?.[i]?.Pending?.[j]?.objEvidence === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.objEvidence,
                        FailureCategoryId:
                          dataArr?.[i]?.Pending[j]?.failureDrop.value,
                        RecommendedAction:
                          dataArr?.[i]?.Pending?.[j]?.recommAction === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.recommAction,
                        uniqueNCkey: dataArr?.[i]?.Pending?.[j]?.uniqueNCkey,
                        // Need to Add (Filedata array list)
                        AttachEvidence: finalFileData, //dataArr?.[i]?.Pending?.[j]?.fileData,
                        DocumentRef:
                          dataArr?.[i]?.Pending?.[j]?.documentRef === undefined
                            ? ''
                            : dataArr?.[i]?.Pending?.[j]?.documentRef,
                        Conformance:
                          this?.props?.navigation?.state?.params
                            ?.CreateNCdataBundle.Conformance,
                        ProcessID:
                          this?.props?.navigation?.state?.params
                            ?.CreateNCdataBundle.ProcessID,
                        // AttachEvidence:dataArr?.[i]?.Pending?.[j]?.filedata,
                      });
                      console.log(formRequest, 'one:formrqstarrayone');
                    }
                  }
                }
              }
            }
            console.log('one:Request array pushed', formRequest, token);
            if (formRequest.length > 0) {
              this.formRequestArr(formRequest, token);
            } else {
              this.setState(
                {isLoaderVisible: false, 
                  dialogVisible: false,
                  syncMode : 0
                },
                () => {
                  this.refs.toast.show(
                    strings.noncofitosync,
                    DURATION.LENGTH_LONG,
                  );
                },
              );
            }
          } else {
            this.setState({isLoaderVisible: false, dialogVisible: false});
            this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
          }
        });
      }
    } else {
      this.setState({isLoaderVisible: false, dialogVisible: false}, () => {
        Alert.alert(strings.nc_reply_06);
      });
      console.log('hitting here');
    }
  }

  formRequestArr(formRequest, token) {
    var datapass = formRequest;
    var TOKEN = token;

    console.log('one:keypass', datapass);

    auth.syncNCOFIToServer(datapass, TOKEN, (res, data) => {
      console.log('one:syncNCToServer data', data);
      if (data.data) {
        if (data.data.Message === 'Success') {
          // this.setState({ isLoaderVisible: false }, function () {
          //this.refs.toast.show(strings.NCSuccess, DURATION.LENGTH_LONG);
          var responseData = data.data.Data;
          
          this.checkFindingAttachment(responseData);
          //this.AfterSyncdone();
          // this.upLoadList()
          // })
        } else {
          this.setState({isLoaderVisible: false, syncMode:0, syncStatusLabel:''}, function () {
            this.refs.toast.show(strings.NCFAiled, DURATION.LENGTH_LONG); 
          });
        }
      } else {
        this.setState({isLoaderVisible: false, syncMode:0, syncStatusLabel:''}, function () {
          this.refs.toast.show(strings.NCFAiled, DURATION.LENGTH_LONG);
        });
      }
    });
  }

  async checkFindingAttachment(responseData) {
    try {
      var token = this.props.data.audits.token;
      var AUDIT_ID = this.state.AUDIT_ID;
      var ncofiRecords = this.props.data.audits.ncofiRecords;
      console.log(ncofiRecords, 'one:pending');
      if (ncofiRecords) {
        for (var i = 0; i < ncofiRecords.length; i++) {
          if (AUDIT_ID == ncofiRecords[i].AuditID) {
            for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
              if (ncofiRecords[i].Pending[j].filedata.length > 0) {
                this.attatchedFindings.push(ncofiRecords[i].Pending[j]);
                let respdata = responseData.filter(m => m.UniqueNCkey == ncofiRecords[i].Pending[j].uniqueNCkey)
                console.log("one:docparam:docpro Parameter",respdata , respdata[0].DocProParameter);
              }
            }
          }
        }
      }
      console.log(
        'one:Total number of attached Findings',
        this.attatchedFindings,
      );
      if (this.attatchedFindings.length > 0) {
        this.setState({
          syncStatusLabel : 'Syncing Attachments',
          syncMode : 1
        },()=> {
          console.log('two: Sync Initiated', this.state.syncMode);
          this.formDocProObject(this.attatchedFindings, responseData);
        })         
      } else {
        this.setState(
          {
            isLoaderVisible: false,
          },
          () => {
            this.attatchedFindings = [];
            this.formRequestObj = [];
            this.refs.toast.show(strings.NCSuccess, DURATION.LENGTH_LONG);
            this.CompleteSync();
          },
        );
      }
    } catch (e) {
      console.log('one:checkFindingAttachment', e);
    }
  }

  formDocProObject(attatchedFindings, responseData) {
    return new Promise(async (resolve, reject) => {
      var resData = responseData;
      console.log('one:resdata', resData);
      console.log('one:resdataattatchedFindings', attatchedFindings);
      const filedata = attatchedFindings.map(item => item.filedata);
      const fileArray = filedata.map(item => item.fileData).join(',');
      this.setState({
        filepathArray: fileArray,
      });

      // this.attatchedFindings = attatchedFindings
      // var formRequestObj = []
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var getDate = mm + '/' + dd + '/' + yyyy;
      let loopCount = 0;

      //dynamic value

      var AuditID = this.state.AUDIT_ID;
      var token = this.props.data.audits.token;

      var siteId = this.props.data.audits.siteId;
      var UserId = this.props.data.audits.userId;
      var auditRecords = this.props.data.audits.auditRecords;
      var siteid = 'sit' + siteId;
      var effectivedate = getDate;
      var revdate = getDate;
      var dnum = '';
      var deviceId = await DeviceInfo.getUniqueId();
      for (var i = 0; i < auditRecords.length; i++) {
        if (AuditID == auditRecords[i].AuditId) {
          dnum = auditRecords[i].AuditNumber;
        }
      }

      // static value
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
      var token = this.props.data.audits.token;
      let allattachments = [];
      if (attatchedFindings) {
        console.log(
          '!!!!!!!!!!!!!!!@@@@@@@@@@#############',
          attatchedFindings,
        );
        for (var j = 0; j < resData.length; j++) {
          for (var i = 0; i < attatchedFindings.length; i++) {
            if (
              attatchedFindings[i].uniqueNCkey.toString() ==
              resData[j].UniqueNCkey
            ) {
              for (var k = 0; k < attatchedFindings[i].filedata.length; k++) {
                console.log(
                  'one:==-->attachfindings.filename',
                  attatchedFindings[i].filedata[k],
                );
                let fileContents = '';
                // for (let l = 0;l < attatchedFindings[i]?.filedata?.length;l++) {
                try {
                  const filePath =
                    'file:/' + attatchedFindings[i]?.filedata[k].fileData;
                  fileContents = await RNFS.readFile(filePath, 'base64');
                  //base64Array.push(fileContents);
                } catch (error) {
                  console.error('Error reading file:', error);
                  fileContents = '';
                  // Handle errors if needed
                }
                //}
                loopCount++;

                //console.log('Base64-encoded files:', base64Array);

                console.log('one:==-->', attatchedFindings[i]);

                let combinedString = attatchedFindings[i].filename;
                const getdname = combinedString.join(',');
                console.log(
                  '#####################filename',
                  attatchedFindings[i].filedata[k],
                );
                console.log(
                  '#####################filedata',
                  attatchedFindings[i]?.filedata[k].fileData,
                );
                // console.log('#####################base64Array', base64Array[i]);
                // console.log(
                //   '#####################base64Array12333',
                //   base64Array[k],
                // );

                let getfilename = attatchedFindings[i].filename;

                const extensions = getfilename.map(fileName => {
                  const parts = fileName.split('.');
                  return parts[parts.length - 1];
                });
                console.log('#####################extenstiion', extensions[k]);

                const dataString = resData[j].DocProParameter;

                // Split the string based on the delimiter (',')

                if (dataString === "")
                    continue;
                const splitItems = dataString.split(',');

                // Push the split items into the array 
                var objArray = splitItems;
                const objfinalArray = objArray[k].split('|')[0];
                console.log('SPLITOBJARRAY', objfinalArray);
                const allextentions = extensions.join(',');

                console.log(
                  'attatchedFindings[i].filedata',
                  resData[j].DocProParameter,
                );

                let getobj = resData[j].DocProParameter; 
                let getSitId = resData[j].SiteLevelId;
                //var filecontent = base64Array[k] ? base64Array[k] : '';
                var formobj = '';
                var dname = attatchedFindings[i].filename[k];
                var filename = attatchedFindings[i].filename[k];
                var filepath =  attatchedFindings[i]?.filedata[k].fileData;
                var obj = objfinalArray;
                var sitelevelid = getSitId;
                formobj = {
                  dnum: dnum,
                  dname: dname,
                  filename: filename,
                  ext: extensions[k],
                  filepath: filepath,
                  obj: obj,
                  fromdocpro: fromdocpro,
                  frommod: frommod,
                  doctypeid: doctypeid,
                  siteid: siteid,
                  mod: mod,
                  sitelevelid: sitelevelid,
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
                  filecontent: fileContents,
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
                console.log('one:formobj===>', formobj);

                this.formRequestObj.push(formobj);
                allattachments.push({filename: filename, obj:obj, status: null,path:filepath,exist:true })
                var arr = this.formRequestObj;
                resolve(arr);

                this.setState({
                  lengthCheck: this.formRequestObj,
                });
                // });
              }
              console.log(
                'one:formobj===>length',
                this.state.lengthCheck.length,
                this.formRequestObj.length,
                attatchedFindings.length,
                attatchedFindings[i].filename.length,
              );
              console.log(
                'one:formobj===>arraylength check---------',
                this.formRequestObj.length,
                loopCount,
              );

              //  if (this.formRequestObj.length == loopCount) {
              //   console.log('one:formobj===>arr', arr);
              //   this.callDocProAPI(this.state.allParamsArr, token);

              //   }
              this.setState({
                allParamsArr: arr,
              });
            } else {
              console.log('one:withoute nc');
            }
          }
        }
        console.log(
          '!!!!!!!!!!!!!!!!!!!AllArray-------',
          this.state.allParamsArr,
        );

        this.setState({
          syncStatusLabel : 'Syncing Attachments',
            syncMode : 1,
          AuditAttachments: allattachments,
          uploadIndex: 0,
          totalFiles : this.formRequestObj.length,
          FailedAttachments : []
        }, () => {
          console.log("two: AudtAttachments", this.state.AuditAttachments);
          this.callDocProAPI(this.state.allParamsArr, token);
        });

        console.log(
          '!!!!!!!!!!!!!!!!!!!AllArray-------222222222',
          this.state.allParamsArr,
        );
      }
    });
  }

  setSyncCompleted(){
    this.syncStatus = parseInt(this.syncStatus) + 1;
    this.setState({      
      syncStatusLabel: this.state.FailedAttachments.length === 0 ? "Sync to Server Completed." : 'Sync to Server Completed with failed Attachment(s)',
      syncMode : this.state.FailedAttachments.length === 0 ? 4 : 2,
      //isLoaderVisible: false,
      lengthCheck: [],
    }, () => {                         
      console.log("Document Successfully Sequence Completed");       
      //this.AfterSyncdone();
      //this.refreshList();            
  })
  
  }

  async callDocProAPI(formRequestArrPush, token) {
    console.log('formRequestObjy-------222222222',formRequestArrPush);

    let index = this.state.uploadIndex;
    const formRequestObj = formRequestArrPush[index];
    const attachmentsArr = []; 
    let failedAttachments = this.state.FailedAttachments;
    attachmentsArr.push(formRequestObj);
 

    // if (index <= formRequestArrPush.length -1){ 
    //   this.checkFileExist(formRequestObj.filepath).then((exist) => { 
    //     if (exist){
    //       this.updateAttachmentStatus(true,index); 
    //       if (this.state.uploadIndex > formRequestArrPush.length -1) {  
    //         this.setSyncCompleted();         
    //       } else {                    
    //         //failedAttachments.push(formRequestObj);
    //         this.setState({
    //           //FailedAttachments: failedAttachments,
    //           uploadIndex : parseInt(this.state.uploadIndex)+1,
    //           syncStatusLabel : "Syncing Attachment "  + (this.state.uploadIndex+1) + ' of ' + this.state.totalFiles,
    //           //saveLoader: false
    //         }, () => {
    //           this.callDocProAPI(formRequestArrPush,token)      
    //         });                
    //       } 
    //     } else {
    //       console.log('syncFilesToDocPro File Not Exist!');
    //       this.updateAttachmentStatus(false,index,false); 
    //       failedAttachments.push(formRequestObj);
    //       this.setState({
    //         FailedAttachments: failedAttachments,
    //         uploadIndex : parseInt(this.state.uploadIndex)+1
    //       }, () => {
    //         this.callDocProAPI(formRequestArrPush,token)      
    //       }); 
    //     }
    //   });
    // }
    // else {
    //   this.setSyncCompleted()
    // }
    //   return;

    if (index <= formRequestArrPush.length -1){ 
      this.checkFileExist(formRequestObj.filepath).then((exist) => { 
        if (exist){
          auth.getdocProAttachment(attachmentsArr, token, (res, data) => {            
            console.log('one:uploading data', data, formRequestObj);
            if (data.data != null && data.data.Success == true) {
              this.updateAttachmentStatus(true,index); 
              if (this.state.uploadIndex >= formRequestArrPush.length -1){        
                this.setSyncCompleted();
              }else{                    
                this.setState({
                uploadIndex : parseInt(this.state.uploadIndex)+1,       
                }, () => {                         
                  this.callDocProAPI(formRequestArrPush,token)
                })      
              }            
            } else {//Api Returns false
              this.AddFaileAttachments(formRequestObj,index);      
              this.callDocProAPI(formRequestArrPush,token);        
            }
          });
        }else { //File Not Exist
          this.AddFaileAttachments(formRequestObj,index,false)
          this.callDocProAPI(formRequestArrPush,token)  
        }
      });
    } else {
      this.setSyncCompleted();
    }
  }

  async AddFaileAttachments(formRequestObj,index,exist = true){
    let failedAttachments = this.state.FailedAttachments;
    failedAttachments.push(formRequestObj);
    this.updateAttachmentStatus(false,index,exist);
    this.setState({
      FailedAttachments: failedAttachments,
        uploadIndex : parseInt(this.state.uploadIndex)+1
    }, () => {});
  }

  checkFileExist(path){
    console.log("Attachment:>path", path)
    return new Promise((resolve,reject) => {
      RNFetchBlob.fs.exists(path)
      .then(exist => { resolve(exist);})
      .catch(() => { resolve(false)})
    });
  }

  updateAttachmentStatus = (status,index,exist=true) =>{
    let updateAttach = [];
    for (var z=0; z<this.state.AuditAttachments.length; z++){ 
      let file = this.state.AuditAttachments[z]
      if (index === z)
        updateAttach.push({...file,status:status,exist:exist})  
        else{
          updateAttach.push(file);
        }
    }
    this.setState({
      AuditAttachments: updateAttach
    },() => {
      console.log("update this.state.AuditAttachment", this.state.AuditAttachments)
    })
  }

  convertFile = path => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!', path);
    return new Promise((resolve, reject) => {
      RNFS.readFile(path, 'base64')
        .then(data => {
          console.log('one:pathres', path);
          console.log('one:data', data);
          resolve(data);
        })
        .catch(err => {
          resolve(undefined);
          console.log('one:Error in converting', err);
        });
    });
  };

  refreshList = () => {
    var AuditID = this.state.AUDIT_ID;
    var Data = this.props.data.audits.auditRecords;
    console.log('checkdatanc-----',Data);
    
    var iAudProgId = undefined;
    var AuditTypeId = undefined;

    console.log('****', Data);
    console.log('AuditID', AuditID);

    var SiteID = this.props.data.audits.siteId;
    var TOKEN = this.props.data.audits.token;

    for (var i = 0; i < Data.length; i++) {
      if (this.state.AUDIT_ID == Data[i].AuditId) {
        if(this.props.data.audits.smdata == 2) {
          console.log('innsideifprogid',Data[i]);
          iAudProgId = -2;
        }else{
        console.log('innsideelseprogid',Data[i].AuditTemplateId);
        iAudProgId = 7
        }
        AuditTypeId = Data[i].AuditTypeId;
      }
    }

    for (var j = 0; j < this.props.data.audits.auditRecords.length; j++) {
      if (
        this.state.AUDIT_ID === this.props.data.audits.auditRecords[j].AuditId
      ) {
        var iAudTypeOrder =
          this.props.data.audits.auditRecords[j].AuditTypeOrder;
        var iAudProgOrder =
          this.props.data.audits.auditRecords[j].AuditProgOrder;
      }
    }

    this.setState(
      {
        token: TOKEN,
        AUDITPROG_ID: iAudProgId,
        AUDITYPE_ORDER: iAudTypeOrder,
        AUDITYPE_ID: AuditTypeId,
        SITEID: SiteID,
        AUDITPROGORDER: iAudProgOrder,
      },
      () => {
        const strSortBy = 'order by Title asc';
        const strFunction = 'AuditNCOFI';

        console.log('Site ID ==>', this.state.SITEID);
        console.log(
          'AUDITPROG_ID,AUDITYPE_ID',
          this.state.AUDITPROG_ID,
          this.state.AUDITYPE_ID,
        );

        auth.getNCdetails(
          this.state.SITEID,
          strSortBy,
          this.state.AUDIT_ID,
          this.state.AUDITPROG_ID,
          this.state.AUDITPROGORDER,
          this.state.AUDITYPE_ORDER,
          this.state.AUDITYPE_ID,
          strFunction,
          TOKEN,
          (res, data) => {
            console.log('getNC data', data);
            console.log('response', res);

            if (data.data) {
              this.upLoadList(data.data.Data);
            } else {
              //this.refs.toast.show(strings.NCFAiled,DURATION.LENGTH_LONG)
            }
          },
        );
      },
    );
  };

  AfterSyncdone() {
    // remove pending list after sync
    var dupNCrecords = [];
    var NCrecords = this.props.data.audits.ncofiRecords;
    for (var i = 0; i < NCrecords.length; i++) {
      var pendingList = [];
      for (var j = 0; j < NCrecords[i].Pending.length; j++) {
        // delete synced pending Nc/ofi
        if (this.state.AUDIT_ID !== NCrecords[i].AuditID) {
          pendingList.push(NCrecords[i].Pending[j]);
        } else {
          // save check point Nc/ofi
          if (NCrecords[i].Pending[j].ChecklistTemplateId != 0) {
            pendingList.push(NCrecords[i].Pending[j]);
          }
        }
      }
      dupNCrecords.push({
        AuditID: NCrecords[i].AuditID,
        Uploaded: NCrecords[i].Uploaded,
        Pending: pendingList,
      });
    }
    this.props.storeNCRecords(dupNCrecords);
    //  to get updated uploaded  and pending list
    //this.refreshList();
  }

  upLoadList(list) {
    var Uploaded = list;
    console.log('getting props details...', this.props.data.audits);
    var dupNCrecords = [];
    var NCrecords = this.props.data.audits.ncofiRecords;
    for (var i = 0; i < NCrecords.length; i++) {
      var pendingList = [];
      for (var j = 0; j < NCrecords[i].Pending.length; j++) {
        if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
          pendingList.push(NCrecords[i].Pending[j]);
        }
      }
      if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
        dupNCrecords.push({
          AuditID: NCrecords[i].AuditID,
          Uploaded: Uploaded ? Uploaded : [],
          Pending: pendingList,
        });
      } else {
        dupNCrecords.push({
          AuditID: NCrecords[i].AuditID,
          Uploaded: NCrecords[i].Uploaded,
          Pending: NCrecords[i].Pending ? NCrecords[i].Pending : [],
        });
      }
    }
    this.props.storeNCRecords(dupNCrecords);

    this.getDetails();
    this.setUpload();
  }

  changeDateFormatCard = inDate => {
    console.log('==-->', inDate);
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat;// + ' ' + 'HH:mm';
      var sDateArr = inDate.split('T');
      var sDateValArr = sDateArr[0].split('-');
      var sTimeValArr = sDateArr[1].split(':');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
        // sTimeValArr[0],
        // sTimeValArr[1],
      );

      var test = Moment(outDate).format(DefaultFormatL);
      console.log('Moment', test);

      return Moment(outDate).format(DefaultFormatL);
    }
  };

  changeDateFormat = inDate => {
    console.log('==-->', inDate);
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat;// + ' ' + 'HH:mm';
      var sDateArr = inDate.split('T');
      var sDateValArr = sDateArr[0].split('-');
      var sTimeValArr = sDateArr[1].split(':');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2],
        // sTimeValArr[0],
        // sTimeValArr[1],
      );

      return Moment(outDate).format(DefaultFormatL);
    }
  };

  closeReset() {
    this.setState({
      isVisible: false,
      miniLoading: false,
      CorrectiveOrder: null,
      loadingData: true,
      UploadDate: '',
      Responsible: '',
      Request: '',
      Category: '',
      Response: '',
      Standard: '',
      StandText: '',
      NCtext: '',
      objectiveEvidence: '',
      Clause: '',
      FailureCategory: '',
      Process: '',
      DocumentReference: '',
      filepath: '',
      FileName: '',
    });
  }

  checkOffline() {
    if (this.props.data.audits.isOfflineMode) {
      this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
    } else {
      // this.setState({dialogVisible: true});
      // confirmpwd;
      this.setState({confirmpwd: true});
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
          var ncofiRecords = this.props.data.audits.ncofiRecords;
          var auditid = this.state.AUDIT_ID;

          var isEmpty = false;

          if (ncofiRecords) {
            ncofiRecords.forEach(item => {
              if (item.AuditID == auditid) {
                if (item.Pending.length == 0) {
                  isEmpty = true;
                }
              }
            });
          }

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
                      syncMode : 0
                    },
                    () => {
                      this.refs.toast.show(
                        strings.noncofitosync,
                        DURATION.LENGTH_SHORT,
                      );
                    },
                  );
                } else {
                  this.setState(
                    {
                      // confirmpwd : false,
                      pwdentry: undefined,
                    },
                    () => {
                      this.CheckInternetConnectivityNCOFI();
                    },
                  );
                }
              } else {
                this.setState(
                  {
                    pwdentry: undefined,
                    isEmptyPwd: data.data.Message,
                  },
                  () => {},
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

  getFileIcon(filename, filepath) {
    try {
      let icon = 'file';
      if (filename == null || typeof filename == 'undefined' || filename == '')
        return null;
      let type =
        filename !== ''
          ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
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
        case 'pptx':
        case 'pps': {
          icon = 'file-powerpoint-o';
          break;
        }
        case 'xls':
        case 'xlsx':
        case 'numbers':
        case 'xlsm': {
          icon = 'file-excel-o';
          break;
        }
        case 'mp4':
        case 'mpg':
        case 'mpeg': {
          icon = 'play';
          break;
        }
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
      console.log('icon', icon);
      return icon === 'image' ? (
        <Image
          source={{
            uri: 'file:/' + filepath,
          }}
          style={{
            width: width(65),
            height: 200,
            resizeMode: 'cover',
            alignSelf: 'center',
          }}
        />
      ) : (
        // <View style={{width: width(70), height: 200}}>
        <Icon
          name={icon}
          style={{
            paddingTop: 70,
            height: 200,        
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',

          }}
          size={65}
          color="#000"
        />
        // </View>
      );
    } catch (ex) {
      console.log('Error in getFile icon', ex);
    }
  }

  async WriteAttachments(Attachments) {
    console.log(
      'Attachment:loadingData',
      this.state.loadingData,
      this.state.miniLoading,
    );
    const path =
      '/' +
      RNFetchBlob.fs.dirs.DocumentDir +
      '/' +
      (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles') +
      '/';
    let AttachmentList = [];
    const count = Attachments.length;
    for (let i = 0; i < Attachments.length; i++) {
      const Attachment = Attachments[i];
      const filename = Attachment.FileName;
      const filecontent = Attachment.Attachment;
      const docId = Attachment.DocId;

      const extn = filename.substring(filename.lastIndexOf('.') + 1);
      let filepath = path + 'file_' + docId + '.' + extn;
      let docAttach = AttachmentList.filter(item => item.docid === docId);
      docAttach.length == 0 &&
      await  RNFetchBlob.fs.exists(filepath).then(exist => {
        if (!exist || exist == '') {
          (RNFetchBlob.fs
            .writeFile(filepath, filecontent, 'base64')
            .then(res => {
              console.log('Attachment:File Written' + i);
              AttachmentList.push({
                docid: docId,
                filepath: filepath,
                filename: filename,
              });
  
              if (i == count - 1) {
                this.setState(
                  {
                    AttachmentList: AttachmentList,
                    isAttachmentLoaded: true,
                  },
                  () => {
                    console.log(
                      'Attachment Fully Loaded',
                      this.state.AttachmentList,
                    );
                  },
                );
              }
            })
            .catch(err => {
              console.log('Attachment:Err:' + i + ':Error:' + err);
              AttachmentList.push({
                docid: docId,
                filepath: 'error',
                filename: filename,
              });
            }));
        }
        else {
          console.log('Attachment:File Written' + i);
              AttachmentList.push({
                docid: docId,
                filepath: filepath,
                filename: filename,
              });
  
              if (i == count - 1) {
                this.setState(
                  {
                    AttachmentList: AttachmentList,
                    isAttachmentLoaded: true,
                  },
                  () => {
                    console.log(
                      'Attachment Fully Loaded',
                      this.state.AttachmentList,
                    );
                  },
                );
              }
        }
      });
       
    }
  }

  openAttachmentFile = filepath => {
    console.log(filepath, 'Attachment:path');
    if (filepath == null || typeof filepath == 'undefined' || filepath == '')
      return;
    const fpath = FileViewer.open('file:/' + filepath) // absolute-path-to-my-local-file.
      .then(() => {
        console.log('Attachmentfile opened');
      })
      .catch(err => {
        console.log('Attachmentfile opened error', err);
      });
  };

  splitString = inputString => {
    // Split the input string based on the dot (.)
    const substrings = inputString.split('.');

    return substrings;
  };

  getFileFormat = fileName => {
    const splitFileName = fileName.split('.');
    return splitFileName.length > 1
      ? splitFileName[splitFileName.length - 1]
      : null;
  };

  renderAttachment = () => {
    return this.state.isAttachmentPresent ? (
      <View style={styles.commoncard}>
        <Text style={[styles.boxHeader, {marginTop: 5}]}>
          {strings.Attach_EvidenceL}
        </Text>
        {this.state.isAttachmentLoaded &&
        this.state.AttachmentList.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              data={this.state.AttachmentList}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              style={{marginTop: 10}}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              name="hourglass"
              size={15}
              color="#A6A6A6"
              style={{padding: 5}}
            />
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
        )}
      </View>
    ) : (
      <View></View>
    );
  };

  removeNC = () => {
    var dupNCrecords = [];
    var NCrecords = this.props.data.audits.ncofiRecords;
    for (var i = 0; i < NCrecords.length; i++) {
      var pendingList = [];
      for (var j = 0; j < NCrecords[i].Pending.length; j++) {
        // remove the deleted NC
        const objNC = NCrecords[i].Pending[j];
        if (this.state.AUDIT_ID === NCrecords[i].AuditID) {
          if (objNC.uniqueNCkey !== this.state.deleteNCkey) {
            pendingList.push(objNC);
          }
        } else if (this.state.AUDIT_ID !== NCrecords[i].AuditID) {
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
    //  to get updated uploaded  and pending list
    this.setState(
      {
        deleteDialogVisible: false,
        deleteNCkey: '',
      },
      () => {
        console.log('delete dialog closed', this.state.deleteNCkey);
      },
    );
    this.refreshList();
  };
  
  renderItem = ({item}) => {
    console.log('Attachment:Render Item', item);
    const filename = item.filename;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          margin: 2,
          borderColor: '#2a4944',
          borderWidth: 1,
          height: '90%',          
        }}>
        <View style={{flexDirection: 'column'}}>
          <View>
            {item.filepath !== '' &&
            item.filepath !== 'error' &&
            item.filepath !== null ? (
              <TouchableOpacity
                onPress={this.openAttachmentFile.bind(this, item.filepath)}>
                {this.getFileIcon(item.filename, item.filepath)}
                <View
                  style={{
                    width: width(65),
                    marginTop: 1,
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text>{item.filename}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  OpenFile = path => {
    const fpath = FileViewer.open('file:/' + path) // absolute-path-to-my-local-file.
    .then(() => {
      console.log('Attachmentfile opened');
    })
    .catch(err => {
      console.log('Attachmentfile opened error', err);
    });
  }

  getSyncFileIcon(attach) { 
    let icon = 'file';
    const filename = attach.filename;
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
      case 'numbers':
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
      <Icon
        name={icon}
        size={15}
        color="black"
        style={{ padding:6,
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      />     
      </View>
    );
  }

  retryFailedAttachments = (attach) => {
    const failedAttachments = this.state.FailedAttachments;
    const index = failedAttachments.findIndex(item => item.obj === attach.obj);
    
    if (index != -1){
      const attachment = failedAttachments[index];
      const filename = attachment.filename;
      this.updateAttachmentStatus(null,index); 
      this.setState({
        syncStatusLabel : 'Resyncing Attachments ' + filename,
        syncMode : 1
      },() => {
        this.uploadFailedFileSync(attachment)
      });
    }
      else{
        this.refs.toast.show("Attachment retry attempt failed!.", DURATION.LENGTH_LONG);
      }
  } 

  uploadFailedFileSync = (formRequestObj) => {
    const token = this.props.data.audits.token;     
    const attachmentsArr = [];   
    attachmentsArr.push(formRequestObj);                 
    auth.getdocProAttachment(attachmentsArr, token, (res, data) => {
      console.log('120 formRequestArr response', data);
      let updateAttachment = this.state.AuditAttachments;
      let failedAttachments = this.state.FailedAttachments;
      let index = updateAttachment.findIndex(item => item.obj === formRequestObj.obj); 
      let rindex = failedAttachments.findIndex(item => item.obj === formRequestObj.obj); 
     
      if (data.data != null && data.data.Message === 'Success') { 
          this.updateAttachmentStatus(true,index);    
          this.removeFromFailedAttachment(rindex)                      
        }
        else {                             
          this.updateAttachmentStatus(false,index);
          this.setState({
              syncMode : 2,
              syncStatusLabel : 'Sync to Server Completed with failed Attachment(s)', 
          }, () => {
            this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG);
          });
      }      
    });
  }

  renderFileUploadStatus = () => {
    console.log("this.state.AuditAttachments", this.state.AuditAttachments);   
    
    return(
      <FlatList     
      data={this.state.AuditAttachments} 
      ListHeaderComponent={()=><Text style={{paddingBottom:10, fontWeight:'bold',alignItems:'center', alignSelf:'center' }}>Attachment Status</Text>}
      extraData={this.state}  
      renderItem={({item, index}) => (//times-circle //check-circle
        <TouchableOpacity style={{flex:1, flexDirection: 'row', 
          borderBottomWidth :1, minHeight:40, maxHeight:60,
          borderBottomColor: 'lightgrey'}} onPress={() => this.OpenFile(item.path)}>   
          <View style={{justifyContent: 'center',width:'5%'}}>{this.getSyncFileIcon(item)}</View>
          <View style={{ width:'85%',justifyContent: 'center'}}>
            <Text multiline={true} style={{ justifyContent: 'center',flexShrink: 1,paddingLeft:2, color: item.exist === false ? 'red' : "black"}}>{item.filename}</Text>
          </View>
          <View style={{
            width: '10%',
            height: 30,             
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf:'center'
            }}>
            {item.status === null ? <Bars size={5} color="#1CB8CA" /> :
            item.status === true ? <View><Icon name="check-circle"  size={20} color="green"/></View> :
            item.status === false ? item.exist === false ? <Icon name="times-circle" color='red' size={15}/> : 
            <TouchableOpacity onPress={() => {this.retryFailedAttachments(item)}}>
              <View style={{justifyContent: 'center',alignItems: 'center',}}>
                <Icon name="refresh" title="Retry" size={15}/>
                <Text style={{fontSize:10, color:"red"}}>{'Retry'}</Text>
              </View>
            </TouchableOpacity>  : <View></View>} 
          </View>          
        </TouchableOpacity>      
      )}
     />     
    )
  }

  // renderFileUploadStatus = () => {
  //   console.log("this.state.AuditAttachments", this.state.AuditAttachments);   
  //   return(
  //     <FlatList     
  //     data={this.state.AuditAttachments} 
  //     ListHeaderComponent={()=><Text style={{paddingBottom:10, fontWeight:'bold',alignItems:'center', alignSelf:'center' }}>Attachment Status</Text>}
  //     extraData={this.state}  
  //     renderItem={({item, index}) => (//times-circle //check-circle
  //     <View style={{flex:1, width:'95%', alignItems:'center', alignSelf:'center'}}>
  //     <TouchableOpacity onPress={() => this.OpenFile(item.path)}>
  //     <View style={{ flexDirection: 'row', padding:5, borderBottomWidth :1, borderBottomColor: 'lightgrey'}}>        
  //       {this.getSyncFileIcon(item)}
  //       <Text multiline={true} style={{width:'80%', paddingTop:5,}}>{item.filename}</Text>
  //         <View
  //           style={{
  //             flex: 0.8,
  //             flexDirection: 'row',
  //             justifyContent: 'center',
  //             alignItems: 'flex-end',
  //           }}>
  //         <View
  //           style={{
  //             width: 40,
  //             height: 30, 
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>{item.status === null ? <Bars size={5} color="#1CB8CA" /> :
  //               item.status === true ? <View><Icon name="check-circle"  size={20} color="green"/></View> :
  //               item.status === false ? <TouchableOpacity onPress={() => {this.retryFailedAttachments(item)}}>
  //                 <View style={{justifyContent: 'center',
  //             alignItems: 'center',}}><Icon name="refresh" title="Retry" size={15}/><Text style={{fontSize:10, color:"red"}}>{'Retry'}</Text></View></TouchableOpacity>  : <View></View>} 
  //               </View></View>
  //     </View>
  //     </TouchableOpacity>
  //     </View>
  //     )}
  //     />
     
  //   )
  // }

  FailedAttachmentAlert = () => {
    Alert.alert(
      'Warning!',
      'There are some failed attachments, do you want to skip',
      [ 
        {
          text: 'Skip',
          onPress: () => {            
            this.CompleteSync()
          }
        },
        {
          text: 'Close',
          style:'cancel',
          onPress: () => {            
            console.log("cancel clicked") }         
        },
        ], 
        { cancelable: false }
      );
    
  }

  CheckSync = () => {
    this.setState({ 
      syncStatusLabel : ""
    },() => {
      this.state.syncMode === 2 && this.FailedAttachmentAlert();
      this.state.syncMode === 4 && this.CompleteSync();
    })    
  }

  CompleteSync = () => {    
    this.setState({
      syncMode : 0,
      AuditAttachments : []
    }, () => {      
      this.AfterSyncdone();
      this.refreshList();  
      
   })
  }

  removeFromFailedAttachment = (index) => {
    let FailedAttachments = this.state.FailedAttachments;
    let newFailedAttachment = [];
    for (let i=0;i < FailedAttachments.length; i++){
        if (i !== index){
          newFailedAttachment.push(FailedAttachments[i]);  
        }
    } 
    this.setState({
      FailedAttachments : newFailedAttachment,
      syncMode : newFailedAttachment.length === 0 ? 4 : 2,
      syncStatusLabel : newFailedAttachment.length === 0 ?  "Sync to Server Completed" : "Sync to Server Completed with failed Attachment(s)",
    },() => {
      console.log("Retry Attachment Removed", this.state.FailedAttachments);
      //this.state.syncMode === 4 && this.reDirect() 
    });
  } 

  render() {
    const { height } = Dimensions.get("window"); 
    const middle = (height/2)-200;
    const attachmentHeight = (middle+100);
    console.log(
      // this.getFileIcon(this.props.navigation.params),
      'fileextension-------',
    );
    //console.log(filesArray2, 'fileextensionthis.state.FILEPATH------');
    console.log('router', this.props.navigation.state.params);
    console.log('this.state.NCdisplay1', this.state.NCUpload);
    console.log('ncdetailsconsole', this.state.NCdetails);
    console.log('ncdetails:date', this.state.UploadDate);
    console.log('ncdetails:nc text', this.state.NCtext);
    console.log('ncdetails:responsible', this.state.Responsible);
    console.log('ncdetails:obj', this.state.objectiveEvidence);
    console.log('ncdetails:req', this.state.Request);
    console.log('ncdetails:Cat', this.state.Category);
    console.log('ncdetails:CLa', this.state.Clause);
    console.log('ncdetails:fc', this.state.FailureCategory);
    console.log('ncdetails:Process', this.state.Process);
    console.log('ncdetails:DC', this.state.DocumentReference);
    console.log(
      'this.state.CreateNCpass----',
      this.props.data.audits.ncofiRecords,
    );
    const encodedBase64 = this.state.fileData;
    return (
      <View style={styles.wrapper}>
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
               this.state.syncMode === 0 && this.props.navigation.goBack()}
              }>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {strings.NC}/{strings.OFI}
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
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              {/* <TouchableOpacity onPress={debounce(this.RefreshUpload.bind(this), 1000)} >
                <Icon name="refresh" size={25} color="white" />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                onPress={() => {this.CheckSync();
                  this.props.navigation.navigate('AuditDashboard')}
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.auditPageBody, {paddingTop: 10}]}>
          {this.state.isLoaderVisible === false ? (
            <ScrollableTabView
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
                    fontSize: Fonts.size.h5,
                    fontFamily: 'OpenSans-Regular',
                  }}
                />
              )}
              tabBarPosition="overlayTop">
              <ScrollView
                tabLabel={strings.Pending}
                style={styles.scrollViewBody}>
                {this.state.NCdisplay.length > 0 ? (
                  <View style={{marginTop: 55}}>
                    {this.state.NCdisplay.map((item, key) => (
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={this.openEditBox.bind(this, item)}
                          key={key}
                          style={styles.cardBox}>
                          <View style={styles.sectionTop}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignSelf: 'flex-end',
                              }}>
                              <TouchableOpacity
                               
                                onPress={() => {
                                  this.setState(
                                    {
                                      deleteDialogVisible: true,
                                      deleteNCkey: item.uniqueNCkey,
                                    },
                                    () => {
                                      console.log(
                                        'delete dialog opened',
                                        this.state.deleteNCkey,
                                      );
                                    },
                                  );
                                }}>
                                <Icon name="trash" size={25} color="red" />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.sectionContent}>
                              <Text numberOfLines={1} style={styles.boxHeader}>
                                Findings {strings.Number}
                              </Text>
                            </View>

                            <View style={styles.sectionContent}>
                              <Text numberOfLines={1} style={styles.boxContent}>
                                {item.NCNumber}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.sectionBottom}>
                            <View style={styles.sectionContent}>
                              <Text numberOfLines={1} style={styles.boxHeader}>
                                {strings.Non_confirmityL}
                              </Text>
                            </View>
                            <View style={styles.sectionContent}>
                              <Text numberOfLines={1} style={styles.boxContent}>
                                {item.data[0]}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={{marginTop: 55}}>
                    <Text style={styles.norecordefound}>
                      {strings.No_records_found}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <ScrollView
                tabLabel={strings.Uploaded}
                style={styles.scrollViewBody}>
                {this.state.NCUpload.length > 0 ? (
                  <View style={{marginTop: 55}}>
                    {this.state.NCUpload.map((item, key) => (
                      <TouchableOpacity
                        onPress={this.getSectionListItem.bind(this, item)}
                        key={key}
                        style={styles.cardBox}>
                        <View style={styles.sectionTop}>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxHeader}>
                              Findings {strings.Number}
                            </Text>
                          </View>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxContent}>
                              {item.title}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.sectionBottom}>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxHeader}>
                              {/* {strings.Non_confirmityL} */}
                              {item.CheckNC === 0 ? 'Non conformity' : 'OFI'}
                            </Text>
                          </View>
                          <View style={styles.sectionContent}>
                            <Text numberOfLines={1} style={styles.boxContent}>
                              {item.data[0]}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={{marginTop: 55}}>
                    <Text style={styles.norecordefound}>
                      {strings.No_records_found}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </ScrollableTabView> 
          ) : (
            <View>
              <View style={{ alignItems: 'center', marginTop:middle}}>
              {this.state.syncMode === 2 ? <Icon name="times-circle" color="red" size={50} /> :
              (this.state.syncMode === 1 || this.state.syncMode === 3 ||this.state.syncMode === 0 ) ? <Bars size={20} color="#1CB8CA" /> : 
              this.state.syncMode === 4 ? <Icon name="check-circle" color="green" size={60} /> : null }
              <Text style={{textAlign: 'center', fontFamily: 'OpenSans-Regular'}}>{ this.state.syncStatusLabel === '' ?
              this.state.syncMode === 0 ? "Loading data...." : strings.Syncing_Audits : this.state.syncStatusLabel}</Text>              
              </View>
              <View  style={{alignItems: 'center', paddingTop:20,  height:attachmentHeight }}>
              {(this.state.AuditAttachments.length > 0 && this.state.syncMode > 0) && this.renderFileUploadStatus()}</View>
            </View>            
          )}
        </View>

        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 65,
            }}>
            {/* <Image source={Images.Footer}/> */}
            <View style={styles.footerDiv}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{width: width(34), justifyContent: 'center'}}>
                  {this.state.syncMode === 0 &&
                  <TouchableOpacity
                    onPress={once(this.onNavigaTo.bind(this, 1))}
                    style={{alignItems: 'center'}}>
                    <ResponsiveImage
                      source={Images.uploadToServerIcon}
                      initWidth="50"
                      initHeight="40"
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.medium,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Create_NC}
                    </Text>
                  </TouchableOpacity>}
                </View>
                {/* Sync */}
                {this.state.syncMode === 0   ? 
                <View style={{width: width(34)}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({                        
                        dialogVisible: true
                      }
                    ,() => { 
                      console.log("Sync Dialog")
                    });}}
                    style={{alignItems: 'center'}}>
                    <ResponsiveImage
                      source={Images.syncImg}
                      initWidth="40"
                      initHeight="40"
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.medium,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Upload_to_server}
                    </Text>
                  </TouchableOpacity>
                </View> :  (this.state.syncMode === 2 || this.state.syncMode === 4) ? <View style={{width: width(34)}}> 
                <View style={{                    
                    borderColor: '#CED0CE',
                    justifyContent: 'center',
                      alignItems: 'center',
                  }}><TouchableOpacity style={{alignItems: 'center'}} onPress={this.CheckSync.bind(this)}>
                    <Icon name="check-square-o" size={35} color="white"/>                  
                    <Text style={{ 
                         color: 'white', 
                         fontSize: Fonts.size.medium, 
                         marginTop: 2,
                         fontFamily: 'OpenSans-Regular',
                      }}>{'Proceed'}</Text></TouchableOpacity></View></View> :  <View style={{width: width(34)}}><View
                      style={{
                        paddingVertical: 20,
                        borderTopWidth: 1,
                        borderColor: '#CED0CE',
                        justifyContent: 'center',
                          alignItems: 'center',
                      }}>
                      <ActivityIndicator size={20} color="#1CAFF6" /></View></View>   }
                {/* End Sync */}
                <View style={{width: width(34)}}>
                {this.state.syncMode === 0 &&
                  <TouchableOpacity
                    onPress={once(this.onNavigaTo.bind(this, 2))}
                    style={{alignItems: 'center'}}>
                    <ResponsiveImage
                      source={Images.uploadToServerIcon}
                      initWidth="50"
                      initHeight="40"
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.medium,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Create_OFI}
                    </Text>
                  </TouchableOpacity>}
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <Toast ref="toast" position="top" opacity={0.8} />

        <ConfirmDialog
          title={strings.NC_title}
          message={strings.NC_title_message}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false, syncMode : 0})}
          positiveButton={{
            title: strings.yes,
            onPress: () => { 
              this.setState({ syncMode : 1},() => { 
                this.CheckInternetConnectivityNCOFI()
              });
              },
            // onPress: () =>
            //   this.setState({confirmpwd: true, dialogVisible: false}),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({dialogVisible: false, syncMode : 0,}),
          }}
        />

        <ConfirmDialog
          title={strings.ConfirmDelete}
          // message={strings.Confirm_delete_message}
          visible={this.state.deleteDialogVisible}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
          onTouchOutside={() => this.setState({deleteDialogVisible: false})}
          positiveButton={{
            title: strings.yes,
            onPress: this.removeNC.bind(this),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({deleteDialogVisible: false}),
          }}
        />

        <Modal
          isVisible={this.state.isMissingFindings}
          onBackdropPress={() => this.setState({isMissingFindings: false})}>
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
                    strings.ThefollowingNCOFIsaredetectedwithmissingattachmentfiles
                  }
                </Text>
                <Text style={styles.bodyText2}>
                  {strings.Doyouwishtocontinuethesyncprocess}
                </Text>
              </View>
              <ScrollView style={styles.scrollBody}>
                {this.state.missingFindings.map((items, i) => (
                  <View key={i} style={styles.carddivMissing}>
                    <View style={styles.cardContMissing}>
                      <View style={styles.cardSecMissing}>
                        <Text style={{fontFamily: 'OpenSans-Regular'}}>
                          {strings.ncnumber}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#37057E',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {'items.NCNumber'}
                        </Text>
                      </View>
                      <View style={styles.cardsec2Missing}>
                        <Text style={{fontFamily: 'OpenSans-Regular'}}>
                          {strings.nonconfirmity}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 15,
                            color: '#070F6E',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {items.NonConfirmity}
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
                    isLoaderVisible: false,
                    isMissingFindings: false,
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
                  this.setState({isMissingFindings: false}, () => {
                    this.syncNCOFIToServer();
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

        {/* Modal */}
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({isVisible: false})}>
          <View style={styles.ncModal}>
            <View style={styles.modalheader}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 23,
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {/* {strings.NC_OFI_Detail} */}
                  {this.state.CheckNC === 0 ? 'NC Detail' : 'OFI Detail'}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.scrollview}>
              <View style={{marginTop: 10}}>
                <View style={styles.firstCard}>
                  <Text style={styles.boxHeader}>{strings.ncnumber}</Text>
                  <Text style={styles.boxContent}>
                    {this.state.NCmodalheader}
                  </Text>
                </View>

               

                {this.state.miniLoading === false ? (
                  <View>
                    {this.state.loadingData === false ? (
                      <View>
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.Date_of_upload}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.UploadDate
                              ? this.changeDateFormatCard(
                                  this.state.UploadDate,
                                ) != ''
                                ? this.changeDateFormatCard(
                                    this.state.UploadDate,
                                  )
                                : '-'
                              : '-'}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {/* {strings.Non_confirmityL} */}
                            {this.state.CheckNC === 0 ? 'Non conformity' : 'OFI'}
                          </Text>
                          <Text style={styles.boxContent}>{this.state.NCtext}</Text>
                        </View>
                        
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.Objective_Evidence}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.objectiveEvidence === ''
                              ? '-'
                              : this.state.objectiveEvidence}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.CategoryL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Category === ''
                              ? '-'
                              : this.state.Category}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.ResponsibilityL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Responsible === ''
                              ? '-'
                              : this.state.Responsible}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.RequestedL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Request === ''
                              ? '-'
                              : this.state.Request}
                          </Text>
                        </View>

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.FailureCategory}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.FailureCategory}
                          </Text>
                        </View>
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.ProcessL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Process}
                          </Text>
                        </View>
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.Document_reference}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.DocumentReference}
                          </Text>
                        </View>
                        {this.renderAttachment()}

                        {/*
                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, { marginTop: 5 }]}>{strings.ResponseLD}</Text>
                          <Text style={styles.boxContent}>{this.state.Response != "-"  && this.state.Response? this.changeDateFormat(this.state.Response) != '' ? this.changeDateFormat(this.state.Response) : '-' : '-'}</Text>
                        </View>
                    */}

                        <View style={styles.commoncard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.ClausesL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.Clause}
                          </Text>
                        </View>

                        <View style={styles.lastcard}>
                          <Text style={[styles.boxHeader, {marginTop: 5}]}>
                            {strings.StandardRequirementsL}
                          </Text>
                          <Text style={styles.boxContent}>
                            {this.state.StandText === ''
                              ? '-'
                              : this.state.StandText}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: 200,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}>
                          <Icon name="hourglass" size={20} color="black" />
                          <Text style={{fontFamily: 'OpenSans-Regular'}}>
                            {strings.Loading}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      top: 90,
                      height: 200,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Icon name="spinner" size={20} color="black" />
                      <Text>{strings.failed}</Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => this.closeReset()}
              style={styles.closeDiv}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: Fonts.size.regular,
                    color: '#00a1e2',
                    top: 20,
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.Close}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.confirmpwd}
          // onBackdropPress={()=>this.setState({confirmpwd:false})}
        >
          <View
            style={{
              width: '100%',
              height: 350,
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.setState({confirmpwd: false})}>
              <Icon
                name="times-circle"
                style={{alignSelf: 'flex-end'}}
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
                    this.setState({pwdentry: text, isEmptyPwd: undefined})
                  }
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'red',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {this.state.isEmptyPwd ? this.state.isEmptyPwd : null}
                </Text>
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
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
    clearAudits: () => dispatch({type: 'CLEAR_AUDITS'}),
    storeServerUrl: serverUrl =>
      dispatch({type: 'STORE_SERVER_URL', serverUrl}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NCOFIPage);