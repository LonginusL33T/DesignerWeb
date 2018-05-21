import React from 'react'
import style from "../resource/Left.css"
import services from '../../../../../../../framework/utils/MeshService'
import config from "../../../../../../../framework/config/config"

export default class Left extends React.Component {
    constructor(props) {
        super(props);
        this.state={designer:{avatar:"noresouce"}};
    }

    componentDidMount(){
        this._init();
    }

    _init(){
        const {uniqueid} = this.props;
        services.createServiceRequest.Service(config.api.WebGetUserInfo,{uniqueid:uniqueid},(success)=>{
            if(success.user.type === "free"){
                success.user.type = "自由设计师"
            }else if(success.user.type === "graduate"){
                success.user.type = "应届设计师"
            }else {
                success.user.type = "自有品牌设计师"
            }
            this.setState({designer:success.user})
        },(failed)=>{
            message.error(failed)
        })
    }

  render() {
	
	let {designer} = this.props;


	return (<div style={{
		  textAlign: 'center',
		  width: '20vw',
		  height: "500px",
		  paddingTop: '136px',
		  marginLeft: '7px', ...this.props.style
		}}>
		  <div className={style.name}><span>{this.state.designer.type}</span></div>
            {this.state.designer.avatar === "noresouce" ?
                        <img className={style.circle2} src="./resource/images/menu_logo.png"/>: <img className={style.circle}  src={this.state.designer.avatar}/>}
		  <div style={{fontSize: '12px', color: "#525252", marginBottom: "16px"}}>{this.state.designer.name}</div>
		</div>
	)
  }
}