module.exports = {
    path: 'reset',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components/Reset'))
        })
    }
}
