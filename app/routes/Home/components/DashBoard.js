/**
 * DashBoard
 */

import React from 'react'
import {Layout, Row, Table, Col, Card} from 'antd'
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'
import services from '../../../framework/utils/MeshService'
import * as ActionTypes from '../../../framework/action/ActionTypes'
import {Link} from 'react-router'
const {Content, Sider} = Layout;
class Dashbord extends React.Component {

    constructor() {
        super();
        this._getProjects = this._getProjects.bind(this);
        this._getVersionInfo = this._getVersionInfo.bind(this);
    }

    componentDidMount() {
        //this._getProjects();
        this._getVersionInfo();
    }

    /**
     * 获取所有项目信息
     * @private
     */
    _getProjects() {
        let {dispatch} = this.props;
        services.ProjectService.projects((success)=> {
            dispatch(createAction(ActionTypes.ACT_HOME_GET_PROJECTS_SUCCESS, (model)=>model)(success))
        })
    }

    /**
     * 获取系统信息
     * @private
     */
    _getVersionInfo() {
        let {dispatch} = this.props;
        services.SystemService.version((success)=> {
            dispatch(createAction(ActionTypes.ACT_HOME_GET_VERSION_SUCCESS, (model)=>model)(success))
        })
    }

    render() {
        let {homeState} = this.props;
        return (
            <div className="content">
                <Row>
                    <Col span={12}>
                        <Card title="系统信息" style={{ width: "100wh" }}>
                            <ul>
                                <li><span>图数据库: {homeState.version.databaseVendor}</span></li>
                                <li><span>图数据库版本: {homeState.version.databaseVersion}</span></li>
                                <li><span>MeshNodeId: {homeState.version.meshNodeId}</span></li>
                                <li><span>Mesh版本: {homeState.version.meshVersion}</span></li>
                                <li><span>搜索引擎: {homeState.version.searchVendor}</span></li>
                                <li><span>搜索引擎版本: {homeState.version.searchVersion}</span></li>
                                <li><span>Vert.x版本: {homeState.version.vertxVersion}</span></li>

                            </ul>
                        </Card>
                    </Col>
                    <Col span={9} offset={3}>
                        <Card title="项目" extra={<Link to="/home/projects">更多</Link>} style={{ width: "100wh" }}>
                            <ul>
                                {homeState.projects.map((project)=> {
                                    return <li key={project.uuid}>
                                        <Link
                                            to={{pathname:"/home/projects/edit",state:{uuid:project.uuid,name:project.name}}}>{project.name}</Link>
                                    </li>
                                })}
                            </ul>
                        </Card>
                    </Col>


                </Row>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        appstate: state.appstate,
        homeState: state.homeState
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
)(Dashbord);