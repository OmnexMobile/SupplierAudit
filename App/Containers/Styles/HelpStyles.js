import { StyleSheet, Dimensions } from 'react-native'
import { width, height } from "react-native-dimension";
import Fonts from '../../Themes/Fonts'
const window_width = Dimensions.get('window').width



export default StyleSheet.create({
    bgCont: {
        resizeMode: 'stretch',
        width: '100%',
        height: '100%'
    },
    bodyCont: {
        width: '100%',
        height: '90%',
    },
    headerCont: {
        width: "100%",
        height: 60
    },
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        zIndex: 3000,
        flexDirection: 'row',
        //backgroundColor: 'white',
        padding: 5,
        justifyContent: 'flex-start',
        alignContent:'center',
        height: 65,
        elevation: 4,
        shadowOffset: { width: 2, height: 10 },
        shadowColor: "lightgrey",
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    backlogo: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '15%',
        height: 65,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        height: 65
    },
    headingText: {
        fontSize: Fonts.size.h6,
        color: '#fff',
        textAlign: 'center',
        fontWeight:'bold',
        fontFamily:'OpenSans-Bold'
    },
    headerDiv: {
        width: '15%',
        height: 65,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})