import {AsyncParallelHook} from "tapable";

//不返回undefined的函数多次执行
class MyAsyncParallelHook {
    tasks = []
    argsLength = 0

    constructor(args = []) {
        this.argsLength = args.length
    }

    tapPromise(name, task) {
        this.tasks.push(task)
    }

    promise(...args) {
        let promises = this.tasks.map(callback => callback(...args))
        // @ts-ignore
        return Promise.all(promises)
    }
}

class Test {
    hook = null

    constructor(Hook) {
        this.hook = new Hook(['name','f'])
    }

    tap() {
        // @ts-ignore
        this.hook.tapPromise('node',  name => new Promise((resolve, reject)=> setTimeout(()=>{
                console.log('node' + name);
                resolve()
            },1000)
        ))

        // @ts-ignore
        this.hook.tapPromise('react',  name => new Promise((resolve, reject)=> setTimeout(()=>{
                console.log('react' + name);
                resolve()
            },1000)
        ))


    }

    start() {
        this.hook.promise('传参').then (() => {
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
