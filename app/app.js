import ReactDOM from 'react-dom';
import React from 'react';
import {CookiesProvider, withCookies, Cookies} from 'react-cookie'

import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import config from './framework/config/config'
import {Router, browserHistory, hashHistory} from 'react-router'
import pageReducer from './framework/reducer'

let rootElement = document.getElementById('contentPane');


//创建store

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
	thunkMiddleware,
	loggerMiddleware
)(createStore)

let store = createStoreWithMiddleware(pageReducer);

const rootRoute = {
  childRoutes: [{
	path: "/",
	breadcrumbName: '',
	component: require('./components/Main'),
	childRoutes: [
	  require('./routes/Home'),
	  require('./routes/Login')
	]
  }, {
	path: "*",
	component: require('./components/NotFoundPage')
  }]
  
}

ReactDOM.render(
	<Provider store={store}>
	  <Router
		  history={hashHistory}
		  routes={rootRoute}/>
	</Provider>
	, rootElement);