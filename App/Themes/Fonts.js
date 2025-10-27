import { StyleSheet  } from 'react-native'

const type = {
  base: 'Avenir-Book',
  bold: 'Avenir-Black',
  emphasis: 'HelveticaNeue-Italic'
}

const colors = StyleSheet.create({
  mildGrey: { color: "grey" },
  indicGrey: { color: "#C5C9CD" },
  blackGrey: { color: "#A2A1A1" },
  headBlue: { color: "#00A2E5" },
  stripBlack: { color: "#1d1d1d" },
  viley: { color: "#485B9E" },
  slideGrey: { color: "#A6A6A6" },
  thickGrey: { color: "#545454" }
})

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  mediump:16,
  medium: 14,
  small: 12,
  tiny: 8.5
}

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  },
  whitneyBook_22 : { 
    fontSize: 22,
  },
  whitneyBook_20 : { 
    fontSize: 20,
  },
  whitneyBook_18 : { 
    fontSize: 18,
  },
  whitneyBook_17 : { 
    fontSize: 17,
  },
  whitneyBook_16 : { 
    fontSize: 16,
  },
  whitneyBook_14 : { 
    fontSize: 14,
  },
  whitneyBook_12 : { 
    fontSize: 12,
  },
  whitneyBook_10 : { 
    fontSize: 10,
  }
}

export default {
  colors,
  type,
  size,
  style
}
