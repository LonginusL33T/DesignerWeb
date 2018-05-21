import React, {Component} from 'react'
import {Row, Form, Icon, Layout, Input, Button, message, Checkbox} from 'antd';
import services from '../../../framework/utils/MeshService';
import config from '../../../framework/config/config'
import style from '../resource/login.css'
import {Link} from 'react-router'

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}



class Login extends Component {
    onChange(e) {
        this.setState({checked:e.target.checked+""});
    }
  constructor() {
	super();
      this.state = {
          loading: false,
          checked:localStorage.getItem("checked"),
		  type:"password"
      };
	this.onChange = this.onChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    	this.timer = setTimeout(()=>{
    		this.setState({type:"text"})
		},300);
	this.props.form.validateFields();
	if(localStorage.getItem("checked") === "true") {
        this.props.form.setFieldsValue({password: localStorage.getItem("password"),
            							username:localStorage.getItem("username")})
    }
  }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }
  
  handleSubmit() {
	this.setState({loading: true});
	this.props.form.validateFields((err, values) => {
	  if (!err) {
		services.AuthService.login(values.username, values.password, (success) => {
			localStorage.setItem("checked",this.state.checked);
            localStorage.setItem("password",values.password);
            localStorage.setItem("username",values.username);
		  this.setState({loading: false});
		  this.props.router.push("/home/registers");
		}, (failed) => {
		  this.setState({loading: false});
		  message.error(failed);
		})
	  }
	});
  }
  
  render() {
	const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
	const userNameError = isFieldTouched('username') && getFieldError('username');
	const passwordError = isFieldTouched('password') && getFieldError('password');
	return (<Layout className={style.login}>
	  <div className={style.loginLogo}>
		<img src="./resource/images/login-logo.png"/>
	  </div>
	  <div className={style.loginForm}>
		<Form layout="inline" className={style.form}>
		  <Row>
			<FormItem
				validateStatus={userNameError ? 'error' : ''}
				help={userNameError || ''}
			>
			  {getFieldDecorator('username', {
				rules: [{required: true, message: '请输入邮箱'}],
			  })(
				  <Input
            style={{background: '#fff', borderRadius: 4}}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
						className={style.input_mail}
						placeholder="请输入邮箱"
						type={this.state.type}/>
			  )}
			</FormItem>
			</Row>
			<Row>
			<FormItem
				validateStatus={passwordError ? 'error' : ''}
				help={passwordError || ''}
			>
			  {getFieldDecorator('password', {
				rules: [{required: true, message: '请输入密码!'}],
			  })(
				  <Input
            style={{background: '#fff', borderRadius: 4}}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						className={style.input_password}
						type={"password"}
						placeholder="密码"/>
			  )}
			</FormItem>
		  </Row>
		  <Row>
        <FormItem>
          <div className={style.form_button}>
            <Row>
              {/*<Link className={style.span} to="/Login/Reset">忘记密码？</Link>*/}
              {/*<span className={style.span}>丨</span>*/}
              <Checkbox checked={this.state.checked === "true"} onChange={this.onChange}
                        className={style.span}>记住密码</Checkbox>
            </Row>
            <Row>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={{padding: "0 30px"}}
                htmlType="submit"
                className={style.submit}
                disabled={hasErrors(getFieldsError())}
                loading={this.state.loading}
              >
                登录
              </Button>
            </Row>
          </div>
        </FormItem>
		  </Row>
		</Form>
	  </div>
	</Layout>)
  }
}


export default Form.create()(Login)
