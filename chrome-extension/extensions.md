# 入门

## manifest.json

### 插件描述
```
{
    "name":"插件名称",
    "description":"插件简介",
    "version":"版本",
    //必须写2
    "manifest_version":2 
}
```

### 何时点击能弹出窗口

* 在浏览器打开时
当你的插件要对多数页面使用时,用此选项
```
{ 
    "browser_action":{
        // 图标
         "default_icon": "icon.png",
        // 点击图片展示的页面
        "default_popup": "index.html"
    }
}
```

* 匹配页面时, 不匹配时为灰色图标
当你的插件仅对个别页面使用时,用此选项
```
"page_action": {
    "default_popup": "popup.html",
    "default_icon": {
        "16": "hello_extensions.png",
        "32": "hello_extensions.png",
        "48": "hello_extensions.png",
        "128": "hello_extensions.png"
    }
}
// 下面JS要使用declarativeContent  api
"permissions": ["declarativeContent", "storage"],
```

在background.js中
```
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
                {
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            //匹配页面
                            pageUrl: {urlContains: 'developer.chrome.com'},
                        })
                    ],
                    actions: [
                        //显示
                        new chrome.declarativeContent.ShowPageAction()
                    ]
                }
            ]
        )
    })
})
```

### 页面注入JS
虽然popup.js可以获取页面的DOM, 但是注册DOM事件并不会生效, 可能是因为页面的DOM无法调用插件的JS

所以要向页面注入JS
首先注册API , activeTab
```
"permissions": ["activeTab", "declarativeContent", "storage"],
```
然后在popup.js写
```
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript(
    tabs[0].id,
    {   // 要注入的JS的路径
        file: 'js/inject.js',
    }
});
```

### 给用户提供选项页面

写一个`options.html`, `options.js`

在`manifest.json`中写`options_page`

```
{
    "options_page": "options.html"
}
```

然后在, 扩展程序->详细信息->扩展程序选项

可以在`options.html`,中写`<a target="_blank" href="options.html">options</a>`,点击跳转到选项页面

或者JS打开页面`window.open(chrome.runtime.getURL('options.html'))`


### 获取资源

多数情况, 你可以在html中直接引入图片,js,css

你也可以通过`chrome.runtime.getURL('文件路径')`获取一个`chrome-extension://<extensionID>/<pathToFile>`文件


### 存储

首先注册`storage`
```
 "permissions": ["storage"]
```

在JS中使用
```
// 存储
chrome.storage.sync.set({key: value}, function() {
  console.log('Value is set to ' + value);
});
// 获取
chrome.storage.sync.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
});
```

使用时storage.sync，只要用户启用了同步，存储的数据就会自动同步到用户登录的任何Chrome浏览器。

* 监听存储数据的变动

```
// changes 是一个对象{newValue: "", oldValue: ""}
// namespace 是存储方式 'sync'
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes, namespace)
})
```

### 创建右键菜单
```
// 创建
chrome.contextMenus.create({
    "id": "自定义ID,必须唯一",
    "title": "选项名称",
    "contexts": ["菜单可以出现在什么地方"],
    "type":"菜单项类型",
    onclick: () => {
        // 创建百度搜索
        chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)})
    } //点击时
} () => {
    // 创建时报错处理
     console.log(chrome.runtime.lastError);
 })
 
// 更新
chrome.contextMenus.update(id, object updateProperties, function callback)
```

#### contexts type

"all"(默认)， "page"， "frame"， "selection"， "link"， "editable"， "image"， "video"， "audio"， "launcher"， "browser_action"，或者"page_action"

#### 菜单项 type
"normal"(默认)， "checkbox"， "radio"，或者"separator"

#### 监听菜单点击事件
```
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info, tab);
    // info中有menuItemId, 就是上面创建时的id, 可以根据此id来进行不同操作
    if (info.menuItemId === "sampleContextMenu") {
        alert("点击了菜单项")
    }
})
```


### 设置快捷键

```
"commands": {
    "_execute_browser_action": {
        "suggested_key": {
            "default": "Ctrl+C",
            "mac": "Command+C"
        },
        // 要打开的页面
        "description": "Opens popup.html"
    }
}
```


### 设置新标签页 

设置chrome打开标签页的页面

```
"chrome_url_overrides" : {
    // 页面路径
  "newtab": "override_page.html"
}
```


### 注入JS (inject content_scripts)

#### 通过 activeTab 注入

使脚本可以在当前活动选项卡上运行，而无需指定跨源站权限。

首先注册API , activeTab

```
"permissions": ["activeTab", "declarativeContent", "storage"],
```

然后在popup.js写

```
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.executeScript(
    tabs[0].id,
    {   // 要注入的JS的路径
        file: 'js/inject.js',
    }
});
```

#### 通过 manifest.json 注入

```
"content_scripts": [
    {
         "matches": ["<all_urls>"],
         "css": ["myStyles.css"],
         "js": ["contentScript.js"]
         // 注入时间
         "run_at": "document_idle",
    }
],
```

设置注入时间 (run_at)

* document_idle	
    * 在页面空闲时载入

* document_start
    * 在css的所有文件之后注入的，但是在构造任何其他DOM或运行任何其他脚本之前。

* document_end
    * 在DOM完成之后立即注入脚本，但是在加载像图像和帧之类的子资源之前。


###  devtool扩展

```
{
	// 只能指向一个HTML文件，不能是JS文件
	"devtools_page": "devtools.html"
}
```