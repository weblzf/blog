import {AsyncSeriesHook} from "tapable";
//异步串行

class MyAsyncSeriesHook {
    tasks = []
    argsLength = 0

    constructor(args = []) {
        this.argsLength = args.length
    }

    tapAsync(name, task) {
        this.tasks.push(task)
    }

    callAsync(...args) {
        let callback = args[this.argsLength]
        args = args.splice(0,this.argsLength)
        let i = 0
        let next = ()=>{
            if(this.tasks.length === i){
                return callback()
            }
            this.tasks[i](...args,next)
            i++
        }
        next()
    }
}

class Test {
    hook = null

    constructor(Hook) {
        this.hook = new Hook(['name'])
    }

    tap() {
        this.hook.tapAsync('node',(name,callback)=>{
                setTimeout(()=>{
                    console.log('node' + name);
                    callback()
                },300)
            }
        )
        this.hook.tapAsync('node2',(name,callback)=> {
                setTimeout(() => {
                    console.log('node2' + name);
                    callback()
                }, 300)
            }
        )
    }

    start() {
        this.hook.callAsync('传参',() => {
            console.log('end');
        });
    }
}


let t = new Test(AsyncSeriesHook)
t.tap()
t.start()

let t2 = new Test(MyAsyncSeriesHook)
t2.tap()
t2.start()
