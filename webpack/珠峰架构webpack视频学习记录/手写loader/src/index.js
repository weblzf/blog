// class Lzf {
//     constructor(props) {
//         this.name = props
//     }
//
//     getName() {
//         return this.name
//     }
// }
//
// let zf = new Lzf()
// console.log(zf);

import './index.less'
let p = require('./image/loader.png')
let img = document.createElement('img')
img.src = p
document.body.appendChild(img)