import React, {Component} from 'react'
import Role from '../routes/Role/components/Role'
import {Menu, Layout} from 'antd';

const {Footer, Sider, Content} = Layout;
let defaultSelectedKeys = [];
defaultSelectedKeys.push("/home/admin");

class Auth extends Component {
  render() {
	return (<Layout className="content" style={{background: "#fff"}}>
	  <Sider>
		<Menu
			mode="inline"
			defaultSelectedKeys={defaultSelectedKeys}
			onSelect={this._menuOnSelected}
			style={{border: "0", paddingRight: "20px", marginTop: "50px"}}
		>
		  <Menu.Item key="/home/admin">角色管理</Menu.Item>
		  <Menu.Item key="/home/admin/users">用户管理</Menu.Item>
		</Menu>
	  </Sider>
	  <Content>
		{this.props.children || <Role {...this.props}/>}
	  </Content>
	</Layout>)
  }
  
  constructor() {
	super();
	this._menuOnSelected = this._menuOnSelected.bind(this);
  }
  
  /**
   * menu选中时切换页面
   * @param item
   * @param key
   * @private
   */
  _menuOnSelected(item, key) {
	this.props.router.push(item.key);
  }
}

module.exports = Auth