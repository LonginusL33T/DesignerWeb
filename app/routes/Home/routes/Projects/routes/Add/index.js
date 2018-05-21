module.exports = {
    path: 'add',
    breadcrumbName:'添加项目',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Add'))
        })
    }
}
