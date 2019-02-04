let babel = require('@babel/core')
let loaderUtils = require('loader-utils')

function loader(source) {
    let options = loaderUtils.getOptions(this)
    let cb = this.async()//异步webpack api
    babel.transform(source, {
        ...options,
        sourceMap: true,
        filename: this.resourcePath.split('/').pop()
    }, function (err, result) {
        //是否错误 code       源码映射
        cb(err, result.code, result.map)
    }) //异步 不用返回
}

module.exports = loader