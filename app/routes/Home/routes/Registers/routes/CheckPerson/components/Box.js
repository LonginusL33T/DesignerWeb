import React from 'react'
import style from '../resource/Right.css'
import config from '../../../../../../../framework/config/config'

export default class Box extends React.Component {
  
  render() {
	return (
		<div style={{...this.props.style}} className={this.props.className}>
		  <span className="title">{this.props.name}</span>
		  <div className={style.text}> {this.props.content} </div>
		</div>
	)
  }
}