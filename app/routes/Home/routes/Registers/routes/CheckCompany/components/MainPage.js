import React from 'react'
import Left from './Left'
import Right from './Right'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'
import config from "../../../../../../../framework/config/config"
import services from '../../../../../../../framework/utils/MeshService'
import {message,Spin} from 'antd'

import {Link} from 'react-router'
class MainPage extends React.Component{
  state={
    loading:false
  }
  constructor(props){
	super(props);
	this._getCompany= this._getCompany.bind(this);
	this._pass = this._pass.bind(this);
	this._unpass = this._unpass.bind(this);
  }
  componentDidMount() {
	this._getCompany();
  }
  _pass(){
	
	let {uniqueid,nature,check,page} = this.props.location.state;
	let router = this.props.router
	let {dispatch} = this.props
	let data = {}
	if (nature)
	  data.category = nature
	if (check)
	  data.status = check
	services.createServiceRequest.Service(config.api.WebVerifyRegistionAccept,{uniqueid:uniqueid},(success)=>{
	  services.createServiceRequest.Service(config.api.WebVerifyRegistion,data,(success)=>{
		dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS,(model)=>model)(success))
		message.success('审核通过');
		router.push('/home/registers/');
	  },(failed)=>{
		message.error(failed)
	  },page-1||0,10)
	},(failed)=>{
	  message.error(failed)
	})
  }
  _unpass(){
	let {uniqueid,nature,check,page}= this.props.location.state;
	let router = this.props.router
	let {dispatch} = this.props
	let data = {}
	if (nature)
	  data.category = nature
	if (check)
	  data.status = check
	services.createServiceRequest.Service(config.api.WebVerifyRegistionReject,{uniqueid:uniqueid},(success)=>{
	  services.createServiceRequest.Service(config.api.WebVerifyRegistion,data,(success)=>{
		dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_REGISTERS_SCHEMAS,(model)=>model)(success))
		message.success('审核不通过');
		router.push('/home/registers/');
	  },(failed)=>{
		message.error(failed)
	  },page-1||0,10)
	  
	},(failed)=>{
	  message.error(failed)
	})
  }
  _getCompany(){
	let {dispatch} = this.props
	this.setState({loading:true});
	let uniqueid = this.props.location.state.uniqueid;
	services.createServiceRequest.Service(config.api.WebGetUserInfo,{uniqueid:uniqueid},(success)=>{
	  dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_COMPANY_SCHEMA,(model)=>model)(success))
	  this.setState({loading:false})
	},(failed)=>{
	  message.error(failed)
	})
  }
  render(){
	let {user} = this.props.CheckCompanyState;
	let uniqueid = this.props.location.state.uniqueid;
	let router=this.props.router
	return(<div  className="content" style={{overflow:'hidden'}}>
	  
	  <a onClick={()=>{router.goBack()}} style={{float:"right",fontSize:"12px",color:"#6e95d3",textDecoration:"underline"}}>返回上一级</a>
	 <Spin spinning={this.state.loading}>
	   <Left style={{float:'left'}} user={user}/>
	  <Right  style={{marginTop:'100px'}} user={user}/>
	  <div style={{clear:"both"}}>
		<button  className='greyButton' onClick={this._unpass} style={{height:'34px',width:'110px',float:"right",marginBottom:'40px'}}>
		<span className='fontBox' >
		  不通过
		</span>
		</button>
		<button  className='yellowButton' onClick={this._pass} style={{float:"right",marginRight:'20px',height:'34px',width:'110px',marginBottom:'40px'}}>
		<span className='fontBox' >
		  审核通过
		</span>
		</button>
	  </div>
	 </Spin>
	</div>)
  }
}
function mapStateToProps(state) {
  return {
	CheckCompanyState: state.CheckCompanyState,
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
)(MainPage);