module.exports = {
  path: 'roleupdate',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/RoleUpdate'))
	})
  }
}
