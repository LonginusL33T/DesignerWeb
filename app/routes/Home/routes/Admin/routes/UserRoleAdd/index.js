module.exports = {
  path: 'userroleadd',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/UserRoleAdd'))
	})
  }
}
