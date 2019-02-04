#! /usr/bin/env node
// 1)找当前执行的路径,拿到webpack.config.js
let path = require('path')

let config = require(path.resolve('webpack.config.js'))

let Compiler = require('../lib/Compiler')
let compiler = new Compiler(config)
compiler.hooks.enrtyOption.call()
compiler.run()