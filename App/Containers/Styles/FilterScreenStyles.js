import { StyleSheet, Dimensions,Platform } from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%'
    },
    headerBgImage: {
        resizeMode: 'stretch',
        width: '100%',
        height: 60,
    },
    header: {
        width: width(100),
        zIndex: 3000,
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        height: 65
    },
    backlogo: {
        backgroundColor: 'transparent',
        width: width(15),
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width(70),
        height: 65,
    },
    headingText: {
        fontSize: Fonts.size.h6,
        // fontFamily: Fonts.type.base,
        color: '#fff',
        textAlign: 'center',
        fontFamily:'OpenSans-Bold'
        //     fontSize: 25,
        //     color:'#FFFFFF',
        //    textAlign:'center'     
    },
    searchView: {
        width: '86%',
        marginTop: 20,
        marginHorizontal: '7%',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical:Platform.OS === 'ios'? 10 :null,
    },
    applyView: {
        width: '86%',
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 10,
        marginHorizontal: '7%',
        borderWidth: 1,
        backgroundColor: '#FEF0F2',
        borderColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    applyText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily:'OpenSans-Regular'
    },
    searchText: {
        fontSize: 20
    },
    cancelView: {
        width: '86%',
        marginTop: 10,
        paddingVertical: 10,
        marginHorizontal: '7%',
        borderWidth: 1,
        backgroundColor: '#FEF0F2',
        borderColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        bottom: 10,
        // position:'absolute'
    },
    date: {
        width: '100%',
        paddingVertical: 20,
        paddingLeft: 20,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    itemText: {
        color: 'black',
        fontSize: 16,

        // flex:1
    },
    dateview: {
        width: '75%',
        alignItems: 'flex-end',
    },

    calendarModal: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20
    },
    modalBody: {
        width: width(90),
        height: height(65),
        backgroundColor: 'white',
        borderRadius: 8
    },
    modalheading: {
        width: '100%',
        height: '10%',
        backgroundColor: 'transparent',
        position: 'absolute',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        top: height(2)
    },
    modalfooter: {
        width: '100%',
        height: '10%',
        backgroundColor: 'grey',
        position: 'absolute',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: height(2)
    },
    scrollView: {
        marginTop: height(10),
        height: '80%',
        width: '100%',
        backgroundColor: 'transparent'
    },
    dateRange: {
        fontSize: Fonts.size.medium,
        color: 'grey',
        margin: 5,
        padding: 5,
        paddingLeft: 20,
        marginBottom: 0,
        textAlign: 'center',
        fontFamily:'OpenSans-Regular'
    },
    container: {
        flex:1,
        borderTopColor:'lightgrey',
        borderTopWidth:1,
        marginTop:5
      },


      body: {
        width: '100%',
        marginTop: 10,
        paddingLeft: 20,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        flexDirection:'row',
        backgroundColor:'grey',
        justifyContent:'flex-start'
    },
    // itemText: { color: 'black', fontSize: 16 },
    add: { justifyContent: 'center', alignItems: 'center', paddingRight: 30 },
    view: {width:'80%',alignItems:'flex-end',backgroundColor:'grey'},
    collapseView: { width:'100%',backgroundColor:'white'},
    flexDirection: { flexDirection: 'row'},
    checkBoxText: { fontSize: 16, marginTop: 15,width:'78%',right:10,fontFamily:'OpenSans-Regular' },
    calendarModal: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
    },
    modalBody: {
        width: width(90),
        height: height(65),
        backgroundColor: 'white',
        borderRadius: 8
    },
    modalheading: {
        width: '100%',
        height: '10%',
        backgroundColor: 'transparent',
        position: 'absolute',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        top: height(2)
    },
    modalfooter: {
        width: '100%',
        height: '10%',
        backgroundColor: 'grey',
        position: 'absolute',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: height(2)
    },
    scrollView: {
        marginTop: height(10),
        height: '80%',
        width: '100%',
        backgroundColor: 'transparent'
    },
    // date: {
    //     width: '100%',
    //     paddingVertical: 10,
    //     marginTop: 20,
    //     paddingLeft: 20,
    //     borderTopColor: 'lightgrey',
    //     borderTopWidth: 1,
    //     flexDirection: 'row',
    // },
    iconView: {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'#ffffff',
      },
})