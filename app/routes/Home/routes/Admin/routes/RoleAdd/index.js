module.exports = {
  path: 'roleadd',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/RoleAdd'))
	})
  }
}
