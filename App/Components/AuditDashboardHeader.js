import React, { Component } from 'react'
import {Animated, ImageBackground} from 'react-native';
import styles from './Styles/AuditDashboardHeaderStyle'
import AuditHeader from './AuditHeader'
import AuditForeground from "./AuditForeground";
import Images from "../Themes/Images";
import {connect} from "react-redux";

class AuditDashboardHeader extends Component {

  constructor(props){
    super(props);
  }

  static defaultProps = {
    height: 50,
    withAvatar: false,
    animatedValue: new Animated.Value(0)
  };

  render() {
    const opacity = this.props.withAvatar
      ? this.props.animatedValue.interpolate({
        inputRange: [0, this.props.height - 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
      : 1;

    const scale = this.props.withAvatar
      ? this.props.animatedValue.interpolate({
        inputRange: [0, 160],
        outputRange: [1, 0.8],
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
      : 1;

    const translateY = this.props.withAvatar
      ? this.props.animatedValue.interpolate({
        inputRange: [0, 160],
        outputRange: [0, 20],
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
      : 1;

    let wrapperStyle = {};

    if (this.props.withAvatar) {
      wrapperStyle = {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      };
    }

    return (

      <ImageBackground source={Images.DashBack} style={{flex: 1, width: '100%'}}>
        <Animated.View style={[styles.wrapper, wrapperStyle]} pointerEvents="box-none">
          <Animated.View style={[styles.background, { opacity }]} pointerEvents="box-none" />
          <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
            <AuditForeground/>
          </Animated.View>
        </Animated.View>
        <AuditHeader/>
      </ImageBackground>

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

export default connect(mapStateToProps, mapDispatchToProps)(AuditDashboardHeader)
