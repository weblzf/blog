class FileListPlugin {
    constructor({filename}) {
        this.filename = filename
    }

    apply(compiler) {
        compiler.hooks.emit.tap('FileListPlugin', (compilation) => {
            let assets = compilation.assets
            let content = `## 文件名    资源大小\r\n`
            //[[bundle.js,{}],[index.html,{}]]
            Object.entries(assets).forEach(([filename, statObj]) => {
                content += `-${filename}   ${statObj.size()}\r\n`
            })
            //资源(assets)中添加  打包也会打包出此文件
            assets[this.filename] = {
                source() {
                    return content
                },
                size() {
                    return content.length
                }
            }
        })
    }
}

module.exports = FileListPlugin