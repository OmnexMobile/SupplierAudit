import { StyleSheet } from 'react-native'
import { width } from 'react-native-dimension'
import {Fonts, Metrics, Colors} from '../../Themes/'

export default StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white"
    },
    flex_one: {
        flex: 1, paddingRight: 2, backgroundColor: "grey"
    },
    errorWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start'
    },
    loaderParent: {
        paddingVertical: 20,
        width: "100%",
        justifyContent: 'center',
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
    calendar: {
        // borderTopWidth: 1,
        paddingTop: 5,
        fontFamily:'OpenSans-Regular'
        // marginLeft:20
        // borderBottomWidth: 1,
        // borderColor: '#eee',
        // height: 300
    },
})
