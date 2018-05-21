/**
 * 数据导入（包含进度条）控件
 * 需要传的参数是：service, postData
 * service：后台数据导入的service
 * postData：需要传的参数
 * 注意：service返回值是一个map，其中里面必须有一个error_code用与判断数据导入job成功或失败
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { createAction } from 'redux-actions'
import { Table, Row, Upload, Icon, Button, message, Progress, Col } from 'antd'
import { createServiceRequestWithCallBack, createServiceRequest } from '../utils/Request'
import * as ActionTypes from '../action/ActionTypes'
import constants from '../config/constants'
import config from '../config/config';

const Dragger = Upload.Dragger;

class ImportData extends Component {

    constructor(props) {
        super(props);
    }

    handleImport = (fileToken) => {
        let { service, postData } = this.props;
        let { dispatch, importDataState, } = this.props;
        if (fileToken !== '') {
            let postdata = {
                ...postData,
                fileToken: fileToken,
            };
            createServiceRequestWithCallBack()(
                service, postdata,
                (response) => {
                    if (response.error_code === constants.errorcode.SUCCESS) {
                        dispatch(createAction(ActionTypes.ACT_COMMON_IMPORTDATA_PROGRESS_START, (modal) => modal)(response));
                        this.getProgress(response.jobKey);
                    } else if (response.error_code === constants.errorcode.IMPORT_TYPE_EOORO) {
                        message.error('文件类型不正确');
                    } else {
                        message.error('数据导入失败');
                    }
                }, (error) => {
                    message.error('服务器请求错误');
                }
            )
        } else {
            message.warning('请先上传文件！');
        }

    }

    getProgress = (jobKey) => {
        let { dispatch, importDataState } = this.props;
        let { fetchProgress } = importDataState;
        this.timer = setInterval(
            () => {
                if (jobKey !== '' && fetchProgress) {
                    let postData = { jobKey: jobKey };
                    let serviceRequest = createServiceRequest(dispatch);
                    serviceRequest(constants.services.jobProgress, postData,
                        ActionTypes.ACT_COMMON_IMPORTDATA_SUCCESS, ActionTypes.ACT_COMMON_IMPORTDATA_FAIL);
                }
            },
            1000
        );

    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(createAction(ActionTypes.ACT_COMMON_IMPORTDATA_INIT, (model) => model)());
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.importDataState.fetchProgress && this.timer) {
            this.timer && clearInterval(this.timer);
        }
    }

    //不用的是时候将其解绑
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        let { dispatch, importDataState } = this.props;
        let { progressCurrent, progressLabel, status } = importDataState;
        let that = this;
        const props = {
            name: 'file',
            multiple: true,
            showUploadList: false,
            action: config.webapi.upload,
            onChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} 文件上传成功！`);
                    that.handleImport(info.file.response.msg);

                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return this.props.children || (
            <div style={{ height: 320 }}>
                <Dragger {...props} >
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖动文件上传</p>
                    <p className="ant-upload-text">文件上传后自动开始导入数据</p>
                </Dragger>
                <Progress percent={progressCurrent} status={status} />
                <span>{progressLabel}</span>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        importDataState: state.importDataState
    }
}

/**
 * 使用了动态创建Action的函数，不在bind到具体的Action
 * @param dispatch
 * @returns {{dispatch: *}}
 */
function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportData);