let HtmlWebpackPlugin = require('html-webpack-plugin')

//将外链 变 内联
class InlineSourcePlugin {
    constructor({match}) {
        this.reg = match
    }

    processTag(tag, compilation) {
        let newTag, url
        if (tag.tagName === 'link' && this.reg.test(tag.attributes.href)) {
            newTag = {
                tagName: 'style',
                attributes: {
                    type: 'text/css'
                }
            }
            url = tag.attributes.href
        }
        if (tag.tagName === 'script' && this.reg.test(tag.attributes.src)) {
            newTag = {
                tagName: 'script',
                attributes: {
                    type: 'application/javascript'
                }
            }
            url = tag.attributes.src
        }

        if (url) {
            newTag.innerHTML = compilation.assets[url].source()
            delete  compilation.assets[url]
            return newTag
        }
        return tag
    }

    processTags(data, compilation) {
        let headTags = []
        let bodyTags = []
        data.headTags.forEach(headTag => {
                headTags.push(this.processTag(headTag, compilation))
            }
        )
        data.bodyTags.forEach(bodyTag => {
                bodyTags.push(this.processTag(bodyTag, compilation))
            }
        )
        return {...data, headTags, bodyTags}
    }

    apply(compiler) {
        //通过webpackPlugin来实现
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
                HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alertPlugin', (data, cb) => {
                    data = this.processTags(data, compilation)
                    cb(null, data)
                })
            }
        )
    }
}

module.exports = InlineSourcePlugin