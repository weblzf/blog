# 什么是插件
我们正在说的东西应该叫Chrome扩展(Chrome Extension)，真正意义上的Chrome插件是更底层的浏览器功能扩展，可能需要对浏览器源码有一定掌握才有能力去开发

Chrome插件是一个用Web技术开发、用来增强浏览器功能的软件，它其实就是一个由HTML、CSS、JS、图片等资源组成的一个.crx后缀的压缩包.

# Chrome插件提供了很多实用API供我们使用，包括但不限于：
* 书签控制；
* 下载控制；
* 窗口控制；
* 标签控制；
* 网络请求控制，各类事件监听；
* 自定义原生菜单；
* 完善的通信机制；
* 等等；

# 开发与调试
Chrome插件没有严格的项目结构要求，只要保证本目录有一个manifest.json即可.

从右上角菜单->更多工具->扩展程序可以进入 插件管理页面，也可以直接在地址栏输入 chrome://extensions 访问。

勾选开发者模式即可以文件夹的形式直接加载插件，否则只能安装.crx格式的文件。Chrome要求插件必须从它的Chrome应用商店安装，其它任何网站下载的都无法直接安装，所以，其实我们可以把crx文件解压，然后通过开发者模式直接加载。

开发中，代码有任何改动都必须重新加载插件，只需要在插件管理页按下Ctrl+R即可，以防万一最好还把页面刷新一下。

# 核心

## manifest.json

这是一个Chrome插件最重要也是必不可少的文件，用来配置所有和插件相关的配置，必须放在根目录。其中，manifest_version、name、version3个是必不可少的，default_locale,description和icons是推荐的。

### browser_action
点击图片,弹出活动页面
```
"browser_action": {
    "default_icon": "img/icon.png",
    // 图标悬停时的标题，可选
    "default_title": "这是一个示例Chrome插件",
    "default_popup": "popup.html"
}
```

### content_scripts
就是Chrome插件中向页面注入脚本的一种形式
```
"content_scripts": [
    {
        // "matches": ["http://*/*", "https://*/*"],
        // "<all_urls>" 表示匹配所有地址
        "matches": ["<all_urls>"],
        // 多个JS按顺序注入
        "js": ["js/jquery-1.8.3.js", "js/content-script.js"],
        // JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
        "css": ["css/custom.css"],
        // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
        "run_at": "document_start"
    },
    // 这里仅仅是为了演示content-script可以配置多个规则
    {
        "matches": ["*://*/*.png", "*://*/*.jpg", "*://*/*.gif", "*://*/*.bmp"],
        "js": ["js/show-image-content-size.js"]
    }
],
```
如果没主动指定`run_at`为`document_start`,下面代码不会生效
```
document.addEventListener('DOMContentLoaded', function(){
	console.log('我被执行了！')
})
```
`content-scripts`和原始页面共享DOM，但是不共享JS，如要访问页面JS（例如某个JS变量），只能通过`injected js`来实现。`content-scripts`不能访问绝大部分`chrome.xxx.api`，除了下面这4种：

* chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
* chrome.i18n
* chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
* chrome.storage


### background
常驻后台的页面或JS,它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面。

background的权限非常高，几乎可以调用所有的Chrome扩展API（除了devtools），而且它可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置CORS。

经过测试，其实不止是background，所有的直接通过chrome-extension://id/xx.html这种方式打开的网页都可以无限制跨域。

配置中，background可以通过page指定一张网页，也可以通过scripts直接指定一个JS，Chrome会自动为这个JS生成一个默认的网页：

```
"background":{
    // 2种指定方式，如果指定JS，那么会自动生成一个背景页
    "page": "background.html"
    //"scripts": ["js/background.js"]
}
```

### 注入JS

通过DOM操作的方式向页面注入的一种JS。

这是因为content-script有一个很大的“缺陷”，也就是无法访问页面中的JS，虽然它可以操作DOM，但是DOM却不能调用它，也就是无法在DOM中通过绑定事件的方式调用content-script中的代码（包括直接写onclick和addEventListener2种方式都不行），但是，“在页面上添加一个按钮并调用插件的扩展API”是一个很常见的需求，那该怎么办呢？其实这就是本小节要讲的。

```
function injectCustomJS(jsPath = 'js/inject.js') {
    let script = document.createElement("script")
    script.src = chrome.extension.getURL(jsPath)
    script.onload = function () {
        this.parentNode.removeChild(this)
    }
    document.body.appendChild(script)
}
```

但是这样执行会报错

```
Denying load of chrome-extension://efbllncjkjiijkppagepehoekjojdclc/js/inject.js. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
```

意思就是你想要在web中直接访问插件中的资源的话必须显示声明才行，配置文件中增加如下：
```
"web_accessible_resources": ["js/inject.js"]
```


### permissions
权限申请
```
"permissions":[
    "contextMenus",  // 右键菜单
    "tabs",          // 标签
    "notifications", // 通知
    "webRequest",    // web请求
    "webRequestBlocking",
    "storage",       // 插件本地存储
    "http://*/*",    // 可以通过executeScript或者insertCSS访问的网站
    "https://*/*"    // 可以通过executeScript或者insertCSS访问的网站
]
```

### web_accessible_resources
普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
```
"web_accessible_resources": ["js/inject.js"]
```

### chrome_url_overrides
覆盖浏览器默认页面
```
"chrome_url_overrides":{
    // 覆盖浏览器默认的新标签页
    "newtab": "newtab.html"
},
```

### options_ui
插件配置页写法
```
"options_ui":{
    "page": "options.html",
    // 添加一些默认的样式，推荐使用
    "chrome_style": true
},
```

### omnibox 
向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
```
"omnibox": { "keyword" : "go" }
```

### default_locale
// 默认语言
```
"default_locale": "zh_CN",
```

### devtools_page
devtools页面入口，注意只能指向一个HTML文件，不能是JS文件
```
"devtools_page": "devtools.html"
```
