/**
 * 顶部信息栏
 */
import React from 'react'
import {Menu, Dropdown, Breadcrumb, Icon} from 'antd'
import storage from '../../../framework/utils/LocalStorage';
import services from '../../../framework/utils/MeshService'
import style from '../resource/home.css'

class TopMenuBar extends React.Component {

    constructor(props) {
        super(props);
        this._optionClick = this._optionClick.bind(this);
    }

    _optionClick = ({key})=> {
        if (key == 0) {
            services.AuthService.lougout(()=>{
                this.props.router.replace("/login");
            })
        }
    }

    render() {
        let {user,routes} = this.props;
        return (<div className={style.userInfo}>

            <div style={{float:"right",marginLeft: "10px"}}>
                <Dropdown overlay={
                    <Menu onClick={this._optionClick}>
                        <Menu.Item key="0">
                            <span>注销</span>
                        </Menu.Item>
                    </Menu>}>
                    <img src="resource/images/arrow-addroal1.png" alt=""/>
                </Dropdown></div>
            <span className={style.userName}>{user?user.name:null}</span>
        </div>)
    }
}
export default TopMenuBar