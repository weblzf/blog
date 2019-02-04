const OptimizeCssAssetsWebpackPlugin = require
('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin")
const WebpackMerge = require('webpack-merge')
const WebpackBse = require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

//生产环境
module.exports = WebpackMerge(WebpackBse, {
    mode: 'production',
    //优化 压缩
    optimization: {
        //最小元 设置此项,会覆盖webpack的默认值 js也得指定插件
        minimizer: [
            //压缩JS
            new UglifyjsWebpackPlugin({
                //缓存
                cache: true,
                //并发打包
                parallel: true,
                //便于调试 map 不开
                sourceMap: false
            }),
            //压缩CSS
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    plugins: [
        //环境变量
        new webpack.DefinePlugin({
            DEV: JSON.stringify('prod')
        }),
         //将编译后的js,链接到html中
        new HtmlWebpackPlugin({
            //模板
            template: './src/index.html',
            //输出文件
            filename: 'index.html',
            //压缩html
            minify: {
                //去除HTML双引号
                removeAttributeQuotes: true,
                //一行代码
                collapseWhitespace: true
            }
        }),
    ],
})