import React, {Component} from 'react'
import Login from './Login'

class LoginComponent extends Component {
  render() {
	return (this.props.children || <Login {...this.props}></Login>)
  }
}

module.exports = LoginComponent