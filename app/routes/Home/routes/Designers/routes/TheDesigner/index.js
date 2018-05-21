module.exports = {
    path: 'thedesigner',
    breadcrumbName:'企业信息',
  
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Main'))
        })
    }
}
