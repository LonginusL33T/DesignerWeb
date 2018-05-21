import React from 'react'
import style from "../resource/Right.css"
import config from '../../../../../../../framework/config/config'
import {Input} from 'antd'

export default class Box extends React.Component {
  render() {
	const sty = {border: '1px solid #eeeeee'}
	if (this.props.change)
	  sty.border = '1px solid #e24444';
	return (<div style={{...this.props.style}} className={this.props.className}>
		  <span className="title">{this.props.name}</span>
		  <Input style={sty} className={style.text} value={this.props.content}/>
		</div>
	)
  }
}