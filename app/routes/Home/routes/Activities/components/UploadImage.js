import React, {Component} from 'react'
import {Upload,Icon,Modal,Spin} from 'antd'
import '../resource/UploadImage.css'
import LocalStorage from '../../../../../framework/utils/LocalStorage'
import config from '../../../../../framework/config/config'
import constants from '../../../../../framework/config/constants'
var request = require('superagent');
var Q = require('q');
class UploadImage extends Component{
  state = {
	previewVisible: false,
	previewImage: '',
	fileList: [],
  };
  constructor(props) {
    super(props);
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
	this.setState({
	  previewImage: file.url || file.thumbUrl,
	  previewVisible: true,
	});
  }
  handleChange = ({ fileList }) => this.setState({ fileList })
  _beforeUpload=(file)=>{
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
  render(){
	const { previewVisible, previewImage } = this.state;
	let {fileList,beforeUpload,onRemove,action,handleChange} = this.props;
	const uploadButton = (
		<div>
		  <Icon type="plus" />
		  <div className="ant-upload-text">Upload</div>
		</div>
	);
	const size = this.props.size;
	
    return(
		<div className="clearfix" style={{display:"inline-block"}}>
		  <Spin spinning={this.props.loading}>
		  <Upload
			  beforeUpload={beforeUpload||this._beforeUpload}
			  action={action||""}
			  multiple={this.props.multiple||false}
			  listType="picture-card"
			  fileList={fileList||this.state.fileList}
			  onPreview={this.handlePreview}
			  onChange={handleChange||this.handleChange}
			  onRemove={onRemove}
			  disabled={this.props.loading||false}
		  >
			{fileList.length >= size ? null : uploadButton}
		  </Upload>
		  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
			<img alt="example" style={{ width: '100%' }} src={previewImage} />
		  </Modal>
		  </Spin>
		</div>
	)
  }
  }

module.exports = UploadImage;