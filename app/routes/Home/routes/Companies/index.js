module.exports = {
  path: 'companies',
  breadcrumbName: '企业列表',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/Details'),
	  
	  ])
	})
  },
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Companies'))
	})
  },
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/Details'),
	  
	  ])
	})
  },
}
