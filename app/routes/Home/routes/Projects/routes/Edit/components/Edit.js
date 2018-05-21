import React,{Component} from 'react'
import {Table,Layout, Row,Col,Button,Input,Checkbox,notification} from 'antd'
import services from '../../../../../../../framework/utils/MeshService'
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import styles from '../resource/edit.css'

const {Content, Sider} = Layout;

class Edit extends Component{
    state={
        loading:false
    }
    constructor(){
        super();
        this._getProjectSchemas = this._getProjectSchemas.bind(this);
        this._schemasChanged = this._schemasChanged.bind(this);
        this._updateName = this._updateName.bind(this);
        this._inputOnChange = this._inputOnChange.bind(this);
    }
    componentDidMount(){
        this._getProjectSchemas();
        this.setState({name:this.props.location.state.name})
    }

    _inputOnChange(event){
        this.setState({name:event.target.value});
    }
    /**
     * 更新名称
     * @private
     */
    _updateName(){
        this.setState({loading:true})
        services.ProjectService.updataName(this.state.name,this.props.location.state.uuid,(success)=>{
            this.setState({loading:false});
            notification['success']({
                message: '修改项目名称',
                description: '项目名称修改成功'
            });
        })
    }

    /**
     * schemas发生变化
     *
     * @param checked
     * @private
     */
    _schemasChanged(checked){
        let {dispatch} = this.props;
        dispatch(createAction(ActionTypes.ACT_PROJECTS_SELECT_PROJECTS_SCHEMAS,(module)=>module)({schemasSelected:checked}));
    }
    /**
     * 获取项目的schemas
     * @private
     */
    _getProjectSchemas(){
        let {dispatch} = this.props;
        services.ProjectService.schemas(this.props.location.state.name,(success)=>{
            let schemasSelected = [];
            success.data.map((schema)=>{
                schemasSelected.push(schema.uuid);
            });
            services.ProjectService.allSchemas((success)=>{
                dispatch(createAction(ActionTypes.ACT_PROJECTS_GET_PROJECTS_SCHEMAS,(module)=>module)({schemas:success.data,schemasSelected:schemasSelected}));
            })
        })
    }
    render(){
        return( <Layout style={{height:"90vh"}}>
            <Content>
                <div className="container">
                    <Row className="header"></Row>
                    <Row className="content">
                        <Row>
                            <Col span={8} offset={4}><Input ref="name" addonBefore="名称" defaultValue={this.props.location.state.name} onChange={this._inputOnChange} /></Col>
                            <Col span={8} offset={1}><Button type="primary" onClick={this._updateName} loading={this.state.loading}>更新</Button></Col>
                        </Row>
                        <Row>
                            <Col offset={4}>
                                <Checkbox.Group className={styles.schemas} value={this.props.projectState.schemasSelected} onChange={this._schemasChanged}>
                                    {
                                        this.props.projectState.schemas.map((schema)=>{
                                            return <Row key={schema.uuid}>
                                                <Checkbox value={schema.uuid} className={styles.schema}>
                                                    {
                                                        schema.name
                                                    }
                                                </Checkbox>
                                            </Row>
                                        })
                                    }
                                </Checkbox.Group>
                            </Col>
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
)(Edit);