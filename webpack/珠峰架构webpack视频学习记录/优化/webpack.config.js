let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let webpack = require('webpack')
let Happypack = require('happypack')
let manifest = require('./dll/manifest')

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: "./src/index.js",
    devServer: {
        port: 3000,
        open: true,
        contentBase: './dist'
    },
    // devtool: "source-map",
    module: {
        //不去解析jquery中的依赖库,加快编译速度
        noParse: [/jquery/],

        rules: [
            {
                test: /\.js$/,
                //多线程打包 指定打包使用插件中ID中js的use
                use: 'happypack/loader?id=js',
                //排除
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                //多线程打包 指定打包使用插件中ID中css的use
                use: 'happypack/loader?id=css',
            }

        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        //多线程打包js
        new Happypack({
            id: 'js',
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }
            ]
        }),
        //多线程打包css
        new Happypack({
            id: 'css',
            use: ['style-loader', 'css-loader']
        }),
        new webpack.DllReferencePlugin({
            //dll动态链接库json文件
            manifest: manifest
        }),
        new HtmlWebpackPlugin({
            //html文件要设置引入dll产生的js
            template: './public/index.html',
        }),
        //忽律 ./locale   在moment模块引用时
        // new webpack.IgnorePlugin(/\.\/locale/, /moment/)
    ]
}
