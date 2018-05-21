import React, {Component} from 'react'
import {Table, Row, Col, Button, Dropdown, Menu, Pagination, message, Input} from 'antd'
import {connect} from 'react-redux'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import services from '../../../../../framework/utils/MeshService'
import config from "../../../../../framework/config/config"
import style from "../resource/Registers.css"
import {Link} from "react-router"
import {createAction} from 'redux-actions'

const Item = Menu.Item;
const Search = Input.Search;

class Registers extends Component {
  state = {
	current: 1,
	loading: false,
  }
  
  constructor(props) {
	super(props);
	this._natureSelect = this._natureSelect.bind(this);
	this._checkSelect = this._checkSelect.bind(this);
	this._getColorLink = this._getColorLink.bind(this);
	this._getColorText = this._getColorText.bind(this);
	this._getRegisters = this._getRegisters.bind(this);
	this._getNature = this._getNature.bind(this);
  }
  
  componentDidMount() {
	this._getRegisters();
  }
  
  _getRegisters(category, status, query, page) {
	this.setState({loading: true});
	let {dispatch} = this.props
	let data = {}
	if (category)
	  data.category = category
	if (status)
	  data.status = status
		if(query)
			data.query = query;
	services.createServiceRequest.Service(config.api.WebVerifyRegistion, data, (success) => {
	  dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS, (model) => model)(success))
	  this.setState({loading: false});
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 10)
  }
  
  _natureSelect({item, key, keyPath}) {
	this.setState({
	  nature: key
	})
	this._getRegisters(key, this.state.check, this.state.query);
  }
  
  _checkSelect({item, key, keyPath}) {
	
	this.setState({
	  check: key
	});
	this._getRegisters(this.state.nature, key,this.state.query);
  }
  
  _getColorText(value, record, index) {
	if (value === config.check.accept.key)
	  return record.upload ?<div className={style.blue}>注册用户</div>:<div className={style.green}>通过</div>
	else if (value === config.check.reject.key)
	  return <div className={style.red}>未通过</div>
	else if (value === config.check.locked.key)
	  return <div className={style.red}>锁定</div>
	else if (value === config.check.upload.key)
	  return <div className={style.blue}>注册用户</div>
	else if (value === config.check.verifing.key)
	  return <div>待审核</div>
  }
  
  _getColorLink(value, record, index) {
	if (value === config.check.accept.key)
	  return <Link to={record.category === config.nature.company.key ? {
			pathname: "/home/companies/details",
			state: {
			  uniqueid: record.uniqueid,
			  nature: this.state.nature,
			  check: this.state.check,
			  page: this.state.current
			}
		  } : {
			pathname: "/home/registers/feedback",
			state: {
			  uniqueid: record.uniqueid,
			  uploaded: record.upload,
			  nature: this.state.nature,
			  check: this.state.check,
			  page: this.state.current
			}
		  }}
				   className={record.upload ? style.waiting: style.pass }>
		详情{record.category === config.nature.company.key ? '查看' : record.upload ? '修改' : '上传'}
	  </Link>
	else if (value === config.check.reject.key)
	  return <Link to={record.category === config.nature.company.key ? {
		pathname: "/home/registers/checkcompany",
		state: {uniqueid: record.uniqueid, nature: this.state.nature, check: this.state.check, page: this.state.current}
	  } : {
		pathname: "/home/registers/checkperson",
		state: {uniqueid: record.uniqueid, nature: this.state.nature, check: this.state.check, page: this.state.current}
	  }}
				   className={style.fail}>重新审核</Link>
	else if (value === config.check.verifing.key)
	  return <Link to={record.category === config.nature.company.key ? {
		pathname: "/home/registers/checkcompany",
		state: {uniqueid: record.uniqueid, nature: this.state.nature, check: this.state.check, page: this.state.current}
	  } : {
		pathname: "/home/registers/checkperson",
		state: {uniqueid: record.uniqueid, nature: this.state.nature, check: this.state.check, page: this.state.current}
	  }}
				   className={style.waiting}>审核信息</Link>
	
	else if (value === config.check.upload.key)
	  return <div><Link to={{
		pathname: "/home/registers/feedback",
		state: {
		  uniqueid: record.uniqueid,
		  uploaded: true,
		  nature: this.state.nature,
		  check: this.state.check,
		  page: this.state.current
		}
	  }}
						className={style.waiting}>详情修改</Link></div>
  }
  
  _getNature(value, record, index) {
	if (value === config.nature.user.key)
	  return <div>{config.nature.user.value}</div>
	else
	  return config.nature.company.value
  }
  
  render() {
	let {RegistersState} = this.props;
	let total = RegistersState.total
	const columns = [
	  {
		title: "名称",
		dataIndex: "name",
		key: "name"
	  }, {
		title: "性质",
		dataIndex: "category",
		key: "category",
		render: this._getNature
	  }, {
		title: "审核状态",
		dataIndex: "status",
		key: "status",
		render: this._getColorText
	  }, {
		title: "自有品牌名称",
		dataIndex: "brand_name",
		key: "brand_name"
	  }, {
		title: "邮箱",
		dataIndex: "email",
		key: "email"
	  }, {
		title: "联系人电话",
		dataIndex: "contact_telephone",
		key: "contact_telephone"
	  }, {
		title: "操作",
		dataIndex: "status",
		key: "action",
		render: this._getColorLink
	  }
	]
	var data = RegistersState.Registers;
//	const dataSource = data.filter(this._selectData);
	const checkMenu = (
		<Menu className="greyMenu" onClick={this._checkSelect}>
		  <Item key={config.check.verifing.key}> 待审核</Item>
		  <Item key={config.check.reject.key}> 未通过</Item>
		  <Item key={config.check.accept.key}> 通过</Item>
		  <Item key={config.check.upload.key}> 注册用户</Item>
		</Menu>
	)
	const natureMenu = (
		<Menu className="yellowMenu" onClick={this._natureSelect}>
		  <Item key={config.nature.user.key}> 个人</Item>
		  <Item key={config.nature.company.key}>企业</Item>
		</Menu>
	)
	return (this.props.children ||
		<div>
			<div style={{float:'left',paddingTop:'12px'}}>
				<Search
					placeholder="搜索企业名称、设计师"
					className={style.inputSearch}
					onSearch={value => {this._getRegisters (this.state.nature ,this.state.check,value);
					this.setState({query:value,current:1})}}
				/>
			</div>
		  <Row type="flex" justify="end">
			<Col>
			  <Dropdown overlay={natureMenu} placement="bottomCenter" trigger={['click']}>
				<button className='yellowButton' ref="nature"><span
					className='fontBox'> {this.state.nature ? config.nature[this.state.nature].value : "全部性质"}</span>
				</button>
			  </Dropdown>
			</Col>
			<Col>
			  <Dropdown overlay={checkMenu} placement="bottomCenter" trigger={['click']}>
				<button className='greyButton' ref="check"><span
					className='fontBox'> {this.state.check ? config.check[this.state.check].value : "审核状态"}</span>
				</button>
			  </Dropdown>
			</Col>
		  </Row>
		  <div className="content">
			<Table columns={columns} rowKey="uniqueid" dataSource={data} loading={this.state.loading}
				   pagination={{
					 total: total,
					 current: this.state.current,
					 simple: true,
					 onChange: (page, pageSize) => {
					   this.setState({
						 current: page
					   });
					   this._getRegisters(this.state.nature, this.state.check, this.state.query, page)
					 }
				   }}
			/>
		  </div>
		</div>)
  }
}

function mapStateToProps(state) {
  return {
	RegistersState: state.RegistersState,
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
)(Registers)