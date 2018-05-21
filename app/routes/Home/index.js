module.exports = {
  path: 'home',
  breadcrumbName: '主页',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/Projects'),
		require('./routes/Activities'),
		require('./routes/Companies'),
		require('./routes/Designers'),
		require('./routes/Feedback'),
		require('./routes/Registers'),
		require('./routes/Statistics'),
		require('./routes/Workstation'),
		require('./routes/Interviewee'),
		require('./routes/Admin'),
	  ])
	})
  },
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/MainPage'))
	})
  }
}
