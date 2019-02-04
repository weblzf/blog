import {SyncWaterfallHook} from "tapable";

class MySyncWaterfallHook {
    tasks = []
    argsLength = 0

    constructor(args = []) {
        this.argsLength = args.length
    }

    tap(name, task) {
        this.tasks.push(task)
    }

    call(...args) {
        args = args.splice(0, this.argsLength)
        this.tasks.forEach(fun => {
            args[0] = fun(...args)
        })
    }
}

class Test {
    hooks = {
        hook: null
    }

    constructor(Hook) {
        this.hooks.hook = new Hook(['name','f'])
    }

    tap() {
        //返回 非undefined值就中断后续执行
        this.hooks.arch.tap('node', function (...arg) {
            console.log('node', arg);
            return 'data1'
        })
        this.hooks.arch.tap('react', function (...arg) {
            console.log('react', arg);
            return 'data2'
        })
        this.hooks.arch.tap('react', function (...arg) {
            console.log('react', arg);
            return 'data3'
        })
    }

    start() {
        this.hooks.arch.call('f', 'z');
    }
}


let t = new Test(SyncWaterfallHook)
t.tap()
t.start()

t = new Test(MySyncWaterfallHook)
t.tap()
t.start()


