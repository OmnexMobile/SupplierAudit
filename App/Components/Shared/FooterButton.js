import React, { Component } from 'react'
import {View,
  Image,
  SectionList,
  ScrollView,
  Text,
  Dimensions ,
  TouchableOpacity} from 'react-native'
import {connect} from "react-redux";
import styles from '../Styles/FooterButtonStyle'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const data = {
  title:'hello',
  data:['I m workiiiiiiiiing'],
  attach:['www.google.commmmmmm']
}

import { width , height , totalSize } from 'react-native-dimension'
let Window = Dimensions.get('window')
import { Images }from '../../Themes/index'


class FooterButton extends Component{



  constructor(props){
    super(props);
    this.state={
      index: 0,
      routes: [
        { key: 'first', title: 'Uploaded' },
        { key: 'second', title: 'Pending' },
      ]
    }
  }
  getSectionListItem(item){
    console.log('item')
  }



    render(){
      const FirstRoute = () => (
        <View style={{ backgroundColor: '#fff', flex:1 }}>
          <View style={{top:height(5)}}>
          <SectionList
            renderSectionHeader={({section: {title}}) => (
              <View style={styles.titleView}>
              <View style={styles.titleCard}>
                <View style={{left:15,}}>
                <Text style={{fontWeight: 'bold' , fontSize:totalSize(2)}}>Form Name</Text>
                <Text style={{fontWeight: 'bold', fontSize:totalSize(2.5), color:'#02095F'}}>{title}</Text>
                </View>
              </View>
              </View>
            )}
            sections={[data]}
            renderItem={({item, index, section}) =>
              <View style={styles.titleView}>
                <View style={styles.titleCard}>
                  <View style={{left:15,}}>
                    <Text style={{fontWeight: 'bold' , fontSize:totalSize(2)}}>Attatch Documents</Text>
                    <Text key={index} style={{fontWeight: 'bold' , fontSize:totalSize(2) , color:'#02095F'}}>{section.data[index]}</Text>
                  </View>
                  <TouchableOpacity style={{marginLeft: 170 ,top:height(1), height:null,width:null}}>
                    <Image source={Images.AttachIcon}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.titleCard1}>
                  <View style={{left:15,}}>
                    <Text style={{fontWeight: 'bold' , fontSize:totalSize(2)}}>Uncontrolled Link</Text>
                    <Text key={index} style={{fontWeight: 'bold', fontSize:totalSize(2), color:'#02095F'}}>{section.attach[index]}</Text>
                  </View>
                  <TouchableOpacity style={{marginLeft: 95 ,top:height(1), height:null,width:null}}>
                    <Image source={Images.AttachIcon}/>
                  </TouchableOpacity>
                </View>
              </View>
            }
            keyExtractor={(item, index) => item + index}
          />
          </View>
        </View>
      );
       const SecondRoute = () => (
        <View style={{ backgroundColor: '#fff', flex:1 }}>
          <View style={{top:height(5)}}>
            <SectionList
              renderSectionHeader={({section: {title}}) => (
                <View style={styles.titleView}>
                  <View style={styles.titleCard}>
                    <View style={{left:15,}}>
                      <Text style={{fontWeight: 'bold' , fontSize:totalSize(2)}}>Form Name</Text>
                      <Text style={{fontWeight: 'bold', fontSize:totalSize(2.5), color:'#02095F'}}>{title}</Text>
                    </View>
                  </View>
                </View>
              )}
              sections={[data
              ]}
              renderItem={({item, index, section}) =>
                <View style={styles.titleView}>
                  <View style={styles.titleCard}>
                    <View style={{left:15,}}>
                      <Text style={{fontWeight: 'bold' , fontSize:totalSize(2)}}>Attatch Documents</Text>
                      <Text key={index} style={{fontWeight: 'bold' , fontSize:totalSize(2) , color:'#02095F'}}>{section.data[index]}</Text>
                    </View>
                    <TouchableOpacity style={{marginLeft: 170 ,top:height(1), height:null,width:null}}>
                      <Image source={Images.AttachIcon}/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.titleCard1}>
                    <View style={{left:15,}}>
                      <Text style={{fontWeight: 'bold' , fontSize:totalSize(2)}}>Uncontrolled Link</Text>
                      <Text key={index} style={{fontWeight: 'bold', fontSize:totalSize(2), color:'#02095F'}}>{section.attach[index]}</Text>
                    </View>
                    <TouchableOpacity style={{marginLeft: 95 ,top:height(1), height:null,width:null}}>
                      <Image source={Images.AttachIcon}/>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </View>
      );


        return(
              <TabView
                navigationState={this.state}
                renderScene={SceneMap({
                  first: FirstRoute,
                  second: SecondRoute,
                })}
                onIndexChange={index => this.setState({ index })}
                // initialLayout={{ height:'50%',width: '50%'}}
              />
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
  export default connect(mapStateToProps, mapDispatchToProps)(FooterButton)
