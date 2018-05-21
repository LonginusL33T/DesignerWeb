import React, {Component} from 'react'
import {Table, Row, Button, Icon, Modal} from 'antd'
import {createServiceRequest, createServiceRequestWithCallBack} from '../../../../../../../framework/utils/Request'
import constants from '../../../../../../../framework/config/constants'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import {Link} from 'react-router'
class Role extends Component {
    /*表头定义*/
    columns = [{
        title: '角色名',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
    }, {
        title: '描述',
        dataIndex: 'memo',
        key: 'memo',
        width: '35%',
    }, {
        title: '操作',
        key: 'option',
        render: (text, record)=> (<div><Link to={
        {
            pathname:"/home/admin/roleupdate",
            state:{
                sid:record.roleSid,
                name:record.name
            }
        }
        }>修改</Link>
            <a style={{color:"red",padding:"0 10px"}} onClick={this.roleDelete(record)}>删除</a>
        </div>)

    }]

    constructor() {
        super();
        this.roleAdd = this.roleAdd.bind(this);
    }

    /*点击添加角色按钮*/
    roleAdd = ()=> {
        this.props.router.push("/home/admin/roleadd")
    }
    /*点击删除按钮*/
    roleDelete = (record)=> {
        let props = this.props;
        return ()=> {
            Modal.confirm({
                title: '删除角色',
                content: '确定要删除此角色吗?',
                onOk() {
                    createServiceRequestWithCallBack(props.dispatch)(constants.services.deleteRole, {roleSid: record.roleSid}, (success)=> {
                        createServiceRequest(props.dispatch)(constants.services.WebGetRoles, null, ActionTypes.ACT_GET_ROLES_SUCCESS, ActionTypes.ACT_GET_ROLES_FAILED);
                    });
                },
                onCancel() {

                },
            });
        }
    }

    componentDidMount() {
        createServiceRequest(this.props.dispatch)(constants.services.WebGetRoles, null, ActionTypes.ACT_GET_ROLES_SUCCESS, ActionTypes.ACT_GET_ROLES_FAILED);
    }

    render() {
        return (<div >
            <Row gutter={24}>
                <Button type="primary" onClick={this.roleAdd}
                        style={{marginRight:"20px",float:"right",border:"0px",marginBottom:"20px"}}><Icon
                    type="plus-circle-o"/>添加角色</Button>
            </Row>
            <Row >
                <Table bordered columns={this.columns} dataSource={this.props.authState.roles}/>
            </Row>
        </div>)
    }
}

function mapStateToProps(state) {
    return {
        appState: state.appstate,
        authState: state.authState
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
module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Role) 