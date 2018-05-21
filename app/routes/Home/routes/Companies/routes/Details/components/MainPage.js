import React from 'react'
import Left from './Left'
import style from "../resource/Right.css"
import services from '../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import config from "../../../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import {Tabs, Table, Modal, Form, Button, message, Input, Spin, Pagination} from 'antd'

const {TextArea} = Input;
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;

class MainPage extends React.Component {
  
  
  constructor(props) {
	super(props);
	this._getCompany = this._getCompany.bind(this);
	this.state = {
	  src: "",
	  recruitsVisible: false,
	  imgVisible:false,
	  visible: false,
	  loadingRecruits: false,
	  loadingApply: false,
	  loading: false,
	  all_loading: true,
	  user: {
		business_licence: [],
		business_contact_card: []
	  },
	  Companies: {}
	};
	this._RecruitmentDetails = this._RecruitmentDetails.bind(this);
	this._RecruitmentOther = this._RecruitmentOther.bind(this);
	this._showModal = this._showModal.bind(this);
	this._hideModal = this._hideModal.bind(this);
	this._save = this._save.bind(this);
  }
  
  
  componentDidMount() {
	this._getCompany();
	this._getRecruits();
	this.props.form.validateFields();
  }
  
  _getRecruits = (page) => {
	let {dispatch} = this.props;
	let uniqueid = this.props.location.state.uniqueid;
	this.setState({loadingRecruits: true});
	services.createServiceRequest.Service(config.api.WebGetRecruit, {uniqueid: uniqueid}, (success) => {
	  dispatch(createAction(ActionTypes.ACT_COMPANIES_GET_RECRUIT_SCHEMAS, (model) => model)(success))
	  this.setState({loadingRecruits: false})
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 3)
  }
  _getApply = (uniqueid, page) => {
	let {dispatch} = this.props;
	this.setState({loadingApply: true});
	services.createServiceRequest.Service(config.api.WebGetApplyByCompany, {uniqueid: uniqueid}, (success) => {
	  dispatch(createAction(ActionTypes.ACT_COMPANIES_GET_APPLY_SCHEMAS, (model) => model)(success))
	  this.setState({loadingApply: false})
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 20)
  }
  
  _getCompany() {
	let {dispatch} = this.props;
	let uniqueid = this.props.location.state.uniqueid;
	services.createServiceRequest.Service(config.api.WebGetUserInfo, {uniqueid: uniqueid}, (success) => {
	  dispatch(createAction(ActionTypes.ACT_COMPANIES_GET_DETAIL_SCHEMAS, (model) => model)(success));
	  this.setState({all_loading: false, user: success.user});
	  this.props.form.setFieldsValue({
		Own_Brand_Name: success.user.brand_name,
		Own_Brand_Quantity: success.user.brand_num,
		Contact_Address: success.user.address,
		Fixed_Telephone: success.user.telephone,
		Contact_Phone: success.user.contact_telephone,
		Email: success.user.email,
		Company_Size: success.user.size,
		Company_Nature: success.user.enterprise_nature
	  })
	}, (failed) => {
	  message.error(failed)
	})
  }
  
  _save = (Companies) => {
	let {dispatch} = this.props;
	let router = this.props.router
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  let data = {
		uniqueid: this.props.location.state.uniqueid,
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
		    let{size, enterprise_nature, page} = this.props.location.state
		    this._getCompanies(size, enterprise_nature, page)
			
		  },
		  (failed) => {
			this.setState({loading: false});
			message.error(failed);
		  }
	  );
	});
  }
  
  _getCompanies = (size, enterprise_nature, page) =>{
	let {dispatch,router} = this.props;
	let data = {};
	if (size)
	  data.size = size;
	if (enterprise_nature)
	  data.nature = enterprise_nature;
	services.createServiceRequest.Service(config.api.WebGetCompanys, data, (success) => {
	  dispatch(createAction(ActionTypes.ACT_COMPANIES_GET_COMPANIES_SCHEMAS, (model) => model)(success));
	  this.setState({loading: false});
	  message.success("修改成功！");
	  router.push('/home/companies/');
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 10)
  }
  _hideModal = () => {
	this.setState({
	  imgVisible:false,
	  visible: false,
	  recruitsVisible: false
	});
  }
  _showImgModal=(key)=>{
	this.setState({
	  imgVisible: true,
	  src: key
	});
  }
  _showModal = (key) => {
	this.setState({
	  visible: true,
	  index: key
	});
	const {recruit} = this.props.CompaniesDetailState;
	this._getApply(recruit[key].uniqueid, 1)
  }
  _showRecruitsModal = (key) => {
	this.setState({
	  recruitsVisible: true,
	  index: key
	});
  }
  
  _RecruitmentDetails(value, record, index) {
	return <div className={style.table_div}>
	  <span className={style.table_title}>{record.category}</span>
	  <div
		  dangerouslySetInnerHTML={{__html: record.job_detail.replace(/\n/g, '<br/>')}}
		  style={{marginTop: '14px',}}
		  className={style.table_text}>
	  </div>
	</div>
  }
  
  _RecruitmentOther(value, record, index) {
	return <div className={style.table_other_div}>
	  <p className={style.table_time}>{record.time}</p>
	  <p className={style.table_action}>
		<a className={style.table_action_watch} onClick={() => this._showRecruitsModal(index)}>查看详情 </a>
		<a onClick={() => this._showModal(index)}>查看应聘人员</a>
	  </p>
	</div>
  }
  
  render() {
	const columns = [{
	  width: '75%',
	  title: '姓名',
	  dataIndex: 'experience',
	  key: 'experience',
	  render: this._RecruitmentDetails
	}, {
	  width: '25%',
	  title: '年龄',
	  dataIndex: 'time',
	  key: 'time',
	  render: this._RecruitmentOther
	}];
	
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	const uniqueid = this.props.location.state.uniqueid;
	const {Companies, recruit, recruitTotal, apply, applyTotal} = this.props.CompaniesDetailState;
	let index = this.state.index || 0;
	let rec = recruit[index] || {};
	return (<div className="content" style={{overflow: 'hidden'}}>
	  <a onClick={() => this.props.router.goBack()} style={{
		float: "right",
		marginTop: "28px",
		marginRight: "30px",
		fontSize: "12px",
		color: "#6e95d3",
		textDecoration: "underline"
	  }}>返回上一级</a>
	  <Left style={{float: 'left'}} Companies={Companies}/>
	  
	  <div style={{marginTop: '63px'}}>
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
				  <FormItem style={{float: "left", marginTop: "-18px"}}>
					<p className="title">自有品牌数量</p>
					{getFieldDecorator('Own_Brand_Quantity')(
						<Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					)}
				  </FormItem>
				  <FormItem style={{float: "left", marginTop: "-18px"}}>
					<p className="title">企业性质</p>
					{getFieldDecorator('Company_Nature')(
						<Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					)}
				  </FormItem>
				  <div style={{display: 'inline-block', float: "left", marginTop: "-18px"}}>
					<FormItem>
					  <p className="title">联系地址</p>
					  {getFieldDecorator('Contact_Address')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<FormItem style={{marginTop: "-18px"}}>
					  <p className="title">固定电话</p>
					  {getFieldDecorator('Fixed_Telephone')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<FormItem style={{marginTop: "-18px"}}>
					  <p className="title">联系人电话</p>
					  {getFieldDecorator('Contact_Phone')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
					<FormItem style={{marginTop: "-18px"}}>
					  <p className="title">电子邮箱</p>
					  {getFieldDecorator('Email')(
						  <Input className={style.text} style={{display: 'inline-block', marginRight: '27px'}}/>
					  )}
					</FormItem>
				  </div>
				  <div style={{display: 'inline-block', marginTop: "-10px", float: "left"}}>
					<span className="title">{config.companyKeys.license}</span>
					<br/>
					<div style={{width: '24vw'}}>
					  {this.state.user.business_licence.map((val, ind) => {
						return (
							<a key={ind}>
							  <img src={val === 'noresouce' ? "./resource/images/404.png" : val}
								   style={{
									 width: '7vw',
									 height: '7vh',
									 verticalAlign: 'text-top',
									 marginLeft: '8px'
								   }}
								   onClick={() => {
									 this._showImgModal(val)
								   }}
							  />
							</a>
						
						)
					  })
					  }
					</div>
					
					<div style={{marginTop: "22px"}}>
					  <span className="title">{config.companyKeys.business_card}</span>
					  <br/>
					  <a>
						<img
							src={this.state.user.business_contact_card === 'noresouce' ? "./resource/images/404.png" : this.state.user.business_contact_card}
							style={{
							  width: '7vw',
							  height: '7vh',
							  verticalAlign: 'text-top',
							  marginLeft: '8px'
							}}
							onClick={() => {
							  this._showImgModal(this.state.user.business_contact_card)
							}}
						/>
					  </a>
					
					</div>
					<Button loading={this.state.loading} onClick={() => this._save(Companies)} style={{
					  color: "#c98f10",
					  width: "98px",
					  borderRadius: "6px",
					  float: "right",
					  marginTop: "180px",
					  borderColor: "#c98f10",
					  marginLeft: "15vw"
					}}>保存</Button>
				  </div>
				</Form>
			  </div>
			</TabPane>
			
			<TabPane tab="招聘信息" key="2">
			  <Table
				  style={{marginRight: '100px', marginTop: '21px'}}
				  dataSource={recruit}
				  columns={columns}
				  showHeader={false}
				  loading={this.state.loadingRecruits}
				  rowKey="uniqueid"
				  pagination={{
					defaultPageSize: 3,
					total: recruitTotal,
					simple: true,
					onChange: (page, pageSize) => {
					  this._getRecruits(page)
					}
				  }}
			  />
			</TabPane>
		  </Tabs>
		  <Modal width="562px" footer={null} onCancel={this._hideModal} visible={this.state.imgVisible}>
			<img style={{width:'530px'}} src={this.state.src==="noresouce"?"./resource/images/404.png":this.state.src}/>
		  </Modal>
		  <Modal footer={null} width="580px"
				 style={{top: "10vh"}}
				 onCancel={this._hideModal}
				 visible={this.state.recruitsVisible}
				 wrapClassName="modalClass">
			<div style={{fontSize: '14px', color: '#4a4a4a'}}>
			  <div style={{borderBottom: '1px solid #e5e5e5', padding: '28px 30px'}}>
				<div style={{marginBottom: '20px'}}>{'服装设计师'}</div>
				
				<div style={{marginBottom: '20px'}}>地址：{rec.address}</div>
				
				<div style={{marginBottom: '20px'}}>学历要求：{rec.educational_requirements}</div>
				
				<div>工作经验：{rec.experience}</div>
			  </div>
			  <div style={{borderBottom: '1px solid #e5e5e5', padding: '28px 30px 38px'}}>
				<div style={{marginBottom: '20px'}}>{'职位详情'}</div>
				<div
					dangerouslySetInnerHTML={{__html: (rec.job_detail || '').replace(/\n/g, '<br/>')}}>
				</div>
			  </div>
			  <div style={{borderBottom: '1px solid #e5e5e5', padding: '28px 30px '}}>
				<div style={{marginBottom: '20px'}}>{'技能要求'}</div>
				<div
					dangerouslySetInnerHTML={{__html: (rec.skills_requirements || '').replace(/\n/g, '<br/>')}}>
				</div>
			  </div>
			  <div style={{borderBottom: '1px solid #e5e5e5', padding: '28px 30px'}}>
				<div style={{marginBottom: '20px'}}>{'薪酬福利'}</div>
				<div
					dangerouslySetInnerHTML={{__html: (rec.compensation_benefit || '').replace(/\n/g, '<br/>')}}>
				</div>
			  </div>
			</div>
		  </Modal>
		  <Modal footer={null}
				 width="580px"
				 style={{top: "10vh"}}
				 onCancel={this._hideModal}
				 visible={this.state.visible}
				 wrapClassName="modalClass">
			<Spin spinning={this.state.loadingApply}>
			  <div style={{padding: '60px 15px 16px 15px'}}>
				{
				  apply.length > 0 ?
					  <div>
						{
						 apply.map((val) => {
							return (
								<a key={val.uniqueid}
								   onClick={()=>{this.props.router.push(
								   	{pathname: '/home/designers/thedesigner',
									  state: {page: '1', uniqueid: val.uniqueid}})}}>
								<div
									 style={{
									   margin: '0px 17px 60px',
									   display: 'inline-block',
									   verticalAlign:'text-top'
									 }}>
								  <div>
									{val.avatar === "noresouce" ?
										<img
											className={style.circle2}
											src="./resource/images/person.png"
										/> : <img
											className={style.circle}
											src={val.avatar}/>}
								  </div>
								  <div style={{
									color: "#525252",
									width: '76px',
									fontSize: "16px",
									textAlign: 'center',
									marginTop: '12px',
									wordWrap:'break-word'
								  }}>{val.username}
								  </div>
								</div>
								</a>
							)
						  })
						}
						<div style={{textAlign: 'right', marginTop: '-10px'}}>
						  <Pagination simple
									  total={applyTotal}
									  defaultPageSize={20}
									  onChange={(page, pageSize) => {
										let {recruit} = this.props.CompaniesDetailState;
										let {index} = this.state
										this._getApply(recruit[index].uniqueid, page)
									  }}
						  />
						</div>
					  </div> : <div style={{
						color: "#e5e5e5",
						fontSize: "16px",
						textAlign: 'center',
					  }}>
						暂无数据^-^
					  </div>
				}
			  </div>
			</Spin>
		  </Modal>
		</Spin>
	  </div>
	</div>)
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

module.exports = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainPage));
