import React, {Component} from 'react'
import {Row, Col, Menu, Dropdown, Table, Pagination, Modal, Tooltip, message, Spin, Tabs} from "antd"
import style from '../resource/Interviewee.css'
import config from "../../../../../framework/config/config"
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'
import services from '../../../../../framework/utils/MeshService'

const {Item} = Menu
const {TabPane} = Tabs

function remove(arr, item) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
	if (arr[i] != item) {
	  result.push(arr[i]);
	}
  }
  return result;
}
//申请应聘信息汇总
class Interviewee extends Component {
  state = {
	allPassVisible: false,
	visible: false,
	deleteVisible: false,
	tableLoading: true,
	menuLoading: true,
	selectedRowKeys: [],
	menuSize: 10,
	tableSize: 10,
	currentMenuPage: 1,
	currentTablePage: 1,
  }
  
  constructor(props) {
	super(props);
  }
  
  componentDidMount() {
	this._getMenu();
  }
  
  _natureSelect = ({item, key, keyPath}) => {
	this.setState({
	  nature: key,
	  currentMenuPage: 1
	})
	this._getMenu(1, key)
  }
  
  _onCancel = () => {
	this.setState({
	  visible: false,
	  deleteVisible: false,
	  allPassVisible: false
	})
  }
  _getMenu = (page, nature) => {
	this.setState({menuLoading: true});
	let {dispatch} = this.props;
	let prams = {};
	if (nature)
	  prams.category = nature;
	services.createServiceRequest.Service(config.api.WebVerifyApplyUsers, prams, (success) => {
	  dispatch(createAction(ActionTypes.ACT_INTERVIEWEE_GET_MENU_SCHEMA, (model) => model)(success))
	  this.setState({menuLoading: false});
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 10)
  }
  _getTable = (category, uniqueid, page) => {
	let {dispatch} = this.props;
	let prams = {category: category, uniqueid: uniqueid};
	this.setState({tableLoading: true});
	services.createServiceRequest.Service(config.api.WebVerifyApply, prams, (success) => {
	  dispatch(createAction(ActionTypes.ACT_INTERVIEWEE_GET_TABLE_SCHEMA, (model) => model)(success))
	  this.setState({tableLoading: false});
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 10)
  }
  _unPass = () => {
	let prams = {uniqueid: this.state.uniqueid, category: this.state.categoryTable};
	services.createServiceRequest.Service(config.api.WebVerifyApplyReject, prams, (success) => {
	  this._onCancel();
	  message.success("不匹配成功")
	  this.setState({selectedRowKeys: remove(this.state.selectedRowKeys, this.state.uniqueid)});
	  this._getTable(this.state.categoryTable, this.state.uniqueidTable, this.state.currentTablePage)
	}, (failed) => {
	  message.error(failed)
	})
  }
  _pass = (isAll) => {
	
	let prams = {category: this.state.categoryTable};
	if (isAll) {
	  prams.uniqueid = this.state.selectedRowKeys
	} else {
	  prams.uniqueid = [this.state.uniqueid]
	}
	services.createServiceRequest.Service(config.api.WebVerifyApplyAccept, prams, (success) => {
	  this._onCancel();
	  message.success("匹配成功")
	  this.setState({selectedRowKeys: []});
	  this._getTable(this.state.categoryTable, this.state.uniqueidTable, this.state.currentTablePage)
	}, (failed) => {
	  message.error(failed)
	})
  }
  _onMenuSelect = ({item, key, selectedKeys}) => {
	let {val} = item.props;
	this.setState({
	  categoryTable: val.category,
	  uniqueidTable: val.uniqueid,
	  currentTablePage: 1,
	  selectedRowKeys: [],
	  company_name: val.name
	})
	this._getTable(val.category, val.uniqueid)
  }
  
  _onMenuChange = (page, pageSize) => {
	this.setState({currentMenuPage: page});
	this._getMenu(page, this.state.nature)
  }
  
  _onTableChange = (page, pageSize) => {
	let {categoryTable, uniqueidTable} = this.state;
	this.setState({currentTablePage: page});
	this._getTable(categoryTable, uniqueidTable, page)
  }
  _tabCallback = (key) => {
	this.setState({
	  categoryTable: key,
	  currentTablePage: 1,
	});
	this._getTable(key, this.state.uniqueidTable)
  }
  
  render() {
	const {IntervieweeState} = this.props;
	const natureMenu = (
		<Menu className="yellowMenu" onClick={this._natureSelect}>
		  <Item key={config.nature.user.key}> 个人</Item>
		  <Item key={config.nature.company.key}>企业</Item>
		</Menu>
	)
		//应聘顶部栏
	const columns = [
	  {
		title: "姓名",
		dataIndex: "user_name",
		key: "n",
		width: '20%',
		render: (text, record, index) => {
		  return <div style={{textAlign: 'center'}}>
			<Tooltip placement="bottomLeft" title={text} arrowPointAtCenter overlayStyle={{fontSize: '10px'}}>
			  <span style={{fontSize: '16px'}}> {text.slice(0, 12)}</span>
			</Tooltip>
		  </div>
		}
	  },
	  {
		title: "设计师类别",
		dataIndex: "design_type",
		key: "design_type",
		width: '20%',
	  },
	  {
		title: "职位类别",
		dataIndex: "category",
		key: "category",
		width: '20%',
		
	  },
	  {
		title: "投递时间",
		dataIndex: "time",
		key: "time",
		width: '20%',
	  },
	  {
		title: "操作/状态",
		dataIndex: "time",
		key: "option",
		width: '20%',
      render: (text, record, index) => {
        return <div>
          {record.status === 'accept' ?
            <div className={style.passed}>
              已通过
            </div> :
            <div style={{textAlign: 'center'}}>
              <a className={style.unpass} onClick={() => {
                this.setState({deleteVisible: true, uniqueid: record.uniqueid})
              }}> 不匹配</a>
              <a className={style.pass} onClick={() => {
                this.setState({
                  visible: true,
                  uniqueid: record.uniqueid,
                  company_telephone: record.company_telephone,
                  designer_telephone: record.designer_telephone,
                  company_name: this.state.categoryTable !== 'user' ? this.state.company_name : record.user_name
                })
              }}> 通过</a>

            </div>}
        </div>
      }
    },
  ];

	//约面试顶部栏
	const columnsApply = [
	  {
		title: "姓名",
		dataIndex: "user_name",
		key: "user_name",
		render: (text, record, index) => {
		  return ( <div style={{textAlign: 'center'}}>
			<Tooltip placement="bottomLeft" title={text} arrowPointAtCenter overlayStyle={{fontSize: '10px'}}>
				<span style={{fontSize: '16px'}}> {text.slice(0, 12)}</span>
			</Tooltip>
		  </div>)
		}
	  },
	  {
		title: "设计师类别",
		dataIndex: "design_type",
		key: "design_type",
	  },
	  {
		title: "操作/状态",
		dataIndex: "time",
		key: "option",
		render: (text, record, index) => {
		  return <div>
			{record.status === 'accept' ?
				<div className={style.passed}>
				  已通过
				</div> :
				<div style={{textAlign: 'center'}}>
				  <a className={style.pass} onClick={() => {
					this.setState({
					  visible: true,
					  uniqueid: record.uniqueid,
					  company_telephone: record.company_telephone,
					  designer_telephone: record.designer_telephone,
					  company_name: this.state.categoryTable === 'company' ? this.state.company_name : record.user_name
					})
				  }}> 通过</a>
				  <a className={style.unpass} onClick={() => {
					this.setState({deleteVisible: true, uniqueid: record.uniqueid})
				  }}> 不匹配</a>
				</div>}
		  </div>
		}
	  }
	]
	const {selectedRowKeys} = this.state;
	const rowSelection = {
	  selectedRowKeys,
	  onChange: (selectedRowKeys, selectedRows) => {
		this.setState({selectedRowKeys})
	  },
	  getCheckboxProps: record => ({
		disabled: record.status === 'accept', // Column configuration not to be checked
	  }),
	  hideDefaultSelections: true,
	};
	return (
		<div>
		  <Row type="flex" justify="end">
			<Col>
			  <Dropdown overlay={natureMenu} placement="bottomCenter" trigger={['click']}>
				<button className='yellowButton' ref="nature"><span
					className='fontBox'> {this.state.nature ? config.nature[this.state.nature].value : "全部性质"}</span>
				</button>
			  </Dropdown>
			</Col>
		  </Row>
		  <div className="content">
			<Row gutter={16}>
			  <Col style={{width: 300, float: 'left'}}>
				<Spin spinning={this.state.menuLoading}>
				  <div className={style.top}>
					<span style={{marginLeft: "76px"}}>名称</span>
					<span style={{float: 'right'}}>性质</span>
				  </div>
				  {IntervieweeState.menuTotal <= 0 ?
					  <div style={{
						height: '54px',
						lineHeight: '54px',
						borderTop: '1px solid #d3d3d3',
						color: "#e5e5e5",
						fontSize: "16px",
						textAlign: 'center',
						borderRight: '1px solid #d3d3d3'
					  }}>
						暂无数据^-^
					  </div> :
					  <Menu className="menu" onSelect={this._onMenuSelect}>
						{IntervieweeState.menu.map((val, index) => {
						  return (
							  <Item key={val.uniqueid} val={val} style={{height: 54, borderTop: '1px solid #d3d3d3'}}>
								<div className={style.item}>
								  <a onClick={() => {
									let path = '';
									if (val.category === 'user') {
									  path = '/home/designers/thedesigner'
									}
									else {
									  path = '/home/companies/details'
									}
									this.props.router.push({pathname: path, state: {uniqueid: val.uniqueid}})
								  }}>
									<div className={style.box}>
									<img className={style.img}
										 src={val.avatar === 'noresouce' ? "../resource/images/menu_logo.png" : val.avatar}/>
									</div>
								  </a>
								  <span>
							  {val.name}
						  </span>
								  <span style={{float: 'right'}}>
							  {config.nature[val.category].value}
						  </span>
								</div>
							  </Item>)
						})
						}
					  </Menu>}
				</Spin>
			  </Col>
			  
			  <Col style={{paddingTop: '36px'}}>
				{this.state.categoryTable ?
					<Row type="flex" justify="end">
					  {this.state.categoryTable !== 'user' ?
						  <Col span={24}>
							<Tabs activeKey={this.state.categoryTable} onChange={this._tabCallback}>
							  <TabPane tab="应聘" key="company"></TabPane>
							  <TabPane tab="约面试" key="apply"></TabPane>
							</Tabs>
						  </Col> : null
					  }
					  <Col span={10}>
					<span className={style.table_title}>
					  {this.state.categoryTable === 'company' ? '应聘人员' : this.state.categoryTable === 'apply' ? '约面试人员' : '面试企业'}
				 	 </span>
					  </Col>
					  <Col span={4}>
						<button className={style.blueButton} ref="nature"
								onClick={() => {
								  if (this.state.selectedRowKeys.length === 0) {
									message.error('未选中信息！');
									return;
								  }
								  this.setState({allPassVisible: true})
								}}>
						  <span className='fontBox'> 批量通过</span>
						</button>
					  </Col>
					  <Col span={24}>
						<Table rowKey="uniqueid"
							   showHeader={true}
							   pagination={false}
							   dataSource={IntervieweeState.data}
							   columns={this.state.categoryTable === 'apply' ? columnsApply : columns}
							   loading={this.state.tableLoading}
							   rowSelection={rowSelection}/>
					  </Col>
					  <Col span={15} style={{marginTop: '16px'}}>
						{IntervieweeState.datatotal <= 0 ? <div></div> :
							<Pagination simple defaultPageSize={10}
										total={IntervieweeState.datatotal}
										onChange={this._onTableChange}
										current={this.state.currentTablePage}
							/>}
					  
					  </Col>
					</Row> : null
				}
			  </Col>
			
			</Row>
		  </div>
		  <div className={style.pagination_bottom}>
			<Pagination simple defaultCurrent={1} current={this.state.currentMenuPage}
						total={IntervieweeState.menuTotal} onChange={this._onMenuChange}/>
		  </div>
		  <Modal
			  style={{top: "40vh"}}
			  visible={this.state.deleteVisible}
			  onCancel={this._onCancel}
			  footer={null}
			  width="320px"
			  closable={false}>
			<div style={{fontSize: '18px', textAlign: 'center', marginTop: "24px"}}>
			  <span style={{color: '#424242'}}>确认该用户不匹配？</span>
			</div>
			<Row type="flex" justify="end" style={{marginTop: '21px'}}>
			  <Col>
				<a style={{color: '#cb7301', fontSize: "14px", marginRight: '30px'}} onClick={this._unPass}>
				  确认
				</a>
			  </Col>
			  <Col>
				<a style={{color: '#a7a7a7', fontSize: "14px"}} onClick={this._onCancel}>
				  取消
				</a>
			  </Col>
			</Row>
		  </Modal>
		  
		  <Modal
			  style={{top: "30vh"}}
			  visible={this.state.visible}
			  onCancel={this._onCancel}
			  footer={null}
			  width="320px"
			  closable={false}>
			<div style={{textAlign: 'center', marginTop: "8px", marginBottom: '26px'}}>
			  <span style={{color: '#b79027', fontSize: '18px',}}>{this.state.company_name}</span>
			</div>
			<Row gutter={8} type="flex" justify="center" style={{fontSize: '14px', color: '#424242'}}>
			  <Col span={6}>企业：</Col>
			  <Col>{this.state.company_telephone}</Col>
			</Row>
			<Row gutter={8} type="flex" justify="center" style={{marginTop: '6px', fontSize: '14px', color: '#424242'}}>
			  <Col span={6}>设计师：</Col>
			  <Col>{this.state.designer_telephone}</Col>
			</Row>
			<Row type="flex" justify="end" style={{marginTop: '38px'}}>
			  <Col>
				<a style={{color: '#cb7301', fontSize: "14px", marginRight: '30px'}} onClick={() => {
				  this._pass(false)
				}}>
				  确认
				</a>
			  </Col>
			  <Col>
				<a style={{color: '#a7a7a7', fontSize: "14px"}} onClick={this._onCancel}>
				  取消
				</a>
			  </Col>
			</Row>
		  </Modal>
		  <Modal
			  style={{top: "20vh"}}
			  visible={this.state.allPassVisible}
			  onCancel={this._onCancel}
			  footer={null} width="320px"
			  closable={false}>
			<div style={{fontSize: '18px', textAlign: 'center', marginTop: "28px"}}>
			  <span style={{color: '#424242'}}>确认通过这些信息？</span>
			</div>
			<Row type="flex" justify="end" style={{marginTop: '21px'}}>
			  <Col>
				<a onClick={() => {
				  this._pass(true)
				}}
				   style={{color: '#cb7301', fontSize: "14px", marginRight: '30px'}}>
				  确认
				</a>
			  </Col>
			  <Col>
				<a onClick={this._onCancel} style={{color: '#a7a7a7', fontSize: "14px"}}>
				  取消
				</a>
			  </Col>
			</Row>
		  </Modal>
		</div>)
  }
}

function mapStateToProps(state) {
  return {
	IntervieweeState: state.IntervieweeState,
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
)(Interviewee);