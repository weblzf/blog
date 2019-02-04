function loader(source) {
    console.log('loader2!!!!!!!!!!s');
    return source
}
//return有阻断效果
loader.pitch = function(){
    console.log('loader2!!!!!!!!!!pitch');
    return ''
}
module.exports = loader