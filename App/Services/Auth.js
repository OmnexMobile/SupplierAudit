import api from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
 async setServerUrl(serverUrl) {
    api.setServerUrl(serverUrl);
     AsyncStorage.setItem(
      'storedserverrul',
      serverUrl,
    );
  },

  loginUser(email, password, fcmToken, deviceId,loginFlag, isSSo, cb,) {
    console.log(email, password, fcmToken, deviceId, isSSo, 'helloconsole');
    api.login(email, password, fcmToken, deviceId, loginFlag,isSSo, res => {
      cb(true, res);
    });
  },
  AppStatus(Appstate, deviceId, cb) {
    api.appstatus(Appstate, deviceId, res => {
      cb(true, res);
    });
  },
  // checkRegistrationStatus(deviceId, cb) {
  //   api.checkRegistrationStatus(deviceId, res => {
  //     console.log('checkRegistrationStatus res', res);
  //     cb(true, res);
  //   });
  // },
  checkRegistrationStatus(deviceId, cb) {
    api.checkRegistrationStatus(deviceId, res => {
      console.log('checkRegistrationStatus response++++', res);
      console.log("ncofi/button",res.data.Data.NCOFISetting)
      AsyncStorage.setItem(
        'NCSettingValue',
        JSON.stringify(res.data.Data.NCOFISetting)
      );
      cb(true, res);
    });
  },

  registerDevice(deviceId, url, type, cb) {
    api.registerDevice(deviceId, url, type, res => {
      if (!res) {
        cb(false, res);
      } else {
        cb(true, res);
      }
    });
  },

  /*
  getauditlist(token, userId, siteId, page, size, filterId,GlobalFilter,StartDate,EndDate,SortBy,SortOrder,Default,SM, cb){
    api.auditlistapi(token, userId, siteId, page, size, filterId,GlobalFilter,StartDate,EndDate,SortBy,SortOrder,Default,SM, res => {
      cb(true, res);
    })
  },
*/

  getauditlist(
    token,
    userId,
    siteId,
    page,
    size,
    filterId,
    GlobalFilter,
    StartDate,
    EndDate,
    SortBy,
    SortOrder,
    SM,
    Default,
    cb,
  ) {
    api.auditlistapi(
      token,
      userId,
      siteId,
      page,
      size,
      filterId,
      GlobalFilter,
      StartDate,
      EndDate,
      SortBy,
      SortOrder,
      SM,
      Default,
      res => {
        cb(true, res);
      },
    );
  },
  getStat(token, userId, SiteId, SM, cb) {
    api.getstatapi(token, userId, SiteId, SM, res => {
      cb(true, res);
    });
  },

  getChecklist(
    ISiteID,
    IFormID,
    IAuditID,
    IAuditProgramID,
    IAuditTypeID,
    IAuditOrderID,
    TOKEN,
    cb,
  ) {
    api.checklistAPI(
      ISiteID,
      IFormID,
      IAuditID,
      IAuditProgramID,
      IAuditTypeID,
      IAuditOrderID,
      TOKEN,
      res => {
        cb(true, res);
      },
    );
  },

  getAuditReportDetails(auditProps, token, cb) {
    api.auditDetailsapi(auditProps, token, res => {
      cb(true, res);
    });
  },

  getNCdetails(
    SiteID,
    strSortBy,
    iAuditId,
    iAudProgId,
    iAudProgOrder,
    iAudTypeOrder,
    iAudTypeId,
    strFunction,
    token,
    cb,
  ) {
    api.ncofiapi(
      SiteID,
      strSortBy,
      iAuditId,
      iAudProgId,
      iAudProgOrder,
      iAudTypeOrder,
      iAudTypeId,
      strFunction,
      token,
      res => {
        cb(true, res);
      },
    );
  },

  getCheckRadio(
    iFormID,
    iAuditID,
    iAuditProgramID,
    iAuditTypeID,
    iAuditOrderID,
    iParentId,
    iSiteID,
    SM,
    token,
    cb,
  ) {
    api.checkpointradioapi(
      iFormID,
      iAuditID,
      iAuditProgramID,
      iAuditTypeID,
      iAuditOrderID,
      iParentId,
      iSiteID,
      SM,
      token,
      res => {
        cb(true, res);
      },
    );
  },

  getAuditForm(
    SiteID,
    strSortBy,
    iAuditId,
    iAudProgId,
    iAudProgOrder,
    iAudTypeOrder,
    iAudTypeId,
    strFunction,
    token,
    cb,
  ) {
    api.auditFormapi(
      SiteID,
      strSortBy,
      iAuditId,
      iAudProgId,
      iAudProgOrder,
      iAudTypeOrder,
      iAudTypeId,
      strFunction,
      token,
      res => {
        cb(true, res);
      },
    );
  },

  getauditResult(
    SiteID,
    strSortBy,
    iAuditId,
    iAudProgId,
    iAudProgOrder,
    iAudTypeOrder,
    iAudTypeId,
    strFunction,
    token,
    cb,
  ) {
    api.auditResultapi(
      SiteID,
      strSortBy,
      iAuditId,
      iAudProgId,
      iAudProgOrder,
      iAudTypeOrder,
      iAudTypeId,
      strFunction,
      token,
      res => {
        cb(true, res);
      },
    );
  },

  getAuditProcessList(
    SiteID,
    UserId,
    SearchCondition,
    token,
    iAuditId,
    iAudProgId,
    cb,
  ) {
    api.auditProcessListapi(
      SiteID,
      UserId,
      SearchCondition,
      token,
      iAuditId,
      iAudProgId,
      res => {
        cb(true, res);
      },
    );
  },

  getncofiDropdown(
    AuditId,
    AuditProgramId,
    SiteId,
    AuditOrderId,
    ActualAuditId,
    token,
    userId,
    cb,
  ) {
    api.ncofidropdownapi(
      AuditId,
      AuditProgramId,
      SiteId,
      AuditOrderId,
      ActualAuditId,
      token,
      userId,
      res => {
        cb(true, res);
      },
    );
  },

  syncAuditsToServer(audits, token, cb) {
    api.syncAuditsToServer(audits, token, res => {
      cb(true, res);
    });
  },

  syncNCOFIToServer(audits, token, cb) {
    api.syncNCOFIToServer(audits, token, res => {
      cb(true, res);
    });
  },

  syncAuditFormsToServer(audits, token, cb) {
    api.syncAuditFormsToServer(audits, token, res => {
      cb(true, res);
    });
  },

  getProfile(token, cb) {
    api.getProfileDetails(token, res => {
      cb(true, res);
    });
  },

  getAllNCDetails(CorrectiveId, CorrectiveOrder, token, cb) {
    api.getAllNCDetails(CorrectiveId, CorrectiveOrder, token, res => {
      cb(true, res);
    });
  },

  getAuditStatus(param, token, cb) {
    api.getAuditStatusApi(param, token, res => {
      cb(true, res);
    });
  },
  getAuditSaveStatus(param, token, cb) {
    api.getSaveAuditStatusapi(param, token, res => {
      cb(true, res);
    });
  },
  getStatusHistory(param, token, cb) {
    api.getStatusHistorypi(param, token, res => {
      cb(true, res);
    });
  },
  getSaveStatusHistory(param, token, cb) {
    api.getSaveStatusHistorypi(param, token, res => {
      cb(true, res);
    });
  },
  deleteAttach(Id, token, cb) {
    api.deleteAuditAttachapi(Id, token, res => {
      cb(true, res);
    });
  },
  getGlobalSearch(Params, TOKEN, cb) {
    api.getGlobalSearchapi(Params, TOKEN, res => {
      cb(true, res);
    });
  },
  getYearAudit(siteid, userid, token, cb) {
    api.getYearAuditsapi(siteid, userid, token, res => {
      cb(true, res);
    });
  },
  downloadFile(DocumentId, token, cb) {
    api.getDownloadFile(DocumentId, token, res => {
      cb(true, res);
    });
  },
  getdocProAttachment(docProObj, token, cb) {
    api.docProAttachment(docProObj, token, res => {
      cb(true, res);
    });
  },
  getcheckDocProPublish(AuditIdOrder, CheckPointTemplateId, FormID, token, cb) {
    api.checkDocProPublishapi(
      AuditIdOrder,
      CheckPointTemplateId,
      FormID,
      token,
      res => {
        cb(true, res);
      },
    );
  },
  getCheckUser(UserId,RegisterDevice,token, cb) {
    api.getCheckUserapi(UserId,RegisterDevice,token, res => {
      console.log(UserId,token,RegisterDevice,"op/////")
      console.log(RegisterDevice,"op/r")

      cb(true, res);
    });
  },
  getActiveDirectory(cb) {
    api.checkADApi(res => {
      cb(true, res);
    });
  },
  getAuditNotification(auditCount, token, userId, siteId, cb) {
    api.getAuditNotification(auditCount, token, userId, siteId, res => {
      cb(true, res);
    });
  },
  getSyncHistory(UserId, token, cb) {
    api.getSyncHistory(UserId, token, res => {
      cb(true, res);
    });
  },
  getMynextAudit(siteId, UserId, token, cb) {
    api.getMynextAudit(siteId, UserId, token, res => {
      cb(true, res);
    });
  },
  Confermacy(auditid, auditordere, token,userID, cb) {
    api.Confermacy(auditid, auditordere, token,userID, res => {
      cb(true, res);
    });
  },
};
