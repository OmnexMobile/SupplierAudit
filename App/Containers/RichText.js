import React from 'react';
import { 
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet
} from 'react-native';
import Fonts from '../Themes/Fonts';
import { RichEditor} from 'react-native-pell-rich-editor';


const RichText = ({content,height}) => {
console.log('RichText', content , 'height', height) 

const rtf = React.useRef();
  return <ScrollView>
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}> */}
            <RichEditor
              ref={rtf}             
              initialContentHTML={content}
              initialHeight={height == undefined ? 200 : height}
              disabled={true}       
              style={styles.quesText}    
              useContainer={true}  
            />
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
};

export default RichText;

const styles = StyleSheet.create({
  quesText: {
    fontSize: Fonts.size.mediump,
    width: '100%',
    color: 'black',
    fontFamily:'OpenSans-Regular',
    padding: 5,
    marginTop: 5
    // backgroundColor:'yellow',
  },
})
