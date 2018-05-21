import React from 'react'
var ReactDom = require('react-dom');
import FileDownloadHelper from './FileDownloadHelper'
import config from '../../framework/config/config'

const ExportFile={
    download:function (server,param) {
        ReactDom.render(<FileDownloadHelper
            method="POST"
            action={config.webapi.exportservice+server+"/"}
            submitData={param}/>, document.getElementById("tempPane"));
    }
}
export default ExportFile;
