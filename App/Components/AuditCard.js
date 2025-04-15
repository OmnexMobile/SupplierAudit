import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
//styles
import styles from '../Containers/Styles/AuditProDashboardStyle';
//Lib
import NetInfo from '@react-native-community/netinfo';
import ProgressCircle from 'react-native-progress-circle';
import {withNavigation} from 'react-navigation';
import Toast, {DURATION} from 'react-native-easy-toast';
import {connect} from 'react-redux';
import Moment from 'moment';
//assets
import Fonts from '../Themes/Fonts';
import constant from '../Constants/AppConstants';
import {strings} from '../Language/Language';

const {whitneyBook_14, whitneyBook_12, whitneyBook_17} = Fonts.style;
const {viley, thickGrey, slideGrey, headBlue} = Fonts.colors;

class AuditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFormat:
        this.props.dateFormat === null ? 'DD-MM-YYYY' : this.props.dateFormat,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.selectedFormat !== nextProps.dateFormat) {
      this.setState({
        dateFormat: nextProps.dateFormat,
        selectedFormat:
          nextProps.dateFormat === null ? 'DD-MM-YYYY' : nextProps.dateFormat,
      });
    }
  }

  changeDateFormatCard = inDate => {
    if (inDate) {
      var DefaultFormatL = this.state.selectedFormat;// + ' ' + 'HH:mm';
      var sDateArr = inDate.split('T');
      var sDateValArr = sDateArr[0].split('-');
      var sTimeValArr = sDateArr[1].split(':');
      var outDate = new Date(
        sDateValArr[0],
        sDateValArr[1] - 1,
        sDateValArr[2]
      );
      return Moment(outDate).format(DefaultFormatL);
    }
  };

  getAuditStatus = status => {
    // console.warn('======',status)
    var percent = 0;
    // Set Audit Card color by checking its Status
    switch (status) {
      case constant.StatusScheduled:
        percent = 10;
        break;
      case constant.StatusDownloaded:
        percent = 30;
        break;
      case constant.StatusNotSynced:
        percent = 70;
        break;
      case constant.StatusProcessing:
        percent = 50;
        break;
      case constant.StatusSynced:
        percent = 90;
        break;
      case constant.StatusCompleted:
        percent = 100;
        break;
      case constant.StatusDV:
        percent = 60;
        break;
      case constant.StatusDVC:
        percent = 100;
        break;
      default:
        percent = 10;
        break;
    }
    return percent;
  };

  //Guru -- 26/09/2022 - cicle & statusbar color changed as per web dev shared..
  getAuditCircleColor = (status, status_or_circle) => {
    // console.warn('======',status)
    var circlecolor = 0;
    var statusbarcolor = 0;
    // Set Audit Card color by checking its Status
    switch (status) {
      case constant.StatusScheduled:
        circlecolor = '#0000FF';
        statusbarcolor = '#0000FF';
        break;
      case constant.StatusCompleted:
        circlecolor = '#00FF00';
        statusbarcolor = '#00FF00';
        break;
      case constant.StatusDV:
        circlecolor = '#FF0000';
        statusbarcolor = '#FF0000';
        break;
      case constant.StatusDVC:
        circlecolor = '#000000';
        statusbarcolor = '#000000';
        break;
      default:
        circlecolor = '';
        statusbarcolor = '';
        break;
    }
    if (status_or_circle == 0) {
      return circlecolor;
    } else if (status_or_circle == 1) {
      return statusbarcolor;
    }
    console.log(
      'circelcolor' + circlecolor + ' statue bar color' + statusbarcolor,
    );
  };

  getColorCode(status){
    let statusColor = "#1081de";
    switch (status) {
      case constant.StatusScheduled:
        statusColor = '#1081de';
        break;
      case constant.StatusDownloaded:
        statusColor = '#cd8cff';
        break;
      case constant.StatusNotSynced:
        statusColor = '#2ec3c7';
        break;
      case constant.StatusProcessing:
        statusColor = '#e88316';
        break;
      case constant.StatusSynced:
        statusColor = '#48bcf7';
        break;
      case constant.StatusCompleted:
        statusColor = 'black';
        break;
      case constant.Completed:
        statusColor = 'green';
        break;
      case constant.StatusDV:
        statusColor = 'red';
        break;
      case constant.StatusDVC:
        statusColor = 'green';
        break;
      default:
        statusColor = '#1081de';
        break;
    }
    return statusColor;
  }

  openAuditPage(iAuditDetails) {
    console.log('iAuditDetails', iAuditDetails);
    var auditRecords = this.props.data.audits.auditRecords;
    var isDownloadedDone = false;

    for (var i = 0; i < auditRecords.length; i++) {
      if (auditRecords[i].AuditId == iAuditDetails.ActualAuditId) {
        isDownloadedDone = true;
      }
    }

    if (isDownloadedDone) {
      this.props.navigation.navigate('AuditPage', {
        datapass: iAuditDetails,
        auditStatusPass: this.props.item.cStatus,
      });
    } else {
      if (this.props.data.audits.isOfflineMode) {
        this.refs.toast.show(strings.Offline_Notice, DURATION.LENGTH_LONG);
      } else {
        NetInfo.fetch().then(netState => {
          if (netState.isConnected) {
            this.props.navigation.navigate('AuditPage', {
              datapass: iAuditDetails,
              auditStatusPass: this.props.item.cStatus,
            });
          } else {
            this.refs.toast.show(strings.No_Internet, DURATION.LENGTH_LONG);
          }
        });
      }
    }
  }

  //   <Text numberOfLines={1} style={[styles.paddingTop5,whitneyBook_14,thickGrey,{fontFamily:'OpenSans-Regular'}]}>{item.AuditProgramName}</Text>

  render() {
    const {item, index, length} = this.props;
    console.log(item, 'itemconsolenoti');
    return (
      <View>
                <View style={{flex:0.5,backgroundColor:'#fff',margin:10,borderRadius:5,flexDirection:'row',
                elevation:3,shadowColor: Platform.OS === 'ios' ? '#D3D3D3' : '#000',
                shadowOffset: { width: 5, height: 5 }, shadowOpacity: 5,
}}>
                  <View style={{flex:0.020,
                  backgroundColor: this.getColorCode(item.cStatus), margin:10}}></View>
                  <TouchableOpacity key={index} onPress={() => this.openAuditPage(item)}>
      
              {/*<Text numberOfLines={1} style={[whitneyBook_17,viley,{fontFamily:'OpenSans-Regular'}]}>{item.Auditee}</Text>*/}
              <View style={{margin:10}}>
              <Text
                numberOfLines={1}
                style={[
                  {
                    fontFamily: 'OpenSans-Regular',
                    color: 'rgba(36,236,206,255)',
                  },
                ]}>
                {item.Auditee}
              </Text>
              <Text
                numberOfLines={1}
                style={[{fontFamily: 'OpenSans-Regular', color: 'black'}]}>
                {this.changeDateFormatCard(item.StartDate)} - {' '}
                {this.changeDateFormatCard(item.EndDate)}
              </Text>
              <Text
                numberOfLines={1}
                style={[{fontFamily: 'OpenSans-Regular', color: 'black'}]}>
                {item.AuditTypeName}
              </Text>
              <Text
                numberOfLines={1}
                style={[{fontFamily: 'OpenSans-Regular', color: 'black'}]}>
                {item.AuditNumber}
              </Text>
              <Text
                numberOfLines={1}
                style={[{fontFamily: 'OpenSans-Regular', color: 'black'}]}>
                {item.cStatus == 'Deadline Violated and Completed'
                  ? 'D.Violated & Completed'
                  : item.cStatus}
                  
              </Text>
              </View>
              
              {/*
                        <Text numberOfLines={1} style={[whitneyBook_12,slideGrey,{fontFamily:'OpenSans-Regular'}]}>{this.changeDateFormatCard(item.StartDate)} - {this.changeDateFormatCard(item.EndDate)}</Text>
                        <Text numberOfLines={1} style={[whitneyBook_14, thickGrey,{fontFamily:'OpenSans-Regular'}]}>{item.AuditTypeName}</Text>
                        <Text numberOfLines={1} style={[whitneyBook_14, thickGrey,{fontFamily:'OpenSans-Regular'}]}>{item.AuditNumber}</Text>
                        */}
        </TouchableOpacity>
                  </View>
        
        <Toast
          ref="toast"
          style={{backgroundColor: 'black', margin: 20}}
          position="top"
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: 'white'}}
        />
      </View>
    );
  }
}

const Root = withNavigation(AuditCard);

const mapStateToProps = state => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps)(Root);
