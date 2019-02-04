let {SyncBailHook} = require('tapable')

class MySyncBailHook {

    constructor(args = []) {
        this.tasks = []
        this.argsLength = args.length
    }

    tap(name, task) {
        this.tasks.push(task)
    }

    call(...args) {
        args = args.splice(0, this.argsLength)
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i](...args) !== undefined) {
                break
            }
        }
    }
}

class Test {
    constructor(SyncHook) {
        this.hooks = {
            arch: new SyncHook(['name'])
        }
    }

    tap() {
        //返回 非undefined值就中断后续执行
        this.hooks.hook.tap('node', function (...arg) {
            console.log('node', arg);
            // return ''
        })
        this.hooks.hook.tap('react', function (...arg) {
            console.log('react', arg);
        })
    }

    start() {
        this.hooks.hook.call('f', 'z');
    }
}


let t = new Test(SyncBailHook)
t.tap()
t.start()

t = new Test(MySyncBailHook)
t.tap()
t.start()


