import React from 'react'
var ReactDom = require('react-dom');
var ReactDomServer = require('react-dom/server');


var FileDownloadHelper = React.createClass({

    getDefaultProps: function () {
        return {
            checkInterval: 100, // 间隔时间(ms)
            cookieName: "fileDownload",
            cookieValue: "true",
            cookiePath: "/"
        };
    },

    componentDidMount: function () {
        this.updateComponentDomAndDownload(this.props);
    },

    componentWillUnmount: function () {
        this.removeComponentDom();
    },

    componentWillReceiveProps: function (nextProps) {
        this.updateComponentDomAndDownload(nextProps);
    },

    /**
     * 动态加入(更新)一个form表单
     * (注:iframe只能通过document.write的方式改变里面的内容)
     * @param submitData
     */
    updateComponentDomAndDownload: function (props) {
        let formData = props.submitData;
        var iframe = ReactDom.findDOMNode(this);

        // 提交的数据放在input里
        var formInputs = [];
        var submitData = formData || {};
        for (var key in submitData) {
            if (submitData.hasOwnProperty(key)) {
                formInputs.push((<input type="hidden" key={key} name={key} value={submitData[key]}/>));
            }
        }

        var iframeInnerHtml = (
            <html>
            <head></head>
            <body>
            <form method={props.method} action={props.action}>
                {formInputs}
            </form>
            </body>
            </html>
        );

        var iframeDoc = this.getIframeDocument(iframe);
        iframeDoc.write(ReactDomServer.renderToString(iframeInnerHtml));
        iframeDoc.close();
        this.form = iframeDoc.getElementsByTagName("form")[0];
        this.download();
    },

    /**
     * 获取iframe的document
     */
    getIframeDocument: function (iframe) {
        var iframeDoc = iframe.contentWindow || iframe.contentDocument;
        if (iframeDoc.document) {
            iframeDoc = iframeDoc.document;
        }
        return iframeDoc;
    },

    /**
     * 开始下载(提交form表单)
     */
    download: function () {
        if (this.form) {
            this.form.submit();
        }
    },

    /**
     * 下载完成
     */
    downloadComplete: function () {
        if (this.props.complete) {
            complete();
        }
        console.log("downloadComplete");
    },

    /**
     * 下载失败
     */
    downloadFail: function () {
        if (this.props.failed) {
            failed();
        }
        console.log("downloadFail");
    },

    /**
     * 移除组件dom
     */
    removeComponentDom: function () {
        ReactDom.findDOMNode(this).remove();
    },

    /**
     * 检查文件是否下载完毕
     */
    checkFileDownloadComplete: function () {
        //has the cookie been written due to a file download occuring?

        var cookieValue = this.props.cookieValue;
        if (typeof cookieValue == 'string') {
            cookieValue = cookieValue.toLowerCase();
        }

        var lowerCaseCookie = this.props.cookieName.toLowerCase() + "=" + cookieValue;

        if (document.cookie.toLowerCase().indexOf(lowerCaseCookie) > -1) {

            //execute specified callback
            this.downloadComplete();

            //remove cookie
            var cookieData = this.props.cookieName + "=; path=" + this.props.cookiePath + "; expires=" + new Date(0).toUTCString() + ";";
            if (this.props.cookieDomain) cookieData += " domain=" + this.props.cookieDomain + ";";
            document.cookie = cookieData;

            return;
        }

        //has an error occured?
        //if neither containers exist below then the file download is occuring on the current window
        console.log(ReactDom.findDOMNode(this));
        if (ReactDom.findDOMNode(this)) {

            //has an error occured?
            try {
                var formDoc = this.getIframeDocument(ReactDom.findDOMNode(this));
                if (formDoc && formDoc.body !== null && formDoc.body.innerHTML.length) {

                    var isFailure = true;
                    console.log(formDoc.body);
                    if (this.form && this.form.length) {
                        var contents = formDoc.body.contents().first();
                            console.log(formDoc.body,"sssss");
                        try {
                            if (contents.length && contents[0] === this.form[0]) {
                                isFailure = false;
                            }
                        } catch (e) {
                            if (e && e.number == -2146828218) {
                                // IE 8-10 throw a permission denied after the form reloads on the "$contents[0] === $form[0]" comparison
                                isFailure = true;
                            } else {
                                throw e;
                            }
                        }
                    }

                    if (isFailure) {
                        // IE 8-10 don't always have the full content available right away, they need a litle bit to finish
                        setTimeout(function () {
                            //this.downloadFail(formDoc.body.innerHTML);
                            this.downloadFail();
                        }.bind(this), 100);

                        return;
                    }
                }
            }
            catch (err) {

                //500 error less than IE9
                this.downloadFail();

                return;
            }
        }
        //keep checking...
        setTimeout(this.checkFileDownloadComplete, this.props.checkInterval);
    },

    render: function () {
        return (
            <iframe style={{ display: "none" }} src='about:blank'></iframe>
        );
    }
});
export default FileDownloadHelper;