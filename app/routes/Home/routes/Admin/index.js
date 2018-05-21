module.exports = {
  path: 'admin',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/Role/index'),
		require('./routes/RoleAdd/index'),
		require('./routes/RoleUpdate/index'),
		require('./routes/Users/index'),
		require('./routes/UserRoleMotify/index'),
		require('./routes/UserRoleAdd')
	  ])
	})
	
  },
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Auth'))
	})
  }
}
