import React from "react"
import {Form, Input, Icon, Upload, Button, Row, Col, message} from "antd"
import services from '../../../../../../../framework/utils/MeshService'
import LocalStorage from '../../../../../../../framework/utils/LocalStorage'
import config from '../../../../../../../framework/config/config'
import LzEditor from 'react-lz-editor'
import {connect} from 'react-redux'
import * as ActoinTypes from '../../../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'
import {Link} from 'react-router'
import {findIndex, uniqBy} from 'lodash'

const FormItem = Form.Item;
const TextArIea = Input.TextArea;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
  message.success("图片已修改")
}


class AddActivity extends React.Component {
  state = {
	loading: false,
	isPublishing: false,
	isChanged: false,
	isPublished: true,
	responseList: [],
	active: false
  };
  
  constructor(props) {
	super(props);
	this._beforeUpload = this._beforeUpload.bind(this);
	this._handleSubmit = this._handleSubmit.bind(this);
	this._handleChange = this._handleChange.bind(this);
	this._handlePublish = this._handlePublish.bind(this);
	this._onChange = this._onChange.bind(this);
	this._receiveHtml = this._receiveHtml.bind(this);
	this._handleChanges = this._handleChanges.bind(this);
	
	this._getNode = this._getNode.bind(this);
	this._saveNode = this._saveNode.bind(this);
	this._publishNode = this._publishNode.bind(this);
	this._getVersion = this._getVersion.bind(this);
	this._uploadImg = this._uploadImg.bind(this);
	this._onRemove = this._onRemove.bind(this);
  }
  
  componentDidMount() {
	this._getNode();
  }
  
  _uploadImg(cb) {
	let data = {
	  version: this.props.UpdateNodeState.data.version,
	  file: this.state.file
	};
	services.createServiceRequest.meshImageService(config.meshApi.nodes + '/' + this.props.location.state.node + config.meshApi.binary + config.meshApi.imge, data,
		(success) => {
		  this.props.dispatch(createAction(ActoinTypes.ACT_ACTIVITY_GET_VERSION_SCHEMAS, (model) => model)(success.version))
		  if (cb)
			cb()
		}, (failed) => {
		  message.error(failed);
		})
  }
  
  _getNode() {
	this.setState({active: true})
	services.createServiceRequest.meshGetService(config.meshApi.nodes + '/' + this.props.location.state.node, {},
		(success) => {
		  this.props.dispatch(createAction(ActoinTypes.ACT_ACTIVITY_GET_NODE_SCHEMAS, (model) => model)(success))
		  this.props.form.setFieldsValue(
			  {
				title: success.fields.title,
				brief: success.fields.brief
			  });
		  this.setState({
			isPublished: success.version % 1 === 0,
			active: false
		  });
		  this.props.form.validateFields();
		}, (failed) => {
		  message.error(failed);
		})
  }
  
  _saveNode(data, cb) {
	return services.createServiceRequest.meshService(config.meshApi.nodes + '/' + this.props.location.state.node, data,
		(success) => {
		  this.props.dispatch(createAction(ActoinTypes.ACT_ACTIVITY_GET_NODE_SCHEMAS, (model) => model)(success))
		  this.setState({
			loading: false,
			isChanged: false
		  })
		  if (cb)
			cb();
		 
		}, (failed) => {
		  this.setState({
			loading: false,
		  })
		  message.error(failed);
		})
  }
  
  _publishNode() {
	let url = config.meshApi.nodes + '/' + this.props.location.state.node + config.meshApi.languages + '/' + config.language + config.meshApi.published
	services.createServiceRequest.meshService(url, {}, (success) => {
	  this.props.dispatch(createAction(ActoinTypes.ACT_ACTIVITY_GET_VERSION_SCHEMAS, (model) => model)(success.version))
	  this.setState({
		isPublishing: false,
		isPublished: true
	  });
	  message.success('活动已发布')
	}, (failed) => {
	  this.setState({isPublishing: false});
	  message.error(failed);
	})
  }
  
  _getVersion(cb) {
	services.createServiceRequest.meshGetService(config.meshApi.nodes + '/' + this.props.location.state.node, {},
		(success) => {
		  this.props.dispatch(createAction(ActoinTypes.ACT_ACTIVITY_GET_VERSION_SCHEMAS, (model) => model)(success.version))
		  if (cb)
			cb()
		}, (failed) => {
		  message.error(failed);
		})
  }
  
  _handleChange = (info) => {
	if (info.file.status === 'done') {
	  this._getVersion();
	  this.setState({
		isPublished: false
	  });
	  getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl}));
	}
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
  
  _handleSubmit(e) {
	e.preventDefault();
	this.setState({loading: true});
	let {data} = this.props.UpdateNodeState;
	let fields = data.fields || {}
	this.props.form.validateFields((err, values) => {
	  if (!err) {
		
		var postdata = {
		  "language": config.language,
		  "version": 2.16,
		  "fields": values
		}
		postdata.fields.content = fields.content;
		postdata.version = data.version
		this._saveNode(postdata, () => {
		  
		  if (this.state.imageUrl)
			this._uploadImg(() => {
			  message.success('活动已保存');
			})
		  else
			message.success('活动已保存');
		});
	  }
	})
  }
  
  _handlePublish(e) {
	e.preventDefault();
	this.setState({isPublishing: true});
	let {data} = this.props.UpdateNodeState;
	let fields = data.fields || {}
	this.props.form.validateFields((err, values) => {
	  if (!err) {
		var postdata = {
		  "language": config.language,
		  "version": 2.16,
		  "fields": values
		}
		postdata.fields.content = fields.content;
		postdata.version = data.version;
		this._saveNode(postdata, () => {
		  if (this.state.imageUrl)
			this._uploadImg(this._publishNode);
		  else
			this._publishNode();
		})
	  }
	});
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
	reader.addEventListener('load', () => this.setState({
	  imageUrl: reader.result,
	  file: file,
	  isChanged: true,
	  isPublished: false
	}));
	reader.readAsDataURL(file);
	return false
  }
  
  _receiveHtml(content) {
	let {data} = this.props.UpdateNodeState;
	let fields = data.fields || {}
	if (fields.content !== content) {
	  this.setState({
		isChanged: true,
		isPublished: false,
		responseList:[]
	  })
	  this.props.dispatch(createAction(ActoinTypes.ACT_ACTIVITY_CHANGE_NODE_SCHEMAS, (model) => model)(content))
	}
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
  
  _handleChanges() {
	this.setState({
	  isChanged: true,
	  isPublished: false
	})
  }
  
  render() {
	const uploadProps = {
	  action: config.apiResourceRoot,
	  onChange: this._onChange,
	  listType: 'picture',
	  fileList: this.state.responseList,
	  multiple: true,
	  showUploadList: true,
	  beforeUpload: (file, fileList) => {
		if(config.keys.edit_image_size) {
		  const isLt2M = file.size / 1024 / 1024 < config.keys.edit_image_size;
		  if (!isLt2M) {
			message.error(`图片大小不能超过${config.keys.edit_image_size}M`);
			return false;
		  }
		}
	  },
	  onRemove: this._onRemove,
	}
	const imageUrl = this.state.imageUrl;
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	let {data} = this.props.UpdateNodeState;
	let fields = data.fields || {}
	const uploadProps2 = {
	  name: "avatar",
	  headers: {
		'Accept': 'application/json',
		"authorization": "Bearer " + LocalStorage.get(config.keys.mesh_token)
	  },
	  showUploadList: false,
	  data: {
		"language": "en",
		"version": data.version,
	  },
	  action: config.apiMeshRoot + config.appCode + config.meshApi.nodes + '/' + data.uuid + config.meshApi.binary + config.meshApi.imge,
	  beforeUpload: this._beforeUpload,
	  onChange: this._handleChange
	}
	return (
		<Form style={{background: "#ffffff"}}>
		  
		  <Row>
			<Col span={6}>
			  <FormItem>
				<div style={{fontSize: "16px", marginTop: '48px'}}>
				  新增活动
				</div>
			  </FormItem>
			</Col>
			<Col span={1} offset={14}>
			  <div style={{marginTop: '48px'}}>
				<a onClick={() => {
				  this.props.router.goBack()
				}} style={{fontSize: "16px", color: "#c98f10", textDecoration: "underline"}}>
				  返回
				</a>
			  </div>
			</Col>
		  </Row>
		  <Row>
			<Col span={1}> 头图:
			</Col>
			<Col>
			  <FormItem>
				<div style={{display: "inline-block"}}>
				  <Upload {...uploadProps2} className="avatar-uploader"
				  >
					{
					  imageUrl ?
						  <img src={imageUrl} alt="" className="avatar"/> : (
							  fields.imge ? <img
									  src={config.apiMeshRoot + config.appCode + config.meshApi.nodes + '/' + data.uuid + config.meshApi.binary + config.meshApi.imge}
									  alt="" className="avatar"/> :
								  <Icon type="plus" className="avatar-uploader-trigger"
										style={{verticalAlign: "middle", display: "table-cell"}}/>)
					}
				  </Upload>
				</div>
			  </FormItem>
			</Col>
		  </Row>
		  
		  <Row>
			<Col span={1}> 标题:
			</Col>
			<Col span={20}>
			  <FormItem>
				{getFieldDecorator('title', {
				  rules: [{required: true, message: '请输入标题!'}],
				})(
					<Input placeholder="无字数限制" onChange={this._handleChanges}/>
				)}
			  </FormItem>
			</Col>
		  </Row>
		  
		  <Row>
			<Col span={1}> 简介:
			</Col>
			<Col span={20}>
			  <FormItem>
				{getFieldDecorator('brief', {
				  rules: [{required: true, message: '请输入简介!'}],
				  
				})(
					<TextArIea placeholder="无字数限制" rows="5" onChange={this._handleChanges}/>
				)}
			  </FormItem>
			</Col>
		  </Row>
		  
		  <Row>
			<Col span={1}> 正文:
			</Col>
			<Col span={20}>
			  <FormItem>
				
				<LzEditor
					active={this.state.active}
					importContent={fields.content}
					cbReceiver={this._receiveHtml}
					uploadProps={uploadProps}
					video={false}
					audio={false}
				/>
			  </FormItem>
			</Col>
		  </Row>
		  <Row>
			<Col span={2} offset={1}>
			  <Button
				  type="primary"
				  htmlType="submit"
				  disabled={(hasErrors(getFieldsError()) || (this.state.content === "<p ><br></p>") || !this.state.isChanged)}
				  onClick={this._handleSubmit}
				  loading={this.state.loading}
				  style={{height: '34px', width: '100px', fontSize: '16px'}}
			  >保存</Button>
			</Col>
			<Col span={2} offset={1}>
			  <Button
				  type="primary"
				  disabled={(hasErrors(getFieldsError()) || (this.state.content === "<p ><br></p>") || this.state.isPublished)}
				  onClick={this._handlePublish}
				  loading={this.state.isPublishing}
				  style={{height: '34px', minWidth: '100px', fontSize: '16px'}}
			  >{this.state.isChanged ? "保存并发布" : "发布"}</Button>
			</Col>
		  </Row>
		</Form>
	)
  }
}

function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

function mapStateToProps(state) {
  return {
	UpdateNodeState: state.UpdateNodeState
  }
}

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(AddActivity));
