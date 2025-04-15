import React, { Component } from 'react'
import {View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Platform,
  Linking,
  navigator,
  geolocation
} from 'react-native'
import { Images }from '../Themes/index'
import { connect } from "react-redux";
import styles from './Styles/ProfileStyle'
import { width } from 'react-native-dimension'
import AuditHeader from '../Components/AuditHeader'
import ResponsiveImage from 'react-native-responsive-image';
import Modal from "react-native-modal"
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts'
import { strings } from '../Language/Language'
// import Geocoder from 'react-native-geocoder';
import { Googel_API_KEY } from '../Constants/AppConstants'
import { debounce ,once } from "underscore";

 
let Window = Dimensions.get('window')

class Profile extends Component{
    constructor(props){
        super(props);
        this.state={
          Address:'',
          CompanyName:'',
          CompanyUrl:'',
          Logo:'',
          Phone:'',
          username: '',
          isVisible:false
        }
    }

    componentDidMount(){
        // console.log('Profile page mounted',this.props.data.audits)
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
        this.setState({
          username:this.props.data.audits.userName,
          CompanyName:this.props.data.audits.companyname,
          CompanyUrl:this.props.data.audits.companyurl,
          Logo:this.props.data.audits.logo,
          Address:this.props.data.audits.address,
          Phone: this.props.data.audits.phone
        },()=>{
          // console.log('Address data',this.state.Address)
          // console.log('userName data',this.state.username)
          // console.log('companyname data',this.state.CompanyName)
          // console.log('Logo logo',this.state.Logo)
          // console.log('Phone data',this.state.Phone)
          // console.log('CompanyUrl data',this.state.CompanyUrl)
        })
    }

    redirectGoogle(){
      console.log('Redirecting to google map...',Platform)

      // Geocoder.fallbackToGoogle(Googel_API_KEY);

      // {/** For converting Address to Lat and Lng */}
      // var Address = this.state.Address
      // console.log('Address',Address)

      // Geocoder.geocodeAddress(Address).then(res => {
      //   // res is an Array of geocoding object (see below)
      //   console.log('==-->',res)
      //   const Lat = res[0].position.lat
      //   const Lng = res[0].position.lng
      //   const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      //   const latLng = `${Lat},${Lng}`
      //   const label = this.state.Address;
      //   const url = Platform.select({
      //     ios: `${scheme}${label}@${latLng}`,
      //     android: `${scheme}${latLng}(${label})`
      //   });
      //   Linking.openURL(url);
      // })
      // .catch(err => console.log(err))
    }

    render(){
        return(

          <View style={styles.wrapper}>
                
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backlogo}>
              <Icon name="angle-left" size={40} color="white"/>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('VoiceRecognition')} style={styles.VoiceRecognition}>
              <Icon name="microphone" size={40} color="red"/>
            </TouchableOpacity> */}
             <TouchableOpacity style={styles.homeIcon} onPress={()=>this.props.navigation.navigate("AuditDashboard")}>
                  <Icon name="home" size={40} color="white" />
              </TouchableOpacity>
            <View style={styles.header}></View>

            <TouchableOpacity style={styles.avatarBox} onPress={() => this.setState({ isVisible : true })}>
              <View style={styles.avatar}>
                <Image style={{marginLeft: 8, width: 130, height: 130, resizeMode: 'contain'}} source={{uri: 'data:image/png;base64, ' + this.state.Logo }}/>
              </View>
            </TouchableOpacity>

            <View style={{ top: 85, flexDirection: 'column', height: 170, backgroundColor: 'white' }}>
              {/* <View style={{
                width: Window.width,
                backgroundColor:'transparent',
                justifyContent:'center',
                alignItems:'center',
                paddingTop: 20
                }}>
                <Text style={styles.name}>{this.state.username.charAt(0).toUpperCase()+this.state.username.slice(1)}</Text>
              </View> */}
              <View style={{
                width: Window.width,
                backgroundColor:'transparent',
                justifyContent:'center',
                alignItems:'center',
                paddingTop: 20
                }}>
                <Text style={{ fontSize: Fonts.size.h5, color:'#00bcff',fontFamily:'OpenSans-Regular' }}>{this.state.CompanyName}</Text>
              </View>

            </View>

            <View style={styles.auditPageBody}>   
              <ScrollView>

                <View style={{
                  width:Window.width,
                  backgroundColor:'transparent',
                  justifyContent:'center',
                  alignItems:'center',
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 0.5,
                  paddingTop: 25,
                  paddingBottom: 10
                  }}>
                <View style={{width:width(90),backgroundColor:'transparent',flexDirection:'column'}}> 
                  <View>
                    <Text style={{ fontSize: Fonts.size.medium, color: '#A6A6A6',fontFamily:'OpenSans-Regular' }}>{strings.Company_URL} :</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: Fonts.size.regular, color: '#485B9E' ,fontFamily:'OpenSans-Regular'}}>{this.state.CompanyUrl}</Text>
                  </View>
                  </View>
                </View>

                <View style={{
                  width:Window.width,
                  backgroundColor:'transparent',
                  justifyContent:'center',
                  alignItems:'center',
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 0.5,
                  paddingTop: 10,
                  paddingBottom: 10
                  }}>
                <View style={{width:width(90), backgroundColor:'transparent',flexDirection:'column'}}> 
                  <View>
                    <Text style={{ fontSize: Fonts.size.medium, color: '#A6A6A6',fontFamily:'OpenSans-Regular' }}>{strings.Phone} :</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: Fonts.size.regular, color: '#485B9E',fontFamily:'OpenSans-Regular' }}>{this.state.Phone}</Text>
                  </View>
                  </View>
                </View>

                <View style={{
                  width:Window.width,
                  backgroundColor:'transparent',
                  justifyContent:'center',
                  alignItems:'center',
                  paddingTop: 10,
                  paddingBottom: 10
                  }}>
                  <View style={{
                    width:width(90), 
                    backgroundColor:'transparent',
                    flexDirection:'column',
                    justifyContent:'space-between'
                    }}> 
                  <View>
                    <Text style={{ fontSize: Fonts.size.medium, color: '#A6A6A6',fontFamily:'OpenSans-Regular' }}>{strings.Address} :</Text>
                  </View>
                  <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between'}} 
                  onPress={debounce(this.redirectGoogle.bind(this),600) }>
                    <Text style={{ fontSize: Fonts.size.regular, color: '#485B9E' ,fontFamily:'OpenSans-Regular' }}>{this.state.Address}</Text>
                    <Icon name={'location-arrow'} size={20} color={'black'}/>
                  </TouchableOpacity>
                  </View>
                </View>

              </ScrollView>
            </View> 

            <View>
              <Modal 
              isVisible={this.state.isVisible}
              onBackdropPress={() => this.setState({ isVisible: false })}
              >
                <View style={{
                  position:'absolute',
                  width:Window.width ,
                  height:Window.height,
                  justifyContent:'center',
                  alignContent:'center',
                  paddingTop: 20
                  }}>


                  <View style={styles.modalavatar}>

                  <TouchableOpacity
                  onPress={() => this.setState({ isVisible: false })}
                  style={{ backgroundColor:'transparent' ,height:60,width:80}}
                  >
                  <View style={{
                    backgroundColor:'transparent',
                    top:18
                   }}>
                  <Icon style={{left:8}} name="times-circle" size={40} color='white'/>
                  </View>
                  </TouchableOpacity>

                    <Image style={styles.modelImage} source={{uri:  'data:image/png;base64, ' + this.state.Logo }}/>
                  </View>
                </View>
              </Modal>
            </View>

          </View>
        );
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
  export default connect(mapStateToProps, mapDispatchToProps)(Profile)