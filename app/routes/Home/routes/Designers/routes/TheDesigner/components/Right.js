import React from 'react'
import {Tabs, Table, Modal, Form, Button, message,Input,Spin} from 'antd'
import style from '../resource/Right.css'
import Box from './Box'
import services from '../../../../../../../framework/utils/MeshService'
import * as ActionTypes from '../../../../../../../framework/action/ActionTypes'
import {connect} from 'react-redux'
import config from "../../../../../../../framework/config/config"
import {createAction} from 'redux-actions'
import {Link} from 'react-router'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class Main extends React.Component{

    constructor(props){
        super(props);
        this.state = {src:"",visible: false,div_all:"inline",div_free:"none",div_graduate:"none",div_production:"none",next:"Next",designer:{works:[],resumes:[]},type:""};
        this._RecruitmentDetails= this._RecruitmentDetails.bind(this);
        this._RecruitmentOther= this._RecruitmentOther.bind(this);
        this._showModal= this._showModal.bind(this);
        this._hideModal = this._hideModal.bind(this);
        this._init = this._init.bind(this);
        this._next1 = this._next1.bind(this);
        this._next2 = this._next2.bind(this);
    }

    componentDidMount(){
        this.props.form.validateFields();
        this._init();
    }

    _next1() {
        if(this.state.type === "自由设计师") {
            this.setState({div_all: "none", div_free: "inline", next: "Back"});
        }
        else if(this.state.type === "应届设计师"){
            this.setState({div_all: "none", div_graduate: "inline", next: "Back"});
        }
        else {
            this.setState({div_all: "none", div_production: "inline", next: "Back"});
        }
    }

    _next2(){
        this.setState({div_all: "inline", div_free: "none",div_graduate:"none",div_production:"none",next:"Next"});
    }

    _init(){
        const {uniqueid} = this.props;
        services.createServiceRequest.Service(config.api.WebGetUserInfo,{uniqueid:uniqueid},(success)=>{
            console.log(success)
            this.setState({designer:success.user,type:success.user.type})
        },(failed)=>{
            message.error(failed)
        })
    }

    _hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    _showModal = (key) => {
        this.setState({
            visible: true,
            src:key === undefined ? "./resource/images/404.png":key
        });
    }

    _RecruitmentDetails(value, record, index) {
        return <div className={style.table_div}>
			<span style={{color:"#c98f10",marginRight:"15px"}}>2017-09-08</span><span className={style.table_title}>服装设计师</span>
			<br/>
			<span className={style.table_text}>服装设计师</span>
			<br/>
			<span className={style.table_text}>服装设计师</span>
			<br/>
			<span className={style.table_text}>服装设计师</span>
			<br/>
			<span className={style.table_text}>服装设计师</span>
		</div>
    }

    _RecruitmentOther(value, record, index) {
        return <div className={style.table_other_div}>
			<p className={style.table_action}>
				<a className={style.table_action_watch} onClick={() => this._showModal(record.key)}>查看详情  </a>
				<a onClick={() => this._showModal(record.key)}>  服装设计师</a>
			</p>
		</div>
    }


  render(){

      const dataSource = [{
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号'
      }, {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号'
      }];

      const columns = [{
          width:'75%',
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          render:this._RecruitmentDetails
      }, {
          width:'25%',
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
          render:this._RecruitmentOther
      }];

      const {designer} = this.props;

      const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

	return (
		<div style={{marginTop:'63px',...this.props.style}}>
		  <Tabs defaultActiveKey={this.props.location.state.page||'1'}>
			<TabPane tab="个人信息" key="1">
                <div style={{width:"60vw"}}>
                    <div style={{display:this.state.div_all}}>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>出生日期</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>
                                { new Date(parseInt(this.state.designer.birth_time)).toLocaleDateString()}
                                </p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>个人官网</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.home_page}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>出生地</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.birth_place}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>上传作品</p>
                            {this.state.designer.works.map( (val, ind) =>{
                                return (
                                    <a key={ind}>
                                        <img src={val === 'noresouce' ? "./resource/images/404.png" : val}
                                             style={{
                                                 backgroundColor: '#d3d3d3',
                                                 width: '56px',
                                                 height: '56px',
                                                 verticalAlign: 'text-top',
                                                 marginLeft: '8px'
                                             }}
                                             onClick={() => {
                                                 this._showModal(val)
                                             }}
                                        />
                                    </a>
                                )
                            })
                            }

                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>国籍</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.country}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>毕业院校</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.school}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>住址</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.address}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>学院/系</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.college}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>电话</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.telephone}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>专业</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.profession}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>邮箱</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.email}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>毕业年份</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.graduate}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>Instagram</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.instagram}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>其他教育经历</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.experience}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>其他社交平台</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.other}</p>
                        </div>
                        <div style={{float:"left"}}>
                            <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>设计类别</p>
                            <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.design_type}</p>
                        </div>

                    </div>

                    <div style={{display:this.state.div_free}}>
                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>设计风格</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.tags}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>当前代理人</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.agent}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>品牌注册地</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.regitration_place}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>品牌名称</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.brand_name}</p>

                        <p style={{fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>上传简历</p>
                        {this.state.designer.resumes.map( (val, ind) =>{
                            return (
                                <a key={ind}>
                                    <img src={val === 'noresouce' ? "./resource/images/404.png" : val}
                                         style={{
                                             backgroundColor: '#d3d3d3',
                                             width: '56px',
                                             height: '56px',
                                             verticalAlign: 'text-top',
                                             marginLeft: '8px'
                                         }}
                                         onClick={() => {
                                             this._showModal(val)
                                         }}
                                    />
                                </a>
                            )
                        })
                        }
                    </div>


                    <div style={{display:this.state.div_graduate}}>
                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>设计风格</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.tags}</p>

                        <p style={{fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>上传简历</p>
                        {this.state.designer.resumes.map( (val, ind) =>{
                            return (
                                <a key={ind}>
                                    <img src={val === 'noresouce' ? "./resource/images/404.png" : val}
                                         style={{
                                             backgroundColor: '#d3d3d3',
                                             width: '56px',
                                             height: '56px',
                                             verticalAlign: 'text-top',
                                             marginLeft: '8px'
                                         }}
                                         onClick={() => {
                                             this._showModal(val)
                                         }}
                                    />
                                </a>
                            )
                        })
                        }
                    </div>

                    <div style={{display:this.state.div_production}}>
                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>设计风格</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.tags}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>品牌/公司成立时间</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{new Date(parseInt(this.state.designer.regitration_time) * 1000).toLocaleDateString()}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>每年产出设计量</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.production}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>品牌/公司注册地</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.regitration_place}</p>

                        <p style={{width:"20vw",fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>品牌名称</p>
                        <p style={{paddingLeft:"27px",width:"20vw",fontSize:"16px",color:"#2a2a2a",marginTop:"5px",height:"38px",marginRight:"27px"}}>{this.state.designer.brand_name}</p>

                        <p style={{fontSize:"12px",color:"#888888",marginTop:"15px",marginRight:"27px"}}>上传简历</p>
                        {this.state.designer.resumes.map( (val, ind) =>{
                            return (
                                <a key={ind}>
                                    <img src={val === 'noresouce' ? "./resource/images/404.png" : val}
                                         style={{
                                             backgroundColor: '#d3d3d3',
                                             width: '56px',
                                             height: '56px',
                                             verticalAlign: 'text-top',
                                             marginLeft: '8px'
                                         }}
                                         onClick={() => {
                                             this._showModal(val)
                                         }}
                                    />
                                </a>
                            )
                        })
                        }
                    </div>

                </div>
                <div style={{width:"45vw",float:"left"}}>
                    <a onClick={this.state.next==="Back"?this._next2:this._next1} style={{float:"right",fontSize:"14px",color:"#ca9428",textDecoration:"underline"}}>
                        {this.state.next}
                    </a>
                </div>
			</TabPane>
			{/*<TabPane tab="应聘信息" key="2">
				<Table
					style={{marginRight:'100px',marginTop:'21px'}}
					dataSource={dataSource}
					columns={columns}
					showHeader={false}
					pagination={{defaultPageSize:3}}
				/>
			</TabPane>*/}
		  </Tabs>
            <Modal footer={null} width="512px" style={{top: "10vh"}} onCancel={this._hideModal}
                   visible={this.state.visible}>
                <img src={this.state.src === "" ? "./resource/images/404.png" : this.state.src}
                     style={{width: '480px', textAlign: 'center'}}/>
            </Modal>
		</div>
	)
  }
}
module.exports = Form.create()(Main);