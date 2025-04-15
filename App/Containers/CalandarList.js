import React, {Component} from 'react';
import {View, ImageBackground, TouchableOpacity, Text} from 'react-native';
//styles
import styles from './Styles/CalandarListStyle';
//components
import OfflineNotice from '../Components/OfflineNotice';
//library
import * as _ from 'lodash';
import {DoubleBounce} from 'react-native-loader';
import {CalendarList, Calendar} from 'react-native-calendars';
import {connect} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
//assets
import {Images, Fonts} from '../Themes';
import Icon from 'react-native-vector-icons/FontAwesome';
//services
import auth from '../Services/Auth';
//strings
import {strings} from '../Language/Language';
import Moment from 'moment';
import {ActivityIndicator} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

// const nodeColors = ["rgb(168,224,166)", "rgb(255,206,101)", "rgb(252,151,96)", "#138D75",
//     "#E59866", "#5D6D7E", "#9B59B6", "#E74C3C", "#48C9B0", "#FA8072", "#FF00FF", "#000080"]

const nodeOBJColors = {
  2: '#F1EB0E',
  3: 'green',
  4: 'red',
  5: '#AB8C32',
};

const {whitneyBook_18} = Fonts.style;
const {blackGrey} = Fonts.colors;
const yearList = [
  {label: '2000', value: '2000'},
  {label: '2001', value: '2001'},
  {label: '2002', value: '2002'},
  {label: '2003', value: '2003'},
  {label: '2004', value: '2004'},
  {label: '2005', value: '2005'},
  {label: '2006', value: '2006'},
  {label: '2007', value: '2007'},
  {label: '2008', value: '2008'},
  {label: '2009', value: '2009'},
  {label: '2010', value: '2010'},
  {label: '2011', value: '2011'},
  {label: '2012', value: '2012'},
  {label: '2013', value: '2013'},
  {label: '2014', value: '2014'},
  {label: '2015', value: '2015'},
  {label: '2016', value: '2016'},
  {label: '2017', value: '2017'},
  {label: '2018', value: '2018'},
  {label: '2019', value: '2019'},
  {label: '2020', value: '2020'},
  {label: '2021', value: '2021'},
  {label: '2022', value: '2022'},
  {label: '2023', value: '2023'},
  {label: '2024', value: '2024'},
  {label: '2025', value: '2025'},
  {label: '2026', value: '2026'},
  {label: '2027', value: '2027'},
  {label: '2028', value: '2028'},
  {label: '2029', value: '2029'},
  {label: '2030', value: '2030'},


  // { label: '2024', value: '5' },
  // { label: '2026', value: '5' },
  // { label: '2027', value: '5' },
  // { label: '2028', value: '5' },
  // { label: '2029', value: '5' },
  // { label: '2030', value: '5' },
];

const monthList = [
  {label: 'jan', value: '01'},
  {label: 'Feb', value: '02'},
  {label: 'Mar', value: '03'},
  {label: 'Apr', value: '04'},
  {label: 'May', value: '05'},
  {label: 'Jun', value: '06'},
  {label: 'Jul', value: '07'},
  {label: 'Aug', value: '08'},
  {label: 'Sep', value: '09'},
  {label: 'Oct', value: '10'},
  {label: 'Nov', value: '11'},
  {label: 'Dec', value: '12'},
];
class CalandarList extends Component {
  constructor(props) {
    super(props);
    this.multiperiods = {};
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const currentYear = String(currentDate.getFullYear());
    this.state = {
      loader: true,
      error: false,
      apiData: [],
      dateWiseSplit: [],
      calendarPeriods: {},
      startDate: '',
      endDate: '',
      start: '',
      end: '',
      month_change: '',
      monthValue: currentMonth,
      yearValue: currentYear,
      calendarupdateKey: ''
    };
  }

  componentDidMount() {
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ChineseScript: true}, () => {
        strings.setLanguage('zh');
        this.setState({});
        // console.log('Chinese script on',this.state.ChineseScript)
      });
    } else if (
      this.props.data.audits.language === null ||
      this.props.data.audits.language === 'English'
    ) {
      this.setState({ChineseScript: false}, () => {
        strings.setLanguage('en-US');
        this.setState({});
      });
    }
    this.getYearAudits();
  }

  getYearAudits() {
    const {userId, token} = this.props.data.audits;
    const siteId = this.props.data.audits.siteId;
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        auth.getYearAudit(siteId, userId, token, (response, data) => {
          if (data.data) {
            if (data.data.Message === 'Success') {
              if (data.data.Data && data.data.Data.length > 0) {
                this.transformYearAudits(data.data.Data);
              } else {
                this.setState({loader: false, error: false});
              }
            } else {
              this.setState({loader: false, error: false});
            }
          } else {
            this.setState({loader: false, error: false});
          }
        });
      } else {
        /** offline */
      }
    });
  }

  /**
   * @param {*} yearAudits will be array of object yearAudits from API
   * [ {AuditID: "21", AuditNumber: "2018-MC-I9-2-2", StartDate: "2018-04-30T08:00:00", EndDate: "2018-05-01T17:00:00"} ]
   */
  transformYearAudits(yearAudits) {
    let index = 0;
    let self = this;
    let dateWiseSplit = [];
    let dateWiseSplitKeys = {};
    _.forEach(yearAudits, function (yearAudit_res) {
      if (yearAudit_res.StartDate && yearAudit_res.EndDate) {
        let dateS = new Date(yearAudit_res.StartDate);
        let _s_month =
          dateS.getMonth() + 1 < 10
            ? '0' + (dateS.getMonth() + 1)
            : dateS.getMonth() + 1;
        let _s_datestr =
          dateS.getDate() < 10 ? '0' + dateS.getDate() : dateS.getDate();
        let start_key = dateS.getFullYear() + '-' + _s_month + '-' + _s_datestr;
        let dateE = new Date(yearAudit_res.EndDate);
        let _e_month =
          dateE.getMonth() + 1 < 10
            ? '0' + (dateE.getMonth() + 1)
            : dateE.getMonth() + 1;
        let _e_datestr =
          dateE.getDate() < 10 ? '0' + dateE.getDate() : dateE.getDate();
        let end_key = dateS.getFullYear() + '-' + _e_month + '-' + _e_datestr;

        /** caluclating between dates */
        let betweenDates = 1;
        if (parseInt(_s_datestr) < parseInt(_e_datestr)) {
          betweenDates = parseInt(_e_datestr) - parseInt(_s_datestr);
        } else {
          betweenDates = parseInt(_s_datestr) - parseInt(_e_datestr);
        }

        dateWiseSplitKeys[start_key] = {};
        dateWiseSplitKeys[end_key] = {};

        //nodeOBJColors[parseInt(yearAudit_res.status)],

        /** retreiving insertion index of the particular audit */
        let indexIamInserting = self.multiPeriodMark(
          start_key,
          end_key,
          nodeOBJColors[yearAudit_res.AuditStatus],
          'start',
          undefined,
        );
        /** between dates wil lies in 1 example startDate: 2020-02-10, endDate: 2020-02-11 */
        if (betweenDates !== 1 && betweenDates !== 0) {
          let i = 1;
          /** loopin gour between dates */
          while (i < betweenDates) {
            const nextDate = new Date(dateS);
            nextDate.setDate(nextDate.getDate() + i);

            let _mid_month =
              nextDate.getMonth() + 1 < 10
                ? '0' + (nextDate.getMonth() + 1)
                : nextDate.getMonth() + 1;
            let _mid_datestr =
              nextDate.getDate() < 10
                ? '0' + nextDate.getDate()
                : nextDate.getDate();
            let mid_key =
              nextDate.getFullYear() + '-' + _mid_month + '-' + _mid_datestr;

            if (
              nextDate.getDate() === dateE.getDate() &&
              nextDate.getMonth() === dateE.getMonth() &&
              nextDate.getFullYear() === dateE.getFullYear()
            ) {
              i = betweenDates;
            } else {
              dateWiseSplitKeys[mid_key] = {};
              /** creating between dates keys and insert in calendar period */
              let ind = self.multiPeriodMark(
                mid_key,
                undefined,
                nodeOBJColors[yearAudit_res.AuditStatus],
                'middle',
                indexIamInserting,
              );
              i++;
            }
          }
        }
      }
      // if (nodeColors[(index + 1)]) {
      //     index = index + 1
      // } else {
      //     index = 0
      // }

      dateWiseSplitKeys = {};
      dateWiseSplit.push(dateWiseSplitKeys);
    });

    this.setState({
      dateWiseSplit,
      apiData: yearAudits,
      calendarPeriods: this.multiperiods,
      loader: false,
      error: false,
    });
  }

  /**
   *
   * @param {*} start_key - starting date
   * @param {*} end_key   - ending date
   * @param {*} color     - color for the audit line
   * @param {*} middle    - "middle" || "start"
   * @param {*} index     - (int) || undefined
   */
  multiPeriodMark(start_key, end_key, color, middle, index) {
    let indexIamInserting = 0;
    /** The Start date key is validated either already the date is avaliable or not */
    if (this.multiperiods[start_key]) {
      let start_periods = this.multiperiods[start_key].periods;
      /** if the given audit lies between many dates we need to create as transparent object */
      /** we need to insert before the our first object insertion */
      // if (middle === "middle" && index) {
      //     if (start_periods.length < index) {
      //         let i = start_periods.length;
      //         while (i < index) {
      //             start_periods.push({ color: 'transparent' })
      //             i++;
      //         }
      //     }
      // }
      /** inserting the object pair in to localized object */
      this.multiperiods[start_key] = {
        periods: [
          ...start_periods,
          {
            startingDay: middle === 'middle' ? false : true,
            endingDay: start_key === end_key ? true : false,
            color,
          },
        ],
      };
      indexIamInserting = start_periods.length;
    } else {
      /** if the given audit lies between many dates we need to create as transparent object */
      /** we need to insert before the our first object insertion */
      // let dummyTrans = []
      // if (middle === "middle" && index) {
      //     let i = 0;
      //     while (i < index) {
      //         dummyTrans.push({ color: 'transparent' })
      //         i++;
      //     }
      // }
      /** inserting the object pair in to localized object */
      this.multiperiods[start_key] = {
        periods: [
          // ...dummyTrans,
          {
            startingDay: middle === 'middle' ? false : true,
            endingDay: start_key === end_key ? true : false,
            color,
          },
        ],
      };
      /** if the date key ia not already in the object pair insertion index will kept as zero */
    }
    /** For creating the between dates end day will be sent as undefined */
    if (end_key && start_key !== end_key) {
      /** The End date key is validated either already the date is avaliable or not */
      if (this.multiperiods[end_key]) {
        let end_periods = this.multiperiods[end_key].periods;

        // if (middle !== "middle" && end_periods.length < indexIamInserting) {
        //     let i = end_periods.length;
        //     while (i < indexIamInserting) {
        //         end_periods.push({ color: 'transparent' })
        //         i++;
        //     }
        // }

        this.multiperiods[end_key] = {
          periods: [
            ...end_periods,
            {
              startingDay: false,
              endingDay: middle === 'middle' ? false : true,
              color,
            },
          ],
        };
      } else {
        /** if the given audit lies between many dates we need to create as transparent object */
        /** we need to insert before the our first object insertion */
        // let dummyTrans = []
        // if (middle !== "middle") {
        //     let i = 0;
        //     while (i < indexIamInserting) {
        //         dummyTrans.push({ color: 'transparent' })
        //         i++;
        //     }
        // }
        this.multiperiods[end_key] = {
          periods: [
            // ...dummyTrans,
            {
              startingDay: false,
              endingDay: middle === 'middle' ? false : true,
              color,
            },
          ],
        };
      }
    }

    return indexIamInserting;
  }
calendarUpdate(value){
  console.log("XXXXXXXSDSDSDFDS", value);
this.setState({
  calendarupdateKey:value
})
}
  render() {
    console.log('xxxxxx!!!!!!!!!!!!', this.state.yearValue);
    return (
      <View style={styles.container}>
        {/* Offline notification */}
        <OfflineNotice />
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: null,
          }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.backlogo}>
              <Icon name="angle-left" size={40} color="white" />
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {strings.FilterMenuCalendar}
              </Text>
            </View>
            <Text style={styles.headerDiv} />
          </View>
        </ImageBackground>
        {/* <View style={{alignItems:"center",margin:5}}><Text style={{color:"red"}}>{"Note: Please select month and year to update"}</Text></View> */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',marginTop:'2%'
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40%',
              borderRadius:10,borderColor:"#20b1d2",borderWidth:2
            }}>
            <View style={{}}>
              <Text style={{fontWeight:'bold'}}>Month</Text>
            </View>
            <View style={{marginLeft: '5%', width: '50%'}}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={monthList}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Month"
                // searchPlaceholder="Search..."
                value={this.state.monthValue}
                onChange={item => {
                  console.log('mmm2@@@@@@@@', item);
                  this.setState({monthValue: item.value});
                  this.calendarUpdate(item.value)
                }}
              />
            </View>
          </View>
          <View style={{width:'2%'}}></View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40%',
              borderRadius:10,borderColor:'#20b1d2',borderWidth:2
            }}>
            <View style={{}}>
              <Text style={{fontWeight:'bold'}}>Year</Text>
            </View>
            <View style={{marginLeft: '5%', width: '50%'}}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={yearList}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Year"
                // searchPlaceholder="Search..."
                value={this.state.yearValue}
                onChange={item => {
                  this.setState({yearValue: item.value});
                  this.calendarUpdate(item.value)

                }}
              />
            </View>
          </View>
        </View>
        {this.state.loader ? (
          <View style={styles.wrapper}>
            <View style={styles.loaderParent}>
              <ActivityIndicator size={20} color="#1CAFF6" />
            </View>
          </View>
        ) : this.state.error ? (
          <View style={styles.errorWrapper}>
            <Text
              style={[
                whitneyBook_18,
                blackGrey,
                {fontFamily: 'OpenSans-Regular'},
              ]}>
              {strings.No_records_found}
            </Text>
          </View>
        ) : (
          this.renderCalandar()
        )}
      </View>
    );
  }

  renderCalandar() {
    console.log('xxxxxx!!!!!!!!!!!!222', this.state.yearValue);
    return (
      <View style={{padding: 5}}>
        <Calendar
          style={styles.calendar}
          key={this.state.calendarupdateKey}
          current={`${this.state.yearValue}-${this.state.monthValue}-01`}
          onDayPress={day => {
            this.OnCalenderFilter(day);
          }}
          markedDates={this.state.calendarPeriods}
          markingType="multi-period"
          hideArrows={false}
          onMonthChange={month => {
            console.log('month changed', month);
          }}
          theme={{
            textDayFontFamily: 'OpenSans-Regular',
            textMonthFontFamily: 'OpenSans-Regular',
            textDayHeaderFontFamily: 'OpenSans-Regular',
          }}
        />
      </View>
    );
  }

  // renderCalandar() {
  //     return (
  //         <CalendarList

  //             calendarHeight={450}
  //             // pagingEnabled={true}
  //             // Callback which gets executed when visible months change in scroll view. Default = undefined
  //             onVisibleMonthsChange={(months) => { }}
  //             // Max amount of months allowed to scroll to the past. Default = 50
  //             pastScrollRange={50}
  //             // Max amount of months allowed to scroll to the future. Default = 50
  //             futureScrollRange={50}
  //             // Enable or disable scrolling of calendar list
  //             scrollEnabled={true}
  //             // Enable or disable vertical scroll indicator. Default = false
  //             showScrollIndicator={true}
  //             // Collection of dates that have to be colored in a special way. Default = {}
  //             markedDates={this.state.calendarPeriods}
  //             // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
  //             markingType='multi-period'
  //             // markingType={'period'}
  //             // maxDate={'2020-03-30'}
  //             onDayPress={(day) => { this.OnCalenderFilter(day) }}
  //         />
  //     )
  // }

  OnCalenderFilter(date) {
    let _s_month = date.month < 10 ? '0' + date.month : date.month;
    let _s_datestr = date.day < 10 ? '0' + date.day : date.day;
    let myKey = _s_month + '-' + _s_datestr + '-' + date.year;
    let myKey2 = date.year + '-' + _s_month + '-' + _s_datestr;
    let start_key = date.year + '-' + _s_month + '-' + _s_datestr;
    let markedDates = {
      ...this.state.calendarPeriods,
      [start_key]: {
        periods: [
          {
            startingDay: this.state.startDate === '' ? true : false,
            endingDay: this.state.startDate === '' ? false : true,
            color: '#2DDFBF',
          },
        ],
      },
    };
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@@', markedDates);
    this.setState({calendarPeriods: markedDates});
    if (this.state.startDate === '') {
      this.setState({startDate: myKey2, start: myKey});
      console.log('========>startifstatement', this.state.startDate);
      console.log('========>startifstatement22222', myKey2,myKey);


    } else if (this.state.endDate === '') {
      this.setState({endDate: myKey2, end: myKey}, () => {
        if (this.state.startDate !== '' && this.state.endDate !== '') {
          var StartDateTimeStamp = Moment(this.state.startDate).unix();
          var EndDateTimeStamp = Moment(this.state.endDate).unix();

          // var StartDateTimeStamp = this.state.startDate
          // var EndDateTimeStamp = this.state.endDate

          console.log('========>start', StartDateTimeStamp, EndDateTimeStamp);
          console.log('========>end', EndDateTimeStamp);

          if (StartDateTimeStamp > EndDateTimeStamp) {
            console.log(
              'reve correcrtStartDateTimeStamp < EndDateTimeStamp',
              StartDateTimeStamp,
              EndDateTimeStamp,
              this.state.endDate,
              this.state.startDate
            );
            Filter_StartDate = this.state.endDate;
            Filter_EndDate = this.state.startDate;
          } else {
            console.log(
              'correcrtStartDateTimeStamp < EndDateTimeStamp',
              StartDateTimeStamp,
              EndDateTimeStamp,
            );
            Filter_StartDate = this.state.startDate;
            Filter_EndDate = this.state.endDate;
          }

          this.props.navigation.push('AllTabAuditList', {
            navagationPage: "CalandarList",
            filter_Arr: [
              {
                filterType: 'Calendar',
                sortype: 0,
                startDate: Filter_StartDate,
                text: '',
                endDate: Filter_EndDate,
                globalSearch: null,
              },
            ],
          });
          this.setState({
            calendarPeriods: this.multiperiods,
            startDate: '',
            endDate: '',
            start: '',
            end: '',
          });
        }
      });
    }
  }

  /*
    checkForEndDate method is previous functionality selected Audit filter 
    */

  checkForEndDate(date) {
    let _s_month = date.month < 10 ? '0' + date.month : date.month;
    let _s_datestr = date.day < 10 ? '0' + date.day : date.day;
    let myKey = date.year + '-' + _s_month + '-' + _s_datestr;

    if (this.state.calendarPeriods[myKey]) {
      let matchedSet = {};
      _.forEach(this.state.dateWiseSplit, function (dateSplit) {
        let breakLoop = true;
        _.forEach(dateSplit, function (actDates, actKey) {
          if (actKey === myKey) {
            breakLoop = false;
            matchedSet = dateSplit;
            return false;
          }
        });
        return breakLoop;
      });

      // console.log("matchedSet",matchedSet)

      if (matchedSet) {
        let finalData = {};
        _.forEach(matchedSet, function (macthDate, matchKey) {
          let splitStr = matchKey.split('-');
          // console.log("splitStr",splitStr)
          let keyFormat = splitStr[1] + '-' + splitStr[2] + '-' + splitStr[0];
          // console.log("keyFormat",keyFormat)
          //o year 1 month 2 date
          let yearMon = parseInt(splitStr[0] + splitStr[1]);
          if (finalData[yearMon]) {
            let oldData = finalData[yearMon];
            finalData[yearMon] = {
              ...oldData,
              [parseInt(splitStr[2])]: keyFormat,
            };
          } else {
            finalData[yearMon] = {
              [parseInt(splitStr[2])]: keyFormat,
            };
          }
        });
        // console.log("finalData",finalData)
        let startDate = '';
        let yearKeys = Object.keys(finalData);

        // console.log("yearkeys", finalData)
        if (yearKeys.length > 1) {
          let startKeys = Object.keys(finalData[yearKeys[0]]);
          let endKeys = Object.keys(finalData[yearKeys[yearKeys.length - 1]]);

          startDate = finalData[yearKeys[0]][startKeys[0]];
          endDate =
            finalData[yearKeys[yearKeys.length - 1]][
              endKeys[endKeys.length - 1]
            ];

          // console.log("year diff startdtae is", startDate)
          // console.log("year diff endDate is", endDate)

          this.props.navigation.push('AllTabAuditList', {
            navagationPage: "CalandarList",
            filter_Arr: [
              {
                filterType: 'Calendar',
                sortype: 0,
                startDate,
                text: '',
                endDate,
                globalSearch: null,
              },
            ],
          });
        } else {
          //one year
          let datekeys = Object.keys(finalData[yearKeys[0]]);
          // console.log("date keys", datekeys)
          startDate = finalData[yearKeys[0]][datekeys[0]];
          endDate = finalData[yearKeys[0]][datekeys[datekeys.length - 1]];

          // console.log("startdtae is", startDate)
          // console.log("endDate is", endDate)

          this.props.navigation.push('AllTabAuditList', {
            navagationPage: "CalandarList",
            filter_Arr: [
              {
                filterType: 'Calendar',
                sortype: 0,
                startDate,
                text: '',
                endDate,
                globalSearch: null,
              },
            ],
          });
        }
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps)(CalandarList);

