module.exports = {
  path: 'activities',
  breadcrumbName: '最新活动发布',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Activities'))
	})
  },
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/AddActivity'),
		require('./routes/UpdateActivities'),
	  
	  ])
	})
  }
}
