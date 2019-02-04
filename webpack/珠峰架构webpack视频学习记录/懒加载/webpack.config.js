let HtmlWebpackPlugin = require('html-webpack-plugin')
let path = require('path')
let webpack = require('webpack')
module.exports = {
    mode: "production",
    entry: './src/index.js',
    optimization: {
        //启用模块名字
        namedModules: true
    },
    devServer: {
        hot: true
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            //通过此插件
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        //热更新插件
        new webpack.HotModuleReplacementPlugin()
    ]
}