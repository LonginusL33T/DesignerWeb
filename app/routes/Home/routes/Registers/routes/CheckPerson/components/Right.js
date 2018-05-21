import React from 'react'
import Box from "./Box"
import config from '../../../../../../../framework/config/config'
import moment from 'moment'
import {Modal} from 'antd'

export default class Right extends React.Component {
  state = {
	visible: false,
	sec: ''
  }
  constructor(props) {
	super(props);
	this._cancel = this._cancel.bind(this);
	this._show = this._show.bind(this);
  }
  
  _cancel() {
	this.setState({
	  visible: false
	})
  }
  
  _show(val) {
	this.setState({
	  visible: true,
	  src: val
	})
  }
  
  render() {
	let {user} = this.props;
	let resumes = user.resumes || [];
	return (
		<div style={{marginTop: '100px', width: '80vw'}}>
		  {Object.keys(config.person).slice(5, 22).map( (val, index) =>{
			if (val === 'works' && val in user)
			  return (
				  <div key={index}
					   style={{
						 display: 'inline-block',
						 verticalAlian:'top',
						 marginRight: '27px',
						 marginTop: '14px',
						 width: "24vw"
					   }}>
					<span className="title">{config.person[val] + ':'}</span>
					{user.works.map( (val, ind) =>{
					  return (
						  <a key={ind}>
							<img src={val === 'noresouce' ? "./resource/images/404.png" : val}
								 style={{
								   backgroundColor: '#d3d3d3',
								   width: '56px',
								   height: '56px',
								   verticalAlign: 'text-top',
								   marginLeft: '8px'
								 }}
								 onClick={() => {
								   this._show(val)
								 }}
							/>
						  </a>
					  )
					})
					}
				  </div>)
			if (val === 'birth_time' && val in user)
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
					   style={{display: 'inline-block', marginRight: '27px', marginTop: '10px'}}/>
			  )
		  })
		  }
		  <Modal footer={null} width="512px" style={{top: "10vh"}} onCancel={this._cancel}
				 visible={this.state.visible}>
			<img src={this.state.src === "noresouce" ? "./resource/images/404.png" : this.state.src}
				 style={{width: '480px', textAlign: 'center'}}/>
		  </Modal>
		</div>
	)
  }
}
