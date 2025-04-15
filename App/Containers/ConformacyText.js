import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import Voice from '@react-native-community/voice';
import Icon from 'react-native-vector-icons/FontAwesome';
import ResponsiveImage from 'react-native-responsive-image';
import {width} from 'react-native-dimension';
import styles from './Styles/CreateAttachStyle';
import {strings} from '../Language/Language';
import {Images} from '../Themes';
import {debounce, once} from 'underscore';

const debounceFunction = (func, delay) => {
  let timer;
  return function () {
    let self = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(self, args);
    }, delay);
  };
};

const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>;

const ConformacyText = ({
  index,
  item,
  state,
  navigation,
  auditId,
  updateConformacyText,
  updateConformacyDetails,
  clauseMandatory,
  userID,
  multiprocess,
  started,
  conformTextValue
}) => {

  const changeTextDebouncer = useCallback(
    debounceFunction(
      (nextValue, processId) => updateConformacyText(nextValue, processId),
      1000,
    ),
    [],
  );
 console.log('updateConformacyTextconformTextValue',conformTextValue);
 console.log('updateConformacyDetails',state);

  const richText = React.useRef();
  
  return (
    <View style={componentStyles.container}>
      <View style={[styles.auditBoxStatusBar, {backgroundColor: item.color}]} />
      <View
        style={{
          flex: 1,
          height: '100%',
          marginTop: 5,
          bottom: 5,
        }}>
        <View
          style={{
            flex: 0.8,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'grey',
              fontFamily: 'OpenSans-Regular',
            }}>
            {'Process Name : '}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#000',
              fontFamily: 'OpenSans-Bold',
              marginBottom: 2,
            }}>
            {item.ProcessName}
          </Text>
        </View>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            enabled={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <RichEditor
                ref={richText}
                placeholder={'Please Enter Audit Trail'}
                initialContentHTML={item?.Conformance || ''}
                initialHeight={100}
                onBlur={() => {
                  richText?.current?.blurContentEditor();
                }}
                onChange={text => {
                  let modifiedArr = state.auditDetailList;
                  modifiedArr[index].Conformance = text;
                  updateConformacyDetails('auditDetailList', [...modifiedArr]);
                  changeTextDebouncer(text, item?.ProcessID);
                }}
              />
            </TouchableWithoutFeedback>
            <TextInput style={{fontSize:16, color:'black'}}>{conformTextValue}</TextInput>
          </KeyboardAvoidingView>
        </ScrollView>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.foreColor,
            actions.setBackgroundColor,
          ]}
          iconMap={{[actions.heading1]: handleHead}}
        />
        {/* <TextInput
          multiline={true}
          value={(item?.Conformance || '')?.replace(/(<([^>]+)>)/gi, '')}
          //  onBlur={() => Keyboard.dismiss()}
          style={
            state.Confermacy ? styles.placeholderT1Label : styles.placeholderT1
          }
          placeholder={'Please Enter Audit Trail'}
          placeholderTextColor="#A9A9A9"
          baseColor="#A6A6A6"
          textColor="#747474"
          underlineColorAndroid="#A9A9A9"
          onChangeText={text => {
            let modifiedArr = state.auditDetailList;
            modifiedArr[index].Conformance = text;
            updateConformacyDetails('auditDetailList', [...modifiedArr]);
            changeTextDebouncer(text, item?.ProcessID);
            // setState({
            //   auditDetailList: [...modifiedArr],
            // });
            // changeTextDebouncer(text, item);
          }}
        /> */}
        <View
          style={{
            width: '25%',
            flex: 0.8,
            alignSelf: 'flex-end',
            marginTop: 3,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              richText.current?.dismissKeyboard();
              navigation.navigate('NCOFIPage', {
                auditDetailsList: state.auditDetailList,
                CreateNCdataBundle: {
                  AuditID: auditId,
                  AuditOrder: state.AUDITYPE_ORDER,
                  title: state.AUDIT_NO,
                  auditstatus: '2',
                  SiteID: state.SITEID,
                  Formid: '0',
                  ChecklistID: '0',
                  AUDIT_NO: state.AUDIT_NO,
                  breadCrumb: state.breadCrumb,
                  Conformance: item.Conformance,
                  ProcessID: item.ProcessID,
                  ProcessName: item.ProcessName,
                  clauseMandatory: clauseMandatory,
                  userID: userID,
                  multiprocess: multiprocess,
                },
              });
            }}
            style={{
              alignItems: 'center',
            }}>
            {/* <ResponsiveImage source={Images.BTN5} initWidth="26" initHeight="25"/> */}
            <Icon name="file" size={20} color="grey" />
            <Text style={styles.footerTextContent}>{strings.NC_OFI}</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              onPress={() => {
                // !started
                //   ? debounce(startVoicePress, 800)
                //   : debounce(stopVoicePress, 800);
                navigation.navigate('ConformacyVoice',  {auditDetailsList: state.auditDetailList,
                CreateNCdataBundle: {
                  AuditID: auditId,
                  AuditOrder: state.AUDITYPE_ORDER,
                  title: state.AUDIT_NO,
                  auditstatus: '2',
                  SiteID: state.SITEID,
                  Formid: '0',
                  ChecklistID: '0',
                  AUDIT_NO: state.AUDIT_NO,
                  breadCrumb: state.breadCrumb,
                  Conformance: item.Conformance,
                  ProcessID: item.ProcessID,
                  ProcessName: item.ProcessName,
                  clauseMandatory: clauseMandatory,
                  userID: userID,
                  multiprocess: multiprocess,
                }})
                // navigation.navigate('ConformacyVoice',{ data: dataToSend })

              }}>
              {started ? (
                <Icon
                  name="assistive-listening-systems"
                  size={25}
                  color="white"
                />
              ) : (
                <Icon name="microphone" size={25} color="grey" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConformacyText;

const componentStyles = StyleSheet.create({
  container: {
    width: '95%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    elevation: 5,
    borderColor: 'lightgrey',
    padding: 20,
  },
});
