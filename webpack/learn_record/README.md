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
