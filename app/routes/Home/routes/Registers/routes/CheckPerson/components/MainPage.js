import React from 'react'
import {Link} from 'react-router'
import Left from './Left'
import Right from './Right'
import services from '../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import config from "../../../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import {message,Spin} from 'antd'

class MainPage extends React.Component {
  state={
    loading:false
  }
  constructor(props) {
	super(props);
	this._getPerson = this._getPerson.bind(this);
  }
  
  componentDidMount() {
	this._getPerson();
  }
  
  _getPerson() {
	let {dispatch} = this.props
	let uniqueid = this.props.location.state.uniqueid;
	this.setState({loading:true});
	services.createServiceRequest.Service(config.api.WebGetUserInfo, {uniqueid: uniqueid}, (success) => {
	  dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_PERSON_SCHEMA, (model) => model)(success))
	  this.setState({loading:false})
	}, (failed) => {
	  message.error(failed)
	})
  }
  
  render() {
	let {user} = this.props.CheckPersonState;
	let {uniqueid,nature,check}= this.props.location.state;
	let router = this.props.router
	return (<div className="content" style={{overflow: 'hidden'}}>
		
		  <a onClick={() => {
			router.goBack()
		  }}
			 style={{float: "right", fontSize: "12px", color: "#6e95d3", textDecoration: "underline"}}>
			返回上一级
		  </a>
			<Spin spinning={this.state.loading}>
		  <Left style={{float: 'left'}} user={user}/>
		  {this.props.children ||
		  <div>
			<Right user={user} />
			<Link to={{pathname: "/home/registers/checkperson/checkperson2", state: {user: user,...this.props.location.state}}}
				  style={{float: "right", fontSize: "14px", color: "#ca9428", textDecoration: "underline"}}>
			  Next
			</Link>
		  </div>
		  }
		  </Spin>
		</div>
	)
  }
}

function mapStateToProps(state) {
  return {
	CheckPersonState: state.CheckPersonState,
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
