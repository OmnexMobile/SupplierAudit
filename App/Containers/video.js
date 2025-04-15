import React, { Component, createRef } from "react";
import {
  View,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  ImageBackground,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { Camera as RNCamera } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles";
import Video from "react-native-video";
import Moment from "moment";
import { connect } from "react-redux";
import styles1 from "./Styles/CameraCaptureStyle";

import { Images } from "../Themes/index";
import Fonts from "../Themes/Fonts";
import { strings } from "../Language/Language";
import { width, height } from "react-native-dimension";
import { Stopwatch } from "react-native-stopwatch-timer";
import { Video as compressVideo, getVideoMetaData} from 'react-native-compressor';
import RNFetchBlob from "react-native-fetch-blob";

// const FLASH_MODE = [
//   RNCamera.Constants.FlashMode.on,
//   RNCamera.Constants.FlashMode.off,
//   RNCamera.Constants.FlashMode.auto,
// ];

var cameraCapture = [];

class CameraCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
      flashMode: 1,
      isRecordStart: false,
      isBack: false,
      isPaused: false,
      videoResponse: "",
      title: "",
      location: "",
      description: "",
      videoUri: "",
      videoName: "video",
      videoType: "video/mp4",
      selectedFormat:
        this.props.data.audits.userDateFormat === null
          ? "DD-MM-YYYY"
          : this.props.data.audits.userDateFormat,
      timestamp: new Date(),
      stopwatchStart: false,
      runvideoplayer: false,
      devices: []
    };
    this.camera = createRef()
  }

  componentDidMount = async () => {
    console.log('capture mounted');
    const cameraPermission = await RNCamera.getCameraPermissionStatus();
    console.log(cameraPermission, 'camerapermission');
    if (cameraPermission !== 'authorized') {
      await RNCamera.requestCameraPermission();
      // Alert.alert(
      //   'Permission denied',
      //   'Please grant access to camera to capture and upload',
      // );
    } else {
      const devices = await RNCamera.getAvailableCameraDevices();
      console.log(devices, 'camerapermission');
      this.setState({ isModal: true, isBack: false, devices,isModal: true });
    }
  };

  doCompressVideo = async (uri) => {
    if (!uri) return;
    var newVidPath = '/' + RNFetchBlob.fs.dirs.DocumentDir + '/' + (Platform.OS == 'ios' ? 'IosFiles' : 'AuditFiles');
    var newVidName =  "Capturedvideo_" + Moment().unix() + ".mp4"
    console.log(newVidName, 'one:Video File name');
    newVidPath = newVidPath + '/' + newVidName;
    newVidPath = newVidPath;
    console.log(newVidPath, 'one:filepath');

    console.log('one:1 - Inside Compress video method');
    return new Promise((resolve,reject) => {
      try {
        console.log('one:1 - Inside Compress video Promise');
          const result = compressVideo.compress(uri,
          {
            compressionMethod: 'auto',
            minimumFileSizeForCompress: 0,
          },
          (progress) => {
              console.log('one:2Compression Progress: ', progress);             
          }
        );
        result.then((path) => {
          console.log('one:3 Method Compressed Video', path);
          path = Platform.OS === 'ios' ? decodeURIComponent(path.replace('file:/','')) : path;
          RNFetchBlob.fs.writeFile(newVidPath, path, 'uri').then(res => {     
            console.log('one:Video writefile',res);       
            resolve(newVidPath);                    
          }).catch(err => {
            console.log(err, 'one:errorin_writefile');
            resolve(uri);                    
          });
        })
      } catch (error) {
         console.log({ error }, 'one:compression error');
         reject(err);
      }
    });
  } 

  recordVideo = () => {
    const { isRecordStart } = this.state;
    this.setState({
      isRecordStart: !this.state.isRecordStart,
      stopwatchStart: true,
    });
    console.log('one: record Video Inside');
    if (!isRecordStart) {
      try {
        // alert(JSON.stringify(this.camera.current))
        // return
        try {
          this.camera.startRecording({
            onRecordingFinished: (video) => {
              let urlString = video.path;
              console.log('one: record Video url', urlString);
              this.doCompressVideo(urlString).then((urlString) => {
                console.log('one: record Video compressed', urlString);
                this.setState({
                  videoUri: urlString,
                  videoName: "Capturedvideo_" + Moment().unix() + ".mp4",
                 isModal: false,
                   runvideoplayer: true
                },()=>{
                  cameraCapture = [];
                  cameraCapture.push({
                    name: this.state.videoName,
                    type: this.state.videoType,
                    data: this.state.videoUri,
                    uri: this.state.videoUri,
                  });
                  console.log("uri value:" + cameraCapture[0].uri);
                });
    
              }).catch (error => {
                console.log({ error }, 'one:compression error');
                reject(err);
             });                       
            },
            onRecordingError: (error) => {
              alert("up msg  " + JSON.stringify(error.message))
            },
          })
  
        } catch (error) {
          alert("down msg  " + JSON.stringify(error.message))
        }
      
       
        // this.camera
        //   .recordAsync({
        //     maxDuration: 60,
        //   })
        //   .then((video) => {
        //     let urlString = video.uri;
        //     if (Platform.OS === "android") {
        //       urlString = video.uri.replace("file://", "");
        //     }
        //     const videoDetails = {
        //       deviceOrientation: video.deviceOrientation,
        //       isRecordingInterrupted: video.isRecordingInterrupted,
        //       uri: urlString,
        //       videoOrientation: video.videoOrientation,
        //     };

        //     this.setState({
        //       videoUri: video.uri,
        //       videoName: "Capturedvideo_" + Moment().unix() + ".mp4",
        //       //isModal: false,
        //     });

        //     cameraCapture = [];
        //     cameraCapture.push({
        //       name: this.state.videoName,
        //       type: this.state.videoType,
        //       data: this.state.videoUri,
        //       uri: this.state.videoUri,
        //     });
        //     console.log("uri value:" + cameraCapture[0].uri);
        //     //this.onVideoUpload(videoDetails);
        //   })
        //   .catch((e) => {
        //     this.stopRecord();
        //   });
      } catch (e) {
        this.stopRecord();
        console.log(e, "ERRRR");
      }
    } else {
      // stop record
      console.log("stop recording");
      this.setState({ stopwatchStart: false });
      this.stopRecord();
    }
  };

  stopRecord =async () => {
    const video = await this.camera.stopRecording();

    //    var cameraCapture = []
    //    cameraCapture.push({
    //      name: this.state.videoName,
    //      type: this.state.videoType,
    //      data: this.state.videoUri,
    //      uri: this.state.videoUri
    //    })
    //  console.log("uri value "+ cameraCapture[0].uri)
    //this.props.storeCameraCapture(cameraCapture);
    // setTimeout(() => {
    //   //this.props.navigation.goBack()
    //   console.log("uri value " + cameraCapture[0]);

    //   if (this.state.videoUri !== "") {
    //     console.log("video uri state value not empty");
    //     this.setState({ runvideoplayer: true });
    //   }
    // }, 500);
  };

  toggleCamera = async () => {
    // this.setState((prevState) => ({
    //   cameraType:
    //     prevState.cameraType === RNCamera.Constants.Type.back
    //       ? RNCamera.Constants.Type.front
    //       : RNCamera.Constants.Type.back,
    // }));
  };

  renderVideoPlayer = () => {
    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: "stretch",
            width: "100%",
            height: 65,
          }}
        >
          <View
            style={{
              width: width(100),
              zIndex: 3000,
              flexDirection: "row",
              backgroundColor: "white",
              padding: 5,
              alignItems: "center",
              justifyContent: "center",
              height: 65,
              elevation: 4,
              shadowOffset: { width: 2, height: 10 },
              shadowColor: "lightgrey",
              shadowOpacity: 0.5,
              shadowRadius: 4,
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  width: width(15),
                  height: 65,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="angle-left" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: width(70),
                height: 65,
              }}
            >
              <Text
                style={{
                  fontSize: Fonts.size.h4,
                  fontFamily: Fonts.type.base,
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "OpenSans-Bold",
                }}
              >
                Take a Video
              </Text>
            </View>
            <View
              style={{
                width: width(15),
                height: 65,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          </View>
        </ImageBackground>
        <View
          style={{
            height: "80%",
          }}
        >
          <Video
            source={{ uri: this.state.videoUri }}
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              bottom: 30,
              zIndex: -100,
            }}
            controls={true}
            resizeMode={"cover"}
            ref={(ref) => {
              this.player = ref;
            }}
            paused={this.state.isPaused}
            onVideoEnd={() => {
              this.setState({ isPaused: !this.state.isPaused });
            }}
          />
        </View>

        <View style={styles.footer}>
          <ImageBackground
            source={Images.Footer}
            style={{
              resizeMode: "stretch",
              width: "100%",
              height: 70,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: width(100),
                height: 70,
                position: "absolute",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: width(45),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: Fonts.size.h5,
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: width(10),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image source={Images.lineIcon} />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: width(45),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.props.storeCameraCapture(cameraCapture);
                    this.props.navigation.goBack();
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: Fonts.size.h5,
                      fontFamily: "OpenSans-Regular",
                    }}
                  >
                    {strings.Save}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  renderRecordModel = () => {
    const { isModal, cameraType, isRecordStart } = this.state;

    const options = {
      container: {
        backgroundColor: "#000",
        padding: 5,
        borderRadius: 5,
        width: 120,
      },
      text: {
        fontSize: 24,
        color: "red",
        marginLeft: 7,
      },
    };

    return (
      <Modal isVisible={isModal} backdropOpacity={1} style={styles.container}>
        <SafeAreaView style={styles.flexView}>
          <ImageBackground
            source={Images.DashboardBG}
            style={{
              resizeMode: "stretch",
              width: "100%",
              height: 65,
            }}
          >
            <View
              style={{
                width: "100%",
                // zIndex: 3000,
                flexDirection: "row",
                // backgroundColor: "white",
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
                height: 65,
                elevation: 4,
                shadowOffset: { width: 2, height: 10 },
                shadowColor: "lightgrey",
                shadowOpacity: 0.5,
                shadowRadius: 4,
              }}
            >
              {/* <TouchableOpacity
                onPress={() => {
                  this.setState(
                    {
                      isModal: false,
                    },
                    () => {
                      this.props.navigation.goBack();
                    }
                  );
                }}
              > */}
              <TouchableOpacity onPress={()=>{this.props.navigation.goBack();
}}>
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    width: width(15),
                    height: 65,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name="angle-left" size={40} color="white" />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: width(70),
                  height: 65,
                }}
              >
                <Text
                  style={{
                    fontSize: Fonts.size.h4,
                    fontFamily: Fonts.type.base,
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: "OpenSans-Bold",
                  }}
                >
                  Take a Video
                </Text>
              </View>
              <View
                style={{
                  width: width(15),
                  height: 65,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            </View>
          </ImageBackground>

          <View style={{ alignItems: "center", backgroundColor: "black" }}>
            <Stopwatch
              laps={false}
              start={this.state.stopwatchStart}
              startTime={0}
              msecs={false}
              options={options}
              //getTime={(time)=>()}
            />
          </View>

          {
            this.state.devices.length > 0 ?
            <RNCamera
            ref={(ref) => {
              this.camera = ref;
            }}
            video={true}
            style={styles.flexView}
            device={this.state.devices[0]}
            isActive
            // type={cameraType}
            // flashMode={FLASH_MODE[this.state.flashMode]}
            // androidCameraPermissionOptions={{
            //   title: "Permission to use camera",
            //   message: "We need your permission to use your camera",
            //   buttonPositive: "Ok",
            //   buttonNegative: "Cancel",
            // }}
            // androidRecordAudioPermissionOptions={{
            //   title: "Permission to use audio recording",
            //   message: "We need your permission to use your audio",
            //   buttonPositive: "Ok",
            //   buttonNegative: "Cancel",
            // }}
          />
            :
            null
          }

        
          <View style={styles.buttonsView}>
            <TouchableOpacity
              style={styles.outerCircle}
              // onLongPress={this.recordVideo}
              onPress={this.recordVideo.bind(this)}
            >
              <View
                style={[
                  isRecordStart ? styles.innerCircle2 : styles.innerCircle,
                ]}
              />
            </TouchableOpacity>

            {/* {!this.state.isRecordStart ? (
              <TouchableOpacity
                style={styles.rotateButton}
                onPress={this.toggleCamera}
              >
                <Image
                  source={require("./Images/rotate.png")}
                  style={styles.rotateImage}
                />
              </TouchableOpacity>
            ) : null} */}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  render() {
    const { videoUri } = this.state;
    return (
      <View style={{ flex: 1, height: "80%" }}>
        {!this.state.runvideoplayer
          ? this.renderRecordModel()
          : this.renderVideoPlayer()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeCameraCapture: (cameraCapture) => {
      dispatch({ type: "STORE_CAMERA_CAPTURE", cameraCapture });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraCapture);