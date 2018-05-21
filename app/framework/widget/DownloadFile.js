import React, {Component} from 'react'
import {createServiceRequestWithCallBack} from '../utils/Request'
import FileDownloadHelper from './FileDownloadHelper'
import {message, Button} from 'antd'
import constants from '../config/constants'
import config from '../config/config'
import storage from '../utils/LocalStorage'
import http from '../utils/Http'

var ReactDom = require('react-dom');
class DownloadFile extends Component {
    state = {
        loading: false
    }

    download() {
        this.setState({loading: true});
        createServiceRequestWithCallBack()(this.props.service,this.props.params,(success)=>{
            if(success.err_code===constants.errorcode.SUCCESS){
                ReactDom.render(<FileDownloadHelper
                    method="GET"
                    action={success.url}/>, document.getElementById("tempPane"));
                this.setState({loading:false})
            }else if(success.err_code==constants.errorcode.IF_TEMPLATE_NULL_ERROR){
                this.setState({loading:false})
                message.error('模板不存在');
            }else if(success.err_code==constants.errorcode.GET_TEMPLATE_ERROR){
                this.setState({loading:false})
                message.error('获取模板失败');
            }else{
                this.setState({loading:false})
                message.error('下载失败');
            }
        },(failed)=>{
            this.setState({loading: false})
            message.error('下载失败');
        })
    }

    constructor() {
        super();
        this.download = this.download.bind(this);
    }

    render() {
        return (
            <Button type="primary" icon="download" loading={this.state.loading} onClick={this.download}>{this.props.children}</Button>)
    }
}

export default DownloadFile;
