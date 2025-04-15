# Omnex fixes

## In Node modules
* ramdasauce is not installed by yarn sometimes (manually take clone)
* Inside `react-native-scrollable-tab-view` index.js --> replace `this.scrollView.getNode().scrollTo` to `this.scrollView.scrollTo`
* Inside react-native-material-textfield corrections for `scrollable-tab-view` library errors [solution](https://stackoverflow.com/questions/61226530/typeerror-undefined-is-not-an-object-evaluating-reactnative-animated-text-pr)
* For pod install failures of few libraries (Replacing React/core with React-core in all podSpec files) - [solution](https://stackoverflow.com/questions/58305191/react-native-fetch-blob-issue-pod-not-installing-for-ios)
* Inside @react-navigation/native/src/createKeyboardAwareNavigator.js  --> replace `currentlyFocusedField` with `currentlyFocusedInput` 




## Deprecated Library changes (cause of crash)
* `react-native-collapse-view` - 5 years old library changed to `react-native-collapsible`
* `react-native-material-dropdown` crashing in Projects screen
* `ListView`
*  NetInfo used imported from 'react-native'
*  New NetInfo listener changes
*  DeviceInfo getUniqueId() moved to Utils (async function) - old deviceInfo used UIWebkit (deprecated by iOS, cause for app rejection in testflight stage itself)


## Fix for firebase analytics
* https://stackoverflow.com/questions/68663243/error-no-known-class-method-for-selector-setscreennamescreenclass


## Upgraded React Native version
* 0.59 to 0.66.3 
* This resolves deprecated native libraries for iOS and Android (React native 0.60+ comes with AndroidX by default)

