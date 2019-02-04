# webpack4

### webpack安装
* 装本地的webpack
* `npm install webpack webpack-cli -D`开发版本使用,上线不需要

### 手动配置webpack
* 默认配置文件为webpack.config.js 和 webpackfile.js
* `webpack --config 文件名`
* webpack是node写的,用node的写法

### 自启开发服务器
* `webapck-dev-server` 开发安装 `-D`
* 内存中的打包
* 默认以当前目录为服务器根目录
* 运行`npx webpack-dev-server`

### CSS模块
* `css-loader` 开发安装`-D`
    * 解析css语法
* `style-loader` 开发安装`-D`
    * 将css插入html的head中
* `sass-loader` 开发安装`-D`
    * 解析sass,scss语言 -> css
    * 必须要安装`node-sass`才能使用
        * `npm install node-sass -D `

### CSS打包
* `mini-css-extract-plugin` 开发安装 `-D`
* 在`rules`中调用`MiniCssExtractPlugin.loader`
* 压缩css代码` optimize-css-assets-webpack-plugin`
    * 用了此插件webpack默认js压缩就需要自己手动配置

### CSS自动添加浏览器前缀
* `autoprefixer`
    * 加浏览器前缀
* `postcss-loader`
    * 通过此loader处理

### JS压缩代码
* 用此插件 `uglifyjs-webpack-plugin`  开发安装`-D`

### Babel
* 用loader解析语法`babel-loader`
* 核心模块 `@babel/core` 
* `@babel/preset-env`

### Babel插件
* 解析`class`语法
    * `@babel/plugin-proposal-class-properties` 开发安装`-D`
* 避免编译时重复引用模块 
    * `@babel/plugin-transform-runtime`  开发安装`-D`
    * 需要`@babel/runtime`
* 运行时
    * `@babel/runtime` 生产安装`-S`
* 使用高版本ES的API
    * `@babel/polyfill` 生产安装`-S`

### 全局暴露
* `expose-loader`
* 使用`webpack.ProvidePlugin({$:'jquery'})`

### 不希望打包某个模块
* webpack中设置externals

### 打包图片
* JS中引入 , CSS中引入
    * `file-loader` 开发安装`-D`
        * 处理图片,复制图片到build目录
    * `url-loader` 开发安装`-D` 
        * 图片过小,用base64转化,大了用`file-loader`处理
        * 此loader包含`file-loader`  
* HTML中img图片
    * `html-withimg-loader` 开发安装`-D`
    * 处理html中的图片

### 源码映射
* 编译后的代码报错,找不到源头
* webpack设置devtool:'source-map'

### 代码变动,直接编译
* webpack配置watch

### webpack插件
* `html-webpack-plugin` 开发安装`-D`
    * 将编译后的JS链接到html中,压缩html
* `mini-css-extract-plugin` 开发安装`-D`
    * 将CSS打包为一个文件
* `optimize-css-assets-webpack-plugin`
    * 压缩CSS
    * 用了此插件webpack默认js压缩就需要自己手动配置
* `uglifyjs-webpack-plugin` 开发安装`-D`
    * 压缩JS
* `clean-webpack-plugin` 开发安装`-D`
    * 清除打包出的多余文件
* `copy-webpack-plugin` 开发安装`-D`
    * 将文件拷贝到某处
* `webpack.BannerPlugin`内置插件
    * 版权声明
    
    
### 前端跨域
* 使用devServer中的proxy
    ```
    devServer: {
            //本地服务器8080
            port:8080,
            //跨域代理
                    proxy: {
                        //网络访问/api时
                        '/api': {
                            //访问此域名
                            target: 'http://localhost:3000',
                            //路径重写
                            pathRewrite: {
                                // '/api' -> ''
                                '/api': ''
                            }
                        }
                    },
        },
    ```
    
* 模拟数据
```
在devServer中写
//钩子,模拟数据 
before(app) {
    app.get('/user', (req, res) => res.json({name: '钩子,模拟数据'}))
}
```

* 服务器中启动webpack
    * `webpack-dev-middleware` 开发安装 `-D`
    
## resolve
* 解析第三方包
* 起别名
* 解析规则


## 分离环境
* 将开发环境和生产环境的webpack.config分别写好
* 可以写一个共有的config文件,然后用`webpack merge`来合并



#优化

## noParse
```
module: {
    //不去解析jquery中的依赖库,加快编译速度
    noParse: [/jquery/],
}
```
## IgnorePlugin
* 内置插件,不去载入./locale模块,指定只在moment执行中
```
new webpack.IgnorePlugin(/\.\/locale/,/moment/)
```

## 动态链接库: manifest.json
* webpack内置插件 `webpack.DllPlugin`
* 优化打包
* 先写一个webpack.config.dll.js,例如下面打包react,react-dom
```
let path = require('path')
let webpack = require('webpack')
//将react,react-dom打包,
module.exports = {
    mode: "production",
    entry: {
        react: ['react', 'react-dom'],
    },
    output: {
        filename: "_dll_[name].js",
        path: path.resolve(__dirname, 'dist'),
        library: '_dll_[name]',
    },
    plugins: [
        new webpack.DllPlugin({ //name === library
            name: '_dll_[name]',
            path: path.resolve(__dirname, 'dist', 'manifest.json')
        }),
    ]
}
```
* 运行webpack,输出一个打包后的js文件,和一个manifest.json
* 然后在打包业务代码
```
//将manifest.json输入到DllRefrerncePlugin中
 new webpack.DllReferencePlugin({
            manifest:path.resolve(__dirname,'dist','manifest.json')
        }),
```
* 注意webpack.config.dll.js打包出来的js要放入生产文件中,manifest.json不需要放入生产文件中


## 多线程打包
* `happypack`
* rules中配置好
```
{
    test: /\.js$/,
    //多线程打包 指定打包使用插件中ID中js的use
    use: 'happypack/loader?id=js',
    //排除
    exclude: /node_modules/
},
{
    test: /\.css$/,
    //多线程打包 指定打包使用插件中ID中css的use
    use: 'happypack/loader?id=css',
}
```
* 在去plugins中配置
```
//多线程打包js
new Happypack({
    id: 'js',
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                ]
            }
        }
    ]
}),
//多线程打包css
new Happypack({
    id: 'css',
    use: ['style-loader', 'css-loader']
}),
```
* 小项目可能并不快,大项目会快


## webpack自带优化
* `import`语法在生产环境下,会自动去除没用过的代码
* 注意: `require`语法并不支持
* tree-shaking 树摇晃
* 会自动简化代 码 ,例如
```
let a = 1
let b = 2
let c = 3
let d = a+b+c
//webpack编译后为 b=6
```

## 抽取公共代码
```
optimization: {
    //分割代码块
    splitChunks: {
        //缓存组
        cacheGroups: {
            //公模块
            common: {
                //从最初的开始分析
                chunks: 'initial',
                //最小多少字节
                minSize: 0,
                //最小多少公共使用
                minChunks: 2
            },
            //分离第三方模块
            vendor: {
                //优先级高,否则,common就先抽离了
                priority:1,
                test: /node_moudles/,
                //从最初的开始分析
                chunks: 'initial',
                //最小多少字节
                minSize: 0,
                //最小多少公共使用
                minChunks: 2
            }
        }
    }
},
```


## 懒加载
* `import('./a.js')`返回promise
* 通过`@babel/plugin-syntax-dynamic-import`插件实现

## 热更新
```
devServer: {
    //开启热更新
    hot: true
},
optimization: {
    //启用模块名字
    namedModules: true
},
plugins: [
    //热更新插件
    new webpack.HotModuleReplacementPlugin()
]
```
js中也可以使用
```

if (module.hot) {
    module.hot.accept('./source', () => {
        let str = require('./source')
        console.log(str);
    })
}
```



## npm-link
将npm包,连接到某文件,直接使用
* package.json中的name为此link名字
* npx可运行此link


## 行内loader
* `loader!./a.js`
* `-!loader!./a.js`
    * 不在通过pre,normal处理
* `!loader!./a.js`
    * 不在通过normal处理
* `!!loader!./a.js`
    * 只通过行内处理


## loader
* 由pitch和normal组成
![loader组成](./手写loader/loader.png)
![loader组成](./手写loader/loader2.png)
* 阻断
* 最后一个loader必须返回一个JS脚本
    * 因为要放入打包后的文件中执行
    
    
