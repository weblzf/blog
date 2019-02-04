const path = require('path')
const webpack = require('webpack')

const fileName = '[name]'
//将react,react-dom打包,
module.exports = {
    mode: "production",
    entry: {
        react: ['react', 'react-dom'],
    },
    output: {
        filename: `${fileName}.js`,
        path: path.resolve(__dirname, 'dist/dll'),
        library: fileName,
    },
    plugins: [
        new webpack.DllPlugin({
            //name === library
            name: fileName,
            path: path.resolve(__dirname, 'dll/manifest.json')
        })
    ]
}