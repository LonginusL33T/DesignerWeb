import React, {Component} from 'react'
import {Upload,Icon,Modal} from 'antd'
import '../resource/UploadImage.css'
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
  
  render(){
	const { previewVisible, previewImage } = this.state;
	let {fileList,beforeUpload,onRemove} = this.props;
	const uploadButton = (
		<div>
		  <Icon type="plus" />
		  <div className="ant-upload-text">Upload</div>
		</div>
	);
	const size = this.props.size;
    return(
		<div className="clearfix">
		  <Upload
			  beforeUpload={beforeUpload}
			  action=""
			  listType="picture-card"
			  fileList={fileList}
			  onPreview={this.handlePreview}
			  onChange={this.handleChange}
			  onRemove={onRemove}
			  disabled={this.props.loading||false}
		  >
			{fileList.length >= size ? null : uploadButton}
		  </Upload>
		  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
			<img alt="example" style={{ width: '100%' }} src={previewImage} />
		  </Modal>
		</div>
	)
  }
  }

module.exports = UploadImage;