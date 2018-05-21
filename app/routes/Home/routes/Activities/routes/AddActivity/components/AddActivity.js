import React from "react"
import {Form, Input, Icon, Upload, Button, Row, Col, message} from "antd"
import services from '../../../../../../../framework/utils/MeshService'
import LocalStorage from '../../../../../../../framework/utils/LocalStorage'
import config from '../../../../../../../framework/config/config'
import constants from '../../../../../../../framework/config/constants'
import LzEditor from 'react-lz-editor'
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
}

class AddActivity extends React.Component {
  state = {
	loading: false,
	ImageVersion: 0.1,
	content: "<p ><br></p>",
	responseList: [],
	active:false
  };
  
  constructor(props) {
	super(props);
	this._beforeUpload = this._beforeUpload.bind(this);
	this._handleSubmit = this._handleSubmit.bind(this);
	this._handleChange = this._handleChange.bind(this);
	this._receiveHtml = this._receiveHtml.bind(this);
	this._onChange = this._onChange.bind(this);
	this._createNode = this._createNode.bind(this);
	this._uploadImg = this._uploadImg.bind(this);
	this._publishNode = this._publishNode.bind(this);
	this._onRemove = this._onRemove.bind(this);
  }
  
  componentDidMount() {
	this.props.form.validateFields();
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
  _handleChange = (info) => {
	if (info.file.status === 'done') {
	  // Get this url from response in real world.
	  getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl}));
	}
  }
  
  _handleSubmit(e) {
	e.preventDefault();
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  if (!err) {
		var data = {
		  "parentNode": {
			"uuid": "9570737840b5423db0737840b5723dc1"
		  },
		  "schema": {
			"name": constants.schemas.activities,
		  },
		  "language": config.language,
		  "fields": values
		}
		data.fields.content = this.state.content;
		services.createServiceRequest.meshGetService(config.meshApi.webroot +config.meshApi.activity,{},(success)=>{
		  data.parentNode.uuid=success.uuid;
		  this._createNode(data);
		},(failed) => {
		  message.error(failed);
		} );
		
	  }
	})
  }
  
  _createNode(data) {
	services.createServiceRequest.meshService(config.meshApi.nodes, data, (success) => {
	  this._uploadImg(success.uuid)
	}, (failed) => {
	  this.setState({loading: false});
	  message.error(failed);
	})
  }
  
  _publishNode(uuid) {
	let url = config.meshApi.nodes + '/' + uuid + config.meshApi.languages + '/' + config.language + config.meshApi.published
	services.createServiceRequest.meshService(url, {}, (success) => {
	  message.success('保存成功')
	  this.setState({loading: false});
	  this.props.router.goBack();
	}, (failed) => {
	  this.setState({loading: false});
	  message.error(failed);
	})
  }
  _uploadImg(uuid) {
	let data = {
	  version: 0.1,
	  file: this.state.file
	};
	services.createServiceRequest.meshImageService(config.meshApi.nodes + '/' + uuid + config.meshApi.binary + config.meshApi.imge, data,
		(success) => {
		  this._publishNode(uuid)
		}, (failed) => {
		  message.error(failed);
		})
  }
  
  _beforeUpload(file) {
	const isType = config.keys.image_type.some((val)=>{
	  return file.type==='image/'+val
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
	reader.addEventListener('load', () => this.setState({imageUrl: reader.result, file: file}));
	reader.readAsDataURL(file);
	
	return false
  }
  
  _receiveHtml(content) {
	this.setState({
	  "content": content,
	  responseList:[]
	})
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
	const uploadProps2 = {
	  name: "avatar",
	  headers: {
		'Accept': 'application/json',
		"authorization": "Bearer " + LocalStorage.get(config.keys.mesh_token)
	  },
	  multiple:false,
	  showUploadList: false,
	  data: {
		"language": "en",
		"version": this.state.ImageVersion,
	  },
	action: `${config.apiRoot + config.api.project}/${config.api.nodes}/${ this.state.ImageUuid}/${config.api.image}`,
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
				}}
				   style={{fontSize: "16px", color: "#c98f10", textDecoration: "underline"}}>
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
				  <Upload    {...uploadProps2} className="avatar-uploader"
				  >
					{
					  imageUrl ?
						  <img src={imageUrl} alt="" className="avatar"/> :
						  <Icon type="plus" className="avatar-uploader-trigger"
								style={{verticalAlign: "middle", display: "table-cell"}}/>
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
					<Input placeholder="无字数限制"/>
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
					<TextArIea placeholder="无字数限制" rows="5"/>
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
					importContent={""}
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
				  htmlType="submit"
				  type="primary"
				  disabled={(hasErrors(getFieldsError()) || (this.state.content === "<p ><br></p>")) || !this.state.file}
				  onClick={this._handleSubmit}
				  loading={this.state.loading}
				  style={{height: '34px', width: '100px', fontSize: '16px'}}
			  >发布</Button>
			</Col>
		  </Row>
		</Form>
	
	)
  }
}

module.exports = Form.create()(AddActivity)