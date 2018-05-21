import React, {Component} from 'react'
import {Row, Form, Icon, Layout, Input, Button, message, Checkbox, notification} from 'antd';
import services from '../../../../../framework/utils/MeshService';
import config from '../../../../../framework/config/config'
import style from '../resource/reset.css'
import {Link} from 'react-router'

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class Reset extends Component {
  state = {
	loading: false,
	visible: false,
	type: "password",
	disabled: false,
	text: "发送验证码",
	count: 60,
	token: "",
	eyes: "./resource/images/eye.png"
  };
  
  constructor() {
	super();
	this.handleSubmit = this.handleSubmit.bind(this);
	this.visiblechange = this.visiblechange.bind(this);
	this.checkVerification = this.checkVerification.bind(this);
  }
  
  componentDidMount() {
	this.props.form.validateFields();
  }
  
  componentWillUnmount() {
	clearInterval(this.timer);
  }
  
  /**
   * 是否查看密码
   */
  visiblechange() {
	this.setState({visible: !this.state.visible});
	if (this.state.visible) {
	  this.setState({visible: !this.state.visible, type: "password", eyes: "./resource/images/eye.png"});
	}
	else {
	  this.setState({visible: !this.state.visible, type: "", eyes: "./resource/images/visual-eye.png"});
	}
  }
  
  /**
   *
   * 发送验证码
   */
  checkVerification() {
	/**
	 * 发送请求
	 */
	this.props.form.validateFields(["username"], (err, values) => {
	  /**
	   * 验证码倒计时
	   */
	  if (err) {
		notification.error({
		  message: "邮箱出错",
		  description: err.username.errors[0].message
		});
	  } else {
		var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if (!myreg.test(values["username"])) {
		  notification.error({
			message: "邮箱格式出错",
			description: "邮箱格式错误"
		  });
		} else {
      this.setState({disabled: true});
      this.timer = setInterval(function () {
        var count = this.state.count;
        count -= 1;
        if (count < 1) {
          this.setState({
            text: "发送验证码",
            disabled: false,
            count: 60
          });
          /*count = 60;*/
          clearInterval(this.timer);
        }
        else {
          this.setState({
            count: count,
            text: "发送验证码" + "(" + count + ")"
          });
        }
      }.bind(this), 1000);

		  let data = {loginname: values.username};
		  services.createServiceRequest.Service(
			  config.api.WebFwSendValidateCode,
			  data,
			  (success) => {
				notification.success({
				  message: "提示信息",
				  description: "邮件已发送,请登录邮箱查看验证码"
				})
				this.setState({token: success.token})
			  }
		  )
		}
		
	  }
	  
	});
	/*services.createServiceRequest.SendVerificationCode()*/
  }
  
  /**
   * 重置密码
   */
  handleSubmit() {
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  if (!err) {
		let data = {
		  email_token: this.state.token,
		  email: values.username,
		  code: values.verification,
		  password: values.password
		}
		services.createServiceRequest.Service(config.api.WebResetPassword, data, (success) => {
		  this.setState({loading: false});
		  notification.success({
			message: "提示信息",
			description: "修改成功"
		  });
		  this.props.router.push("/login");
		}, (failed) => {
		  this.setState({loading: false});
		})
	  }
	});
  }
  
  render() {
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	
	// Only show error after a field is touched.
	const userNameError = isFieldTouched('username') && getFieldError('username');
	const passwordError = isFieldTouched('password') && getFieldError('password');
	const verificationError = isFieldTouched('verification') && getFieldError('verification');
	return (<Layout className={style.login}>
	  <div className={style.loginLogo}>
		<img src="./resource/images/login-logo.png"/>
	  </div>
	  <div className={style.loginForm}>
		<Form layout="inline" className={style.form}>
		  <Row>
			<div className={style.back_div}>
			  <Link className={style.back_a} to="/login">返回</Link>
			</div>
		  </Row>
		  <Row>
			<FormItem
				validateStatus={userNameError ? 'error' : ''}
				help={userNameError || ''}>
			  {getFieldDecorator('username', {
				rules: [{required: true, message: '请输入邮箱'}],
			  })(
				  <Input style={{background: '#fff'}}
								 prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								 className={style.input_mail}
								 placeholder="请输入邮箱"
						     suffix={<Button onClick={this.checkVerification} disabled={this.state.disabled} ghost={true}
										 className={style.a}>{this.state.text}</Button>
						 }/>
			  )}</FormItem>
			</Row>
			<Row>
			<FormItem
				style={{marginTop:'2px'}}
				validateStatus={verificationError ? 'error' : ''}
				help={verificationError || ''}>
			  {getFieldDecorator('verification', {
				rules: [{required: true, message: '请输入验证码!'}],
			  })(
			  	<div className={style.input_verification}>
				  <Input
						 style={{background: '#fff', borderRadius: 4}}
             prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						 placeholder="输入验证码"/>
					</div>
			  )}
			</FormItem>
		  </Row>
		  <Row className={style.form_row}>
			<FormItem
				validateStatus={passwordError ? 'error' : ''}
				help={passwordError || ''}>
			  {getFieldDecorator('password', {
				rules: [{required: true, message: '请输入密码'}],
			  })(
				  <Input
						 style={{background: '#fff'}}
             prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						 className={style.input_new_password} type={this.state.type}
						 placeholder="输入新密码"
						 size="large"
						 suffix={<img src={this.state.eyes}
                             onClick={this.visiblechange}/>}
				  />
			  )}
			</FormItem>
			</Row>
			<Row>
			<Button
				type="primary"
				onClick={this.handleSubmit}
				className={style.submit}
				disabled={hasErrors(getFieldsError())}
				loading={this.state.loading}>
			  重置
			</Button>
		  </Row>
		</Form>
	  </div>
	</Layout>)
  }
}


module.exports = Form.create()(Reset)
