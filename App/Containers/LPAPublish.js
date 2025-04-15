import React, {useMemo, useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ResponsiveImage from 'react-native-responsive-image';
import styles from './Styles/CreateAttachStyle';
import {strings} from '../Language/Language';
import {Images} from '../Themes';
import OfflineNotice from '../Components/OfflineNotice';
import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
} from 'react-native-render-html';
import TableRenderer, {tableModel} from '@native-html/table-plugin';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {TabRouter} from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '../Services/Auth';
import Moment from 'moment';
import ToastNew, {SuccessToast} from 'react-native-toast-message';

export default function LPAPublish(props) {
  const [sitelevelid, setsitelevelid] = useState('');
  const [objid, setobjid] = useState('');
  const [htmlobject, sethtmlobject] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const {width} = useWindowDimensions();
  const auditdetails = props.navigation.state.params;
  const toastConfig = {
    error: props => (
      <SuccessToast
        {...props}
        text1Style={{
          fontSize: 12,
        }}
      />
    ),
  };
  useEffect(() => {
    getLPAhtml();
  }, []);
  const getLPAhtml = async () => {
    var serverUrl = await AsyncStorage.getItem('storedserverrul');
    var auditId = auditdetails.Auditid;
    var auditorderId = auditdetails.Auditorder;
    try {
      const response = await fetch(
        serverUrl +
          'AuditReportDemo?Auditid=' +
          auditId +
          '&Auditorder=' +
          auditorderId,
      );
      const json = await response.json();

      setsitelevelid(json.Data.SitelevelID);
      setobjid(json.Data.objID);
      sethtmlobject(json.Data.strHTML);
      setisLoading(false);
      return json;
    } catch (error) {
      console.error(error);
    }
  };
  const publishdocumentAPI = async () => {
    setisLoading(true);
    var auditId = auditdetails.Auditid;
    var token = await AsyncStorage.getItem('token');
    var deviceId = await AsyncStorage.getItem('deviceid');
    var userId = await AsyncStorage.getItem('userId');
    var siteIdUser = await AsyncStorage.getItem('siteId');
    var siteId = 'sit' + siteIdUser;
    var langid = 1;
    var userdtfmt = 'MM/DD/YYYY';
    var UserDtFmtDlm = '/';
    var filepath = '';
    var fromdocpro = 0;
    var frommod = 'mod2';
    var doctypeid = 0;
    var mod = 'mod2';
    var link = '';
    var keyword = 'AuditPro';
    var reason = '';
    var rev = 1;
    var paginate = '';
    var chgs_reqd = '';
    var spublic = 0;
    var ModEmailConFig = 0;

    var formRequestObj = [
      {
        dnum: auditId,
        dname: auditId,
        filename: auditId + '.html',
        ext: 'html',
        filepath: filepath,
        obj: JSON.stringify(objid),
        fromdocpro: fromdocpro,
        frommod: frommod,
        doctypeid: doctypeid,
        siteid: siteId,
        mod: mod,
        sitelevelid: sitelevelid,
        link: link,
        keyword: keyword,
        reason: reason,
        rev: rev,
        effectivedate: Moment(new Date()).format('MM/DD/YYYY'),
        revdate: Moment(new Date()).format('MM/DD/YYYY'),
        paginate: paginate,
        chgs_reqd: chgs_reqd,
        spublic: spublic,
        ModEmailConFig: ModEmailConFig,
        deviceId: deviceId,
        filecontent: htmlobject,
        lstUserPrefModel: [
          {
            siteid: siteIdUser,
            UserId: userId,
            langid: langid,
            userdtfmt: userdtfmt,
            UserDtFmtDlm: UserDtFmtDlm,
          },
        ],
      },
    ];
    auth.getdocProAttachment(formRequestObj, token, (res, data) => {
      if (data.data.Success === true) {
        setisLoading(false);
        ToastNew.show({
          type: 'success',
          text1: 'Document Published',
        });
        setTimeout(() => {
          props.navigation.navigate('AuditDashboard');
        }, 2000);
      } else {
        ToastNew.show({
          type: 'error',
          text1: 'Some error occured while publishing the document',
        });
      }
    });
  };
  const htmlsource = {
    html: htmlobject,
  };

  const htmlProps = {
    renderersProps: {
      table: {
        display: 'table',
        borderColor: '#ddd',
        borderWidth: 1,
      },
    },
    customHTMLElementModels: {
      table: tableModel,
    },
  };

  const customHTMLElementModels = {
    table: HTMLElementModel.fromCustomModel({
      tagName: 'table',
      mixedUAStyles: {
        borderColor: '#ddd',
        borderWidth: 1,
        width: '100%',
      },
      contentModel: HTMLContentModel.block,
    }),
    tbody: HTMLElementModel.fromCustomModel({
      tagName: 'tbody',
      mixedUAStyles: {
        width: '100%',
      },
      contentModel: HTMLContentModel.block,
    }),
    thead: HTMLElementModel.fromCustomModel({
      tagName: 'thead',
      mixedUAStyles: {
        width: '100%',
      },
      contentModel: HTMLContentModel.block,
    }),
    td: HTMLElementModel.fromCustomModel({
      tagName: 'td',
      mixedUAStyles: {
        borderWidth: 1,
        borderColor: '#ddd',
      },
      contentModel: HTMLContentModel.block,
    }),
    th: HTMLElementModel.fromCustomModel({
      tagName: 'th',
      mixedUAStyles: {
        borderWidth: 1,
        borderColor: '#ddd',
        fontWeight: 'bold',
      },
      contentModel: HTMLContentModel.block,
    }),
  };
  return (
    <>
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
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Publish document</Text>
            </View>
            <View style={styles.headerDiv}>
              <TouchableOpacity
                style={{paddingRight: 10}}
                onPress={() => props.navigation.navigate('AuditDashboard')}>
                <Icon name="home" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <ScrollView horizontal={true}>
          <RenderHtml source={htmlsource} contentWidth={width} />
        </ScrollView>
        <View style={{padding: 15}}>
          <TouchableOpacity onPress={publishdocumentAPI}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#14D0AE', '#1FBFD0', '#2EA4E2']}
              style={{
                height: 50,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,
              }}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',

                    color: '#ffffff',
                    backgroundColor: 'transparent',
                    fontSize: 16,
                    fontFamily: 'OpenSans-Bold',
                  }}>
                  Publish Document
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <ToastNew config={toastConfig} />
    </>
  );
}
