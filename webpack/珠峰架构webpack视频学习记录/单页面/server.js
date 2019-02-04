let express = require('express')
let app = express()

// 启动服务器
app.get('/user', (req, res) => {
    console.log(1);
    //跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({name: 'node服务器数据'})
})
app.listen(3000)


// 在服务器中启动webpack
//
// let webpack = require('webpack')
// let middle = require('webpack-dev-middleware')
// let config = require('./webpack.base')
// let compiler = webpack(config)
//
// app.use(middle(compiler))
// // 启动服务器
//
// app.get('/user', (req, res) => {
//     res.json({name: 'node服务器数据'})
// })
// app.listen(3000)