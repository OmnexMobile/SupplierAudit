import React, {Component} from 'react';
import {
  View,
  InteractionManager,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Images} from '../Themes/index';
import styles from './Styles/CheckListMenuStyle';
import {connect} from 'react-redux';
import OfflineNotice from '../Components/OfflineNotice';
import ResponsiveImage from 'react-native-responsive-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts';
import {strings} from '../Language/Language';
import {debounce, once} from 'underscore';
import LinearGradient from 'react-native-linear-gradient';
import { stat } from 'react-native-fs';
import Toast from 'react-native-toast-message';

let Window = Dimensions.get('window');

class CheckListMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayData: [],
      checkListdata: [],
      token: '',
      CheckLogic: [],
      CheckpointP: [],
      DropDown: [],
      AuditID: '',
      CheckPointname: [],
      breadCrumbText: undefined,
      Heading: '',
      FormId: 0,
      pageLoader: true,
      optionalCheck: 0,
      totalCheck: 0,
      TemplateID: 0,
      mandatoryCheck: 0,
      AuditOrder: undefined,
      AuditProgramId: undefined,
    };
  }
  //  AuditOrder AuditProgramId
  componentDidMount() {
    // ...long-running synchronous task...
    this.LongTask();

   this.props.navigation.addListener(
      'didFocus',
      () => {
        this.LongTask();
      }
    );
  }

  componentWillReceiveProps() {
    console.log('consolenavigationparams1', this.props.navigation.state.params);
  }


  LongTask() {
    console.log('consolenavigationparams', this.props.navigation.state.params);
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

    var allData = this.props.data.audits.auditRecords;
    console.log('alDataConsole', allData);
    var AuditID = this.props.navigation.state.params.AuditID;
    var PropsData = [];
    var checklistData = [];
    var parentData = [];
    var displayData = [];
    var formId = this.props.navigation.state.params.ChecklistHeading.FormId
      ? this.props.navigation.state.params.ChecklistHeading.FormId
      : 0;
    var AuditOrder = undefined;
    var AuditProgramId = undefined;
    console.log('CheckListMenu>-AuditID', AuditID);
    var ListData = undefined;
    if (allData) {
      for (var i = 0; i < allData.length; i++) {
        if (AuditID === allData[i].AuditId) {
          console.log('CheckListMenu>-allData[i]', AuditID, allData[i]);
          PropsData = [...allData[i].CheckListPropData];
          ListData = allData[i].Listdata;
          AuditOrder = allData[i].AuditOrderId;
          AuditProgramId = allData[i].AuditProgramId;
        }
      }
    }
    this.countStatistics(ListData);

    if (PropsData.length > 0) {
      for (var i = 0; i < PropsData.length; i++) {
        if (parseInt(PropsData[i].FormId) == parseInt(formId)) {
          if (
            PropsData[i].CompLevelId === 2 ||
            PropsData[i].CompLevelId === 1
          ) {
            parentData.push(PropsData[i]);
          } else if (PropsData[i].CompLevelId === 3) {
            checklistData.push(PropsData[i]);
          }
        }
      }
    }

    if (parentData.length > 0) {
      for (var i = 0; i < parentData.length; i++) {
        displayData.push(parentData[i]);
        var checklistParentId = parentData[i].ChecklistTemplateId;
        for (var j = 0; j < checklistData.length; j++) {
          if (checklistData[j].ParentId == checklistParentId) {
            displayData.push(checklistData[j]);
          }
        }
      }
    } else {
      for (var j = 0; j < checklistData.length; j++) {
        displayData.push(checklistData[j]);
      }
    }
    console.log(displayData, 'DisplayData===>');
    this.setState(
      {
        CheckpointP: this.props.navigation.state.params.Checkpass,
        breadCrumbText: this.props.navigation.state.params.Checkpass.breadCrumb,
        // breadCrumbText: this.props.navigation.state.params.Checkpass.breadCrumb.length>30 ? this.props.navigation.state.params.Checkpass.breadCrumb.slice(0,30) + '...' : this.props.navigation.state.params.Checkpass.breadCrumb,
        Heading: this.props.navigation.state.params.ChecklistHeading.FormName,
        FormId: this.props.navigation.state.params.FormId,
        ChecklistTemplateId:
          this.props.navigation.state.params.ChecklistHeading
            .ChecklistTemplateId,
        ParentId: this.props.navigation.state.params.ChecklistHeading.ParentId,
        AuditID: this.props.navigation.state.params.AuditID,
        checkListdata: PropsData,
        displayData: displayData,
        pageLoader: false,
        AuditOrder: AuditOrder,
        AuditProgramId: AuditProgramId,
      },
      () => {
        console.log('display data', this.state.CheckpointP);
      },
    );
  }

  onCheckListPress(ChecklistTemplateId, CheckPointname) {
    this.props.navigation.navigate('CheckPointDemo', {
      AuditID: this.state.AuditID,
      ChecklistTemplateId: ChecklistTemplateId,
      Check: this.state.CheckpointP,
      FormId : this.state.FormId,
      CheckPointname: CheckPointname,
      breadCrumbText: this.state.breadCrumbText,
      AuditOrder: this.state.AuditOrder,
      AuditProgramId: this.state.AuditProgramId,
      TemplateID: this.state.displayData[0].TemplateID,
      FormIdNavigate:
        this.props.navigation.state.params.ChecklistHeading.FormId,
      notifyRed: this.props.navigation.state.params?.notifyRed,
    });
  }
  countStatistics = checkPointsDetails => {
    console.log('---', checkPointsDetails);
    var data = checkPointsDetails;
    var pendingCheck = [];
    var completed = [];
    var mandatoryCheck = 0;
    console.log('***', checkPointsDetails);

    for (var i = 0; i < data.length; i++) {
      if (data[i].RemarkforNc === 1 && data[i].AttachforNc === 1) {
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
      } else if (data[i].RemarkforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Remark === '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else if (data[i].AttachforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1;
        if (checkPointsDetails[i].Attachment === '') {
          pendingCheck.push(data[i]);
        } else {
          completed.push(data[i]);
        }
      } else {
        completed.push(data[i]);
      }
    }

    console.log('data length', data.length);
    console.log('completed arr-->', completed);
    console.log('pendingCheck', pendingCheck);
    console.log('mandatoryCheck', mandatoryCheck);
    console.log('Executed ---<>');

    this.setState(
      {
        //   mandateCheckpoints: pendingCheck.length,
        //   totalfilled: completed.length,
        optionalCheck: data.length - mandatoryCheck,
        totalCheck: data.length,
        mandatoryCheck: mandatoryCheck,
      },
      () => {
        //   console.log('total checkpoints filled', this.state.totalfilled)
        //   console.log('total pending checkpoints', this.state.mandateCheckpoints)
        //   console.log('total manadatory checkpoints', this.state.mandatoryCheck)
      },
    );
  };
  countMandate(items) {
    console.log('Checking mandate counts', items);
    console.log('displayData', this.state.displayData);
    return items.MandatoryCount;
  }
  ShowToast = (checklistName) => {
    // alert('ccccc')
    console.log('checkksdlfjsdkljfdksjf',checklistName);
    
    Toast.show({
      text2:   checklistName,
      visibilityTime: 3000, // Display checklistName dynamically
    });
  };
  showStatus = checkList => {
    var auditRecords = this.props.data.audits.auditRecords;
    var AuditID = this.props.navigation.state.params.AuditID;
    let listData = [];
    
    let status = checkList.MandatoryCount;
    console.log("showStatus:checkList", checkList);
    for (var i = 0; i < auditRecords.length; i++) { 
      if (AuditID === auditRecords[i].AuditId) {
        let audit = auditRecords[i];
        console.log("showStatus:audit", audit); 
        listData = audit.Listdata; 
        console.log("showStatus:listData", listData); 
        const checkPoints =listData.filter(item => item.ParentId.toString() === checkList.ChecklistTemplateId 
                                                    && item.FormId === checkList.FormId);
        console.log("showStatus:checkPoints", checkPoints);
        //Tick Mark : No empty score must be present

        //Warning: 2/3 score must be filled without N/A

        const allowedMinimum = (2 / 3).toFixed(2);  
        var totalCheckPoint = checkPoints.length;
        const emptyCheckPoint =  checkPoints.filter(checkPoint => checkPoint.Score === '-2');        
            
        if (emptyCheckPoint.length === 0)
        {
          const filledData = checkPoints.filter(checkPoint => checkPoint.Score.toString() !== '-1');                 
          console.log("showStatus:filledData", filledData, allowedMinimum);
          const filledCount = filledData.length;
          if (filledCount > 0) {         
            const filledMin = (filledCount / totalCheckPoint).toFixed(2);
            if (filledMin < allowedMinimum) {
              status = -1;        
            }
            else
              status = 0; 
        }
      }
        else 
          status = ""              
      }
    }
    console.log("showStatus:STATTUS", status); 
return(
<View
    style={{
      flex: 0.8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}>
    <View
      style={{
        width: 30,
        height: 30,
        // borderRadius: 15,
        // backgroundColor: '#00bec1',
        justifyContent: 'center',
        alignItems: 'center',
      }}>

        { (status === 0 ? (
      <Icon
        name="check"
        size={20}
        color="green"
      />
    ) : status === -1 ? <Icon name="warning" size={20} color="red" /> : null)}
      
    </View>
  </View>)
  
  }
  render() {
    console.log(
      //this.props.data.audits.auditRecords[0].CheckListPropData,
      this.props.navigation.state.params.ChecklistHeading.FormId
        ? this.props.navigation.state.params.ChecklistHeading.FormId
        : 0,
      'SerisProduction',
    );

    console.log(
      this.props.navigation.state.params,
      '====>btn1',
    );

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
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text numberOfLines={1} style={styles.headingText}>
                {this.state.Heading}
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

        <View style={[styles.auditPageBody, {padding: 0}]}>
          <ImageBackground
            source={Images.BGlayerFooter}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: '100%',
            }}>
            {this.state.displayData ? (
              this.state.displayData.length > 0 ? (
                <ScrollView
                  style={styles.scrollViewBody}
                  contentContainerStyle={{flexGrow: 1}}>
                  {/* <View style={styles.statistics}>
            <View style={styles.statCard1}>
              <Text style={{ fontSize: 14 }}>{strings.Total_checkpoints}</Text>
              <Text style={{ fontSize: Fonts.size.h5 }}>{this.state.totalCheck}</Text>
            </View>

            <View style={styles.statCard3}>
              <Text style={{ fontSize: 14}}>{strings.Mandatory}</Text>
              <Text style={{ fontSize: Fonts.size.h5}}>{this.state.mandatoryCheck}</Text>
            </View>

            <View style={styles.statCard2}>
              <Text style={{ fontSize: 14}}>{strings.Optional}</Text>
              <Text style={{ fontSize: Fonts.size.h5}}>{this.state.optionalCheck}</Text>
            </View>
          </View> */}
                  <View style={{marginTop: 10}}>
                    {this.state.displayData.map((items, i) =>
                      items.CompLevelId == 1 ? (
                        <TouchableOpacity
                          //onPress={once(this.onCheckListPress.bind(this,items.ChecklistTemplateId , items.ChecklistName))}
                          style={styles.parentcardBox}>
                          {items.ChecklistName.toLowerCase() ===
                          'series production' ? null : (
                            <LinearGradient
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              colors={['#00aed0', '#1FBFD0', '#00bec1']}
                              style={styles.LG}>
                              <View
                                style={{
                                  width: '100%',
                                  height: 50,
                                  justifyContent: 'center',
                                }}>
                                <View style={styles.checkText01}>
                                  <Text
                                    numberOfLines={2}
                                    style={{
                                      color: 'white',
                                      fontFamily: 'OpenSans-Bold',
                                      fontSize: Fonts.size.regular,
                                    }}>
                                    {items.ChecklistName}
                                  </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      ) : items.CompLevelId == 2 ? (
                        <TouchableOpacity
                          style={styles.parentcardBox}
                          // onPress={once(
                          //   this.onCheckListPress.bind(
                          //     this,
                          //     items.ChecklistTemplateId,
                          //     items.ChecklistName
                          //   )
                          // )}
                        >
                          <View
                            style={{
                              width: '5%',
                              height: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}></View>
                          {items.ChecklistName.toLowerCase() ===
                          'series production' ? null : (
                            <LinearGradient
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 0}}
                              colors={['#00aed0', '#1FBFD0', '#00bec1']}
                              style={styles.LG2}>
                              <View
                                style={{
                                  width: '100%',
                                  height: 50,
                                  justifyContent: 'center',
                                }}>
                                <View style={styles.checkText01}>
                                  <Text
                                    numberOfLines={2}
                                    style={{
                                      color: 'white',
                                      fontFamily: 'OpenSans-Bold',
                                      fontSize: Fonts.size.regular,
                                    }}
                                    onPress={() => this.ShowToast(items.ChecklistName)}>
                                    {items.ChecklistName}
                                  </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={once(
                            this.onCheckListPress.bind(
                              this,
                              items.ChecklistTemplateId,
                              items.ChecklistName,
                            ),
                          )}
                          style={styles.parentcardBox}>
                          <View
                            style={{
                              width: '10%',
                              height: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Icon
                              name={'arrow-right'}
                              size={15}
                              color={'#00bec1'}
                            />
                          </View>
                          <View style={styles.LG3}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                              {this.props.data.audits.smdata !== 2 &&
                              this.props.data.audits.smdata !== 3 ? // <View
                              //   style={{
                              //     flex: 0.8,
                              //     flexDirection: 'row',
                              //     justifyContent: 'center',
                              //     alignItems: 'center',
                              //   }}>
                              //   <View
                              //     style={{
                              //       width: 30,
                              //       height: 30,
                              //       borderRadius: 15,
                              //       backgroundColor: '#00bec1',
                              //       justifyContent: 'center',
                              //       alignItems: 'center',
                              //     }}>
                              //     <Text
                              //       style={{
                              //         color: '#fff',
                              //         fontSize: Fonts.size.regular,
                              //         fontFamily: 'OpenSans-Bold',
                              //       }}>
                              //       {this.countMandate(items)}
                              //     </Text>
                              //   </View>
                              // </View>
                              null : (
                                <View
                                  style={{
                                    flex: 0.1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}></View>
                              )}

                              <View style={{flex: 5, flexDirection: 'row'}}>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    color: '#00bec1',
                                    fontSize: Fonts.size.small,
                                    fontFamily: 'OpenSans-Regular',
                                  }}>
                                  {items.ChecklistName}
                                </Text>
                                
                              </View>
                              {this.showStatus(items)}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </ScrollView>
              ) : !this.state.pageLoader ? (
                <View
                  style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    backgroundColor: 'white',
                    opacity: 0.5,
                    width: Window.width,
                    height: Window.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Text style={{fontFamily: 'OpenSans-Regular'}}>
                    No checklists found!
                  </Text>
                </View>
              ) : null
            ) : !this.state.pageLoader ? (
              <View
                style={{
                  paddingVertical: 20,
                  borderTopWidth: 1,
                  backgroundColor: 'white',
                  opacity: 0.5,
                  width: Window.width,
                  height: Window.height,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                }}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>
                  {strings.No_checklists_found}
                </Text>
              </View>
            ) : null}
            {this.state.pageLoader ? (
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
                {/* <Text style={{fontSize:Fonts.size.small}}>We are loading checkpoint!</Text> */}
              </View>
            ) : null}
          </ImageBackground>
        {/* <Toast /> */}
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
      </View>
      
    );
  }
}

const mapStateToProps = state => {
  // console.log('mapStateToProps',state)
  return {
    data: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckListMenu);
