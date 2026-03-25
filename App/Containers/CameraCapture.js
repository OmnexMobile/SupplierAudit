import React, {Component, createRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {Camera} from 'react-native-vision-camera';
import {Images} from '../Themes/index';
import OfflineNotice from '../Components/OfflineNotice';
import Fonts from '../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../Language/Language';
import {width, height} from 'react-native-dimension';
import Moment from 'moment';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import {Bars, Pulse} from 'react-native-loader';
import RNPhotoEditor from 'react-native-photo-editor';
import ImageMarker from 'react-native-image-marker';
import { Image as compressImage, Video, getVideoMetaData} from 'react-native-compressor';
 
// Styles
import styles from './Styles/CameraCaptureStyle';
 
class CameraCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captureState: 'CameraMode',
      imageData: '',
      imageName: '',
      imageType: '',
      capturedImagePath: '',
      imageURI: '',
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? 'DD-MM-YYYY'
          : this.props.data.audits.userDateFormat,
      timestamp: new Date(),
      devices: [],
      cameraType: 'back',
    };
    this.camera = createRef();
    this.capturePhoto = this.capturePhoto.bind(this);
  }
  componentDidMount = async () => {
    console.log('camera:capture mounted');
    const filesDir = this.getCaptureDir();
    console.log('camera:Ios-Android-Path', filesDir);
    RNFetchBlob.fs.exists(filesDir).then(exist => {
      if (!exist || exist == '') {
        RNFetchBlob.fs
          .mkdir(filesDir)
          .then(data => {
            console.log('camera:data directory created', data);
          })
          .catch(err => {
            console.log('err', err);
          });
      } else {
        RNFetchBlob.fs.isDir(filesDir).then(isDir => {
          if (isDir) {
            RNFetchBlob.fs.ls(filesDir).then(data => {
              console.log('camera:All files', data);
            });
          }
        });
      }
    });

    try {
      let cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'authorized') {
        cameraPermission = await Camera.requestCameraPermission();
      }
      console.log('camera:permission', cameraPermission);

      if (cameraPermission !== 'authorized') {
        Alert.alert(
          'Permission denied',
          'Please grant access to camera to capture and upload',
        );
        return;
      }

      const {devices, backDevice, frontDevice} = await this.loadCameraDevices();

      if (devices.length === 0) {
        Alert.alert('Camera unavailable', 'No usable camera was found.');
      }
    } catch (error) {
      console.log('camera:failed to initialize', error);
      Alert.alert(
        'Camera unavailable',
        'Unable to open the camera on this device.',
      );
    }
  };
 
  timestamp() {
    var date = new Date();
    var hours = date.getHours();
    // var min = date.getMinutes() == '0' ? '00' : date.getMinutes()
    var min = this.minuteChange(date.getMinutes());
 
    console.log('hours,min', hours + ':' + min);
    var time = hours + ':' + min;
 
    var getDate = new Date();
    var ISOdate = getDate.toISOString();
 
    var DefaultFormatL = this.state.selectedFormat;
    var sDateArr = ISOdate.split('T');
    var sDateValArr = sDateArr[0].split('-');
    var sTimeValArr = sDateArr[1].split(':');
    var outDate = new Date(
      sDateValArr[0],
      sDateValArr[1] - 1,
      sDateValArr[2],
      sTimeValArr[0],
      sTimeValArr[1],
    );
    var finaldate = Moment(outDate).format(DefaultFormatL);
 
    var finalFormat = finaldate + ' ' + time;
 
    return finalFormat.toString();
  }
 
  minuteChange(min) {
    console.log('min --', min);
    if (min > 9) {
      return min;
    } else {
      switch (min) {
        case 0:
          return '00';
 
        case 1:
          return '01';
 
        case 2:
          return '02';
 
        case 3:
          return '03';
 
        case 4:
          return '04';
 
        case 5:
          return '05';
 
        case 6:
          return '06';
 
        case 7:
          return '07';
 
        case 8:
          return '08';
 
        case 9:
          return '09';
 
        default:
          return '00';
      }
    }
  }
 
  storePhotoEdited = editedPath => {
    const sourcePath = editedPath || this.state.capturedImagePath;
    console.log('Camera:storePhotoEdited', sourcePath);
    console.log('Camera:Editor path', editedPath);
    // console.log('Date ==>', this.state.timestamp)
    console.log('Camera:CAptured time', this.timestamp());
    const capturePath = this.normalizePath(sourcePath);
    const newImgPath = this.getCaptureDir();
    const filepath = this.getFileUri(capturePath);
    console.log(capturePath, 'capturedilepat');
    console.log(filepath, 'camera:filepath');
 
    ImageMarker.markText({
      src: filepath,
      text: this.timestamp(),
      position: 'bottomRight',
      color: '#00ADD4',
      fontName: 'Arial-BoldItalicMT',
      fontSize: Platform.OS == 'ios' ? 50 : 38,
      scale: 1,
      quality: 90,
      saveFormat: 'base64'
    }).then(res => {
      if (res.startsWith("data:")){
 
        res = res.split(',')[1];
 
      }
      console.log('Camera:theÂ pathÂ is ' + res);
          //res = Platform.OS == 'ios' ? '/'+res : res;
          console.log('Camera: modified path ' + res);
      this.doCompressImage(res).then(data => {   
        let timeStamp = Moment().unix();
          console.log('Camera:fetch data', data);
          console.log('Camera:newImgPath--->', newImgPath);
          const fileName = 'CapturedImage_' + timeStamp + '_edited.jpg';
          const uripath = newImgPath + '/' + fileName;
          const cleanedData =
            typeof data === 'string' ? data.replace(/\s/g, '') : data;
          RNFetchBlob.fs.writeFile(uripath, cleanedData, 'base64').then(data => {
            console.log('Camera:File added sucessfully');
          }).then((res)=> {
            this.setState(
              {
                captureState: 'Captured',
                imageData: 'Camera photo added',//data,
                imageName: fileName,
                imageType: 'image/jpg',
                imageURI: uripath,
                capturedImagePath: uripath
              },
            () => {
                console.log('Camera:Capture Success URI.', this.state.imageURI);
                  //Deleting the Captured image after edit operation performed,
                this.deleteImageAfterEdit(capturePath, uripath);
              },
            );
          
          });         
        });
    }).catch(err => {
      console.log('camera: Error', err);
    });
  };
 
  doCompressImage = async (fileRes) => {
    console.log('one:first-6',fileRes);
    return new Promise((resolve,reject) => {
      try{
          const result =  compressImage.compress(fileRes, {
            input: 'base64',
            maxWidth: 1000,
            quality: 0.8,
            returnableOutputType: 'base64',
          }).then(res => {            
              console.log("one: Method - Compressed Image response")
               res == "" ? resolve(fileRes) :
              resolve(res);           
          }).catch(err => {
            console.log(err, 'one:doCompressImage');
            resolve(fileRes);
        });
      } catch (err) {
        console.log("one:compres Image Method Error",err)
        resolve(fileRes);
      }
    });
  }
  waitFor = timeout =>
    new Promise(resolve => {
      setTimeout(resolve, timeout);
    });

  sortCameraDevices = (left, right) => {
    let leftPoints = 0;
    let rightPoints = 0;

    const leftDevices = Array.isArray(left?.devices) ? left.devices : [];
    const rightDevices = Array.isArray(right?.devices) ? right.devices : [];

    if (leftDevices.includes('wide-angle-camera')) {
      leftPoints += 2;
    }
    if (rightDevices.includes('wide-angle-camera')) {
      rightPoints += 2;
    }

    if (leftDevices.includes('telephoto-camera')) {
      leftPoints -= 2;
    }
    if (rightDevices.includes('telephoto-camera')) {
      rightPoints -= 2;
    }

    if (leftDevices.length > rightDevices.length) {
      leftPoints += 1;
    }
    if (rightDevices.length > leftDevices.length) {
      rightPoints += 1;
    }

    return rightPoints - leftPoints;
  };

  loadCameraDevices = async (attempt = 0) => {
    let devices = await Camera.getAvailableCameraDevices();
    devices = Array.isArray(devices) ? devices.slice().sort(this.sortCameraDevices) : [];

    if (devices.length === 0 && attempt === 0) {
      await this.waitFor(500);
      return this.loadCameraDevices(1);
    }

    const backDevice = this.getCameraDeviceByPosition('back', devices);
    const frontDevice = this.getCameraDeviceByPosition('front', devices);
    const fallbackDevice = devices[0] || null;
    const fallbackPosition =
      fallbackDevice && String(fallbackDevice.position).toLowerCase() === 'front'
        ? 'front'
        : 'back';

    this.setState({
      devices,
      cameraType: backDevice ? 'back' : frontDevice ? 'front' : fallbackPosition,
    });

    return {
      devices,
      backDevice,
      frontDevice,
    };
  };

  getCameraDeviceByPosition(position, devices = this.state.devices) {
    const matchingDevices = (devices || []).filter(
      device => String(device.position).toLowerCase() === position,
    );
    if (matchingDevices.length === 0) {
      return null;
    }

    if (position === 'back') {
      return (
        matchingDevices.find(
          device =>
            device.isMultiCam &&
            Array.isArray(device.devices) &&
            device.devices.includes('wide-angle-camera'),
        ) ||
        matchingDevices.find(
          device =>
            Array.isArray(device.devices) &&
            device.devices.includes('wide-angle-camera'),
        ) ||
        matchingDevices[0]
      );
    }

    return matchingDevices[0];
  }

  getActiveDevice() {
    return (
      this.getCameraDeviceByPosition(this.state.cameraType) ||
      this.getCameraDeviceByPosition('back') ||
      this.getCameraDeviceByPosition('front') ||
      this.state.devices[0] ||
      null
    );
  }

  changeCameraType() {
    const nextCameraType = this.state.cameraType === 'back' ? 'front' : 'back';
    if (!this.getCameraDeviceByPosition(nextCameraType)) {
      Alert.alert('Camera unavailable', `No ${nextCameraType} camera was found.`);
      return;
    }
    this.setState({
      cameraType: nextCameraType,
    });
  }
  handleCameraError = error => {
    console.log('camera:runtime error', error);
    Alert.alert(
      'Camera unavailable',
      'Unable to open the camera on this device.',
    );
  };

  capturePhoto = async () => {
    var ImgPath = '';
    const captureDir = this.getCaptureDir();
    if (this.camera.current) {
      console.log('ccenter');
      try {
        const photo = await this.camera.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'auto',
          // enableAutoRedEyeReduction: true
        });
        console.log(photo, 'camera:photoconsole');
        let filename = photo.path.substring(photo.path.lastIndexOf('/')+1);
        let extn = filename.substring(filename.lastIndexOf('.')+1);
        var newfileName = 'CapturedImage_' + Moment().unix() + '.' + extn;
        ImgPath = this.normalizePath(photo.path);
        var data = await RNFS.readFile(
          ImgPath,
          'base64',
        ).then(res => {
          console.log('camera: ImgPath res', ImgPath, res)
          const newImgPath = captureDir + '/' + newfileName;
          console.log('camera:New ImgPath', newImgPath)
        RNFetchBlob.fs.writeFile(
          newImgPath,
          res,
          'base64',
        )
        .then(res => {
          console.log('camera: New ImgPath', newImgPath,res)
          this.setState({
            captureState: 'Capturing',
            capturedImagePath: newImgPath,
            imageName: 'photo',
          });
          // if (Platform.OS == 'ios') {
          //   this.storePhotoEdited();
          // } else
          {
          RNPhotoEditor.Edit({
            path: newImgPath,
            onDone: this.storePhotoEdited,
            onCancel: this.retakePhoto,
 
            //onClear: this.retakePhoto,
            hiddenControls: ['save','clear'],
            colors: [
              '#ff0000',
              '#000000',
              '#808080',
              '#a9a9a9',
              '#FFFFFF',
              '#0000ff',
              '#00ff00',
              '#ffff00',
              '#ffa500',
              '#800080',
              '#00ffff',
              '#a52a2a',
              '#ff00ff',
            ],
          });
        }
        });
        });
 
      } catch (err) {
        console.log("camera:Error in Capture Image:",err);
        Alert.alert('Capture failed', 'Unable to take a photo right now.');
      }
    } else {
      Alert.alert('Camera unavailable', 'The camera is still loading.');
    }
  };
 
  async deleteImageAfterEdit(filepath, keepPath){
    const normalizedFile = this.normalizePath(filepath);
    const normalizedKeep = this.normalizePath(keepPath);
    if (!normalizedFile) {
      return;
    }
    if (normalizedKeep && normalizedFile === normalizedKeep) {
      console.log('Camera: Skip delete, same path', normalizedFile);
      return;
    }
    console.log("Camera: Delete file path", normalizedFile);
    try {
      const exists = await RNFetchBlob.fs.exists(normalizedFile);
      if (!exists) {
        console.log('Camera:Captured old missing', normalizedFile);
        return;
      }
      await RNFetchBlob.fs.unlink(normalizedFile);
      console.log('Camera:Captured old Deleted!!');
    } catch (err) {
      console.log('Camera:Captured old NOT Deleted!!', err);
    }
  }
 
  retakePhoto = () => {
    this.setState({
      captureState: 'CameraMode',
      imageData: '',
      imageName: '',
      imageType: 'image/jpg',
      capturedImagePath: '',
    });
  };
 
  IosPath(path) {
    console.log(path, 'pathvariable');
     let IosFiles = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'IosFiles';
     let arr = path.split('/');
     let iosPath = IosFiles + '/' + arr[arr.length - 1];
    let iosPathfile = decodeURIComponent(iosPath);
    console.log(iosPathfile, 'pathvariable1');
    return iosPath;
  }
 
  saveCapturedImage = () => {
    var cameraCapture = [];
 
    cameraCapture.push({
      name: this.state.imageName,
      type: this.state.imageType,
      data: this.state.imageData,
      uri: this.state.capturedImagePath,
    });
 
    this.props.storeCameraCapture(cameraCapture);
 
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 500);
  };

  normalizePath(path) {
    if (!path) {
      return '';
    }
    const withoutScheme = path.replace(/^file:(\/\/)?/, '');
    return withoutScheme.replace(/^\/+/, '/');
  }

  getCaptureDir() {
    const baseDir = this.normalizePath(RNFetchBlob.fs.dirs.DocumentDir);
    const folderName = Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles';
    return `${baseDir}/${folderName}`;
  }

  getFileUri(path) {
    if (!path) {
      return '';
    }
    if (path.startsWith('file://') || path.startsWith('content://')) {
      return path;
    }
    const normalizedPath = this.normalizePath(path);
    if (!normalizedPath) {
      return '';
    }
    return `file://${normalizedPath}`;
  }
 
  render() {
    const activeDevice = this.getActiveDevice();
    return (
      <View style={styles.wrapper}>
        <OfflineNotice />
 
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65,
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.backlogo}>
                <Icon name="angle-left" size={30} color="white" />
              
              </View>
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.headingText}>
                {strings.Camera_Capture_Head}
              </Text>
            </View>
            <View style={styles.headerDiv}>
            <View style={styles.backlogo}>
              
            <TouchableOpacity onPress={this.changeCameraType.bind(this)}>
            <Icon name="rotate-right" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
            </View>
          </View>
         
        </ImageBackground>
 
        <View style={styles.auditPageBody}>
          {this.state.captureState == 'CameraMode' ? (
            activeDevice ? (
            <Camera
              ref={this.camera}
              photo={true}
              style={styles.detailsCard}
              device={activeDevice}
              zoom={activeDevice.neutralZoom || 1}
              isActive={true}
              onError={this.handleCameraError}
              // type={RNCamera.Constants.Type.back}
              // flashMode={RNCamera.Constants.FlashMode.on}
              // permissionDialogTitle={strings.Camera_Permission_Head}
              // permissionDialogMessage={strings.Camera_Permission_Content}
              // onGoogleVisionBarcodesDetected={({ barcodes }) => {
              //   console.log(barcodes);
              // }}
            />
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}>
                <Text
                  style={{
                    fontSize: Fonts.size.regular,
                    padding: 10,
                    textAlign: 'center',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  Loading camera...
                </Text>
              </View>
            )
          ) : this.state.captureState == 'Capturing' ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <Text
                style={{
                  fontSize: Fonts.size.regular,
                  padding: 10,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Capturing_Message}
              </Text>
              <Bars size={20} color="#48BCF7" />
            </View>
          ) : (
            <View style={[styles.detailsCard, {padding: 10}]}>
              <Text
                style={{
                  fontSize: Fonts.size.regular,
                  padding: 10,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Regular',
                }}>
                {strings.Preview_Head}
              </Text>
           
                <Image
                  source={{uri: this.getFileUri(this.state.capturedImagePath)}}
                  style={{
                    width: width(90),
                    height: height(65),
                    resizeMode: 'stretch',
                  }}
                />
              
            </View>
          )}
        </View>
 
       
        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 70,
            }}>
            {this.state.captureState == 'Captured' ? (
              <View style={styles.footerDiv}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={this.retakePhoto.bind(this)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.h5,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Camera_Retake}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: width(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={Images.lineIcon} />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: width(45),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={this.saveCapturedImage.bind(this)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: Fonts.size.h5,
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {strings.Save}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.footerDiv}>
                {this.state.captureState == 'CameraMode' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: width(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={this.capturePhoto}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: Fonts.size.h5,
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        {strings.Camera_Capture}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.footerLoader}>
                    <Pulse size={20} color="white" />
                  </View>
                )}
              </View>
            )}
          </ImageBackground>
        </View>
      </View>
    );
  }
}
 
const mapStateToProps = state => {
  return {
    data: state
  };
};
 
const mapDispatchToProps = dispatch => {
  return {
    storeCameraCapture: cameraCapture =>
      dispatch({type: 'STORE_CAMERA_CAPTURE', cameraCapture}),
  };
};
 
export default connect(mapStateToProps, mapDispatchToProps)(CameraCapture);
