module.exports = {
  path: 'designers',
  breadcrumbName: '企业列表',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Designers'))
	})
  },
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/TheDesigner'),
	  ])
	})
  },
}
