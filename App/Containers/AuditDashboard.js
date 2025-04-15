import React, {Component} from 'react';
import {connect} from 'react-redux';
import OfflineNotice from '../Components/OfflineNotice';
import {View, ImageBackground, BackHandler} from 'react-native';
import styles from './Styles/AuditDashboardStyle';
import AppHeader from '../Components/AppHeader';
import AuditForeground from '../Components/AuditForeground';
import AuditDashboardBody from '../Components/AuditDashboardBody';
import AuditHeader from '../Components/AuditHeader';
import Images from '../Themes/Images';

/* import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import AuditDashboardHeader from '../Components/AuditDashboardHeader'
import AuditBackground from "../Components/AuditBackground"; */

class AuditDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFlag: false,
      filterVal: 0,
      Audit: '',
    };
    // console.log('AuditDash Store', this.props)
  }

  onRecieveSearch(flag) {
    if (flag) {
      this.setState(
        {
          searchFlag: flag,
        },
        () => {
          console.log('recieved');
        },
      );
    } else {
      this.setState(
        {
          searchFlag: flag,
          Audit: '',
        },
        () => {
          console.log('recieved');
        },
      );
    }
  }

  onSearchSubmit(Audit) {
    this.setState({Audit: Audit}, () => {
      console.log('Search result', this.state.Audit);
    });
  }

  filterChange(type) {
    this.setState(
      {
        filterVal: type,
      },
      () => {
        console.log('Filter type: ' + this.state.filterVal);
      },
    );
  }
  componentDidMount() {
    console.log('loggggg111111',this.props);
    
  }
  render() {
    const style = {backgroundColor: '#000'};

    return (
      <View style={styles.wrapper}>
        {/* Offline notification */}
        <OfflineNotice />

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: null,
          }}>
          <View style={styles.auditBodyContent}>
            {/* Header */}
            <AppHeader
              navigation={this.props.navigation}
              onSearch={this.onRecieveSearch.bind(this)}
            />

            {/* Audit Stats */}
            {/* <AuditForeground
              navigation={this.props.navigation}
              onSearchSubmit={this.onSearchSubmit.bind(this)}
              onFilterChange={this.filterChange.bind(this)}
              searchFlag={this.state.searchFlag}
            /> */}
          </View>
        </ImageBackground>

        {/* Audit List & filters */}
        {/* <AuditDashboardBody
          searchFlag={this.state.searchFlag}
          onFilterChange={this.filterChange.bind(this)}
          filterType={this.state.filterVal}
          onRecieveSearchSubmit={this.state.Audit}
          navigation={this.props.navigation}
        /> */}

        {/* Audit Menus */}
        <AuditHeader navigation={this.props.navigation} />

        {/* <ParallaxScroll
            style={style}
            renderHeader={({ height, animatedValue }) => (
              <AppHeader height={height}
                        animatedValue={animatedValue}
                        data={this.props}
                        navigation={this.props.navigation}/>
            )}
            headerHeight={50}
            isHeaderFixed={false}
            parallaxHeight={320}
            useNativeDriver={true}
            isBackgroundScalable={true}
            headerBackgroundColor={'transparent'}
            renderParallaxForeground={({ height, animatedValue }) =>
              <AuditDashboardHeader height={height}
                                  withAvatar
                                  animatedValue={animatedValue}
                                  data={this.props}
                                  navigation={this.props.navigation} />}
            renderParallaxBackground={({ animatedValue }) =>
              <AuditBackground animatedValue={animatedValue} />}
            fadeOutParallaxBackground={false}
            fadeOutParallaxForeground={true}
            headerFixedBackgroundColor={'transparent'}
            parallaxBackgroundScrollSpeed={5}
            parallaxForegroundScrollSpeed={2.5}
          >
            <AuditDashboardBody navigation={this.props.navigation} />
          </ParallaxScroll> */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditDashboard);
