import {AsyncParallelHook} from "tapable";

//不返回undefined的函数多次执行
class MyAsyncParallelHook {
    tasks = []
    argsLength = 0

    constructor(args = []) {
        this.argsLength = args.length
    }

    tapAsync(name, task) {
        this.tasks.push(task)
    }

    callAsync(...args) {
        let i = 0
        let callback = args[this.argsLength]
        let count = () => {
            i++
            if (i === this.tasks.length) {
                callback()
            }
        }

        args = args.splice(0, this.argsLength)
        this.tasks.forEach(fun => {
            fun(...args, count)
        })
    }
}

class Test {
    hook = null

    constructor(Hook) {
        this.hook = new Hook(['name','f'])
    }

    tap() {
        this.hook.tapAsync('node', function (name, cb) {
            setTimeout(() => {
                console.log('node' + name);
                cb();
            }, 1000);
        });
        this.hook.tapAsync('react', function (name, cb) {
            setTimeout(() => {
                console.log('react' + name);
                cb();
            }, 1000);
        });

    }

    start() {
        this.hook.callAsync('传参', () => {
            console.log('all');
        });
    }
}


let t = new Test(AsyncParallelHook)
t.tap()
t.start()

let t2 = new Test(MyAsyncParallelHook)
t2.tap()
t2.start()
