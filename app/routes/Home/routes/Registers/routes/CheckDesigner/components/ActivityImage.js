import React from "react"
import {Avatar, Form, Row, Col} from 'antd';
import style from '../resource/activityList.css'

class ActivityImage extends React.Component {
  
  render() {
	let {user} = this.props;
	let type = '自有品牌设计师'
	if (user.type === 'free')
	  type = '自由设计师'
	else if (user.type === 'graduate')
	  type = '应届设计师'
	return (
		<div className={style.avatarcontainer}>
		  <Row>
			<p className={style.company}>{type}</p>
		  </Row>
		  <Row>
			{user.avatar === 'noresouce' ?
				<div className={style.avatar}>
				  <img style={{marginTop: "17.5px"}}
					   src="./resource/images/person.png"/>
				</div> : <img className={style.avatar} src={user.avatar}/>}
		  </Row>
		  <Row>
			<p style={{marginTop: "12px", fontSize: "14px", color: "#525252"}}>{user.name}</p>
		  </Row>
		
		
		</div>
	)
  }
}

module.exports = Form.create()(ActivityImage)