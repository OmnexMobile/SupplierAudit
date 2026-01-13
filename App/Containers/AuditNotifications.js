import React, { Component } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
//components
import OfflineNotice from "../Components/OfflineNotice";
import AuditCard from "../Components/AuditCard";
//library
import * as _ from "lodash";
import { connect } from "react-redux";
// import {width} from 'react-native-dimension';
//assets
import { Fonts, Images } from "../Themes";
import Icon from "react-native-vector-icons/FontAwesome";
//strings
import { strings } from "../Language/Language";

const { whitneyBook_18 } = Fonts.style;
const { blackGrey } = Fonts.colors;
const { width } = Dimensions.get("window");

class AuditNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.navigation.getParam("notifications"),
      notificationsList: _.slice(
        this.props.navigation.getParam("notifications"),
        0,
        20
      ),
    };
  }

  componentDidMount() {
    if (this.props.data.audits.language === "Chinese") {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage("zh");
        this.setState({});
        // console.log('Chinese script on',this.state.ChineseScript)
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === "English"
    ) {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage("en-US");
        this.setState({});
      });
    }
  }

  render() {
    console.log("notificationsList", this.state.notificationsList);
    return (
      <View style={styles.wrapper}>
        {/* Offline notification */}
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={styles.headerBackground}
          imageStyle={{ resizeMode: "stretch" }}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="angle-left" size={30} color="white" />
            </TouchableOpacity>

            <View style={styles.heading}>
              <Text numberOfLines={1} style={styles.headingText}>
                {strings.notifications}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => this.props.navigation.navigate("AuditDashboard")}
            >
              <Icon name="home" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.body}>
          {this.state.notificationsList.length === 0 ? (
            <View style={styles.errorWrapper}>
              <Text
                style={[
                  whitneyBook_18,
                  blackGrey,
                  { fontFamily: "OpenSans-Bold" },
                ]}
              >
                {strings.nonewnotificationfound}
              </Text>
            </View>
          ) : (
            this.renderFlatList()
          )}
        </View>
      </View>
    );
  }

  renderFlatList() {
    return (
      <FlatList
        contentContainerStyle={styles.listPadding}
        data={this.state.notificationsList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        //keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <AuditCard
            dateFormat={this.props.data.audits.userDateFormat}
            item={item}
            index={index}
            length={this.state.notificationsList.length + 1}
          />
        )}
        keyExtractor={(item) => item.key}
        onEndReachedThreshold={Platform.OS === "ios" ? 0 : 0.5}
        onEndReached={({ distanceFromEnd }) => {
          if (!this.onEndReachedCalledDuringMomentum) {
            const { allNotifications, notificationsList } = this.state;
            if (allNotifications.length > 20) {
              if (notificationsList.length < allNotifications.length) {
                const newData = _.slice(
                  allNotifications,
                  notificationsList.length,
                  notificationsList.length + 20
                );
                //settng true user keep on dragging will elimintae unnecessary call
                this.onEndReachedCalledDuringMomentum = true;
                const setNewData = _.concat(notificationsList, newData);
                this.setState({ notificationsList: setNewData });
                //once data has been reloaded
                //setting to false so next time user can reload data
                this.onEndReachedCalledDuringMomentum = false;
              }
            }
          }
        }}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  auditBodyContent: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  //header
  header: {
    width: "100%",
    // zIndex: 3000,
    flexDirection: "row",
    padding: 5,
    justifyContent: "flex-start",
    alignContent: "center",
    height: 60,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: "lightgrey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  backlogo: {
    flexDirection: "row",
    backgroundColor: "transparent",
    // width:'25%',
    height: 65,
    justifyContent: "flex-start",
    alignContent: "center",
    //marginLeft:10
  },
  heading: {
    //  flexDirection: 'column',
    //  justifyContent:'flex-start',
    // alignContent:'center',
    // width:'65%',
    // height: 65,
  },
  headingText: {
    fontSize: Fonts.size.h6,
    color: "#fff",
    textAlign: "center",
    // fontWeight:'bold'
    fontFamily: "OpenSans-Bold",
  },
  headerDiv: {
    width: "15%",
    height: 65,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    width: "100%",
  },
  headerBackground: {
    width: "100%",
    height: width * 0.2, // Responsive height
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  heading: {
    flex: 1,
    alignItems: "center",
  },
  headingText: {
    fontSize: width * 0.05, // Responsive font size
    color: "white",
    fontWeight: "bold",
  },
  homeButton: {
    padding: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps)(AuditNotifications);
