let fs = require('fs')
let path = require('path')
// babylon 源码->AST
let babylon = require('babylon')
// @babel/types  替换
let types = require('@babel/types')
// @babel/traverse 遍历节点
let traverse = require('@babel/traverse').default
// @babel/generator  生成
let generator = require('@babel/generator').default
//ejs模板
let ejs = require('ejs')
let {SyncHook} = require('tapable')

class Compiler {
    constructor(config) {
        this.config = config
        //保存入口文件的路径
        this.entryId
        //保存所有的模块依赖
        this.modules = {}
        //入口路径
        this.entry = config.entry
        //工作路径
        this.root = process.cwd()

        this.hooks = {
            enrtyOption: new SyncHook(),
            //编译开始
            compile: new SyncHook(),
            afterCompile: new SyncHook(),
            afterPlugins: new SyncHook(),
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook(),
        }
        //如果传递了plugins
        let plugins = this.config.plugins
        if (Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                plugin.apply(this)
            })
        }
        //插件后
        this.hooks.afterPlugins.call()
    }

    run() {
        this.hooks.run.call()
        //编译开始
        this.hooks.compile.call()
        //执行 , 创建模块依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true)
        //编译结束
        this.hooks.afterCompile.call()
        //发射一个文件 打包后的文件
        this.emitFile()
        //文件
        this.hooks.emit.call()
        //完成
        this.hooks.done.call()
    }

    //构建模块
    buildModule(modulePath, isEntry) {
        //获取源代码
        let source = this.getSource(modulePath)

        //模块ID 即路径 modulePath - this.root
        let moduleName = './' + path.relative(this.root, modulePath)

        if (isEntry) {
            //主输入口,创建Id
            this.entryId = moduleName
        }

        //解析,把source源码改造,返回依赖列表
        let {sourceCode, dependencies} = this.parse(source, path.dirname((moduleName)))
        //把相对路径和模块中的内容 对应起来
        this.modules[moduleName] = sourceCode

        dependencies.forEach(dep => {//附模块的加载 递归
            this.buildModule(path.join(this.root, dep), false)
        })
    }

    getSource(modulePath) {
        let content = fs.readFileSync(modulePath, 'utf-8')
        //以下代码处理loader
        let rules = this.config.module.rules
        //拿到每个规则 来处理
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i]
            let {test, use} = rule
            //如果rule中的test与路径匹配 就用loader处理
            let len = use.length - 1
            if (test.test(modulePath)) {
                // 获取对应的loader函数 倒着递归
                // noinspection JSAnnotator
                function normalLoader() {
                    let loader = require(use[len]);
                    len--
                    content = loader(content)
                    if (len >= 0) {
                        normalLoader()
                    }
                }

                normalLoader()
            }
        }
        return content
    }

    //AST解析语法树
    parse(source, parentPath) {
        //解析为ast树
        let ast = babylon.parse(source)
        //依赖
        let dependencies = []
        //替换require为__webpack_require__
        traverse(ast, {
            //调用表达式
            CallExpression(p) {
                let node = p.node
                node.callee.name
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__'
                    let moduleName = node.arguments[0].value
                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
                    //src/a.js
                    moduleName = './' + path.join(parentPath, moduleName)
                    dependencies.push(moduleName)
                    node.arguments = [types.stringLiteral(moduleName)]

                }
            }
        })
        //生成code
        let sourceCode = generator(ast).code
        return {sourceCode, dependencies}
    }

    //发射文件
    emitFile() {
        //用数据渲染

        //拿到输出目录
        let main = path.join(this.config.output.path, this.config.output.filename)
        //模板路径
        let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
        //ejs
        let code = ejs.render(templateStr, {
            entryId: this.entryId,
            modules: this.modules
        })
        this.assets = {}
        this.assets[main] = code
        fs.writeFileSync(main, this.assets[main])
    }


}

function log(title, content) {
    console.log(title + '----------- \n' + content + '\n')

}

module.exports = Compiler