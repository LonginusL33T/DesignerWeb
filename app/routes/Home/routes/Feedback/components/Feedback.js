import React, {Component} from 'react'
import {Modal, Row, Table, Col, Input, Form, message} from 'antd'
import style from "../resource/Feedback.css"
import config from "../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import services from '../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'

class Feedback extends Component {
  state = {
	current: 1,
	src: '',
	loading: false,
  }
  
  constructor(props) {
	super(props);
	this.state = {visible: false};
	this._FeedbackUser = this._FeedbackUser.bind(this);
	this._FeedbackDetail = this._FeedbackDetail.bind(this);
	this._showModal = this._showModal.bind(this);
	this._hideModal = this._hideModal.bind(this);
	this._getFeedback = this._getFeedback.bind(this);
	
  }
  
  componentDidMount() {
	this._getFeedback();
  }
  
  _getFeedback(page) {
	this.setState({loading: true});
	let {dispatch} = this.props
	services.createServiceRequest.Service(config.api.WebGetFeedBacks, {}, (success) => {
	  dispatch(createAction(ActionTypes.ACT_FEEDBACK_GET_FEEDBACK_SCHEMA, (model) => model)(success))
	  this.setState({loading: false});
	}, (failed) => {
	  message.error(failed)
	}, page - 1, 3)
  }
  
  _FeedbackDetail(value, record, index) {
	return <div style={{height: "84px"}}>
	  <div style={{float: "left", width: "55%", marginTop: "14px", textAlign: "left"}}>
		<div dangerouslySetInnerHTML={{__html:record.content.replace(/\n/g,'<br/>')}}></div>
	  </div>
	  <div style={{float: "left", width: "23%", textAlign: "left", marginLeft: "26px", marginTop: "22px"}}>
		{record.image1 !== 'noresouce' ?
			<a onClick={() => this._showModal(record.image1)}>
			  <img src={record.image1}
				   style={{
					 height: "40px",
					 width: "60px",
					 background: "#626262",
					 marginRight: "8px"
				   }}/>
			</a> : null}
		{record.image2 !== 'noresouce' ?
			<a onClick={() => this._showModal(record.image2)}>
			  <img src={record.image2}
				   style={{
					 height: "40px",
					 width: "60px",
					 background: "#626262",
					 marginRight: "8px"
				   }}/>
			</a> : null}
		{record.image3 !== 'noresouce' ?
			<a onClick={() => this._showModal(record.image3)}>
			  <img src={record.image3}
				   style={{
					 height: "40px",
					 width: "60px",
					 background: "#626262",
					 marginRight: "8px"
				   }}/>
			</a> : null}
	  </div>
	  <div style={{float: "left", textAlign: "center", marginTop: "36px"}}>
		<span style={{color: "#6e95d3"}}>{record.time || "0000-00-00"}</span>
	  </div>
	</div>
  }
  
  _FeedbackUser(value, record, index) {
	return <div style={{height: "84px", textAlign: "center"}}>
	  <p style={{fontSize: "14px", color: "#6e95d3", marginTop: "32px"}}>{record.username}</p>
	  <p style={{fontSize: "12px", color: "#636363"}}>{record.category === "company" ? '企业' : '个人'}</p>
	</div>
  }
  
  _hideModal = () => {
	this.setState({
	  visible: false,
	});
  }
  
  _showModal = (key) => {
	this.setState({
	  visible: true,
	  src: key
	});
  }
  
  render() {
	let FeedbackState = this.props.FeedbackState
	let dataSource = FeedbackState.feedbacks
	let total = FeedbackState.total
	const columns = [{
	  title: '用户',
	  dataIndex: 'username',
	  key: 'username',
	  width: '10%',
	  render: this._FeedbackUser
	}, {
	  title: '问题反馈',
	  dataIndex: 'content',
	  key: 'content',
	  width: '90%',
	  render: this._FeedbackDetail
	}];
	
	return (
		<div className="content">
		  <Table dataSource={dataSource} loading={this.state.loading} rowKey="uniqueid" columns={columns}
				 pagination={{
				   onChange: (page, pageSize) => {
					
					 this._getFeedback(page)
				   },
				   total: total,
				   simple: "true",
				   defaultPageSize: 3
				 }}/>
		  
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
			<img src={this.state.src} style={{width: '548px'}}>
			
			</img>
		  </Modal>
		
		</div>
	)
  }
}

function mapStateToProps(state) {
  return {
	FeedbackState: state.FeedbackState,
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
)(Feedback)