import React, {Component} from 'react'
import {Link} from 'react-router'
import style from '../resource/users.css'
import {Modal, Input, notification} from 'antd'
import {
  createServiceRequest,
  createServiceRequestWithCallBack
} from '../../../../../../../framework/utils/Request'
import contants from '../../../../../../../framework/config/constants'

const confirm = Modal.confirm;

class Operation extends Component {
  state = {
	locked: false,
	visible: false,
	confirmLoading: false
  }
  
  
  constructor() {
	super();
	this.showConfirm = this.showConfirm.bind(this);
  }
  
  /*显示确认模态框*/
  
  showConfirm() {
	let {user, dispatch} = this.props;
	confirm({
	  title: '修改密码',
	  content: '确定要初始化密码吗?',
	  onOk() {
		createServiceRequestWithCallBack(dispatch)(contants.services.resetPassword, {
		  loginname: user.loginname,
		  password: "123456"
		}, (success) => {
		  notification['success']({
			message: '提示',
			description: "'" + user.name + "'已成功重置密码"
		  });
		  
		}, (error) => {
		  notification['error']({
			message: '提示',
			description: "'" + user.name + "'重置密码失败"
		  });
		})
	  }
	});
  }
  
  render() {
	let {user} = this.props
	return (<div>
	  <Link className={style.permission}
			to={{
			  pathname: "home/admin/userrolemotify",
			  state: {
				loginname: user.loginname,
				name: user.name
			  }
			}}>权限配置</Link>
	  <span className={style.resetPassword} onClick={this.showConfirm}>
                    重置密码</span>
	</div>)
  }
}

export default Operation;