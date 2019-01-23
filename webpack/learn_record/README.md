# 第一天

## 使用webpack要安装那些模块
```
webpack,webpakc-cli
```

## webpack默认配置文件名字
```
webpack.config.js 和 webpackfile.js
```

## webpack有几种模式mode
```
production: 生产环境,会压缩文件
development: 开发环境,不压缩,优化
```

## 指定webpack-dev-server的启动目录
```
devServer: {
    //webpack-dev-server启动目录指定
    contentBase: './build',
},
```

## 如何解决打包后缓存的问题
```
增加hash实现解决缓存问题
```

## webpack中loader是干什么的
```
loader是用来加载处理各种形式的资源,用于对模块的源代码进行转换
```
 
## loader的特点
```
简单,单一,链式,保证输出结果是一个模块
```

## loader默认执行顺序
```
前置, 行内, 普通, 后置 排序，并按此顺序使用
https://www.webpackjs.com/configuration/module/#rule-enforc
```






# 第二天

## 转换为es6语法 
* 需要什么模块
```
@babel/core : babel核心  
@babel/preset-env : 预设 
babel-loader : webpack需要的loader,解析js语法
```
* babel-loader和@babel/core的关系是
```
babel-loader : 内部调用@babel/core
@babel/core : 进行向低版本转换
```
* @babel/plugin-proposal-class-properties和@babel/plugin-proposal-decorators作用是什么
```
@babel/plugin-proposal-class-properties : 支持class语法
@babel/plugin-proposal-decorators : 支持装饰器
```

##  处理JS语法
* @babel/plugin-transform-runtime，@babel/runtime，@babel/polyfill 区别是什么
```
@babel/plugin-transform-runtime : es6语法转换, 节省代码,重复引入的模块,使用后只引入一个
@babel/runtime : 将开发者依赖的全局内置对象等，抽取成单独的模块，并通过模块导入的方式引入，避免了对全局作用域的修改（污染）
@babel/polyfill : 模拟完整的ES2015+的运行环境,Promise等方法
```
* 如何控制loader的执行顺序
```
enforece:'pre' : 第一个执行
```
* 如何指定loader想要处理的js文件
```
include : 包含指定文件
exclude : 排除指定文件
```

## 全局变量引入问题
* 暴露变量的三种方式
```
expose-loader , externals , ProvidePlugin
```
* ProvidePlugin会将变量挂载在window上吗
```
不会
```

##  图片处理
* 如何在webpack中处理图片
```
file-loader
```
* 常用的图片方式有几种
```
js , css , html    
```
* 处理html中的图片
```
html-withimg-loader
```
* 打包使将图片变为base64
```
url-loader
```
* filr-loader和url-loader的关系
```
url-loader会根据文件大小决定是否去调用file-loader处理
```

## 文件打包分类
* publicPath的作用
```
方便加cdn
```
