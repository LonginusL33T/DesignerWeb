import React,{Component} from 'react'
import {Table,Layout, Row,Col,Button,Input,Checkbox,notification} from 'antd'
import services from '../../../../../../../framework/utils/MeshService'
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import styles from '../resource/add.css'

const {Content, Sider} = Layout;

class Add extends Component{
    state={
        loading:false
    }
    constructor(){
        super();
        this._addName = this._addName.bind(this);
        this._inputOnChange = this._inputOnChange.bind(this);
    }

    _inputOnChange(event){
        this.setState({name:event.target.value});
    }
    
    /**
     * 更新名称
     * @private
     */
    _addName(){
        this.setState({loading:true})
        services.ProjectService.createProject(this.state.name,(success)=>{
            this.setState({loading:false});
            notification['success']({
                message: '新建项目',
                description: '项目创建成功'
            });
        },(failed)=>{
            this.setState({loading:false});
            notification['error']({
                message: '新建项目',
                description: '项目创建失败'
            });
        })
    }

   
    render(){
        return( <Layout style={{height:"90vh"}}>
            <Content>
                <div className="container">
                    <Row className="header"></Row>
                    <Row className="content">
                        <Row>
                            <Col span={8} offset={4}><Input ref="name" addonBefore="名称"  onChange={this._inputOnChange} /></Col>
                            <Col span={8} offset={1}><Button type="primary" onClick={this._addName} loading={this.state.loading}>添加</Button></Col>
                        </Row>
                    </Row>
                </div>
            </Content>
        </Layout>)
    }
}

function mapStateToProps(state) {
    return {
        appstate:state.appstate,
        projectState:state.projectState
    }
}

/**
 * 使用了动态创建Action的函数，不在bind到具体的Action
 * @param dispatch
 * @returns {{dispatch: *}}
 */
function mapDispatchToProps(dispatch) {
    return {
        dispatch:dispatch
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Add);