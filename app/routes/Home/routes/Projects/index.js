module.exports = {
  path: 'projects',
  breadcrumbName: '项目',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/Edit'),
		require('./routes/Add')
	  ])
	})
  },
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Main'))
	})
  }
}
