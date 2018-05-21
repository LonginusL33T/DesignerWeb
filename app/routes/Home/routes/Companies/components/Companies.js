import React, {Component} from 'react'
import styles from '../resource/Companies.css'
import style from '../resource/CSS/Companies.css'
import {Row, Col, Dropdown, Menu, Table, Modal, message, Spin, Input} from 'antd'
import config from "../../../../../framework/config/config"
import {Link} from 'react-router'
import services from '../../../../../framework/utils/MeshService';
import {connect} from 'react-redux'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'

const Item = Menu.Item;
const Search = Input.Search;

class Companies extends Component {
  state = {
	src: "",
	visible: false,
	deleteVisible: false,
	size: "",
	nature: "",
	uuid: "",
	check_uuid: {},
	all_loading: true,
	allDeleteVisible: false,
    query:"",
  };
  
  componentDidMount() {
	this._getCompanies();
  }
  
  constructor(props) {
	super(props)
	this._companyNatureSelect = this._companyNatureSelect.bind(this);
	this._companySizeSelect = this._companySizeSelect.bind(this);
	this._render = this._render.bind(this);
	this._showModal = this._showModal.bind(this);
	this._showDelete = this._showDelete.bind(this);
	this._onCancel = this._onCancel.bind(this);
	this._getCompanies = this._getCompanies.bind(this);
	this._onCancel = this._onCancel.bind(this);
	this._onOk = this._onOk.bind(this);
	this._onDelete = this._onDelete.bind(this);
	
  }
  
  _getCompanies(size, enterprise_nature, query, page) {
	this.setState({all_loading: true});
	let {dispatch} = this.props;
	let data = {};
	if (size)
	  data.size = size;
	if (enterprise_nature)
	  data.nature = enterprise_nature;
	if(query)
	  data.query = query;
	
	services.createServiceRequest.Service(config.api.WebGetCompanys, data, (success) => {
	  dispatch(createAction(ActionTypes.ACT_COMPANIES_GET_COMPANIES_SCHEMAS, (model) => model)(success))
	  this.setState({all_loading: false})
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 10)
  }
  
  _companySizeSelect({item, key, keyPath}) {
    this.setState({
      companySize: key
    });
	  this._getCompanies(key, this.state.companyNature, this.state.query)
  }
  
  _companyNatureSelect({item, key, keyPath}) {
	this.setState({
	  companyNature: key
	})
	this._getCompanies(this.state.companySize, key, this.state.query)
  }
  
  _showModal = (key) => {
	this.setState({
	  src: key,
	  visible: true
	})
  }
  
  _showDelete = (key) => {
	this.setState({
	  deleteVisible: true,
	  uuid: key
	})
  }
  
  _render(text, record, index) {
	let {companySize, companyNature, page} = this.state
	return <span>
	  <a className="yellow underLine marginR_38" onClick={() => {
		this._showModal(record.business_contact_card)
	  }}>联系人名片</a>
		<Link to={{
		  pathname: record.uniqueid === undefined ?
			  "/home/companies/details" : "/home/companies/details",
		  state: {
			uniqueid: record.uniqueid,
			size: companySize,
			enterprise_nature: companyNature,
			page: page
		  }
		}}
			  className="blue underLine marginR_67">编辑信息</Link>
	  <a className="red2 underLine" onClick={() => this._showDelete(record.uniqueid)}>删除</a>
	</span>
  }
  
  _onCancel() {
	this.setState({
	  visible: false,
	  deleteVisible: false,
	  
	  allDeleteVisible: false
	  
	})
  }
  
  _onOk() {
	let data = {uniqueid: this.state.uuid};
	services.createServiceRequest.Service(config.api.WebDeleteCompany, data, (success) => {
	  message.success("删除成功");
	  this._getCompanies();
	}, (failed) => {
	  message.error(failed)
	});
	this.setState({
	  visible: false,
	  deleteVisible: false,
	  allDeleteVisible: false
	})
  }
  
  /**
   * 删除数组
   * @private
   */
  _onDelete() {
	const data = [];
	for (let i = 0; i < this.state.check_uuid.length; i++) {
	  data.push(this.state.check_uuid[i].uniqueid)
	}
	services.createServiceRequest.Service(config.api.WebDeleteCompany, {uniqueid: data}, (success) => {
	  message.success("删除成功");
	  this._getCompanies();
	  this.setState({
		allDeleteVisible: false
	  })
	}, (failed) => {
	  message.error(failed);
	});
  }
  
  /**
   * 分页
   * @param page
   * @param pageSize
   * @private
   */
  
  
  render() {
	let {CompaniesState} = this.props;
	const columns = [
	  {
		title: "企业名称",
		dataIndex: "name",
		key: "name"
	  }, {
		title: "企业规模",
		dataIndex: "size",
		key: "size"
	  }, {
		title: "自有品牌名称",
		dataIndex: "brand_name",
		key: "brand_name"
	  }, {
		title: "企业性质",
		dataIndex: "enterprise_nature",
		key: "enterprise_nature"
	  }, {
		title: "自有品牌数量",
		dataIndex: "brand_num",
		key: "brand_num"
	  }, {
		title: "操作",
		dataIndex: "status",
		key: "action",
		render: this._render
	  },
	];
	var data = CompaniesState.Companies;
	var total = CompaniesState.total;
	const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
		this.setState({check_uuid: selectedRows})
	  },
	  getCheckboxProps: record => ({
		disabled: record.name === 'Disabled User',    // Column configuration not to be checked
	  }),
	  hideDefaultSelections: true,
	};
	const companySizeMenu = (<Menu className="yellowMenu" onClick={this._companySizeSelect}>
		  {config.companySize.map(function (val) {
			return <Item key={val}>{val}</Item>
		  })}
		</Menu>
	)
	const companyNatureMenu = (<Menu className="blueMenu" onClick={this._companyNatureSelect}>
		  {config.companyNature.map(function (val) {
			return <Item key={val}>{val}</Item>
		  })}
		</Menu>
	)
	return this.props.children ||
		<div>
			<div style={{float:'left', paddingTop:'12px'}}>
				<Search
					placeholder="搜索企业名称、品牌名称"
					className={style.inputSearch}
					onSearch={value => {
						this._getCompanies(this.state.companySize,this.state.companyNature,value);
						this.setState({query:value});
					}}
				/>
			</div>
		  <Row type="flex" justify="end">
				<Col>
					<Dropdown overlay={companySizeMenu} placement="bottomCenter" trigger={['click']}>
					<button className='yellowButton'>
															<span className='fontBox'>
																	{this.state.companySize || "企业规模"}
									{/*<img src="./resource/images/ChevronRight-128.png"/>*/}
															</span>

					</button>
					</Dropdown>
				</Col>
				<Col>
					<Dropdown overlay={companyNatureMenu} placement="bottomCenter" trigger={['click']}>
					<button className='blueButton'>
													<span className='fontBox'>
														{this.state.companyNature || "全部性质"}
								{/*<img src="./resource/images/ChevronRight-128.png"></img>*/}
													</span>
					</button>
					</Dropdown>
				</Col>
				<Col>
					<button className='greyButton' onClick={() => {
					if (this.state.check_uuid.length === undefined || this.state.check_uuid.length === 0) {
						message.error("未选中用户！")
					} else {
						this.setState({allDeleteVisible: true});
					}
					}}><span className='fontBox'> 批量删除</span></button>
				</Col>
		  </Row>
		  <div className="content">
			<Table columns={columns}
				   rowKey="uniqueid"
				   rowSelection={rowSelection}
				   dataSource={data}
				   className="table"
				   loading={this.state.all_loading}
				   pagination={{
					 total: total,
						 simple: true,
             current:this.state.current,
						 onChange: (page, pageSize) => {
               this.setState({current:page});
					   this._getCompanies(this.state.size, this.state.nature, this.state.query, page)
					 }
				   }}/>
		  </div>
		  
		  <Modal
			  style={{top: "20vh"}}
			  visible={this.state.allDeleteVisible}
			  onCancel={this._onCancel}
			  footer={null} width="320px"
			  closable={false}>
			<div style={{fontSize: '18px', textAlign: 'center', marginTop: "28px"}}>
			  <span style={{color: '#424242'}}>确认删除选中用户？</span>
			</div>
			<Row type="flex" justify="end" style={{marginTop: '21px'}}>
			  <Col>
				<a onClick={this._onDelete}
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
		  <Modal visible={this.state.visible}
				 footer={null}
				 onCancel={this._onCancel}
				 style={{top: "10vh"}}
				 width={"600px"}>
			<img style={{width: "570px", textAlign: 'center'}} src={this.state.src}/>
		  </Modal>
		  <Modal
			  style={{top: "40vh"}}
			  visible={this.state.deleteVisible}
			  footer={null}
			  onCancel={this._onCancel}
			  width="320px"
			  closable={false}>
			<div style={{fontSize: '18px', textAlign: 'center', marginTop: "28px"}}>
			  <span style={{color: '#424242'}}>确认删除该用户？</span>
			</div>
			<Row type="flex" justify="end" style={{marginTop: '21px'}}>
			  <Col>
				<a onClick={this._onOk} style={{color: '#cb7301', fontSize: "14px", marginRight: '30px'}}>
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
		</div>
  }
}

function mapStateToProps(state) {
  return {
	CompaniesState: state.CompaniesState,
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
)(Companies);