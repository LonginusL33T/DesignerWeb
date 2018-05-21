import React, {Component} from 'react'
import LzEditor from 'react-lz-editor'
import '../resource/Workstation.css'
import {Form, Modal, Upload, Icon, message, Button,Spin} from 'antd'
import config from '../../../../../framework/config/config'
import LocalStorage from '../../../../../framework/utils/LocalStorage'
import services from '../../../../../framework/utils/MeshService'
import * as ActoinTypes from '../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'
import {connect} from 'react-redux'
import {findIndex, uniqBy} from 'lodash'
import UploadImage from './UploadImage'
const Dragger = Upload.Dragger;

class Workstation extends Component {
  state = {
	loading: false,
	responseList: [],
	imageList:[],
	module: false,
	imgUrl: config.apiMeshRoot + config.appCode + "/nodes/",
	content: "",
	uuid: '',
	active: false,
  };
  
  constructor(props) {
	super(props);
	this._receiveHtml = this._receiveHtml.bind(this);
	this._onChange = this._onChange.bind(this);
	this._beforeUpload = this._beforeUpload.bind(this);
	this._getMessage = this._getMessage.bind(this);
	this._handleChange = this._handleChange.bind(this);
	this._handleSubmit = this._handleSubmit.bind(this);
	this._preview = this._preview.bind(this);
	this._onRemove = this._onRemove.bind(this);
	this._publishNode = this._publishNode.bind(this);
	this._uploadImg = this._uploadImg.bind(this);
	this._onRemoveImage = this._onRemoveImage.bind(this);
  }
  
  componentDidMount() {
	this._getMessage();
  }
  
  _receiveHtml(content) {
	let {WorkstationState} = this.props;
	let detail = WorkstationState.detail;
	let {dispatch} = this.props
	detail.content = content;
	dispatch(createAction(ActoinTypes.ACT_STATION_CHANGE_DETAIL_SCHEMA, (model) => model)(detail))
  }
  
  
  _onRemove(file) {
	this.setState(() => {
	  let fileList = this.state.responseList;
	  const index = fileList.indexOf(file);
	  const newFileList = fileList.slice();
	  newFileList.splice(index, 1);
	  return {
		responseList: newFileList,
	  };
	});
  }
  _onRemoveImage(){
	this.setState({
	imageList:[],
	  file:null,
	});
  }
  _onChange(info) {
	let currFileList = info.fileList;
	currFileList = currFileList.filter((f) => (!f.length));
	currFileList = currFileList.map((file) => {
	  if (file.response) {
		file.url = file.response.files[0].origin;
	  }
	  if (!file.length) {
		return file;
	  }
	});
	let _this = this;
	currFileList = currFileList.filter((file) => {
	  let hasNoExistCurrFileInUploadedList = !~findIndex(_this.state.responseList, item => item.name === file.name)
	  if (hasNoExistCurrFileInUploadedList) {
		if (!!_this.props.isMultiple == true) {
		  _this.state.responseList.push(file);
		} else {
		  _this.state.responseList = [file];
		}
	  }
	  return !!file.response || (!!file.url && file.status === "done") || file.status === "uploading";
	});
	currFileList = uniqBy(currFileList, "name");
	if (!!currFileList && currFileList.length != 0) {
	  this.setState({responseList: currFileList});
	} else {
	  this.setState({responseList: []})
	}
	_this.forceUpdate();
  }
  
  
  _handleSubmit() {
	this.setState({
	  loading: true
	})
	if(this.state.imageList.length===0){
	  this.setState({
		loading: false
	  })
	return  message.error("请选择背景图片")
	}
	let {dispatch} = this.props
	let {WorkstationState} = this.props;
	let detail = WorkstationState.detail;
	let data = {fields: {content: detail.content}, version: WorkstationState.version, language: config.language}
	services.createServiceRequest.meshService(config.meshApi.nodes + '/' + this.state.uuid, data,
		(success) => {
		  dispatch(createAction(ActoinTypes.ACT_STATION_GET_DETAIL_SCHEMA, (model) => model)(success))
		  if(this.state.file)
		  {
		    this._uploadImg()
		  }else {
			this._publishNode();
		  }
		}, (failed) => {
		  message.error(failed);
		})
  }
  
  _publishNode() {
	let url = config.meshApi.nodes + '/' + this.state.uuid + config.meshApi.languages + '/' + config.language + config.meshApi.published
	services.createServiceRequest.meshService(url, {}, (success) => {
	  this.setState({
		loading: false
	  })
	  message.success("上传成功")
	}, (failed) => {
	  message.error(failed);
	})
  }
  
  _uploadImg() {
	let {dispatch} = this.props
	let {WorkstationState} = this.props;
	let version = WorkstationState.version;
	let data = {
	  version:version ,
	  file  : this.state.file
	};
	services.createServiceRequest.meshImageService(config.meshApi.nodes + '/' + this.state.uuid + config.meshApi.binary + config.meshApi.background, data,
		(success) => {
		  dispatch(createAction(ActoinTypes.ACT_STATION_GET_DETAIL_SCHEMA, (model) => model)(success))
		  this._publishNode()
		}, (failed) => {
		  message.error(failed);
		})
  }
  _getMessage() {
	let {dispatch} = this.props
	this.setState({active: true})
	services.createServiceRequest.meshGetService(config.meshApi.webroot + config.meshApi.workstation, {}, (success) => {
	
	  dispatch(createAction(ActoinTypes.ACT_STATION_GET_DETAIL_SCHEMA, (model) => model)(success))
	  if(success.fields.background){
	  this.setState({
		imgUrl: config.apiMeshRoot + config.appCode + "/nodes/" + success.uuid + "/binary/background?version=published",
		uuid: success.uuid,
		active: false,
		imageList:[{
		  uid: -1,
		  name: 'xxx.png',
		  status: 'done',
		  url:config.apiMeshRoot + config.appCode + "/nodes/" + success.uuid + "/binary/background?version=published"
		}]
	  })
	  }else{
		this.setState({
		  imgUrl: config.apiMeshRoot + config.appCode + "/nodes/" + success.uuid + "/binary/background?version=published",
		  uuid: success.uuid,
		  active: false,
		  imageList:[]
		})
	  }
	}, (failed) => {
	  message.error(failed);
	})
  }
  _handleChange = (info) => {
	if (info.file.status === 'done') {
	  message.success('图片已上传');
	  this._publishNode();
	  let res= info.file.response
	  this.props.dispatch(createAction(ActoinTypes.ACT_STATION_GET_DETAIL_SCHEMA, (model) => model)(res))
	  this.setState({
		imgUrl: config.apiMeshRoot + config.appCode + "/nodes/" + res.uuid + "/binary/background?version=published",
		uuid: res.uuid,
		active: false,
	  })
	  console.log(res)
	}
  }
  
  _beforeUpload(file) {
	const isType = config.keys.image_type.some((val) => {
	  return file.type === 'image/' + val
	})
	if (!isType) {
	  message.error(`你只能上传${config.keys.image_type.join('、')}文件!`);
	  return false;
	}
	const isLt2M = file.size / 1024 / 1024 < config.keys.image_size;
	if (!isLt2M) {
	  message.error(`图片大小不能超过${config.keys.image_size}M`);
	  return false;
	}
	const reader = new FileReader();
	reader.addEventListener('load', () => { file.status="done";file.uid=-1;file.url=reader.result;this.setState({image: reader.result, file: file,imageList:[file]})});
	reader.readAsDataURL(file);
	return false
  }
  
  _preview() {
	this.setState({modal: true})
  }
  
  
  render() {
	let {WorkstationState} = this.props;
	let detail = WorkstationState.detail;
	let version = WorkstationState.version;
	const uploadProps = {
	  action: config.apiResourceRoot,
	  onChange: this._onChange,
	  listType: 'picture',
	  fileList: this.state.responseList,
	  multiple: true,
	  showUploadList: true,
	  beforeUpload: (file, fileList) => {
	  },
	  onRemove: this._onRemove,
	}
	const uploadProps_mesh = {
	  action: `${config.apiMeshRoot + config.appCode }${config.meshApi.nodes}/${this.state.uuid }${config.meshApi.binary + config.meshApi.background}`,
	  name: "avatar",
	  headers: {
		'Accept': 'application/json',
		"authorization": "Bearer " + LocalStorage.get(config.keys.mesh_token)
	  },
	  showUploadList: false,
	  data: {
		"language": "en",
		"version": version,
	  },
	  beforeUpload: this._beforeUpload,
	  onChange: this._handleChange,
	}
	let imageFileList = this.state.imageList
	
	return (<div>
	  <Spin spinning={this.state.active}>
	  <Modal
		  visible={this.state.modal}
		  width="332px"
		  onCancel={() => {
			this.setState({modal: false});
		  }
		  }
		  footer={null}>
		<div>
		  <img src={this.state.image||this.state.imgUrl} style={{width: "300px", height: "533px"}} alt=""/>
		  <div style={{position: "absolute", bottom: "20px", width: "300px"}}
			   dangerouslySetInnerHTML={{__html: detail.content}}/>
		</div>
	  </Modal>
	  <Form className="content">
		<div style={{marginBottom: 16}}>
		  <span className="title">背景图片</span>
		  <UploadImage
			  beforeUpload={this._beforeUpload}
			  size={1}
			  fileList={this.state.imageList}
			  onRemove={this._onRemoveImage}
		  />
		</div>
		<span className="title">设计师工作站介绍</span>
		<LzEditor
			active={this.state.active}
			importContent={detail.content || ""}
			cbReceiver={this._receiveHtml}
			uploadProps={uploadProps}
			video={false}
			audio={false}
			image={false}
		/>
		
		<Button loading={this.state.loading} className='yellowButton' onClick={this._handleSubmit}
				style={{float: "right", height: '34px', width: '112px'}}>
                <span className='fontBox'>
                 确认上传
                </span>
		</Button>
		<Button className='yellowButton' ghost onClick={this._preview}
				style={{float: "right", color: "#000", height: '34px', width: '112px'}}>
                <span className='fontBox'>
                 预览
                </span>
		</Button>
	  </Form>
	  </Spin>
	</div>)
  }
}

function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

function mapStateToProps(state) {
  return {
	WorkstationState: state.WorkstationState
  }
}

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps
)(Workstation);