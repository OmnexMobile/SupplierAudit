import {createStackNavigator, createAppContainer} from 'react-navigation';
import CameraCapture from '../Containers/CameraCapture';
import VideoCapture from '../Containers/video';
import VoiceRecognition from '../Containers/VoiceRecognition';
import Registration from '../Containers/Registration';
import UnRegister from '../Containers/UnRegister';
import LaunchScreen from '../Containers/LaunchScreen';
import LoginUIScreen from '../Containers/LoginUIScreen';
import AuditDashboard from '../Containers/AuditDashboard';
import CheckListMenu from '../Containers/CheckListMenu';
import Pending from '../Containers/Pending';
import Upcomming from '../Containers/Upcomming';
import CheckPointScreen from '../Containers/CheckPointScreen';
import AuditPage from '../Containers/AuditPage';
import AuditDashboardBody from '../Components/AuditDashboardBody';
import AuditForm from '../Containers/AuditForm';
import ConformacyText from '../Containers/ConformacyText';
import AuditResult from '../Containers/AuditResult';
import NCOFIPage from '../Containers/NCOFIPage';
import CreateNC from '../Containers/CreateNC';
import FooterButton from '../Components/Shared/FooterButton';
import Profile from '../Containers/Profile';
import Languages from '../Containers/Languages';
import AuditStatus from '../Containers/AuditStatus';
import AuditAttach from '../Containers/AuditAttach';
import CreateAttach from '../Containers/CreateAttach';
import UserPreference from '../Containers/UserPreference';
import AuditSummary from '../Containers/AuditSummary';
import FilterScreen from '../Containers/FilterScreen';
import Table from '../Containers/Table';
//Ashok
import CalandarList from './../Containers/CalandarList';
import AuditDashboardListing from '../Containers/AuditDashboardListing';
import AuditNotifications from '../Containers/AuditNotifications';
import SupplyManage from '../Containers/Supplymanage';
import AuditProDashboard from '../Containers/AuditProDashboard';
// new screen

import AllTabAuditList from '../Containers/AllTabAuditList';
import Downloads from '../Containers/Downloads';
import SyncDetails from '../Containers/SyncDetails';
import Help from '../Containers/Help';
import CheckPointDemo from '../Containers/CheckPointDemo';
import Videoplayer from '../Containers/Videoplayer';
import styles from './Styles/NavigationStyles';
import Conformacy from '../Containers/Conformacy';
import WebViewThatOpensLinksInNavigator from '../Containers/Webview';
import VersionUpdate from '../Containers/VersionUpdate';
import LPAPublish from '../Containers/LPAPublish';
import ConformacyVoice from '../Containers/ConformacyVoice';
import SwipeScreen from '../Containers/SwipeScreen';
//import LPAPublish from '../Containers/LPAPublish';

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    // AuditProDashboard: { screen : AuditProDashboard },
    ConformacyVoice:{screen:ConformacyVoice},
    CameraCapture: {screen: CameraCapture},
    VideoCapture: {screen: VideoCapture},
    VoiceRecognition: {screen: VoiceRecognition},
    Registration: {screen: Registration},
    UnRegister: {screen: UnRegister},
    AuditDashboard: {screen: AuditProDashboard},
    Table: {screen: Table},
    LaunchScreen: {screen: LaunchScreen},
    LoginUIScreen: {screen: LoginUIScreen},
    CheckListMenu: {screen: CheckListMenu},
    Pending: {screen: Pending},
    Upcomming: {screen: Upcomming},
    CheckPointScreen: {screen: CheckPointScreen},
    AuditPage: {screen: AuditPage},
    AuditDashboardBody: {screen: AuditDashboardBody},
    AuditForm: {screen: AuditForm},
    ConformacyText: {screen: ConformacyText},
    AuditResult: {screen: AuditResult},
    NCOFIPage: {screen: NCOFIPage},
    CreateNC: {screen: CreateNC},
    FooterButton: {screen: FooterButton},
    Profile: {screen: Profile},
    Languages: {screen: Languages},
    AuditStatus: {screen: AuditStatus},
    AuditAttach: {screen: AuditAttach},
    CreateAttach: {screen: CreateAttach},
    UserPreference: {screen: UserPreference},
    AuditSummary: {screen: AuditSummary},
    AllTabAuditList: {screen: AllTabAuditList},
    FilterScreen: {screen: FilterScreen},
    CalandarList: {screen: CalandarList},
    AuditDashboardListing: {screen: AuditDashboardListing},
    AuditNotifications: {screen: AuditNotifications},
    SupplyManage: {screen: SupplyManage},
    Downloads: {screen: Downloads},
    SyncDetails: {screen: SyncDetails},
    Help: {screen: Help},
    CheckPointDemo: {screen: CheckPointDemo},
    Videoplayer: {screen: Videoplayer},
    Conformacy: {screen: Conformacy},
    LPAPublish: {screen: LPAPublish},
    WebViewThatOpensLinksInNavigator: {
      screen: WebViewThatOpensLinksInNavigator,
    },
    // camera:{screen:camera},
    VersionUpdate: {screen: VersionUpdate},
    SwipeScreen: {screen:SwipeScreen}
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'Registration',
    navigationOptions: {
      headerStyle: styles.header,
    },
  },
);

export default createAppContainer(PrimaryNav);
