import immutablePersistenceTransform from "../Services/ImmutablePersistenceTransform";
import FSStorage, { CacheDir } from "redux-persist-fs-storage";

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: "1.0",
  storeConfig: {
    key: "root",
    keyPrefix: "",
    // storage: FSStorage(),
    storage: FSStorage(CacheDir, "AuditUser"),
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: ['login', 'search', 'nav'],
    whitelist: [
      "auditRecords",
      "audits",
      "ncofiRecords",
      "cameraCapture",
      "recentAudits",
      "serverUrl",
      "userId",
      "userName",
      "language",
      "token",
      "siteId",
      "address",
      "companyname",
      "companyurl",
      "logo",
      "phone",
      "isConnected",
      "isAuditing",
      "isDeviceRegistered",
      "isOfflineMode",
      "completedAudits",
      "scheduledAudits",
      "processingAudits",
      "userDateFormat",
      "isActive",
      "yearAudits",
      "loginuser",
      "smdata",
      "logindata",
    ],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    // whitelist: [],
    transforms: [immutablePersistenceTransform],
  },
};

export default REDUX_PERSIST;
