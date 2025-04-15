import React, { Component } from 'react'
import { Text, Image, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import styles from './Styles/FilterSectionStyle'
import { Dropdown } from 'react-native-element-dropdown'
import CalendarPicker from 'react-native-calendar-picker'
import Moment from 'moment';
import { connect } from "react-redux"
import Modal from "react-native-modal"
import { width, height } from 'react-native-dimension'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import Fonts from '../Themes/Fonts'
import { strings } from '../Language/Language'
import Icon from 'react-native-vector-icons/FontAwesome';
import { debounce, once } from "underscore";


class FilterSection extends Component {

  dropdata = [
    {
      text: 'StartDate',
      value: strings.SortByStartDate
    },
    {
      text: 'Auditee',
      value: strings.SortByAuditee
    },

    {
      text: 'EndDate',
      value: strings.SortByEndDate
    },
    {
      text: 'AuditNumber',
      value: strings.SortByAuditNo
    },
    {
      text: 'AuditCycleName',
      value: strings.SortByAuditCycle
    },
    /*{
      text: 'AuditProgramName',
      value: 'A.Program'
    },
    {
      text: 'AuditTypeName',
      value: 'A.Type'
    },
    {
      text: 'LeadAuditor',
      value: 'L.Auditor'
    },*/
    {
      text: 'cStatus',
      value: strings.SortByStatus
    }];

  constructor(props) {
    super(props);

    this.state = {
      sortypeForms: 0,
      sortypeStatus: parseInt(this.props.filterType),
      sortypeSort: 0,
      filter: '',
      droptext: 'AuditNumber',
      filterType: '',
      showRadioBtn: false,
      showRadioAll: true,
      showRadioRecent: false,
      showRadioForm: false,
      showRadioStat: false,
      showRadioSort: false,
      showRadioAdv: false,
      selectedStartDate: null,
      selectedEndDate: null,
      isModalVisible: false,
      auditDatesStyles: [],
      selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat

    }

    this.setAuditDates()
  }

  // componentWillReceiveProps() {
  //   var getCurrentPage = [] 
  //   getCurrentPage = this.props.data.nav.routes
  //   var CurrentPage = getCurrentPage[getCurrentPage.length-1].routeName
  //   console.log('--CurrentPage--->',CurrentPage)

  //   if(CurrentPage == 'AuditDashboard'){
  //     this.setAuditDates()
  //     this.setState({      
  //       sortypeStatus: (parseInt(this.props.filterType) > 0) ? parseInt(this.props.filterType) : this.state.sortypeStatus, 
  //       selectedFormat:this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat
  //     },()=>{
  //       console.log('changed')
  //     })
  //   }
  // }

  setAuditDates = () => {
    var auditList = this.props.data.audits.yearAudits
    var auditDatesStyles = []

    if (auditList) {
      for (var i = 0; i < auditList.length; i++) {
        var inDate = auditList[i].StartDate
        var sDateArr = inDate.split('T')
        var sDateValArr = sDateArr[0].split('-')
        var outDate = new Date(sDateValArr[0], sDateValArr[1] - 1, sDateValArr[2])
        auditDatesStyles.push({
          date: outDate,
          // Random colors
          style: { backgroundColor: '#A9ECF9' },
          textStyle: { color: 'black' }, // sets the font color
          containerStyle: [], // extra styling for day container
        });
      }
    }



    this.setState({
      auditDatesStyles: auditDatesStyles
    })
  }

  getsortype = (status, value) => {
    // console.log('value',value)
    // console.log('status',status)

    if (status == 'Forms') {
      this.setState({ sortypeForms: value }, () => {
        // console.log('Clicked',this.state.sortypeForms)
        this.props.onFilterChange(this.state.sortypeForms, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
      })
    }
    else if (status == 'Sort') {
      this.setState({ sortypeSort: value }, () => {
        // console.log('Clicked',this.state.sortypeSort)
        this.props.onFilterChange(this.state.sortypeSort, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
      })
    }
    else if (status == 'Status') {
      if (parseInt(this.props.filterType) == 0) {
        this.setState({ sortypeStatus: value }, () => {
          // console.log('Clicked',this.state.sortypeStatus)
          this.props.onFilterChange(this.state.sortypeStatus, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
        })
      }
    }
  }

  onChangeText = (value) => {
    console.log('this.state.droptext', this.state.droptext)
    var dropvalue = value.value
    var dropText = ''
    for (var i = 0; i < this.dropdata.length; i++) {
      if (this.dropdata[i].value == dropvalue) {
        dropText = this.dropdata[i].text
      }
    }
    this.setState({ droptext: dropText }, () => {
      console.log('Selected =', this.state.droptext)
      this.props.onFilterChange(this.state.sortypeSort, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
    });
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: Moment(date).format('MM-DD-YYYY'),
        isModalVisible: false
      }, () => {
        this.props.onFilterChange(this.state.sortypeForms, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
      });
    } else {
      this.setState({
        selectedStartDate: Moment(date).format('MM-DD-YYYY'),
        selectedEndDate: null
      });
    }
  }

  onTouch(filter) {

    this.setState({
      filter: '',
      droptext: 'StartDate',
      showRadioBtn: false,
      showRadioAll: false,
      showRadioRecent: false,
      showRadioForm: false,
      showRadioStat: false,
      showRadioSort: false,
      showRadioAdv: false,
      selectedStartDate: null,
      selectedEndDate: null,
      isModalVisible: false,
      filterType: filter
    }, () => {
      console.log('filterType', this.state.filterType)
      console.log('droptext', this.state.droptext)
      if (this.state.filterType != 'Calendar') {
        if (this.state.filterType == 'Forms') {
          this.props.onFilterChange(this.state.sortypeForms, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
        }
        else if (this.state.filterType == 'Sort') {
          this.props.onFilterChange(this.state.sortypeSort, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
        }
        else if (this.state.filterType == 'Status') {
          this.props.onFilterChange(this.state.sortypeStatus, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
        }
        else if (this.state.filterType == 'Recent') {
          this.props.onFilterChange(this.state.sortypeForms, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
        }
        else if (this.state.filterType == 'All') {
          this.props.onFilterChange(this.state.sortypeForms, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
        }
      }
    })

    if (filter === 'All') {
      this.setState({
        showRadioBtn: false,
        showRadioAll: true
      })
    }
    else if (filter === 'Recent') {
      this.setState({
        showRadioBtn: false,
        showRadioRecent: true
      })
    }
    else if (filter === 'Forms') {
      this.setState({
        showRadioBtn: true,
        showRadioForm: true
      })
    }
    else if (filter === 'Status') {
      this.setState({
        showRadioBtn: true,
        showRadioStat: true
      })
    }
    else if (filter === 'Sort') {
      this.setState({
        showRadioBtn: true,
        showRadioSort: true
      })
    }
    else if (filter === 'Calendar') {
      this.setState({
        showRadioBtn: true,
        isModalVisible: true,
        showRadioAdv: true,
        selectedStartDate: null,
        selectedEndDate: null
      })
    }
  }

  changeDateFormatCard = (inDate) => {
    if (inDate) {
      console.log('inDate ---->', inDate)
      var DefaultFormatL = this.state.selectedFormat
      var sDateArr = inDate.split('-')
      // var sDateValArr = sDateArr[0].split('-')
      var outDate = new Date(sDateArr[2], sDateArr[0] - 1, sDateArr[1])

      return Moment(outDate).format(DefaultFormatL)
    }
  }

  render() {

    var radio_props_forms = [
      { label: strings.StatusDownloaded, value: 0 },
      { label: strings.StatusNotSynced, value: 1 },
      { label: strings.StatusSynced, value: 2 }
    ];

    var radio_props_status = [
      { label: strings.StatusAll, value: 0 },
      { label: strings.StatusProcessing, value: 1 },
      { label: strings.StatusScheduled, value: 2 },
      { label: strings.StatusCompleted, value: 3 },
      { label: strings.StatusDV, value: 4 },
      { label: strings.StatusDVC, value: 5 },
    ];

    var radio_props_sort = [
      { label: strings.SortDsc, value: 1 },
      { label: strings.SortAsc, value: 0 },
    ];

    const list = [
      { id: 'All' },
      { id: 'Recent' },
      { id: 'Calendar' },
      { id: 'Forms' },
      { id: 'Status' },
      { id: 'Sort' }
    ]

    const { selectedStartDate, selectedEndDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';
    // return (
    //   <TouchableOpacity 
    //   onPress={()=>this.props.navigation.navigate('AllTabAuditList')}
    //   style={{width:"100%",height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center"}}>
    //     <Text style={{fontSize:20}}>You have 300 audits</Text>
    //   </TouchableOpacity>
    // )

    return (

      <View style={(this.state.showRadioBtn) ? styles.container : styles.containerRecent}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={list}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <View style={styles.filterDiv}>
              <TouchableOpacity onPress={debounce(this.onTouch.bind(this, item.id), 800)}>

                {(item.id == 'All') ?
                  (!this.state.showRadioBtn && this.state.showRadioAll) ?
                    <Text style={styles.textFontStyleSelected}>{strings.StatusAll}</Text> :
                    <Text style={styles.textFontStyle}>{strings.StatusAll}</Text> :
                  <Text style={styles.checkBoxnone}></Text>
                }

                {(item.id == 'Recent') ?
                  (!this.state.showRadioBtn && this.state.showRadioRecent) ?
                    <Text style={styles.textFontStyleSelected}>{strings.FilterMenuRecent}</Text> :
                    <Text style={styles.textFontStyle}>{strings.FilterMenuRecent}</Text> :
                  <Text style={styles.checkBoxnone}></Text>
                }

                {(item.id == 'Forms') ?
                  (this.state.showRadioBtn && this.state.showRadioForm) ?
                    <Text style={styles.textFontStyleSelected}>{strings.FilterMenuForms}</Text> :
                    <Text style={styles.textFontStyle}>{strings.FilterMenuForms}</Text> :
                  <Text style={styles.checkBoxnone}></Text>
                }

                {(item.id == 'Status') ?
                  (this.state.showRadioBtn && this.state.showRadioStat) ?
                    <Text style={styles.textFontStyleSelected}>{strings.SortByStatus}</Text> :
                    <Text style={styles.textFontStyle}>{strings.SortByStatus}</Text> :
                  <Text style={styles.checkBoxnone}></Text>
                }

                {(item.id == 'Sort') ?
                  (this.state.showRadioBtn && this.state.showRadioSort) ?
                    <Text style={styles.textFontStyleSelected}>{strings.FilterMenuSort}</Text> :
                    <Text style={styles.textFontStyle}>{strings.FilterMenuSort}</Text> :
                  <Text style={styles.checkBoxnone}></Text>
                }

                {(item.id == 'Calendar') ?
                  (this.state.showRadioBtn && this.state.showRadioAdv) ?
                    <Text style={styles.textFontStyleSelected}>{strings.FilterMenuCalendar}</Text> :
                    <Text style={styles.textFontStyle}>{strings.FilterMenuCalendar}</Text> :
                  <Text style={styles.checkBoxnone}></Text>
                }

              </TouchableOpacity>
            </View>
          } />

        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.radioScroll}>

          {(this.state.showRadioBtn) ?
            (this.state.showRadioForm) ?
              <View style={styles.checkBox}>
                <RadioGroup
                  horizontal={true}
                  size={24}
                  thickness={2}
                  color='#2EA5E2'
                  highlightColor='transparent'
                  selectedIndex={this.state.sortypeForms}
                  onSelect={debounce(this.getsortype.bind(this, 'Forms'), 700)}
                  style={{ flexDirection: 'row', paddingTop: 0, marginTop: 0 }}
                >
                  {radio_props_forms.map((item, key) =>
                    <RadioButton value={item.value}
                    >
                      <Text>{item.label}</Text>
                    </RadioButton>
                  )}
                </RadioGroup>
              </View> : (this.state.showRadioStat) ?
                <View style={styles.checkBox}>
                  <RadioGroup
                    size={24}
                    thickness={2}
                    color='#2EA5E2'
                    highlightColor='transparent'
                    selectedIndex={this.state.sortypeStatus}
                    onSelect={debounce(this.getsortype.bind(this, 'Status'), 700)}
                    style={{ flexDirection: 'row', paddingTop: 0, marginTop: 0 }}
                  >
                    {radio_props_status.map((item, key) =>
                      <RadioButton value={item.value}
                        disabled={(parseInt(this.props.filterType) == 0) ? false : true}
                      >
                        <Text>{item.label}</Text>
                      </RadioButton>
                    )}
                  </RadioGroup>
                </View> :
                (this.state.showRadioSort) ?
                  <View style={styles.checkBox}>
                    <RadioGroup
                      size={24}
                      thickness={2}
                      color='#2EA5E2'
                      highlightColor='transparent'
                      selectedIndex={this.state.sortypeSort}
                      onSelect={debounce(this.getsortype.bind(this, 'Sort'), 700)}
                      style={{ flexDirection: 'row', paddingTop: 0, marginTop: 0 }}
                    >
                      {radio_props_sort.map((item, key) =>
                        <RadioButton value={item.value}
                        >
                          <Text>{item.label}</Text>
                        </RadioButton>
                      )}
                    </RadioGroup>
                  </View> : null
            :
            <View style={styles.checkBoxnone}>
            </View>
          }

          {(this.state.showRadioSort) ?
            <View style={styles.checkBox}>
              <Dropdown
                value={this.dropdata[0].value}
                onChange={this.onChangeText}
                data={this.dropdata}
                labelField="text"
                valueField="value"
                containerStyle={{ flex: 1 }}
                baseColor="grey"
                itemTextStyle={{ fontFamily: 'OpenSans-Regular' }}
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
              />
            </View>
            :
            <View></View>
          }

          {(this.state.showRadioAdv) ?
            <View style={styles.checkBox}>
              {(startDate && endDate) ?
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.dateRange}>
                    {strings.SortByStartDate}: {this.changeDateFormatCard(startDate) + '. '}
                    {strings.SortByEndDate}: {this.changeDateFormatCard(endDate) + '. '}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      selectedStartDate: null,
                      selectedEndDate: null,
                    }, () => {
                      this.props.onFilterChange(this.state.sortypeForms, this.state.droptext, this.state.filterType, this.state.selectedStartDate, this.state.selectedEndDate)
                    });
                  }}>
                    <Icon style={{ top: 10 }} name='times-circle' size={20} />
                  </TouchableOpacity>
                </View>
                :
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10
                }}>
                  <Text style={{ fontSize: 16, color: 'grey' }}>Please choose StartDate and EndDate from calendar</Text>
                </View>
              }
            </View> :
            <View></View>
          }

        </ScrollView>

        <View>
          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            animationIn="slideInUp"
            animationOut="slideOutDown"
          // backdropOpacity="0.8"
          >
            <View style={styles.calendarModal}>
              <View style={styles.modalBody}>
                <View style={styles.modalheading}>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: Fonts.size.regular }}>{strings.DateRangeHeading}</Text>
                  </View>
                </View>
                <ScrollView style={styles.scrollView} >
                  <View style={{ padding: 20 }}>
                    <CalendarPicker
                      startFromMonday={true}
                      allowRangeSelection={true}
                      todayBackgroundColor="#1CB3D0"
                      selectedDayColor="#15D0AE"
                      selectedDayTextColor="#000000"
                      previousTitle="<<"
                      nextTitle=">>"
                      onDateChange={this.onDateChange.bind(this)}
                      customDatesStyles={this.state.auditDatesStyles}
                      width={width(90)}
                      height={height(70)}
                    />
                  </View>
                </ScrollView>
              </View>

              <View style={{ justifyContent: 'center', alignContent: 'center' }} >
                <TouchableOpacity
                  style={{ padding: '5%' }}
                  onPress={() => this.setState({ isModalVisible: false })}>
                  <Text style={{ color: '#00a1e2', fontSize: Fonts.size.regular }}>{strings.Close}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterSection)