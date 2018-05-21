import React, {Component} from 'react'
import style from '../resource/Designers.css'
import {Row, Col, Dropdown, Menu, Table, Modal, message, Spin, Input} from 'antd'
import {Link} from 'react-router'
import config from "../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import services from '../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'

const Item = Menu.Item;
const Search = Input.Search;

class Designers extends Component {
  state = {
	deleteVisible: false,
	  allDeleteVisible: false,
	all_loading: true,
	uuid: "",
	check_uuid: {},
  };
  
  componentDidMount() {
	this._getDesigners();
  }
  
  _designerTypesSelect({item, key, keyPath}) {
	let type;
	if (key === "自有品牌设计师")
	  type = "production";
	else if (key === "自由设计师")
	  type = "free";
	else
	  type = "graduate";
	this.setState({
	  designerTypes: key
	});
	this._getDesigners(type, this.state.designTypes,this.state.query);
  }
  
  
  constructor(props) {
	super(props);
	this._designTypesSelect = this._designTypesSelect.bind(this);
	this._designerTypesSelect = this._designerTypesSelect.bind(this);
	this._render = this._render.bind(this);
	this._showDelete = this._showDelete.bind(this);
	this._onCancel = this._onCancel.bind(this);
	this._selectData = this._selectData.bind(this);
	this._getDesigners = this._getDesigners.bind(this);
	this._onCancel = this._onCancel.bind(this);
	this._onOk = this._onOk.bind(this);
	this._onDelete = this._onDelete.bind(this);
  }

  
  _onDelete() {
  	let data=[];
	for (let i = 0; i < this.state.check_uuid.length; i++) {
        data.push(this.state.check_uuid[i].uniqueid)
    }
		services.createServiceRequest.Service(config.api.WebDeleteDesigner,  {uniqueid:data}, (success) => {
		  message.success("删除成功");
		  this._getDesigners();
            this.setState({allDeleteVisible:false})
		}, (failed) => {
		  message.error(failed)
		});
  }
  
  _onCancel() {
	this.setState({
	  visible: false,
	  deleteVisible: false
	})
  }
  
  _onOk() {
	let data = {uniqueid: this.state.uuid};
	services.createServiceRequest.Service(config.api.WebDeleteDesigner, data, (success) => {
	  message.success("删除成功");
	  this._getDesigners();
	}, (failed) => {
	  message.error(failed)
	})
	this.setState({
	  visible: false,
	  deleteVisible: false,
		allDeleteVisible:false
	})
  }
  
  _getDesigners(type, design_type, query, page) {
      this.setState({all_loading:true});
	let {dispatch} = this.props;
	let data = {};
	if (type)
	  data.type = type;
	if (design_type)
	  data.design_type = design_type;
	if(query)
		data.query = query;
	services.createServiceRequest.Service(config.api.WebGetDesigners, data, (success) => {
	  dispatch(createAction(ActionTypes.ACT_DESIGNER_GET_DESIGNERS_SCHEMAS, (model) => model)(success));
	  this.data = success.user;
	  this.total =success.total_num;
	  for (let i = 0; i < this.data.length; i++) {
		if (this.data[i].type === "free") {
		  this.data[i].type = "自由设计师"
		} else if (this.data[i].type === "graduate") {
		  this.data[i].type = "应届设计师"
		}else {
            this.data[i].type = "自有品牌设计师"
        }
	  }
	  this.setState({all_loading: false});
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 10)
  }
  
  _designTypesSelect({item, key, keyPath}) {
	this.setState({
	  designTypes: key
	});
      /**
	   * 加大括号
       */
	let type;
	if (this.state.designerTypes === "自有品牌设计师") {
    type = "production";
  }
	else if (this.state.designerTypes === "自由设计师") {
    type = "free";
  }
	else if (this.state.designerTypes === "应届设计师"){
	  type = "graduate";
	}
	else {
    type = "";
  }
	this._getDesigners(type, key,this.state.query);
  }
  
  _showDelete = (key) => {
	this.setState({
	  deleteVisible: true,
	  uuid: key,
	})
  }
  
  _render(text, record, index) {
	return <span>
	  {/*<Link className="yellow underLine marginR_38">应聘记录</Link>*/}
	  <Link to={{pathname: '/home/designers/thedesigner', state: {page: '1', uniqueid: record.uniqueid}}}
			className="blue underLine marginR_67">查看信息</Link>
	  <a className="red2 underLine" onClick={() => this._showDelete(record.uniqueid)}>删除</a>
	</span>
  }
  
  _onCancel() {
	this.setState({
	  deleteVisible: false,
		allDeleteVisible:false
	})
  }
  
  _selectData(element) {
	return (element.s === (this.state.designTypes ? this.state.designTypes : element.s) &&
		element.p === (this.state.designerTypes ? this.state.designerTypes : element.p))
  }
  
  render() {
	let {DesignersState} = this.props;
	//var data = DesignersState.user;
	var data = [];
	var total;
	
	const columns = [
	  {
		title: "设计师",
		dataIndex: "name",
		key: "name"
	  }, {
		title: "设计分类",
		dataIndex: "design_type",
		key: "design_type"
	  }, {
		title: "设计师分类",
		dataIndex: "type",
		key: "type"
	  }, {
		title: "归属地区",
		dataIndex: "country",
		key: "country"
	  }, {
		title: "操作",
		dataIndex: "c",
		key: "c",
		render: this._render
	  },
	]
	var data = [];
	const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
		this.setState({check_uuid: selectedRows})
	  },
	  getCheckboxProps: record => ({
		disabled: record.name === 'Disabled User',    // Column configuration not to be checked
	  }),
	  hideDefaultSelections: true,
	};
	const designerTypesMenu = (<Menu className="yellowMenu" onClick={this._designerTypesSelect}>
		  {config.designerTypes.map(function (val) {
			return <Item key={val}>{val}</Item>
		  })}
		</Menu>
	)
	const designTypesMenu = (<Menu className="blueMenu" onClick={this._designTypesSelect}>
		  {config.designTypes.map(function (val) {
			return <Item key={val}>{val}</Item>
		  })}
		</Menu>
	)
	
	return this.props.children ||
		  <div>
				<div style={{float:'left',paddingTop:'12px'}}>
					<Search
						placeholder="搜索设计师名称"
						className={style.inputSearch}
						onSearch={value => {
              this._getDesigners(this.state.designerTypes, this.state.designTypes, value)
							this.setState({query:value})
            }}
					/>
				</div>
			<Row type="flex" justify="end">
			  <Col>
				<Dropdown overlay={designerTypesMenu} placement="bottomCenter" trigger={['click']}>
				  <button className='yellowButton'>
			  <span className='fontBox'>
                      {this.state.designerTypes || "设计师类别"}
				{/*<img src="./resource/images/ChevronRight-128.png"></img>*/}
			  </span>
				  </button>
				</Dropdown>
			  </Col>
			  <Col>
				<Dropdown overlay={designTypesMenu} placement="bottomCenter" trigger={['click']}>
				  <button className='blueButton'>
                        <span className='fontBox'>
                          {this.state.designTypes || "设计分类"}
						  {/*<img src="./resource/images/ChevronRight-128.png"></img>*/}
                        </span>
				  </button>
				</Dropdown>
			  </Col>
			  <Col>
				<button onClick={()=>{
					if(this.state.check_uuid.length === undefined || this.state.check_uuid.length === 0){
                        message.error("未选中用户！")
					}else {
                        this.setState({allDeleteVisible: true});
                    }
				}} className='greyButton'><span
					className='fontBox'> 批量删除</span></button>
			  </Col>
			</Row>
			<div className="content">
			  <Table columns={columns}
					 rowKey="uniqueid"
					 rowSelection={rowSelection}
					 dataSource={this.data}
					 className="table"
					 loading={this.state.all_loading}
					 pagination={{
					 		total: this.total,
							simple: true,
						 	current:this.state.current,
						 	onChange: (page, pageSize) => {
					 			this.setState({current:page});
							 	this._getDesigners(this.state.designTypes, this.state.designerTypes, this.state.query, page)
						 	}
					 }}/>
			</div>

			  <Modal
				  style={{top: "40vh"}}
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

			<Modal
				style={{top: "40vh"}}
				visible={this.state.deleteVisible}
				onCancel={this._onCancel}
				footer={null} width="320px"
				closable={false}>
			  <div style={{fontSize: '18px', textAlign: 'center', marginTop: "28px"}}>
				<span style={{color: '#424242'}}>确认删除用户？</span>
			  </div>
			  <Row type="flex" justify="end" style={{marginTop: '21px'}}>
				<Col>
				  <a onClick={this._onOk}
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
		  </div>
  }
}

function mapStateToProps(state) {
  return {
	DesignersState: state.DesignersState,
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
)(Designers);