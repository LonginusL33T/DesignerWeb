import React, {Component} from 'react'
import Login from '../routes/Login/components/Login'
import services from '../framework/utils/MeshService'
class Main extends Component {
    componentDidMount() {
        services.router = this.props.router;
    }

    render() {
        return (this.props.children || <Login {...this.props}></Login>)
    }
}
module.exports = Main