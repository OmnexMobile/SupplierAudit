import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  storeAudits: ['audits'],
  storeAuditRecords: ['auditRecords'],
  storeNcofiRecords: ['ncofiRecords'],
  updateRecentAuditList: ['recentAudits'],
  storeCameraCapture: ['cameraCapture'],
  storeUserSession: ['userSession'],
  storeLanguage: ['userLanguage'],
  storeServerUrl: ['setServerUrl'],
  storeAgendaUrl: ['setAgendaUrl'],
  storeDeviceRegStatus: ['registrationState'],
  changeConnectionState: ['connectionState'],
  changeAuditState: ['auditState'],
  changeOfflineModeState: ['isOfflineMode'],
  storeAuditStats: ['auditStats'],
  storeDateFormat: ['userDateFormat'],
  storeYearAudits: ['yearAudits'],
  storeLoginSession: ['isActive'],
  clearAudits: null,
  clearURL: null,
  storeUserName: ['loginuser'],
  storeLoginData: ['logindata'],
  storeSupplierData: ['smdata'],
  storeSiteId: ['siteId'],
  storeSupplierManagement: ['suppliermanagementstatus'],
  storeDeviceid: ['deviceid'],
  storeConformance: ['conformance'],
  saveNavigationParams:['params'],
  updateNCDetails:['ncDetails'],
  saveCreateNCdata:["createNCdata"]
});
// actions.js



export const TemperatureTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  auditRecords: [],
  audits: [],
  ncofiRecords: [],
  cameraCapture: [],
  recentAudits: [],
  serverUrl: '',
  agendaUrl: '',
  //currentsiteid:'',
  userId: null,
  userName: null,
  language: null,
  token: null,
  siteId: null,
  address: null,
  companyname: null,
  companyurl: null,
  logo: null,
  phone: null,
  isConnected: true,
  isAuditing: false,
  isDeviceRegistered: false,
  isOfflineMode: false,
  completedAudits: 0,
  scheduledAudits: 0,
  processingAudits: 0,
  userDateFormat: 'MM/DD/YYYY',
  isActive: null,
  yearAudits: [],
  loginuser: null,
  smdata: 1,
  logindata: null,
  //deviceregisterdetails:'',
  deviceid: '',
  conformance : {},
  saveNavigationParams:{},
  updateNCDetails:{}
});

/* ------------- Reducers ------------- */


export const storeAudits = (state, {audits}) => {
  // console.log('reducer storeAudits',audits)
  return state.merge({audits: audits});
};

export const storeAuditRecords = (state, {auditRecords}) => {
  // console.log('reducer storeAuditRecords',auditRecords)
  return state.merge({auditRecords: auditRecords});
};

export const storeNcofiRecords = (state, {ncofiRecords}) => {
  console.log('reducer storeNCOFIRecords', ncofiRecords);
  return state.merge({ncofiRecords: ncofiRecords});
};

export const updateRecentAuditList = (state, {recentAudits}) => {
  // console.log('reducer updateRecentAuditList',recentAudits)
  return state.merge({recentAudits: recentAudits});
};

export const storeCameraCapture = (state, {cameraCapture}) => {
  // console.log('reducer storeCameraCapture',cameraCapture)
  return state.merge({cameraCapture: cameraCapture});
};

export const storeConformance = (state, {conformance}) => {
  // console.log('reducer storeCameraCapture',cameraCapture)
  return state.merge({conformance: conformance});
};


export const storeDateFormat = (state, {userDateFormat}) => {
  return state.merge({userDateFormat: userDateFormat});
};

export const storeYearAudits = (state, {yearAudits}) => {
  return state.merge({yearAudits: yearAudits});
};

export const storeLoginSession = (state, {isActive}) => {
  return state.merge({isActive: isActive});
};

export const storeUserSession = (
  state,
  {
    userName,
    userId,
    token,
    siteId,
    address,
    companyname,
    companyurl,
    logo,
    phone,
  },
) => {
  return state.merge({
    userName: userName,
    userId: userId,
    token: token,
    siteId: siteId,
    address: address,
    companyname: companyname,
    companyurl: companyurl,
    logo: logo,
    phone: phone,
  });
};

export const storeLanguage = (state, {language}) => {
  return state.merge({language: language});
};

export const storeServerUrl = (state, {serverUrl}) => {
  console.log('SERVER___URL', serverUrl);
  return state.merge({serverUrl: serverUrl});
};

export const storeAgendaUrl = (state, {agendaUrl}) => {
  console.log('agenda url', agendaUrl);
  return state.merge({agendaUrl: agendaUrl});
};

export const storeDeviceRegStatus = (state, {isDeviceRegistered}) => {
  console.log('Device registered status:' + isDeviceRegistered);
  return state.merge({isDeviceRegistered: isDeviceRegistered});
};

export const changeConnectionState = (state, {isConnected}) => {
  // console.log('reducer changeConnectionState', isConnected)
  return state.merge({isConnected: isConnected});
};

export const changeAuditState = (state, {isAuditing}) => {
  // console.log('reducer changeAuditState', isAuditing)
  return state.merge({isAuditing: isAuditing});
};

export const changeOfflineModeState = (state, {isOfflineMode}) => {
  // console.log('reducer changeOfflineModeState', isOfflineMode)
  return state.merge({isOfflineMode: isOfflineMode});
};

export const storeAuditStats = (
  state,
  {scheduled, completed, DeadlineViolated, CompletedDeadlineViolated},
) => {
  // console.log('reducer storeAuditStats', completed, processing, scheduled)
  return state.merge({
    completedAudits: completed,
    scheduledAudits: scheduled,
    DeadlineViolatedAudits: DeadlineViolated,
    CompletedDeadlineViolatedAudits: CompletedDeadlineViolated,
  });
};

export const storeUserName = (state, {loginuser}) => {
  console.log('reducer changeOfflineModeState', loginuser);
  return state.merge({loginuser: loginuser});
};

export const storeSupplierData = (state, {smdata}) => {
  console.log('storing sm data..', smdata);
  return state.merge({smdata: smdata});
};

export const clearAudits = state => INITIAL_STATE;

export const clearURL = state =>INITIAL_STATE;

export const storeLoginData = (state, {logindata}) => {
  console.log('login user data in redux:', logindata);
  return state.merge({logindata: logindata});
};

export const storeSiteId = (state, {siteId}) => {
  console.log('current site id in redux:', siteId);
  return state.merge({siteId: siteId});
};

export const storeSupplierManagement = (state, {suppliermanagementstatus}) => {
  return state.merge({suppliermanagementstatus: suppliermanagementstatus});
};

export const storeDeviceid = (state, {deviceid}) => {
  return state.merge({deviceid: deviceid});
};

export const saveNavigationParams = (state, {params}) => {
  return state.merge({params: params});
};
export const updateNCDetails = (state, {ncDetails}) => {
  return state.merge({ncDetails: ncDetails});
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STORE_AUDITS]: storeAudits,
  [Types.STORE_AUDIT_RECORDS]: storeAuditRecords,
  [Types.STORE_NCOFI_RECORDS]: storeNcofiRecords,
  [Types.UPDATE_RECENT_AUDIT_LIST]: updateRecentAuditList,
  [Types.STORE_CAMERA_CAPTURE]: storeCameraCapture,
  [Types.STORE_USER_SESSION]: storeUserSession,
  [Types.STORE_LANGUAGE]: storeLanguage,
  [Types.STORE_SERVER_URL]: storeServerUrl,
  [Types.STORE_AGENDA_URL]: storeAgendaUrl,
  [Types.STORE_DEVICE_REG_STATUS]: storeDeviceRegStatus,
  [Types.CHANGE_CONNECTION_STATE]: changeConnectionState,
  [Types.CHANGE_OFFLINE_MODE_STATE]: changeOfflineModeState,
  [Types.CHANGE_AUDIT_STATE]: changeAuditState,
  [Types.STORE_AUDIT_STATS]: storeAuditStats,
  [Types.STORE_DATE_FORMAT]: storeDateFormat,
  [Types.STORE_YEAR_AUDITS]: storeYearAudits,
  [Types.STORE_LOGIN_SESSION]: storeLoginSession,
  [Types.CLEAR_AUDITS]: clearAudits,
  [Types.CLEAR_URL] : clearURL,
  [Types.STORE_USER_NAME]: storeUserName,
  [Types.STORE_LOGIN_DATA]: storeLoginData,
  [Types.STORE_SUPPLIER_DATA]: storeSupplierData,
  [Types.STORE_SITE_ID]: storeSiteId,
  [Types.STORE_DEVICEID]: storeDeviceid,
  [Types.STORE_SUPPLIER_MANAGEMENT]: storeSupplierManagement,
  [Types.STORE_CONFORMANCE] : storeConformance,
  [Types.UPDATE_NC_DETAILS]: updateNCDetails,
  [Types.SAVE_NAVIGATION_PARAMS]: saveNavigationParams,
});
