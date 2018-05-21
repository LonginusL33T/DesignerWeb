import React, {Component} from 'react'
import {Icon, Tooltip, Spin} from 'antd'
import style from '../resource/users.css'
import contants from '../../../../../../../framework/config/constants'
import {
  createServiceRequest,
  createServiceRequestWithCallBack
} from '../../../../../../../framework/utils/Request'

class UserStatus extends Component {
  
  lockOrUnlock() {
	let {user} = this.props;
	this.setState({
	  spinning: true
	})
	createServiceRequestWithCallBack(this.props.dispatch)(contants.services.lockOrUnLockUser, {loginname: user.loginname}, (success) => {
	  if (user.locked) {
		user.locked = false;
		this.setState({
		  spinning: false
		})
	  } else {
		user.locked = true;
		this.setState({
		  spinning: false
		})
	  }
	  
	}, (error) => {
	  this.setState({
		spinning: false
	  })
	})
	
  }
  
  constructor(props) {
	super(props);
	this.lockOrUnlock = this.lockOrUnlock.bind(this);
	this.state = {
	  spinning: false
	}
	
  }
  
  componentDidMount() {
	
  }
  
  render() {
	let {user} = this.props;
	return (<div>
	  <div>
		<div className={user.locked ? style.statusLocked : style.statusNomal}></div>
		<span
			className={user.locked ? style.textLocked : style.textNomal}>{user.locked ? "锁定" : "正常"}</span>
		<Tooltip placement="topLeft" title={user.locked ? "点击解锁用户" : "点击锁定用户"}>
		  <Icon type={user.locked ? "unlock" : "lock"} className={style.lock} onClick={this.lockOrUnlock}/>
		</Tooltip>
		<Spin size="small" spinning={this.state.spinning}/>
	  </div>
	
	
	</div>)
  }
}

export default UserStatus