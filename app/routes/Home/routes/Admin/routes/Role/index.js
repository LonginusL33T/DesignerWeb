module.exports = {
    path: 'role',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Role'))
        })
    }
}
