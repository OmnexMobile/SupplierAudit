import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ImageBackground, TextInput, ScrollView, TouchableWithoutFeedback } from 'react-native'
import styles from './Styles/FilterScreenStyles'
import { Images } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Themes/Fonts'
import { strings } from '../Language/Language'
import Modal from "react-native-modal"
import CalendarPicker from 'react-native-calendar-picker'
import { width, height } from 'react-native-dimension'
import Moment from 'moment';
import Toast, { DURATION } from "react-native-easy-toast";
import { CheckBox } from 'react-native-elements'
import Collapsible from "react-native-collapsible"; 



import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import auth from "../Services/Auth";

class FilterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            globalSearch: '',
            selectedStartDate: null,
            selectedEndDate: null,
            isModalVisible: false,
            auditDatesStyles: [],
            showRadioAdv: false,
            selectedFormat: this.props.data.audits.userDateFormat === null ? 'DD-MM-YYYY' : this.props.data.audits.userDateFormat,
            token: this.props.data.audits.token,
            userId: this.props.data.audits.userId,
            siteId: this.props.data.audits.siteId,
            page: 1,
            filterType: '',
            sortype: '',
            filterId: '',
            AuditSearch: '',
            SortBy: '',
            SortOrder: '',
            default: 1,
            callback_flag: true,
            allCheckBox: false,
            scheduledBox: false,
            completedBox: false,
            deadlineBox: false,
            deadlineCompleteBox: false,
            downloadedBox: false,
            Not_SyncedBox: false,
            SyncedBox: false,
            download: '',
            notsynced: '',
            synced: '',
            all: '',
            auditNumber: '',
            auditCycle: '',
            auditee: '',
            auditProgram: '',
            auditType: '',
            selectedEndDate: '',
            selectedStartDate: '',
            checked:false,
            fromDashBoard: this.props.navigation.getParam('fromDashBoard'),
            activeSection: "",
        }
        // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        //     this.onBackHandle(); // works best when the goBack is async
        //     return true;
        // });
    }


    componentDidMount() {
        console.log('this.props.data.audits', this.props.data.audits)
        // console.log('pageNo,token,userId,siteId,filterId,pageSize,GlobalFilter',this.state.page,this.state.token,this.state.userId,this.state.siteId,this.state.filterId,)
        // this.getAudits()
    }


    // componentWillUnmount() {
    //     this.backHandler.remove();
    // }

    onBackHandle() {
        if (this.state.fromDashBoard) {
            this.props.navigation.navigate('AllTabAuditList')
        } else {
            this.props.navigation.goBack()
        }
    }

    getAudits() {
        NetInfo.fetch().then(netState => {
            if (netState.isConnected) {
                var pageNo = this.state.page
                var token = this.state.token
                var userId = this.state.userId
                var siteId = this.state.siteId
                var filterId = this.state.filterId
                var pageSize = 10
                var GlobalFilter = this.state.AuditSearch
                var StartDate = this.state.selectedStartDate
                var EndDate = this.state.selectedEndDate
                var SortBy = this.state.SortBy
                var SortOrder = this.state.SortOrder
                var Default = this.state.default
                
          var SM = this.props.data.audits.smdata

                console.log('pageNo,token,userId,siteId,filterId,pageSize,GlobalFilter', pageNo, token, userId, siteId, filterId, pageSize, GlobalFilter, StartDate, EndDate, SortBy, SortOrder, Default)
                auth.getauditlist(token, userId, siteId, pageNo, pageSize, filterId, GlobalFilter, StartDate, EndDate, SortBy, SortOrder,SM,Default, (response, data) => {
                    console.log('data', data)
                    console.log('response', response)
                })
            }
        })

    }
    checkedApply() {
        var allCheckBox = this.state.allCheckBox
        var scheduledBox = this.state.scheduledBox
        var completedBox = this.state.completedBox
        var deadlineBox = this.state.deadlineBox
        var deadlineCompleteBox = this.state.deadlineCompleteBox
        var downloadedBox = this.state.downloadedBox
        var Not_SyncedBox = this.state.Not_SyncedBox
        var SyncedBox = this.state.SyncedBox
        var auditNumber = this.state.auditNumber
        var auditCycle = this.state.auditCycle
        var auditee = this.state.auditee
        var auditProgram = this.state.auditProgram
        var auditType = this.state.auditType
        var selectedStartDate = this.state.selectedStartDate
        var selectedEndDate = this.state.selectedEndDate
        console.log('selectedStartDate , selectedStartDate ', selectedStartDate, selectedEndDate)
        console.log("scheduledBox,completedBox,deadlineBox,deadlineCompleteBox",scheduledBox,completedBox,deadlineBox,deadlineCompleteBox)

        var scheduledBoxQuery = "AuditStatus like '%2%'"
        var completedBoxQuery = "AuditStatus like '%3%'"
        var deadlineBoxQuery = "AuditStatus like '%4%'"
        var deadlineCompleteBoxQuery = "AuditStatus like '%5%'"

        let filterArr = []
        var formCheckArr = []

        if(this.state.globalSearchText){
            filterArr.push({
                filterType: 'GlobalFilter',
                sortype: 0,
                startDate: '',
                text: {globalSearchText : this.state.globalSearchText},
                endDate: '',
                globalSearch: this.state.globalSearchText
            })
        }
        /** Global filter if user choosed any value from the text box */
        else if(auditType || auditProgram || auditee || auditCycle || auditNumber){
            var finalString = ''

            var isauditNumber = "AuditNumber like '%" +auditNumber+ "%'"
            var isauditCycle = "AuditCycleName like '%" +auditCycle+ "%'"
            var isauditee = "Auditee like '%" +auditee+ "%'"
            var isauditProgram = "AuditProgramName like '%" +auditProgram + "%'" 
            var isauditType = "AuditTypeName like '%" +auditType+ "%'"


            var globalSearchString = isauditNumber +" and "+ isauditCycle +" and "+ isauditee +" and "+ isauditProgram+" and "+isauditType
            console.log('globalSearchString',globalSearchString)

            if(allCheckBox){
                finalString = globalSearchString+" or "+scheduledBoxQuery+" or "+completedBoxQuery+" or "+deadlineBoxQuery+" or "+deadlineCompleteBoxQuery
            }
            else if(scheduledBox || completedBox || deadlineBox || deadlineCompleteBox){
                if(scheduledBox){
                    formCheckArr.push(scheduledBoxQuery)
                }
                if(completedBox){
                    formCheckArr.push(completedBoxQuery)
                }
                if(deadlineBox){
                    formCheckArr.push(deadlineBoxQuery)
                }
                if(deadlineCompleteBox){
                    formCheckArr.push(deadlineCompleteBoxQuery)
                }
                var formStatusQuery_01 = formCheckArr.toString()
                var formStatusQuery = formStatusQuery_01.replace(/,/g," or ")
                finalString = globalSearchString +" and "+ formStatusQuery   
            }
            else{
                finalString = globalSearchString
            }


            filterArr.push({
                filterType: 'GlobalFilter',
                sortype: 0,
                startDate: selectedStartDate,
                text: {
                    auditType: auditType,
                    auditProgram :auditProgram ,
                    auditee : auditee,
                    auditCycle : auditCycle,
                    auditNumber : auditNumber,
                },
                endDate: selectedEndDate,
                globalSearch: finalString
            })

        }
        // var selectedStartDate = this.state.selectedStartDate
        // var selectedEndDate = this.state.selectedEndDate

        /** STATUS filter Client Side   */
        else if(allCheckBox || scheduledBox || completedBox || deadlineBox || deadlineCompleteBox){
            if (this.state.allCheckBox) {
                filterArr.push({
                    filterType: 'Status',
                    sortype: 0,
                    startDate: selectedStartDate,
                    text: 'All',
                    endDate: selectedEndDate,
                    globalSearch: scheduledBoxQuery+" or "+completedBoxQuery+" or "+deadlineBoxQuery+" or "+deadlineCompleteBoxQuery
                })
            }
            else {
                var text = []
                if(scheduledBox){
                    formCheckArr.push(scheduledBoxQuery)
                    text.push('Scheduled')
                }
                if(completedBox){
                    formCheckArr.push(completedBoxQuery)
                    text.push('Completed')
                }
                if(deadlineBox){
                    formCheckArr.push(deadlineBoxQuery)
                    text.push('Deadline Vioalted')
                }
                if(deadlineCompleteBox){
                    formCheckArr.push(deadlineCompleteBoxQuery)
                    text.push('Deadline Vioalted & Completed')
                }

                var formStatusQuery_02 = formCheckArr.toString()
                var formStatusQuery_001 = formStatusQuery_02.replace(/,/g," or ")

                var getText = text.toString()
                var getTextName = getText.replace(/,/g," and ")

                console.log('formStatusQuery_001',formStatusQuery_001)
                console.log('getTextName',getTextName)

                filterArr.push({
                    filterType: 'Status',
                    sortype: 0,
                    startDate: selectedStartDate,
                    text: getTextName,
                    endDate: selectedEndDate,
                    globalSearch: formStatusQuery_001
                })

            }
    
        }
                    /** CAlender */

        else if(selectedStartDate) {
            filterArr.push({
                filterType: 'Calendar',
                sortype: 0,
                startDate: selectedStartDate,
                text: selectedStartDate,
                endDate: selectedEndDate,
                globalSearch: null
            })
        }
 

        console.log("filterArr-->", filterArr)
        if (filterArr.length > 0) {
            this.props.navigation.push('AllTabAuditList',{ filter_Arr: filterArr })
            // this.resetAll()
        }
        else{
            this.refs.toast.show(strings.nofilterapply, DURATION.LENGTH_LONG)
        }
    }

    resetAll() {
        this.setState({
            allCheckBox: false,
            scheduledBox: false,
            completedBox: false,
            deadlineBox: false,
            checkBox: false,
            downloadedBox: false,
            Not_SyncedBox: false,
            SyncedBox: false,
            showRadioAdv: false,
            download: '',
            notsynced: '',
            synced: '',
            all: '',
            auditNumber: '',
            auditCycle: '',
            auditee: '',
            auditProgram: '',
            auditType: '',
            globalSearchText: '',
            selectedEndDate: '',
            selectedStartDate: '',
            deadlineCompleteBox:false

        })

    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: Moment(date).format('MM-DD-YYYY'),
                isModalVisible: false
            });
        } else {
            this.setState({
                selectedStartDate: Moment(date).format('MM-DD-YYYY'),
                selectedEndDate: null
            });
        }
    }

    changeDateFormatCard = (inDate) => {
        if (inDate) {
            console.log('inDate ---->', inDate)
            var DefaultFormatL = this.state.selectedFormat
            var sDateArr = inDate.split('-')
            var outDate = new Date(sDateArr[2], sDateArr[0] - 1, sDateArr[1])
            return Moment(outDate).format(DefaultFormatL)
        }
    }

    render() {
        const { selectedStartDate, selectedEndDate, activeSection } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        const endDate = selectedEndDate ? selectedEndDate.toString() : '';
        return (
            <View style={styles.mainContainer}>
                <ImageBackground source={Images.DashboardBG} style={styles.headerBgImage}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.onBackHandle()}>
                            <View style={styles.backlogo}>
                                <Icon name="angle-left" size={30} color="white" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.heading}>
                            <Text style={styles.headingText}>{strings.filter}</Text>
                        </View>
                        <TouchableOpacity style={{paddingRight:10}} onPress={()=>this.props.navigation.navigate("AuditDashboard")}>
                                <Icon name="home" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                {/* Search */}
                <View style={styles.searchView}>
                    <TouchableOpacity style={{ marginLeft: 10 }}>
                        <Icon name="search" size={20} color="green" />
                    </TouchableOpacity>
                    <TextInput
                        placeholder={strings.search}
                        style={{ fontSize: 16, marginLeft: 5, width: '85%' ,fontFamily:'OpenSans-Regular'}}
                        value={this.state.globalSearchText}
                        onChangeText={(Text) => this.setState({ globalSearchText: Text })}
                    />
                </View>
                {/* Apply */}
                <TouchableOpacity onPress={() => this.checkedApply()} style={styles.applyView}>
                    <Text style={styles.applyText}>{strings.apply}</Text>
                </TouchableOpacity>
                {/* Date  */}
                {(this.state.showRadioAdv) ?
                    <View style={styles.checkBox}>
                        {(startDate && endDate) ?
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.dateRange}>
                                    {strings.SortByStartDate}: {this.changeDateFormatCard(startDate) + ' '}
                                    {strings.SortByEndDate}: {this.changeDateFormatCard(endDate) + ' '}
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        selectedStartDate: '',
                                        selectedEndDate: '',
                                    });
                                }}>
                                    <Icon style={{ marginTop: 8 }} name='times-circle' size={20} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                <Text style={{ fontSize: 16, color: 'grey',textAlign:'center' ,fontFamily:'OpenSans-Regular'}}>{strings.PleasechoosestartDateandEndDatefromcalendar}</Text>
                            </View>
                        }
                    </View> :
                    <View></View>
                }
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, bottom: 5 }}>
                    <View style={styles.date}>
                        <View style={{ width: '20%' }}>
                            <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.date}</Text>
                        </View>
                        <TouchableOpacity style={styles.dateview} onPress={() => this.setState({ isModalVisible: true, showRadioAdv: true })}>
                            <Icon name="plus" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                 
                    <View style={styles.container}>                       
                        {this._renderIconView2(activeSection !== "StatusData")}
                        <Collapsible collapsed={activeSection !== "StatusData"}>
                        {this.StatusData()}
                        </Collapsible>

                    </View>
                    <View style={styles.container}>
                        
                        {this._renderIconView3(activeSection !== "AuditNumberData")}
                        <Collapsible collapsed={activeSection !== "AuditNumberData"}>
                        {this.AuditNumberData()}
                        </Collapsible>
                       
                    </View>
                    <View style={styles.container}>
                    {this._renderIconView4(activeSection !== "AuditCycle")}
                        <Collapsible collapsed={activeSection !== "AuditCycle"}>
                        {this.AuditCycle()}
                        </Collapsible>

                        {/* <CollapseView
                            renderView={this._renderIconView4}
                            renderCollapseView={() => this.AuditCycle()}
                        /> */}
                    </View>
                    <View style={styles.container}>
                    {this._renderIconView5(activeSection !== "Auditee")}
                        <Collapsible collapsed={activeSection !== "Auditee"}>
                        {this.Auditee()}
                        </Collapsible>
                        {/* <CollapseView
                            renderView={this._renderIconView5}
                            renderCollapseView={() => this.Auditee()}
                        /> */}
                    </View>
                    <View style={styles.container}>
                        {this._renderIconView6(activeSection !== "AuditProgram")}
                        <Collapsible collapsed={activeSection !== "AuditProgram"}>
                        {this.AuditProgram()}
                        </Collapsible>
                        {/* <CollapseView
                            renderView={this._renderIconView6}
                            renderCollapseView={() => this.AuditProgram()}
                        /> */}
                    </View>
                    <View style={styles.container}>
                    {this._renderIconView7(activeSection !== "AuditType")}
                        <Collapsible collapsed={activeSection !== "AuditType"}>
                        {this.AuditType()}
                        </Collapsible>
                        {/* <CollapseView
                            renderView={this._renderIconView7}
                            renderCollapseView={() => this.AuditType()}
                        /> */}
                    </View>


                </ScrollView>
                {/* cancel */}
                <TouchableOpacity style={styles.cancelView}
                    onPress={() => this.resetAll()}>
                    <Text style={styles.applyText}>{strings.clearall}</Text>
                </TouchableOpacity>
                {/* Modal */}
                <Modal
                    isVisible={this.state.isModalVisible}
                    onBackdropPress={() => this.setState({ isModalVisible: false })}
                    animationIn="slideInUp"
                    animationOut="slideOutDown">
                    <View style={styles.calendarModal}>
                        <View style={styles.modalBody}>
                            <View style={styles.modalheading}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'black', fontSize: Fonts.size.regular,fontFamily:'OpenSans-Regular'}}>{strings.DateRangeHeading}</Text>
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
                                        // customDatesStyles={this.state.auditDatesStyles}
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
                                <Text style={{ color: '#00a1e2', fontSize: Fonts.size.regular,fontFamily:'OpenSans-Regular'}}>{strings.Close}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Toast ref="toast"
                style={{ backgroundColor: 'black', margin: 20 }}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
                textStyle={{ color: 'white' }}
            />
            </View>
        )
    }

    _renderIconView1 = (collapse) => {
        return (
            <View style={styles.iconView}>
                <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.forms}</Text>
                <View>
                    {
                        collapse ?
                            <Icon name="minus" size={20} color="black" /> :
                            <Icon name="plus" size={20} color="black" />
                    }
                </View>
            </View>
        )
    }
    _renderIconView2 = (collapse) => {

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                this.setState({
                    activeSection:
                    this.state.activeSection === "StatusData" ? "" : "StatusData",
                });
                }}
            >
                <View style={styles.iconView}>
                    <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.status}</Text>
                    <View>
                        {
                            !collapse ?
                                <Icon name="minus" size={20} color="black" /> :
                                <Icon name="plus" size={20} color="black" />
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIconView3 = (collapse) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                this.setState({
                    activeSection:
                    this.state.activeSection === "AuditNumberData" ? "" : "AuditNumberData",
                });
                }}
            >
            <View style={styles.iconView}>
                <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.auditnumber}</Text>
                <View>
                    {
                        !collapse ?
                            <Icon name="minus" size={20} color="black" /> :
                            <Icon name="plus" size={20} color="black" />
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIconView4 = (collapse) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                this.setState({
                    activeSection:
                    this.state.activeSection === "AuditCycle" ? "" : "AuditCycle",
                });
                }}
            >

            <View style={styles.iconView}>
                <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.auditcycle}</Text>
                <View>
                    {
                        !collapse ?
                            <Icon name="minus" size={20} color="black" /> :
                            <Icon name="plus" size={20} color="black" />
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIconView5 = (collapse) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                this.setState({
                    activeSection:
                    this.state.activeSection === "Auditee" ? "" : "Auditee",
                });
                }}
            >

            <View style={styles.iconView}>
                <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.auditee}</Text>
                <View>
                    {
                        !collapse ?
                            <Icon name="minus" size={20} color="black" /> :
                            <Icon name="plus" size={20} color="black" />
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIconView6 = (collapse) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                this.setState({
                    activeSection:
                    this.state.activeSection === "AuditProgram" ? "" : "AuditProgram",
                });
                }}
            >

            <View style={styles.iconView}>
                <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.auditprogram}</Text>
                <View>
                    {
                        !collapse ?
                            <Icon name="minus" size={20} color="black" /> :
                            <Icon name="plus" size={20} color="black" />
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIconView7 = (collapse) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                this.setState({
                    activeSection:
                    this.state.activeSection === "AuditType" ? "" : "AuditType",
                });
                }}
            >

            <View style={styles.iconView}>
                <Text style={{fontFamily:'OpenSans-Regular'}}>{strings.audittype}</Text>
                <View>
                    {
                        !collapse ?
                            <Icon name="minus" size={20} color="black" /> :
                            <Icon name="plus" size={20} color="black" />
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }


    // Forms
    formsData() {
        return (
            <View style={{ marginLeft: 60 }}>
                <View style={styles.flexDirection}>
                    <CheckBox
                        value={this.state.downloadedBox}
                        onValueChange={() => this.setState({ downloadedBox: !this.state.downloadedBox }, () => console.log("downloadedBox", this.state.downloadedBox))}
                    />
                    <Text style={styles.checkBoxText}>Downloaded</Text>
                </View>
                <View style={styles.flexDirection}>
                    <CheckBox
                        value={this.state.Not_SyncedBox}
                        onValueChange={() => this.setState({ Not_SyncedBox: !this.state.Not_SyncedBox })}
                    />
                    <Text style={styles.checkBoxText}>Not-Synced</Text>
                </View>
                <View style={styles.flexDirection}>
                    <CheckBox
                        value={this.state.SyncedBox}
                        onValueChange={() => this.setState({ SyncedBox: !this.state.SyncedBox })}
                    />
                    <Text style={styles.checkBoxText}>Synced</Text>
                </View>
            </View>
        )
    }
  
    // Status
    StatusData() {
        return (
            <View style={{ marginLeft: 40}}>
                <View style={styles.flexDirection}>
                    <CheckBox
                    //Android
                        // value={this.state.allCheckBox}
                        // onValueChange={() => this.setState({ allCheckBox: !this.state.allCheckBox, all: 'All' })}
                        containerStyle={{color:'red'}}
                        checked={this.state.allCheckBox}
                        onPress={() => this.setState({allCheckBox: !this.state.allCheckBox})}
                        checkedColor='green'
                    />
                    <Text style={styles.checkBoxText}>All</Text>
                </View>
                <View style={styles.flexDirection}>
                    <CheckBox
                       checkedColor={this.state.allCheckBox === true ?'lightgrey' :'green'}
                        disabled={this.state.allCheckBox}
                        // value={this.state.scheduledBox}
                        // onValueChange={() => this.setState({ scheduledBox: !this.state.scheduledBox })}
                        checked={this.state.scheduledBox}
                        onPress={() => this.setState({scheduledBox: !this.state.scheduledBox})} 
                    />
                    <Text style={[styles.checkBoxText,{color:this.state.allCheckBox === true ?'lightgrey':'black'}]}>Scheduled</Text>
                </View>
                <View style={styles.flexDirection}>
                    <CheckBox
                        disabled={this.state.allCheckBox}
                        // value={this.state.completedBox}
                        // onValueChange={() => this.setState({ completedBox: !this.state.completedBox })}

                        checked={this.state.completedBox}
                        onPress={() => this.setState({completedBox: !this.state.completedBox})}
                        checkedColor={this.state.allCheckBox === true ?'lightgrey' :'green'}
                    />
                    <Text style={[styles.checkBoxText,{color:this.state.allCheckBox === true ?'lightgrey':'black'}]}>Completed</Text>
                </View>
                <View style={styles.flexDirection}>
                    <CheckBox
                        disabled={this.state.allCheckBox}
                        // value={this.state.deadlineBox}
                        // onValueChange={() => this.setState({ deadlineBox: !this.state.deadlineBox })}

                        checked={this.state.deadlineBox}
                        onPress={() => this.setState({deadlineBox: !this.state.deadlineBox})}
                        checkedColor={this.state.allCheckBox === true ?'lightgrey' :'green'}
                    />
                    <Text style={[styles.checkBoxText,{color:this.state.allCheckBox === true ?'lightgrey':'black'}]}>Deadline Violated</Text>
                </View>
                <View style={styles.flexDirection}>
                    <CheckBox
                        disabled={this.state.allCheckBox}
                        // value={this.state.deadlineCompleteBox}
                        // onValueChange={() => this.setState({ deadlineCompleteBox: !this.state.deadlineCompleteBox })}
                        checked={this.state.deadlineCompleteBox}
                        onPress={() => this.setState({deadlineCompleteBox: !this.state.deadlineCompleteBox})}
                        checkedColor={this.state.allCheckBox === true ?'lightgrey' :'green'}
                    />
                    <Text numberOfLines={1} style={[styles.checkBoxText,{color:this.state.allCheckBox === true ?'lightgrey':'black'}]}>Deadline Violated and Completed</Text>
                </View>
            </View>
        )
    }

    AuditNumberData() {
        return (
            <View style={styles.collapseView}>
                <View style={{ width: '90%', height: 40, borderColor: 'lightgrey', borderWidth: 1, marginLeft: 20, marginBottom: 5, flexDirection: 'row' }} >
                    <TextInput
                        style={{ width: '80%' ,fontFamily:'OpenSans-Regular'}}
                        value={this.state.auditNumber}
                        onChangeText={(text) => this.setState({ auditNumber: text })} />
                    <TouchableOpacity style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ auditNumber: '' })}>
                        <Icon name="close" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    AuditCycle() {
        return (
            <View style={styles.collapseView}>
                <View style={{ width: '90%', height: 40, borderColor: 'lightgrey', borderWidth: 1, marginLeft: 20, marginBottom: 5, flexDirection: 'row' }} >
                    <TextInput
                        style={{ width: '80%' ,fontFamily:'OpenSans-Regular'}}
                        value={this.state.auditCycle}
                        onChangeText={(text) => this.setState({ auditCycle: text })} />
                    <TouchableOpacity style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ auditCycle: '' })}>
                        <Icon name="close" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    Auditee() {
        return (
            <View style={styles.collapseView}>
                <View style={{ width: '90%', height: 40, borderColor: 'lightgrey', borderWidth: 1, marginLeft: 20, marginBottom: 5, flexDirection: 'row' }} >
                    <TextInput
                        style={{ width: '80%',fontFamily:'OpenSans-Regular' }}
                        value={this.state.auditee}
                        onChangeText={(text) => this.setState({ auditee: text })} />
                    <TouchableOpacity style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ auditee: '' })}>
                        <Icon name="close" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    AuditProgram() {
        return (
            <View style={styles.collapseView}>
                <View style={{ width: '90%', height: 40, borderColor: 'lightgrey', borderWidth: 1, marginLeft: 20, marginBottom: 5, flexDirection: 'row' }} >
                    <TextInput
                        style={{ width: '80%',fontFamily:'OpenSans-Regular' }}
                        value={this.state.auditProgram}
                        onChangeText={(text) => this.setState({ auditProgram: text })} />
                    <TouchableOpacity style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ auditProgram: '' })}>
                        <Icon name="close" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    AuditType() {
        return (
            <View style={styles.collapseView}>
                <View style={{ width: '90%', height: 40, borderColor: 'lightgrey', borderWidth: 1, marginLeft: 20, marginBottom: 5, flexDirection: 'row' }} >
                    <TextInput
                        style={{ width: '80%',fontFamily:'OpenSans-Regular' }}
                        value={this.state.auditType}
                        onChangeText={(text) => this.setState({ auditType: text })} />
                    <TouchableOpacity style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ auditType: '' })}>
                        <Icon name="close" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        )
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterScreen)