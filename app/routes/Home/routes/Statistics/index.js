module.exports = {
  path: 'statistics',
  breadcrumbName: '数据统计',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Statistics'))
	})
  }
}
