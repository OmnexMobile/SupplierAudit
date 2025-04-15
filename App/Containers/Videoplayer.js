import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'
import Video from 'react-native-video';
import { Images } from '../Themes/index'
import Fonts from '../Themes/Fonts'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'
import { strings } from '../Language/Language'
import { width, height } from 'react-native-dimension'
// Styles
import styles from './Styles/CameraCaptureStyle'

class Videoplayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaused: false,
    };
  }

  render() {        
    const { navigation } = this.props;
    const uri_details = navigation.getParam('Uri', 'empty');
    //const video_name = navigation.getParam('Name','empty')
    //const video_type = navigation.getParam('Type','empty')
    //console.log('video details'+ video_name + video_type)
    return (
      <View style={{backgroundColor:'black', flex:1}}>
        {/*
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={()=>(this.props.navigation.navigate('CreateNC',{cancelpressed: 1,activeAuditID:this.props.navigation.state.params.activeAuditID}))}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Take a Video</Text>
            </View>
            <View style={styles.headerDiv}></View>
          </View>
        </ImageBackground>
        */}
        <View style={{
          height:'80%',
          marginTop:40,          
          }}>
          <View style={{marginLeft:10}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='times-circle' size={34} color='white'/>  
            </TouchableOpacity>
          </View>
          <Video        
            source={{uri: uri_details}}
            style={{
              position: 'absolute',
              top: 60,
              left: 10,
              right: 10,
              bottom: 30,
              zIndex: -100,
            }}
            controls={true}            
            resizeMode={'cover'}
            ref={(ref) => {
            this.player = ref
            }} 
            paused={this.state.isPaused}        
            onVideoEnd={() => {
              this.setState({isPaused: !this.state.isPaused});
          }}
          />
        </View>  
{/*
        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 70
            }}>            
              
              <View style={styles.footerDiv}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity style={{ width: width(45), justifyContent: 'center', alignItems: 'center' }}
                    onPress={()=>(this.props.navigation.navigate('CreateNC',{cancelpressed: 1,activeAuditID:this.props.navigation.state.params.activeAuditID}))}>
                    <Text style={{ color: 'white', fontSize: Fonts.size.h5,fontFamily:'OpenSans-Regular'}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: width(10), justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={Images.lineIcon} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity style={{ width: width(45), justifyContent: 'center', alignItems: 'center' }}
                   onPress={()=>(this.props.navigation.navigate('CreateNC',
                   {cancelpressed: 0,
                    Uri: uri_details,
                    Type: video_type,
                    Name: video_name,          
                    activeAuditID:this.props.navigation.state.params.activeAuditID
                    }))}
                   >
                    <Text style={{ color: 'white', fontSize: Fonts.size.h5,fontFamily:'OpenSans-Regular'}}>{strings.Save}</Text>
                  </TouchableOpacity>
                </View>
              </View> 
          </ImageBackground>
        </View>   
                  */}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
//    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Videoplayer)

