module.exports = {
    path: 'checkcompany',
    breadcrumbName:'审核',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/MainPage'))
        })
    }
}
