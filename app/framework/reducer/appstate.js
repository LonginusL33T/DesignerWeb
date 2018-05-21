import * as ActionTypes from '../action/ActionTypes'
import storage from '../utils/LocalStorage'
import config from '../config/config'
"use strict";


const initialState = {
    permeated:false,
    loading:true
}
const menus = [{
    sid:1,
    title:"注册信息审核",
    url:"/home/registers",
    icon:"user"
},{
    sid:2,
    title:"申请应聘信息汇总",
    url:"/home/interviewee",
    icon:"book"
},{
    sid:3,
    title:"企业列表",
    url:"/home/companies",
    icon:"idcard"
},{
    sid:4,
    title:"设计师列表",
    url:"/home/designers",
    icon:"pushpin-o"
},{
    sid:5,
    title:"设计师工作站",
    url:"/home/workstation",
    icon:"shop"
},{
    sid:6,
    title:"最新活动发布",
    url:"/home/activities",
    icon:"database"
},{
    sid:7,
    title:"用户反馈",
    url:"/home/feedback",
    icon:"edit"
},{
    sid:8,
    title:"数据统计",
    url:"/home/statistics",
    icon:"line-chart"
}]

function appstate(state = initialState, action ) {
    if (action.type === ActionTypes.ACT_INIT_APP) {
        let newState = {};
        newState.permeated = true;
        newState.user = action.payload.user;
        newState.menu = action.payload.menus;
        // if(storage.get(config.keys.mesh_token)){
        //     newState.permeated = true;
        //     newState.user = storage.get(config.keys.mesh_user);
        //     newState.menu = menus;
        // }
        return Object.assign({},state,newState);
    }
    return state;
}

export default appstate;
