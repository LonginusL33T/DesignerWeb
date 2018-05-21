module.exports = {
  path: 'Details',
  breadcrumbName: '审核',
  getComponent(nextState, cb) {
	require.ensure([], (require) => {
	  cb(null, require('./components/MainPage'))
	})
  },
  
}
