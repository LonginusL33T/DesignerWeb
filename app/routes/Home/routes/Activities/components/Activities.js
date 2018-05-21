import React from "react"
import {Layout, Row, Spin, message} from 'antd'
import ActivityList from './ActivityList'
import Advert from './Advert'
import UploadImage from './UploadImage'
import config from '../../../../../framework/config/config'
import services from '../../../../../framework/utils/MeshService'
import constants from '../../../../../framework/config/constants'
import LocalStorage from '../../../../../framework/utils/LocalStorage'

var request = require('superagent');
var Q = require('q');
const {Content, Sider} = Layout;


class index extends React.Component {
  state = {
	loading:false
  }
  
  constructor(props) {
	super(props);
	this._getAdvert = this._getAdvert.bind(this);
	this._beforeUpload = this._beforeUpload.bind(this);
	this._onRemoveImage = this._onRemoveImage.bind(this);
	this._handleChange = this._handleChange.bind(this);
	this._publishNode = this._publishNode.bind(this);
  }
  
  componentDidMount() {
	this._getAdvert()
  }
  
  _getAdvert() {
	this.setState({loading: true})
	let data = {
	  "filter": {
		"bool": {
		  "must": [{
			"match_phrase": {
			  "schema.name": constants.schemas.Advert
			}
		  }]
		}
	  },
	  "sort": [{"created": "desc"}]
	}
	services.createServiceRequest.getService(config.api.WebGetAdvertisement, {},
		(success) => {
		  if (success.advert.source) {
			this.setState({
			  loading: false,
			  fileList: [{
				uid: -1,
				name: 'xxx.png',
				status: 'done',
				url: success.advert.source
			  }]
			})
		  } else {
			this.setState({
			  loading: false,
			  fileList: []
			})
		  }
		}, (failed) => {
		  message.error(failed)
		}
	)
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
	
  }
  
  _publishNode() {
	let url = config.meshApi.nodes + '/' + this.state.uuid + config.meshApi.languages + '/' + config.language + config.meshApi.published
	services.createServiceRequest.meshService(url, {}, (success) => {
	  message.success("广告已上传")
	}, (failed) => {
	  message.error(failed);
	})
  }
  
  _handleChange({fileList, file}) {
	this.setState({fileList})
	if (file.status === 'done') {
	  
	  let data = {
	    source:file.response.files[0].token,
		name:file.response.files[0].name
	  }
	  services.createServiceRequest.Service(config.api.WebCreateAdvertisement,data, (success) => {
		message.success("广告已上传")
	  }, (failed) => {
		message.error(failed);
	  })
	}
  }
  
  _onRemoveImage() {
	this.setState({
	  fileList: [],
	});
  }
  
  render() {
	const action = config.apiResourceRoot;
	return (
		<div>
		  <Row className="content">
			{this.props.children ||
			<div>
			  <Row>
				<span style={{fontSize: '16px', color: '#4e4e4e'}}>广告位图片</span>
				<br/>
				<UploadImage
					action={action}
					loading={this.state.loading}
					size={1}
					beforeUpload={this._beforeUpload}
					fileList={this.state.fileList || []}
					onRemove={this._onRemoveImage}
					handleChange={this._handleChange}
				/>
			  </Row>
			  < Row> < ActivityList/> </ Row>
			</div>
			}
		  </Row>
		</div>
	)
  }
}

module.exports = index;