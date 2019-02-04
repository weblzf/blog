const merge = require('webpack-merge')
const base = require('./webpack.base')
const webpack = require('webpack')

module.exports = merge(base, {
    //开发环境
    mode: 'development',
    //监控代码,变动就重新打包
    watch: true,
    watchOptions: {
        //每秒查询1000次
        poll: 1000,
        //防抖
        aggregateTimeout: 500,
        //忽视
        ignored: /node_modules/
    },
    //源码映射 会产生一个新文件
    devtool: "source-map",
    //本地服务器
    devServer: {
        port: 8080,
        //进度条
        progress: true,
        //启动目录指定
        contentBase: './build',
        //压缩
        compress: true,
        //跨域代理
        // proxy: {
        //     //网络访问/api时
        //     '/api': {
        //         //访问此域名
        //         target: 'http://localhost:3000',
        //         //路径重写
        //         pathRewrite: {
        //             // '/api' 重写为 ''
        //             '/api': ''
        //         }
        //     }
        // },

        //钩子,模拟数据
        before(app) {
            app.get('/user', (req, res) => res.json({name: '钩子,模拟数据'}))
        }
    },
    plugins: [
        //环境变量
        new webpack.DefinePlugin({
            DEV: JSON.stringify('dev')
        })
    ]
})