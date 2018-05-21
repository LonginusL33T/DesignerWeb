import React, {Component} from 'react'
import {Form, Button, Tree, Input, Row, Col, Alert} from 'antd'
import {createServiceRequest, createServiceRequestWithCallBack} from '../../../../../../../framework/utils/Request'
import constants from '../../../../../../../framework/config/constants'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'

const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

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

function addTreeNode(node) {
  if (node.children && node.children.length > 0) {
	return (<TreeNode key={node.value} title={node.name}>
	  {node.children ? node.children.map(addTreeNode) : null}
	</TreeNode>)
  } else {
	return (<TreeNode key={node.value} title={node.name}/>)
  }
  
}

class RoleAdd extends Component {
  state = {
	loading: false,
	permissions: [],
	alert: {
	  msg: "",
	  type: "success",
	  style: {display: "none"}
	}
  }
  /*按钮提交*/
  handleSubmit = (e) => {
	e.preventDefault();
	this.setState({
	  loading: true
	})
	this.props.form.validateFields((err, values) => {
	  createServiceRequestWithCallBack(this.props.dispatch)(constants.services.addRole,
		  {...values, permissions: this.state.permissions},
		  (success) => {
			if (success.error_code == constants.errorcode.SUCCESS) {
			  this.setState({
				alert: {
				  msg: "角色添加成功!",
				  type: "success",
				  style: {
					display: "block"
				  }
				}
			  })
			} else if (success.error_code == constants.errorcode.ADD_PERMISSION_ERROR) {
			  this.setState({
				alert: {
				  msg: "权限添加失败!",
				  type: "error",
				  style: {
					display: "block"
				  }
				}
			  })
			} else {
			  this.setState({
				alert: {
				  msg: "角色添加失败!",
				  type: "error",
				  style: {
					display: "block"
				  }
				}
			  })
			}
			this.setState({loading: false})
		  }, (msg) => {
			this.setState({
			  alert: {
				msg: "请求服务器出错!",
				type: "error",
				style: {
				  display: "block"
				}
			  }
			})
		  })
	});
  }
  /*树状图权限点击后存储选中的id*/
  onCheck = (keys, e) => {
	let checked = [...keys].concat(e.halfCheckedKeys);
	this.setState({permissions: checked});
  }
  /*返回上一层*/
  goBack = () => {
	this.props.router.goBack()
  }
  
  componentDidMount() {
	this.props.form.validateFields();
	createServiceRequest(this.props.dispatch)(constants.services.getPermissions, null, ActionTypes.ACT_GET_PERMISSIONS_SUCCESS, ActionTypes.ACT_GET_PERMISSIONS_FAILED)
  }
  
  render() {
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	const roleName = isFieldTouched('roleName') && getFieldError('roleName');
	return (<div>
	  <Row>
		<Alert message={this.state.alert.msg} type={this.state.alert.type} style={this.state.alert.style}
			   closeText={<div><span onClick={this.goBack} style={{marginRight: "10px"}}>返回</span><span>关闭</span>
			   </div>}/>
		<Form onSubmit={this.handleSubmit}>
		  <FormItem
			  {...formItemLayout}
			  label="角色名"
			  validateStatus={roleName ? 'error' : ''}
			  help={roleName || ''}>
			{getFieldDecorator('roleName', {
			  rules: [{required: true, message: '请输入角色名!'}],
			})(<Input size="large"
					  placeholder="角色名"/>)}
		  </FormItem>
		  <FormItem
			  {...formItemLayout}
			  label="权限">
			<Tree
				onCheck={this.onCheck}
				checkable
				autoExpandParent={false}
			>{
			  this.props.authState.permissions.map(addTreeNode)
			}
			</Tree>
		  </FormItem>
		  <FormItem
			  {...tailFormItemLayout}>
			<Button type="primary" size="large" loading={this.state.loading} style={{padding: "0 30px"}}
					htmlType="submit"
					disabled={hasErrors(getFieldsError())}>
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
	appState: state.appstate,
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
)(Form.create()(RoleAdd))