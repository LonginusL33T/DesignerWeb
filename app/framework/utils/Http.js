/**
 * Http
 */

'use strict';
import config from '../config/config'

var request = require('superagent');
var Q = require('q');
module.exports = {
  get: function (url, param, query) {
	var deferred = Q.defer();
	if(param) {
	  request
		  .get(url)
		  .type('application/json;charset=utf8')
		  .accept('application/json')
		  .set(param)
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	}else {
	  request
		  .get(url)
		  .type('application/json;charset=utf8')
		  .accept('application/json')
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	}
	return deferred.promise;
  },
  auth: function (url, username, password) {
	var deferred = Q.defer();
	request
		.get(url)
		.auth(username, password)
		.type('application/json;charset=utf8')
		.accept('application/json')
		.timeout(20000)
		.end(function (err, res) {
		  if (res && res.ok) {
			deferred.resolve(res.body);
		  } else {
			deferred.reject(err);
		  }
		});
	
	return deferred.promise;
  },
  post: function (url, data, param) {
	var deferred = Q.defer();
	if (param) {
	  request
		  .post(url)
		  .send(data)
		  .set(param)
		  .type('application/json;charset=utf8')
		  .accept('application/json')
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	} else {
	  request
		  .post(url)
		  .send(data)
		  .type('application/json;charset=utf8')
		  .accept('application/json')
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	}
	
	return deferred.promise;
  },
  postImage: function (url, version, image, param) {
	var deferred = Q.defer();
	if(param){
	request
		.post(url)
		.field("language", "en")
		.field("version", version)
		.attach("file", image)
		.set(param)
		.timeout(20000)
		.end(function (err, res) {
		  if (res && res.ok) {
			deferred.resolve(res.body);
		  } else {
			deferred.reject(err);
		  }
		});
	}else {
	  request
		  .post(url)
		  .field("language", "en")
		  .field("version", version)
		  .attach("file", image)
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	}
	return deferred.promise;
  }
  ,
  mdelete: function (url, param) {
	var deferred = Q.defer();
	if (param) {
	  request
		  .delete(url)
		  .set(param)
		  .type('application/json;charset=utf8')
		  .accept('application/json')
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	} else {
	  request
		  .post(url)
		  .type('application/json;charset=utf8')
		  .accept('application/json')
		  .timeout(20000)
		  .end(function (err, res) {
			if (res && res.ok) {
			  deferred.resolve(res.body);
			} else {
			  deferred.reject(err);
			}
		  });
	}
	
	return deferred.promise;
  }
};