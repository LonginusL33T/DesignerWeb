import {get, post, auth, mdelete, postImage} from './Http'
import config from '../config/config'
import constants from '../config/constants'
import store from './LocalStorage'
import {notification} from 'antd'

var services =
		{
		  SystemService: {
			version: (success, failed) => {
			  let meUrl = config.apiMeshRoot + "//";
			  let token = store.get(config.keys.mesh_token);
			  get(meUrl, {"Authorization": "Bearer " + token})
				  .then((response) => {
					success(response);
				  })
				  .catch((error) => {
					if (failed) {
					  failed(error);
					}
				  })
			}
		  },
		  AuthService: {
			getMenus: (success, error) => {
			  let menusUrl = config.apiRoot + config.appCode + "/" + constants.services.WebGetMenus + "/";
			  let token = store.get(config.keys.token);
			  let postdata = {x_token: token};
			  post(menusUrl, postdata)
				  .then((res) => {
					if (res.code === 'OK' && res.datas.data) {
					  if (res.datas.data.error_code === constants.errorcode.SUCCESS) {
						store.set(config.keys.mesh_token, res.datas.data.mesh_token);
						if (success) {
						  success(res.datas.data);
						}
					  }
					  else {
						let message = res.datas.data.message;
						if (error) {
						  error(message)
						}
						notification['error']({
						  message: '错误通知',
						  description: message
						});
						
						
					  }
					} else {
					  if (failed) {
						failed('权限不足')
					  }
					}
				  })
				  .catch((err) => {
					if (failed) {
					  failed("网络错误")
					}
				  })
			  
			},
			
			lougout: (success) => {
			  store.remove(config.keys.mesh_token);
			  store.remove(config.keys.token);
			  success();
			},
			
			login: (username, password, success, failed) => {
			  let loginUrl = config.apiRoot + config.appCode + config.api.WebLogin;
			  let postdata = {username: username, password: password}
			  post(loginUrl, postdata)
				  .then((res) => {
					if (res.code === 'OK' && res.datas.data) {
					  if (res.datas.data.error_code === constants.errorcode.SUCCESS) {
						store.set(config.keys.mesh_token, res.datas.data.mesh_token);
						store.set(config.keys.token, res.datas.data.token);
						if (success) {
						  success(res);
						}
					  }
					  else {
						let message = res.datas.data.message;
						notification.error({
						  message: "登录出错",
						  description: message
						});
						if (failed) {
						  failed(message)
						}
					  }
					} else {
					  if (failed) {
						failed('权限不足')
					  }
					}
				  })
				  .catch((err) => {
					if (failed) {
					  failed("网络错误")
					}
				  })
			}
		  },
		  createServiceRequest: {
			meshService: (serviceName, data, success, failed, current, pageSize) => {
			  let Url = config.apiMeshRoot + config.appCode + serviceName;
			  let postdata = {...data, pagenum: current, pageSize: pageSize}
			  let token = store.get(config.keys.mesh_token)
			  let params = {"Authorization": "Bearer " + token}
			  post(Url, postdata, params)
				  .then((res) => {
					if (res.message)
					  failed(res.message);
					else
					  success(res)
				  }, (err => {
					failed(err.message);
				  }))
			},
			meshImageService: (serviceName, data, success, failed, current, pageSize) => {
			  let Url = config.apiMeshRoot + config.appCode + serviceName;
			  let token = store.get(config.keys.mesh_token)
			  let params = {"Authorization": "Bearer " + token}
			  postImage(Url, data.version, data.file, params)
				  .then((res) => {
					if (res.message)
					  failed(res.message);
					else
					  success(res)
				  }, (err => {
					failed(err.message);
				  }))
			},
			meshGetService: (serviceName, data, success, failed, current, pageSize) => {
			  let Url = config.apiMeshRoot + config.appCode + serviceName;
			  let token = store.get(config.keys.mesh_token)
			  let params = {"Authorization": "Bearer " + token}
			  get(Url, params)
				  .then((res) => {
					if (res.message)
					  failed(res.message);
					else
					  success(res)
				  }, (err => {
					failed(err.message);
				  }))
			},
			meshDeleteService: (serviceName, success, failed, current, pageSize) => {
			  let Url = config.apiMeshRoot + config.appCode + serviceName;
			  let token = store.get(config.keys.mesh_token)
			  let params = {"Authorization": "Bearer " + token}
			  mdelete(Url, params)
				  .then((res) => {
					success(res)
				  }, (err => {
					failed(err.message);
				  }))
			},
			Service: (serviceName, data, success, failed, current, pageSize) => {
			  let Url = config.apiRoot + config.appCode + serviceName;
			  let token = store.get(config.keys.token)
			  let postdata = {...data, pagenum: current, pagesize: pageSize, x_token: token}
			  post(Url, postdata)
				  .then((res) => {
					if (res.code === 'OK' && res.datas.data) {
					  if (res.datas.data.error_code === constants.errorcode.SUCCESS) {
						if (success) {
						  success(res.datas.data);
						}
					  }
					  else {
						let message = res.datas.data.message;
						notification.error({
						  message: "错误提示",
						  description: message
						});
						if (failed) {
						  failed(message)
						}
					  }
					} else {
					  if (failed) {
						failed('权限不足')
					  }
					}
				  })
			},
			getService: (serviceName, data, success, failed, current, pageSize) => {
			  let Url = config.apiRoot + config.appCode + serviceName;
			  let token = store.get(config.keys.token)
			  let postdata = {...data, pagenum: current, pagesize: pageSize, x_token: token}
			  get(Url)
				  .then((res) => {
					if (res.code === 'OK' && res.datas.data) {
					  if (res.datas.data.error_code === constants.errorcode.SUCCESS) {
						if (success) {
						  success(res.datas.data);
						}
					  }
					  else {
						let message = res.datas.data.message;
						notification.error({
						  message: "错误提示",
						  description: message
						});
						if (failed) {
						  failed(message)
						}
					  }
					} else {
					  if (failed) {
						failed('权限不足')
					  }
					}
				  })
			}
		  }
		}
module.exports = services