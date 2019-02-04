# NPM发布一个自己的包

今天终于发布了自己第一个包,记录下过程

## 注册NPM账号
去[npm官网](https://www.npmjs.com/)注册一个账号

## 本地初始化一个文件夹
* `npm init` 
* package.json
```
//你的npm包名
"name": "liuzhifei-copy",
"namespace": "liuzhifei-copy",
"version": "1.0.7",
//主入口文件
"main": "liuzhifei-copy.js",
//ts类型定义
"typings": "liuzhifei-copy.d.ts",
"license": "MIT",
//包含哪些文件
"files": [
    "liuzhifei-copy.js",
    "liuzhifei-copy.d.ts",
    "package.json"
]
```
* liuzhifei-copy.d.ts
```
//写文档注释 idea就会提供代码提示
/**
 * Copies the file and excludes the specified file.
 * @param sourcePath source file path.
 * @param targetPath target file path.
 * @param excludes files to exclude array.
 */
declare function copy(sourcePath: string, targetPath: string, excludes?: string[]): void


export default copy
```

## 登录npm账号
`npm login` 然后输出你的账号密码,邮箱即可

## 发布
`npm publish` 如果弄连接的是淘宝镜像则会报错,改为nomjs的网址`npm config set registry http://registry.npmjs.org/` 

## 结束
发布了一个npm包,现在可以从npm中下载,使用此包功能是复制文件,过滤不想要的文件