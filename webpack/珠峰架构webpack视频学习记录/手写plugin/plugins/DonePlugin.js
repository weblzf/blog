class DonePlugin {
    apply(compiler) {
        console.log(1);
        compiler.hooks.done.tap('DonePlugins', (stats) => {
            console.log('完成');
        })
    }
}

module.exports = DonePlugin