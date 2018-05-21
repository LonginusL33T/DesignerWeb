import React from 'react'
import Box from '../../../components/Box'
import config from '../../../../../../../../../framework/config/config'
import services from '../../../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../../../framework/action/ActionTypes'
import {Modal, message} from 'antd'
import {createAction} from 'redux-actions'
import {connect} from 'react-redux'

class MainPage extends React.Component {
  state = {
	visible: false,
	src:''
  }
  
  constructor(props) {
	super(props);
	this._cancel = this._cancel.bind(this);
	this._show = this._show.bind(this);
	this._pass = this._pass.bind(this);
	this._unpass = this._unpass.bind(this);
  }
  
  _cancel() {
	this.setState({
	  visible: false
	})
  }
  
  _show(val) {
	this.setState({
	  visible: true,
	  src:val
	})
  }
  
  _pass() {
	let {uniqueid, nature, check, page} = this.props.location.state;
	let router = this.props.router
	let {dispatch} = this.props
	let data = {}
	if (nature)
	  data.category = nature
	if (check)
	  data.status = check
	services.createServiceRequest.Service(config.api.WebVerifyRegistionAccept, {uniqueid: uniqueid}, (success) => {
	  services.createServiceRequest.Service(config.api.WebVerifyRegistion, data, (success) => {
		dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS, (model) => model)(success))
		message.success('审核通过');
		router.push('/home/registers/');
	  }, (failed) => {
		message.error(failed)
	  }, page - 1 || 0, 10)
	}, (failed) => {
	  message.error(failed)
	})
  }
  
  _unpass() {
	let {uniqueid, nature, check, page} = this.props.location.state;
	let router = this.props.router
	let {dispatch} = this.props
	let data = {}
	if (nature)
	  data.category = nature
	if (check)
	  data.status = check
	services.createServiceRequest.Service(config.api.WebVerifyRegistionReject, {uniqueid: uniqueid}, (success) => {
	  
	  services.createServiceRequest.Service(config.api.WebVerifyRegistion, data, (success) => {
		dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS, (model) => model)(success))
		message.success('审核不通过');
		router.push('/home/registers/');
	  }, (failed) => {
		message.error(failed)
	  }, page - 1 || 0, 10)
	  
	}, (failed) => {
	  message.error(failed)
	})
  }
  
  render() {
	let {user} = this.props.location.state;
	return (
		<div style={{marginTop: '100px'}}>
		  {Object.keys(config.person).slice(22, 28).map((val, index) => {
			if (val === 'resume')
			  return (<div key={index}
						   style={{height: '56px', marginRight: '27px', marginTop: '14px'}}>
				<span className="title">{config.person[val] + ':'}</span>
				{user.resumes.map((val,ind) => {
				  return(
				  <a key={ind}>
					<img style={{
					  backgroundColor: '#d3d3d3',
					  width: '56px',
					  height: '56px',
					  verticalAlign: 'text-top',
					  marginLeft: '8px'
					}}
						 src={val==='noresouce'?"./resource/images/404.png":val}
						 onClick={()=>{this._show(val)}}
					/>
				  </a>
				  )
				})
				}
				<Modal footer={null} width="512px" style={{top: "10vh"}} onCancel={this._cancel}
					   visible={this.state.visible}>
				  <img src={this.state.src==="noresouce"?"./resource/images/404.png":this.state.src}
					   style={{width: '480px', textAlign: 'center'}}/>
				</Modal>
			  </div>)
			if (val === 'production'&& val in user && !user[val])
			{
			  return ;
			}
			if (val === 'regitration_time' && val in user)
			{
			  return (
				  <Box name={config.person[val] + ':'}
					   key={index}
					   content={new Date(parseInt(user[val]) * 1000).toLocaleDateString()}
					   style={{display: 'inline-block', marginRight: '27px', marginTop: '10px',verticalAlign:'top'}}/>
			  )
			}
			if (val in user)
			  return (
				  <Box name={config.person[val] + ':'}
					   key={index}
					   content={user[val]}
					   style={{marginRight: '27px', marginTop: '10px'}}/>
			  )
		  })
		  }
		  <div style={{clear: "both"}}>
			<button className='greyButton' onClick={this._unpass}
					style={{height: '34px', width: '110px', float: "right", marginBottom: '40px'}}>
		<span className='fontBox'>
		  不通过
		</span>
			</button>
			<button className='yellowButton' onClick={this._pass}
					style={{float: "right", marginRight: '20px', height: '34px', width: '110px', marginBottom: '40px'}}>
		<span className='fontBox'>
		  审核通过
		</span>
			</button>
		  </div>
		</div>
	)
  }
}

function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

module.exports = connect(
	mapDispatchToProps
)(MainPage);