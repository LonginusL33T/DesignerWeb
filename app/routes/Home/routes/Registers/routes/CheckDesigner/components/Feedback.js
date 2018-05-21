import React, {Component} from 'react'
import {Layout, Row, Table, Col, Input, Form,Spin} from 'antd'
import ActivityImage from './ActivityImage'
import ActivityList from './ActivityList'

const {Content, Sider} = Layout;
import {connect} from 'react-redux'
import config from "../../../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import {message} from 'antd'
import services from '../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'

class Feedback extends Component {
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
	services.createServiceRequest.Service(config.api.WebGetUserInfo, {uniqueid: uniqueid}, (success) => {
	  dispatch(createAction(ActionTypes.ACT_REGISTERS_GET_PERSON_SCHEMA, (model) => model)(success))
	}, (failed) => {
	  message.error(failed)
	})
  }
  
  render() {
	let {user} = this.props.CheckPersonState;
	return (
		<Layout >
		  <Content>
			<div className="container">
			  <Spin spinning={this.state.loading}>
			  <Row className="header">
			  </Row>
			  <Row gutter={24} className="content">
				<Col span={6}>
				  <ActivityImage user={user}/>
				</Col>
				<Col span={18}>
				  <ActivityList {...this.props} onChange={(loading)=>{this.setState({loading:loading})}} />
				</Col>
			  </Row>
			  </Spin>
			</div>
		  </Content>
		</Layout>
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
)(Feedback);