import { StyleSheet, Dimensions} from 'react-native'
import { width, height } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({
    header:{
        backgroundColor: "#00BFFF",
        height: 150,
      },
      wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start',
        backgroundColor: 'white'
      },
      auditPageBody: {
        flex: 1,
        zIndex: 10,
        marginLeft: 0,
        marginRight: 0,
        padding: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingBottom: 0,
        marginBottom: 0,
        alignSelf:'stretch'
      },
      avatar: {
        flex:1,
        width: 150,
        height: 150,
        borderRadius: 73,
        borderWidth: 4,
        borderColor: "#C7F4CE",
        //marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        //padding: 50,
        //resizeMode: 'contain',
        backgroundColor: 'white'
        // marginTop:130
      },
      avatarBox: {
        flex:1,
        width: 200,
        height: 150,
        // borderRadius: 73,
        // borderWidth: 4,
        // borderColor: "white",
        marginBottom: 10,
        alignSelf:'center',
        position: 'absolute',
        marginTop: 80        
      },

      modalavatar:{
        flex:1,
        width: width(90),
        //height: height(60)
        // borderRadius: 73,
        // borderWidth: 4,
        // borderColor: "white",
        // marginBottom:10,
        // alignSelf:'center',
        // position: 'absolute',
        ///resizeMode: 'contain'
      },

      modelImage: {
        width:'100%', 
        height: '60%', 
        resizeMode: 'contain',
        justifyContent:'center',
        alignContent:'center'
      },

      name:{
        fontSize: Fonts.size.h4,
        color:"#FFFFFF",
        fontWeight:'600',
      },
      body:{
        marginTop:40,
      },
      bodyContent: {
        // flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        padding:30,
        flexDirection:'column',
        position:'absolute'
      },
      name:{
        fontSize:Fonts.size.h5,
        color: "#696969",
        fontWeight: "600"
      },
      info:{
        fontSize:Fonts.size.regular,
        color: "#00BFFF",
        marginTop:10
      },
      description:{
        fontSize:Fonts.size.regular,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
      },
      buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#00BFFF",
      },
      backlogo:{
        position: 'absolute',
        left: 18,
        top:height(5),
        backgroundColor:'transparent',
        width:width(15),
        height:height(10),
        padding: 10,
        zIndex: 3000
      },
      homeIcon:{
        position: 'absolute',
        right: 18,
        top:height(6),
        backgroundColor:'transparent',
        width:width(15),
        height:height(10),
        zIndex: 3000
      },
      VoiceRecognition:{
        position: 'absolute',
        right: 18,
        top:height(5),
        backgroundColor:'transparent',
        width:width(15),
        height:height(3),
        zIndex: 3000
      },
})