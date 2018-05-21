module.exports = {
    path: 'edit',
    breadcrumbName:'修改项目',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Edit'))
        })
    }
}
