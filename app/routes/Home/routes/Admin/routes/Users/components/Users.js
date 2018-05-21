import React, {Component} from 'react'
import {Table, Button, Row, Input, Col, Icon} from 'antd'
import {
  createServiceRequest,
  createServiceRequestWithCallBack
} from '../../../../../../../framework/utils/Request'
import constants from '../../../../../../../framework/config/constants'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import Operatoin from './Operation'
import UserStatus from './UserStatus'
import style from '../resource/users.css'

const Search = Input.Search;
import {createAction} from 'redux-actions'

class Role extends Component {
  /*表头定义*/
  columns = [{
	title: '用户名',
	dataIndex: 'name',
	key: 'name',
	width: '20%',
  }, {
	title: '登录账号',
	dataIndex: 'loginname',
	key: 'loginname',
	width: '20%',
  }, {
	title: '角色',
	dataIndex: 'role',
	key: 'role',
	width: '20%'
  }, {
	title: '状态',
	key: 'status',
	dataIndex: 'lock',
	render: (text, user) => {
	  return <UserStatus user={user}/>
	}
  }, {
	title: '操作',
	key: 'option',
	render: (text, user) => {
	  return <Operatoin user={user}/>
	}
	
  }]
  
  state = {
	current: 0,
	pageSize: 10,
	loading: true
  }
  
  constructor(props) {
	super(props);
	this.pageOnChange = this.pageOnChange.bind(this);
	this.onSearch = this.onSearch.bind(this);
	this.searchOnChange = this.searchOnChange.bind(this);
  }
  
  componentDidMount() {
	let {dispatch} = this.props
	createServiceRequestWithCallBack(this.props.dispatch)(constants.services.getUsers, null, (success) => {
	  this.setState({loading: false})
	  dispatch(createAction(ActionTypes.ACT_GET_USERS_SUCCESS, (module) => module)(success))
	}, (failed) => {
	  this.setState({loading: false})
	  dispatch(createAction(ActionTypes.ACT_GET_USERS_SUCCESS, (module) => module)(failed))
	}, this.state.current, this.state.pageSize);
  }
  
  /*页面切换时执行*/
  pageOnChange(current, pageSize) {
	this.setState({loading: true})
	let {dispatch} = this.props
	let param = null;
	if (this.state.query != null) {
	  param = {query: this.state.query}
	}
	createServiceRequestWithCallBack(this.props.dispatch)(constants.services.getUsers, param, (success) => {
	  this.setState({loading: false})
	  dispatch(createAction(ActionTypes.ACT_GET_USERS_SUCCESS, (module) => module)(success))
	}, (failed) => {
	  this.setState({loading: false})
	  dispatch(createAction(ActionTypes.ACT_GET_USERS_SUCCESS, (module) => module)(failed))
	}, current - 1, pageSize);
  }
  
  /*搜索*/
  onSearch(value) {
	this.setState({loading: true})
	let {dispatch} = this.props
	createServiceRequestWithCallBack(this.props.dispatch)(constants.services.getUsers, {query: value}, (success) => {
	  this.setState({loading: false})
	  dispatch(createAction(ActionTypes.ACT_GET_USERS_SUCCESS, (module) => module)(success))
	}, (failed) => {
	  this.setState({loading: false})
	  dispatch(createAction(ActionTypes.ACT_GET_USERS_SUCCESS, (module) => module)(failed))
	}, this.state.current, this.state.pageSize);
  }
  
  searchOnChange(event) {
	this.setState({query: event.target.value})
  }
  
  render() {
	let {props} = this;
	return (<div>
	  <Row gutter={24}>
		<Col span={3} offset={13}>
		  <Button onClick={() => (props.router.push("/home/admin/userroleadd"))} type="primary"><Icon
			  type="plus-circle-o"/>添加用户</Button>
		</Col>
		<Col span={7} offset={1} style={{marginBottom: "20px"}}>
		  <Search
			  onChange={this.searchOnChange}
			  placeholder="用户名"
			  className={style.search}
			  style={{width: "100%"}}
			  onSearch={this.onSearch}
		  />
		</Col>
	  </Row>
	  <Row>
		<Table
			rowKey={(record) => {
			  return record.sid
			}}
			loading={this.state.loading}
			pagination={{
			  onChange: this.pageOnChange,
			  pageSize: this.state.pageSize,
			  total: this.props.authState.users.total
			}}
			bordered columns={this.columns} dataSource={this.props.authState.users.users}/>
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
)(Role) 