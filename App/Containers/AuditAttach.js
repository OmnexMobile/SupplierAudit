import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {Dialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import {Images} from '../Themes';
import styles from './Styles/AuditAttachStyle';
import {width} from 'react-native-dimension';
import Moment from 'moment';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Pulse} from 'react-native-loader';
import auth from '../Services/Auth';
import OfflineNotice from '../Components/OfflineNotice';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';

let Window = Dimensions.get('window');

class AuditAttach extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible : false,
      pageLoad: true,
      ChineseScript: false,
      History: [],
      AuditID: '',
      NetInfo: false,
      breadCrumbText: '',
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
    };
  }

  componentDidMount() {
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
    this.setState(
      {
        breadCrumbText: this.props.navigation.state.params.breadCrumb,
        AuditID: this.props.navigation.state.params.AuditID,
      },
      () => {
        console.log('Bobby', this.props.navigation.state.params);
        if (this.props.navigation.state.params.isDeleted == 1) {
          this.refs.toast.show(strings.AttachDelSuccess, DURATION.LENGTH_SHORT);
          this.getHistory();
        } else if (this.props.navigation.state.params.isDeleted == 2) {
          this.refs.toast.show(strings.AttachUpload, DURATION.LENGTH_SHORT);
          this.getHistory();
        } else {
          console.log('No toast');
          this.getHistory();
        }
      },
    );
  }

  componentWillReceiveProps() {
    var getCurrentPage = [];
    getCurrentPage = this.props.data.nav.routes;
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName;
    console.log('--CurrentPage--->', CurrentPage);

    if (CurrentPage == 'AuditAttach') {
      this.getHistory();
    }
  }

  Refresh() {
    console.log('Refresh pressed');
    this.getHistory();
  }

  getHistory() {
    if (this.props.data.audits.isOfflineMode) {
      this.setState({pageLoad: false, NetInfo: true}, () => {
        console.log('Page load is off');
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_SHORT);
      });
    } else {
      NetInfo.fetch().then(isConnected => {
        if (isConnected.isConnected) {
          var auditRecords = this.props.data.audits.auditRecords;
          var Token = this.props.data.audits.token;
          var SiteId = this.props.data.audits.siteId;
          var ObjectiveEvidence = this.props.data.audits;
          console.log('objEvi==>', this.props.data.audits, ObjectiveEvidence);
          var RequestParam = [];

          var auditRecords = this.props.data.audits.auditRecords;
          for (var i = 0; i < auditRecords.length; i++) {
            if (this.state.AuditID === auditRecords?.[i]?.AuditId) {
              console.log(
                'hello',
                auditRecords?.[i]?.AuditId,
                this.state.AuditID,
              );
              RequestParam.push({
                AuditId: auditRecords?.[i]?.AuditId,
                AuditProgramId: auditRecords?.[i]?.AuditProgramId,
                AuditProgramOrder: auditRecords?.[i]?.AuditProgOrder,
                AuditTypeOrder: auditRecords?.[i]?.AuditTypeOrder,
                AuditTypeId: auditRecords?.[i]?.AuditTypeId,
                AuditOrder: auditRecords?.[i]?.AuditOrderId,
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
          param.push({
            Request: Request,
            SiteId: SiteId,
          });
          console.log('Param-->', param);

          auth.getStatusHistory(param, Token, (res, data) => {
            console.log('response', data, param, Token);
            if (data.data) {
              if (data.data.Message === 'Success') {
                var HistoryArr = data.data.Data;
                var HistoryForm = [];
                for (var i = 0; i < HistoryArr.length; i++) {
                  HistoryForm.push({
                    Type: HistoryArr?.[i]?.AttachmentType,
                    UncontrolledLink:
                      HistoryArr?.[i]?.RefPath === null
                        ? '-'
                        : HistoryArr?.[i]?.RefPath,
                    FileName:
                      HistoryArr?.[i]?.ObjectiveEvidence === null
                        ? ''
                        : HistoryArr?.[i]?.ObjectiveEvidence,
                    Comments: HistoryArr?.[i]?.Comments,
                    key: HistoryArr?.[i]?.Id,
                    filedata: HistoryArr?.[i]?.File,
                    fileName: HistoryArr?.[i]?.FileName,
                    UploadedBy: HistoryArr?.[i]?.UploadedBy,
                    Uploadedon: HistoryArr?.[i]?.UploadedOn,
                  });
                }
                this.setState(
                  {History: HistoryForm, pageLoad: false, NetInfo: false},
                  () => {
                    console.log('demo data', this.state.History);
                  },
                );
              } else {
                this.setState({pageLoad: false}, () => {
                  this.refs.toast.show(strings.ErrFetch, DURATION.LENGTH_SHORT);
                });
              }
            } else {
              this.setState({pageLoad: false}, () => {
                this.refs.toast.show(strings.ErrFetch, DURATION.LENGTH_SHORT);
              });
            }
          });
        } else {
          this.setState({pageLoad: false, NetInfo: true}, () => {
            console.log('Page load is off');
            this.refs.toast.show(strings.NoInternet, DURATION.LENGTH_SHORT);
          });
        }
      });
    }
  }

  onPress(item) {
    console.log('Pressed', item);

    this.props.navigation.navigate('CreateAttach', {
      AuditID: this.state.AuditID,
      Type: 'Edit',
      EditDetails: item,
      breadCrumb: this.state.breadCrumbText,
    });
  }

  changeDateFormat = inDate => {
    console.log('--->', this.state.selectedFormat);
    var DefaultFormatL = this.state.selectedFormat;// + ' ' + 'HH:mm';
    var sDateArr = inDate.split('T');
    var sDateValArr = sDateArr[0].split('-');
    var sTimeValArr = sDateArr[1].split(':');
    var outDate = new Date(
      sDateValArr[0],
      sDateValArr[1] - 1,
      sDateValArr[2],
      sTimeValArr[0],
      sTimeValArr[1],
    );
    return Moment(outDate).format(DefaultFormatL);
  };

  addOfflineMode() {
    console.log('offline');
    this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_SHORT);
  }


  initiateDownload(docid){ 

    
    var Token = this.props.data.audits.token;
    auth.downloadFile(docid, Token, (res, data) => {
      console.log('getFiles File download response', data.data.Data.DocId);
      if (data.data.Data.DocId === null ){
        Alert.alert('File is not synced with server yet, please try after sometime.');
      }
     else if(data.data.Message == 'Success') {
        // this.setState({
        //   isVisible : false
        // })
          this.WriteAttachments(data.data.Data);    
      } else  {
        this.refs.toast.show(strings.server_error, DURATION.LENGTH_LONG);
      }
    });    
  }

  async WriteAttachments(data) {  
   
    let newFilePath =
        '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles'); 

    var newfileName = 'file_' + data.DocId + '.' + data.FileName.substring(data.FileName.lastIndexOf('.') + 1);
    newFilePath = newFilePath + '/' + newfileName;

    await  RNFetchBlob.fs.exists(newFilePath).then(exist => {
      if (!exist || exist == '') {
          RNFetchBlob.fs
          .writeFile(newFilePath,data.FileData,'base64',)
        .then(res => {
          console.log('Attachment:File Written', res);          
          this.openFile(newFilePath);          
        })
        .catch(err => {
          console.log('Attachment:Err:' + err);                
        });
      }
      else {        
        this.setState({
         // isVisible : false
        }, () => {
          setTimeout( () => {
          this.openFile(newFilePath);
          },1000);
        })
      }
    });   
  }

  openFile = async filePath => {
    var extension = filePath;
    const parts = extension.split('.');
    const fileType = parts[parts.length - 1];
    console.log('File pathchecking-------: ', filePath);
    console.log('File extension: ', fileType, filePath);

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        FileViewer.open(filePath, {showOpenWithDialog: true });
      } else {          
          console.log('File opened');                
          FileViewer.open(filePath)                         
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  };

  render() {
    const {History} = this.state;
    console.log('Hist', History);
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
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.heading}>
              <Text style={styles.headingText}>{strings.AuditAttach}</Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  color: 'white',
                  fontFamily: 'OpenSans-Regular',
                  textAlign:'center'
                }}>
                {this.state.breadCrumbText}
              </Text>
            </View>
            {/* <View style={{width:Window.width,height:20,position:'absolute',backgroundColor:'yellow'}}>

            </View> */}
            <View style={styles.headerDiv}>
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              {/* <TouchableOpacity onPress={debounce(this.Refresh.bind(this),1000)} > */}
              {/* <Icon name="refresh" size={25} color="white"/> */}
              {/* <Text style={{color:'white',right:10}}>Refresh</Text> */}
              {/* </TouchableOpacity>  */}
              <TouchableOpacity
                style={{paddingHorizontal: 10}}
                onPress={() =>
                  this.props.navigation.navigate('AuditDashboard')
                }>
                <Icon name="home" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {/** ---------------------- */}
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
                  ios: 5
                })
              }}
              textStyle={{
                fontSize: Fonts.size.regular,
                fontFamily: 'OpenSans-Regular',
              }}
            />
          )}
          tabBarPosition="overlayTop">
          {this.state.History.length > 0 ? (
            <View tabLabel={strings.History} style={styles.scrollViewBody}>
              {this.state.NetInfo === true ? (
                <View
                  style={{
                    marginTop: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    styles={{
                      fontSize: Fonts.size.h3,
                      fontFamily: 'OpenSans-Regular',
                    }}>
                    {strings.NoInternet}
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: 50}}>
                  {this.state.pageLoad === true ? (
                    <View
                      style={{
                        width: Window.width,
                        height: null,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Pulse size={30} color={'#48BCF7'} />
                    </View>
                  ) : (
                    <FlatList
                      data={History}
                      keyExtractor={item => item.key}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          onPress={() => {
                            this.onPress(item);
                          }}
                          style={styles.card}>
                          <View style={styles.card1}>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.AttachType}
                              </Text>
                              <Text style={styles.detailContent}>
                                {item.Type === 'Controlled' || item.Type === 'Attachment'
                                  ? 'Attachment'
                                  : item.Type}
                              </Text>
                            </View>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.AttachName}
                              </Text>
                              <TouchableOpacity onPress={(index) => {
                                let url = item.UncontrolledLink;
                                url = url.indexOf("http") !== 0 ? 'https://' + url : url;
                                if (item.Type === 'Link') { Linking.openURL(url);} else if (item.Type === 'Attachment'){
                                  this.setState({
                                   // isVisible : true
                                  }, () => {
                                    this.initiateDownload(item.UncontrolledLink);
                                  })
                                }
                              }}>
                              <View>
                              <Text 
                                style={[styles.detailContent,{color:'blue',
                                 textDecorationLine:item.Type === 'Link' ?'underline' : ''}]}
                                numberOfLines={1}>
                                {item.Type === 'UnControlled' || item.Type === 'Link'
                                  ? item.UncontrolledLink
                                  : item.FileName}
                              </Text> 
                              
                              </View>
                              </TouchableOpacity>

                             
                            </View>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.AttachCom}
                              </Text>
                              <Text
                                style={styles.detailContent}
                                numberOfLines={1}>
                                {item.Comments === 'null' ||
                                item.Comments === null
                                  ? '-'
                                  : item.Comments}
                              </Text>
                            </View>
                            <View style={styles.boxCard1}>
                              <Text style={styles.detailTitle}>
                                {strings.UploadedOn}
                              </Text>
                              <Text style={styles.detailContent}>
                                {this.changeDateFormat(item.Uploadedon)}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              )}
            </View>
          ) : (
            <View tabLabel={strings.History} style={styles.scrollViewBody}>
              <View
                style={{
                  marginTop: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: Fonts.size.h5,
                    color: 'grey',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.No_records_found}
                </Text>
              </View>
            </View>
          )}

        </ScrollableTabView>
        {/** --------footer-------- */}
        <TouchableOpacity
          onPress={
            this.state.NetInfo === true
              ? () => this.addOfflineMode()
              : () =>
                  this.props.navigation.navigate('CreateAttach', {
                    AuditID: this.state.AuditID,
                    Type: 'Add',
                    EditDetails: [],
                    breadCrumb: this.state.breadCrumbText,
                  })
          }
          style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 65,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.NetInfo === true ? (
              <View
                style={{
                  flexDirection: 'column',
                  width: width(45),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="plus" size={25} color="white" />
                <Text
                  style={{
                    color: 'white',
                    fontSize: Fonts.size.regular,
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.AddIcon}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  width: width(45),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="plus" size={20} color="white" />
                <Text
                  style={{
                    color: 'white',
                    fontSize: Fonts.size.regular,
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  {strings.AddIcon}
                </Text>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
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
      <View>
       
        {/* <ProgressDialog
              titleStyle={{fontFamily: 'OpenSans-SemiBold'}}
              messageStyle={{fontFamily: 'OpenSans-Regular'}}
              message={'File is loading, Please Wait!!'}
              visible={this.state.isVisible}
            /> */}
      </View>
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
      dispatch({type: 'CHANGE_AUDIT_STATE', isAuditing}),
    storeNCRecords: ncofiRecords =>
      dispatch({type: 'STORE_NCOFI_RECORDS', ncofiRecords}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditAttach);
