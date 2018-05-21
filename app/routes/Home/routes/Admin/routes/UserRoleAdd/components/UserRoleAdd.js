import React, {Component} from 'react'
import {Form, Button, Tree, Input, Row, Col, Alert, Checkbox} from 'antd'
import {createServiceRequest, createServiceRequestWithCallBack} from '../../../../../../../framework/utils/Request'
import constants from '../../../../../../../framework/config/constants'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'
import {connect} from 'react-redux'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  labelCol: {
	xs: {span: 24},
	sm: {span: 6},
  },
  wrapperCol: {
	xs: {span: 24},
	sm: {span: 14},
  },
};
const tailFormItemLayout = {
  wrapperCol: {
	xs: {
	  span: 24,
	  offset: 0,
	},
	sm: {
	  span: 14,
	  offset: 6,
	},
  },
};

class UserRoleAdd extends Component {
  state = {
	loading: false,
	alert: {
	  msg: "",
	  type: "success",
	  style: {display: "none"}
	}
  }
  
  /*返回上一层*/
  goBack() {
	this.props.router.goBack();
  }
  
  /*checkbox状态值改变触发*/
  checkboxOnChange(keys) {
	this.props.dispatch(createAction(ActionTypes.ACT_MOTIFY_USERS_ROLES, (modle) => modle)(keys))
  }
  
  /*确认修改用户角色*/
  addUserRole() {
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  let loginname = values.loginName;
	  let username = values.userName;
	  let password = values.password;
	  let roles = this.props.authState.userSelected;
	  createServiceRequestWithCallBack(this.props.dispatch)(constants.services.addUserRoles, {
		loginname: loginname,
		username: username,
		password: password,
		roles: roles
	  }, (success) => {
		this.setState({
		  loading: false,
		  alert: {
			msg: "添加成功!",
			type: "success",
			style: {display: "block"}
		  }
		})
	  }, (error) => {
		this.setState({
		  loading: false,
		  alert: {
			msg: "添加失败!",
			type: "error",
			style: {display: "block"}
		  }
		})
	  })
	})
	
  }
  
  
  constructor(props) {
	super(props);
	this.addUserRole = this.addUserRole.bind(this);
	this.goBack = this.goBack.bind(this);
	this.checkboxOnChange = this.checkboxOnChange.bind(this);
  }
  
  componentDidMount() {
	createServiceRequest(this.props.dispatch)(constants.services.getRoles, null, ActionTypes.ACT_GET_ROLES_SUCCESS, ActionTypes.ACT_GET_ROLES_FAILED)
  }
  
  render() {
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	const loginName = isFieldTouched('loginName') && getFieldError('loginName');
	const userName = isFieldTouched('userName') && getFieldError('userName');
	const password = isFieldTouched('password') && getFieldError('password');
	
	return (<div>
	  <Row>
		<Alert message={this.state.alert.msg} type={this.state.alert.type} style={this.state.alert.style}
			   closeText={<div><span onClick={this.goBack} style={{marginRight: "10px"}}>返回</span><span>关闭</span>
			   </div>}/>
		<Form style={{paddingTop: "50px"}}>
		  <FormItem
			  {...formItemLayout}
			  validateStatus={loginName ? 'error' : ''}
			  label="登录名">
			{getFieldDecorator('loginName', {
			  rules: [{
				required: true,
				message: '请输入登录名!'
			  }]
			})
			(<Input size="large"/>)}
		  </FormItem>
		  <FormItem
			  {...formItemLayout}
			  validateStatus={userName ? 'error' : ''}
			  label="用户名">
			{getFieldDecorator('userName', {
			  rules: [{
				required: true,
				message: '请输入用户名!'
			  }]
			})
			(<Input size="large"/>)}
		  </FormItem>
		  <FormItem
			  {...formItemLayout}
			  validateStatus={password ? 'error' : ''}
			  label="密码">
			{getFieldDecorator('password', {
			  rules: [{
				required: true,
				message: '请输入密码!'
			  }]
			})
			(<Input size="large"/>)}
		  </FormItem>
		  <FormItem
			  {...formItemLayout}
			  label="角色">
			<CheckboxGroup onChange={this.checkboxOnChange}>
			  {this.props.authState.roles.map((item) => {
				return <Row key={item.roleSid}><Col span={24}><Checkbox
					value={item.roleSid}>{item.name}</Checkbox></Col></Row>
			  })}
			
			</CheckboxGroup>
		  </FormItem>
		  <FormItem
			  {...tailFormItemLayout}>
			<Button onClick={this.addUserRole} type="primary" size="large" loading={this.state.loading}
					style={{padding: "0 30px"}}
					htmlType="submit">
			  添加
			</Button>
			<Button size="large" style={{padding: "0 30px", marginLeft: "30px"}} onClick={this.goBack}>
			  取消
			</Button>
		  </FormItem>
		</Form>
	  </Row>
	</div>)
  }
}

function mapStateToProps(state) {
  return {
	authState: state.authState
  }
}

/**
 * 使用了动态创建Action的函数，不在bind到具体的Action
 * @param dispatch
 * @returns {{dispatch: *}}
 */
function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(UserRoleAdd))
