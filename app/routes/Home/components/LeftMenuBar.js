import React from 'react'
import {Link} from 'react-router'
import { Menu, Icon} from 'antd'
import style from '../resource/home.css'
const { SubMenu } = Menu;

function menuCreate(menu) {
    if(menu.children&&menu.children.length>0){
        return <SubMenu
          key={menu.sid}
          title={<span><Icon type={menuIcon(menu.code)} /><span>{menu.name}</span></span>}>{menu.children.map((child)=>{return menuCreate(child)})}</SubMenu>
    }else{
        return <Menu.Item key={menu.url}><span>{menu.icon?<Icon type={menu.icon}/>:null}{menu.name}</span></Menu.Item>
    }
}
class LeftMenuBar extends React.Component{
    constructor(){
        super();
        this._menuOnSelected = this._menuOnSelected.bind(this);
    }
    _menuOnSelected(item,key){
        this.props.router.push(item.key);
    }
    render(){
            let menus = this.props.menus?this.props.menus:[];
            return (<Menu onSelect={this._menuOnSelected}  mode="inline" className={style.leftMenuContent} >
                {
                    menus.map((menu)=>{
                       return menuCreate(menu)
                    })
                }
            </Menu>);
        }
}
export default LeftMenuBar;