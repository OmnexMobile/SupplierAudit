import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Text, Dimensions, TextInput} from 'react-native'
import { Images } from '../Themes'
import { connect } from 'react-redux'
import styles from './Styles/LanguageStyle'
import ResponsiveImage from 'react-native-responsive-image'
import Fonts from '../Themes/Fonts'
import Icon from 'react-native-vector-icons/FontAwesome'
import {strings} from '../Language/Language'
import Flag from 'react-native-flags'

let Window = Dimensions.get('window')

class Languages extends Component {
    constructor(props){
        super(props);
        this.state={
            Language: 'English',
            engMark:undefined
        }
    }

    componentDidMount(){
        console.log('Language mounted',this.props)
        this.markLang()
    }

    LanguageChange (Language)  {
        if(Language === 'English'){
        this.setState({ Language:'English'  },()=>{
            console.log('Language selected',this.state.Language)
            var newLanguage = this.state.Language
            this.props.storeLanguage(newLanguage)
            setTimeout(()=>{
                console.log('Language changed',this.props)
                strings.setLanguage('en-US')           
                this.setState({})
                this.markLang()
            },500)
            })
        }
        if(Language === 'Chinese'){
        this.setState({ Language:'Chinese'  },()=>{
        console.log('Language selected',this.state.Language)
        var newLanguage = this.state.Language
        this.props.storeLanguage(newLanguage)
        setTimeout(()=>{
            console.log('Language changed',this.props)
            strings.setLanguage('zh')
            this.setState({})
            this.markLang()
        },500)
        })
        }
    }

    markLang(){
        var data = this.props.data.audits.language
        if(data === null || data === 'English'){
            this.setState({ engMark : true })
        }
        else{
            this.setState({ engMark : false })
        }
    }

    render(){

        const JustAFlag = () =>
        <Flag
        code="US"
        size={32}
      />

      const JustAFlagCN = () =>
      <Flag
      code="CN"
      size={32}
    />

        return(
            <View style={styles.mainContainer}>
            <Image source={Images.LoginBack2} style={styles.backgroundImage} />

          <View style={styles.loginOmnexlogoDiv}>
            <View style={styles.loginOmnexlogo}>
              <ResponsiveImage source={Images.loadingLogo} initWidth="310" initHeight="69"/>
            </View>
            </View>
          

              <View style={{position:'absolute',width:Window.width,height:100,backgroundColor:'transparent'}}>

              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View style={styles.backlogo}>
                  <Icon  name="angle-left" size={40} color="#00c3c2"/>
                </View>
              </TouchableOpacity>
              </View>

              <View style={styles.body}>

                  <View style={styles.cont1}>
                  {/* color:'#007d7c' */}
                  {this.state.engMark === true ?
                  <View style={styles.cont02}>
                  <Text style={{fontSize:25,color:'black'}}>Hello!</Text>
                  <Text style={{fontSize:18,color:'grey'}}>Your default language is English(US)</Text>
                  </View>
                  :
                  <View style={styles.cont02}>
                  <Text style={{fontSize:25,color:'black'}}>你好！</Text>
                  <Text style={{fontSize:18,color:'grey'}}>您的默认语言是中文</Text>
                  </View>

                  }

                  <View style={styles.cont002}>
                  {this.state.engMark === true ?
                  <Text style={{fontSize:18,color:'grey'}}>
                  Please select your default language
                  </Text>:
                   <Text style={{fontSize:18,color:'grey'}}>
                  请选择您的默认语言
                 </Text>
                  }
                  <Text style={{fontSize:Fonts.size.h6,color:'grey'}}>
                  {strings.Please_select_your_default_language}
                  </Text>
                  </View>

                  <TouchableOpacity onPress={this.LanguageChange.bind(this,'English') } style={styles.cont2}>
                  <View style={{flexDirection:'row'}}>
                  <JustAFlag/>
                  <Text style={this.state.engMark === true ? {left:5,top:3,fontSize:Fonts.size.h6,color:'black'} :
                      {left:5,top:3,fontSize:Fonts.size.h6,color:'grey'}
                      }>English (US)</Text>
                  </View>
                  {this.state.engMark === true ?
                    <Icon  name="check" size={20} color="black"/>
                    :<View></View>
                  }
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={this.LanguageChange.bind(this,'Chinese') } style={styles.cont2}>
                  <View style={{flexDirection:'row'}}>
                  <JustAFlagCN/>
                  <Text style={this.state.engMark === false ? {left:5,top:3,fontSize:Fonts.size.h6,color:'black'} :
                      {left:5,top:3,fontSize:Fonts.size.h6,color:'grey'}
                      }>Chinese (中文)</Text>
                  </View>
                  {this.state.engMark === false ?
                  <Icon  name="check" size={20} color="black"/>
                  :<View></View>
                }
                  </TouchableOpacity>
                  </View>
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
        storeLanguage: (language) => dispatch({type: 'STORE_LANGUAGE', language})
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Languages)
