import { StyleSheet, Dimensions} from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/index'

import { width , height , totalSize } from 'react-native-dimension'

let CIRCLE_RADIUS = 45
let Window = Dimensions.get('window')

export default StyleSheet.create({
    main:{
        width:Window.width,
        height:height(30),
        backgroundColor:'transparent',
    },

  SectionHeaderStyle:{
    backgroundColor : '#b9ff87',
    fontSize : totalSize(2.5),
    padding: 5,
    color: '#000',
    width:width(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius:5,
    borderTopLeftRadius:5
  },
  SectionListItemStyle:{
    fontSize : totalSize(2.5),
    marginBottom: 5,
    color: 'black',
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    height:height(8),
    width:width(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius:5,
    borderBottomLeftRadius:5

    // fontWeight: 'bold'
  },
  titleView:{
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'column',
  },

  titleCard:{
      width:width(95),
    height:height(9),
    backgroundColor:'white',
    flexDirection: 'row',
    borderRightWidth:0.5,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth:0


  },
  titleCard1:{
    width:width(95),
    height:height(9),
    backgroundColor:'white',
    flexDirection: 'row',
    borderRightWidth:0.5,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth:0.5
  }
})
