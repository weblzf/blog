let loaderUtils = require('loader-utils')
//校验参数
let schemaUtils = require('schema-utils')
let fs = require('fs')

function loader(source) {
    //启用缓存 ,false不启用
    this.cacheable && this.cacheable(true)
    let options = loaderUtils.getOptions(this)
    let callback = this.async()
    let schema = {
        type: 'object',
        properties: {
            text: {
                type: 'string'
            },
            filename: {
                type: 'string'
            }
        }
    }
    schemaUtils(schema, options, 'banner-loader')
    if (options.filename) {
        //加入文件依赖 文件变动则有反应watch
        this.addDependency(options.filename)
        fs.readFile(options.filename, 'utf-8', function (err, data) {
            callback(err, `/*${data}*/${source}`)
        })
    } else {
        callback(null, `/*${options.text}*/${data}`)
    }
    return source
}

module.exports = loader