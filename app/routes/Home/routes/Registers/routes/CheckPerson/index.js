module.exports = {
  path: 'checkperson',
  breadcrumbName: '审核',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/CheckPerson2'),
	  ])
	})
  },
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/MainPage'))
	})
  }
}
