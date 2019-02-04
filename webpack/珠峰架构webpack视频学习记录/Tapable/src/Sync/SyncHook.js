let {SyncHook} = require('tapable')

class MySyncHook {

    constructor(args) {
        this.tasks = []
    }

    tap(name, task) {
        this.tasks.push(task)
    }

    call(...args) {
        this.tasks.forEach(fun => fun(...args))
    }
}

class Test {
    constructor(SyncHook) {
        this.hooks = {
            arch: new SyncHook(['name'])
        }
    }

    tap() {
        this.hooks.hook.tap('node', function (...arg) {
            console.log('node', arg);
        })
    }

    start() {
        this.hooks.hook.call('d');
    }
}


let t = new Test(SyncHook)
t.tap()
t.start()

t = new Test(MySyncHook)
t.tap()
t.start()
