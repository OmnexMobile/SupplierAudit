import { StyleSheet, Dimensions} from 'react-native'
import { width } from 'react-native-dimension'
import Fonts from '../../Themes/Fonts'

let Window = Dimensions.get('window')

export default StyleSheet.create({

  // Header styles
  header: {
    width:'100%',
    zIndex: 3000,
    flexDirection: 'row',
    //backgroundColor: 'white',
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
  heading:{
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems:'center', 
    width: '70%',
    height: 65
  },
  headingText:{
    fontSize: Fonts.size.h4,
    fontFamily : Fonts.type.base,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'OpenSans-Bold'
  },
  backlogo:{
    flexDirection: 'row',
    backgroundColor:'transparent',
    width:'13%',
    height: 65,
    justifyContent: 'center', 
    alignItems:'center'
  },
  headerDiv:{
    width:'15%',
    height: 65,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightHeader: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems:'center',
    right: 10,
    height: 80
  },
  backgroundImage: {
    resizeMode:'stretch',
    width:'30%',
    height: 80,
    zIndex: 0
  },

  // Footer styles
  footer:{
    bottom:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    backgroundColor:'transparent',
    height: 65,
    zIndex: 3000
  },  
  footerDiv:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:65,
    position:'absolute'
  },
  footerLoader: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%'
  },
  footerTextContent: {
    color:'white', 
    fontSize: Fonts.size.regular
  },
  footerDivContent: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  // Body styles
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
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'flex-start'
  },

  // Card view styles
  scrollViewBody: {
    height:'100%', 
    backgroundColor: 'transparent' 
  },
  cardBox:{
    backgroundColor:'white',
    margin: 10,
    elevation: 3,
    flexDirection:'column',
    borderRadius: 5,
    padding: 5,
    borderWidth:0.5,
    borderColor:'lightgrey'

  },
  sectionTop:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    padding: 10    
  },
  sectionBottom:{
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10     
  },
  sectionContent: {
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center'    
  },
  boxHeader: {
    width: '100%',
    color:'#A6A6A6', 
    fontSize: Fonts.size.small,
    fontFamily:'OpenSans-Regular'
  },
  boxContent: {
    width: '100%',
    color:'#485B9E', 
    fontSize: Fonts.size.regular,
    fontFamily:'OpenSans-Regular'
  }
  
})
