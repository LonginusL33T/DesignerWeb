import React from 'react'
import style from "../resource/Left.css"

export default class Left extends React.Component {
  render() {
	let {Companies} = this.props;
	return (<div style={{
		  textAlign: 'center',
		  width: '20vw',
		  height: "500px",
		  paddingTop: '136px',
		  marginLeft: '7px', ...this.props.style
		}}>
		  <div className={style.name}><span>企业用户</span></div>
            {Companies.avatar === "noresouce" ?
					<img className={style.circle2} src="./resource/images/menu_logo.png"/>: <img className={style.circle} src={Companies.avatar}/>}
		  <div style={{fontSize: '12px', color: "#525252", marginBottom: "16px"}}>{Companies.name}</div>
		  <div style={{fontSize: '12px', color: "#aa7a05"}}>注册地址：{Companies.registion_place}</div>
		</div>
	)
  }
}