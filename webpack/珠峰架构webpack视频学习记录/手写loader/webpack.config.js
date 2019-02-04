let path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, 'dist')
    },
    resolveLoader: {
        //找loader时区node_modules找,找不到则去loaders下找
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
        //配别名
        // alias: {
        //     loader1: path.resolve(__dirname, 'loaders', 'loader1.js')
        // }
    },
    devtool: "source-map",
    watch: true,
    module: {
        //loader分类 pre在前面,post后面,
        // pre ->  normal -> inline(行内) -> post
        rules: [//倒着
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.png$/,
                //墓地更具图片生成md5,发谁到dist目录下,返回路径
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20 * 1024
                    }
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'banner-loader',
                    options: {
                        text: '刘志飞',
                        filename: path.resolve(__dirname, 'src', 'banner.js')
                    }
                }
            }
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: [
            //                 '@babel/preset-env'
            //             ]
            //         }
            //     }
            // },
        ]
    }
}