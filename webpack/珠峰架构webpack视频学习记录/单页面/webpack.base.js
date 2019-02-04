// webpack是node写的,用node的写法
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    //入口
    entry: "./src/index.js",
    //输出
    output: {
        //打包后的文件名  hash解决浏览器缓存
        filename: "bundle.[hash].js",
        //路径必须是一个绝对路径
        path: path.resolve(__dirname, 'build')
    },
    //插件列表
    plugins: [
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
        //将css打包为单独文件 , 打包CSS的输出路径
        new MiniCssExtractPlugin({
            filename: 'css/main.css',
        }),
        //清除多余重复的打包文件
        new CleanWebpackPlugin('build'),
        //将from内的文件拷贝到build中
        new CopyWebpackPlugin([
            {from: 'doc', to: './'}
        ]),
        //版权声明 内置插件
        new webpack.BannerPlugin('make 2019.1.12 by 刘志飞'),
    ],
    //模块
    module: {
        //rules 各自处理各自的
        //loader 可以写成 <对象形式> 或 <字符串>
        //loader 顺序默认 <右向左/下向上> 执行
        rules: [
            { // 高版本ES转码
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: { //配置
                        //预设
                        presets: [
                            '@babel/preset-env'
                        ],
                        //插件
                        plugins: [
                            //class语法
                            '@babel/plugin-proposal-class-properties',
                            //运行时
                            "@babel/plugin-transform-runtime",
                        ],
                    }
                },
                //只编译
                include: path.resolve(__dirname, 'src'),
                //排除
                exclude: /node_modules/
            },
            { // css加前缀,打包压缩,js中引入
                test: /\.s[ac]ss/,
                use: [
                    //将css打包压缩
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            //插件中分类放置css,这里就要加否则出错
                            publicPath: '../'
                        }
                    },
                    //将css编译为js模块
                    'css-loader',
                    //处理css,添加前缀,需要postcss.config.js
                    'postcss-loader',
                    //使用node-sass编译为css
                    'sass-loader',
                ]
            },
            { //处理html中的图片
                test: /.html$/,
                use: 'html-withimg-loader'
            },

            { //处理JS CSS中图片
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20 * 1024,
                        //设置输出路径基于output.path
                        outputPath: 'img/',
                    }
                }
            },
        ]
    }
}

