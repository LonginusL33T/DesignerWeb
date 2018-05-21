module.exports = {
  path: 'feedback',
  breadcrumbName: '反馈列表',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Feedback'))
	})
  }
}
