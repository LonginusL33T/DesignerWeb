import React from 'react'
import style from "../resource/Right.css"
import config from '../../../../../../../framework/config/config'
import {Modal} from 'antd'
import Box from './Box'

export default class Right extends React.Component {
  state = {
	visible: false,
	src:''
  }
  
  constructor(props) {
	super(props);
	this._onCancel = this._onCancel.bind(this);
	this._showModal = this._showModal.bind(this);
	
  }
  
  _onCancel() {
	this.setState({
	  visible: false
	})
  }
  
  _showModal(val) {
	this.setState({
	  visible: true,
	  src:val
	})
  }
  
  render() {
	let {user} = this.props;
	let business_licence = user.business_licence||[]
	return (
		<div style={{...this.props.style}}>
		  <div>
			<Box name={config.company.brand_name} content={user.brand_name}
				 style={{display: 'inline-block', marginRight: '27px'}}/>
			<Box name={config.company.size} content={user.size} style={{display: 'inline-block'}}/>
			<br/>
			<Box name={config.company.brand_num} content={user.brand_num}
				 style={{display: 'inline-block', marginRight: '27px', marginTop: "14px"}}/>
			<Box name={config.company.enterprise_nature} content={user.enterprise_nature}
				 style={{display: 'inline-block', marginTop: "14px"}}/>
		  </div>
		  <div style={{display: 'inline-block', float: "left"}}>
			<Box name={config.company.address} content={user.address} style={{marginTop: "14px"}}/>
			<Box name={config.company.telephone} content={user.telephone} style={{marginTop: "14px"}}/>
			<Box name={config.company.contact_telephone} content={user.contact_telephone} style={{marginTop: "14px"}}/>
			<Box name={config.company.email} content={user.email} style={{marginTop: "14px"}}/>
		  </div>
		  <div style={{display: 'inline-block', marginLeft: "27px", paddingTop: "14px", width: '20vw'}}>
			<span className="title">{config.company.business_licence}</span>
			<br/>
			{business_licence.map((val,ind) => {
			  return <a key={ind}><img src= {val==="noresouce"?"./resource/images/404.png":val} className={style.img} onClick={()=>{this._showModal(val)}}/></a>
			})}
			<div style={{marginTop: "22px"}}>
			  <span className="title">{config.company.business_contact_card}</span>
			  <br/>
			  <a><img src={user.business_contact_card==="noresouce"?"./resource/images/404.png":user.business_contact_card} className={style.img} onClick={()=>{this._showModal(user.business_contact_card)}}/></a>
			</div>
		  </div>
		  <Modal width="562px" footer={null} onCancel={this._onCancel} visible={this.state.visible}>
			<img style={{width:'530px'}} src={this.state.src==="noresouce"?"./resource/images/404.png":this.state.src}/>
		  </Modal>
		</div>
	)
  }
}