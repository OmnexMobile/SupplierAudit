import { StyleSheet } from 'react-native'
import { width } from 'react-native-dimension'
import {Fonts, Metrics, Colors} from '../../Themes/'

export default StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start',
    },
    auditBodyContent: {
        flexDirection: "column",
        justifyContent: 'flex-start'
    },
    errorWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    //header
    header: {
        width:width(100),
        zIndex: 3000,
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 65,
        elevation: 4,
        shadowOffset: { width: 2, height: 10 },
        shadowColor: "lightgrey",
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    backlogo:{
        flexDirection: 'row',
        backgroundColor:'transparent',
        width: width(15),
        height: 65,
        justifyContent: 'center', 
        alignItems:'center'
    },
    heading:{
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems:'center', 
        width: width(70),
        height: 65
    },
    headingText:{
        fontSize: Fonts.size.h6,
        color: '#fff',
        textAlign: 'center',
        // fontWeight:'bold'
        fontFamily:'OpenSans-Bold' 
    },
    headerDiv:{
        width:width(15),
        height: 65,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Body styles
    auditPageBody: {
        flex: 1,
        width: "100%",
    },
    loaderParent: {
        paddingVertical: 20,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    listPadding: {
        paddingBottom: 85
    },
    appHeight: {
        flex: 1
    },
    subLoaderWrap : {
        width : '100%',
        paddingTop : 14,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom : 14
    },

    //list child
    auditBox: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        marginHorizontal: 15,
        marginBottom: 0,
        marginTop: 4,
    },
    auditBoxStatusBar: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: 4
    },
    auditBoxContent: {
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 15,
        paddingRight: 10,
    },
    auditBoxStatus: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        width: 100,
    },
    borderEnabled: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
    },
    circle: {
        paddingBottom:8
    },
    statusText: {
        textAlign: 'center'
    },
    paddingTop5: {
        paddingTop: 5 
    }
})
