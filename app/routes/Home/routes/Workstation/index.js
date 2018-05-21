module.exports = {
  path: 'workstation',
  breadcrumbName: '设计者工作站',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Workstation'))
	})
  }
}
