import React from 'react'
import style from "../resource/Left.css"

export default class Left extends React.Component {
  render() {
	let user = this.props.user || {};
	let type = '自有品牌设计师'
	if (user.type === 'free')
	  type = '自由设计师'
	else if (user.type === 'graduate')
	  type = '应届设计师'
	return (<div style={{
		  textAlign: 'center',
		  width: '20vw',
		  height: "700px",
		  paddingTop: '136px',
		  marginLeft: '7px', ...this.props.style
		}}>
		  <div className="name"><span>{type}</span></div>
		  {user.avatar === 'noresouce' ?
			  <div className="circle">
				<img style={{marginTop: "17.5px"}}
					 src="./resource/images/person.png"/>
			  </div> : <img className="circle" src={user.avatar}/>}
		  <div style={{fontSize: '12px', color: "#525252", marginBottom: "16px"}}>{user.name}</div>
		</div>
	)
  }
}