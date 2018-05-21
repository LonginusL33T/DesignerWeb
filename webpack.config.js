//webpack.config.js
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
let theme = require('./theme');
module.exports = {
    devtool: 'cheap-module-source-map',//生成Source Maps,这里选择eval-source-map
    entry: ['webpack/hot/dev-server', __dirname + '/app/app.js'],//唯一入口文件,__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    output: {//输出目录
        //path: __dirname + '/build',//打包后的js文件存放的地方
        path:'./build',
        chunkFilename: '[name]-[chunkhash:8].chunk.js',
        filename: 'bundle.js',//打包后输出的js的文件名
        publicPath:'/'
    },

    module: {
        
        //loaders加载器
        loaders: [
            {
                test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel',//loader的名称（必须）
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                    plugins: [
                        [
                            "import", {libraryName: 'antd',style:true},'transform-runtime'
                        ]
                    ]
                }
            },
            {
                test: /\.less$/,
                loaders: [
                    'style?sourceMap',
                    'css',
                    'less-loader?{"modifyVars":' + JSON.stringify(theme()) + '}']
            },
            {
                test: /\.scss$/,
                loaders:[
                    'style?sourceMap',
                    'css?importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]'
                ]
            },{
                test: /\.css$/,
                loaders:[
                    'style?sourceMap',
                    'css?import=0&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]'
                ]
            }, {
                test: /\.(jpg|png)$/,
                loader: 'url?limit=8192'
            }, {
                test: /\.(woff|svg|eot|ttf)$/,
                loader: 'url-loader?name=fonts/[name].[ext]'
            }, {
			test: /\.json$/,
			loader: 'json-loader'
		  }

		]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template:'./templete/index.html',//指定模板地址
            inject: 'body',
            hash:true,
            filename: './index.html'//打包生成的文件名称
        })
    ],

    //webpack-dev-server配置
    devServer: {
        contentBase: './',//默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到"build"目录）
        colors: true,//在cmd终端中输出彩色日志
        historyApiFallback: true,//在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true,//设置为true，当源文件改变时会自动刷新页面
        port: 8888,//设置默认监听端口，如果省略，默认为"8080",
        process: true,//显示合并代码进度
    }
};