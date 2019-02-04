let button = document.createElement('button')
button.addEventListener('click', () => {
    //jsonp动态加载 新语法
    import('./source.js').then(date => console.log(date.default))
})
button.textContent = 'fffff'
document.body.appendChild(button)

if (module.hot) {
    module.hot.accept('./source', () => {
        let str = require('./source')
        console.log(str);
    })
}