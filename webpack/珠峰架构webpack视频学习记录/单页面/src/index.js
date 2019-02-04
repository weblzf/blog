import '@babel/polyfill'
import './index.scss'

let url = DEV === 'dev' ? '/user' : 'http://localhost:3000/user'
//发送请求
test(url)
console.log(DEV)

function test(host) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', host, true)
    xhr.onload = () => console.log(host, '\n', xhr.response)
    xhr.send()
}



