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

class RoleMotify extends Component {
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
  updateUserRole() {
	this.setState({loading: true});
	let loginname = this.props.location.state.loginname;
	let roles = this.props.authState.userSelected;
	createServiceRequestWithCallBack(this.props.dispatch)(constants.services.updateUserRoles, {
	  loginname: loginname,
	  roles: roles
	}, (success) => {
	  this.setState({
		loading: false,
		alert: {
		  msg: "修改成功!",
		  type: "success",
		  style: {display: "block"}
		}
	  })
	}, (error) => {
	  this.setState({
		loading: false,
		alert: {
		  msg: "修改失败!",
		  type: "error",
		  style: {display: "block"}
		}
	  })
	})
  }
  
  
  constructor(props) {
	super(props);
	this.updateUserRole = this.updateUserRole.bind(this);
	this.goBack = this.goBack.bind(this);
	this.checkboxOnChange = this.checkboxOnChange.bind(this);
  }
  
  componentDidMount() {
	createServiceRequest(this.props.dispatch)(constants.services.getUserRoles, {loginname: this.props.location.state.loginname}, ActionTypes.ACT_GET_USERS_ROLES_SUCCESS, ActionTypes.ACT_GET_USERS_FAILED)
  }
  
  render() {
	return (<div>
	  <Row>
		<Alert message={this.state.alert.msg} type={this.state.alert.type} style={this.state.alert.style}
			   closeText={<div><span onClick={this.goBack} style={{marginRight: "10px"}}>返回</span><span>关闭</span>
			   </div>}/>
		<Form style={{paddingTop: "50px"}}>
		  <FormItem
			  {...formItemLayout}
			  label="登录名"
		  >
			<Input size="large"
				   defaultValue={this.props.location.state.loginname}
				   disabled/>
		  </FormItem>
		  <FormItem
			  {...formItemLayout}
			  label="用户名"
		  >
			<Input size="large"
				   defaultValue={this.props.location.state.name}
				   disabled/>
		  </FormItem>
		  <FormItem
			  {...formItemLayout}
			  label="角色">
			<CheckboxGroup value={this.props.authState.userSelected} onChange={this.checkboxOnChange}>
			  {this.props.authState.userRoles.map((item) => {
				return <Row key={item.value}><Col span={24}><Checkbox
					value={item.value}>{item.label}</Checkbox></Col></Row>
			  })}
			
			</CheckboxGroup>
		  </FormItem>
		  <FormItem
			  {...tailFormItemLayout}>
			<Button onClick={this.updateUserRole} type="primary" size="large" loading={this.state.loading}
					style={{padding: "0 30px"}}
					htmlType="submit">
			  修改
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
)(Form.create()(RoleMotify))
