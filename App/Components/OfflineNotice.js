import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './Styles/OfflineNoticeStyle'
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import {strings} from '../Language/Language'
import {create} from 'apisauce'
import * as constant  from '../Constants/AppConstants'

let netSubscribe;
MiniOfflineSign = () => {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{strings.NoInternet}</Text>
    </View>
  );
}

MiniSlowInternetSign = () => {
  return (
    <View style={styles.slowconnectionContainer}>
      <Text style={styles.offlineText}>{strings.SlowInternet}</Text>
    </View>
  );
}

MiniOfflineModeNotice = () => {
  return (
    <View style={styles.offlineModeContainer}>
      <Text style={styles.offlineText}>{strings.OfflineModeActivated}</Text>
    </View>
  );
}

class OfflineNotice extends Component {
  constructor(props){
    super(props)

    this.state = {
      isConnected: true,
      isLowConnection:false,
      baseURL:(this.props.data.audits.serverUrl) ? this.props.data.audits.serverUrl:this.props.data.audits.serverUrl
    };
  }

  componentDidMount() {
    this.checkInternetStateStartup()
    netSubscribe = NetInfo.addEventListener(state => {
      if (!this.props.data.audits.isOfflineMode) {
        this.props.changeConnectionState(state.isConnected)
        this.setState({ isConnected:state.isConnected })
      } else {
        this.props.changeConnectionState(false)
        this.setState({ isConnected: false })
      }
    })
    
    console.log('Event added.')
    this.checkInternetConnection()
  }


  checkInternetConnection(){
    const check = create({
      baseURL: this.state.baseURL+'CheckConnection'
    })
   check.post()
   .then((response) => {
    console.log('Download offline response',response)
     if(response.duration > constant.ThresholdSpeed){
       this.setState({
        isLowConnection : true
       },()=>{
        console.log('Low network',this.state.isLowConnection)
       })
     }
  })
  }

  componentWillUnmount() {
    if(netSubscribe){
      netSubscribe()
    }    
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange)
    console.log('Event removed.')
  }

  checkInternetStateStartup() {
    if(this.props.data.audits.isOfflineMode) {
      this.setState({
        isConnected: false
      })
    }
    else {
      NetInfo.fetch().then(netState => {
        if(netState.isConnected) {
          this.setState({
            isConnected: true
          })
        }
        else {
          this.setState({
            isConnected: false
          })
        }
      })      
    }
  }

  componentWillReceiveProps() {
    this.checkInternetStateStartup()
  }



  render() {
    if (!this.props.data.audits.isOfflineMode && !this.state.isConnected) {
      return <MiniOfflineSign />
    }
    else if(this.props.data.audits.isOfflineMode) {
      return <MiniOfflineModeNotice />
    }
    else if(this.state.isLowConnection == true){
      return <MiniSlowInternetSign/>
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeConnectionState: (isConnected) => dispatch({type: 'CHANGE_CONNECTION_STATE', isConnected})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice)