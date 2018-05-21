module.exports = {
  path: 'UpdateActivities',
  breadcrumbName: '最新活动发布',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/UpdateActivity'))
	})
  }
}
