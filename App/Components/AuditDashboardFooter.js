import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
  FlatList,
  ActivityIndicator
} from 'react-native';
import styles from './Styles/AuditHeaderStyle';
import Images from '../Themes/Images';
import auth from '../Services/Auth';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Bubbles, DoubleBounce, Bars, Pulse} from 'react-native-loader';
import ResponsiveImage from 'react-native-responsive-image';
import Fonts from '../Themes/Fonts';
import {strings} from '../Language/Language';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {create} from 'apisauce';
import * as constant from '../Constants/AppConstants';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'react-native-fetch-blob';
import constants from '../Constants/AppConstants';
import ActionSheet from 'react-native-actionsheet';
import {
  Dialog,
  ConfirmDialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {revoke} from 'react-native-app-auth';
//import RNRestart from 'react-native-restart';

class AuditDashboardFooter extends Component {
  propsServerUrl = '';
  isDocsAvail = false;
  auditAttachments = [];
  checkListObjects = [];
  formObjects = [];
  ncOfiObjects = [];
  syncResults = [];
  constructor(props) {
    super(props);

    this.state = {
      isSyncing: false,
      dialogVisible_logout: false,
      dialogVisible: false,
      statusPopUp: false,
      syncPopUp: false,
      errorMsg: '',
      missingFileArr: [],
      isLowConnection: false,
      isMissingFindings: false,
      errorDialogVisible: false,
      syncResults: [],
      progressVisible: false,
      deviceId: this.props.data.audits.deviceid,
      isMissingFindings: false,
      confirmpwd: false,
      pwdentry: undefined,
      isEmptyPwd: undefined,
      isDeviceRegistered: this.props.data.audits.isDeviceRegistered,
      store_server_url: '',
      sso_enabled_Flag: '',
      loginDeviceId: '',
      loginFcmToken: '',
      loginEmail: '',
      logoutFlag: parseInt(''),
      //  store_site_id : this.props.data.audits.currentsiteid,
      dataSource: [
        strings.checkPoints,
        strings.tempRefs,
        strings.ncOfis,
        strings.attachments,
      ],
    };
  }

  componentDidMount() {
    console.log('AuditHeader mounted.',this.props.data);
    console.log('--CurrentPage---> AuditDashboardFooter')
    this.getData();
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
   // this.getSiteId();
  }

  getData = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('loginDeviceId');
      const fcmToken = await AsyncStorage.getItem('loginFcmToken');
      const email = await AsyncStorage.getItem('loginEmail');
      const storedserverrul = await AsyncStorage.getItem('storedserverrul');
      const ssologinstatusbool = await AsyncStorage.getItem('ssologinstatusbool');
      console.log('devicecheckingid', deviceId);
      console.log('checkinghsdfsjdhf',fcmToken)
      console.log('mdfshfkhsdkjfhskd', email)
      this.setState({
        loginDeviceId: deviceId || '',
        loginFcmToken: fcmToken || '',
        loginEmail: email || '',
        store_server_url : storedserverrul || '',
        sso_enabled_Flag : ssologinstatusbool || '',
      });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

   

  // async getSiteId() {
  //   this.setState({
  //     store_site_id: this.props.data.audits.currentsiteid,
  //   },() => {
  //     console.log("this.props.data.audits.currentsiteid", this.props.data.audits.currentsiteid)
  //   });
  // }


  StartGlobalSyncProcess() {
    console.log('StartGlobalSyncProcess called in dashboard page...');

    this.setState(
      {
        isSyncing: true,
        dialogVisible: false,
        // syncPopUp: true
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
                // this.syncAuditsToServerMethod()
                this.checkUser();
                console.log('Download response', response);
                console.log('Low network', this.state.isLowConnection);
              },
            );
          } else {
            // this.syncAuditsToServerMethod()
            this.checkUser();
            console.log('Download response', response);
            console.log('Low network', this.state.isLowConnection);
          }
        });
        /* this.syncAuditsToServerMethod()
      this.syncNCOFIToServer()
      this.syncAuditFormsToServer() */
      },
    );
  }

  checkUser = async () => {
    console.log('user id', this.props.data.audits.userId);
    var userid = this.props.data.audits.userId;
    var token = this.props.data.audits.token;
    var UserStatus = '';
    var serverUrl = this.props.data.audits.serverUrl;
    var ID = this.props.data.audits.userId;
    var type = 3;
    var path = '';
    var RegisterDevice = this.props.data.audits.deviceid;
    const deviceId = await AsyncStorage.getItem('loginDeviceId');


    console.log(userid, token);

    auth.getCheckUser(userid,deviceId,token, (res, data) => {
      console.log('User information', data);

      if (data.data.Message == 'Success') {
        console.log('Checking User status', data.data.Data.ActiveStatus);
        UserStatus = data.data.Data.ActiveStatus;

        if (UserStatus == 2) {
          console.log('User active');
          // this.syncAuditsToServerMethod()
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
         // Alert.alert("Your session has expired,Please login again.")
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
    var auditRecords = this.props.data.audits.auditRecords;
    var ncofiRecords = this.props.data.audits.ncofiRecords;
    var getallAttachFiles = [];
    var pushCL = [];
    var pushForm = [];
    var pushNC = [];
    var pushErrPath = [];

    console.log('auditRecords', auditRecords);
    console.log('ncofiRecords', ncofiRecords);

    try {
      for (var i = 0; i < auditRecords.length; i++) {
        if (auditRecords[i].Listdata.length > 0) {
          for (var j = 0; j < auditRecords[i].Listdata.length; j++) {
            if (auditRecords[i].Listdata[j].File != '') {
              pushCL.push({
                auditid: auditRecords[i].Auditee,
                ChecklistName: auditRecords[i].Listdata[j].ChecklistName,
                filepath: auditRecords[i].Listdata[j].File,
              });
            }
          }
        }
      }

      for (var i = 0; i < auditRecords.length; i++) {
        console.log(auditRecords[i]);
        if (auditRecords[i].Formdata) {
          for (var k = 0; k < auditRecords[i].Formdata.length; k++) {
            if (
              auditRecords[i].Formdata[k].AttachedDocument != '' &&
              auditRecords[i].Formdata[k].Attachmenttype == 0
            ) {
              pushForm.push({
                auditid: auditRecords[i].Auditee,
                FormName: auditRecords[i].Formdata[k].FormName,
                FormID: auditRecords[i].Formdata[k].FormId,
                filepath: auditRecords[i].Formdata[k].AttachedDocument,
              });
            }
          }
        }
      }
    } catch (e) {
      console.log('7', e);
    }

    console.log('pushForm', pushForm);
    console.log('pushCL', pushCL);
    var pushArr = pushCL.concat(pushForm);
    console.log('Checkpoint and forms which contains files', pushArr);

    for (var i = 0; i < ncofiRecords.length; i++) {
      for (var p = 0; p < auditRecords.length; p++) {
        if (ncofiRecords[i].AuditId == auditRecords[p].AuditID) {
          if (ncofiRecords[i].Pending) {
            for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
              if (ncofiRecords[i].Pending[j].filedata != '') {
                pushNC.push({
                  auditid: auditRecords[p].Auditee,
                  NCNumber: ncofiRecords[i].Pending[j].NCNumber,
                  NonConfirmity:
                    ncofiRecords[i].Pending[j].Category == 'NC'
                      ? ncofiRecords[i].Pending[j].NonConfirmity
                      : ncofiRecords[i].Pending[j].OFI,
                  filepath: ncofiRecords[i].Pending[j].filedata,
                });
              }
            }
          }
        }
      }
    }

    console.log('NC which contains files', pushNC);

    getallAttachFiles = pushArr.concat(pushNC);
    console.log('getallAttachFiles', getallAttachFiles);

    if (getallAttachFiles) {
      for (var i = 0; i < getallAttachFiles.length; i++) {
        let checkPath = await this.isPathExist(getallAttachFiles[i].filepath);
        var check404 = checkPath.slice(-4);

        if (check404 == '/404') {
          console.log('Error path found', checkPath);
          pushErrPath.push(getallAttachFiles[i]);
        } else {
          console.log('URL path is ok', checkPath);
        }
      }
    }

    console.log('pushErrPath', pushErrPath);
    if (pushErrPath.length > 0) {
      // perform
      console.log('Broken path detected =========');
      this.setState({missingFileArr: pushErrPath, isMissingFindings: true});
    } else {
      // this.setState({
      //   syncPopUp : true
      // },()=>{
      //   this.syncAuditsToServerMethod()
      //   console.log('all is ok')
      // })
      this.syncAuditsToServerMethod();
    }
  }

  async isPathExist(arrpath) {
    return new Promise((resolve, reject) => {
      // console.log('arrpath',arrpath)
      if (Platform.OS == 'ios') {
        let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
        console.log('IosFilesPath--->', IosFilesPath);
        const arr = arrpath.split('/');
        var uripathIos = IosFilesPath + '/' + arr[arr.length - 1];
        RNFS.readFile(uripathIos, 'base64')
          .then(res => {
            if (res) {
              resolve(uripathIos);
              // console.log('path found',arrpath)
            }
          })
          .catch(err => {
            resolve(uripathIos + '/' + 404);
            // console.warn('path not found',arrpath)
          });
      } else {
        RNFS.readFile(arrpath, 'base64')
          .then(res => {
            if (res) {
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
                      this.props.updateAuditCount(0);
                      setTimeout(() => {
                        // this.props.storeServerUrl(serURL);
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
          console.log('Path not found');
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  syncAuditFormsToServer() {
    console.log('getting props', this.props.data.audits);
    var auditRecords_all = this.props.data.audits.auditRecords;
    var Token = this.props.data.audits.token;
    var getAllForms = [];
    var getOnlineForm = [];
    this.formObjects = [];
    var auditRecords = [];

    auditRecords_all.forEach(item => {
      if (item.AuditRecordStatus == constants.StatusNotSynced) {
        auditRecords.push(item);
      }
    });

    if (auditRecords) {
      for (var i = 0; i < auditRecords.length; i++) {
        if (auditRecords[i].Formdata) {
          for (var j = 0; j < auditRecords[i].Formdata.length; j++) {
            var formObj = '';
            if (
              auditRecords[i].Formdata[j].FormType == 2 ||
              auditRecords[i].Formdata[j].FormType == 0
            ) {
              formObj = {
                AuditId: parseInt(auditRecords[i].AuditId),
                AuditOrderId: parseInt(auditRecords[i].AuditOrderId),
                FormId: parseInt(auditRecords[i].Formdata[j].FormId),
                FormType:
                  auditRecords[i].Formdata[j].Attachmenttype == 0 ? 0 : 1,
                DocName:
                  auditRecords[i].Formdata[j].Attachmenttype == 0
                    ? auditRecords[i].Formdata[j].DocName
                    : auditRecords[i].Formdata[j].AttachedDocument,
                AttachedDocument: '', // auditRecords[i].Formdata[j].Attachmenttype == 0 ? auditRecords[i].Formdata[j].AttachedDocument : ''
              };
              getAllForms.push(formObj);

              // Attachments for DocPro sync
              this.isDocsAvail = true;
              this.auditAttachments.push({
                Type: 'AR',
                Obj: '',
                Id: parseInt(auditRecords[i].Formdata[j].FormId),
                File: auditRecords[i].Formdata[j].AttachedDocument,
                FileName: auditRecords[i].Formdata[j].DocName,
                AuditNumber: auditRecords[i].AuditNumber,
                SiteLevelId: 0,
              });
            } else {
              getOnlineForm.push(auditRecords[i].Formdata[j]);
            }
          }
        }
      }
    }

    console.log('Getting all forms', getAllForms);
    console.log('Getting online forms', getOnlineForm);

    if (getAllForms.length > 0) {
      auth.syncAuditFormsToServer(getAllForms, Token, (res, data) => {
        console.log('response', data);

        if (data.data) {
          if (data.data.Message == 'Success') {
            for (var i = 0; i < data.data.Data.length; i++) {
              if (data.data.Data[i].AuditAttachmentStatus) {
                console.log(
                  'checking data',
                  data.data.Data[i].AuditAttachmentStatus,
                );

                var audtFormRespArr = data.data.Data[
                  i
                ].AuditAttachmentStatus.replace('{', '')
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
              }
            }

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

            // Sync documents to Docpro
            if (this.isDocsAvail) {
              console.log('Syncing attached documents to Docpro...');
              this.syncAttachmentsToDocpro();
            } else {
              console.log('No documents are available to sync!');
              this.setState(
                {
                  isSyncing: false,
                  syncPopUp: false,
                  statusPopUp: true,
                },
                () => {
                  this.refs.toast.show(strings.AuditSync, DURATION.LENGTH_LONG);
                },
              );
            }
          } else {
            console.log('Failed to sync templates/references!');

            // Sync documents to Docpro
            if (this.isDocsAvail) {
              console.log('Syncing attached documents to Docpro...');
              this.syncAttachmentsToDocpro();
            } else {
              console.log('No documents are available to sync!');
              this.setState(
                {
                  isSyncing: false,
                  syncPopUp: false,
                  statusPopUp: true,
                },
                () => {
                  this.refs.toast.show(strings.AuditSync, DURATION.LENGTH_LONG);
                },
              );
            }
          }
        } else {
          console.log('Failed to sync templates/references!');

          // Sync documents to Docpro
          if (this.isDocsAvail) {
            console.log('Syncing attached documents to Docpro...');
            this.syncAttachmentsToDocpro();
          } else {
            console.log('No documents are available to sync!');
            this.setState(
              {
                isSyncing: false,
                syncPopUp: false,
                statusPopUp: true,
              },
              () => {
                this.refs.toast.show(strings.AuditSync, DURATION.LENGTH_LONG);
              },
            );
          }
        }
      });
    } else {
      console.log('No templates/references records found to sync!');

      // Sync documents to Docpro
      if (this.isDocsAvail) {
        console.log('Syncing attached documents to Docpro...');
        this.syncAttachmentsToDocpro();
      } else {
        console.log('No documents are available to sync!');
        this.setState(
          {
            isSyncing: false,
            syncPopUp: false,
            statusPopUp: true,
          },
          () => {
            this.refs.toast.show(strings.AuditSync, DURATION.LENGTH_LONG);
          },
        );
      }
    }
  }

  docProRequest() {
    return new Promise(async (resolve, reject) => {
      // Dynamic parameters
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
      var formRequestObj = [];
      var formRequestArr = [];

      for (var i = 0; i < this.auditAttachments.length; i++) {
        let getdname = this.auditAttachments[i].FileName;
        let getfname = this.auditAttachments[i].FileName;
        let getext = this.auditAttachments[i].FileName.substr(
          this.auditAttachments[i].FileName.lastIndexOf('.') + 1,
        );
        let getobj = this.auditAttachments[i].Obj;
        let getSitId = this.auditAttachments[i].SiteLevelId;
        let dnum = this.auditAttachments[i].AuditNumber;

        this.convertFile(this.auditAttachments[i].File).then(res => {
          console.log('res===>>', res);

          formRequestObj = {
            dnum: dnum,
            dname: getdname,
            filename: getfname,
            ext: getext,
            filepath: filepath,
            obj: getobj,
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
            filecontent: res ? res : '',
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

          if (formRequestArr.length == this.auditAttachments.length) {
            auth.getdocProAttachment(formRequestArr, token, (res, data) => {
              console.log('syncAttachmentsToDocpro response', data);

              if (data.data) {
                if (data.data.Message === 'Success') {
                  console.log('syncAttachmentsToDocpro Success!');
                  this.setState(
                    {
                      isSyncing: false,
                      syncPopUp: false,
                      statusPopUp: true,
                    },
                    () => {
                      this.refs.toast.show(
                        strings.AuditSync,
                        DURATION.LENGTH_LONG,
                      );
                    },
                  );
                } else {
                  console.log('syncAttachmentsToDocpro Failed!');
                  this.setState(
                    {
                      isSyncing: false,
                      syncPopUp: false,
                      statusPopUp: true,
                    },
                    () => {
                      this.refs.toast.show(
                        strings.AuditSync,
                        DURATION.LENGTH_LONG,
                      );
                    },
                  );
                }
              } else {
                console.log('syncAttachmentsToDocpro Failed!');
                this.setState(
                  {
                    isSyncing: false,
                    syncPopUp: false,
                    statusPopUp: true,
                  },
                  () => {
                    this.refs.toast.show(
                      strings.AuditSync,
                      DURATION.LENGTH_LONG,
                    );
                  },
                );
              }
            });
          }
        });
      }
    });
  }

  convertFile = path => {
    return new Promise((resolve, reject) => {
      if (Platform.OS == 'ios') {
        let IosFilesPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
        console.log('IosFilesPath--->', IosFilesPath);
        const arr = path.split('/');
        var uripathIos = IosFilesPath + '/' + arr[arr.length - 1];
        RNFetchBlob.fs
          .readFile(uripathIos, 'base64')
          .then(data => {
            if (data) {
              resolve(data);
              // console.log('path found',arrpath)
            }
          })
          .catch(err => {
            resolve(undefined);
            // console.warn('path not found',arrpath)
          });
      } else {
        RNFetchBlob.fs
          .readFile(path, 'base64')
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            resolve(undefined);
            console.log('Error in converting', err);
          });
      }
    });
  };

  async syncAttachmentsToDocpro() {
    this.docProRequest();
  }

  syncAuditsToServerMethod = () => {
    if (this.state.isLowConnection === false) {
      if (this.props.data.audits.isOfflineMode) {
        this.setState({dialogVisible: false, isSyncing: false}, () => {
          Alert.alert('AuditPro', strings.Offline_Notice);
          this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
        });
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.setState(
              {
                isSyncing: true,
                dialogVisible: false,
                syncPopUp: true,
              },
              () => {
                console.log('Sync process started!');
                this.handleConnectionChange();
              },
            );
          } else {
            this.setState({isSyncing: false, syncPopUp: false}, () => {
              Alert.alert('AuditPro', strings.No_sync);
              this.refs.toast.show(strings.No_sync, DURATION.LENGTH_LONG);
            });
          }
        });
      }
    } else {
      this.setState({dialogVisible: false}, () => {
        Alert.alert(strings.nc_reply_06);
      });
    }
  };

  handleConnectionChange() {
    const TOKEN = this.props.data.audits.token;
    var audits = this.props.data.audits.auditRecords;
    var auditRecords = [];
    this.auditAttachments = [];
    this.checkListObjects = [];
    this.formObjects = [];
    this.ncOfiObjects = [];
    this.isDocsAvail = false;
    this.syncResults = []; // empty the results before start sync process
    if (audits) {
      for (var i = 0; i < audits.length; i++) {
        var auditCheckPoints = [];
        if (
          audits[i].Listdata &&
          audits[i].AuditRecordStatus == constants.StatusNotSynced
        ) {
          for (var j = 0; j < audits[i].Listdata.length; j++) {
            if (audits[i].Listdata[j].Modified == true) {
              if (
                audits[i].Listdata[j].Approach == '' &&
                audits[i].Listdata[j].Attachment == '' &&
                audits[i].Listdata[j].Correction == 0 &&
                audits[i].Listdata[j].File == '' &&
                audits[i].Listdata[j].FileName == '' &&
                audits[i].Listdata[j].FileType == '' &&
                audits[i].Listdata[j].Remark == '' &&
                audits[i].Listdata[j].Score == '' &&
                audits[i].Listdata[j].RadioValue == 0
              ) {
                console.log('Nothing is modified');
              } else {
                if (audits[i].Listdata[j].File != '') {
                  // Attachments for DocPro sync
                  this.isDocsAvail = true;
                  this.auditAttachments.push({
                    Type: 'CL',
                    Obj: '',
                    Id: parseInt(audits[i].Listdata[j].ChecklistTemplateId),
                    File: audits[i].Listdata[j].File,
                    FileName: audits[i].Listdata[j].FileName,
                    AuditNumber: audits[i].AuditNumber,
                    SiteLevelId: 0,
                  });
                }
                auditCheckPoints.push({
                  ChecklistTemplateId: parseInt(
                    audits[i].Listdata[j].ChecklistTemplateId,
                  ),
                  ParentId: audits[i].Listdata[j].ParentId
                    ? parseInt(audits[i].Listdata[j].ParentId)
                    : 0,
                  IsNCAllowed: audits[i].Listdata[j].IsNCAllowed,
                  IsCorrect: audits[i].Listdata[j].IsCorrect,
                  Attachment: audits[i].Listdata[j].Attachment,
                  File: '', //audits[i].Listdata[j].File
                  FileType: audits[i].Listdata[j].FileType,
                  FileName: audits[i].Listdata[j].FileName,
                  Remark: audits[i].Listdata[j].Remark,
                  ParamMode: audits[i].Listdata[j].ParamMode,
                  RadioValue: audits[i].Listdata[j].RadioValue,
                  Correction:
                    audits[i].Listdata[j].Correction == ''
                      ? 0
                      : audits[i].Listdata[j].Correction,
                  //Approach: audits[i].Listdata[j].Approach === '' ? undefined : audits[i].Listdata[j].Approach,
                  Approach: audits[i].Listdata[j].ApproachId,
                  Score: audits[i].Listdata[j].Score
                    ? parseInt(audits[i].Listdata[j].Score)
                    : 0,
                });
              }
            }
          }
        }
        if (auditCheckPoints.length > 0) {
          auditRecords.push({
            FormId: audits[i].FormId == '' ? 0 : parseInt(audits[i].FormId),
            AuditId: parseInt(audits[i].AuditId),
            AuditProgramId: parseInt(audits[i].AuditProgramId),
            AuditTypeId: parseInt(audits[i].AuditTypeId),
            AuditOrderId: parseInt(audits[i].AuditOrderId),
            SiteId: parseInt(audits[i].SiteId),
            UserId: parseInt(audits[i].UserId),
            FromDocPro: parseInt(audits[i].FromDocPro),
            DocumentId: parseInt(audits[i].DocumentId),
            DocRevNo: parseInt(audits[i].DocRevNo),
            Status: parseInt(audits[i].Status),
            Listdata: auditCheckPoints,
          });
        }
      }
    }

    console.log('syncAuditsToServer auditRecords', auditRecords);
    if (auditRecords.length > 0) {
      auth.syncAuditsToServer(auditRecords, TOKEN, (res, data) => {
        console.log('close out audits check here data', data);

        if (data.data) {
          if (data.data.Message == 'Success') {
            for (var i = 0; i < data.data.Data.length; i++) {
              // Parse the response and create a summary
              var respArr = data.data.Data[i].AuditStatus.replace('{', '')
                .replace('}', '')
                .split(',');

              var auditNumberArr = respArr[0].split(':');
              var auditStatusArr = respArr[1].split(':');
              var auditObjArr = respArr[2].split(':');
              var auditSiteLevelIDArr = respArr[3].split(':');

              var auditNumber = auditNumberArr[1].trim();
              var auditStatus = auditStatusArr[1].trim();
              var auditObj = auditObjArr[1].trim();
              var auditSiteLevelID = auditSiteLevelIDArr[1].trim();

              this.syncResults.push({
                auditNumber: auditNumber,
                auditStatus: auditStatus,
              });
              var auditObjList = auditObj.split('|');
              for (var j = 0; j < auditObjList.length; j++) {
                this.checkListObjects.push({
                  templateId: this.parseObj(auditObjList[j].trim(), 'CL'),
                  obj: auditObjList[j].trim(),
                  siteLevelId: auditSiteLevelID,
                });
              }
            }
            // this.setState({
            //   syncResults: this.syncResults
            // })

            console.log('ChecklistObjectArr', this.checkListObjects);
            console.log('auditAttachments', this.auditAttachments);

            for (var i = 0; i < this.auditAttachments.length; i++) {
              for (var j = 0; j < this.checkListObjects.length; j++) {
                if (
                  this.auditAttachments[i].Type == 'CL' &&
                  this.auditAttachments[i].Id ==
                    parseInt(this.checkListObjects[j].templateId)
                ) {
                  this.auditAttachments[i].Obj = this.checkListObjects[j].obj;
                  this.auditAttachments[i].Id = parseInt(
                    this.checkListObjects[j].templateId,
                  );
                  this.auditAttachments[i].SiteLevelId =
                    this.checkListObjects[j].siteLevelId;
                }
              }
            }

            console.log(
              'Request formed after audit formed',
              this.auditAttachments,
            );
            console.log('syncResults -->', this.syncResults);

            var auditRecordsOrg = this.props.data.audits.auditRecords;
            console.log('auditRecordsOrg', auditRecordsOrg);
            var auditRecords = [];

            if (auditRecordsOrg && this.syncResults.length > 0) {
              for (var p = 0; p < auditRecordsOrg.length; p++) {
                for (var j = 0; j < this.syncResults.length; j++) {
                  var isupdateRecord = false;
                  if (
                    auditRecordsOrg[p].AuditNumber ==
                    this.syncResults[j].auditNumber
                  ) {
                    isupdateRecord = true;
                    var listDataArr = [];
                    for (
                      var q = 0;
                      q < auditRecordsOrg[p].Listdata.length;
                      q++
                    ) {
                      listDataArr.push({
                        ChecklistTemplateId:
                          auditRecordsOrg[p].Listdata[q].ChecklistTemplateId,
                        Attachment: auditRecordsOrg[p].Listdata[q].Attachment,
                        File: auditRecordsOrg[p].Listdata[q].File,
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
                        RemarkforNc: auditRecordsOrg[p].Listdata[q].RemarkforNc,
                        AttachforNc: auditRecordsOrg[p].Listdata[q].AttachforNc,
                        RemarkforOfi:
                          auditRecordsOrg[p].Listdata[q].RemarkforOfi,
                        AttachforOfi:
                          auditRecordsOrg[p].Listdata[q].AttachforOfi,
                        Modified: false,
                        //
                        AttachforComp:
                          auditRecordsOrg[p].Listdata[q].AttachforComp,
                        AuditId: auditRecordsOrg[p].Listdata[q].AuditId,
                        ChecklistName:
                          auditRecordsOrg[p].Listdata[q].ChecklistName,
                        CompLevelId: auditRecordsOrg[p].Listdata[q].CompLevelId,
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
                      });
                    }
                    console.log('listDataArr', listDataArr);

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
                    break;
                  }
                }
                if (!isupdateRecord) {
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
            }

            // Store audit list in redux store to set it in persistant storage
            console.log('auditRecords---====--->', auditRecords);
            this.props.storeAuditRecords(auditRecords);

            // Update audit status in the audit list
            var auditListOrg = this.props.data.audits.audits;
            var auditList = [];

            if (auditListOrg) {
              for (var i = 0; i < auditListOrg.length; i++) {
                var auditStatus = auditListOrg[i].cStatus;
                var auditColor = auditListOrg[i].color;

                for (var j = 0; j < auditRecords.length; j++) {
                  if (
                    parseInt(auditListOrg[i].ActualAuditId) ==
                    parseInt(auditRecords[j].AuditId)
                  ) {
                    if (auditListOrg[i].AuditStatus != 3) {
                      auditStatus = constants.StatusSynced;
                      break;
                    }
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
                  case constants.StatusCompleted:
                    auditColor = 'green';
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
            }

            this.props.storeAudits(auditList);
            this.props.changeAuditState(false);

            // Sync NC/OFIs to server
            this.syncNCOFIToServer();
          } else {
            this.setState({isSyncing: false, syncPopUp: false}, () => {
              console.log('Failed to Sync Audits to server!');
              Alert.alert('AuditPro', strings.AuditSyncFailed);
            });
          }
        } else {
          this.setState({isSyncing: false, syncPopUp: false}, () => {
            console.log('Failed to Sync Audits to server!');
            Alert.alert('AuditPro', strings.AuditSyncFailed);
          });
        }
      });
    } else {
      // Sync NC/OFIs to server
      this.syncNCOFIToServer();
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

  syncNCOFIToServer() {
    var token = this.props.data.audits.token;
    var ncofiRecords = this.props.data.audits.ncofiRecords;
    console.log('ncofiRecords-->', ncofiRecords);
    var groupNCOFI = [];
    var formRequest = [];
    this.ncOfiObjects = [];

    if (ncofiRecords) {
      for (var i = 0; i < ncofiRecords.length; i++) {
        if (ncofiRecords[i].Pending.length > 0) {
          for (var j = 0; j < ncofiRecords[i].Pending.length; j++) {
            console.log(ncofiRecords[i].Pending[j]);
            groupNCOFI.push(ncofiRecords[i].Pending[j]);
          }
        }
      }
    }

    console.log('Grouped', groupNCOFI);

    if (groupNCOFI.length > 0) {
      for (var i = 0; i < groupNCOFI.length; i++) {
        if (groupNCOFI[i].filename != '') {
          // Attachments for DocPro sync
          this.isDocsAvail = true;
          this.auditAttachments.push({
            Type: 'NC',
            Obj: '',
            Id: parseInt(groupNCOFI[i].uniqueNCkey),
            File: groupNCOFI[i].filedata,
            FileName: groupNCOFI[i].filename,
            AuditNumber: groupNCOFI[i].NCNumber,
            SiteLevelId: 0,
          });
        }

        if (groupNCOFI[i].Category === 'NC') {
          formRequest.push({
            strProcess:
              groupNCOFI[i].selectedItemsProcess.length > 0
                ? groupNCOFI[i].selectedItemsProcess.join(',')
                : '',
            CorrectiveId: groupNCOFI[i].AuditID,
            CategoryId: groupNCOFI[i].categoryDrop
              ? groupNCOFI[i].categoryDrop.id
              : 0,
            Title: groupNCOFI[i].NCNumber,
            FileName: groupNCOFI[i].filename,
            AttachEvidence: groupNCOFI[i].filedata,
            Department: groupNCOFI[i].deptDrop ? groupNCOFI[i].deptDrop.id : 0,
            AuditStatus:
              groupNCOFI[i].auditstatus === ''
                ? 0
                : parseInt(groupNCOFI[i].auditstatus),
            NonConformity: groupNCOFI[i].NonConfirmity,
            RequestedBy: groupNCOFI[i].requestDrop
              ? groupNCOFI[i].requestDrop.id
              : 0,
            FormId:
              groupNCOFI[i].Formid === '' ? 0 : parseInt(groupNCOFI[i].Formid),
            SiteId: groupNCOFI[i].SiteID,
            ChecklistId:
              groupNCOFI[i].ChecklistTemplateId === ''
                ? 0
                : parseInt(groupNCOFI[i].ChecklistTemplateId),
            ElementID: groupNCOFI[i].selectedItems
              ? groupNCOFI[i].selectedItems.join(',')
              : 0,
            ResponsibilityUser: groupNCOFI[i].userDrop
              ? groupNCOFI[i].userDrop.id
              : 0,
            NCIdentifier:
              groupNCOFI[i].ncIdentifier === undefined
                ? ''
                : groupNCOFI[i].ncIdentifier,
            ObjectiveEvidence:
              groupNCOFI[i].objEvidence === undefined
                ? ''
                : groupNCOFI[i].objEvidence,
            RecommendedAction:
              groupNCOFI[i].recommAction === undefined
                ? ''
                : groupNCOFI[i].recommAction,
            DocumentRef:
              groupNCOFI[i].documentRef === undefined
                ? ''
                : groupNCOFI[i].documentRef,
          });
        } else if (groupNCOFI[i].Category === 'OFI') {
          formRequest.push({
            strProcess:
              groupNCOFI[i].selectedItemsProcess.length > 0
                ? groupNCOFI[i].selectedItemsProcess.join(',')
                : '',
            CorrectiveId: groupNCOFI[i].AuditID,
            CategoryId: groupNCOFI[i].categoryDrop
              ? groupNCOFI[i].categoryDrop.id
              : 0,
            Title: groupNCOFI[i].NCNumber,
            FileName: groupNCOFI[i].filename,
            AttachEvidence: groupNCOFI[i].filedata,
            Department: groupNCOFI[i].deptDrop ? groupNCOFI[i].deptDrop.id : 0,
            AuditStatus:
              groupNCOFI[i].auditstatus === ''
                ? 0
                : parseInt(groupNCOFI[i].auditstatus),
            RequestedBy: groupNCOFI[i].requestDrop
              ? groupNCOFI[i].requestDrop.id
              : 0,
            NonConformity: groupNCOFI[i].OFI,
            FormId:
              groupNCOFI[i].Formid === '' ? 0 : parseInt(groupNCOFI[i].Formid),
            SiteId: groupNCOFI[i].SiteID,
            ChecklistId:
              groupNCOFI[i].ChecklistTemplateId === ''
                ? 0
                : parseInt(groupNCOFI[i].ChecklistTemplateId),
            ElementID: groupNCOFI[i].selectedItems
              ? groupNCOFI[i].selectedItems.join(',')
              : 0,
            ResponsibilityUser: groupNCOFI[i].userDrop
              ? groupNCOFI[i].userDrop.id
              : 0,
            NCIdentifier:
              groupNCOFI[i].ncIdentifier === undefined
                ? ''
                : groupNCOFI[i].ncIdentifier,
            ObjectiveEvidence:
              groupNCOFI[i].objEvidence === undefined
                ? ''
                : groupNCOFI[i].objEvidence,
            RecommendedAction:
              groupNCOFI[i].recommAction === undefined
                ? ''
                : groupNCOFI[i].recommAction,
            DocumentRef:
              groupNCOFI[i].documentRef === undefined
                ? ''
                : groupNCOFI[i].documentRef,
          });
        }
      }
    }

    console.log('keypass', formRequest);

    if (formRequest.length > 0) {
      var token = this.props.data.audits.token;
      auth.syncNCOFIToServer(formRequest, token, (res, data) => {
        console.log('syncAuditsToServer res', res);
        console.log('NCOFI data', data);

        if (data.data) {
          if (data.data.Message == 'Success') {
            console.log(strings.NCSuccess);
            this.refreshList();

            for (var i = 0; i < data.data.Data.length; i++) {
              var auditObj = data.data.Data[i].DocProParameter.trim();
              var auditSiteLevelID = data.data.Data[i].SiteLevelId.trim();
              var uniqueNCkey = data.data.Data[i].UniqueNCkey.trim();

              console.log('syncNCOFIToServer auditObj', auditObj);
              console.log(
                'syncNCOFIToServer auditSiteLevelID',
                auditSiteLevelID,
              );
              console.log('syncNCOFIToServer uniqueNCkey', uniqueNCkey);

              this.ncOfiObjects.push({
                uniqueNCkey: uniqueNCkey,
                obj: auditObj,
                siteLevelId: auditSiteLevelID,
              });

              console.log('NCOFIObjectsArr', this.ncOfiObjects);
            }

            for (var i = 0; i < this.auditAttachments.length; i++) {
              for (var j = 0; j < this.ncOfiObjects.length; j++) {
                if (
                  this.auditAttachments[i].Type == 'NC' &&
                  this.auditAttachments[i].Id ==
                    parseInt(this.ncOfiObjects[j].uniqueNCkey)
                ) {
                  this.auditAttachments[i].Obj = this.ncOfiObjects[j].obj;
                  this.auditAttachments[i].Id = parseInt(
                    this.ncOfiObjects[j].uniqueNCkey,
                  );
                  this.auditAttachments[i].SiteLevelId =
                    this.ncOfiObjects[j].siteLevelId;
                }
              }
            }

            console.log(
              'Request formed after audit formed',
              this.auditAttachments,
            );

            // Sync templates & references to server
            this.syncAuditFormsToServer();
          } else {
            console.log(strings.NCFAiled);
            // Sync templates & references to server
            this.syncAuditFormsToServer();
          }
        } else {
          console.log(strings.NCFAiled);
          // Sync templates & references to server
          this.syncAuditFormsToServer();
        }
      });
    } else {
      console.log('No pending NC/OFIs are available to sync.');
      // Sync templates & references to server
      this.syncAuditFormsToServer();
    }
  }

  refreshList() {
    var dupNCrecords = [];
    var NCrecords = this.props.data.audits.ncofiRecords;

    if (NCrecords) {
      for (var i = 0; i < NCrecords.length; i++) {
        dupNCrecords.push({
          AuditID: NCrecords[i].AuditID,
          Uploaded: NCrecords[i].Uploaded,
          Pending: [],
        });
      }
    }
    // Update NC/OFI list in redux store
    this.props.storeNCRecords(dupNCrecords);
  }

  renderRow = ({item}) => {
    return <Text>{`\u2022 ${item}`}</Text>;
  };

  chooseAction(index) {
    console.log(
      'chooseAction',
      index,
      this.props.data.audits.suppliermanagementstatus,
    );
    if (index == 0) {
      this.props.navigation.navigate('Profile');
    }
    if (index == 1) {
      this.props.navigation.navigate('UserPreference');
    }
    if (index == 2) {
      this.props.navigation.navigate('Downloads');
    }
    if (index == 3) {
      this.props.navigation.navigate('SyncDetails');
    }
    if (index == 4) {
      this.props.navigation.navigate('Help');
    }
    if (
      index == 5 &&
      this.props.data.audits.suppliermanagementstatus === 'true'
    ) {
      this.props.navigation.navigate('SupplyManage');
    }
    if (
      index == 5 &&
      this.props.data.audits.suppliermanagementstatus !== 'true'
    ) {
      this.setState({dialogVisible_logout: true});
    }

    if (
      index == 6 &&
      this.props.data.audits.suppliermanagementstatus === 'true'
    ) {
      this.setState({dialogVisible_logout: true});
    }
  }

  ChangeActiveStatus = async () => {
    try {
      await AsyncStorage.setItem('isActive', 'false');
      console.log('isActive status changed as false in asyncstorage..');
    } catch (error) {
      // Error saving data
    }
  };

 

  async doLogout() {

    this.ChangeActiveStatus();

    let sso_login = await AsyncStorage.getItem('is_user_sso_login');
    let sso_login_obj = JSON.parse(sso_login);
    console.log('checkingssologin----',sso_login_obj);
    if (sso_login_obj && Object.keys(sso_login_obj).length > 0) {
      await revoke(sso_login_obj.config, sso_login_obj.token);
    }
    this.setState({
      logoutFlag: 0,
    })
    // this.props.clearAudits()
    // this.props.clearNotifications()
    // var serverUrl = this.props.data.audits.serverUrl
    // var ID = this.props.data.audits.userId
    // var type = 3
    // var path = ''
    // var cleanURL = serverUrl.replace(/^https?:\/\//, '')
    // var formatURL = cleanURL.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    // this.propsServerUrl = formatURL
    // var emptyRecentAudits = []
    // console.log('cleanURL', this.propsServerUrl)

    if (this.props.data.audits.isOfflineMode) {
      this.setState({
        dialogVisible_logout: false,
        errorDialogVisible: true,
        errorMsg: strings.Offline_Notice,
      });
    } else {
      
       var serverUrl = this.state.store_server_url;// this.props.data.audits.serverUrl;
     // var currentsiteid = this.props.data.audits.currentsiteid;
      var ID = this.props.data.audits.userId;
      var type = 3;
      var path = '';
      var cleanURL = serverUrl?.replace(/^https?:\/\//, '');
      var formatURL = cleanURL?.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      this.propsServerUrl = formatURL;
      var emptyRecentAudits = [];
      console.log('Logout:cleanURL', this.serverUrl, this.propsServerUrl);
      const {auditCount, dynamicAuditCount} = this.props.notifications;
      var SaveDetails = this.props.data.audits;
      var ID = this.props.data.audits.userId;
    //  var siteId = this.props.data.audits.siteId;
      this.props.clearNotifications();
      var UserDetails = [];

      UserDetails.push({
        UserId: this.props.data.audits.userId,
        audits: SaveDetails,
        NotificationDetails: {auditCount, dynamicAuditCount},
      });
      console.log('Logout:SaveDetails', SaveDetails);
      console.log('Logout:UserDetails', UserDetails);
      var stringify = JSON.stringify(UserDetails);
      console.log(stringify,"stringofy");
      
      this.props.clearURL()
      this.props.clearAudits();
      // await AsyncStorage.removeItem('storedserverrul');
      await AsyncStorage.removeItem('ssologinstatusbool');

      console.log('Server URL cleared and user logged out');

      if (Platform.OS == 'android') {
        path =
          '/data/user/0/com.omnex.suppliermanagement/cache/AuditUser/' +
          this.propsServerUrl +
          ID;
        console.log('path storing-->', path);
      } else {
        var iOSpath = RNFS.DocumentDirectoryPath;
        path = iOSpath + '/' + this.propsServerUrl + ID;
      }
      // write the file
     // console.log('Logout:*** path', path,"this.props.data.audits.currentsiteid:Logout",currentsiteid);
      RNFS.writeFile(path, stringify, 'utf8')
        .then(success => {
          console.log('Logout:FILE WRITTEN!', success);
          this.props.storeServerUrl(serverUrl);
          this.props.storeLoginSession(false);
          this.props.updateRecentAuditList(emptyRecentAudits);
          this.props.storeSiteId(siteId);
          this.props.registrationState(this.state.isDeviceRegistered);
          this.props.storeDeviceid(this.state.deviceId);
          this.setState({progressVisible: false});
        })
        .catch(err => {
          console.log('Logout:Logout error!', err.message);
          this.setState({
            progressVisible: false,
            // errorDialogVisible: true,
            errorMsg: strings.LogoutFailed,
          });
        });
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          this.setState(
            {
              dialogVisible_logout: false,
              progressVisible: true,
            },
            () => {
              auth.registerDevice(
                this.state.deviceId,
                this.state.store_server_url,
                type,
                (res, data) => {
                  console.log('Logout:Logout response', data);
                  console.log(
                    this.props.data.audits.serverUrl,
                    'serverurlclear',
                  );
                  if (data.data) {
                    if (data.data.Success == true) {
                      console.log('ssoenableflag111::::::', this.state.sso_enabled_Flag);
                      if(this.state.sso_enabled_Flag == "true"){
                         this.logoutCall(this.state.loginEmail,this.state.loginFcmToken,this.state.loginDeviceId,this.state.logoutFlag,this.state.sso_enabled_Flag)
                            }else{
                          this.logoutCall(this.state.loginEmail,this.state.loginFcmToken,this.state.loginDeviceId,this.state.logoutFlag)
                          }
                     this.props.navigation.navigate('LaunchScreen');
                      // RNRestart.Restart();
                      
                    }
                  } else {
                    console.log('Logout:Logout service failure here!');
                    this.setState({
                      progressVisible: false,
                      errorDialogVisible: true,
                      errorMsg: strings.LogoutFailed,
                    });
                  }
                },
              );
            },
          );
        } else {
          this.setState({
            dialogVisible_logout: false,
            errorDialogVisible: true,
            errorMsg: strings.NoInternet,
          });
        }
      });
     
    }
  }
  logoutCall = (email,loginfcmtkn,loginDeviceId,loginflag, isSso) => {
    console.log('checking parsingdetails',email,loginfcmtkn,loginDeviceId,loginflag, isSso)
    var password = ''
    auth.loginUser(
      email,
      password,
      loginfcmtkn,
      loginDeviceId,
      loginflag,
      isSso,
      (res, data) => {
        console.log('loginUser', data);
        console.log('checkingloginUserresponse', res);
        //this.props.storeSupplierManagement("true");

        if (data.data.Message == "Logout Successfully") {
         console.log('sjdfsjdfjdfjsdfjsfj',data);
          console.log('storeUserName', email);
         
        } else {
          // Alert.alert(data.data.Message)
          console.log('checking©responseelse', res);

        }
      },
    );
  };
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
      NetInfo.fetch().then(netState => {
        if (netState.isConnected) {
          Keyboard.dismiss();
          var username = this.props.data.audits.loginuser;
          var pwd = this.state.pwdentry;

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
            (res, data) => {
              if (data.data.Success == true) {
                this.setState(
                  {
                    confirmpwd: false,
                    pwdentry: undefined,
                  },
                  () => {
                    // this.refs.toast.show('No NC/OFI found to sync', DURATION.LENGTH_SHORT)
                    this.StartGlobalSyncProcess();
                  },
                );
              } else {
                this.setState(
                  {
                    // confirmpwd : false,
                    pwdentry: undefined,
                    isEmptyPwd: data.data.Message,
                  },
                  () => {
                    // this.refs.toast.show(strings.AuditFail, DURATION.LENGTH_LONG)
                  },
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

  render() {
    return (
      <View style={styles.wrapper}>
        {/* <ImageBackground source={Images.dashFooter} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}> */}
        <View style={{flexDirection: 'row', padding: 10}}>
          <View style={styles.footerMenuItem}>
            {/* <ResponsiveImage
                style={styles.normalIcon}
                source={Images.profileImg}
                initWidth="40" initHeight="40"
              /> */}
            <Icon name="home" size={20} color="#00BAC8" />
            <Text
              style={{
                color: '#00BAC8',
                fontSize: Fonts.size.medium,
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.home}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CalandarList')}
            style={styles.footerMenuItem}>
            {/* <ResponsiveImage
                style={styles.normalIcon}
                source={Images.profileImg}
                initWidth="40" initHeight="40"
              /> */}
            <Icon name="calendar" size={20} color="#848484" />
            <Text
              style={{
                color: '#848484',
                fontSize: Fonts.size.medium,
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.Calendar}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.footerMenuItem, {display: 'none'}]}>
            {/* <ResponsiveImage
                style={styles.normalIcon}
                source={Images.dashImg}
                initWidth="40" initHeight="40"
              /> */}
            <Icon name="th-large" size={20} color="#848484" />
            <Text style={{color: '#4ACECD', fontSize: Fonts.size.medium}}>
              {strings.Dashboard}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerMenuItem}>
            {!this.state.isSyncing ? (
              <View
                style={{textAlign: 'center', alignItems: 'center'}}
                // onPress={() => {
                //   this.setState({
                //     dialogVisible: true
                //   })
                // }}
              >
                {/* <ResponsiveImage
                  style={styles.normalIcon}
                  source={Images.syncImg}
                  initWidth="40" initHeight="40"
                /> */}
                <Icon name="upload" size={20} color="lightgrey" />
                <Text
                  style={{
                    color: 'lightgrey',
                    fontSize: Fonts.size.medium,
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.Sync}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                }}>
              <ActivityIndicator size={20} color="#1CAFF6" />
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() =>
              // this.props.navigation.navigate('UserPreference')
              this.ActionSheet.show()
            }
            style={styles.footerMenuItem}>
            {/* <ResponsiveImage
                style={styles.normalIcon}
                source={Images.profileImg}
                initWidth="40" initHeight="40"
              /> */}
            <Icon name="ellipsis-h" size={20} color="#848484" />
            <Text
              style={{
                color: '#848484',
                fontSize: Fonts.size.medium,
                fontFamily: 'OpenSans-Regular',
              }}>
              {strings.More}
            </Text>
          </TouchableOpacity>

          {/* <View style={styles.footerMenuItem}>
              <Image
                style={styles.normalIcon}
                source={Images.settingsImg}
              />
            </View>
            <View style={styles.footerMenuItem}>
              <Image
                style={styles.helpIcon}
                source={Images.helpImg}
              />
            </View> */}
        </View>
        {/* </ImageBackground> */}

        <ConfirmDialog
          title={strings.title_sync}
          message={strings.title_sync_message}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}

          positiveButton={{
            title: strings.yes,
            // onPress: this.StartGlobalSyncProcess.bind(this)
            onPress: () =>
              this.setState({confirmpwd: true, dialogVisible: false}),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({dialogVisible: false}),
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          // title={'Which one do you like ?'}
          options={
            Platform.OS == 'android'
              ? this.props.data.audits.suppliermanagementstatus == 'true'
                ? [
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Profile}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.settings}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.downloads}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Sync_Details}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.help}
                    </Text>,

                    //(this.props.data.audits.suppliermanagementstatus == "true"?
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Sup_manager}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#FF3B30',
                      }}>
                      {strings.logout}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Cancel}
                    </Text>,
                  ]
                : [
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Profile}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.settings}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.downloads}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Sync_Details}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.help}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#FF3B30',
                      }}>
                      {strings.logout}
                    </Text>,
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Fonts.size.regular,
                        color: '#007AFF',
                      }}>
                      {strings.Cancel}
                    </Text>,
                  ]
              : this.props.data.audits.suppliermanagementstatus == 'true'
              ? [
                  strings.Profile,
                  strings.settings,
                  strings.downloads,
                  strings.Sync_Details,
                  strings.help,
                  strings.Sup_manager,
                  strings.logout,
                  strings.Cancel,
                ]
              : [
                  strings.Profile,
                  strings.settings,
                  strings.downloads,
                  strings.Sync_Details,
                  strings.help,
                  strings.logout,
                  strings.Cancel,
                ]
          }
          //cancelButtonIndex={this.props.data.audits.suppliermanagementstatus = "true"? 7:6}
          //destructiveButtonIndex={this.props.data.audits.suppliermanagementstatus = "true"? 6:5}
          cancelButtonIndex={6}
          onPress={index => this.chooseAction(index)}
        />

        <View style={{flexDirection: 'column'}}>
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
        </View>

        {/* Global sync report */}
        <Modal isVisible={this.state.statusPopUp}>
          <View
            style={{
              width: '100%',
              height: 300,
              backgroundColor: 'white',
              borderRadius: 8,
              flexDirection: 'column',
            }}>
            <View
              style={{
                width: '100%',
                height: 40,
                marginTop: 10,
                borderBottomColor: 'lightgrey',
                borderBottomWidth: 0.7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#485B9E',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.GBS}
              </Text>
            </View>
            <ScrollView
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
              }}>
              {this.syncResults.length > 0 ? (
                this.syncResults.map((item, key) => (
                  <View key={key} style={styles.cardBox}>
                    <View style={styles.sectionTop}>
                      <View style={styles.sectionContent}>
                        <Text numberOfLines={1} style={styles.boxHeader}>
                          {strings.Audit_number}
                        </Text>
                      </View>
                      <View style={styles.sectionContent}>
                        <Text numberOfLines={1} style={styles.boxContent}>
                          {item.auditNumber}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.sectionBottom}>
                      <View style={styles.sectionContent}>
                        <Text numberOfLines={1} style={styles.boxHeader}>
                          {strings.Status}
                        </Text>
                      </View>
                      <View style={styles.sectionContent}>
                        <Text
                          numberOfLines={1}
                          style={
                            item.auditStatus == 1
                              ? styles.boxContentSuccess
                              : styles.boxContentFailed
                          }>
                          {item.auditStatus == 1
                            ? strings.StatusSynced
                            : strings.StatusClosedOut}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 18,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.AuditSyncSuccess}
                  </Text>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => this.setState({statusPopUp: false})}
              style={{
                width: '100%',
                height: 40,
                marginBottom: 5,
                borderTopColor: 'lightgrey',
                borderTopWidth: 0.7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#485B9E',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Close}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Sync processing modal */}
        <Modal isVisible={this.state.syncPopUp}>
          <View
            style={{
              width: '100%',
              height: 250,
              backgroundColor: 'white',
              borderRadius: 8,
              flexDirection: 'column',
            }}>
            <View
              style={{
                width: '100%',
                height: '10%',
                marginTop: 10,
                borderBottomColor: 'lightgrey',
                borderBottomWidth: 0.7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#485B9E',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.globalSync}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: '75%',
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Bars size={20} color="#1CB8CA" />
                <Text style={{marginTop: 20, fontFamily: 'OpenSans-Regular'}}>
                  {strings.Syncing_Audits}
                </Text>
                <FlatList
                  style={{margin: 20}}
                  data={this.state.dataSource}
                  renderItem={this.renderRow}
                  keyExtractor={item => item}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: '10%',
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
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
                        <Text style={{fontFamily: 'OpenSans-Regular'}}>
                          {strings.audit}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'red',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          {items.auditid}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cardsec2Missing,
                          {
                            borderBottomColor: 'lightgrey',
                            borderBottomWidth: 0.7,
                          },
                        ]}>
                        <Text style={{fontFamily: 'OpenSans-Regular'}}>
                          {strings.type}
                        </Text>
                        {items.ChecklistName ? (
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#2EA4E2',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.online_form}
                          </Text>
                        ) : items.FormName ? (
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#070F6E',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.templaterefernceform}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#070F6E',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {strings.NC_OFI}
                          </Text>
                        )}
                      </View>
                      <View style={styles.cardsec2Missing}>
                        <Text style={{fontFamily: 'OpenSans-Regular'}}>
                          {strings.name}
                        </Text>
                        {items.ChecklistName ? (
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#070F6E',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {items.ChecklistName}
                          </Text>
                        ) : items.FormName ? (
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#070F6E',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {items.FormName}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#070F6E',
                              fontFamily: 'OpenSans-Regular',
                            }}>
                            {items.NCNumber}
                          </Text>
                        )}
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
                    syncPopUp: false,
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
                    this.syncAuditsToServerMethod();
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
        <ConfirmDialog
          title={strings.title_logout}
          message={strings.title_logout_message}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
          visible={this.state.dialogVisible_logout}
          onTouchOutside={() => this.setState({dialogVisible_logout: false})}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}

          positiveButton={{
            title: strings.yes,
            onPress: this.doLogout.bind(this),
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({dialogVisible_logout: false}),
          }}
        />
        <Dialog
          visible={this.state.errorDialogVisible}
          title={strings.LogoutFailed}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
          onTouchOutside={() => this.setState({errorDialogVisible: false})}>
          <View>
            <Text style={{height: 50, fontFamily: 'OpenSans-Regular'}}>
              {this.state.errorMsg}
            </Text>
            <Button
              onPress={() => this.setState({errorDialogVisible: false})}
              style={{width: 50, marginTop: 10}}
              title="OK"
            />
          </View>
        </Dialog>
        <ProgressDialog
          visible={this.state.progressVisible}
          title={strings.LoggingOut}
          message={strings.PleaseWait}
          titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
          messageStyle={{fontFamily: 'OpenSans-Regular'}}
        />
        <Modal
          isVisible={this.state.confirmpwd}
          onBackdropPress={() => this.setState({confirmpwd: false})}>
          <View
            style={{
              width: '100%',
              height: 350,
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 10,
            }}>
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
                    marginTop: Platform.OS === 'ios' ? 10 : null,
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
                    marginTop: Platform.OS === 'ios' ? 10 : null,
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
    notifications: state.notifications,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeAudits: audits => dispatch({type: 'STORE_AUDITS', audits}),
    changeAuditState: isAuditing =>
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeAuditRecords: auditRecords =>
      dispatch({type: 'STORE_AUDIT_RECORDS', auditRecords}),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
    storeServerUrl: serverUrl =>
       dispatch({type: 'STORE_SERVER_URL', serverUrl}),
    storeLoginSession: isActive =>
      dispatch({type: 'STORE_LOGIN_SESSION', isActive}),
    clearAudits: () => dispatch({type: 'CLEAR_AUDITS'}),
    clearNotifications: () => dispatch({type: 'CLEAR_NOTIFICATIONS'}),
    updateAuditCount: auditCount =>
      dispatch({type: 'UPDATE_AUDIT_COUNT', auditCount}),
    updateRecentAuditList: recentAudits =>
      dispatch({type: 'UPDATE_RECENT_AUDIT_LIST', recentAudits}),
    registrationState: isDeviceRegistered =>
      dispatch({type: 'STORE_DEVICE_REG_STATUS', isDeviceRegistered}),
    storeDeviceid: deviceid => dispatch({type: 'STORE_DEVICEID', deviceid}),
    clearURL: () => dispatch({type: 'CLEAR_URL'}),
   // storeSiteId: currentsiteid => dispatch({type:'STORE_SITE_ID', currentsiteid})
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuditDashboardFooter);
