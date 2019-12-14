# Proxy使用
Proxy是一个类,要`new`来实例化
```typescript
let o = new Proxy(target,handler)
```
* `target`指要代理的对象
* `handler`一个对象,对`target`操作进行拦截的对象
举例:
```typescript
let obj = {name: 'brook'};
let p = new Proxy(obj, {
    get(target, property) {
        console.log(target, property);//{ name: 'brook' } 'name'
        return target[property];
    }
});

console.log(p.name); // 'brook
```
`p`为`obj`的代理,里面写了`get`函数进行拦截,访问属性时的操作
* `get(target,property)` 
    * `target`是`obj`对象
    * `property`是访问的属性名这里是`name`

# Proxy可拦截的操作

> ### get
`get(target, propKey, receiver)`
* `taget`是目标对象
* `propKey`被拦截到的属性名
* `receiver`new出的Proxy对象

**拦截** 以下操作
* 访问属性: `proxy[key]`和`proxy.key`
* 访问原型链上的属性: `Object.create(proxy)[key]`
* `Reflect.get()`

通过Proxy来让数组支持索引位负的情况
```typescript

let arr = ["b", "r", "o", "o", "k"]
let p = new Proxy(arr, {
    get(target, property) {
        console.log(property)
        let index = Math.abs(Number(property))  // 取负数的绝对值
        return arr[index]
    }
})
console.log(p[-2])  //输出o
```

> ### set
`set(target, propKey, value, receiver)`
* `value`拦截到的赋值
* `receiver`一般为proxy对象, 若proxy对象在原型链上(此时就不是proxy对象)
* 必须返回布尔值,true表示成功,false失败

**拦截** 以下操作
* 赋值属性: `proxy[key]=val`和`proxy.key=val`
* 访问原型链上的属性: `Object.create(proxy)[key] = val`
* `Reflect.set()`

数组赋值时不是`number`类型就赋值0
```typescript
let arr: any[] = [];
let p = new Proxy(arr, {
    set(target, property, value, receiver) {
        if (typeof value != 'number') {  // 不是number就设为0
            value = 0;
        }
        target[property] = value
        return false;
    }
});

p[0] = 11;
p[1] = 'brook';

console.log(p[0]); // 11
console.log(p[1]); // 
```

`receiver`对象不是proxy时
```typescript
let o: { name: any } = {name: ""}
let p = new Proxy(o, {
    set: function (target, property, value, receiver) {
        console.log(receiver)
        target[property] = value
        return true
    }
});
p.name = 1 
let o2 = Object.create(p)
o2.name = 2
//第一次log { name: '' } p对象 
//第二次log {} o2对象
```

> ### apply
`apply(target, thisArg, arguments)`
* `target`目标对象(函数)
* `thisArg`被调用时的上下文对象
* `arguments`被调用时的参数列表 
* 可以返回任意值

**拦截** 以下操作
* `proxy(...args)`
* `Function.prototype.apply()`和`Function.prototype.call()`
* `Reflect.apply()`

```typescript
let o = {
    sum: function (a, b) {
        return a + b;
    }
}
const handler = {
    apply: function (target, thisArg, argumentsList) {
        console.log(thisArg === newO) // true
        return target(argumentsList[0], argumentsList[1]) * 10;
    }
};

let newO = {sum: new Proxy(o.sum, handler)}
console.log(newO.sum(1, 2));
```

> ### construct
`construct(target, argumentsList, proxy)`
* `target` 目标对象
* `argumentsList` constructor参数列表
* `proxy` proxy对象

**拦截** 以下操作
* 拦截`new`操作符`new proxy(...args)`
* `Reflect.construct()`

```typescript
function monster1(disposition) {
    this.disposition = disposition
}

const handler1 = {
    construct(target, args, proxy) {
        return new target(...args)
    }
}

const proxy1 = new Proxy(monster1, handler1)
new proxy1('fierce')
```

> ### has
`has(target, prop)`
* `target` 目标对象
* `prop` 进行检查是否纯在的属性
* `return`需要返回一个boolean属性值

**拦截** 以下操作
* 主要针对`in`操作的钩子
* 属性查询:`key in proxy`
* 继承属性查询: `key in Object.create(proxy)`
* `with`检查:`with(proxy){(key)}`
* `Reflect.has()`

```typescript
let p = new Proxy({}, {
    has: function (target, prop) {
        return true
    }
});
console.log(p) // {}
console.log('a' in p) // true
console.log('a' in Object.create(p)) //true
```

> ### getPrototypeOf
`getPrototypeOf(target)`
* `target` 目标对象
* `return`需要返回一个object或null

**拦截** 以下操作
* `instanceof`
* `__proto__`
* `Object.getPrototypeOf()`
* `Object.prototype.isPrototypeOf()`
* `Reflect.getPrototypeOf()`
```typescript
let obj = {}
let p = new Proxy(obj, {
    getPrototypeOf(target) {
        return Array.prototype
    }
})
console.log(
    Object.getPrototypeOf(p) === Array.prototype,  // true
    Reflect.getPrototypeOf(p) === Array.prototype, // true
    p.__proto__ === Array.prototype,               // true
    Array.prototype.isPrototypeOf(p),              // true
    p instanceof Array                             // true
)
```

> ### setPrototypeOf
`getPrototypeOf(target,prototype)`
* `target` 目标对象
* `prototype` 对象新原型或为null
* `return`若成功修改你要返回true,否则返回false

**拦截** 以下操作
* `Object.setPrototypeOf()`
* `Reflect.setPrototypeOf()`

```typescript
let handlerReturnsFalse = {
    setPrototypeOf(target, newProto) {
        Object.setPrototypeOf(target, newProto)
        return true
    }
}
let o = {a: 1}
let p1 = new Proxy({}, handlerReturnsFalse)
console.log(Object.getPrototypeOf(p1)) //{}
Object.setPrototypeOf(p1, o)
console.log(Object.getPrototypeOf(p1)) //{a:1}
```


> ### deleteProperty
`deleteProperty(target,property)`
* `target` 目标对象
* `property` 待删除的属性名
* `return`若删除成功,你要返回true,否则返回false

**拦截** 以下操作
* 删除属性: `delete proxy[foo]` 和 `delete proxy.foo`
* `Reflect.deleteProperty()`

```typescript
let p = new Proxy({a: 1}, {
    deleteProperty: function (target, prop) {
        delete target[prop]
        return true
    }
})
console.log(p) // { a: 1 }
delete p.a 
console.log(p) // {}
```
> ### ownKeys    
`ownKeys(target)`
* `target` 目标对象
* `return` 必须返回一个可枚举对象,且元素类型必须是`String`或`Symbol`

**拦截** 
* `Object.keys()`
* `Object.getOwnPropertyNames()`
* `Object.getOwnPropertySymbols()`
* `Reflect.ownKeys()`
* 具体效果看代码
```typescript
let p = new Proxy({z: 1, x: 1}, {
    ownKeys: function (...arg) {
        return [Symbol(), 'k', 'z']
    }
})

console.log(Object.keys(p)) //[ 'z' ]
console.log(Object.getOwnPropertyNames(p))//[ 'k', 'z' ]
console.log(Object.getOwnPropertySymbols(p))//[ Symbol() ]

```


> ###还有一些不常用的方法
* `defineProperty()`
    * 用于拦截对对象的`Object.defineProperty()` 操作。
* `getOwnPropertyDescriptor()`
    * 用于拦截对对象的`Object.getOwnPropertyDescriptor()` 操作。
* `isExtensible`
    * 用于拦截对对象的`Object.isExtensible()` 操作。
* `preventExtensions()`
    * 用于拦截对对象的`Object.preventExtensions()` 操作。
    
    