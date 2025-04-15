import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, ImageBackground } from 'react-native'
import { Images } from '../Themes/index'
import styles from './Styles/CheckListMenuStyle'
import {connect} from "react-redux"
import OfflineNotice from '../Components/OfflineNotice'
import Icon from 'react-native-vector-icons/FontAwesome'
import { strings } from '../Language/Language'
import { debounce, once } from "underscore";


// Voice packages
import Voice from '@react-native-community/voice'
import Tts from 'react-native-tts'
// Moment
import Moment from 'moment'
import auth from '../Services/Auth'
import NetInfo from '@react-native-community/netinfo'

// Styles
//import styles from './Styles/VoiceCheckStyle'


let timer = null;

class VoiceRecognition extends Component {

  constructor(props) {
    super(props)
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      txt: '',
      nextAudit: ''
    }
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentDidMount() {
    if (this.props.data.audits.language === 'Chinese') {
      Tts.setDefaultLanguage('zh');
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage('zh')
        this.setState({})
        console.log('Chinese script on', this.state.ChineseScript)
      })
    }
    else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
      Tts.setDefaultLanguage('en-US');
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage('en-US')
        this.setState({})
        console.log('Chinese script off', this.state.ChineseScript)
      })
    }
    const SiteId = this.props.data.audits.siteId;
    const UserId = this.props.data.audits.userId;
    const token = this.props.data.audits.token;
    auth.getMynextAudit(SiteId, UserId, token, (res, data) => {
      console.log('getMynextAudit', data)
      if (data.data.Message == 'Success') {
        this.setState({nextAudit : data.data.Data[0]})
      } else {
        this.setState({ nextAudit: '' })
      }
    })

  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps', props)
    var getCurrentPage = []
    getCurrentPage = this.props.data.nav.routes
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName
    console.log('--CurrentPage--->', CurrentPage)

    if (CurrentPage == 'VoiceRecognition') {
      console.log('Voice form mounted')
      this.onEventStop()
    }
  }

  onEventStop() {
    Voice.removeAllListeners()
    this.InitVoice()
  }

  InitVoice() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      txt: ''
    }, () => { console.log('setSTate called') })
  }

  componentWillUnmount() {
    if (Voice.isAvailable)
      Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    // eslint-disable-next-line
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = e => {
    // eslint-disable-next-line
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };


  changeDateFormatCard = (inDate) => {
    var dateStr = ''
    var sDateArr = inDate.split('T')
    var sDateValArr = sDateArr[0].split('-')
    var sTimeValArr = sDateArr[1].split(':')
    var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2], sTimeValArr[0], sTimeValArr[1])

    if (sTimeValArr[0] == '00' && sTimeValArr[1] == '00') {
      dateStr = Moment(outDate).format('Do MMMM YYYY')
    }
    else if (sTimeValArr[0] == '00' && sTimeValArr[1] != '00') {
      dateStr = Moment(outDate).format('Do MMMM YYYY 12 m a')
    }
    else if (sTimeValArr[0] != '00' && sTimeValArr[1] == '00') {
      dateStr = Moment(outDate).format('Do MMMM YYYY h a')
    }
    else {
      dateStr = Moment(outDate).format('Do MMMM YYYY h m a')
    }

    return dateStr
  }

  onSpeechError = e => {
    // eslint-disable-next-line
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechResults: ', e);
    if (Platform.OS === 'android') {
      this.setState({
        results: e.value
      }, () => {
        this.VoiceLogic()
      });
    }
    else {
      this.setState({ results: e.value });
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.stopRecording();
      }, 2000);
    }
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    if (Platform.OS === 'ios') {
      timer = null;
      this.setState({ listening: false });
      if (this.state.results != null && this.state.results != '') {
        console.log('--------------------')
        this.VoiceLogic()
        this.onEventStop()
      }
    }
    else {
      console.log('onSpeechEnd: ', e);
      this.setState({
        end: '√',
        started: ''
      });
    }
  };

  async stopRecording() {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = e => {
    // eslint-disable-next-line
    // console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  VoiceLogic() {
    this.setState({ txt: this.state.results }, () => {
      console.log('txt', this.state.txt)
      if (Platform.OS == 'ios') {
        var txt = this.state.txt[0]
      }
      else {
        var txt = this.state.txt[0]
      }
      var auditList = this.props.data.audits.audits
      if (txt.toLowerCase().includes(strings.v_Key_Open_Dash)
        || txt.toLowerCase().includes(strings.v_Key_Open_Dash3)
      ) {
        if (txt.includes(strings.v_Key_Open_Dash3)) {
          Tts.setDucking(true).then(() => {
            Tts.speak(strings.vr_reply_01)
          })
          this.props.navigation.push('AllTabAuditList', { ActiveTab: 'recent' })
        }
        // else {
        //   Tts.setDucking(true).then(() => {
        //     Tts.speak(strings.v_Key_Opening_Dash)
        //   })
        //   this.props.navigation.navigate('AuditDashboard')
        // }
      }
      else if (txt.toLowerCase().includes(strings.v_Key_Open_Dash)
        || txt.toLowerCase().includes(strings.v_Key_Open_Today)
      ) {
        if (txt.includes(strings.v_Key_Open_Today)) {
          Tts.setDucking(true).then(() => {
            Tts.speak(strings.vr_reply_today)
          })
          this.props.navigation.push('AllTabAuditList', { ActiveTab: 'today' })
        }
        // else {
        //   Tts.setDucking(true).then(() => {
        //     Tts.speak(strings.v_Key_Opening_Dash)
        //   })
        //   this.props.navigation.navigate('AuditDashboard')
        // }
      }
      else if (txt.toLowerCase().includes(strings.v_Key_Open_Audit)
        || txt.toLowerCase().includes(strings.v_Key_Open_Audit1)
        || txt.toLowerCase().includes(strings.v_Key_Open_Audit2)
        || txt.toLowerCase().includes(strings.v_Key_Open_Audit3)
      ) {
        if (this.props.data.audits.isOfflineMode) {
          Tts.setDucking(true).then(() => {
            Tts.speak(strings.Offline_Notice)
          })
        } else {
          NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
              if (this.state.nextAudit !== '') {
                Tts.setDucking(true).then(() => {
                  Tts.speak(strings.v_Key_Opening_Summary)
                })
                this.props.navigation.navigate('AuditPage', {
                  datapass: this.state.nextAudit
                })
              }
              else {
                Tts.setDucking(true).then(() => {
                  Tts.speak(strings.v_Key_Sorry_No_Audits)
                })
              }
            } else {
              Tts.setDucking(true).then(() => {
                Tts.speak(strings.NoInternet)
              })
            }
          })
        }
      }
      else if (txt.toLowerCase().includes(strings.v_Key_When_Next_Audit)
        || txt.toLowerCase().includes(strings.v_Key_When_Next_Audit1)) {
        if (this.props.data.audits.isOfflineMode) {
          Tts.setDucking(true).then(() => {
            Tts.speak(strings.Offline_Notice)
          })
        } else {
          NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
              if (this.state.nextAudit !== '') {

                console.log('Next Audit Date: ', this.state.nextAudit.StartDate)
                console.log('Formatted Date: ', this.changeDateFormatCard(this.state.nextAudit.StartDate))
                Tts.setDucking(true).then(() => {
                  Tts.speak(strings.v_Key_My_Next_Audit + this.changeDateFormatCard(this.state.nextAudit.StartDate) + strings.v_Key_My_Next_Audit_Scope + this.state.nextAudit.AuditProgramName + strings.v_Key_My_Next_Auditee + this.state.nextAudit.Auditee)
                })
              }
              else {
                Tts.setDucking(true).then(() => {
                  Tts.speak(strings.v_Key_Sorry_No_Audits)
                })
              }
            } else {
              Tts.setDucking(true).then(() => {
                Tts.speak(strings.NoInternet)
              })
            }
          })
        }
      }
      else {
        Tts.setDucking(true).then(() => {
          Tts.speak(strings.v_Key_Invalid_Message)
        })
      }
    })
  }
  startRecognizing() {
    this.onEventStop()
    this._startRecognizing()
  }

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });

    try {
      if (this.props.data.audits.language === 'Chinese') {
        await Voice.start('zh');
      }
      else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
        await Voice.start('en-US');
      }
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };
  RefreshMic() {
    this.onEventStop()
  }


  render() {
    return (
      <View style={styles.wrapper}>
        <OfflineNotice />

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 60
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                {/* <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> */}
                <Icon name="angle-left" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>{strings.Voice_Recognition}</Text>
            </View>
            <View style={styles.headerDiv}>
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              {/* <TouchableOpacity onPress={this.RefreshMic.bind(this)} >
                <Icon name="refresh" size={25} color="white"/>
                // <Text style={{color:'white',right:10}}>Refresh</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => this.props.navigation.navigate("AuditDashboard")}>
                <Icon name="home" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.auditPageBody, { padding: 0 }]}>
          <ImageBackground source={Images.BGlayerFooter} style={{
            resizeMode: 'stretch',
            width: '100%',
            height: '100%'
          }}>
            <View style={styles.container}>
              <Text style={styles.welcome}>{strings.Voice_Rec_message}</Text>
              <View style={styles.speechSamples}>
                <Text style={styles.questionHead}>{strings.Voice_guide}</Text>
                <Text style={styles.questions}>{strings.Voice1}</Text>
                <Text style={styles.questions}>{strings.Voice2}</Text>
                <Text style={styles.questions}>{strings.Voice3}</Text>
                <Text style={styles.questions}>{strings.Voice_today}</Text>
                {/* <Text style={styles.questions}>{strings.Voice4}</Text>
              <Text style={styles.questions}>{strings.Voice5}</Text> */}
              </View>
              <Text style={styles.instructions}>{strings.Voice_press}</Text>

              <TouchableOpacity style={styles.VoiceRecognition} onPress={debounce(this.startRecognizing.bind(this), 1000)}>
                {(this.state.started == '') ?
                  <Icon name="microphone" size={30} color="red" /> :
                  <Icon name="assistive-listening-systems" size={30} color="green" />
                }
              </TouchableOpacity>
              {/* {(this.state.results) ? (this.state.results.length > 0) ?
            <View style={styles.speechTextBlock}>
              <Text style={styles.speechTextHead}>{strings.Speech}</Text>
              {this.state.results.map((result, index) => {                
                return (
                  (index == 0) ?
                  <Text key={`result-${index}`} style={styles.speechText}>
                    {result}
                  </Text> : null
                );
              })}
              <TouchableOpacity onPress={this._destroyRecognizer}>
                <Text style={styles.action}>Clear</Text>
                <Icon name="trash" size={20} color="red"/>
              </TouchableOpacity>
            </View> : null : null} */}
            </View>
          </ImageBackground>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceRecognition)
