# 基础类型

> ### 布尔
* ```let is:boolean = false```

> ### 数字
* `let n:number = 6`
* `let n:number = 0xf00d`
* `let n:number = 0b1010`
* `let n:number = 0o744`

> ### 字符串
* `let s:string = "fuck"`
* ```let s:string = `模板字符串` ```

> ### 数组
* `let list:number[] = [1,2,3]`
* `let list:Array<number> = [1,2,3]`

> ### 元祖 Tuple
* `let list:[string,number] = ["s",1] `
* 顺序也必须相同 , 越界赋值为联合类型

> ### 枚举
```typescript
enum Color {Red,Green,Blue} //默认0开始
let c:Color = Color.Green   //值为1

//可赋值
enum Color {Red=1,Green=2,Blue=4} 
//可以获取其名字
let c:string = Color[1] //Red
```

> ### Any(任意类型)
```typescript
let notSure: any = 4
notSure = "maybe a string instead"
notSure = false
```
与Object类型的区别 , Object类型变量不允许调用上面的任意方法 , 但是any类型可以.
```typescript
let notSure: any = 4
notSure.toFixed() // ok

let prettySure: Object = 4
prettySure.toFixed() // Error: Property 'toFixed' doesn't exist on type 'Object'.
```
在数组时 , any类型也有用
```typescript
let list: any[] = [1, true, "free"];
```

> ### Void
* `let unusable:void = undefined`
* 官网说可以赋值null，但是我测试会报错.

> ### Null和Undefined
* `let u: undefined = undefined`
* `let n: null = null`

> ### Never
永远不会返回值的类型
```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail():never {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}    
```

> ### Object
除了number，string，boolean，symbol，null或undefined之外的类型。
* `let o: object = {}`
* `let o: object = new String() `
* `let o: object = ""//报错`
* `let o: object = 1 //报错`


> ### 类型断言
* 尖括号 语法
```typescript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
* as 语法
```typescript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```
两种等价 , 在用jsx时只有as语法可以用






<br/>
<br/>
<br/>
<br/>





# 变量声明

> ### let
* `let h = "hello"`
* 声明会产生块级作用域
* 不能在声明前访问 , 暂时性死区
    * 包括函数
        ```typescript
        function foo() {
            // okay to capture 'a'
            return a;
        }
        
        // 不能在'a'被声明前调用'foo'
        // 运行时应该抛出错误
        foo();
        
        let a;
        ```
* 不能多次声明

> ### const
* `const numLivesForCat = 9`
* 与let相同作用域规则
* 赋值后不可变







<br/>
<br/>
<br/>
<br/>





# 解构

> ### 结构数组
* 取值
    * `let [a, b] = [0, 1]`
    * `let [ , b , , d] = [0, 1, 2, 3] // b=1 d=3`
* 交换变量值
    * `[a,b] = [b,a]  `
    * 数组内交换
        ```
        let a = [1, 2];
        [a[0], a[1]] = [a[1], a[0]]
        ```
* 函数参数
    ```typescript
    function f([first, second]: [number, number]) {
        console.log(first);
        console.log(second);
    }
    
    f([1, 2]);
    ``` 
* 用`...`创建剩余变量
    ```typescript
    let [first, ...rest] = [1, 2, 3, 4];
    console.log(first); //  1
    console.log(rest);  //  [ 2, 3, 4 ]
    ```

> ### 对象解构
* 取值
    * `let {a, b} = {a: 1, b: 2}`
    * `({a, b} = {a: 3, b: 4})//用括号包起来 , js会把{}解析为一个块语句而不是object `
* 用`...`创建剩余变量
    ```typescript
    let {a, ...c} = {a: 1, b: 2, c: 3};
    console.log(a); // 1
    console.log(c); // { b: 2, c: 3 }
    ```
* 属性重命名
    ```typescript
    let {a: a1, b: b1} = {a: 1, b: 2};
    console.log(a1);
    console.log(b1);
    ```
    若要指示类型<br/>
    `let {a: a1, b: b1}: { a: number, b: number } = {a: 1, b: 2};`
* 默认值
    * 值为undefined时赋值默认值
    * `let {a: a1, b: b1 = 3} = {a: 1};`
* 函数参数
    ```typescript
    function f({a, b}: { a: number, b: number }): void {
        console.log(a);
        console.log(b);
    }
    f({a: 1, b: 2})   
    //加入参数默认值
    function f({a = 9, b = 9}: { a: number, b: number } = {a: 0, b: 0}): void {}
    ```
    对象解构请保持简单,否侧会难以理解.
    
> ### 展开
* 数组展开
    ```typescript
    let a = [0, ...[1, 2, 3], ...[4, 5, 6]] // [ 0, 1, 2, 3, 4, 5, 6 ]
    ```
* 对象展开
    ```typescript
    let a = {a: 2, ...{a: 1, b: 2}}
    console.log(a); // { a: 1, b: 2 }
    ```
    属性相同值会被后面的覆盖







<br/>
<br/>
<br/>
<br/>







# 接口

> ### 语法
```typescript
interface LabelledValue {
  label: string
}
```

> ### 可选属性
* 某些属性不一定是必须的,加`?` 
    ```typescript
    interface SquareConfig {
      color?: string
      width?: number
    }
    ```

> ### 只读属性 readonly
```typescript
interface Point {
    //x,y的值无法被修改
    readonly x: number;
    readonly y: number;
} 
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

> ### 只读数组类型 ReadonlyArray
* 此类型去掉了所有可变方法
    ```typescript
    let r: ReadonlyArray<number> = [1, 2, 3, 4]
    r[0] = 1  // error
    r.push(1)  // error
    ```
* 转换为普通数组
    ```typescript
    let a: number[] = r as number[]
    ```

> ### 字符串索引签名
```typescript
interface SquareConfig {
    color?: string;
    width?: number;
    [key: string]: any;
}
//可以添加任意属性
let a: SquareConfig = {test: 1}
```

> ### 函数类型
```typescript
interface SearchFunc {
  //参数列表 : 返回值    
  (source: string, subString: string): boolean;
}
//参数名可以不同
let my: SearchFunc = function (src: string, subString: string): boolean {
    return src + subString === ""
}
//自动类型推导
let my: SearchFunc = function (src, subString){
    return src + subString === ""
}
```

> ### 可索引的类型
```typescript
interface StringArray {
  //对象的 key类型:value类型  
  [index: number]: string;
}

let myArray: StringArray = ["Bob", ""];
```
* ts支持两种签名:string和number
    ```typescript
    interface NumberDictionary {
      [key: string]: number;
      length: number;    // 可以，length是number类型
      name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
    }
    ```
* 只读索引签名
    ```typescript
    interface ReadonlyStringArray {
        readonly [index: number]: string;
    }
    let myArray: ReadonlyStringArray = ["Alice", "Bob"];
    myArray[2] = "Mallory"; // error!
    ```    
* 同时设置string,number两种签名,两种类型要一致

> ### 类类型
* 实现接口 implements
    * `类名 implements 接口`
    * 接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
* 类静态部分与实例部分的区别
下面代码会报错,因为接口无法实现检测constructor
```typescript
interface ClockConstructor {
    new(hour: number, minute: number): ClockConstructor;
}
class Clock implements ClockConstructor {
}
```
可以定义一个函数去实现
```typescript
interface Test1 {
    new(hour: number, minute: number): Test2;
}

interface Test2 {
}
// 在这里可以使用
function create(ctor: Test1, hour: number, minute: number): Test2 {
    return new ctor(hour, minute);
}

class DigitalClock implements Test2 {
}

class AnalogClock implements Test2 {
}

create(DigitalClock, 12, 17);
create(AnalogClock, 7, 32);

```

> ### 拓展接口
* 可以继承,多继承
```typescript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}
```

> ### 混合类型
* 一个函数对象带有属性
```typescript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

> ### 接口继承类
* 当接口继承了类,自动获取类的成员,包括方法,但是没有具体实现
* 接口会继承类的private和protected成员
    * 此接口只能被这个类,和子类实现(implement)
```typescript
class C1 {
    private key: any
}

interface I1 extends C1 {
    method(): void
}
// 接口继承了C1 但是C3没有继承C1 报错
class C3 implements I1 {
    private key: any;

    method(): void {
    }

}
// C2为C1的子类所以可以实现I1
class C2 extends C1 implements I1 {
    method(): void {
    }
}
```







<br/>
<br/>
<br/>
<br/>








# 类
* 继承后`constructor`中第一行必须写`super`
    * `constructor(name: string) { super(name) }`
> ### 权限修饰符
* `public`默认为此值
* `private` 私有
    * 只能在类的内部访问
* `protected`受保护
    * 只能在类和其派生类(子类)访问   

> ### readonly修饰符
* 类属性也可以设置为只读
    * 只能在声明或构造函数被初始化
        ```typescript
          class C {
              readonly name: string = "1"
          
              constructor() {
                  this.name = "2" //此为最终值 
              }
          }
        ```
        
> ### 参数属性
* 在`constuctor`中将实例属性,声明并赋值
    ```typescript
    class Test {
        constructor(
            readonly name: number,
            public age: number,
            private weight: number,
            protected height: number
        ) {
            console.log(this.name, this.age, this.weight, this.height);
            //1 2 3 4
        }
    }
    new Test(1, 2, 3, 4)
    ```
* `public` `private` `protected` `readonly` 都可以实现参数属性
* 可读性差(个人感觉)

> ### 存取器
```typescript
class Test {
    protected _key: number = 0

    get key() {
        console.log("get key");
        return this._key;
    }

    set key(value) {
        console.log("set key value:" + value);
        this._key = value;
    }
}
let t = new Test()
t.key = 1 + t.key
//get key
//set key value:1
```
* 只带get的属性,会被自动推断为readonly
* 不能转换为ECMAScript 3的代码

> ### 静态属性
```typescript
class Test {
    static origin = {
        x: 0,
        y: 0
    }
}
```
> ### 抽象类 abstract
```typescript
abstract class Animal {
    abstract makeSound(): void;
}
new Animal() //error
```
* 抽象方法必须在派生类(子类)中实现
* 不能创建一个抽象类实例

> ### 类当做接口用
```typescript
class Point {
    x: number = 0
    y: number = 0
}

interface Point3d extends Point {
    z: number
}

let point3d: Point3d = {x: 1, y: 2, z: 3}
```







<br/>
<br/>
<br/>
<br/>





``

# 函数
> ### 函数类型
```typescript
function add(x: number, y: number): number {
    return x + y
}

let myAdd = function (x: number, y: number): number {
    return x + y
}
myAdd = (x: number, y: number): number => x + y
```
完整的函数类型
```typescript
let myAdd: (xValue: number, yValue: number) => number
// 类型参数的名字 不必和 函数参数名字相同
myAdd = function (x: number, y: number): number {
    return x + y
}
myAdd = (x: number, y: number): number => x + y
```

> ### 可选参数 和 默认参数
* 用`?`来实现可选参数
* 可选参数必须在必须参数后面
* 提供默认参数 , 则不能让其变为可选参数
```typescript
function buildName(firstName: string, lastName: string = "默认参数") {
    return firstName + " " + lastName
}

buildName("Bob")  // Bob 默认参数
buildName("Bob", "Adams")  // Bob Adams
```

> ### 剩余参数`...`
* 是个数组
```typescript
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ")
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie")
```

> ### 重载
```typescript
function test(x: number): string
function test(x: string): number
//实现方法
function test(x: any): any {
    if (typeof x === 'number') {
        return "重载"
    } else if (typeof x === 'string') {
        return 1
    }
}

console.log(test(2));
console.log(test(""));
```
* 这里只有2个重载 `function test(x: any): any`并不是重载列表的一部分







<br/>
<br/>
<br/>
<br/>







# 泛型
> ### 简单使用
* `T`是你传入的类型`<string>`
```typescript
function identity<T>(arg: T): T {
    return arg
}

let output = identity<string>("myString")
console.log(output) //myString
```

> ### 泛型函数的使用
```typescript
function identity<T>(arg: T): T {
    return arg
}
```
有两种方式定义
```typescript
let myIdentity: <T> (arg: T) => T
```
用带有调用签名的对象字面量来定义泛型函数：
```typescript
let myIdentity: { <T>(arg: T): T }
```

> ### 泛型接口
```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```
在接口上直接加上泛型,而非方法
```typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

> ### 泛型类
```typescript
class GenericNumber<T> {
    zeroValue: T
    add: (x: T, y: T) => T
}
```
* 泛型类是实例部分,静态部分不能用泛型类

> ### 泛型约束
* 用extends来约束泛型
* 必须转入符合约束类型的值
```typescript
interface Lengthwise {
    length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length)
    return arg
}
loggingIdentity(3);  // Error
loggingIdentity({length: 10, value: 3});
```

> ### 在泛型中使用类类型
* 引用构造函数
```typescript
function create<T>(c: { new(): T; }): T {
    return new c()
}
```
使用原型属性推断并约束构造函数与类实例的关系
```typescript
class A {
    a: number
}

class B extends A {
    b: string
}

function createInstance<T extends A>(c: new() => T): T {
    return new c()
}

console.log(createInstance(B).b);
```







<br/>
<br/>
<br/>
<br/>







# 枚举
> ### 数字枚举
```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```
* 默认从0开始
* 自增长,其余成员自动加1, `Down`为2,`Left`为3

> ### 字符串枚举
```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```
* 没有自增长

> ### 计算枚举
```typescript
enum E {
    A = Math.max(0,1),
    B = Math.abs(-2),
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    G = "123".length,
    C, //错误 没有自增长 必须初始化
}
```
* 没有自增长
 
> ### 枚举也是类型
```typescript
enum ShapeKind {
    Circle,
    Square,
}

interface Square {
    kind: ShapeKind;
    sideLength: number;
}

const a: Square = {
    kind: ShapeKind.Square,
    sideLength: 1
}
```
```typescript
enum E {
    Foo,
    Bar,
}

function f(x: E.Bar) {
    console.log(x);
}

f(E.Bar)
```

> ### 运行时的枚举
* 运行时 , 是对象
```typescript
enum E {
    X, Y, Z
}

function f(obj: { X: number }) {
    return obj.X;
}

console.log(f(E)); // 0
```

> ### 反向映射
* 从枚举值->枚举名
    * 不支持字符串枚举, 只有数字枚举可以
```typescript
enum Enum {
    A
}
let a = Enum.A
let nameOfA = Enum[a]
console.log(nameOfA)// "A"
```

> ### const枚举
* 为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问
```typescript
const enum Enum {
    A = 1,
    B = A * 2
}
```







<br/>
<br/>
<br/>
<br/>







# 类型兼容
> ### 介绍
* 结构性类型相同即可
```typescript
interface Named {
    name: string
}

class Person {
    name: string
}

let p: Named
// 合法代码
p = new Person()
```

> ### 兼容
* 基本规则: 要有相同属性
```typescript
interface Named {
    name: string
}

let x: Named 
let y = {name: 'Alice', location: 'Seattle'}
//合法
x = y 
//不合法  不能直接赋值
x = {name: 'Alice', location: 'Seattle'}
```

> ### 函数
* 简单说 大的能兼容小的 , 反之不行
```typescript
let x = (a: number) => 0;
let f = (b: number, s: string) => 0;

f = x; // OK
x = f; // Error
```
* 返回值
```typescript
let x = () => ({name: 'Alice'});
let y = () => ({name: 'Alice', location: 'Seattle'});

x = y; // OK
y = x; // Error
```

> ### 类型
* 只比较: 实例成员
* 不比: 构造函数,静态成员
```typescript
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) {}
}
class Size {
    feet: number;
    constructor(numFeet: number) {}
}
let a: Animal;
let s: Size;
a = s;  // OK
s = a;  // OK
```







<br/>
<br/>
<br/>
<br/>









# 高级类型
> ### 交叉类型(Intersection Types)
* 将多个类型叠加 T&U
```typescript
 function extend<T, U>(first: T, second: U): T & U {
    let result = <T&U>{}
    for (const key in first) {
        result[key] = (<T&U>first)[key]
    }
    for (const key in second) {
        result[key] = (<T&U>second)[key]
    }
    return result
}

class Person {
    constructor(public name: string) { }
}
class ConsoleLogger  {
    log() {}
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
```

> ### 联合类型(Union Types)
* 用|分隔每个类型 string|number
* 只能访问联合联系中共有的成员
```typescript
class Bird {
    fly(){}
    layEggs(){}
}
class Fish {
    swim(){}
    layEggs(){}
}

function getSmallPet(arg:string|number):Bird |Fish{
    if(typeof arg === "string"){
        //类型判断后 即可使用所有成员
        console.log(arg.charAt(0));
        return new Bird()
    } else if(typeof arg === 'number'){
        console.log(arg.toFixed(3));
        return new Fish()
    }
}

let pet = getSmallPet(1);
pet.swim() // Error
```

> ### 类型保护与区分类型
```typescript
// 每一个成员访问都会报错
if (pet.swim) {
    pet.swim();
}
else if (pet.fly) {
    pet.fly();
}
```
* 用类型断言，让代码工作
```typescript
if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}else {
    (<Bird>pet).fly();
}
```
> ### 类型保护
* 上面要用多次类型断言，要是一次检查类型后续分支清楚知道pet类型就好了，类型保护就为了这个目的
* 用法 函数返回值为`参数 is 类型`
```typescript
// 注意函数返回值
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined
}
//根据返回值的true false 判断是否为Fish类型
```
* TypeScript不仅知道在 if分支里 pet是 Fish类型； 它还清楚在 else分支里，一定 不是 Fish类型，一定是 Bird类型。
```typescript
if (isFish(pet)) {
    pet.swim();
}else {
    pet.fly();
}
```

> ### typeof 类型保护
* typeof也会被识别为类型保护
* 只支持"number"， "string"， "boolean"或 "symbol"。 但是TypeScript并不会阻止你与其它字符串比较，但不会把那些表达式识别为类型保护。
```typescript
function test(arg:any){
    if(typeof arg === 'string'){
        arg.toLocaleLowerCase()
    }
}
```

> ### instanceof 类型保护
* 右侧为构造函数
```typescript
if (pet instanceof Bird) {
    pet.fly()
} else {
    pet.swim()
}
```

> ### null
* unll和undefined被认为可以复制为任何类型
* 开启`strictNUllChecks:true`,声明变量时,不会自动保护null|undefined
* 你可以用联合类型主动包含
```typescript
let s = "foo";
s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以

sn = undefined; // error, 'undefined'不能赋值给'string | null'
```

> ### 可选参数和可选属性
* 可选参数类型自动加上 `|undefined`
```typescript
function test(a?: number) {
    console.log(a); // undefined
    return
}
test()
test(undefined) 
// 不会报错, 可选参数自动加了undefined
```
* 可选属性,同样处理
```typescript
class C {
    a: number;
    b?: number;
}

let c = new C();
c.a = 12;
c.a = undefined; // error, 'undefined' is not assignable to 'number'
c.b = 13;
c.b = undefined; // ok
c.b = null; // error, 'null' is not assignable to 'number | undefined'
```

> ### 去除null
```typescript
function f(sn: string | null): string {
    if (sn == null) {
        return "default";
    } else {
        return sn;
    }
}
```
```typescript
function f(sn: string | null): string {
    return sn || "default";
}
```
如果编译器不能去除`null`和`undefined`,可以使用类型断言手动去除.<br/>
语法: `object!.key`
```typescript
function fixed(name: string | null): string {
    //嵌套函数,编译器无法知道调用时的name类型
    //用类型断言 !.
    let postfix = () => name!.charAt(0)
    name = name || "Bob"
    return postfix()
}
```

> ### 类型别名
* 给类型起个新名字
```typescript
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver

function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n
    } else {
        return n()
    }
}
```
* 可以是泛型
```typescript
type Container<T> = { value: T }
```
* 可以引用自己
```typescript
type Tree<T> = {
    value: T
    left: Tree<T>
    right: Tree<T>
}
```
* 与 交叉类型 使用, 可以创建出奇怪的类
```typescript
type LinkedList<T> = T & { next: LinkedList<T> }

interface Person {
    name: string
}

var people: LinkedList<Person>
var s = people.name
var s = people.next.name
var s = people.next.next.name
var s = people.next.next.next.name
```

> ### 接口 vs 类型别名
* 重要的区别: 类型别名`type`不能`extends`和`implements`.

> ### 字符串字面量类型
* 固定的字符串值
```typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if (easing === "ease-in") {
        } else if (easing === "ease-out") {
        } else if (easing === "ease-in-out") {
        }
    }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // error: "uneasy" is not allowed here
```
* 区分 函数重载
```typescript
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;

function createElement(tagName: string): Element {
}
```

> ### 数字字面量类型
```typescript
type a = 1 | 2 | 3 | 4
let test: a = 1
```

> ### 可辨识联合
* 语法规则
    * 类型都具有相同的属性— 可辨识的特征
    * 一个类型别名包含了那些类型的联合— 联合
```typescript
interface Square {
    kind: "square"
    size: number
}

interface Rectangle {
    kind: "rectangle"
    width: number
    height: number
}

interface Circle {
    kind: "circle"
    radius: number
}
// 联合
type Shape = Square | Rectangle | Circle

function area(s: Shape) {
    // 相同的属性kind
    switch (s.kind) {
        case "square":return s.size
        case "rectangle":return s.height * s.width
        case "circle":return s.radius ** 2
    }
}
```

> ### 多态的`this`类型
* 函数返回值类型为`this`
* 链式调用
```typescript
class BasicCalculator {
    public constructor(protected value: number = 0) {
    }

    public currentValue(): number {
        return this.value;
    }

    public add(operand: number): this {
        this.value += operand;
        return this;
    }

    public multiply(operand: number): this {
        this.value *= operand;
        return this;
    }
}

let v = new BasicCalculator(2)
    .multiply(5)
    .add(1)
    .currentValue();
```
* 继承这个类,新的类使用此方法,不用做任何变化
```typescript

class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }
    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
}

let v = new ScientificCalculator(2)
    .multiply(5)
    .sin()
    .add(1)
    .currentValue();
```

> ### 索引类型(Index types)
用typescript实现,通过`索引类型查询`和`索引访问`
* 索引类型查询
```typescript
interface Person {
    name: string;
    age: number;
}
// 值只能为Person对象的属性
let s: keyof Person = 'name'
let a: (keyof Person)[] = ['name', 'age']
let b: Array<keyof Person> = ['name', 'age']
```
* 索引访问
```typescript
interface Person {
    name: string;
    age: number;
}
// 类型为Person所有属性的类型  string|number
let s: Person[keyof Person] = 'name'
s = 1
s = true //error
```
* 检查动态属性<br/>
举例: javascript中的从对象中取属性
```javascript
function pluck(o, names) {
    return names.map(n => o[n]);
}
```
typescript: 
```typescript
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, string[]
//idea中会提示错误(运行时是无错的) 
//vscode不会提示错误,对ts支持比idea更好
//idea可以这样解决
let strings = pluck<Person, keyof Person>(person, ['name'])
//但是这样就不是string[]了, 而是(number|string)[]
//因为Person的属性值age是number类型
```

> ### 映射类型
* 将 类型的属性 变为 可选属性,只读属性
* TS提供了从旧类型中 创建 新类型的一直方式 映射类型
```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}
type Partial<T> = {
    [P in keyof T]?: T[P]
}
type PersonPartial = Partial<Person>
type ReadonlyPerson = Readonly<Person>
```
简单的映射类型
```typescript
type Keys = 'option1' | 'option2'
type Flags = { [K in Keys]: boolean }
let a: Flags = {
    option1: true,
    option2: false
}
```
* 将Person改下
```typescript
type NullablePerson = {
    [P in keyof Person]: Person[P] | null
}
type PartialPerson = {
    [P in keyof Person]?: Person[P]
}
```
 改为通用版本
 ````typescript
type Nullable<T> = {
    [P in keyof T]: T[P] | null
}
type Partial<T> = {
    [P in keyof T]?: T[P]
}
````
注意 Readonly<T>和 Partial<T>用处不小，因此它们与 Pick和 Record一同被包含进了TypeScript的标准库里：
```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
type Record<K extends string, T> = {
    [P in K]: T;
}
```
Readonly， Partial和 Pick是同态的，但 Record不是。 因为 Record并不需要输入类型来拷贝属性，所以它不属于同态：
```typescript
type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>
```

> ### 预定义的有条件类型
* Exclude<T, U> -- 从T中剔除可以赋值给U的类型。
* Extract<T, U> -- 提取T中可以赋值给U的类型。
* NonNullable<T> -- 从T中剔除null和undefined。
* ReturnType<T> -- 获取函数返回值类型。
* InstanceType<T> -- 获取构造函数类型的实例类型。
```typescript
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // any
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // any
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```
没有Omit<T, K>类型，因为它可以很容易的用Pick<T, Exclude<keyof T, K>>来表示。











<br/>
<br/>
<br/>
<br/>









# Symbols
> ### 介绍
* 由`Symbol`函数构建
```typescript
let sym1 = Symbol();

let sym2 = Symbol("key"); // 可选的字符串key
```
* `Symbol`是不可改变且唯一的
```typescript
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, symbols是唯一的
```
* `symbol`也可以被用做对象属性的键
```typescript
const sym = Symbol();
// let sym = Symbol(); 用let会报错，必须用const (不清楚原因)
let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```
* 类成员
```typescript
let getClassNameSymbol = Symbol();

class C {
    [getClassNameSymbol](){
       return "C";
    }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
console.log(className);
```












<br/>
<br/>
<br/>
<br/>









# 送代器和生成器
> ### 可送代性
* 当一个对象实现了`Symbol.iterator`属性时,被认为可送代
* `Array`，`Map`，`Set`，`String`，`Int32Array`，`Uint32Array`等都已经实现了各自的`Symbol.iterator` 
* 对象上的 `Symbol.iterator`函数负责返回供迭代的值。
```typescript
var arr = ['w', 'y', 'k', 'o', 'p'];
var eArr = arr[Symbol.iterator]();
// 您的浏览器必须支持for...of循环
// 以及let —— 将变量作用域限定在 for 循环中
for (let letter of eArr) {
  console.log(letter); //'w', 'y', 'k', 'o', 'p'
}
```
* 另一种方法
```typescript
var arr = ['w', 'y', 'k', 'o', 'p'];
var eArr = arr[Symbol.iterator]();
for (let next = eArr.next(); !next.done; next=eArr.next()) {
    console.log(next.value);
}
```
> ### `for..of`语句

* 遍历可迭代的对象，调用对象上的`Symbol.iterator`方法<br/>
* `for..of`则迭代对象的键对应的值
```typescript
let someArray = [1, "string", false];
for (let entry of someArray) {
    console.log(entry); // 1, "string", false
}
```
> ### `for..in`语句 
* `for..in`迭代的是对象的 键 的列表
```typescript
let list = [4, 5, 6];
for (let i in list) {
    console.log(i); // "0", "1", "2",
}
```












<br/>
<br/>
<br/>
<br/>









# 模块
> ### 导出声明
* 任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加`export`关键字来导出
```typescript
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

> ### 导出语句
* 可以对导出的部分重新命名
```typescript
class ZipCodeValidator {
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

> ### 重新导出
```typescript
//从module文件中拿出 重新导出 重命名为 T在导出
export {重新导出 as T} from "./module";
```
* 将所有文件内`export`的内容,联合导出
```typescript
export * from './module'
//另一个文件 导入
import * as name from "./test2"
```

> ### 导入
* 导入某个导出内容
```typescript
import { ZipCodeValidator } from "./ZipCodeValidator"
```
* 对导入内容重命名
```typescript
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator"
```
* 将整个模块导入到一个变量
```typescript
import * as validator from "./ZipCodeValidator"
```
* 有副作用的导入模块
```typescript
import "./my-module.js"
```

> ### 默认导出
每个模块都可以有一个且只能有一个`default`导出
```typescript
let x = 1
export default x
//在其他文件中导入 x 自定名字
import 自定义名字 from './module'
```
* 函数和声明可以直接被标记为默认导出
```typescript
export default class a {}
//函数
export default function () {}
```
* 导出也可以是一个值
```typescript
export default '123'
```

> ### 动态模块加载
```typescript
declare function require(moduleName: string): any;

import {Zip} from "./module"

setTimeout(() => {
    Zip()
    let test2= require("./test2");
    console.log(test2.f1());
}, 1000)
```

> ### 使用其他JavaScript库

想描述非TypeScript编写的类库的类型，我们需要声明类库所暴露出的API。

我们叫它声明因为它不是“外部程序”的具体实现。 它们通常是在 .d.ts文件里定义的。 如果你熟悉C/C++，你可以把它们当做 .h文件。 让我们看一些例子。

> ### 外部模块
在Node.js里大部分工作是通过加载一个或多个模块实现的。 我们可以使用顶级的 export声明来为每个模块都定义一个.d.ts文件，但最好还是写在一个大的.d.ts文件里。 我们使用与构造一个外部命名空间相似的方法，但是这里使用 module关键字并且把名字用引号括起来，方便之后import。 例如：
```typescript
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep: string;
}
```

现在我们可以/// <reference> node.d.ts并且使用import url = require("url");或import * as URL from "url"加载模块。

```typescript
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```












<br/>
<br/>
<br/>
<br/>









# 声明合并

> ### 合并接口
合并的机制是把双方的成员放到一个同名的接口里。
```typescript
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}

let box: Box = {height: 5, width: 6, scale: 10};
```
接口的非函数的成员应该是唯一的。如果它们不是唯一的，那么它们必须是相同的类型。如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错。

对于函数成员，每个同名函数声明都会被当成这个函数的一个重载。 同时需要注意，当接口 A与后来的接口 A合并时，后面的接口具有更高的优先级。

如下列所示: 
```typescript
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
}
```
这相当于
```typescript
interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
    clone(animal: Sheep): Sheep;
    clone(animal: Animal): Animal;
}
```

> ### 合并命名空间
对于导出的成员进行合并
```typescript
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```
等同于
```typescript
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```
非导出成员,仅在其原有的（合并前的）命名空间内可见。

这就是说合并之后，从其它命名空间合并进来的成员无法访问非导出成员。
```typescript
namespace Animal {
    let haveMuscles = true;

    export function animalsHaveMuscles() {
        return haveMuscles;
    }
}

namespace Animal {
    export function doAnimalsHaveMuscles() {
        return haveMuscles;  // Error,访问不到haveMuscles
    }
}
```













