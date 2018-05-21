import http from './Http'
import config from '../config/config'
import constants from '../config/constants'
import storage from './LocalStorage'
import {createAction} from 'redux-actions'
import {notification} from 'antd'


export function loginStep1(servicename, params, success, failed) {
  let url = config.webapi.service + servicename + '/';
  http.post(url, params)
	  .then((response) => {
		if (response.code === 'OK' && response.datas.data) {
		  if (success) {
			success(response.datas.data);
		  }
		} else if (failed) {
		  failed("服务器出错");
		}
	  })
	  .catch((err) => {
		if (failed) {
		  failed(err);
		}
	  })
}

/*用户登录*/

export function loginStep2(servicename, params, success, failed) {
  let url = config.webapi.service + servicename + '/';
  http.post(url, params)
	  .then((response) => {
		if (response.code === 'OK' && response.datas.data) {
		  storage.set(constants.keys.x_token, response.token);
		  storage.set(constants.keys.timeout, response.datas.data.timeout);
		  storage.set(constants.keys.starttime, response.datas.data.starttime);
		  storage.set(constants.keys.orguniqueid, response.token);
		  if (success) {
			success(response.datas.data);
		  }
		} else if (constants.errorcode.SUCCESS == success.error_code) {
		  success(success);
		} else if (constants.errorcode.USER_PASSWORD_ERROR == success.error_code) {
		  message.error("密码错误")
		} else {
		  message.error("服务器出错")
		}
	  })
	  .catch((err) => {
		if (failed) {
		  failed(err);
		}
	  })
}

/**
 * 服务请求(统一管理)
 * @param dispatch
 * @returns {function()}
 */
export function createServiceRequest(dispatch, isRoot) {
  return (serviceName, params, successAction, failedAction, current, pageSize) => {
	let url = config.apiRoot + "/" + config.appCode + "/" + serviceName + "/";
	let postData = {...params, x_token: storage.get(constants.keys.x_token), current: current, pageSize: pageSize};
	http.post(url, postData)
		.then((response) => {
		  if (response.code === 'OK' && response.datas.data) {
			if (response.datas.data.error_code == constants.errorcode.SUCCESS) {
			  dispatch(createAction(successAction, (model) => model)(response.datas.data));
			} else {
			  notification.error({
				message: "错误提示",
				description: response.datas.data.message
			  })
			  dispatch(createAction(failedAction, (model) => model)(error));
			}
		  } else {
			const error = new TypeError(response.msg);
			dispatch(createAction(failedAction, (model) => model)(error));
		  }
		})
		.catch((err) => {
		  const error = new TypeError(err);
		  dispatch(createAction(failedAction, (model) => model)("网络错误"));
		});
  }
  
}

/**
 * 服务请求(统一管理)
 * @param dispatch
 * @returns {function()}
 */
export function createServiceRequestWithCallBack(isRoot) {
  return (serviceName, params, success, failed, current, pageSize) => {
	let url = config.apiRoot + "/" + config.appCode + "/" + serviceName + "/";
	let postData = {...params, x_token: storage.get(constants.keys.x_token), current: current, pageSize: pageSize};
	http.post(url, postData)
		.then((response) => {
		  if (response.code === 'OK' && response.datas.data) {
			if (response.datas.data.error_code == constants.errorcode.SUCCESS) {
			  if (success) {
				success(response.datas.data);
			  }
			} else {
			  notification.error({
				message: "错误提示",
				description: response.datas.data.message
			  })
			  if (failed) {
				failed(response.datas.data.message)
			  }
			}
			
		  } else {
			const error = new TypeError(response.msg);
			if (failed) {
			  failed(error)
			}
		  }
		})
		.catch((err) => {
		  const error = new TypeError(err);
		  if (failed) {
			failed("网络错误")
		  }
		});
  }
  
}