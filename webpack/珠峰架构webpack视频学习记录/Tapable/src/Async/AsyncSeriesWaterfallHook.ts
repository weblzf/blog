import {AsyncSeriesWaterfallHook} from "tapable";

//异步串行

class MyAsyncSeriesWaterfallHook {
    tasks = []
    argsLength = 0

    constructor(args = []) {
        this.argsLength = args.length
    }

    tapAsync(name, task) {
        this.tasks.push(task)
    }

    callAsync(...args) {
        let finalCallback = args[this.argsLength]
        args = args.splice(0, this.argsLength)
        let i = 0

        let next = (err, data) => {
            let task = this.tasks[i]
            if(task===undefined){
                return finalCallback()
            }
            if(i===0){
                task(...args,next)
            }else {
                task(...args,next)
            }
        }

    }
}

class Test {
    hook = null

    constructor(Hook) {
        this.hook = new Hook(['name'])
    }

    tap() {
        this.hook.tapAsync('node', (data, callback) => {
                setTimeout(() => {
                    console.log('node' + data);
                    callback(null, 'f')
                }, 300)
            }
        )
        this.hook.tapAsync('node2', (data, callback) => {
                setTimeout(() => {
                    console.log('node2' + data);
                    callback()
                }, 300)
            }
        )
    }

    start() {
        this.hook.callAsync('传参', () => {
            console.log('end');
        });
    }
}


// let t = new Test(AsyncSeriesWaterfallHook)
// t.tap()
// t.start()

let t2 = new Test(MyAsyncSeriesWaterfallHook)
t2.tap()
t2.start()
