import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ImageBackground,ActivityIndicator } from 'react-native'
//lib
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { DoubleBounce } from 'react-native-loader';
//assets
import { Images, Fonts } from '../Themes'
import { strings } from '../Language/Language'
//services
import auth from "../Services/Auth";
import { width } from 'react-native-dimension';

class SyncHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            sync_History: []
        }
    }

    componentDidMount() {
        const UserId = this.props.data.audits.userId;
        const token = this.props.data.audits.token;
        auth.getSyncHistory(UserId, token, (res, data) => {
            console.log('getSyncHistory',data)
            if (data.data) {
                if (data.data.Success === true) {
                    this.setState({ sync_History: data.data.Data, loading: false })
                } else {
                    this.setState({ sync_History: [], loading: false })
                }
            } else {
                this.setState({ sync_History: [], loading: false })
            }
        })
    }
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                {this.state.loading ? this.render_loader() :
                    this.state.sync_History.length > 0 ?
                        <FlatList
                            data={this.state.sync_History}
                            style={styles.marginTop10}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.card}>
                                        <Text style={styles.detailTitle}>{strings.auditnumber}</Text>
                                        <Text style={styles.detailContent}>{item.AuditNumber}</Text>
                                        <Text style={styles.rowBorder}/>
                                        <Text style={styles.detailTitle}>{strings.Audit_SyncedOn} </Text>
                                        <Text style={styles.detailContent}>{item.DateTimeStamp}</Text>
                                    </View>
                                )
                            }}
                        /> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: Fonts.size.h5,
                            }}>{strings.No_records_found}</Text>
                        </View>
                }
            </View>
        )
    }
    render_loader() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={20} color="#1CAFF6" />
            </View>
        )
    }

    renderHeader() {
        return (
            <ImageBackground source={Images.DashboardBG} style={styles.headerView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backlogo}>
                        <Icon name="angle-left" size={40} color="white" />
                    </TouchableOpacity>
                    <View style={styles.heading}>
                        <Text numberOfLines={1} style={styles.headingText}>{strings.Sync_History}</Text>
                    </View>
                    <TouchableOpacity style={styles.headerDiv} onPress={() => this.props.navigation.navigate("AuditDashboard")}>
                        <Icon name="home" size={35} color="white" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%'
    },
    marginTop10: {
        marginTop: 10
    },
    headerView: {
        width: '100%',
        height: 60,

    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row'
    },
    heading: {
        width: width(70),
        justifyContent: 'center',
        alignItems: 'center'
    },
    headingText: {
        fontSize: Fonts.size.h4,
        color: '#fff',
    },
    backlogo: {
        width: width(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerDiv: {
        paddingRight: 10,
        width: width(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: '90%',
        marginLeft: '5%',
        borderRadius: 5,
        borderColor: '#4ACECD',
        borderWidth: 0.5,
        padding: 10,
        marginBottom: 10,
        shadowColor: 'grey',
        shadowOpacity: 0.4,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        elevation: 2,
        backgroundColor: 'white'
    },
    detailContent: {
        fontSize: Fonts.size.regular,
        color: '#1d1d1d',
    },
    detailTitle: {
        fontSize: Fonts.size.medium,
        color: '#A6A6A6',
        paddingBottom:2
    },
    rowBorder:{
        backgroundColor:'lightgrey',
        width:'100%',
        height:0.5,
        marginVertical:5
    }
})
const mapStateToProps = (state) => {
    return {
        data: state
    }
}

export default connect(mapStateToProps)(SyncHistory)