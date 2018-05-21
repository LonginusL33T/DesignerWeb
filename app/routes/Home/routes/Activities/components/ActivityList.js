import React from "react"
import {Tabs, Icon, Form, Table, Button, Modal, Popconfirm, message, Pagination} from 'antd';
import style from '../resource/activityList.css'
import {Link} from 'react-router'
import services from '../../../../../framework/utils/MeshService'
import config from '../../../../../framework/config/config'
import constants from '../../../../../framework/config/constants'
import {connect} from 'react-redux'
import * as ActionTypes from '../../../../../framework/action/ActionTypes'
import {createAction} from 'redux-actions'

const TabPane = Tabs.TabPane;
const operations = <Link to="/home/activities/AddActivity"><Button>增加</Button></Link>;


class ActivityList extends React.Component {
  
  state = {
	visible: false,
	current: 1,
	loading: false
  }
  
  constructor(props) {
	super(props);
	this._hideModal = this._hideModal.bind(this);
	this._showModal = this._showModal.bind(this);
	this._onDelete = this._onDelete.bind(this);
	this._getActivities = this._getActivities.bind(this);
  }
  
  /**
   * 把mesh获取到的东西存入到state里面
   */
  componentDidMount() {
	this._getActivities()
  }
  
  _getActivities(page) {
	this.setState({
	  loading: true
	})
	let {dispatch} = this.props
	let data = {
	  "filter": {
		"bool": {
		  "must": [{
			"match_phrase": {
			  "schema.name": constants.schemas.activities
			}
		  }]
		}
	  },
	  "sort": [{"created": "desc"}]
	}
	services.createServiceRequest.meshService(config.meshApi.search + config.meshApi.nodes + `?page=${page || this.state.current || 1}&perPage=3`, data,
		(success) => {
		  dispatch(createAction(ActionTypes.ACT_ACTIVITY_GET_ACTIVITY_SCHEMA, (model) => model)(success))
		  this.setState({
			loading: false
		  })
		}, (failed) => {
		  message.error(failed)
		}
	)
  }
  
  /**
   * 删除操作。删除mesh数据库的内发布的内容
   * @param key 是列表中的每一行的行数
   */
  _onDelete = (key) => {
	services.createServiceRequest.meshDeleteService(config.meshApi.nodes + '/' + key,
		(success) => {
		  this._getActivities();
		  message.success('删除成功')
		}, (failed) => {
		  message.error(failed)
		})
  }
  
  /**
   * 显示图片
   */
  _showImage(value, record, index) {
	let src = config.apiMeshRoot + config.appCode + config.meshApi.nodes + '/' + value + config.meshApi.binary + config.meshApi.imge
	return <div>
	  <img className={style.img} src={src}/>
	</div>
  }
  
  /**
   * 显示部分内容this.state.mesh_data[value].fields.tittle
   * this.state.mesh_data[value].fields.abstract
   */
  _showContent(value, record, index) {
	
	return <div style={{marginTop:"14px",textAlign: 'left'}}>
	  <p style={{fontSize: "16px", color: "#212121", marginLeft: "14px", marginTop: "-30px"}}>{value.title}</p>
	  <p style={{fontSize: "14px", color: "#8b8a8a", marginTop: "5px", marginLeft: "14px"}}>{value.brief.length >= 100 ? value.brief.substr(0,100)+"......" :value.brief}</p>
	</div>
  }
  
  
  /**
   * 隐藏具体内容
   * @private
   */
  _hideModal = () => {
	this.setState({
	  visible: false,
	});
  }
  /**
   * 显示具体内容
   * @param key 表格第几行
   * @private
   */
  _showModal = (key) => {
	this.setState({
	  visible: true,
	  content: key
	});
  }
  _success = () => {
	message.success('删除成功');
  };
  
  _error = () => {
	message.error('出错了');
  };
  
  
  render() {
	let {ActivitiesState} = this.props;
	let {data, total} = ActivitiesState
	const columns = [
	  {
		width: '119px',
		title: '缩略图',
		dataIndex: 'uuid',
		key: 'imge',
		render: this._showImage
	  }, {
		title: '内容',
		dataIndex: 'fields',
		key: 'content',
		render: this._showContent
	  }, {
		title: '操作',
		width: '150px',
		dataIndex: 'fields',
		key: 'action',
		render: (value, record) => (
			<span>
		<Link to={{
		  pathname: "/home/activities/updateActivities",
		  state: {node: record.uuid}
		}}> 编辑</Link>
		<span className="ant-divider"/>
  
		<Popconfirm title="确定删除吗" onConfirm={() => this._onDelete(record.uuid)}>
            <a href="#">删除</a>
        </Popconfirm>
  
		<span className="ant-divider"/>
		<a onClick={() => this._showModal(value.content)}>查看</a>
		<span className="ant-divider"/>
		</span>
		),
	  }]
	let content = this.state.content;
	return (
		<div>
		  <div style={{marginTop: "45px"}}>
			<span style={{fontSize: "16px", color: "#4e4e4e"}}>新闻活动</span>
			<Link to="/home/activities/addActivity"
				  style={{fontSize: "16px", color: "#c98f10", float: "right", marginRight: "36px"}}>+新闻活动</Link>
		  </div>
		  <Table
			  loading={this.state.loading}
			  showHeader={false}
			  columns={columns}
			  dataSource={data}
			  rowKey="uuid"
			  style={{marginTop: "57px"}}
			  pagination={{
				simple: "true",
				total: total,
				simple: true,
				defaultPageSize: 3,
				onChange: (page, pageSize) => {
				  this.setState({
					current: page
				  })
				  this._getActivities(page)
				}
			  }}
		  />
		  <Modal
			  footer={false}
			  visible={this.state.visible}
			  onCancel={this._hideModal}
			  /*title={title}
			  onOk={this._hideModal}
			  okText="确认"
			  cancelText="取消"*/
		  >
			<div ref={"div"}>
			  {
				<div dangerouslySetInnerHTML={{__html: content}}>
				
				</div>
			  }
			</div>
		  </Modal>
		</div>
	)
  }
}

function mapStateToProps(state) {
  return {
	ActivitiesState: state.ActivitiesState,
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
)(Form.create()(ActivityList))