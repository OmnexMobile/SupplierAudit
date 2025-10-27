import React, { Component } from 'react'
import { TextInput,Animated, View, Text, Dimensions, Image, TouchableOpacity , Keyboard } from 'react-native'
import styles from './Styles/AuditForegroundStyle'
import ProgressCircle from 'react-native-progress-circle'
import {width} from 'react-native-dimension'
import auth from '../Services/Auth'
import {connect} from "react-redux"
import { Images } from '../Themes';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import {strings} from '../Language/Language'
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from "@react-native-community/netinfo";
import { debounce ,once } from "underscore";


let Window = Dimensions.get('window')
const window_width = Dimensions.get('window').width

class AuditForeground extends Component {
  isInitialLoad = true

  constructor(props){
    super(props);

    this.state={
      scheduled: '',
      inprogress: '',
      completed: '',
      token: '',
      isLoading: false,
      searchFlag: false,
      AuditSearch:'',
      filterType: 0
    }
  }

  componentDidMount() {
    if(this.props.data.audits.language === 'Chinese'){
      this.setState({ ChineseScript : true },() =>{
        strings.setLanguage('zh')
        this.setState({}) 
        console.log('Chinese script on',this.state.ChineseScript) })
    }
    else if(this.props.data.audits.language === null || this.props.data.audits.language === 'English'){
      this.setState({ ChineseScript : false },()=>{
        strings.setLanguage('en-US')           
        this.setState({})
        console.log('Chinese script off',this.state.ChineseScript)
      })
    }
    // console.log('AuditForeground props', this.props)
    this.getSessionValues()
  }

  componentWillReceiveProps() {
    console.log('foreg',this.props.searchFlag)
    var getCurrentPage = [] 
    getCurrentPage = this.props.data.nav.routes
    var CurrentPage = getCurrentPage[getCurrentPage.length-1].routeName
    console.log('--CurrentPage--->',CurrentPage)

    if(CurrentPage == 'AuditDashboard'){
      if(!this.isInitialLoad)
      {
        this.isInitialLoad = false
        console.log('AuditForeground refresh called.')

        if(this.props.data.audits.isOfflineMode) {
          this.setState({
            completed : this.props.data.audits.completedAudits,
            inprogress: this.props.data.audits.processingAudits,
            scheduled : this.props.data.audits.scheduledAudits,
            isLoading: false
          })
        }
        else {
          NetInfo.fetch().then(netState => {
            if(netState.isConnected) {
              this.getAuditStatus()
            }
            else {
              this.setState({
                completed : this.props.data.audits.completedAudits,
                inprogress: this.props.data.audits.processingAudits,
                scheduled : this.props.data.audits.scheduledAudits,
                isLoading: false
              })
            }
          })
        }      
      } 
    }     
  }

  getSessionValues = () => {
    try {
      const TOKEN = this.props.data.audits.token;
      
      if (TOKEN !== null) {
        this.isInitialLoad = false
        this.setState({
          token: TOKEN,          
          isLoading: true
        }, () => {
          if(this.props.data.audits.isOfflineMode) {
            this.setState({
              completed : this.props.data.audits.completedAudits,
              inprogress: this.props.data.audits.processingAudits,
              scheduled : this.props.data.audits.scheduledAudits,
              isLoading: false
            })
          }
          else {
            NetInfo.fetch().then(netState => {
              if(netState.isConnected) {
                this.getAuditStatus()
              }
              else {
                this.setState({
                  completed : this.props.data.audits.completedAudits,
                  inprogress: this.props.data.audits.processingAudits,
                  scheduled : this.props.data.audits.scheduledAudits,
                  isLoading: false
                })
              }
            })
          }          
      })
    }
   } catch (error) {
      // Error retrieving data
      console.log('Failed to retrive a login session!!!',error)
    }
  }

  getAuditStatus(){

    auth.getStat(this.state.token,this.props.data.audits.userId,this.props.data.audits.SiteID, (response, data) => {
      if(data.data) {
        // console.log('getting stats response',response)
        console.log('getting stats response',data)
        // console.log('getting Completed',data.data.Data.Completed[0])
        // console.log('getting Inprogress',data.data.Data.Inprogress[0])
        // console.log('getting Scheduled',data.data.Data.Scheduled[0])
        this.props.storeAuditStats(data.data.Data.Completed[0].Completed, data.data.Data.Inprogress[0].Inprogress, data.data.Data.Scheduled[0].Scheduled)
        this.setState({
          completed : data.data.Data.Completed[0].Completed,
          inprogress: data.data.Data.Inprogress[0].Inprogress,
          scheduled : data.data.Data.Scheduled[0].Scheduled,
          isInitialLoad: false,
          isLoading: false
        }, () => {
          // console.log('this.state.completed',this.state.completed)
          // console.log('this.state.inprogress',this.state.inprogress)
          // console.log('this.state.scheduled',this.state.scheduled)
          this.isInitialLoad = false
        });
      }
      else {
        this.props.storeAuditStats(0, 0, 0)
        this.setState({
          completed: 0,
          inprogress: 0,
          scheduled: 0,
          isInitialLoad: false,
          isLoading: false
        }, () => {
          // console.log('this.state.completed',this.state.completed)
          // console.log('this.state.inprogress',this.state.inprogress)
          // console.log('this.state.scheduled',this.state.scheduled)
          this.isInitialLoad = false
        });
      }
    })
  }

  /* static defaultProps = {
    animatedValue: new Animated.Value(0)
  }; */
  onsearchPress(){
    if(this.state.AuditSearch.trim() == ''){
      this.setState({
        AuditSearch:''
      },()=>{
        alert('Please type the audit you are looking for!')
      })
    }
    else{
      Keyboard.dismiss()
      console.log('onSearch pressed',this.state.AuditSearch)
      this.props.onSearchSubmit(this.state.AuditSearch)
    }
  }

  statusFilter(type) {
    this.props.navigation.navigate('AuditProDashboard')

    // console.log('Status Filter - Type: ', type)
    // console.log('this.state.filterType: ', this.state.filterType)
    // this.setState({
    //   filterType: (this.state.filterType == type) ? 0 : type
    // }, ()=> {
    //   this.props.onFilterChange(this.state.filterType)
    // })    
  }

  render() {
    console.log('---->',this.props.searchFlag)
    // const { searchFlag} = this.state

    /* const scale = this.props.animatedValue.interpolate({
        inputRange: [0, 160],
        outputRange: [1, 0.7],
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      });

    const translateY = this.props.animatedValue.interpolate({
        inputRange: [0, 160],
        outputRange: [0, 20],
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      });

    const scaleBig = this.props.animatedValue.interpolate({
      inputRange: [0, 130],
      outputRange: [1, 0.7],
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });

    const translateYBig = this.props.animatedValue.interpolate({
      inputRange: [0, 160],
      outputRange: [0, 20],
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });

    let wrapperStyle = {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }; */


    return (


      <View style={styles.wrapper}>
        {(!this.state.isLoading) ? 
          <View style={styles.wrapper}>   
          {this.props.searchFlag === true ? 
          <View style={styles.wrapper}>
          <View style={{
            width:'90%',
            height:'63%',
            backgroundColor:'white',
            borderRadius:3,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            bottom:10,
          }}>
          <View style={{width:'85%'}}>
            <TextInput
            placeholder='I am looking for...'
            style={{padding:10,opacity:0.7, width:'100%' ,height:'100%' }}
            value={this.state.AuditSearch}
            autoFocus={true}
            onChangeText={(Text)=>this.setState({AuditSearch:Text})}
            onBlur={()=>{
              Keyboard.dismiss()
            }}
            />
          </View>
          <TouchableOpacity onPress={debounce(this.onsearchPress.bind(this),600)}
          style={{ 
            borderRadius:3,
            height:null,
            width:'15%',
            backgroundColor:'transparent',
            justifyContent:'center',
            alignItems:'center',
            }}>
          <Icon  name="search" size={25} color="#2EA4E2"/>
          </TouchableOpacity>
          </View>
          </View> :
          <View style={styles.wrapper}>
            <TouchableOpacity onPress={debounce(this.statusFilter.bind(this, 2),600)}>
              <View style={styles.statsSection}>                
                <Text style={(this.state.filterType == 2) ? styles.progressValSelected : styles.progressVal}>{this.state.scheduled}</Text>
                <Text style={(this.state.filterType == 2) ? styles.progressStateSelected : styles.progressState}>{strings.scheduled}</Text>                
              </View>
            </TouchableOpacity>
            <View style={styles.separatorSection}>
              <Image source={Images.lineIcon}/>
            </View>
            <TouchableOpacity onPress={debounce(this.statusFilter.bind(this, 1),600)}>
              <View style={(this.state.filterType == 1) ? styles.statsSectionSelected : styles.statsSection}>              
                  <Text style={(this.state.filterType == 1) ? styles.progressValSelected : styles.progressVal}>{this.state.inprogress}</Text>
                  <Text style={(this.state.filterType == 1) ? styles.progressStateSelected : styles.progressState}>{strings.inprogress}</Text>              
              </View>
            </TouchableOpacity>
            <View style={styles.separatorSection}>
              <Image source={Images.lineIcon}/>
            </View>
            <TouchableOpacity onPress={debounce(this.statusFilter.bind(this, 3),600)}>
              <View style={(this.state.filterType == 3) ? styles.statsSectionSelected : styles.statsSection}>              
                  <Text style={(this.state.filterType == 3) ? styles.progressValSelected : styles.progressVal}>{this.state.completed}</Text>
                  <Text style={(this.state.filterType == 3) ? styles.progressStateSelected : styles.progressState}>{strings.completed}</Text>              
              </View>
            </TouchableOpacity>
          </View>

          }

          </View> 
          : 
          <View style={styles.wrapper}>
            <View style={styles.refreshSection}>
              <Pulse size={20} color='white'/>
            </View>
          </View>
        }
      </View>     

    );

    {/* <Animated.View style={[styles.wrapper, wrapperStyle]} pointerEvents="box-none">
        <Animated.View style={[styles.containerLeft, {transform: [{ scale }, { translateY }] }]}>
          <View style={styles.circle}>
          <ProgressCircle
            percent={50}
            radius={width(14)}
            borderWidth={8}
            color="#48BCF7"
            shadowColor="white"
            bgColor="#fff"
          >
            <Text style={styles.progressVal}>{this.state.scheduled}</Text>
            <Text style={styles.progressState}>{'Scheduled'}</Text>
          </ProgressCircle>
          </View>
        </Animated.View>
        <Animated.View style={[styles.containerCenter, {transform: [{ scale }, { translateY }] }]}>
          <View style={styles.circle}>
          <ProgressCircle
            percent={60}
            radius={width(14)}
            borderWidth={8}
            color="#48BCF7"
            shadowColor="white"
            bgColor="#fff"
          >
            <Text style={styles.progressVal}>{this.state.inprogress}</Text>
            <Text style={styles.progressState}>{'InProgress'}</Text>
          </ProgressCircle>
          </View>
        </Animated.View>
        <Animated.View style={[styles.containerRight, {transform: [{ scale }, { translateY }] }]}>
          <View style={styles.circle}>
          <ProgressCircle
            percent={40}
            radius={width(14)}
            borderWidth={8}
            color="#48BCF7"
            shadowColor="white"
            bgColor="#fff"
          >
            <Text style={styles.progressVal}>{this.state.completed}</Text>
            <Text style={styles.progressState}>{'Closed'}</Text>
          </ProgressCircle>
          </View>
        </Animated.View>
      </Animated.View> */}
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeAuditStats: (completed, processing, scheduled) => dispatch({type: 'STORE_AUDIT_STATS', completed, processing, scheduled})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuditForeground)