module.exports = {
    path: 'registers',
    breadcrumbName:'用户注册',
  getChildRoutes(partialNextState, cb) {
	require.ensure([], (require) => {
	  cb(null, [
		require('./routes/CheckCompany'),
		require('./routes/CheckPerson'),
          require('./routes/CheckDesigner'),
	  ])
	})
  },
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Registers'))
        })
    },/*

    getChildRoutes(partialNextState, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./routes/AddActivity'),

            ])
        })
    }*/

}
