import React,{Component} from 'react'
import Projects from './Projects'
class Main extends Component{
    render(){
        return (this.props.children || <Projects {...this.props}></Projects> )
    }
}
module.exports = Main;