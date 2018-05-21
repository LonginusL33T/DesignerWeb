
/**
 * 404 Not Found Page
 */
import React from 'react'
class NotFoundPage extends React.Component{

    render(){
        return <div className="not-found-container">
            <div className="not-found-404">
                <img src="/resource/images/404.png"/>
                <span>Sorry!您所访问的页面不存在!</span>
            </div>
            <div className="not-found-cloud">
                <img src="/resource/images/error-cloud.png" alt=""/>
            </div>
            
        </div>
    }
}
module.exports=NotFoundPage;
