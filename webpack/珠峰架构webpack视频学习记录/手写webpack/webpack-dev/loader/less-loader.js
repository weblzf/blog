let less = require('less')
function loader(source) {
    let css = ''
    less.render(source,function (err,c) {
        css  = c.css
    })
    //在css中会\n换行 但是css不识别 换成\\n
    css = css.replace(/\n/g,'\\n')
    return css
}
module.exports = loader