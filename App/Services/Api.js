import {
  API_URL,
  DP_API_URL,
  auditList,
  login,
  AuditFormCheckList,
  AuditReportDetails,
  NCOFIDETAILS,
  CheckPointRadio,
  AuditForm,
  GetAuditStats,
  AuditResult,
  NCOFIDropDown,
  AuditSaveCheckList,
  AuditFormDocumentUpload,
  AuditSaveNC_OFI,
  RegisterDevice,
  DeviceStatus,
  GetProfile,
  GetAllNCDetails,
  GetAuditStatus,
  GetAuditSave,
  GetAuditAttachment,
  AddAuditAttachment,
  DeleteAttach,
  AuditProcessList,
  GetGlobalSearch,
  GetYearAudits,
  Attachmentdownload,
  DocProPublish,
  SyncHistory,
  VoiceofNextAudit,
  GetConformnaceDetails,
} from '../Constants/ApiConstants';

export var sURL = API_URL;
export var dpURL = DP_API_URL;

export default {
  setServerUrl(serverUrl) {
    console.log('set serverUrl', serverUrl);
    sURL = serverUrl;
    var defaultDomain = dpURL
      .replace('http://', '')
      .replace('https://', '')
      .split(/[/?#]/)[0];
    var actualDomain = serverUrl
      .replace('http://', '')
      .replace('https://', '')
      .split(/[/?#]/)[0];
    dpURL = DP_API_URL.replace(defaultDomain, actualDomain);
  },

  login(email, password, fcmToken, deviceId,loginFlag, isSso, cb) {
    var formData = new FormData();
    formData.append('UserName', email);
    formData.append('Password', password);
    formData.append('RegisteredDeviceId', deviceId);
    formData.append('FCMRegistrationToken', fcmToken);
    formData.append('LoginFlag', loginFlag);

    if (isSso !== null && isSso !== undefined) {
      formData.append('fromSSO', true);
    }

    console.log('Login formdata', formData);
    console.log('sURL formdata', sURL);

    fetch(sURL + login, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  checkRegistrationStatus(deviceId, cb) {
    var formData = new FormData();
    formData.append('RegisteredDeviceId', deviceId);

    console.log('formdata', formData);
    console.log('sURL', sURL);

    fetch(sURL + DeviceStatus, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          data,
        });
      });
  },

  registerDevice(deviceId, url, type, cb) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    var formData = new FormData();
    formData.append('RegisteredDeviceId', deviceId);
    formData.append('ServerUrl', url);

    if (type == 1) {
      // Register
      formData.append('RegisteredDate', today);
      formData.append('Active', true);
      formData.append('IsDeleted', false);
      formData.append('UnRegisteredDate', today);
    } else if (type == 3) {
      // Logout
      formData.append('RegisteredDate', today);
      formData.append('Active', false);
      formData.append('IsDeleted', true);
      formData.append('UnRegisteredDate', today);
      formData.append('LogOut', 1);
    } else {
      // UnRegister
      formData.append('RegisteredDate', today);
      formData.append('Active', false);
      formData.append('IsDeleted', true);
      formData.append('UnRegisteredDate', today);
    }

    console.log('formdata', formData);

    fetch(sURL + RegisterDevice, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb(false, data);
      });
  },

  //auditlistapi(token, userId, siteId, page, size, filterId, GlobalFilter, StartDate, EndDate, SortBy, SortOrder, Default,SM, cb) {
  auditlistapi(
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
    var formData = new FormData();
    formData.append('SiteID', siteId);
    formData.append('UserID', userId);
    formData.append('Page', page.toString());
    formData.append('Size', size.toString());
    formData.append('FilterString', filterId.toString());
    formData.append('GlobalFilter', GlobalFilter ? GlobalFilter : '');
    formData.append('StartDate', StartDate);
    formData.append('EndDate', EndDate);
    formData.append('SortBy', SortBy);
    formData.append('SortOrder', SortOrder == 0 ? 'desc' : 'asc');
    formData.append('Default', Default);
    formData.append('SM', SM);

    console.log('filter formData', formData);
    console.log(token);

    fetch(sURL + auditList, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data)
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  getstatapi(token, userId, SiteId, SM, cb) {
    console.log('AuditListStatus', token);

    var formData = new FormData();
    formData.append('AuditorId', userId);
    formData.append('SiteId', SiteId);
    formData.append('SM', SM);
    console.log('formData status', formData);

    fetch(sURL + GetAuditStats, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        console.log('scedule', data);
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  auditDetailsapi(auditProps, token, cb) {
    var formData = new FormData();

    formData.append('AuditStatus', auditProps.AuditStatus);
    formData.append('ActualAudit', auditProps.ActualAudit ? '1' : '0');
    formData.append('AuditTemplateId', auditProps.AuditTemplateId);
    formData.append('AuditPeriodId', auditProps.AuditPeriodId);
    formData.append('AuditProgramId', auditProps.AuditProgramId);
    formData.append('AuditTypeId', auditProps.AuditTypeId);
    formData.append('ActualAuditId', auditProps.ActualAuditId);
    formData.append('ActualAuditOrderNo', auditProps.ActualAuditOrderNo);
    formData.append('SiteId', auditProps.SiteId);

    console.log('auditDetailsapi formData::', formData);

    fetch(sURL + AuditReportDetails, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  ncofiapi(
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
    var formData = new FormData();

    formData.append('SiteId', SiteID);
    formData.append('SortBy', strSortBy);
    formData.append('AuditId', iAuditId);
    formData.append('AuditProgId', iAudProgId);
    formData.append('AuditProgOrder', iAudProgOrder);
    formData.append('AuditTypeOrder', iAudTypeOrder);
    formData.append('AuditTypeId', iAudTypeId);
    formData.append('FunctionName', strFunction);

    console.log('NC formdata', formData);

    fetch(sURL + NCOFIDETAILS, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  checkpointradioapi(
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
    var formData = new FormData();

    // formData.append('FormId', iFormID)
    formData.append('AuditId', iAuditID);
    formData.append('AuditProgramId', iAuditProgramID);
    formData.append('AuditTypeId', iAuditTypeID);
    formData.append('AuditOrderId', iAuditOrderID);
    formData.append('ParentId', iParentId);
    formData.append('SiteId', iSiteID);
    formData.append('SM', SM);

    console.log('checkpointradioapi formData', formData);

    fetch(sURL + CheckPointRadio, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  auditFormapi(
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
    var formData = new FormData();

    formData.append('SiteId', SiteID);
    formData.append('SortBy', strSortBy);
    formData.append('AuditId', iAuditId);
    formData.append('AuditProgId', iAudProgId);
    formData.append('AuditProgOrder', iAudProgOrder);
    formData.append('AuditTypeOrder', iAudTypeOrder);
    formData.append('AuditTypeId', iAudTypeId);
    formData.append('FunctionName', strFunction);

    console.log('Audit form formadta', formData);

    fetch(sURL + AuditForm, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  checklistAPI(
    ISiteID,
    IFormID,
    IAuditID,
    IAuditProgramID,
    IAuditTypeID,
    IAuditOrderID,
    token,
    cb,
  ) {
    var formData = new FormData();
    /* var formId = parseInt(IFormID)
    if(IFormID == 0)
    {
      formId = -1
    } */

    formData.append('SiteId', ISiteID);
    // formData.append('FormId', formId)
    formData.append('AuditId', IAuditID);
    formData.append('AuditProgramId', IAuditProgramID);
    formData.append('AuditTypeId', IAuditTypeID);
    formData.append('AuditTypeOrderId', IAuditOrderID);

    console.log('checklistAPI formData', formData);

    fetch(sURL + AuditFormCheckList, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data)
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  auditResultapi(
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
    var formData = new FormData();

    formData.append('SiteID', SiteID);
    formData.append('SortBy', strSortBy);
    formData.append('AuditId', iAuditId);
    formData.append('AuditProgId', iAudProgId);
    formData.append('AuditProgOrder', iAudProgOrder);
    formData.append('AuditTypeOrder', iAudTypeOrder);
    formData.append('AuditTypeId', iAudTypeId);
    formData.append('FunctionName', strFunction);

    fetch(sURL + AuditResult, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data)
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  auditProcessListapi(
    SiteID,
    UserId,
    SearchCondition,
    token,
    iAuditId,
    iAudProgId,
    cb,
  ) {
    var formData = new FormData();

    formData.append('SiteId', SiteID);
    formData.append('UserId', UserId);
    formData.append('SearchCondition', SearchCondition);
    formData.append('AuditId', iAuditId);
    formData.append('AuditProgramId', iAudProgId);

    console.log('Audit Process formData', formData);

    fetch(sURL + AuditProcessList, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data)
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  ncofidropdownapi(
    AuditId,
    AuditProgramId,
    SiteId,
    AuditOrderId,
    ActualAuditId,
    token,
    userId,
    cb,
  ) {
    var formData = new FormData();

    formData.append('AuditId', AuditId);
    formData.append('AuditProgramId', AuditProgramId);
    formData.append('SiteId', SiteId);
    formData.append('AuditOrderId', AuditOrderId);
    formData.append('ActualAuditId', ActualAuditId);

    //formData.append('UserId', userId)
    console.log('nc ofi drop down:', formData);

    fetch(sURL + NCOFIDropDown, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  syncAuditsToServer(audits, token, cb) {
    var postBody = JSON.stringify({
      AuditSaveCheckList: audits,
    });
    console.log('postBody', postBody);
    console.log('token', token);

    fetch(sURL + AuditSaveCheckList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: JSON.stringify({
        AuditSaveCheckList: audits,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  syncAuditFormsToServer(audits, token, cb) {
    var documentListdataArr = [
      {
        DocumentListdata: audits,
      },
    ];

    console.log('auditform postBody', documentListdataArr);
    // console.log('token', token)

    fetch(sURL + AuditFormDocumentUpload, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: JSON.stringify({
        AuditFormDocumentUploadDetails: documentListdataArr,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data)
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  syncNCOFIToServer(audits, token, cb) {
    console.log('postBody1', audits);
    console.log(
      'nc-ofi sync:' +
        JSON.stringify({
          AuditSaveNCOFI: audits,
        }),
    );
    // console.log('token', token)
    fetch(sURL + AuditSaveNC_OFI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: JSON.stringify({
        AuditSaveNCOFI: audits,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        console.log('nc_ofi sync data:' + data);
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
    console.log('postBody2');
  },

  getProfileDetails(token, cb) {
    fetch(sURL + GetProfile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + token,
      },
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data)
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  getAllNCDetails(CorrectiveId, CorrectiveOrder, token, cb) {
    var formData = new FormData();

    formData.append('CorrectiveId', CorrectiveId);
    formData.append('CorrectiveOrder', CorrectiveOrder);

    console.log('Item opened formadata', formData);

    fetch(sURL + GetAllNCDetails, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  getAuditStatusApi(param, token, cb) {
    var formData = new FormData();

    formData.append('AuditId', param[0].AuditId);
    formData.append('AuditProgramId', param[0].AuditProgramId);
    formData.append('AuditProgramOrder', param[0].AuditProgramOrder);
    formData.append('AuditTypeOrder', param[0].AuditTypeOrder);
    formData.append('AuditTypeId', param[0].AuditTypeId);
    formData.append('AuditOrder', param[0].AuditOrder);
    formData.append('SiteId', param[0].SiteId);

    console.log('formdata', formData);
    console.log('token', token);

    fetch(sURL + GetAuditStatus, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  getSaveAuditStatusapi(param, token, cb) {
    var formData = new FormData();

    formData.append('AuditStatus', param[0].AuditStatus);
    formData.append('AuditResult', param[0].AuditResult);
    formData.append('AuditCompletionDate', param[0].AuditCompletionDate);
    formData.append('ReUploadTime', param[0].ReUploadTime);
    formData.append('AuditID', param[0].AuditID);
    formData.append('AuditOrder', param[0].AuditOrder);
    formData.append('ChangedBy', param[0].ChangedBy);
    formData.append('Comments', param[0].Comments);
    formData.append('ActualStartDate', param[0].ActualStartDate);
    formData.append('ActualEndDate', param[0].ActualEndDate);
    formData.append('RouteID', param[0].RouteID);
    formData.append('AddDays', param[0].AddDays);

    console.log('formdata', formData);
    console.log('token', token);

    fetch(sURL + GetAuditSave, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  getStatusHistorypi(param, token, cb) {
    var formData = new FormData();

    formData.append('SiteId', param[0].SiteId);
    formData.append('EvidenceId', param[0].Request);

    console.log('formdata', formData);
    console.log('token', token);

    fetch(sURL + GetAuditAttachment, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  getSaveStatusHistorypi(param, token, cb) {
    var formData = new FormData();

    formData.append('ObjectiveEvidence', param[0].Filename);
    formData.append('ObjectiveEvidenceId', param[0].Request);
    formData.append('RefPath', param[0].RefPath);
    formData.append('Comments', param[0].Comments);
    formData.append('UploadedBy', param[0].UploadedBy);
    formData.append('UploadedOn', param[0].UploadedOn);
    formData.append('VersionNo', param[0].VersionNo);
    formData.append('AttachmentType', param[0].AttachmentType);
    // formData.append('File', param[0].File)
    // formData.append('Filename', param[0].Filename)
    formData.append('Id', param[0].Id);

    console.log('formdata', formData);
    console.log('token', token);

    fetch(sURL + AddAuditAttachment, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  deleteAuditAttachapi(Id, token, cb) {
    var formData = new FormData();

    formData.append('Id', Id);

    console.log('formdata', formData);
    console.log('token', token);

    fetch(sURL + DeleteAttach, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  getGlobalSearchapi(Params, token, cb) {
    var formData = new FormData();

    formData.append('SiteID', Params[0].SiteID);
    formData.append('UserID', Params[0].UserID);
    formData.append('Page', Params[0].Page);
    formData.append('Size', Params[0].Size);
    formData.append('FilterString', Params[0].FilterString);
    formData.append('GlobalFilter', Params[0].GlobalFilter);
    formData.append('StartDate', Params[0].StartDate);
    formData.append('EndDate', Params[0].EndDate);

    console.log('formdata', formData);
    console.log('token', token);

    fetch(sURL + GetGlobalSearch, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  getYearAuditsapi(siteid, userid, token, cb) {
    var formData = new FormData();

    formData.append('siteId', siteid);
    formData.append('userId', userid);

    fetch(sURL + GetYearAudits, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  getDownloadFile(DocumentId, token, cb) {
    var formData = new FormData();

    formData.append('DocumentId', DocumentId);

    fetch(sURL + Attachmentdownload, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  docProAttachment(docProObj, token, cb) {
    // var filterMissingfile = []
    console.log('DocPro formdata object', docProObj);
    console.log('token', token);

    // filterMissingfile = docProObj
    // var finaldocProObj = []

    console.log('filterMissingfile', docProObj);

    // for(var i=0 ; i<docProObj.length ; i++){
    //   console.log('Loop',i)
    //   if(docProObj[i].filecontent != ''){
    //     finaldocProObj.push(docProObj[i])
    //   }
    // }

    // console.log('Final docpro object',finaldocProObj)

    // console.log('dpURL dpURL',dpURL+DocProPublish)
    console.log('sURL sURL', sURL);
    var doc_Url = sURL.split('/');
    var change = doc_Url[3];
    var dpapi = sURL.replace(change, 'DPAPI');
    console.log('=====>', dpapi);

    fetch(dpapi + DocProPublish, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: JSON.stringify({
        lstPublishDocumentListModel: docProObj,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },

  checkDocProPublishapi(AuditIdOrder, CheckPointTemplateId, FormID, token, cb) {
    var formData = new FormData();

    formData.append('AuditIdOrder', AuditIdOrder);
    formData.append('CheckPointTemplateId', CheckPointTemplateId);
    formData.append('FormID', FormID);
    console.log('Publish formdata', formData);

    fetch(sURL + 'DocProStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  getCheckUserapi(UserId, token, cb) {
    var formData = new FormData();
    formData.append('UserId', UserId);

    fetch(sURL + 'CredentialCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  checkADApi(cb) {
    // 1.22.172.237/EwQIMS/common/ActiveDirectory/ADCheck.aspx?CheckADInstance=1
    // 1.22.172.237/AuditPro/api/

    var activeURL = sURL;
    var filterURL1 = activeURL.replace('AuditPro', 'EwQIMS');
    var filterURL2 = filterURL1.replace('api', 'common');
    var ADdomain = 'ActiveDirectory/ADCheck.aspx?CheckADInstance=1';

    var response = undefined;

    console.log(filterURL2 + ADdomain);

    fetch(filterURL2 + ADdomain, {
      method: 'POST',
    })
      .then(resp => {
        resp.json().then(res => {
          cb(res);
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  getAuditNotification(auditCount, token, userId, siteId, cb) {
    var formData = new FormData();
    formData.append('AuditCount', auditCount);
    formData.append('siteId', siteId);
    formData.append('userId', userId);

    fetch(sURL + 'AuditNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
  getSyncHistory(UserId, token, cb) {
    var formData = new FormData();
    formData.append('UserId', UserId);

    fetch(sURL + SyncHistory, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          status: data,
        });
      });
  },
  getMynextAudit(SiteID, UserID, token, cb) {
    var formData = new FormData();
    formData.append('SiteId', SiteID);
    formData.append('UserId', UserID);

    fetch(sURL + VoiceofNextAudit, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          data,
        });
      });
  },

  Confermacy(auditid, auditordere, token,userID, cb) {
    console.log('AuditListStatus', token);

    var formData = new FormData();
    formData.append('AuditId', auditid);
    formData.append('AuditOrder', auditordere);
    formData.append('userid', userID);
    console.log('formData status', formData);

    console.log('formData userIIDDDD-------', userID);
    fetch(sURL + GetConformnaceDetails, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer' + ' ' + token,
      },
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        console.log('Venkatttttt', data);
        cb({
          data,
        });
      })
      .catch(data => {
        cb({
          //status: cons.ERROR_500
          status: data,
        });
      });
  },
};
