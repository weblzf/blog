import {SyncLoopHook} from "tapable";

//不返回undefined的函数多次执行
class MySyncLoopHook {
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
            while (fun(...args) !== undefined) {

            }
        })
    }
}

class Test {
    hooks = {
        hook: null
    }

    constructor(Hook) {
        this.hooks.hook = new Hook(['name', 'f'])
    }

    tap() {
        //返回 非undefined值就中断后续执行
        let i = 0
        this.hooks.arch.tap('node', function (...arg) {
            console.log('node', arg);
            i++
            return i === 3 ? undefined : 'data1'
        })
        this.hooks.arch.tap('react', function (...arg) {
            console.log('react', arg);
            return i === 3 ? undefined : 'data2'
        })
        this.hooks.arch.tap('react', function (...arg) {
            console.log('react3', arg);
            return 'data3'
        })
    }

    start() {
        this.hooks.arch.call('f', 'z');
    }
}


let t = new Test(SyncLoopHook)
// t.tap()
// t.start()

t = new Test(MySyncLoopHook)
t.tap()
t.start()


