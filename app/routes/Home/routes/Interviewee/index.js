module.exports = {
  path: 'interviewee',
  breadcrumbName: '申请招聘信息列表',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/Interviewee'))
	})
  }
}
