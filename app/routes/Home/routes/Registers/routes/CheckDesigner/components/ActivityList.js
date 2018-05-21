import React from "react"
import {Input, Form, Button, message, Row, Upload, Icon, Modal, Col} from 'antd';
import style from '../resource/login.css'
import {Link} from 'react-router'
import services from '../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'
import config from '../../../../../../../framework/config/config'
import LzEditor from 'react-lz-editor'
import {connect} from 'react-redux'
import {findIndex, uniqBy} from 'lodash'
import UploadImage from './UploadImage'

const FormItem = Form.Item;
const {TextArea} = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class ActivityList extends React.Component {
  state = {
	userFileList: [],
	brandFileList: [],
	loading: false,
	active: false,
	fileList: []
  };
  
  constructor() {
	super();
	this._handleSubmit = this._handleSubmit.bind(this);
	this._onChangeUser = this._onChangeUser.bind(this);
	this._onChangeBrand = this._onChangeBrand.bind(this);
	this._DesignerReceiveHtml = this._DesignerReceiveHtml.bind(this);
	this._brandReceiveHtml = this._brandReceiveHtml.bind(this);
	this._getDetail = this._getDetail.bind(this);
	this._onRemoveUser = this._onRemoveUser.bind(this);
	this._onRemoveBrand = this._onRemoveBrand.bind(this);
	this._onRemove = this._onRemove.bind(this);
	this._onChange = this._onChange.bind(this);
  }
  
  componentDidMount() {
	let {uploaded} = this.props.location.state
	
	if (uploaded) {
	  this._getDetail();
	}else {
	
	}
	this.props.form.validateFields()
  }
  componentWillUnmount(){
	let {dispatch} = this.props
	dispatch(createAction(ActionTypes.ACT_DESIGNER_GET_DETAIL_SCHEMA, (model) => model)(
		{
		  fields:
			  {
				name: '',
				user_introduction: '<p ><br></p>',
				brand_introduction: '<p ><br></p>',
				user_background: ""
			  },
		  version: 0.1
		}
	))
  }
  _getDetail() {
	let {dispatch} = this.props
	let uniqueid = this.props.location.state.uniqueid;
	let CheckDesignerState = this.props.CheckDesignerState;
	let user = CheckDesignerState.user;
	let {setFieldsValue, validateFields} = this.props.form;
	this.setState({active: true})
	if(this.props.onChange)
	{
	  this.props.onChange(true)
	}
	services.createServiceRequest.meshGetService(config.meshApi.nodes + "/" + uniqueid, {}, (success) => {
	  setFieldsValue({'name': success.fields.name});
	  dispatch(createAction(ActionTypes.ACT_DESIGNER_GET_DETAIL_SCHEMA, (model) => model)(success))
	  validateFields()
	  if (success.fields.user_background) {
		this.setState({
		  active: false,
		  fileList:[
			{
			  uid: -1,
			  name: 'xxx.png',
			  status: 'done',
			  url: success.fields.user_background
			}
		  ]
		})
		if(this.props.onChange)
		{
		  this.props.onChange(false)
		}
	  } else {
		this.setState({active: false})
	  }
	}, (failed) => {
	  message.error(failed)
	})
  }
  
  _handleSubmit() {
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  if (!err) {
		let CheckDesignerState = this.props.CheckDesignerState;
		let user = CheckDesignerState.user;
		let data = {
		  ...values,
		  uniqueid: this.props.location.state.uniqueid,
		  user_introduction: user.user_introduction,
		  brand_introduction: user.brand_introduction,
		  user_background: user.user_background
		}
		let {dispatch} = this.props;
		let {router} = this.props;
		let {uniqueid, nature, check, page} = this.props.location.state;
		let data2 = {}
		if (nature)
		  data2.category = nature
		if (check)
		  data2.status = check
		services.createServiceRequest.Service(config.api.WebUploadUserInfo, data, (success) => {
		  services.createServiceRequest.Service(config.api.WebVerifyRegistion, data2, (success) => {
			dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS, (model) => model)(success))
			message.success('上传成功');
			this.setState({loading: false});
			router.push('/home/registers/');
		  }, (failed) => {
			message.error(failed)
			this.setState({loading: false});
		  }, page - 1 || 0, 10)
		}, (failed) => {
		  message.error(failed)
		  this.setState({loading: false});
		})
		
	  }
	});
  }
  
  _DesignerReceiveHtml(content) {
	let {dispatch} = this.props
	dispatch(createAction(ActionTypes.ACT_DESIGNER_CHANGE_USER_SCHEMA, (model) => model)(content))
	this.setState({
	  userFileList: []
	})
  }
  
  _brandReceiveHtml(content) {
	let {dispatch} = this.props
	dispatch(createAction(ActionTypes.ACT_DESIGNER_CHANGE_BRAND_SCHEMA, (model) => model)(content))
	this.setState({
	  brandFileList:[]
	})
  }
  
  _onChangeUser(info) {
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
	  let hasNoExistCurrFileInUploadedList = !~findIndex(_this.state.userFileList, item => item.name === file.name)
	  if (hasNoExistCurrFileInUploadedList) {
		if (!!_this.props.isMultiple == true) {
		  _this.state.userFileList.push(file);
		} else {
		  _this.state.userFileList = [file];
		}
	  }
	  return !!file.response || (!!file.url && file.status === "done") || file.status === "uploading";
	});
	currFileList = uniqBy(currFileList, "name");
	if (!!currFileList && currFileList.length != 0) {
	  this.setState({userFileList: currFileList});
	} else {
	  this.setState({userFileList: []})
	}
	_this.forceUpdate();
  }
  
  _onRemoveUser(file) {
	this.setState(() => {
	  let fileList = this.state.userFileList;
	  const index = fileList.indexOf(file);
	  const newFileList = fileList.slice();
	  newFileList.splice(index, 1);
	  return {
		userFileList: newFileList,
	  };
	});
  }
  
  _onChangeBrand(info) {
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
	  let hasNoExistCurrFileInUploadedList = !~findIndex(_this.state.brandFileList, item => item.name === file.name)
	  if (hasNoExistCurrFileInUploadedList) {
		if (!!_this.props.isMultiple == true) {
		  _this.state.brandFileList.push(file);
		} else {
		  _this.state.brandFileList = [file];
		}
	  }
	  return !!file.response || (!!file.url && file.status === "done") || file.status === "uploading";
	});
	currFileList = uniqBy(currFileList, "name");
	if (!!currFileList && currFileList.length != 0) {
	  this.setState({brandFileList: currFileList});
	} else {
	  this.setState({brandFileList: []})
	}
	_this.forceUpdate();
  }
  
  _onRemoveBrand(file) {
	this.setState(() => {
	  let fileList = this.state.brandFileList;
	  const index = fileList.indexOf(file);
	  const newFileList = fileList.slice();
	  newFileList.splice(index, 1);
	  return {
		brandFileList: newFileList,
	  };
	});
  }
  
  _onRemove() {
	this.setState({
	  fileList: []
	})
  }
  
  _onChange({fileList, file}) {
	this.setState({
	  fileList: fileList
	});
	if (file.status === 'done') {
	  let {dispatch} = this.props
	  dispatch(createAction(ActionTypes.ACT_DESIGNER_CHANGE_BACKGROUD_SCHEMA, (model) => model)(file.response.files[0].token))
	}
  }
  
  render() {
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	let action = config.apiResourceRoot;
	const userUploadProps = {
	  action: config.apiResourceRoot,
	  onChange: this._onChangeUser,
	  listType: 'picture',
	  fileList: this.state.userFileList,
	  multiple: true,
	  showUploadList: true,
	  onRemove: this._onRemoveUser,
	  beforeUpload: (file, fileList) => {
		if(config.keys.edit_image_size) {
		  const isLt2M = file.size / 1024 / 1024 < config.keys.edit_image_size;
		  if (!isLt2M) {
			message.error(`图片大小不能超过${config.keys.edit_image_size}M`);
			return false;
		  }
		}
	  },
	}
	const brandUploadProps = {
	  action: config.apiResourceRoot,
	  onChange: this._onChangeBrand,
	  listType: 'picture',
	  fileList: this.state.brandFileList,
	  multiple: true,
	  showUploadList: true,
	  onRemove: this._onRemoveBrand,
	  beforeUpload: (file, fileList) => {
		if(config.keys.edit_image_size) {
		  const isLt2M = file.size / 1024 / 1024 < config.keys.edit_image_size;
		  if (!isLt2M) {
			message.error(`图片大小不能超过${config.keys.edit_image_size}M`);
			return false;
		  }
		}
	  },
	}
	let CheckDesignerState = this.props.CheckDesignerState;
	let user = CheckDesignerState.user;
	return (
		
		<div>
		  <Link to="/home/registers"
				style={{float: "right", fontSize: "12px", color: "#6e95d3", textDecoration: "underline"}}>
			<p style={{textAlign: "right"}}>返回上一级</p></Link>
		  <p style={{textAlign: "center", fontSize: "18px"}}>设计师详情上传 </p>
		  
		  <Form layout="vertical" className={style.form}>
			<Row>
			  <p>姓名：</p>
			  <FormItem>
				{getFieldDecorator('name', {
				  rules: [{required: true, message: '请输入姓名'}],
				})(
					<Input className={style.input_mail}/>
				)}
			  </FormItem>
			</Row>
			<Row>
			  <p>封面：</p>
			  <FormItem>
				<UploadImage
					size={1}
					action={action}
					onRemove={this._onRemove}
					handleChange={this._onChange}
					fileList={this.state.fileList}/>
			  </FormItem>
			</Row>
			<Row>
			  <p>设计师介绍：</p>
			  <FormItem style={{display: 'inline-block'}}>
				<LzEditor
					active={this.state.active}
					importContent={user.user_introduction}
					cbReceiver={this._DesignerReceiveHtml}
					uploadProps={userUploadProps}
					video={false}
					audio={false}
				/>
			  </FormItem>
			</Row>
			<Row>
			  <p>品牌介绍：</p>
			  <FormItem style={{display: 'inline-block'}}>
				<LzEditor
					active={this.state.active}
					importContent={user.brand_introduction}
					cbReceiver={this._brandReceiveHtml}
					uploadProps={brandUploadProps}
					video={false}
					audio={false}
				/>
			  </FormItem>
			</Row>
			<Row>
			  <FormItem>
				<div className={style.form_button}>
				  <Button
					  type="primary"
					  onClick={this._handleSubmit}
					  style={{padding: "0 30px"}}
					  htmlType="submit"
					  className={style.submit}
					  disabled={hasErrors(getFieldsError()) || user.brand_introduction === '<p ><br></p>' || user.user_introduction === '<p ><br></p>' || !user.user_background}
					  loading={this.state.loading}
				  >
					保存
				  </Button>
				</div>
			  </FormItem>
			</Row>
		  </Form>
		</div>
	)
  }
}

function mapStateToProps(state) {
  return {
	CheckDesignerState: state.CheckDesignerState,
  }
}

function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(ActivityList));
