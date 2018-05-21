/**
 * 主配置界面
 */

import React from 'react'
import {Layout,Breadcrumb,Icon,Row,Col,Spin,notification} from 'antd'

import LeftMenuBar from './LeftMenuBar'
import TopMenuBar from './TopMenuBar'
import DashBoard from './DashBoard'
import {connect} from 'react-redux'
import storage from '../../../framework/utils/LocalStorage'
import {createServiceRequest} from '../../../framework/utils/Request'
import config from '../../../framework/config/config'
import services from '../../../framework/utils/MeshService'
import * as ActoinTypes from '../../../framework/action/ActionTypes'
import {Link} from 'react-router'
import { createAction } from 'redux-actions'
import style from '../resource/home.css'
const { Header, Footer, Sider, Content} = Layout;



class MainPage extends React.Component {

    state = {
        collapsed: false,
        permeated:false
    };

    constructor(props){
        super();
        this._pageControl = this._pageControl.bind(this);
        this._nonePermissionPage = this._nonePermissionPage.bind(this);
        this._permissionPage = this._permissionPage.bind(this);
        this._indexContentPage = this._indexContentPage.bind(this);
    }

    componentDidMount(){
        services.AuthService.getMenus((success)=>{
            this.props.dispatch(createAction(ActoinTypes.ACT_INIT_APP, (model) => model)(success));
        },(error)=>{
            this.props.router.push("/login");
        });
    }
    //授权页面
    _permissionPage(){
        let {dispatch,appstate,router,children,routes} = this.props;
        return(<Layout style={{height:"100vh"}} >
            <Sider
                collapsible
                trigger={null}
                className={style.leftMenu}>
                <div className={style.mainLogo}>
                    {
                         <img src="/resource/images/menu_logo.png"/>
                    }
                </div>
                <LeftMenuBar router={router}  dispatch ={dispatch} menus={appstate.menu}></LeftMenuBar>
            </Sider>
            <Layout >
                <Header className="topbar">
                    <Row gutter={24}>
                        <Col span={24}>
                            <TopMenuBar {...this.props} user={appstate.user?appstate.user:""} ></TopMenuBar>
                        </Col>
                    </Row>
                </Header>
                <Content id="mainContent" className={style.content}>
                    {children || this._indexContentPage()}
                </Content>
            </Layout></Layout>)
    }
    _indexContentPage(){
        let {dispatch,appstate,router,children} = this.props;
        return <DashBoard></DashBoard>
    }
    //未授权页面
    _nonePermissionPage(){
        let {dispatch,appstate,router,children} = this.props;
        return(<Layout style={{height:"100vh",background:"#f2f8fa"}}>
            <Content>
                <Spin spinning={appstate.loading} tip="正在加载....." delay={1000} style={{height:"100vh"}} >
                    <Row gutter={24} style={{height:"100vh"}}>
                        <Col span={24} style={{textAlign:"center",fontSize:"20px",marginTop:"100px"}}>{appstate.loading?null:<div>Sorry!!您的权限已过期,请点击<Link to="/login">登录</Link></div>}</Col>
                    </Row>
                </Spin>
            </Content>
        </Layout>)
    }
    //页面控制
    _pageControl(){
        return this._permissionPage();
        // if(storage.get(config.keys.token)){
        //     return this._permissionPage();
        // }else{
        //     return this._nonePermissionPage()
        // }
    }

    render(){
        return (<div>{this._pageControl()}</div>)
    }
}
function mapStateToProps(state) {
    return {
        appstate:state.appstate
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
)(MainPage)