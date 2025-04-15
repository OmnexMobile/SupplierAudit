import React, {Component} from 'react';
import {Linking, Modal, View, Text, Button} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class WebViewThatOpensLinksInNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal : this.props.navigation?.state?.params?.isShowModal
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // this.props.navigation.goBack();
    }, 5000);
  }

  goback() {
    this.setState({isShowModal: false})
    // this.props.navigation.goBack();
    this.props.navigation.navigate('AuditPage', {})
    console.log('goback====>clicked')
  }

  render() {
    const {navigation} = this.props;
    console.log('navi====>', navigation, this.state.isShowModal, navigation?.state?.params?.isShowModal);
    const uri = navigation?.state?.params?.WebviewUrl;
    if(this.state.isShowModal) {
      return (
        <View style={{
           width: '100%',
           height: 800,
        }}>
          <TouchableOpacity  onPress={() => this.goback()}>
          <Icon name="angle-left" size={30} color="#000" style={{margin:20}}/>
          </TouchableOpacity>
        
          <WebView style={{ flex: 1}}
            ref={ref => {
              this.webview = ref;
            }}
            source={{uri}}
            onNavigationStateChange={event => {
              if (event.url !== uri) {
                this.webview.stopLoading();
                Linking.openURL(event.url);
              }
            }}
          />
        </View>
      )
    } 
    return null
  }
}