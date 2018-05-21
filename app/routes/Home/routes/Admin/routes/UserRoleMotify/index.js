module.exports = {
  path: 'userrolemotify',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/UserRoleMotify'))
	})
  }
}
