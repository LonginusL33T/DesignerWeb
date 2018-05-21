
module.exports = {
  path: 'login',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/Reset'),
	  
	  ])
	})
  },
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Main'))
	})
  }
}
