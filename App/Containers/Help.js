import React, { Component } from 'react'
import { View, Image, Text, ImageBackground, Platform, TouchableOpacity, Dimensions } from 'react-native'
import styles from './Styles/HelpStyles'
import OfflineNotice from '../Components/OfflineNotice'
import { Images } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../Language/Language'
import { WebView } from 'react-native-webview';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class Help extends Component {


    render() {
        return (
            <View style={styles.container}>
                <OfflineNotice />
                <View style={styles.headerCont}>
                    <ImageBackground
                        source={Images.DashboardBG}
                        style={styles.bgCont}>
                        {this.renderHeader()}
                    </ImageBackground>
                </View>
                <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <WebView useWebKit={true} source={{ uri: 'https://www.omnexsystems.com/contact.aspx' }}
                        style={{ width: deviceWidth, height: deviceHeight }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true} />

                </View>
            </View>

        )
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={styles.backlogo}>
                        <Icon name="angle-left" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>{strings.help}</Text>
                </View>
                <View style={styles.headerDiv}>
                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.props.navigation.navigate("AuditDashboard")}>
                        <Icon name="home" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}