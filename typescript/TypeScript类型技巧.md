# TypeScript

## 类型

### keyof

`keyof T` 产生T类型的属性名称构成的字符串联合类型

返回一个,`属性名`构成的`联合类型`

```typescript
interface o {
  a:string,
  b:boolean
}

type s = keyof o // type s = "a" | "b"
```

对索引类型则是`string | number`

```typescript
interface o<T> {
  [key: string]: T
}
type s = keyof o<boolean> // string | number
type s2 = o<boolean>['d'] // boolean
```

### in

语法类似于for...in

```
type ks = 'o' | 'a' | 'b'
type t = {
  [K in ks]?: boolean
}

type Partial<T> = {
  // 可以理解为像for in一样
  // P被循环赋值为 keyof T(即T的属性名集合)
  [P in keyof T]?: T[P]
}
// 伪代码 可以这样理解 把以下代码想象为类型
let newType = {}
for ( const P in Object.keys(T) ) {
  newType[P] : T[P]
}
```

### 交叉类型 (Intersection Types)

类型与运算

```typescript
type o = {
  a: string
}
type b = {
  s: boolean
}

type t = o & b // {a:string,s:boolean}
```

### 联合类型 (Union Types)

类型或运算

```typescript
let val:number | string;
```

在类型运算中,会将每个类型单独计算一次后,在将结果结合为联合类型
```typescript
type PropertyNames<T> = {
  [K in keyof T]: K
}[keyof T]; // keyof 返回联合类型

interface Part {
  id: number;
  name: string;
  subparts: Part[];
}

type T40 = PropertyNames<Part>;  // 'id' | 'name' |'subparts'
```

### 类型识别

确认是否为联合类型中的一种类型

```typescript
// 基本类型 typeof
function ant(param: string | number) {
  if (typeof param === "number") {
    console.log(param+5);
  }
  if (typeof param === "string") {
    console.log(param+"string");
  }
}
// 对象类型 instanceof
function ant(param: Date | Element) {
  if ( param instanceof Date ) {
    param.getDate()
  } else {
    param.innerHTML = ''
  }
}
```

### 字符字面量类型

值只能是定义的字面量类型

```typescript
type s = "字面量"
let str:s =  "字面量"
```

### this类型

返回类型为`this`, 可以是子类

```
class Bird {
  fly(): this {
    return this
  }
}

class Boy extends Bird {
  eat(): this {
    return this
  }
}


let o = new Boy()
o.fly()
 .eat()
 .fly()
```

### 映射类型 (Mapped types)

将所有属性,修改为新类型

通过`in`和`keyof`来实现

简单的映射类型

```typescript
type keys = 'o' | 'a' | 'b'
type T = {
  [K in keys]?: boolean
}
let o: T = {
  o : true
}
```



```typescript
type Test<T> = {
 readonly  [P in keyof T]: T[P] | number
}

let t: Test<{ a: string }> = {
  a : 1 // number或string
}
t.a = 2 //错误 不可修改 

//选取属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[K]
}
let o: Pick<{ a: number, b: string, c: boolean }, 'a'> = {
  a : 1
}


type Reord<K extends keyof any, T> = {
  [P in K]: T
}

let o: Reord<keyof { a: 1, b: () => 1 }, number> = {
  a : 1,
  b : 2
}
```

### 条件类型 (Conditional Types)

`T extends U ? X : Y` 可能类型为`X`或者`Y`或者`X|Y`


```typescript
type TypeName<T> =
  T extends string ? "string" :
    T extends number ? "number" :
      T extends boolean ? "boolean" :
        T extends undefined ? "undefined" :
          T extends Function ? "function" :
            "object";

const name: TypeName<String> = 'object'
```

注意: 对于联合类型,则将每个类型分别计算一次
例如:
```
T extends U ? X : Y
使用类型参数A | B | C
被解析为(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)

type T = TypeName<string | []> // 'string' | 'object'

//并集
type Filter<T, U> = T extends U ? T : never
type T31 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"
//差集
type Diff<T, U> = T extends U ? never : T;
type T30 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
//从T类型删除null,undefined类型
type NonNullable<T> = Diff<T, null | undefined>; 
```

函数返回类型不确定时也可能为联合类型

```typescript
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  let a = f(x) // a类型为 string | number
  let b: string | number = a
}
```

### 条件类型中的类型推断

在`extends`中使用,表示在`extends`条件语句中声明待推断的类型变量

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type f = () => number

let o :ReturnType<f> = 1 // number
```
// 解包类型

```typescript
type Unpacked<T> = T extends (infer U)[] ? U :
                   T extends (...args: any[]) => infer U ? U :
                   T extends Promise<infer U> ? U :
                   T
type T0 = Unpacked<string>;  // string
type T1 = Unpacked<string[]>;  // string
```

多个候选项,合成为联合类型
```typescript
type Foo<T> = T extends { a: infer U, b: infer U } ? U : never
type T10 = Foo<{ a: string, b: string }>;  // string
type T11 = Foo<{ a: string, b: number }>;  // string | number
```

多个候选项,合成为交叉类型
```typescript
type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
type T20 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;  // string
type T21 = Bar<{ a: (x: string) => void, b: (x: number) => void }>;  // string & number
```

重载函数的类型推断时，从最后一个签名（可能是最宽松的情况）进行推断。
```typescript
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;
type T30 = ReturnType<typeof foo>;  // string | number
```



## 内置类型模板

### 所有属性转为可选 (Partial)

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

### 所有属性转为必须 (Required)

```typescript
type Required<T> = {
    [P in keyof T]-?: T[P];
}
```

### 所有属性转为只读 (Readonly)

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
```

### 从类型中选取某属性 (Pick)

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
```

### 规定对象的键值对类型 (Record)

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T;
}
```

### 去除联合类型中的某些类型 (Exclude)

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

### 提取共有类型 (Extract)

```typescript
type Extract<T, U> = T extends U ? T : never;
```

### 去除null undefined (NonNullable)

```typescript
type NonNullable<T> = T extends null | undefined ? never : T
```

### 获取函数的参数类型 (Parameters)

```typescript
type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
```

### 获取构造函数的参数类型 (ConstructorParameters)

```typescript
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never
```

### 函数返回值类型 (ReturnType)

```typescript
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer P ? P : any
```

### 返回构造函数类型的实例类型 (InstanceType)

```typescript
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;
```

### ThisType

```typescript
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M>  // Type of 'this' in methods is D & M
}


function makeObject<D extends object, M extends object>(
  { data = {} as D, methods = {} as M }: ObjectDescriptor<D, M> = {
    data : {} as D,
    methods : {} as M
  }
): D & M {
  return Object.assign<D, M>(data, methods)
}

let obj = makeObject({
  data : {
    x : 1,
    y : 2
  },
  methods : {
    moveBy(dx: number, dy: number) {
      this.x++
      this.y++
    }
  }
})
obj.moveBy(5, 5)
```

这个类型是在 TS 源码层面支持的，而不是通过类型变换。


