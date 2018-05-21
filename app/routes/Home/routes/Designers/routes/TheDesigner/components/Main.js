import React from 'react'
import Left from './Left'
import Right from './Right'
import services from '../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import config from "../../../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import {Tabs, Table, Modal, Form, Button, message, Input, Spin} from 'antd'
import {Link} from 'react-router'

class Main extends React.Component {
  constructor(props) {
	super(props);
  }
  
  componentDidMount() {
	this.props.form.validateFields();
  }
  
  render() {
	var uniqueid = this.props.location.state.uniqueid;
	return (
		<div className="content">
		  
		  <a onClick={() => {
			this.props.router.goBack()
		  }}
			 style={{
			   float: "right",
			   marginTop: "28px",
			   marginRight: "30px",
			   fontSize: "12px",
			   color: "#6e95d3",
			   textDecoration: "underline"
			 }}>
			返回上一级
		  </a>
		  <Left style={{float: 'left'}} uniqueid={uniqueid}/>
		  
		  <Right style={{marginTop: '63px'}} {...this.props} uniqueid={uniqueid}/>
		</div>
	)
  }
}

function mapStateToProps(state) {
  return {
	DesignersDetailState: state.DesignersDetailState,
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
)(Form.create()(Main))