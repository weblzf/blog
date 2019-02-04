const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    mode: "development",
    //压缩优化
    optimization: {
        //分割代码块
        splitChunks: {
            //缓存组
            cacheGroups: {
                //公模块
                common: {
                    //从最初的开始分析
                    chunks: 'initial',
                    //最小多少字节
                    minSize: 0,
                    //最小多少公共使用
                    minChunks: 2
                },
                //分离第三方模块
                vendor: {
                    //优先级高,否则,common就先抽离了
                    priority:1,
                    test: /node_moudles/,
                    //从最初的开始分析
                    chunks: 'initial',
                    //最小多少字节
                    minSize: 0,
                    //最小多少公共使用
                    minChunks: 2
                }
            }
        }
    },
    //入口JS 多页面 JSON数据
    entry:
        {
            index: './src/index.js',
            other:
                './src/other.js'
        }
    ,
    output: {
        //name1是entry中的key
        filename: "[name].js",
        path:
            path.resolve(__dirname, 'dist')
    }
    ,
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'other.html',
            chunks: ['index', 'other']
        }),
    ]
}