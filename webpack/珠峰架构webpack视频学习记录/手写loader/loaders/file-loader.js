let loaderUtils = require('loader-utils')

//返回一个路径
function loader(source) {
    //根据this内容生成路径
    let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {
        content: source
    })
    this.emitFile(filename, source)//发射文件
    return `module.exports = "${filename}"`
}

loader.raw = true //source二进制
module.exports = loader