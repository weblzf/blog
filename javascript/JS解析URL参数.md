# JS解析URL参数
```
let url = 'http://www.baidu.com/?' +
    'user=huixin&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled';

function parseQuery(url) {
    let o = {}
    let queryString = url.split('?')[1]
    if (queryString) {
        queryString
            .split('&')
            .forEach(item => {
                let [key, val] = item.split('=')                
                val = val ? decodeURI(val) : true 
                //          转码         无值赋值true
                if (o.hasOwnProperty(key)) {
                //   已有属性转为数组
                    o[key] = [].concat(o[key], val)
                } else {
                    o[key] = val
                }
            })
    }
    return o
}

console.log(parseQuery(url));
//{ user: 'huixin',
//  id: [ '123', '456' ],
//  city: '北京',
//  enabled: true }
```