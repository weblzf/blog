let path = require('path')
// let donePlugin = require('./plugins/DonePlugin.js')
// let AsyncPlugin = require('./plugins/AsyncPlugin')
let FileListPlugin = require('./plugins/FileListPlugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let InlineSourcePlugin = require('./plugins/InlineSourcePlugin')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new FileListPlugin({
            filename: 'list.md'
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
        new InlineSourcePlugin({
            match: /\.(js|css)/
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    }
}