import React, { Component } from 'react'
import { View, Platform, Text, Image, InteractionManager, TouchableOpacity, Dimensions, ScrollView, TextInput, ImageBackground } from 'react-native'
import { Images } from '../Themes/index'
import styles from './Styles/CheckPointScreenStyle'
import { width } from "react-native-dimension"
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { connect } from "react-redux";
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { Dropdown } from 'react-native-element-dropdown'
import OfflineNotice from '../Components/OfflineNotice'
import Toast, { DURATION } from "react-native-easy-toast";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import ResponsiveImage from 'react-native-responsive-image';
import Modal from "react-native-modal"
import Fonts from '../Themes/Fonts'
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../Language/Language';
import { ConfirmDialog } from 'react-native-simple-dialogs'
// import Slider from 'react-native-slider'
import { debounce, once } from "underscore";
import Slider from '@react-native-community/slider';
import Moment from 'moment'
import constant from '../Constants/AppConstants'

let Window = Dimensions.get('window')

// Yes | No = M1
// True | False = M2
// Yes | No | N/A = M3
// OK | NOT OK | N/A = M4

class CheckPointScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      radiovalue: [],
      checkpointList: [],
      token: '',
      RadioLogic: [],
      checkPointsDetails: [],
      dialogVisible: false,
      dialogVisibleReset: false,
      dialogVisibleNC: false,
      dialogVisibleAttach: false,
      dialogVisibleNCR: false,
      raiseID: [],
      dropProps: [],
      ischeckLPA: true,
      LPAdrop: [],
      dropdown: [],
      checkPointsValues: [],
      auditId: '',
      isSaving: false,
      isContentLoaded: true,
      isNCAllowed: 0,
      isFormValid: true,
      isUnsavedData: false,
      ChecklistTemplateId: 0,
      ncofiPassAuditId: 0,
      ncofiPassTemplateId: 0,
      checkListdata: [],
      displayData: [],
      autoscroll: false,
      breadCrumbText: undefined,
      CheckAttach: false,
      CheckRemark: false,
      count: 0,
      checkMandate: true,
      mandateCheckpoints: 0,
      mandatoryCheck: 0,
      totalfilled: 0,
      totalCheck: 0,
      optionalCheck: 0,
      attachSelectedItem: null,
      cAttachData: '',
      cAttachType: '',
      ncRemovalTemplateId: 0,
      scorevalue: 1,
      go_home:false
    }
  }

  componentDidMount() {
    InteractionManager.setDeadline(500);
    InteractionManager.runAfterInteractions(() => {
      // ...long-running synchronous task...
      this.LongTask()
    });
  }

  LongTask() {
    if (this.props.data.audits.language === 'Chinese') {
      this.setState({ ChineseScript: true }, () => {
        strings.setLanguage('zh')
        this.setState({})
        console.log('Chinese script on', this.state.ChineseScript)
      })
    }
    else if (this.props.data.audits.language === null || this.props.data.audits.language === 'English') {
      this.setState({ ChineseScript: false }, () => {
        strings.setLanguage('en-US')
        this.setState({})
        console.log('Chinese script off', this.state.ChineseScript)
      })
    }
    var cameraCapture = []
    this.props.storeCameraCapture(cameraCapture)

    console.log('Loading checkpoints...', this.props.navigation.state.params)
    this.setState({
      isContentLoaded: true,
      ChecklistTemplateId: this.props.navigation.state.params.ChecklistTemplateId,
      auditId: this.props.navigation.state.params.AuditID,
      displayData:this.props.navigation.state.params.CheckPointname,
      // displayData: this.props.navigation.state.params.CheckPointname.length > 30 ? this.props.navigation.state.params.CheckPointname.slice(0, 20) + '...' : this.props.navigation.state.params.CheckPointname,
      // breadCrumbText: this.props.navigation.state.params.breadCrumbText.length > 30 ? this.props.navigation.state.params.breadCrumbText.slice(0, 30) + '...' : this.props.navigation.state.params.breadCrumbText
      breadCrumbText: this.props.navigation.state.params.breadCrumbText

    }, () => {
      console.log('Please wait...', this.state.breadCrumbText)
      // console.log('getting props',this.props.data.audits)
      var auditRecords = this.props.data.audits.auditRecords
      var checkPoints = null
      var getLPA = null
      var AuditCheckpointDetail = null
      var scoreTypes = null

      console.log('Getting props', auditRecords)
      // getting the particular checkpoint related to the checklist

      var RelatedCheckpoints = []

      for (var i = 0; i < auditRecords.length; i++) {
        if (auditRecords[i].AuditId == this.state.auditId) {
          for (var j = 0; j < auditRecords[i].Listdata.length; j++) {
            if (this.state.ChecklistTemplateId == auditRecords[i].Listdata[j].ParentId) {
              RelatedCheckpoints.push(auditRecords[i].Listdata[j])
            }
          }
          if (auditRecords[i].Listdata) {
            checkPoints = RelatedCheckpoints
          }
          getLPA = auditRecords[i].CheckpointLogic.LPAApproach
          AuditCheckpointDetail = auditRecords[i].CheckpointLogic.AuditCheckpointDetail
          scoreTypes = auditRecords[i].CheckpointLogic.ScoreType
        }
      }
      console.log('RelatedCheckpoints', RelatedCheckpoints)

      // console.log('getLPA',getLPA)
      //if(this.props.navigation.state.params.Check){
      var dropdata = []
      // var lpaList = this.props.navigation.state.params.LogicPass.LPAApproach
      var lpaList = getLPA
      // console.log('data drop', data)  

      if (lpaList) {
        for (var i = 0; i < lpaList.length; i++) {
          dropdata.push({ id: lpaList[i].ApproachId, value: lpaList[i].ApproachName.toString() })
        }
      }
      // console.log('dropdata',dropdata)        

      // var data = this.props.navigation.state.params.LogicPass.AuditCheckpointDetailvar data
      var data = AuditCheckpointDetail
      var checkPointList = []
      var checkPointsDetails = []
      console.log('Response data', data)

      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (this.state.ChecklistTemplateId == data[i].ParentId) {
            var scoreTypesData = [{
              id: "0",
              value: "Please select",
              status: "",
              templateId: 0
            }]
            if (scoreTypes) {
              for (var j = 0; j < scoreTypes.length; j++) {
                if (data[i].ChecklistTemplateId == scoreTypes[j].ChecklistTemplateId) {
                  scoreTypesData.push({
                    id: scoreTypes[j].ScoreValue.toString(),
                    value: scoreTypes[j].ScoreValue.toString(),
                    status: scoreTypes[j].ScoreStatus.toString(),
                    templateId: scoreTypes[j].ChecklistTemplateId
                  })
                }
              }
            }

            var lFormOneArr = null
            var lFormTwoArr = null

            if (data[i].LogicFormulae && data[i].LogicFormulae.length > 0) {
              lFormOneArr = data[i].LogicFormulae.split('|')
              if (lFormOneArr && lFormOneArr.length > 1) {
                lFormTwoArr = lFormOneArr[1].split('_')
              }
            }

            // console.log('//////',data[i])

            checkPointList.push({
              AuditId: data[i].AuditId,
              LogicFormulae: data[i].LogicFormulae,
              ChecklistName: data[i].ChecklistName,
              ChecklistTemplateId: data[i].ChecklistTemplateId,
              CompLevelId: data[i].CompLevelId,
              ParentId: data[i].ParentId,
              ansType: (lFormTwoArr && lFormTwoArr.length > 2) ? lFormTwoArr[2] : '',
              correctAnswer: (lFormTwoArr && lFormTwoArr.length > 1) ? lFormTwoArr[1] : '',
              scoreType: data[i].ScoreType,
              minScore: data[i].MinScore.toString(),
              maxScore: data[i].Maxscore.toString(),
              scoreTypesData: scoreTypesData,
              AttachforNc: data[i].AttachforNc,
              RemarkforNc: data[i].RemarkforNc,
              Status: data[i].Status
            })
          }
        }
      }
      console.log('Radio values', checkPointList)
      // console.log('checkPoints', checkPoints)

      if (checkPoints) {
        console.log('checkPoints --->', checkPoints)
        if (checkPoints.length > 0) {
          for (var i = 0; i < checkPoints.length; i++) {
            for (var j = 0; j < checkPointList.length; j++) {
              if (checkPointList[j].ChecklistTemplateId == checkPoints[i].ChecklistTemplateId) {
                if (checkPointList[j].ansType == "M3") {
                  console.log('**ANSTYPE**', checkPointList[j].ansType)
                  if (checkPoints[i].RadioValue == 0) {
                    if (checkPointList[j].Status == 0 && checkPointList[j].correctAnswer == 9) {
                      console.log('**checkpoints details**', checkPoints[i])
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 10,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 1 && checkPointList[j].correctAnswer == 9) {
                      console.log('**checkpoints details**', checkPoints[i])
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 9,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 2) {
                      console.log('**checkpoints details**', checkPoints[i])
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 11,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == -1) {
                      console.log('**checkpoints details**', checkPoints[i])
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else {
                      console.log('**checkpoints details**', checkPoints[i])
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                  }
                  else {
                    console.log('**checkpoints details**', checkPoints[i])
                    checkPointsDetails.push({
                      AuditId: this.props.navigation.state.params.AuditID,
                      ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                      ParentId: checkPoints[i].ParentId,
                      Score: checkPoints[i].Score,
                      // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                      Remark: checkPoints[i].Remark,
                      RadioValue: checkPoints[i].RadioValue,
                      Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                      Approach: checkPoints[i].Approach,
                      ApproachId: checkPoints[i].ApproachId,
                      ParamMode: checkPoints[i].ParamMode,
                      IsNCAllowed: checkPoints[i].IsNCAllowed,
                      IsCorrect: checkPoints[i].IsCorrect,
                      Attachment: checkPoints[i].Attachment,
                      FileName: checkPoints[i].FileName,
                      File: checkPoints[i].File,
                      FileType: checkPoints[i].FileType,
                      isScoreValid: true,
                      scoreInvalidMsg: '',
                      RemarkforNc: checkPoints[i].RemarkforNc,
                      AttachforNc: checkPoints[i].AttachforNc,
                      Modified: checkPoints[i].Modified,
                      checklistName:checkPointList[j].ChecklistName
                    })
                  }
                }
                else if (checkPointList[j].ansType == "M2") {
                  console.log('**ANSTYPE**', checkPointList[j].ansType)
                  if (checkPoints[i].RadioValue == 0) {
                    if (checkPointList[j].Status == 0 && checkPointList[j].correctAnswer == 12) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 13,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 1 && checkPointList[j].correctAnswer == 12) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 12,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == -1) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 2) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 11,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                  }
                  else {
                    checkPointsDetails.push({
                      AuditId: this.props.navigation.state.params.AuditID,
                      ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                      ParentId: checkPoints[i].ParentId,
                      Score: checkPoints[i].Score,
                      // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                      Remark: checkPoints[i].Remark,
                      RadioValue: checkPoints[i].RadioValue,
                      Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                      Approach: checkPoints[i].Approach,
                      ApproachId: checkPoints[i].ApproachId,
                      ParamMode: checkPoints[i].ParamMode,
                      IsNCAllowed: checkPoints[i].IsNCAllowed,
                      IsCorrect: checkPoints[i].IsCorrect,
                      Attachment: checkPoints[i].Attachment,
                      FileName: checkPoints[i].FileName,
                      File: checkPoints[i].File,
                      FileType: checkPoints[i].FileType,
                      isScoreValid: true,
                      scoreInvalidMsg: '',
                      RemarkforNc: checkPoints[i].RemarkforNc,
                      AttachforNc: checkPoints[i].AttachforNc,
                      Modified: checkPoints[i].Modified,
                      checklistName:checkPointList[j].ChecklistName
                    })
                  }
                }
                else if (checkPointList[j].ansType == "M4") {
                  console.log('**ANSTYPE**', checkPointList[j].ansType)
                  if (checkPoints[i].RadioValue == 0) {
                    if (checkPointList[j].Status == 0 && checkPointList[j].correctAnswer == 14) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 15,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 1 && checkPointList[j].correctAnswer == 14) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 14,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 2) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 11,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == -1) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                  }
                  else {
                    checkPointsDetails.push({
                      AuditId: this.props.navigation.state.params.AuditID,
                      ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                      ParentId: checkPoints[i].ParentId,
                      Score: checkPoints[i].Score,
                      // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                      Remark: checkPoints[i].Remark,
                      RadioValue: checkPoints[i].RadioValue,
                      Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                      Approach: checkPoints[i].Approach,
                      ApproachId: checkPoints[i].ApproachId,
                      ParamMode: checkPoints[i].ParamMode,
                      IsNCAllowed: checkPoints[i].IsNCAllowed,
                      IsCorrect: checkPoints[i].IsCorrect,
                      Attachment: checkPoints[i].Attachment,
                      FileName: checkPoints[i].FileName,
                      File: checkPoints[i].File,
                      FileType: checkPoints[i].FileType,
                      isScoreValid: true,
                      scoreInvalidMsg: '',
                      RemarkforNc: checkPoints[i].RemarkforNc,
                      AttachforNc: checkPoints[i].AttachforNc,
                      Modified: checkPoints[i].Modified,
                      checklistName:checkPointList[j].ChecklistName
                    })
                  }
                }
                else if (checkPointList[j].ansType == "M1") {
                  console.log('**ANSTYPE**', checkPointList[j].ansType)
                  if (checkPoints[i].RadioValue == 0) {
                    if (checkPointList[j].Status == 0 && checkPointList[j].correctAnswer == 9) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 10,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 1 && checkPointList[j].correctAnswer == 9) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 9,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == -1) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 2) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 11,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                  }
                  else {
                    checkPointsDetails.push({
                      AuditId: this.props.navigation.state.params.AuditID,
                      ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                      ParentId: checkPoints[i].ParentId,
                      Score: checkPoints[i].Score,
                      // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                      Remark: checkPoints[i].Remark,
                      RadioValue: checkPoints[i].RadioValue,
                      Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                      Approach: checkPoints[i].Approach,
                      ApproachId: checkPoints[i].ApproachId,
                      ParamMode: checkPoints[i].ParamMode,
                      IsNCAllowed: checkPoints[i].IsNCAllowed,
                      IsCorrect: checkPoints[i].IsCorrect,
                      Attachment: checkPoints[i].Attachment,
                      FileName: checkPoints[i].FileName,
                      File: checkPoints[i].File,
                      FileType: checkPoints[i].FileType,
                      isScoreValid: true,
                      scoreInvalidMsg: '',
                      RemarkforNc: checkPoints[i].RemarkforNc,
                      AttachforNc: checkPoints[i].AttachforNc,
                      Modified: checkPoints[i].Modified,
                      checklistName:checkPointList[j].ChecklistName
                    })
                  }
                }
                else {
                  if (checkPoints[i].RadioValue == 0) {
                    if (checkPointList[j].Status == 0 && checkPointList[j].correctAnswer == 9) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 10,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 1 && checkPointList[j].correctAnswer == 9) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 9,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == -1) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else if (checkPointList[j].Status == 2) {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: 11,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                    else {
                      checkPointsDetails.push({
                        AuditId: this.props.navigation.state.params.AuditID,
                        ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                        ParentId: checkPoints[i].ParentId,
                        Score: checkPoints[i].Score,
                        // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                        Remark: checkPoints[i].Remark,
                        RadioValue: checkPoints[i].RadioValue,
                        Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                        Approach: checkPoints[i].Approach,
                        ApproachId: checkPoints[i].ApproachId,
                        ParamMode: checkPoints[i].ParamMode,
                        IsNCAllowed: checkPoints[i].IsNCAllowed,
                        IsCorrect: checkPoints[i].IsCorrect,
                        Attachment: checkPoints[i].Attachment,
                        FileName: checkPoints[i].FileName,
                        File: checkPoints[i].File,
                        FileType: checkPoints[i].FileType,
                        isScoreValid: true,
                        scoreInvalidMsg: '',
                        RemarkforNc: checkPoints[i].RemarkforNc,
                        AttachforNc: checkPoints[i].AttachforNc,
                        Modified: checkPoints[i].Modified,
                        checklistName:checkPointList[j].ChecklistName
                      })
                    }
                  }
                  else {
                    checkPointsDetails.push({
                      AuditId: this.props.navigation.state.params.AuditID,
                      ChecklistTemplateId: checkPoints[i].ChecklistTemplateId,
                      ParentId: checkPoints[i].ParentId,
                      Score: checkPoints[i].Score,
                      // Score: checkPointList[j].scoreType == 1? parseInt(checkPointList[j].minScore) :((checkPoints[i].Score < 0) ? -1 : checkPoints[i].Score),
                      Remark: checkPoints[i].Remark,
                      RadioValue: checkPoints[i].RadioValue,
                      Correction: (checkPoints[i].Correction == '') ? 0 : checkPoints[i].Correction,
                      Approach: checkPoints[i].Approach,
                      ApproachId: checkPoints[i].ApproachId,
                      ParamMode: checkPoints[i].ParamMode,
                      IsNCAllowed: checkPoints[i].IsNCAllowed,
                      IsCorrect: checkPoints[i].IsCorrect,
                      Attachment: checkPoints[i].Attachment,
                      FileName: checkPoints[i].FileName,
                      File: checkPoints[i].File,
                      FileType: checkPoints[i].FileType,
                      isScoreValid: true,
                      scoreInvalidMsg: '',
                      RemarkforNc: checkPoints[i].RemarkforNc,
                      AttachforNc: checkPoints[i].AttachforNc,
                      Modified: checkPoints[i].Modified,
                      checklistName:checkPointList[j].ChecklistName
                    })
                  }
                }
              }
            }
          }
        } else {
          for (var i = 0; i < checkPointList.length; i++) {
            checkPointsDetails.push({
              AuditId: this.props.navigation.state.params.AuditID,
              ChecklistTemplateId: checkPointList[i].ChecklistTemplateId,
              ParentId: checkPointList[i].ParentId,
              Score: '',
              Remark: '',
              RadioValue: 0,
              Correction: 0,
              Approach: '',
              ApproachId: 0,
              ParamMode: 0,
              IsNCAllowed: 0,
              IsCorrect: -1,
              Attachment: '',
              FileName: '',
              File: '',
              FileType: '',
              isScoreValid: true,
              scoreInvalidMsg: '',
              RemarkforNc: checkPointList[i].RemarkforNc,
              AttachforNc: checkPointList[i].AttachforNc,
              Modified: false,
              checklistName:checkPointList[j].ChecklistName
            })
          }
        }
      }
      else {
        for (var i = 0; i < checkPointList.length; i++) {
          checkPointsDetails.push({
            AuditId: this.props.navigation.state.params.AuditID,
            ChecklistTemplateId: checkPointList[i].ChecklistTemplateId,
            ParentId: checkPointList[i].ParentId,
            Score: '',
            Remark: '',
            RadioValue: 0,
            Correction: 0,
            Approach: '',
            ApproachId: 0,
            ParamMode: 0,
            IsNCAllowed: 0,
            IsCorrect: -1,
            Attachment: '',
            FileName: '',
            File: '',
            FileType: '',
            isScoreValid: true,
            scoreInvalidMsg: '',
            RemarkforNc: checkPointList[i].RemarkforNc,
            AttachforNc: checkPointList[i].AttachforNc,
            Modified: false,
            checklistName:checkPointList[j].ChecklistName
          })
        }
      }

      console.log('checkPointsDetails --->', checkPointsDetails)
      this.countStatistics(checkPointsDetails)

      this.setState({
        raiseID: this.props.navigation.state.params.Check,
        // dropProps: this.props.navigation.state.params.Drops,
        // RadioLogic: this.props.navigation.state.params.LogicPass,
        ischeckLPA: this.props.navigation.state.params.Check.AuditProgramId == -1 ? true : false,
        //ischeckLPA: true,
        LPAdrop: getLPA,
        checkPointsValues: checkPoints,
        auditId: this.props.navigation.state.params.AuditID,
        dropdown: dropdata,
        checkpointList: checkPointList,
        checkPointsDetails: checkPointsDetails,
        isContentLoaded: false
      }, () => {
        // console.log('this.state.checkPointsValues',this.state.checkPointsValues)
        // console.log('this.state.dropProps',this.state.dropProps)
        // console.log('this.state.raiseId',this.state.raiseID)
        // console.log('this.state.Radiologic',this.state.RadioLogic)
        // console.log('this.state.ischeckLPA',this.state.ischeckLPA)  
        // console.log('--drop-->',this.state.dropdown)  
        // console.log('checkpointList loaded',this.state.checkpointList)
        console.log('checkPointsDetails loaded', this.state.checkPointsDetails)
      })
      // }      
    })
  }

  componentWillReceiveProps(props) {

    var getCurrentPage = []
    getCurrentPage = this.props.data.nav.routes
    var CurrentPage = getCurrentPage[getCurrentPage.length - 1].routeName
    console.log('--CurrentPage--->', CurrentPage)

    if (CurrentPage == 'CheckPointScreen') {
      console.log('Checkpoints page focussed!')
      console.log('--CheckPointScreen-PROPS-->', props)
      console.log('--CheckPointScreen-this.PROPS-->', this.props)
      if (this.state.attachSelectedItem) {
        var cameraCapture = props.data.audits.cameraCapture
        var checkPointsDetails = this.state.checkPointsDetails
        var templateId = this.state.attachSelectedItem.ChecklistTemplateId

        if (cameraCapture.length > 0 && checkPointsDetails.length > 0) {
          for (var i = 0; i < checkPointsDetails.length; i++) {
            if (checkPointsDetails[i].ChecklistTemplateId == templateId) {
              checkPointsDetails[i].Attachment = cameraCapture[0].name
              checkPointsDetails[i].File = cameraCapture[0].uri
              // checkPointsDetails[i].FileName = cameraCapture[0].name.length > 30 ? cameraCapture[0].name.slice(0, 30) + '...' : cameraCapture[0].name
              checkPointsDetails[i].FileName = cameraCapture[0].name
              checkPointsDetails[i].FileType = cameraCapture[0].type
            }
          }
          this.setState({ checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
            console.log('Checkpoint page - checkPointsDetails', this.state.checkPointsDetails)
            this.countStatistics(this.state.checkPointsDetails)
          })
        }
      }
    }
    else {
      console.log('CheckPointScreen pass')
    }
  }

  radioValue = (value, i) => {
    //  console.log('value', value)
    //  console.log('pos', i)
    this.setState({ ...this.state.radiovalue, [i]: value }, () => {
      //  console.log('RadioValue',this.state.radiovalue)
    })
  }
  cancelResetDialog = () => {
    this.setState({ dialogVisibleReset: false })
  }
  clearCheckpoints = () => {
    this.setState({ isSaving: true, dialogVisibleReset: false }, () => {
      var checkPointsDetails = []
      for (var i = 0; i < this.state.checkpointList.length; i++) {
        checkPointsDetails.push({
          AuditId: this.state.auditId,
          ChecklistTemplateId: this.state.checkpointList[i].ChecklistTemplateId,
          ParentId: this.state.checkpointList[i].ParentId,
          Score: '',
          Remark: '',
          RadioValue: 0,
          Correction: 0,
          Approach: '',
          ApproachId: '',
          ParamMode: 0,
          IsNCAllowed: 0,
          IsCorrect: -1,
          Attachment: '',
          FileName: '',
          File: '',
          FileType: '',
          isScoreValid: true,
          scoreInvalidMsg: '',
          AttachforNc: this.state.checkpointList[i].AttachforNc,
          RemarkforNc: this.state.checkpointList[i].RemarkforNc,
          Modified: false

        })
      }
      this.setState({
        checkPointsDetails: checkPointsDetails
      }, () => {
        console.log('AFter reset', this.state.checkPointsDetails)
        setTimeout(() => {
          this.setState({ isSaving: false })
          this.countStatistics(this.state.checkPointsDetails)
        }, 200)
        this.refs.toast.show(strings.CheckpointClear, DURATION.LENGTH_SHORT)
      })
    })
  }

  countStatistics = (checkPointsDetails) => {
    // console.log('***',this.state.checkPointsDetails)
    // console.log('---',checkPointsDetails)
    var data = checkPointsDetails
    var pendingCheck = []
    var completed = []
    var mandatoryCheck = 0

    for (var i = 0; i < data.length; i++) {
      if (data[i].RemarkforNc === 1 && data[i].AttachforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1
        if (checkPointsDetails[i].Remark === "" && checkPointsDetails[i].Attachment === "") {
          pendingCheck.push(data[i])
        }
        else if (checkPointsDetails[i].Remark === "" || checkPointsDetails[i].Attachment === "") {
          pendingCheck.push(data[i])
        }
        else {
          completed.push(data[i])
        }
      }
      else if (data[i].RemarkforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1
        if (checkPointsDetails[i].Remark === "") {
          pendingCheck.push(data[i])
        }
        else {
          completed.push(data[i])
        }
      }
      else if (data[i].AttachforNc === 1) {
        mandatoryCheck = mandatoryCheck + 1
        if (checkPointsDetails[i].Attachment === "") {
          pendingCheck.push(data[i])
        }
        else {
          completed.push(data[i])
        }
      }
      else {
        completed.push(data[i])
      }
    }

    console.log('data length', data.length)
    console.log('completed arr-->', completed)
    console.log('pendingCheck', pendingCheck)
    console.log('mandatoryCheck', mandatoryCheck)
    console.log('Executed ---<>')

    this.setState({
      mandateCheckpoints: pendingCheck.length,
      totalfilled: completed.length,
      optionalCheck: data.length - mandatoryCheck,
      totalCheck: data.length,
      mandatoryCheck: mandatoryCheck
    }, () => {
      console.log('total checkpoints filled', this.state.totalfilled)
      console.log('total pending checkpoints', this.state.mandateCheckpoints)
      console.log('total manadatory checkpoints', this.state.mandatoryCheck)
    })
  }


  updateCheckPointsValues = () => {
    this.setState({
      isContentLoaded: true
    }, () => {

      InteractionManager.setDeadline(500);
      InteractionManager.runAfterInteractions(() => {

        var checkPointsDetails = this.state.checkPointsDetails
        this.setState({ checkMandate: true })
        var arr = []

        for (var i = 0; i < checkPointsDetails.length; i++) {
          if (checkPointsDetails[i].RemarkforNc === 1) {
            if (checkPointsDetails[i].Remark === "") {
              this.setState({ checkMandate: false }, () => { console.log('Please save remark manadatory fields.') })
            }
          }
          else if (checkPointsDetails[i].AttachforNc === 1) {
            if (checkPointsDetails[i].Attachment === "") {
              this.setState({ checkMandate: false }, () => { console.log('Please save attach manadatory fields.') })
            }
          }
        }

        // for(var i=0;i<checkPointsDetails.length;i++){
        //   if(checkPointsDetails[i].RemarkforNc === 0 && checkPointsDetails[i].AttachforNc === 0 ){
        //     this.setState({ checkMandate : true },()=>{console.log('save manadatory fields.')})
        //   }
        // }

        var isFormValid = true

        for (var i = 0; i < checkPointsDetails.length; i++) {
          if (!checkPointsDetails[i].isScoreValid) {
            isFormValid = false
          }
        }

        if (this.state.checkMandate === false) {
          this.setState({
            isContentLoaded: false
          }, () => {
            this.refs.toast.show(strings.mandate_message, DURATION.LENGTH_LONG)
          })

        }
        else if (!isFormValid) {
          this.setState({
            isContentLoaded: false
          }, () => {
            this.refs.toast.show(strings.InvalidScore, DURATION.LENGTH_LONG)
          })
        }

        else {
          this.setState({ isSaving: true }, () => {
            console.log('Save button clicked')

            // console.log('this.props.data.audits.auditRecords', this.props.data.audits.auditRecords)
            var auditRecordsOrg = this.props.data.audits.auditRecords
            var auditRecords = []
            var checkPointsDetails = this.state.checkPointsDetails
            var listData = []
            var isAuditFound = false
            console.log('checkPointsDetails', checkPointsDetails)



            for (var p = 0; p < auditRecordsOrg.length; p++) {
              var listDataArr = []
              if (auditRecordsOrg[p].Listdata) {
                if (auditRecordsOrg[p].Listdata.length > 0) {
                  for (q = 0; q < auditRecordsOrg[p].Listdata.length; q++) {
                    console.log('---->', auditRecordsOrg[p].Listdata[q])
                    listDataArr.push({
                      ParentId: auditRecordsOrg[p].Listdata[q].ParentId,
                      Attachment: auditRecordsOrg[p].Listdata[q].Attachment,
                      File: auditRecordsOrg[p].Listdata[q].File,
                      FileName: auditRecordsOrg[p].Listdata[q].FileName,
                      FileType: auditRecordsOrg[p].Listdata[q].FileType,
                      Remark: auditRecordsOrg[p].Listdata[q].Remark,
                      ParamMode: auditRecordsOrg[p].Listdata[q].ParamMode,
                      IsNCAllowed: auditRecordsOrg[p].Listdata[q].IsNCAllowed,
                      IsCorrect: auditRecordsOrg[p].Listdata[q].IsCorrect,
                      RadioValue: auditRecordsOrg[p].Listdata[q].RadioValue,
                      Correction: (auditRecordsOrg[p].Listdata[q].Correction == '') ? 0 : auditRecordsOrg[p].Listdata[q].Correction,
                      Approach: auditRecordsOrg[p].Listdata[q].Approach,
                      ApproachId: auditRecordsOrg[p].Listdata[q].ApproachId,
                      Score: auditRecordsOrg[p].Listdata[q].Score,
                      RemarkforNc: auditRecordsOrg[p].Listdata[q].RemarkforNc,
                      //getting extra 
                      AttachforComp: auditRecordsOrg[p].Listdata[q].AttachforComp,
                      AttachforNc: auditRecordsOrg[p].Listdata[q].AttachforNc,
                      Modified: auditRecordsOrg[p].Listdata[q].Modified,
                      AuditId: auditRecordsOrg[p].Listdata[q].AuditId,
                      ChecklistName: auditRecordsOrg[p].Listdata[q].ChecklistName,
                      ChecklistTemplateId: auditRecordsOrg[p].Listdata[q].ChecklistTemplateId,
                      CompLevelId: auditRecordsOrg[p].Listdata[q].CompLevelId,
                      LogicFormulae: auditRecordsOrg[p].Listdata[q].LogicFormulae,
                      Maxscore: auditRecordsOrg[p].Listdata[q].Maxscore,
                      MinScore: auditRecordsOrg[p].Listdata[q].MinScore,
                      NeedScore: auditRecordsOrg[p].Listdata[q].NeedScore,
                      ScoreType: auditRecordsOrg[p].Listdata[q].ScoreType,
                      isScoreValid: auditRecordsOrg[p].Listdata[q].isScoreValid,
                      scoreInvalidMsg: auditRecordsOrg[p].Listdata[q].scoreInvalidMsg

                    })
                  }
                }
              }


              var AuditRecordStatus = auditRecordsOrg[p].AuditRecordStatus
              console.log('auditRecordsOrg[p]', auditRecordsOrg[p])
              console.log('this.state.AuditId', this.state.auditId)


              if (auditRecordsOrg[p].AuditId == this.state.auditId) {
                AuditRecordStatus = constant.StatusNotSynced
              }


              console.log('listDataArr-->', listDataArr)
              console.log('checkPointsDetails-->', checkPointsDetails)
              console.log('AuditRecordStatus-->', AuditRecordStatus)



              for (var i = 0; i < listDataArr.length; i++) {
                for (var j = 0; j < checkPointsDetails.length; j++) {
                  if (
                    (listDataArr[i].ChecklistTemplateId == checkPointsDetails[j].ChecklistTemplateId)
                    &&
                    (listDataArr[i].ParentId == checkPointsDetails[j].ParentId)
                  ) {
                    listDataArr[i] = {
                      ParentId: checkPointsDetails[j].ParentId,
                      Attachment: checkPointsDetails[j].Attachment,
                      File: checkPointsDetails[j].File,
                      FileName: checkPointsDetails[j].FileName,
                      FileType: checkPointsDetails[j].FileType,
                      Remark: checkPointsDetails[j].Remark,
                      ParamMode: checkPointsDetails[j].ParamMode,
                      IsNCAllowed: checkPointsDetails[j].IsNCAllowed,
                      IsCorrect: checkPointsDetails[j].IsCorrect,
                      RadioValue: checkPointsDetails[j].RadioValue,
                      Correction: (checkPointsDetails[j].Correction == '') ? 0 : checkPointsDetails[j].Correction,
                      Approach: listDataArr[i].Approach,
                      ApproachId: checkPointsDetails[j].ApproachId,
                      Score: checkPointsDetails[j].Score,
                      RemarkforNc: checkPointsDetails[j].RemarkforNc,
                      //getting extra 
                      AttachforComp: listDataArr[i].AttachforComp,
                      AttachforNc: checkPointsDetails[j].AttachforNc,
                      Modified: checkPointsDetails[j].Modified,
                      AuditId: checkPointsDetails[j].AuditId,
                      ChecklistName: listDataArr[i].ChecklistName,
                      ChecklistTemplateId: checkPointsDetails[j].ChecklistTemplateId,
                      CompLevelId: listDataArr[i].CompLevelId,
                      LogicFormulae: listDataArr[i].LogicFormulae,
                      Maxscore: listDataArr[i].Maxscore,
                      MinScore: listDataArr[i].MinScore,
                      NeedScore: listDataArr[i].NeedScore,
                      ScoreType: listDataArr[i].ScoreType,
                      isScoreValid: checkPointsDetails[j].isScoreValid,
                      scoreInvalidMsg: checkPointsDetails[j].scoreInvalidMsg
                    }
                  }
                }
              }

              console.log('ModifiedData', listDataArr)
              auditRecords.push({
                AuditTypeOrder: auditRecordsOrg[p].AuditTypeOrder,
                FormId: auditRecordsOrg[p].FormId,
                AuditId: auditRecordsOrg[p].AuditId,
                AuditOrderId: auditRecordsOrg[p].AuditOrderId,
                AuditProgramId: auditRecordsOrg[p].AuditProgramId,
                AuditTypeId: auditRecordsOrg[p].AuditTypeId,
                SiteId: auditRecordsOrg[p].SiteId,
                Status: auditRecordsOrg[p].Status,
                AssignedTaskRoutes: auditRecordsOrg[p].AssignedTaskRoutes,
                AssociatesName: auditRecordsOrg[p].AssociatesName,
                AuditConductedByName: auditRecordsOrg[p].AuditConductedByName,
                AuditCycleCode: auditRecordsOrg[p].AuditCycleCode,
                AuditCycleName: auditRecordsOrg[p].AuditCycleName,
                AuditNumber: auditRecordsOrg[p].AuditNumber,
                AuditProgOrder: auditRecordsOrg[p].AuditProgOrder,
                AuditProgramName: auditRecordsOrg[p].AuditProgramName,
                AuditTemplateId: auditRecordsOrg[p].AuditTemplateId,
                AuditTemplateName: auditRecordsOrg[p].AuditTemplateName,
                AuditTypeName: auditRecordsOrg[p].AuditTypeName,
                Auditee: auditRecordsOrg[p].Auditee,
                AuditeeContactPersonName: auditRecordsOrg[p].AuditeeContactPersonName,
                AuditorName: auditRecordsOrg[p].AuditorName,
                CycleShortName: auditRecordsOrg[p].CycleShortName,
                EndDate: auditRecordsOrg[p].EndDate,
                Formname: auditRecordsOrg[p].Formname,
                Formtype: auditRecordsOrg[p].Formtype,
                LeadAuditor: auditRecordsOrg[p].LeadAuditor,
                ProcessCategorysName: auditRecordsOrg[p].ProcessCategorysName,
                ProcessGroupsName: auditRecordsOrg[p].ProcessGroupsName,
                ProcessScopeName: auditRecordsOrg[p].ProcessScopeName,
                SchedulerName: auditRecordsOrg[p].SchedulerName,
                StartDate: auditRecordsOrg[p].StartDate,
                Listdata: listDataArr,
                Formdata: auditRecordsOrg[p].Formdata,
                CheckListPropData: auditRecordsOrg[p].CheckListPropData,
                CheckpointLogic: auditRecordsOrg[p].CheckpointLogic,
                DropDownProps: auditRecordsOrg[p].DropDownProps,
                NCdetailsprops: auditRecordsOrg[p].NCdetailsprops,
                UserId: auditRecordsOrg[p].UserId,
                FromDocPro: auditRecordsOrg[p].FromDocPro,
                DocumentId: auditRecordsOrg[p].DocumentId,
                DocRevNo: auditRecordsOrg[p].DocRevNo,
                AuditRecordStatus: AuditRecordStatus,
                AuditResults: auditRecordsOrg[p].AuditResults,
                AuditProcessList: auditRecordsOrg[p].AuditProcessList,
                PerformStarted: auditRecordsOrg[p].PerformStarted,
              })
            }


            /*for(var i=0; i<auditRecords.length; i++) {     
             //  console.log('count,',i)   
              for(var j=0; j<checkPointsDetails.length; j++) {
                if(parseInt(auditRecords[i].AuditId) == checkPointsDetails[j].AuditId) {
                 //  console.log(auditRecords[i].AuditId, checkPointsDetails[j].AuditId)
                  isAuditFound = true
                  listData.push({
                    ChecklistTemplateId: checkPointsDetails[j].ChecklistTemplateId,
                    ParentId: checkPointsDetails[j].ParentId,
                    Score: checkPointsDetails[j].Score,
                    Remark: checkPointsDetails[j].Remark,
                    ParamMode: checkPointsDetails[j].ParamMode,
                    IsNCAllowed: checkPointsDetails[j].IsNCAllowed,
                    IsCorrect:checkPointsDetails[j].IsCorrect,
                    RadioValue: checkPointsDetails[j].RadioValue,
                    Correction: (checkPointsDetails[j].Correction == '') ? 0 : checkPointsDetails[j].Correction,
                    Approach: checkPointsDetails[j].Approach,
                    ApproachId: checkPointsDetails[j].ApproachId,
                    Attachment: checkPointsDetails[j].Attachment,
                    FileName: checkPointsDetails[j].FileName,
                    FileType: checkPointsDetails[j].FileType,
                    File: checkPointsDetails[j].File,
                    RemarkforNc: checkPointsDetails[j].RemarkforNc,
                    AttachforNc: checkPointsDetails[j].AttachforNc,
                    Modified:checkPointsDetails[j].Modified,
                  })            
                }
              }
             
            }*/

             console.log('auditRecords',auditRecords)
            // Store audit list in redux store to set it in persistant storage 

            this.props.storeAuditRecords(auditRecords)


            // Audit process started, So we are marking isAuditing flag as true
            this.props.changeAuditState(true)

            // Update audit status in the audit list
            var auditListOrg = this.props.data.audits.audits
            var auditList = []

            for (var i = 0; i < auditListOrg.length; i++) {
              var auditStatus = auditListOrg[i].cStatus
              var auditColor = auditListOrg[i].color

              if (parseInt(auditListOrg[i].ActualAuditId) == parseInt(this.state.auditId)) {
                if (auditListOrg[i].AuditStatus != 3) {
                  auditStatus = constant.StatusNotSynced
                }
              }

              // Set Audit Card color by checking its Status
              switch (auditStatus) {
                case constant.StatusScheduled:
                  auditColor = '#F1EB0E'
                  break
                case constant.StatusDownloaded:
                  auditColor = '#cd8cff'
                  break
                case constant.StatusNotSynced:
                  auditColor = '#2ec3c7'
                  break
                case constant.StatusProcessing:
                  auditColor = '#e88316'
                  break
                case constant.StatusSynced:
                  auditColor = '#48bcf7'
                  break
                case constant.StatusCompleted:
                  auditColor = 'green'
                  break
                case constant.StatusDV:
                  auditColor = 'red'
                  break
                case constant.StatusDVC:
                  auditColor = 'green'
                  break
                default:
                  auditColor = '#2db816'
                  break
              }

              auditList.push({
                ActualAudit: auditListOrg[i].ActualAudit,
                ActualAuditId: auditListOrg[i].ActualAuditId,
                ActualAuditOrderNo: auditListOrg[i].ActualAuditOrderNo,
                AssociatesName: auditListOrg[i].AssociatesName,
                AuditConductedByName: auditListOrg[i].AuditConductedByName,
                AuditCycleName: auditListOrg[i].AuditCycleName,
                AuditNumber: auditListOrg[i].AuditNumber,
                AuditPeriodId: auditListOrg[i].AuditPeriodId,
                AuditProgramId: auditListOrg[i].AuditProgramId,
                AuditProgramName: auditListOrg[i].AuditProgramName,
                AuditStatus: auditListOrg[i].AuditStatus,
                AuditTemplateId: auditListOrg[i].AuditTemplateId,
                AuditTypeId: auditListOrg[i].AuditTypeId,
                AuditTypeName: auditListOrg[i].AuditTypeName,
                Auditee: auditListOrg[i].Auditee,
                EndDate: auditListOrg[i].EndDate,
                EntityId: auditListOrg[i].EntityId,
                LeadAuditor: auditListOrg[i].LeadAuditor,
                ProcessScopeName: auditListOrg[i].ProcessScopeName,
                SchedulerName: auditListOrg[i].SchedulerName,
                SiteId: auditListOrg[i].SiteId,
                StartDate: auditListOrg[i].StartDate,
                cStatus: auditStatus,
                color: auditColor,
                key: auditListOrg[i].key
              })
            }

            this.props.storeAudits(auditList)

            var cameraCapture = []
            this.props.storeCameraCapture(cameraCapture)

            setTimeout(() => {
              //  console.log('AuditDashBody Props After Props Changing...', this.props) 
              var auditRecords = this.props.data.audits.auditRecords
              var checkPoints = null
              for (var i = 0; i < auditRecords.length; i++) {
                if (auditRecords[i].AuditId == this.props.navigation.state.params.AuditID) {
                  if (auditRecords[i].Listdata)
                    checkPoints = auditRecords[i].Listdata
                }
              }
              this.setState({
                checkPointsValues: checkPoints,
                isSaving: false,
                isUnsavedData: false,
                isContentLoaded: false
              }, () => {
                this.refs.toast.show(strings.CheckpointSave, DURATION.LENGTH_LONG)
                if(this.state.go_home){
                  this.props.navigation.navigate("AuditDashboard")
                }
                else{
                  this.props.navigation.goBack()
                }
              })
            }, 200)
            this.setState({ isSaving: false }, () => {
              console.log('Loader off')
            })
          })
        }

      })
    })
  }

  popupModal(checkPointDetail) {
    this.setState({
      dialogVisibleNC: true,
      isNCAllowed: checkPointDetail.IsNCAllowed,
      ncofiPassAuditId: checkPointDetail.AuditId,
      ncofiPassTemplateId: checkPointDetail.ChecklistTemplateId
    }, () => {
      // console.log('NC/OFI pressed',this.state.dialogVisibleNC)
      // console.log('IsNCAllowed',this.state.isNCAllowed)
    })
  }

  navigateTo(id) {
    // console.log('navigation route',id)
    console.log('ncofiRecords ---->', this.props.data.audits.ncofiRecords)
    var NCrecords = this.props.data.audits.ncofiRecords
    var pendingList = null
    var uploadedList = null
    var isNCOFIExists = false
    var isUploaded = false
    var data = null

    for (var i = 0; i < NCrecords.length; i++) {
      if (NCrecords[i].AuditID == this.state.auditId) {
        pendingList = NCrecords[i].Pending
        uploadedList = NCrecords[i].Uploaded
      }
    }

    if (pendingList) {
      for (var i = 0; i < pendingList.length; i++) {
        if (pendingList[i].AuditID == this.state.ncofiPassAuditId &&
          pendingList[i].ChecklistTemplateId == this.state.ncofiPassTemplateId && pendingList[i].Category == id) {
            isNCOFIExists = true
            isUploaded = false
            data = pendingList[i]
        }
      }
    }

    if(data == null && uploadedList) {
      var checkNC = 0
      var maxOrder = 0
      var recordIndex = 0

      if(id === 'OFI') {
        checkNC = 1
      }

      for(var i=0; i<uploadedList.length; i++) {
        if(uploadedList[i].ChecklistTemplateId == this.state.ncofiPassTemplateId && 
          uploadedList[i].CheckNC == checkNC) {
            isNCOFIExists = true
            isUploaded = true
            if(maxOrder < uploadedList[i].CorrectiveOrder) {
              maxOrder = uploadedList[i].CorrectiveOrder
              recordIndex = i
            }
            else if(maxOrder == 0 && recordIndex == 0 && i > 0) {
              maxOrder = uploadedList[i].CorrectiveOrder
              recordIndex = i
            }
        }        
      }

      if(isNCOFIExists) { 
        var uploadedData = uploadedList[recordIndex]
        var selectedItems = (uploadedData.ElementId) ? uploadedData.ElementId.split(',') : []
        var selectedItemsProcess = (uploadedData.ProcesssId) ? uploadedData.ProcesssId.split(',') : []
        var changetoInt = selectedItemsProcess
        var IntArr = []
        for(var i=0;i<changetoInt.length;i++){
          IntArr.push(parseInt(changetoInt[i]))
        }
        var selectedProcess = (uploadedData.ProcesssId) ? IntArr : []
        var auditRecords = this.props.data.audits.auditRecords
        var categoryObj = null
        var requestObj = null
        var userObj = null
        var departmentObj = null
        var requirementStr = ''
        
        for(var i=0; i<auditRecords.length; i++){
          if(this.state.ncofiPassAuditId === auditRecords[i].AuditId){
            var dropdowns = auditRecords[i].DropDownProps
            // Requirements
            for(var j=0; j<dropdowns.ClauseList.length; j++){
              for(var k=0; k<selectedItems.length; k++){
                if(selectedItems[k] === dropdowns.ClauseList[j].id){
                  requirementStr = requirementStr + dropdowns.ClauseList[j].Requirement
                }
              }              
            }
            // Category
            if(uploadedData.CategoryId) {
              for(var j=0; j<dropdowns.Category.length; j++){
                if(uploadedData.CategoryId == dropdowns.Category[j].CategoryId){
                  categoryObj = {
                    id: dropdowns.Category[j].CategoryId,
                    value: dropdowns.Category[j].CategoryName
                  }
                  break
                }
              }
            }
            // User - Responsibility
            if(uploadedData.RequestedByID) {
              for(var j=0; j<dropdowns.Users.length; j++){
                if(uploadedData.RequestedByID == dropdowns.Users[j].userid){
                  userObj = {
                    id: dropdowns.Users[j].userid,
                    value: dropdowns.Users[j].Name
                  }
                  break
                }
              }
            }
            // Requested by
            if(uploadedData.ResponsibilityId) {
              for(var j=0; j<dropdowns.RequestBy.length; j++){
                if(uploadedData.ResponsibilityId == dropdowns.RequestBy[j].AuditeeContactPersonId){
                  requestObj = {
                    id: dropdowns.RequestBy[j].AuditeeContactPersonId,
                    value: dropdowns.RequestBy[j].AuditeeContactPersonName
                  }
                  break
                }
              }
            }
            // Department
            if(uploadedData.DepartmentId) {
              for(var j=0; j<dropdowns.Department.length; j++){
                if(uploadedData.DepartmentId == dropdowns.Department[j].DepartmentId){
                  departmentObj = {
                    id: dropdowns.Department[j].DepartmentId,
                    value: dropdowns.Department[j].DepartmentName
                  }
                  break
                }
              }
            }
          }
        }

        data = {
          requiretext: requirementStr,
          OFI: (checkNC == 1) ? uploadedData.NonConfirmity : '',
          categoryDrop: categoryObj,
          userDrop: userObj,
          requestDrop: requestObj,
          deptDrop: departmentObj,
          filename: uploadedData.FileName,
          filedata: '',
          AuditID: this.state.ncofiPassAuditId,
          AuditOrder: this.state.raiseID.AuditOrder,
          ChecklistID: this.state.raiseID.ChecklistID,
          Formid: this.state.raiseID.Formid,
          SiteID: this.state.raiseID.SiteID,
          auditstatus: this.state.raiseID.auditstatus,
          title: this.state.raiseID.title,
          NCNumber: this.state.raiseID.AUDIT_NO,
          Category: id,
          NonConfirmity: uploadedData.NonConfirmity,
          uniqueNCkey: Moment().unix(),
          selectedItems: selectedItems,
          selectedItemsProcess: selectedProcess,
          ChecklistTemplateId: uploadedData.ChecklistTemplateId,
          ncIdentifier: uploadedData.NCIdentifier,
          objEvidence: uploadedData.ObjectiveEvidence,
          recommAction: uploadedData.RecommendedAction
        }
      }
    }

    if(isNCOFIExists) {
      if(id === 'NC'){
        this.setState({ dialogVisibleNC: false })
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'NC',
          AuditID: this.state.auditId,
          NCOFIDetails: this.state.raiseID,
          templateId: this.state.ncofiPassTemplateId,
          type: 'EDIT',
          data: data,
          isUploaded: isUploaded
        })
      }
      if (id === 'OFI') {
        this.setState({ dialogVisibleNC: false })
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'OFI',
          AuditID: this.state.auditId,
          NCOFIDetails: this.state.raiseID,
          templateId: this.state.ncofiPassTemplateId,
          type: 'EDIT',
          data: data,
          isUploaded: isUploaded
        })
      }
    }
    else {
      if (id === 'NC') {
        this.setState({ dialogVisibleNC: false })
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'NC',
          NCOFIDetails: this.state.raiseID,
          AuditID: this.state.auditId,
          templateId: this.state.ncofiPassTemplateId,
          type: 'ADD',
          data: null,
          isUploaded: isUploaded
        })
      }
      if (id === 'OFI') {
        this.setState({ dialogVisibleNC: false })
        this.props.navigation.navigate('CreateNC', {
          CheckpointRoute: 'OFI',
          NCOFIDetails: this.state.raiseID,
          AuditID: this.state.auditId,
          templateId: this.state.ncofiPassTemplateId,
          type: 'ADD',
          data: null,
          isUploaded: isUploaded
        })
      }
    }
  }

  removeAttachment = (loc) => {
    var checkPointsDetails = this.state.checkPointsDetails
    for (var j = 0; j < checkPointsDetails.length; j++) {
      if (j == loc) {
        checkPointsDetails[j].Attachment = ''
        checkPointsDetails[j].File = ''
        checkPointsDetails[j].FileName = ''
        checkPointsDetails[j].FileType = ''
        checkPointsDetails[j].Modified = false
      }
    }
    this.setState({ CheckAttach: false, checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
      this.countStatistics(this.state.checkPointsDetails)
      // console.log('checkPointsDetails', this.state.checkPointsDetails)
    })
  }

  chooseCameraOption = (items) => {
    this.setState({
      dialogVisibleCamera: true,
      attachSelectedItem: items
    })
  }

  attachFiles = () => {
    var items = this.state.attachSelectedItem
    // iPhone/Android
    if (Platform.OS == 'android') {
      DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }, (error, res) => {
        console.log('File upload error:', error)
        console.log('Document response:', res)
        if (res != null) {
          if (res.fileSize > 52428800) {
            alert(strings.alert)
          }
          else if (res.fileSize < 52428800) {

            var checkPointsDetails = this.state.checkPointsDetails
                for (var i = 0; i < checkPointsDetails.length; i++) {
                  if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                    checkPointsDetails[i].Attachment = res.fileName
                    checkPointsDetails[i].File = res.uri
                    // checkPointsDetails[i].FileName = res.fileName.length > 30 ? res.fileName.slice(0, 30) + '...' : res.fileName
                    checkPointsDetails[i].FileName = res.fileName
                    checkPointsDetails[i].FileType = res.type
                  }
                }
                this.setState({ CheckAttach: true, checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
                  // console.log('checkPointsDetails', this.state.checkPointsDetails)
                  this.countStatistics(this.state.checkPointsDetails)
                })
            /**
            RNFetchBlob.fs.readFile(res.uri, 'base64')
              .then((data) => {
                // handle the data ..
                res.data = data
                // Android
                // console.log(
                //   res.uri,
                //   res.type, // mime type
                //   res.fileName,
                //   res.fileSize,
                //   res.data
                // );
                // console.log('items', items)
                
              }) */
          }
        }
        else {
          console.log('Nothing happened')
        }
      });
    }
    else {
      console.log('ios detected')
      // console.log('DocumentPicker', DocumentPicker)
      // Pick a single file
      DocumentPicker.pick({
        filetype: ['public.content'],
        top: 100,
        left: 100,
      }, (error, res) => {
        console.log('File upload error:', error)
        console.log('Document response:', res)
        if (res != null) {
          if (res.fileSize > 52428800) {
            alert(strings.alert)
          }
          else if (res.fileSize < 52428800) {
            console.log('Reading file from', res.uri)
            var getURI = res.uri
            var uridata = getURI.slice(7)
            console.log('uridata', uridata)

            console.log('items', items)
                var checkPointsDetails = this.state.checkPointsDetails
                for (var i = 0; i < checkPointsDetails.length; i++) {
                  if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                    checkPointsDetails[i].Attachment = res.fileName
                    // this may be the issue in iOS . Please check and confirm
                    checkPointsDetails[i].File = uridata
                    // checkPointsDetails[i].FileName = res.fileName.length > 30 ? res.fileName.slice(0, 30) + '...' : res.fileName
                    checkPointsDetails[i].FileName = res.fileName
                    checkPointsDetails[i].FileType = res.type == undefined ? '' : checkPointsDetails[i].FileType
                  }
                }
                this.setState({ CheckAttach: true, checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
                  // console.log('checkPointsDetails', this.state.checkPointsDetails)
                  this.countStatistics(this.state.checkPointsDetails)
                })


            /**
              RNFetchBlob.fs.readFile(uridata, 'base64')
              .then((data) => {
                // handle the data ..
                res.data = data
                // Android
                console.log(
                  res.uri,
                  res.type, // mime type
                  res.fileName,
                  res.fileSize,
                  res.data
                );
              })
              */

          }
        }
        else {
          console.log('Nothing happened')
        }
      });
    }

    // iPad
    /*const {pageX, pageY} = event.nativeEvent;
    DocumentPicker.show({
    top: pageY,
    left: pageX,
    filetype: ['public.image'],
    }, (error, url) => {
      alert(url);
    });*/
  }

  isFailedCheckpoint = (items) => {
    var checkPointsDetails = this.state.checkPointsDetails
    for (var i = 0; i < checkPointsDetails.length; i++) {
      if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId
        && checkPointsDetails[i].RadioValue == 10) {
        return true
      }
    }
    return false
  }

  cameraAction = (type) => {
    this.setState({
      dialogVisibleCamera: false
    }, () => {
      if (type == 'Camera') {
        this.props.navigation.navigate('CameraCapture')
      }
      else {
        // this.setState({
        //   dialogVisibleCamera : false
        // },()=>{
        console.log('Closing pop up first')
        setTimeout(() => {
          this.attachFiles()
        }, 500)
        // }) 
      }
    })
  }

  goHome = () => {
    if (this.state.isUnsavedData == true) {
      this.setState({
        dialogVisible: true,
        dialogVisibleNC: false,
        go_home:true
      })
    }
    else {
    this.props.navigation.navigate("AuditDashboard")
    }
  }

  goBackToChecklist = () => {
    if (this.state.isUnsavedData == true) {
      this.setState({
        dialogVisible: true,
        dialogVisibleNC: false
      })
    }
    else {
      this.props.navigation.goBack()
    }
  }

  clearNcCheckpoint = () => {
    this.setState({ dialogVisibleNCR: false }, () => {
      var dupNCrecords = []
      var NCrecords = this.props.data.audits.ncofiRecords
      for (var i = 0; i < NCrecords.length; i++) {
        if (this.state.auditId === NCrecords[i].AuditID) {
          var pendingList = []
          for (var j = 0; j < NCrecords[i].Pending.length; j++) {
            if (NCrecords[i].Pending[j].ChecklistTemplateId != this.state.ncRemovalTemplateId) {
              pendingList.push(NCrecords[i].Pending[j])
            }
          }
          dupNCrecords.push({
            AuditID: NCrecords[i].AuditID,
            Uploaded: NCrecords[i].Uploaded,
            Pending: pendingList
          })
        }
        else {
          dupNCrecords.push({
            AuditID: NCrecords[i].AuditID,
            Uploaded: NCrecords[i].Uploaded,
            Pending: NCrecords[i].Pending
          })
        }
      }
      this.props.storeNCRecords(dupNCrecords)
      this.refs.toast.show(strings.NCremoved, DURATION.LENGTH_LONG)
    })
  }

  forceGoBackToChecklist = () => {
    this.setState({
      dialogVisible: false,
      dialogVisibleNC: false
    }, () => {
      this.props.navigation.goBack()
    })
  }

  openAttachmentImage = (item) => {
    this.setState({
      dialogVisibleAttach: true,
      cAttachData: item.File,
      cAttachType: item.FileType
    }, () => {
      console.log('cAttachData' + this.state.cAttachData)
      console.log('cAttachType' + this.state.cAttachType)
    })
  }
  markStatus = (items) => {
    var checkPointsDetails = this.state.checkPointsDetails
    console.log('markStatus', items)
    console.log('checkPointsDetails', checkPointsDetails)
    for (var i = 0; i < checkPointsDetails.length; i++) {
      if (items.ChecklistTemplateId == checkPointsDetails[i].ChecklistTemplateId) {
        console.log('hello')
        if (parseInt(items.correctAnswer) == checkPointsDetails[i].RadioValue) {
          console.log('correct answer')
        }
        else {
          console.log('wrong  answer')
        }
      }
    }
  }


  render() {

    console.log('this.state.checkpointList', this.state.checkpointList)
    console.log('Score', this.state.checkPointsDetails)


    const dropdata = this.state.dropdown
    const radio_props1 = [
      { label: strings.yes, value: 9 },
      { label: strings.no, value: 10 },
    ];
    const radio_props2 = [
      { label: strings.true, value: 12 },
      { label: strings.false, value: 13 },
    ];
    const radio_props3 = [
      { label: strings.yes, value: 9 },
      { label: strings.no, value: 10 },
      { label: strings.NA, value: 11 },
    ];
    const radio_props4 = [
      { label: strings.ok, value: 14 },
      { label: strings.Notok, value: 15 },
      { label: strings.NA, value: 11 },
    ];

    return (
      <View style={styles.wrapper}>
        <OfflineNotice />

        <ImageBackground
          source={Images.DashboardBG}
          style={{
            resizeMode: 'stretch',
            width: '100%',
            height: 65
          }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.goBackToChecklist.bind(this)}>
              <View style={styles.backlogo}>
                {(!this.state.isSaving) ?
                  // <ResponsiveImage source={Images.BackIconWhite} initWidth="13" initHeight="22" /> 
                  <Icon name="angle-left" size={40} color="white" />
                  : null
                }
              </View>
            </TouchableOpacity>

            <View style={styles.heading}>
              <Text numberOfLines={1} style={styles.headingText}>{this.state.displayData}</Text>
              <Text numberOfLines={1} style={{ fontSize: 15, color: 'white'}}>{this.state.breadCrumbText}</Text>
            </View>

            <View style={styles.headerDiv}>
              {/* <ImageBackground source={Images.headerBG} style={styles.backgroundImage}></ImageBackground> */}
              <TouchableOpacity style={{paddingRight:10}} onPress={()=>this.goHome()}>
                  <Icon name="home" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {(this.state.isContentLoaded === false && !this.state.isSaving) ?
          <View style={styles.auditCheckPointsBody}>

            <View style={styles.statistics}>
              <View style={styles.statCard1}>
                <Text style={{ fontSize: 14}}>{strings.Total_checkpoints}</Text>
                <Text style={{ fontSize: Fonts.size.h5}}>{this.state.totalCheck}</Text>
              </View>

              <View style={styles.statCard3}>
                <Text style={{ fontSize: 14 }}>{strings.Mandatory}</Text>
                <Text style={{ fontSize: Fonts.size.h5}}>{this.state.mandatoryCheck}</Text>
              </View>

              <View style={styles.statCard2}>
                <Text style={{ fontSize: 14}}>{strings.Optional}</Text>
                <Text style={{ fontSize: Fonts.size.h5 }}>{this.state.optionalCheck}</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {(this.state.checkpointList.length > 0) ?
                <View style={styles.checkpointCard}>

                  {this.state.checkpointList.map((items, i) =>
                    <View key={i + 1} style={styles.CheckPointBox}>
                      <View style={styles.commentBox}>

                        <View style={styles.quesBox}>
                          <View style={{ flexDirection: 'column', width: '100%' }}>
                            <Text style={styles.quesText}>{items.ChecklistName}</Text>
                            {(this.state.checkPointsDetails[i].IsCorrect === 1 && this.state.checkPointsDetails[i].RadioValue != 11) ?
                              <Icon name='check' size={20} color='green' /> :
                              (this.state.checkPointsDetails[i].IsCorrect === 0 && this.state.checkPointsDetails[i].RadioValue != 11) ?
                                <Icon name='times' size={20} color='red' /> : null
                            }
                          </View>
                          <View>
                            {
                              (this.state.checkPointsDetails[i].Attachment == '' && this.state.checkPointsDetails[i].AttachforNc === 1 && this.state.checkPointsDetails[i].RemarkforNc === 0) ||
                                (this.state.checkPointsDetails[i].Remark == '' && this.state.checkPointsDetails[i].RemarkforNc === 1 && this.state.checkPointsDetails[i].AttachforNc === 0) ||
                                (this.state.checkPointsDetails[i].Attachment == '' && this.state.checkPointsDetails[i].Remark == '' &&
                                  this.state.checkPointsDetails[i].AttachforNc === 1 && this.state.checkPointsDetails[i].RemarkforNc === 1) ?
                                <View style={{ marginLeft: 20, bottom: 10 }}>
                                  <ResponsiveImage source={Images.ManIcon1} initHeight={30} initWidth={30} />
                                </View>
                                :
                                (this.state.checkPointsDetails[i].AttachforNc === 1 && this.state.checkPointsDetails[i].RemarkforNc === 0) ||
                                  (this.state.checkPointsDetails[i].RemarkforNc === 1 && this.state.checkPointsDetails[i].AttachforNc === 0) ||
                                  (this.state.checkPointsDetails[i].AttachforNc === 1 && this.state.checkPointsDetails[i].RemarkforNc === 1) ?
                                  <View style={{ marginLeft: 20, bottom: 10 }}>
                                    <ResponsiveImage source={Images.ManIcon3} initHeight={30} initWidth={30} />
                                  </View>
                                  : null
                            }
                          </View>
                        </View>

                        {/* {(this.state.checkPointsDetails[i]) ?
                          (parseInt(this.state.checkPointsDetails[i].ChecklistTemplateId) > 598 &&
                            parseInt(this.state.checkPointsDetails[i].ChecklistTemplateId) < 603) ?
                            <View style={styles.boxsecImageDisplay}>
                              {
                                parseInt(this.state.checkPointsDetails[i].ChecklistTemplateId) == 599 ?
                                  <Image source={Images.Hardcode599} style={{ width: width(85), height: 200, resizeMode: 'cover' }} /> :
                                  parseInt(this.state.checkPointsDetails[i].ChecklistTemplateId) == 600 ?
                                    <Image source={Images.Hardcode600} style={{ width: width(85), height: 200, resizeMode: 'cover' }} /> :
                                    parseInt(this.state.checkPointsDetails[i].ChecklistTemplateId) == 601 ?
                                      <Image source={Images.Hardcode601} style={{ width: width(85), height: 200, resizeMode: 'cover' }} /> :
                                      parseInt(this.state.checkPointsDetails[i].ChecklistTemplateId) == 602 ?
                                        <Image source={Images.Hardcode602} style={{ width: width(85), height: 200, resizeMode: 'cover' }} /> : null
                              }
                            </View> : null : null
                        } */}

                        {items.ansType === 'M1' ?
                          <View style={styles.boxsecRadio}>

                            <RadioForm
                              radio_props={radio_props1}
                              initial={(this.state.checkPointsDetails.length > 0) ? (parseInt(this.state.checkPointsDetails[i].RadioValue) == 9) ? 0 : (parseInt(this.state.checkPointsDetails[i].RadioValue) == 10) ? 1 : -1 : -1}
                              onPress={(value) => {
                                // this.markStatus(items)
                                var checkPointsDetails = this.state.checkPointsDetails
                                var isNCClearRequired = false
                                var ncRemovalTemplateId = 0
                                for (var i = 0; i < checkPointsDetails.length; i++) {
                                  if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                    checkPointsDetails[i].RadioValue = value
                                    checkPointsDetails[i].ParamMode = 1
                                    checkPointsDetails[i].Modified = true
                                    if (value == items.correctAnswer) {
                                      checkPointsDetails[i].IsCorrect = 1
                                      console.log('correct answer')
                                      console.log('checkPointsDetails now', checkPointsDetails[i].IsCorrect)
                                      if (checkPointsDetails[i].IsNCAllowed == 1) {
                                        var dataArr = this.props.data.audits.ncofiRecords
                                        var isNCExists = false
                                        for (var k = 0; k < dataArr.length; k++) {
                                          if (dataArr[k].AuditID === this.state.auditId) {
                                            for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                              if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                isNCExists = true
                                              }
                                            }
                                          }
                                        }
                                        if (isNCExists) {
                                          isNCClearRequired = true
                                          ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                        }
                                      }
                                      if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                        for (var j = 0; j < items.scoreTypesData.length; j++) {
                                          if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                            && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                            if (items.scoreTypesData[j].status == '1') {
                                              checkPointsDetails[i].IsNCAllowed = 1
                                              break
                                            }
                                            else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                              checkPointsDetails[i].IsNCAllowed = 0
                                              break
                                            }
                                            else {
                                              checkPointsDetails[i].IsNCAllowed = 0
                                              break
                                            }
                                          }
                                        }
                                      }
                                      else {
                                        checkPointsDetails[i].IsNCAllowed = 0 // NC is not allowed & OFI is allowed
                                      }
                                    }
                                    else if (value == 11) {
                                      checkPointsDetails[i].IsCorrect = 0
                                      if (checkPointsDetails[i].IsNCAllowed == 1) {
                                        var dataArr = this.props.data.audits.ncofiRecords
                                        var isNCExists = false
                                        for (var k = 0; k < dataArr.length; k++) {
                                          if (dataArr[k].AuditID === this.state.auditId) {
                                            for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                              if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                isNCExists = true
                                              }
                                            }
                                          }
                                        }
                                        if (isNCExists) {
                                          isNCClearRequired = true
                                          ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                        }
                                      }
                                      if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                        for (var j = 0; j < items.scoreTypesData.length; j++) {
                                          if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                            && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                            if (items.scoreTypesData[j].status == '1') {
                                              checkPointsDetails[i].IsNCAllowed = 1
                                              break
                                            }
                                            else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                              checkPointsDetails[i].IsNCAllowed = 0
                                              break
                                            }
                                            else {
                                              checkPointsDetails[i].IsNCAllowed = 2
                                              break
                                            }
                                          }
                                        }
                                      }
                                      else {
                                        checkPointsDetails[i].IsNCAllowed = 2 // Both NC & OFI is not allowed
                                      }
                                    }
                                    else {
                                      checkPointsDetails[i].IsCorrect = 0
                                      checkPointsDetails[i].IsNCAllowed = 1 // Both NC & OFI is allowed
                                    }
                                    if (items.scoreType == 2) {
                                      if (value == parseInt(items.correctAnswer)) {
                                        checkPointsDetails[i].Score = items.maxScore
                                      }
                                      else {
                                        checkPointsDetails[i].Score = items.minScore
                                      }
                                    }
                                  }
                                }
                                if (isNCClearRequired) {
                                  this.setState({
                                    ncRemovalTemplateId: ncRemovalTemplateId,
                                    checkPointsDetails: checkPointsDetails,
                                    isUnsavedData: true,
                                    dialogVisibleNCR: true
                                  }, () => {
                                    // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                  })
                                }
                                else {
                                  this.setState({
                                    checkPointsDetails: checkPointsDetails,
                                    isUnsavedData: true
                                  }, () => {
                                    // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                  })
                                }
                              }}
                              formHorizontal={true}
                              labelHorizontal={true}
                              buttonSize={15}
                              labelStyle={{ color: 'black', paddingRight: 12 }}
                            />
                            {/* {(this.state.checkPointsDetails[i].IsCorrect === 1) ?
                        <Icon name='check' size={20} color='green'/>  : (this.state.checkPointsDetails[i].IsCorrect === 0) ?
                        <Icon name='times' size={20} color='red'/> : null}                     */}
                            {(this.state.checkPointsDetails[i].IsNCAllowed != 2) ?
                              <TouchableOpacity onPress={this.popupModal.bind(this, this.state.checkPointsDetails[i])} style={styles.ncofi}>
                                <Text style={{ color: 'white'}}>NC/OFI</Text>
                              </TouchableOpacity> : null}
                          </View> :
                          items.ansType === 'M2' ?
                            <View style={styles.boxsecRadio}>
                              <RadioForm
                                radio_props={radio_props2}
                                initial={(this.state.checkPointsDetails.length > 0) ? (parseInt(this.state.checkPointsDetails[i].RadioValue) == 12) ? 0 : (parseInt(this.state.checkPointsDetails[i].RadioValue) == 13) ? 1 : -1 : -1}
                                onPress={(value) => {
                                  // this.markStatus(items)
                                  var checkPointsDetails = this.state.checkPointsDetails
                                  var isNCClearRequired = false
                                  var ncRemovalTemplateId = 0
                                  for (var i = 0; i < checkPointsDetails.length; i++) {
                                    if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                      checkPointsDetails[i].RadioValue = value
                                      checkPointsDetails[i].ParamMode = 2
                                      checkPointsDetails[i].Modified = true
                                      if (value == items.correctAnswer) {
                                        checkPointsDetails[i].IsCorrect = 1
                                        console.log('correct answer')
                                        console.log('checkPointsDetails now', checkPointsDetails[i].IsCorrect)
                                        if (checkPointsDetails[i].IsNCAllowed == 1) {
                                          console.log('checkPointsDetailsd', checkPointsDetails)
                                          var dataArr = this.props.data.audits.ncofiRecords
                                          var isNCExists = false
                                          for (var k = 0; k < dataArr.length; k++) {
                                            if (dataArr[k].AuditID === this.state.auditId) {
                                              for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                                if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                  isNCExists = true
                                                }
                                              }
                                            }
                                          }
                                          if (isNCExists) {
                                            isNCClearRequired = true
                                            ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                          }
                                        }
                                        if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                          for (var j = 0; j < items.scoreTypesData.length; j++) {
                                            if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                              && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                              if (items.scoreTypesData[j].status == '1') {
                                                checkPointsDetails[i].IsNCAllowed = 1
                                                break
                                              }
                                              else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                checkPointsDetails[i].IsNCAllowed = 0
                                                break
                                              }
                                              else {
                                                checkPointsDetails[i].IsNCAllowed = 0
                                                break
                                              }
                                            }
                                          }
                                        }
                                        else {
                                          checkPointsDetails[i].IsNCAllowed = 0 // NC is not allowed & OFI is allowed
                                        }
                                      }
                                      else if (value == 11) {
                                        checkPointsDetails[i].IsCorrect = 0
                                        if (checkPointsDetails[i].IsNCAllowed == 1) {
                                          var dataArr = this.props.data.audits.ncofiRecords
                                          var isNCExists = false
                                          for (var k = 0; k < dataArr.length; k++) {
                                            if (dataArr[k].AuditID === this.state.auditId) {
                                              for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                                if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                  isNCExists = true
                                                }
                                              }
                                            }
                                          }
                                          if (isNCExists) {
                                            isNCClearRequired = true
                                            ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                          }
                                        }
                                        if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                          for (var j = 0; j < items.scoreTypesData.length; j++) {
                                            if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                              && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                              if (items.scoreTypesData[j].status == '1') {
                                                checkPointsDetails[i].IsNCAllowed = 1
                                                break
                                              }
                                              else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                checkPointsDetails[i].IsNCAllowed = 0
                                                break
                                              }
                                              else {
                                                checkPointsDetails[i].IsNCAllowed = 2
                                                break
                                              }
                                            }
                                          }
                                        }
                                        else {
                                          checkPointsDetails[i].IsNCAllowed = 2 // Both NC & OFI is not allowed
                                        }
                                      }
                                      else {
                                        checkPointsDetails[i].IsCorrect = 0
                                        checkPointsDetails[i].IsNCAllowed = 1 // Both NC & OFI is allowed
                                      }
                                      if (items.scoreType == 2) {
                                        if (value == parseInt(items.correctAnswer)) {
                                          checkPointsDetails[i].Score = items.maxScore
                                        }
                                        else {
                                          checkPointsDetails[i].Score = items.minScore
                                        }
                                      }
                                    }
                                  }
                                  if (isNCClearRequired) {
                                    this.setState({
                                      ncRemovalTemplateId: ncRemovalTemplateId,
                                      checkPointsDetails: checkPointsDetails,
                                      isUnsavedData: true,
                                      dialogVisibleNCR: true
                                    }, () => {
                                      // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                    })
                                  }
                                  else {
                                    this.setState({
                                      checkPointsDetails: checkPointsDetails,
                                      isUnsavedData: true
                                    }, () => {
                                      // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                    })
                                  }
                                }}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonSize={15}
                                labelStyle={{ color: 'black', paddingRight: 12 }}
                              />
                              {/* {(this.state.checkPointsDetails[i].IsCorrect === 1) ?
                        <Icon name='check' size={20} color='green'/>  : (this.state.checkPointsDetails[i].IsCorrect === 0) ?
                        <Icon name='times' size={20} color='red'/> : null}  */}
                              {(this.state.checkPointsDetails[i].IsNCAllowed != 2) ?
                                <TouchableOpacity onPress={this.popupModal.bind(this, this.state.checkPointsDetails[i])} style={styles.ncofi}>
                                  <Text style={{ color: 'white' }}>NC/OFI</Text>
                                </TouchableOpacity> : null}
                            </View> : items.ansType === 'M3' ?
                              <View style={styles.boxsecRadio}>
                                <RadioForm
                                  radio_props={radio_props3}
                                  initial={(this.state.checkPointsDetails.length > 0) ? (parseInt(this.state.checkPointsDetails[i].RadioValue) == 9) ? 0 : (parseInt(this.state.checkPointsDetails[i].RadioValue) == 10) ? 1 : (parseInt(this.state.checkPointsDetails[i].RadioValue) == 11) ? 2 : -1 : -1}
                                  onPress={(value) => {
                                    // this.markStatus(items)
                                    console.log('==--->', value)
                                    var checkPointsDetails = this.state.checkPointsDetails
                                    var isNCClearRequired = false
                                    var ncRemovalTemplateId = 0
                                    for (var i = 0; i < checkPointsDetails.length; i++) {
                                      if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                        checkPointsDetails[i].RadioValue = value
                                        checkPointsDetails[i].ParamMode = 3
                                        checkPointsDetails[i].Modified = true
                                        if (value == items.correctAnswer) {
                                          checkPointsDetails[i].IsCorrect = 1
                                          console.log('correct answer')
                                          console.log('checkPointsDetails now', checkPointsDetails[i].IsCorrect)
                                          if (checkPointsDetails[i].IsNCAllowed == 1) {
                                            var dataArr = this.props.data.audits.ncofiRecords
                                            var isNCExists = false
                                            for (var k = 0; k < dataArr.length; k++) {
                                              if (dataArr[k].AuditID === this.state.auditId) {
                                                for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                                  if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                    isNCExists = true
                                                  }
                                                }
                                              }
                                            }
                                            if (isNCExists) {
                                              isNCClearRequired = true
                                              ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                            }
                                          }
                                          if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                            for (var j = 0; j < items.scoreTypesData.length; j++) {
                                              if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                                && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                                if (items.scoreTypesData[j].status == '1') {
                                                  checkPointsDetails[i].IsNCAllowed = 1
                                                  break
                                                }
                                                else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                  checkPointsDetails[i].IsNCAllowed = 0
                                                  break
                                                }
                                                else {
                                                  checkPointsDetails[i].IsNCAllowed = 0
                                                  break
                                                }
                                              }
                                            }
                                          }
                                          else {
                                            checkPointsDetails[i].IsNCAllowed = 0 // NC is not allowed & OFI is allowed
                                          }
                                        }
                                        else if (value == 11) {
                                          checkPointsDetails[i].IsCorrect = 0
                                          if (checkPointsDetails[i].IsNCAllowed == 1) {
                                            var dataArr = this.props.data.audits.ncofiRecords
                                            var isNCExists = false
                                            for (var k = 0; k < dataArr.length; k++) {
                                              if (dataArr[k].AuditID === this.state.auditId) {
                                                for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                                  if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                    isNCExists = true
                                                  }
                                                }
                                              }
                                            }
                                            if (isNCExists) {
                                              isNCClearRequired = true
                                              ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                            }
                                          }
                                          if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                            for (var j = 0; j < items.scoreTypesData.length; j++) {
                                              if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                                && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                                if (items.scoreTypesData[j].status == '1') {
                                                  checkPointsDetails[i].IsNCAllowed = 1
                                                  break
                                                }
                                                else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                  checkPointsDetails[i].IsNCAllowed = 0
                                                  break
                                                }
                                                else {
                                                  checkPointsDetails[i].IsNCAllowed = 2
                                                  break
                                                }
                                              }
                                            }
                                          }
                                          else {
                                            checkPointsDetails[i].IsNCAllowed = 2 // Both NC & OFI is not allowed
                                          }
                                        }
                                        else {
                                          checkPointsDetails[i].IsCorrect = 0
                                          checkPointsDetails[i].IsNCAllowed = 1 // Both NC & OFI is allowed
                                        }
                                        if (items.scoreType == 2) {
                                          if (value == parseInt(items.correctAnswer)) {
                                            checkPointsDetails[i].Score = items.maxScore
                                          }
                                          else {
                                            checkPointsDetails[i].Score = items.minScore
                                          }
                                        }
                                      }
                                    }
                                    if (isNCClearRequired) {
                                      this.setState({
                                        ncRemovalTemplateId: ncRemovalTemplateId,
                                        checkPointsDetails: checkPointsDetails,
                                        isUnsavedData: true,
                                        dialogVisibleNCR: true
                                      }, () => {
                                        // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                      })
                                    }
                                    else {
                                      this.setState({
                                        checkPointsDetails: checkPointsDetails,
                                        isUnsavedData: true
                                      }, () => {
                                        // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                      })
                                    }
                                  }}
                                  formHorizontal={true}
                                  labelHorizontal={true}
                                  buttonSize={15}
                                  labelStyle={{ color: 'black', paddingRight: 12 }}
                                />
                                {(this.state.checkPointsDetails[i].IsNCAllowed != 2) ?
                                  <TouchableOpacity onPress={this.popupModal.bind(this, this.state.checkPointsDetails[i])} style={styles.ncofi}>
                                    <Text style={{ color: 'white'}}>NC/OFI</Text>
                                  </TouchableOpacity> : null}
                              </View> : items.ansType === 'M4' ?
                                <View style={styles.boxsecRadio}>
                                  <RadioForm
                                    radio_props={radio_props4}
                                    initial={(this.state.checkPointsDetails.length > 0) ? (parseInt(this.state.checkPointsDetails[i].RadioValue) == 14) ? 0 : (parseInt(this.state.checkPointsDetails[i].RadioValue) == 15) ? 1 : (parseInt(this.state.checkPointsDetails[i].RadioValue) == 11) ? 2 : -1 : -1}
                                    onPress={(value) => {
                                      // this.markStatus(items)
                                      var checkPointsDetails = this.state.checkPointsDetails
                                      var isNCClearRequired = false
                                      var ncRemovalTemplateId = 0
                                      for (var i = 0; i < checkPointsDetails.length; i++) {
                                        if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                          checkPointsDetails[i].RadioValue = value
                                          checkPointsDetails[i].ParamMode = 4
                                          checkPointsDetails[i].Modified = true
                                          if (value == items.correctAnswer) {
                                            checkPointsDetails[i].IsCorrect = 1
                                            console.log('correct answer')
                                            console.log('checkPointsDetails now', checkPointsDetails[i].IsCorrect)
                                            if (checkPointsDetails[i].IsNCAllowed == 1) {
                                              var dataArr = this.props.data.audits.ncofiRecords
                                              var isNCExists = false
                                              for (var k = 0; k < dataArr.length; k++) {
                                                if (dataArr[k].AuditID === this.state.auditId) {
                                                  for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                                    if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                      isNCExists = true
                                                    }
                                                  }
                                                }
                                              }
                                              if (isNCExists) {
                                                isNCClearRequired = true
                                                ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                              }
                                            }
                                            if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                              for (var j = 0; j < items.scoreTypesData.length; j++) {
                                                if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                                  && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                                  if (items.scoreTypesData[j].status == '1') {
                                                    checkPointsDetails[i].IsNCAllowed = 1
                                                    break
                                                  }
                                                  else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                    checkPointsDetails[i].IsNCAllowed = 0
                                                    break
                                                  }
                                                  else {
                                                    checkPointsDetails[i].IsNCAllowed = 0
                                                    break
                                                  }
                                                }
                                              }
                                            }
                                            else {
                                              checkPointsDetails[i].IsNCAllowed = 0 // NC is not allowed & OFI is allowed
                                            }
                                          }
                                          else if (value == 11) {
                                            checkPointsDetails[i].IsCorrect = 0
                                            if (checkPointsDetails[i].IsNCAllowed == 1) {
                                              var dataArr = this.props.data.audits.ncofiRecords
                                              var isNCExists = false
                                              for (var k = 0; k < dataArr.length; k++) {
                                                if (dataArr[k].AuditID === this.state.auditId) {
                                                  for (var j = 0; j < dataArr[k].Pending.length; j++) {
                                                    if (dataArr[k].Pending[j].ChecklistTemplateId == items.ChecklistTemplateId && dataArr[k].Pending[j].Category == 'NC') {
                                                      isNCExists = true
                                                    }
                                                  }
                                                }
                                              }
                                              if (isNCExists) {
                                                isNCClearRequired = true
                                                ncRemovalTemplateId = checkPointsDetails[i].ChecklistTemplateId
                                              }
                                            }
                                            if (items.scoreType == 3 && checkPointsDetails[i].Score != '') {
                                              for (var j = 0; j < items.scoreTypesData.length; j++) {
                                                if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                                  && checkPointsDetails[i].Score == items.scoreTypesData[j].id) {
                                                  if (items.scoreTypesData[j].status == '1') {
                                                    checkPointsDetails[i].IsNCAllowed = 1
                                                    break
                                                  }
                                                  else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                    checkPointsDetails[i].IsNCAllowed = 0
                                                    break
                                                  }
                                                  else {
                                                    checkPointsDetails[i].IsNCAllowed = 2
                                                    break
                                                  }
                                                }
                                              }
                                            }
                                            else {
                                              checkPointsDetails[i].IsNCAllowed = 2 // Both NC & OFI is not allowed
                                            }
                                          }
                                          else {
                                            checkPointsDetails[i].IsCorrect = 0
                                            checkPointsDetails[i].IsNCAllowed = 1 // Both NC & OFI is allowed
                                          }
                                          if (items.scoreType == 2) {
                                            if (value == parseInt(items.correctAnswer)) {
                                              checkPointsDetails[i].Score = items.maxScore
                                            }
                                            else {
                                              checkPointsDetails[i].Score = items.minScore
                                            }
                                          }
                                        }
                                      }
                                      if (isNCClearRequired) {
                                        this.setState({
                                          ncRemovalTemplateId: ncRemovalTemplateId,
                                          checkPointsDetails: checkPointsDetails,
                                          isUnsavedData: true,
                                          dialogVisibleNCR: true
                                        }, () => {
                                          // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                        })
                                      }
                                      else {
                                        this.setState({
                                          checkPointsDetails: checkPointsDetails,
                                          isUnsavedData: true
                                        }, () => {
                                          // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                        })
                                      }
                                    }}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    buttonSize={15}
                                    labelStyle={{ color: 'black', paddingRight: 12 }}
                                  />
                                  {/* {(this.state.checkPointsDetails[i].IsCorrect === 1) ?
                        <Icon name='check' size={20} color='green'/>  : (this.state.checkPointsDetails[i].IsCorrect === 0) ?
                        <Icon name='times' size={20} color='red'/> : null}  */}
                                  {(this.state.checkPointsDetails[i].IsNCAllowed != 2) ?
                                    <TouchableOpacity onPress={this.popupModal.bind(this, this.state.checkPointsDetails[i])} style={styles.ncofi}>
                                      <Text style={{ color: 'white'}}>NC/OFI</Text>
                                    </TouchableOpacity> : null}
                                </View> : null
                        }

                        {(this.state.checkPointsDetails[i]) ? (this.state.checkPointsDetails[i].File != '' &&
                          this.state.checkPointsDetails[i].FileType != '') ?
                          (this.state.checkPointsDetails[i].FileType.split('/')[0] === 'image') ?
                            <TouchableOpacity onPress={this.openAttachmentImage.bind(this, this.state.checkPointsDetails[i])}>
                              <View style={styles.boxsecImageDisplay}>
                              <Image source={{ uri: this.state.checkPointsDetails[i].File }} style={{ width: width(85), height: 200, resizeMode: 'cover' }} />
                                {/* <Image source={{ uri: 'data:' + this.state.checkPointsDetails[i].FileType + ';base64,' + this.state.checkPointsDetails[i].File }} style={{ width: width(85), height: 200, resizeMode: 'cover' }} /> */}
                                <View style={{ display: 'none' }}>
                                  {this.state.checkPointsDetails[i].Modified = true}
                                </View>
                              </View>
                            </TouchableOpacity> : null : null : null
                        }

                        {(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].FileName != '' ?
                          <TouchableOpacity style={styles.rightHeader} onPress={this.removeAttachment.bind(this, i)}>
                            <Icon name="trash" size={20} color="red" />
                          </TouchableOpacity> : null : null
                        }

                        <View style={this.state.checkPointsDetails[i].RadioValue == 11 ? styles.boxsecNone : styles.boxsec1}>
                          <View>
                            {(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].FileName != '' ? <Text style={{ padding: 0, margin: 0, color: '#A6A6A6', width: '90%', fontSize: Fonts.size.small }}>{strings.Attachment}</Text> : null : null}
                            <TextInput
                              style={(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].FileName != '' ? styles.checkPointsTextInputLabel : styles.checkPointsTextInput : styles.checkPointsTextInput}
                              placeholderTextColor={(items.AttachforNc === 1 ? 'red' : '#A9A9A9')}
                              textColor='#747474'
                              value={(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].FileName : ''}
                              editable={false}
                              placeholder={strings.Attachment}
                            />
                            <View>
                            </View>
                          </View>
                          <View style={styles.attachIcon}>
                            <TouchableOpacity onPress={this.chooseCameraOption.bind(this, items)}>
                              {/* <ResponsiveImage initWidth='24' initHeight='22' source={Images.AttachIcon}/> */}
                              <Icon name="paperclip" size={30} color="grey" />
                              {(items.AttachforNc === 1) ?
                                <Icon name="asterisk" style={{ bottom: 25, right: 10 }} size={8} color="red" />
                                : <View></View>
                              }
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={(((this.state.checkPointsDetails[i].RadioValue == 11) ||
                          (items.scoreType == 1 && parseInt(items.maxScore) == 0) ||
                          (items.scoreType == 2 && this.state.checkPointsDetails[i].Score == '') ||
                          (items.scoreType == 3 && items.scoreTypesData.length == 0) ||
                          (items.scoreType == 0) || (this.state.ischeckLPA))
                          ? styles.boxsecNone : styles.boxsec1)}>
                          <View style={styles.scoreBox}>
                            <ResponsiveImage initWidth='18' initHeight='20' source={Images.ScoreLogo} />
                          </View>
                          <View style={styles.scoreText}>
                            {(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].Score != '' ?
                              <View style={{ flexDirection: 'row', width: '15%' }}>
                                <Text style={{ padding: 0, margin: 0, color: '#A6A6A6', width: '90%', fontSize: Fonts.size.medium }}>{strings.Score}</Text>
                                {(items.scoreType == 1) ?
                                  <Text style={{ paddingLeft: 10}}>{Math.round(this.state.checkPointsDetails[i].Score)}</Text>
                                  : null
                                }
                              </View>
                              : <View style={{ flexDirection: 'row', width: '15%' }}>
                                <Text style={{ padding: 0, margin: 0, color: '#A6A6A6', width: '100%', fontSize: Fonts.size.medium }}>{strings.Score}</Text>
                              </View> : null
                            }
                            {(items.scoreType == 1) ?
                              <View style={{ flexDirection: 'column' }}>
                                <Slider
                                  value={(this.state.checkPointsDetails[i].Score) == '' ? Number(items.minScore) : Number(this.state.checkPointsDetails[i].Score)}
                                  maximumValue={parseInt(items.maxScore)}
                                  minimumValue={parseInt(items.minScore)}
                                  style={{ width: '80%' }}
                                  thumbTintColor={'#343434'}
                                  minimumTrackTintColor={'#00B0D9'}
                                  maximumTrackTintColor={'#00B0D9'}
                                  animationType={'timing'}
                                  thumbStyle={{ elevation: 5, backgroundColor: 'white', borderColor: 'black', borderWidth: 0.5 }}
                                  onSlidingComplete={(value) => {
                                    // this.setState({ scorevalue : Math.round(value) })
                                    var isValid = false
                                    if (Math.round(value) <= parseInt(items.maxScore) && Math.round(value) >= parseInt(items.minScore)) {
                                      isValid = true
                                    }
                                    if (!isValid) {
                                      this.refs.toast.show(strings.Score_alert + '(' + strings.Min + ': ' + items.minScore + ', ' + strings.Max + ': ' + items.maxScore + ')', DURATION.LENGTH_LONG)
                                    }
                                    var checkPointsDetails = this.state.checkPointsDetails
                                    for (var i = 0; i < checkPointsDetails.length; i++) {
                                      if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                        checkPointsDetails[i].Score = Math.round(value)
                                        if (!isValid) {
                                          checkPointsDetails[i].isScoreValid = false
                                          checkPointsDetails[i].scoreInvalidMsg = strings.Score_alert + '(' + strings.Min + ': ' + items.minScore + ', ' + strings.Max + ': ' + items.maxScore + ')'
                                        }
                                        else {
                                          checkPointsDetails[i].isScoreValid = true
                                          checkPointsDetails[i].scoreInvalidMsg = ''
                                          checkPointsDetails[i].Modified = true
                                        }
                                      }
                                    }
                                    this.setState({ checkPointsDetails: checkPointsDetails, isFormValid: isValid, isUnsavedData: true }, () => {
                                      // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                    })
                                  }}
                                />
                                {/* <TextInput
                          style={styles.checkPointsTextInput}
                          placeholderTextColor='#A9A9A9'
                          textColor={(this.state.checkPointsDetails[i].isScoreValid === true) ? '#747474' : 'red'}
                          value={(this.state.checkPointsDetails[i].Score) ? (this.state.checkPointsDetails[i].Score).toString():' '}
                          placeholder={strings.enter_score+' between '+items.minScore+' to '+items.maxScore}
                          onChangeText={(value) => {
                            //this.setState({ scorevalue : Math.round(value) })
                            var isValid = false
                            if(Math.round(value) <= parseInt(items.maxScore) && Math.round(value) >= parseInt(items.minScore)) {
                              isValid = true
                            }
                            if(!isValid) {
                              this.refs.toast.show( strings.Score_alert+'('+strings.Min+': '+ items.minScore +', '+ strings.Max +': '+ items.maxScore +')', DURATION.LENGTH_LONG)
                            }                            
                            var checkPointsDetails = this.state.checkPointsDetails
                            for(var i=0; i<checkPointsDetails.length; i++) {
                              if(checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                checkPointsDetails[i].Score = Math.round(value)
                                if(!isValid) {
                                  checkPointsDetails[i].isScoreValid = false
                                  checkPointsDetails[i].scoreInvalidMsg = strings.Score_alert+'('+strings.Min+': '+ items.minScore +', '+ strings.Max +': '+ items.maxScore +')'
                                }
                                else {
                                  checkPointsDetails[i].isScoreValid = true
                                  checkPointsDetails[i].scoreInvalidMsg = ''
                                  checkPointsDetails[i].Modified = true
                                }
                              }
                            }
                            this.setState({checkPointsDetails: checkPointsDetails, isFormValid: isValid, isUnsavedData: true}, () =>  {
                              // console.log('checkPointsDetails', this.state.checkPointsDetails)
                            })
                          }}/> */}
                                <View style={{ padding: 6, bottom: 12, flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                                  <Text>{parseInt(items.minScore)}</Text>
                                  <Text>{parseInt(items.maxScore)}</Text>
                                </View>
                              </View>
                              :
                              (items.scoreType == 2) ?
                                <TextInput
                                  style={(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].Score != '' ? styles.checkPointsTextInputLabel : styles.checkPointsTextInput : styles.checkPointsTextInput}
                                  placeholderTextColor='#A9A9A9'
                                  textColor='#747474'
                                  value={(this.state.checkPointsDetails.length > 0) ? this.state.checkPointsDetails[i].Score : ''}
                                  placeholder={strings.Score}
                                  editable={false}
                                /> :
                                (items.scoreType == 3) ?
                                  <Dropdown
                                    label={(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].Score != '' ? '' : '' : ''}
                                    containerStyle={{ top: 0 }}
                                    itemPadding={5}
                                    labelField="text"
                                    valueField="value"
                                    baseColor={'transparent'}
                                    selectedItemColor='#000'
                                    textColor='#000'
                                    itemColor='#000'
                                    fontSize={Fonts.size.medium}
                                    labelFontSize={Fonts.size.small}
                                    dropdownOffset={{ top: 10, left: 0 }}
                                    itemTextStyle={{fontFamily:'OpenSans-Regular'}}
                                    value={(this.state.checkPointsDetails.length > 0) ? this.state.checkPointsDetails[i].Score != '' ? (parseInt(this.state.checkPointsDetails[i].Score) > 0) ? this.state.checkPointsDetails[i].Score : 'Please select' : this.state.checkPointsDetails[i].Score : 'Please select'}
                                    onChange={(chText) => {
                                      const text = chText.value
                                      var checkPointsDetails = this.state.checkPointsDetails
                                      for (var i = 0; i < checkPointsDetails.length; i++) {
                                        if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                          for (var j = 0; j < items.scoreTypesData.length; j++) {
                                            if (items.ChecklistTemplateId == items.scoreTypesData[j].templateId
                                              && text == items.scoreTypesData[j].id) {
                                              if (items.scoreTypesData[j].status == '1') {
                                                checkPointsDetails[i].IsNCAllowed = 1
                                                break
                                              }
                                              else if (items.scoreTypesData[j].status == '2' || items.scoreTypesData[j].status == '3') {
                                                if (checkPointsDetails[i].RadioValue == items.correctAnswer || checkPointsDetails[i].RadioValue == 11 || checkPointsDetails[i].RadioValue == 0) {
                                                  checkPointsDetails[i].IsNCAllowed = 0
                                                  break
                                                }
                                              }
                                              else {
                                                if (checkPointsDetails[i].RadioValue == 11 || checkPointsDetails[i].RadioValue == 0) {
                                                  checkPointsDetails[i].IsNCAllowed = 2
                                                  break
                                                }
                                                else if (checkPointsDetails[i].RadioValue == items.correctAnswer) {
                                                  checkPointsDetails[i].IsNCAllowed = 0
                                                  break
                                                }
                                              }
                                            }
                                          }
                                          checkPointsDetails[i].Score = parseInt(text)
                                          if (checkPointsDetails[i].Score != 'Please select') {
                                            checkPointsDetails[i].Modified = true
                                          }
                                        }
                                      }
                                      this.setState({ checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
                                        // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                      })
                                    }}
                                    data={items.scoreTypesData}
                                  /> :
                                  <View style={items.scoreTypesData.length == 0 ? {
                                    padding: 15,
                                    flexDirection: 'column',
                                    backgroundColor: 'lightgrey',
                                    width: '80%',
                                    height: undefined,
                                    borderRadius: 10,
                                    display: 'none'
                                  } : { padding: 15, flexDirection: 'column' }}>
                                    {this.state.checkPointsDetails[i].Score != '' ?
                                      <View style={{ flexDirection: 'row', width: '15%' }}>
                                        <Text style={(this.state.checkPointsDetails[i].isScoreValid === true) ? { padding: 0, margin: 0, color: '#A6A6A6', width: '90%', fontSize: Fonts.size.medium } : { padding: 0, margin: 0, color: 'red', width: '90%', fontSize: Fonts.size.medium }}>{strings.Score}</Text>
                                        {/* <Text style={{paddingLeft:10}}>{Math.round(this.state.checkPointsDetails[i].Score) === 0 ? 0:Math.round(this.state.checkPointsDetails[i].Score) }</Text>  */}
                                      </View> : null
                                    }
                                    {parseInt(items.maxScore) === 0 && parseInt(items.minScore) === 0 ?
                                      <Text style={{ fontSize: Fonts.size.regular,}}>{items.maxScore}</Text> :

                                      <Slider
                                        value={(this.state.checkPointsDetails[i].Score) == '' ? Number(items.minScore) : Number(this.state.checkPointsDetails[i].Score)}
                                        maximumValue={parseInt(items.maxScore)}
                                        minimumValue={parseInt(items.minScore)}
                                        style={{ width: '80%' }}
                                        thumbTintColor={'#343434'}
                                        minimumTrackTintColor={'#00B0D9'}
                                        maximumTrackTintColor={'#00B0D9'}
                                        animationType={'timing'}
                                        thumbStyle={{ elevation: 5, backgroundColor: 'white', borderColor: 'black', borderWidth: 0.5 }}
                                        onSlidingComplete={(value) => {
                                          // this.setState({ scorevalue : Math.round(value) })
                                          var isValid = false
                                          if (Math.round(value) <= parseInt(items.maxScore) && Math.round(value) >= parseInt(items.minScore)) {
                                            isValid = true
                                          }
                                          if (!isValid) {
                                            this.refs.toast.show(strings.Score_alert + '(' + strings.Min + ': ' + items.minScore + ', ' + strings.Max + ': ' + items.maxScore + ')', DURATION.LENGTH_LONG)
                                          }
                                          var checkPointsDetails = this.state.checkPointsDetails
                                          for (var i = 0; i < checkPointsDetails.length; i++) {
                                            if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                              checkPointsDetails[i].Score = Math.round(value)
                                              if (!isValid) {
                                                checkPointsDetails[i].isScoreValid = false
                                                checkPointsDetails[i].scoreInvalidMsg = strings.Score_alert + '(' + strings.Min + ': ' + items.minScore + ', ' + strings.Max + ': ' + items.maxScore + ')'
                                              }
                                              else {
                                                checkPointsDetails[i].isScoreValid = true
                                                checkPointsDetails[i].scoreInvalidMsg = ''
                                                checkPointsDetails[i].Modified = true
                                              }
                                            }
                                          }
                                          this.setState({ checkPointsDetails: checkPointsDetails, isFormValid: isValid, isUnsavedData: true }, () => {
                                            // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                          })
                                        }}
                                      />
                                    }
                                    {parseInt(items.maxScore) === 0 && parseInt(items.minScore) === 0 ?
                                      null :
                                      <View style={{ padding: 5, bottom: 15, flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                                        <Text>{parseInt(items.minScore)}</Text>
                                        <Text>{parseInt(items.maxScore)}</Text>
                                      </View>
                                    }
                                  </View>
                            }
                          </View>
                        </View>

                        {(this.state.ischeckLPA) ?
                          <View style={this.state.checkPointsDetails[i].RadioValue == 11 ? styles.boxsecNone : styles.boxsec1}>
                            {(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].Correction != '' ? <Text style={{ padding: 0, margin: 0, color: '#A6A6A6', width: '90%', fontSize: Fonts.size.small }}>{strings.Correction}</Text> : null : null}
                            <View style={(this.state.checkPointsDetails[i]) ? this.state.checkPointsDetails[i].Correction != '' ? styles.LPAsec1Label : styles.LPAsec1 : styles.LPAsec1}>
                              <TextInput
                                style={styles.checkPointsTextInput}
                                placeholderTextColor='#A9A9A9'
                                textColor='#747474'
                                value={(this.state.checkPointsDetails.length > 0) ? this.state.checkPointsDetails[i].Correction : ''}
                                placeholder={strings.Correction}
                                onChangeText={(text) => {
                                  console.log('Writing', text)
                                  var checkPointsDetails = this.state.checkPointsDetails
                                  for (var i = 0; i < checkPointsDetails.length; i++) {
                                    if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                      checkPointsDetails[i].Correction = text
                                      checkPointsDetails[i].Modified = true
                                    }
                                  }
                                  this.setState({ checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
                                    // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                  })
                                }} />
                            </View>
                          </View> : <View></View>
                        }
                        {(this.state.ischeckLPA) ?
                          <View style={this.state.checkPointsDetails[i].RadioValue == 11 ? styles.boxsecNone : styles.boxsec1}>
                            {(dropdata.length > 0) ?
                              <Dropdown
                                label={(this.state.checkPointsDetails[i].Approach.toString() == '') ? '' : strings.Choose_Approach}
                                containerStyle={{ paddingTop: 5 }}
                                itemPadding={5}
                                baseColor={'transparent'}
                                selectedItemColor='#000'
                                textColor='#000'
                                itemColor='#000'
                                fontSize={Fonts.size.medium}
                                labelFontSize={Fonts.size.small}
                                dropdownOffset={{ top: 10, left: 0 }}
                                itemTextStyle={{fontFamily:'OpenSans-Regular'}}
                                value={(this.state.checkPointsDetails[i]) ? (this.state.checkPointsDetails[i].Approach.toString() == '') ? strings.Choose_Approach : this.state.checkPointsDetails[i].Approach.toString() : strings.Choose_Approach}
                                onChangeText={(value, index, data) => {
                                  var checkPointsDetails = this.state.checkPointsDetails
                                  for (var i = 0; i < checkPointsDetails.length; i++) {
                                    if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                      checkPointsDetails[i].Approach = value.value
                                      for (var j = 0; j < data.length; j++) {
                                        if (value.value == data[j].value) {
                                          console.log('Approach dropdown', value)
                                          checkPointsDetails[i].ApproachId = data[j].id
                                          checkPointsDetails[i].Modified = true
                                        }
                                      }
                                    }
                                  }
                                  this.setState({ checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
                                    // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                  })
                                }}
                                data={dropdata}
                              /> : <Text style={{ height: 40, color: 'grey', padding: 5, paddingTop: 10 }}>{strings.No_Approaches_found}</Text>
                            }
                          </View> : <View></View>
                        }

                        <View style={styles.boxsecRemark}>
                          <View>
                            {(this.state.checkPointsDetails) ? this.state.checkPointsDetails[i].Remark != '' ? <Text style={{ padding: 0, margin: 0, color: '#A6A6A6', width: '90%', fontSize: Fonts.size.small }}>{strings.Remark}</Text> : null : null}
                            <TextInput
                              style={(this.state.checkPointsDetails) ? this.state.checkPointsDetails[i].Remark != '' ? styles.checkPointsTextInputLabel : styles.checkPointsTextInput : styles.checkPointsTextInput}
                              placeholderTextColor={(items.RemarkforNc === 1 ? 'red' : '#A9A9A9')}
                              textColor='#747474'
                              value={(this.state.checkPointsDetails) ? this.state.checkPointsDetails[i].Remark : ''}
                              placeholder={strings.Remark}
                              onBlur={this.countStatistics.bind(this, this.state.checkPointsDetails)}
                              onChangeText={(text) => {
                                console.log('Writing remark', text)
                                var checkPointsDetails = this.state.checkPointsDetails
                                for (var i = 0; i < checkPointsDetails.length; i++) {
                                  if (checkPointsDetails[i].ChecklistTemplateId == items.ChecklistTemplateId) {
                                    checkPointsDetails[i].Remark = text
                                    checkPointsDetails[i].Modified = true
                                  }
                                }
                                this.setState({ checkPointsDetails: checkPointsDetails, isUnsavedData: true }, () => {
                                  // console.log('checkPointsDetails', this.state.checkPointsDetails)
                                })
                              }} />
                          </View>
                          {(items.RemarkforNc === 1) ?
                            <Icon name="asterisk" style={{ right: 10, top: 10 }} size={8} color="red" />
                            :
                            <View></View>
                          }
                        </View>
                      </View>
                    </View>
                  )}

                </View> :
                <View style={{ marginTop: 55 }}>
                  <Text style={styles.noRecordsFound}>
                    {strings.No_checkpoints_found}
                  </Text>
                </View>
              }

            </ScrollView>
          </View> :
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            {/* <Bars size={20} color='#48BCF7'/> */}
            <ResponsiveImage source={Images.ContentLoader} initHeight={100} initWidth={100} />
            <Text style={{ fontSize: Fonts.size.regular}}>{strings.cp_01}</Text>
            <Text style={{ fontSize: Fonts.size.small}}>{strings.cp_02}</Text>
          </View>
        }

        {(this.state.checkpointList.length > 0) ?
          <View style={styles.footer}>
            <Image
              style={{
                width: '100%',
                height: 65
              }}
              source={Images.Footer} />

            {(this.state.isSaving === false) ?
              <View style={styles.footerDiv}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity style={{ flexDirection: 'column', width: width(45), justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.setState({ dialogVisibleReset: true })}>
                    <Icon name="undo" size={25} color="white" />
                    <Text style={{ color: 'white', fontSize: Fonts.size.regular}}>{strings.Reset}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: width(10), justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={Images.lineIcon} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity style={{ flexDirection: 'column', width: width(45), justifyContent: 'center', alignItems: 'center' }}
                    onPress={debounce(this.updateCheckPointsValues.bind(this), 1500)}>
                    <Icon name="save" size={25} color="white" />
                    <Text style={{ color: 'white', fontSize: Fonts.size.regular}}>{strings.Save}</Text>
                  </TouchableOpacity>
                </View>
              </View> :
              <View style={{ right: 70, position: 'absolute' }}>
                <Pulse size={20} color='white' />
              </View>
            }
          </View> : null}

        {/* Modal design */}
        <Modal
          isVisible={this.state.dialogVisibleNC}
          onBackdropPress={() => this.setState({ dialogVisibleNC: false })}
          // animationIn="slideInUp"
          // animationOut="slideOutDown"
          // transparent={true} 
          // backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}
        >
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>

              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontSize: Fonts.size.regular}}>{strings.Make_your_selection}</Text>
                </View>
              </View>

              {(this.state.isNCAllowed) ?
                <TouchableOpacity onPress={this.navigateTo.bind(this, 'NC')}>
                  <View style={styles.sectionTop}>
                    <View style={styles.sectionContent}>
                      <Text style={styles.boxContent}>{strings.NC}</Text>
                    </View>
                  </View>
                </TouchableOpacity> : null}

              <TouchableOpacity onPress={this.navigateTo.bind(this, 'OFI')}>
                <View style={styles.sectionTop}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContent}>{strings.OFI}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({ dialogVisibleNC: false })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.Cancel}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>
        {/* Modal */}

        <Modal
          isVisible={this.state.dialogVisible}
          onBackdropPress={() => this.setState({ dialogVisible: false })}
          // animationIn="slideInUp"
          // animationOut="slideOutDown"
          // transparent={true} 
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}
        >
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>

              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontSize: Fonts.size.regular}}>{strings.Confirm}</Text>
                </View>
              </View>

              <View style={styles.sectionTop}>
                <View style={styles.sectionContent}>
                  <Text style={styles.boxContent}>{strings.Confirm_message}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={this.updateCheckPointsValues.bind(this)}>
                <View style={styles.sectionBtn}>
                  <Text style={styles.boxContent}>{strings.yes}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({ dialogVisible: false }, () => {
               this.state.go_home ? this.props.navigation.navigate("AuditDashboard") : this.props.navigation.goBack()
              })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>

        <Modal
          isVisible={this.state.dialogVisibleNCR}
          onBackdropPress={() => this.setState({ dialogVisibleNCR: false })}
          // animationIn="slideInUp"
          // animationOut="slideOutDown"
          // transparent={true} 
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}
        >
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>

              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontSize: Fonts.size.regular}}>{strings.Confirm}</Text>
                </View>
              </View>

              <View style={styles.sectionTop}>
                <View style={styles.sectionContent}>
                  <Text style={styles.boxContent}>{strings.NC_Confirm_message}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={this.clearNcCheckpoint}>
                <View style={styles.sectionBtn}>
                  <Text style={styles.boxContent}>{strings.yes}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({ dialogVisibleNCR: false })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>

        {/* Modal design */}
        <Modal
          isVisible={this.state.dialogVisibleCamera}
          onBackdropPress={() => this.setState({ dialogVisibleCamera: false })}
          style={styles.modalOuterBox}
        >
          <View style={styles.ncModal}>
            <View /* style={styles.modalBody} */>

              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontSize: Fonts.size.regular}}>{strings.Make_your_selection}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={this.cameraAction.bind(this, 'Camera')}>
                <View style={styles.sectionTop}>
                  <View style={[styles.sectionContent, styles.boxContent]}>
                    <View style={{width:'12%',height:null}}>
                    <Icon name="camera" size={25} color="grey" />
                    </View>
                    <View style={{width:'88%',height:null,justifyContent:'flex-start'}}>
                    <Text style={styles.boxContentCam}>{strings.Camera_Capture_Head}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.cameraAction.bind(this, 'Browse')}>
                <View style={styles.sectionTop}>
                  <View style={[styles.sectionContent, styles.boxContent]}>
                  <View style={{width:'12%',height:null}}>
                  <Icon name="file-image-o" size={25} color="grey" />
                  </View>
                  <View style={{width:'88%',height:null}}>
                  <Text style={styles.boxContentCam}>{strings.Camera_Browse_Files}</Text>
                  </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({ dialogVisibleCamera: false })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.Cancel}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>
        {/* Modal */}

        {/* <ConfirmDialog
          title="Confirm"
          message="You will loose all your unsaved checkpoints information. Are you sure you want to discard the local changes and go back to checklist page?"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
            title: "YES",
            onPress: this.forceGoBackToChecklist
          }}
          negativeButton={{
            title: "NO",
            onPress: () => this.setState({dialogVisible: false})
          }}
        /> 
         <ConfirmDialog
          title= {strings.StatusTitle}
          message= {strings.ResetField}
          visible={this.state.dialogVisibleReset}
          onTouchOutside={() => this.setState({dialogVisibleReset: false})}
          positiveButton={{
            title: strings.yes,
            onPress: this.clearCheckpoints
          }}
          negativeButton={{
            title: strings.no,
            onPress: this.cancelResetDialog
          }}
        />*/}


        <Modal
          isVisible={this.state.dialogVisibleReset}
          onBackdropPress={() => this.setState({ dialogVisibleReset: false })}
          // animationIn="slideInUp"
          // animationOut="slideOutDown"
          // transparent={true} 
          backdropColor="rgba(0,0,0,0.5)"
          style={styles.modalOuterBox}
        >
          <View style={styles.ncModal}>
            <View>

              <View style={styles.modalheading}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontSize: Fonts.size.regular}}>{strings.Confirm}</Text>
                </View>
              </View>

              <View style={styles.sectionTop}>
                <View style={styles.sectionContent}>
                  <Text style={styles.boxContent}>{strings.ResetField}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={()=>this.clearCheckpoints()}>
                <View style={styles.sectionBtn}>
                  <Text style={styles.boxContent}>{strings.yes}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({ dialogVisibleReset: false })}>
                <View style={styles.sectionTopCancel}>
                  <View style={styles.sectionContent}>
                    <Text style={styles.boxContentClose}>{strings.no}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </Modal>

        <Modal
          isVisible={this.state.dialogVisibleAttach}
          onBackdropPress={() => this.setState({ dialogVisibleAttach: false })}
          style={styles.modalOuterBox}
        >
          <View style={styles.modalavatar}>
            <TouchableOpacity onPress={() => this.setState({ dialogVisibleAttach: false })}
              style={{ backgroundColor: 'transparent', height: 60, width: 80 }}>
              <View style={{ backgroundColor: 'transparent', top: 18 }}>
                <Icon style={{ left: 8 }} name="times-circle" size={40} color='white' />
              </View>
            </TouchableOpacity>
            <Image style={styles.modelImage} source={{ uri: this.state.cAttachData }} />
          </View>
        </Modal>

        <Toast ref="toast"
          style={{ backgroundColor: 'black', margin: 20 }}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: 'white' }}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeAuditRecords: (auditRecords) => dispatch({ type: 'STORE_AUDIT_RECORDS', auditRecords }),
    changeAuditState: (isAuditing) => dispatch({ type: 'CHANGE_AUDIT_STATE', isAuditing }),
    storeAudits: (audits) => dispatch({ type: 'STORE_AUDITS', audits }),
    storeCameraCapture: (cameraCapture) => dispatch({ type: 'STORE_CAMERA_CAPTURE', cameraCapture }),
    storeNCRecords: (ncofiRecords) => dispatch({ type: 'STORE_NCOFI_RECORDS', ncofiRecords })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPointScreen)