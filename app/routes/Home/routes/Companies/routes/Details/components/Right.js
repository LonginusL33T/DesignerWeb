import React from 'react'
import style from "../resource/Right.css"
import config from '../../../../../../../framework/config/config'
import services from '../../../../../../../framework/utils/MeshService';
import {connect} from 'react-redux'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {Tabs, Table, Modal, Form, Button, message, Input, Spin} from 'antd';

const TabPane = Tabs.TabPane;

const FormItem = Form.Item;


class Left extends React.Component {
  
 
  
  constructor(props) {
	super(props);
	this.state = {visible: false, loading: false,loadingRecruits:false, all_loading: true};
	this._RecruitmentDetails = this._RecruitmentDetails.bind(this);
	this._RecruitmentOther = this._RecruitmentOther.bind(this);
	this._showModal = this._showModal.bind(this);
	this._hideModal = this._hideModal.bind(this);
	this._save = this._save.bind(this);
  }
  componentDidMount() {
	this.props.form.validateFields();
	this._getRecruits()
  }
  
  _getRecruits =(page)=>{
	let {dispatch} = this.props;
	this.setState({loadingRecruits:true});
	services.createServiceRequest.Service(config.api.WebGetRecruit, data, (success) => {
	  console.log(success);
	  dispatch(createAction(ActionTypes.ACT_COMPANIES_GET_RECRUIT_SCHEMAS, (model) => model)(success))
	  this.setState({loadingRecruits:false})
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 3)
  }
  
  _save = () => {
	let {Companies} = this.props;
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  let data = {
		uniqueid: Companies.uniqueid,
		name: Companies.name,
		registion_place: Companies.registion_place,
		brand_num: values.Own_Brand_Quantity,
		brand_name: values.Own_Brand_Name,
		address: values.Contact_Address,
		telephone: values.Fixed_Telephone,
		contact_phone: values.Contact_Phone,
		email: values.Email,
		size: values.Company_Size,
		enterprise_nature: values.Company_Nature,
	  };
	  services.createServiceRequest.Service(
		  config.api.WebUpdateCompany,
		  data,
		  (success) => {
			this.setState({loading: false});
			message.success(success);
		  },
		  (failed) => {
			this.setState({loading: false});
			message.error(failed);
		  }
	  );
	});
  }
  
  _hideModal = () => {
	this.setState({
	  visible: false,
	});
  };
  
  _showModal = (key) => {
	this.setState({
	  visible: true,
	});
  }
  
  _RecruitmentDetails(value, record, index) {
	return <div className={style.table_div}>
	  <span className={style.table_title}>服装设计师</span>
	  <div style={{marginTop: '14px'}}>
		<span className={style.table_text}>服装设计师</span>
		<br/>
		<span className={style.table_text}>服装设计师</span>
		<br/>
		<span className={style.table_text}>服装设计师</span>
		<br/>
		<span className={style.table_text}>服装设计师</span>
	  </div>
	</div>
  }
  
  _RecruitmentOther(value, record, index) {
	return <div className={style.table_other_div}>
	  <p className={style.table_time}>2017-09-07</p>
	  <p className={style.table_action}>
		<a className={style.table_action_watch} onClick={() => this._showModal(record.key)}>查看详情 </a>
		<a onClick={() => this._showModal(record.key)}> 服装设计师</a>
	  </p>
	</div>
  }
  
  render() {
	const dataSource = [{
	  key: '1',
	  name: '胡彦斌',
	  age: 32,
	  address: '西湖区湖底公园1号'
	}, {
	  key: '2',
	  name: '胡彦祖',
	  age: 42,
	  address: '西湖区湖底公园1号'
	}];
	
	const columns = [{
	  width: '75%',
	  title: '姓名',
	  dataIndex: 'name',
	  key: 'name',
	  render: this._RecruitmentDetails
	}, {
	  width: '25%',
	  title: '年龄',
	  dataIndex: 'age',
	  key: 'age',
	  render: this._RecruitmentOther
	}];
	
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	
	var {Companies} = this.props;
	return (
		<div style={{...this.props.style}}>
		  <Spin delay={500} spinning={this.state.all_loading}>
			<Tabs defaultActiveKey="1">
			  <TabPane tab="企业信息" key="1">
				<div>
				  <Form>
					<FormItem style={{float: "left"}}>
					  <p className="title">自有品牌名称</p>
					  {getFieldDecorator('Own_Brand_Name')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<FormItem style={{float: "left"}}>
					  <p className="title">企业规模</p>
					  {getFieldDecorator('Company_Size')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<FormItem style={{float: "left"}}>
					  <p className="title">自有品牌数量</p>
					  {getFieldDecorator('Own_Brand_Quantity')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<FormItem style={{float: "left"}}>
					  <p className="title">企业性质</p>
					  {getFieldDecorator('Company_Nature')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<div style={{display: 'inline-block', float: "left"}}>
					  <FormItem>
						<p className="title">联系地址</p>
						{getFieldDecorator('Contact_Address')(
							<Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
						)}
					  </FormItem>
					  <FormItem>
						<p className="title">固定电话</p>
						{getFieldDecorator('Fixed_Telephone')(
							<Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
						)}
					  </FormItem>
					  <FormItem>
						<p className="title">联系人电话</p>
						{getFieldDecorator('Contact_Phone')(
							<Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
						)}
					  </FormItem>
					  <FormItem>
						<p className="title">电子邮箱</p>
						{getFieldDecorator('Email')(
							<Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
						)}
					  </FormItem>
					</div>
					<div style={{display: 'inline-block', marginLeft: "27px", paddingTop: "14px"}}>
					  <span className="title">{config.companyKeys.license}</span>
					  <br/>
					  <a><img src="./resource/images/404.png" className={style.img}
							  onClick={this._showModal}/></a>
					  <a><img src="./resource/images/404.png" className={style.img}
							  onClick={this._showModal}/></a>
					  <a><img src="./resource/images/404.png" className={style.img}
							  onClick={this._showModal}/></a>
					  <div style={{marginTop: "22px"}}>
						<span className="title">{config.companyKeys.business_card}</span>
						<br/>
						<a><img src="./resource/images/404.png" className={style.img}
								onClick={this._showModal}/></a>
					  </div>
					  <FormItem>
						<Button loading={this.state.loading} type="primary" onClick={this._save}
								style={{float: "right", marginTop: "180px"}}>保存</Button>
					  </FormItem>
					</div>
					<Modal footer={null} onCancel={this._onCancel} visible={this.state.visible}>
					  <img src="./resource/images/404.png"/>
					</Modal>
				  </Form>
				</div>
			  </TabPane>
			  
			  <TabPane tab="招聘信息" key="2">
				<Table
					style={{marginRight: '100px', marginTop: '21px'}}
					dataSource={dataSource}
					columns={columns}
					showHeader={false}
					pagination={{
					  defaultPageSize: 3,
					  total: total,
					  simple: true,
					  onChange: (page, pageSize) => {
					
					  }
					}}/>
			  </TabPane>
			</Tabs>
			<Modal
				width={'580px'}
				footer={false}
				visible={this.state.visible}
				onCancel={this._hideModal}
				/*title={title}
						onOk={this._hideModal}
						okText="确认"
						cancelText="取消"*/
			>
			  <div style={{height: '680px'}}>
				{
				  config.recruiters.map(function (index) {
					return (
						<div key={index} style={{margin: '60px 17px 0px 17px'}}>
						  <div>
							<img style={{
							  backgroundColor: '#d3d3d3', width: '76px', height: '76px',
							  verticalAlign: 'text-top', borderRadius: '50%'
							}}/></div>
						  <div>
							<span style={{color: "#525252", fontSize: "16px"}}>XXXXXXX</span></div>
						</div>
					)
				  })
				}
			  </div>
			</Modal>
		  </Spin>
		</div>
	)
  }
}
function mapStateToProps(state) {
  return {
	CompaniesDetailState: state.CompaniesDetailState,
  }
}
function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(Left))