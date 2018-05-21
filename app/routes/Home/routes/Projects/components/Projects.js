import React, {Component} from 'react'
import services from '../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'
import {connect} from 'react-redux'
import {Table, Layout, Row, Col, Button, Popconfirm, Spin} from 'antd'
import {Link} from 'react-router'

const {Content, Sider} = Layout;
const columns = [{
  title: 'uuid',
  dataIndex: 'uuid',
  key: 'uuid',
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '创建时间',
  dataIndex: 'created',
  key: 'created'
}, {
  title: '修改时间',
  dataIndex: 'edited',
  key: 'edited'
}, {
  title: '操作',
  dataIndex: 'operation',
  render: (text, record) => {
	return ( <span>
                <Link to={{pathname: "/home/projects/edit", state: {uuid: record.uuid, name: record.name}}}>修改</Link>
                <span className="ant-divider"/>
                <DeleteSchemas record={record}></DeleteSchemas>
            </span>)
  }
}];
var dispatch;

class DeleteSchemas extends Component {
  state = {
	deleteing: false
  }
  
  constructor() {
	super();
	this._deleteProjcet = this._deleteProjcet.bind(this);
  }
  
  _deleteProjcet() {
	this.setState({deleting: true});
	services.ProjectService.deleteProject(this.props.record.uuid, (success) => {
	  this.setState({deleteing: false});
	  services.ProjectService.projects((success) => {
		dispatch(createAction(ActionTypes.ACT_PROJECTS_GET_PROJECTS_SUCCESS, (model) => model)(success))
	  })
	})
  }
  
  render() {
	return (<Popconfirm title="确定要删除？" okText="确定" cancelText="取消" onConfirm={this._deleteProjcet}>
	  <Link>删除</Link>
	  <Spin spinning={this.state.deleteing}/>
	</Popconfirm>)
  }
}

class Projects extends Component {
  constructor() {
	super();
	this._getProjects = this._getProjects.bind(this);
  }
  
  _getProjects() {
	let {dispatch} = this.props;
	services.ProjectService.projects((success) => {
	  dispatch(createAction(ActionTypes.ACT_PROJECTS_GET_PROJECTS_SUCCESS, (model) => model)(success))
	})
  }
  
  componentDidMount() {
	this._getProjects();
	dispatch = this.props.dispatch;
  }
  
  render() {
	let {router} = this.props;
	return ( <Layout style={{height: "90vh"}}>
	  <Content>
		<div className="container">
		  <Row className="header">
			<Button type="primary" icon="plus" style={{float: "right", marginRight: "10px"}} onClick={() => {
			  router.push({pathname: '/home/projects/add'})
			}}>添加项目</Button>
		  </Row>
		  <Row className="content">
			<Table dataSource={this.props.projectState.projects} columns={columns}/>
		  </Row>
		</div>
	  </Content>
	</Layout>)
  }
}

function mapStateToProps(state) {
  return {
	appstate: state.appstate,
	projectState: state.projectState
  }
}

/**
 * 使用了动态创建Action的函数，不在bind到具体的Action
 * @param dispatch
 * @returns {{dispatch: *}}
 */
function mapDispatchToProps(dispatch) {
  return {
	dispatch: dispatch
  }
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Projects)