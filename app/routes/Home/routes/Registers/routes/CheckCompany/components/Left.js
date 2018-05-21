import React from 'react'
import style from "../resource/Left.css"

export default class Left extends React.Component {
  render() {
	let {user} = this.props;
	return (<div style={{
		  textAlign: 'center',
		  width: '20vw',
		  height: "500px",
		  paddingTop: '136px',
		  marginLeft: '7px', ...this.props.style
		}}>
		  <div className="name"><span>企业用户</span></div>
		  {user.avatar === 'noresouce' ?
			  <div className="circle">
				<img style={{marginTop: "17.5px"}}
					 src="./resource/images/person.png"/>
			  </div> : <img className="circle" src={user.avatar}/>}
		   <div style={{fontSize: '12px', color: "#525252", marginBottom: "16px"}}>{user.name}</div>
		  <div style={{fontSize: '12px', color: "#aa7a05"}}>注册地址：{user.registion_place}</div>
		</div>
	)
  }
}