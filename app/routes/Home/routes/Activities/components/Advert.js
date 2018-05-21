import React from 'react'
import {Form, Upload, Icon, Col, message} from 'antd'
import config from '../../../../../framework/config/config'
import constants from '../../../../../framework/config/constants'
import LocalStorage from '../../../../../framework/utils/LocalStorage'

var request = require('superagent');
var Q = require('q');

const Dragger = Upload.Dragger;

export default class Advert extends React.Component {
  state = {
	loading: false,
	ImageVersion: 0.1,
	responseList: [],
	uuid: ''
  };
  
  constructor(props) {
	super(props);
	this._onChange = this._onChange.bind(this);
	this._beforeUpload = this._beforeUpload.bind(this);
  }
  
  _onChange(info) {
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
	
	var deferred = Q.defer();
	let url = config.apiMeshRoot + config.appCode
	let token = LocalStorage.get(config.keys.mesh_token);
	let params = {"Authorization": "Bearer " + token};
	request
		.get(url + config.meshApi.webroot + config.meshApi.image)
		.type('application/json;charset=utf8')
		.accept('application/json')
		.set(params)
		.timeout(20000)
		.end( (err, res)=>{
		  if (res && res.ok) {
			
			let data = {
			  "parentNode": {
				"uuid": res.body.uuid
			  },
			  "schema": {
				"name": constants.schemas.Advert,
			  },
			  "language": config.language,
			  "fields": {name:'advert'}
			}
			request
				.post(url + config.meshApi.nodes)
				.send(data)
				.set(params)
				.type('application/json;charset=utf8')
				.accept('application/json')
				.timeout(20000)
				.end( (err, res)=>{
				  if (res && res.ok) {
					deferred.resolve(res.body);
				  } else {
					deferred.reject(err);
				  }
				});
		  } else {
			deferred.reject(err);
		  }
		})
	return deferred.promise.then((response)=>{
	  this.setState({
		uuid:response.uuid
	  })
	}).catch((err)=>{
	  message.error('广告上传失败');
	});
  }
  
  _handleChange = (info) => {
	if (info.file.status === 'done') {
	  message.success('广告已上传');
	}
  }
  
  render() {
	const uploadProps = {
	  name: "avatar",
	  headers: {
		'Accept': 'application/json',
		"authorization": "Bearer " + LocalStorage.get(config.keys.mesh_token)
	  },
	  showUploadList: false,
	  data: {
		"language": "en",
		"version": this.state.ImageVersion,
	  },
	  //demo 是一个项目
	  action: config.apiMeshRoot + config.appCode + config.meshApi.nodes + '/' + this.state.uuid + config.meshApi.binary + config.meshApi.imge,
	  beforeUpload: this._beforeUpload,
	  onChange: this._handleChange
	}
	return (
		<Col span={6}>
		  <span style={{fontSize: '16px', color: '#4e4e4e'}}>广告位图片</span>
		  <div style={{height: 120, marginTop: '10px', width: '50vw'}}>
			<Dragger {...uploadProps}>
			  <p className="ant-upload-drag-icon">
				<Icon type="inbox"/>
			  </p>
			  <p className="ant-upload-text">拖拽文件或点击这里选择文件进行上传</p>
			</Dragger>
		  </div>
		</Col>
	)
  }
}