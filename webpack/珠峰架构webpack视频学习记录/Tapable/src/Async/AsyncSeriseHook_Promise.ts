import {AsyncSeriesHook} from "tapable";

//异步串行

class MyAsyncSeriesHook {
    tasks = []
    argsLength = 0

    constructor(args = []) {
        this.argsLength = args.length
    }

    tapPromise(name, task) {
        this.tasks.push(task)
    }

    promise(...args) {
        args = args.splice(0, this.argsLength)
        let [first, ...others] = this.tasks
        return others.reduce(
            (promise, next) => promise.then(()=>next(...args)),
            first(...args)
        )
    }
}

class Test {
    hook = null

    constructor(Hook) {
        this.hook = new Hook(['name'])
    }

    tap() {
        this.hook.tapPromise('node', name =>
            // @ts-ignore
            new Promise(resolve =>
                setTimeout(() => {
                    console.log('node' + name);
                    resolve()
                }, 1000)
            )
        )
        this.hook.tapPromise('node2', name =>
            // @ts-ignore
            new Promise(resolve =>
                setTimeout(() => {
                    console.log('node2' + name)
                    resolve()
                }, 3000)
            )
        )
    }

    start() {
        this.hook.promise('传参').then(() => {
            console.log('end');
        });
    }
}


// let t = new Test(AsyncSeriesHook)
// t.tap()
// t.start()

let t2 = new Test(MyAsyncSeriesHook)
t2.tap()
t2.start()
//