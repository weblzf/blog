# JavaScript类型：关于类型，有哪些你不知道的细节？

## 类型

1. Undefined
2. Null
3. Boolean
4. String
5. Number
6. Symbol
7. Object

## Undefined、Null

为什么有的编程规范要求用 void 0 代替 undefined？

Undefined 类型表示未定义，它的类型只有一个值，就是 undefined。

任何变量在赋值前是 Undefined 类型、值为 undefined

一般我们可以用全局变量 undefined（就是名为 undefined 的这个变量）来表达这个值，或者 void 运算来把任一一个表达式变成 undefined 值

但是呢，JavaScript 的代码 undefined 是一个变量，而并非是一个关键字，这是 JavaScript 语言公认的设计失误之一，所以，我们为了避免无意中被篡改，我建议使用 void 0 来获取 undefined 值。

```
!function (undefined) {
    undefined = 2
    console.log(undefined); // 2
}()
```

这个设计失误,全局状态下的undefined多数浏览器已经修复

Null 类型也只有一个值，就是 null，它的语义表示空值，与 undefined 不同，null 是 JavaScript 关键字，所以在任何代码中，你都可以放心用 null 关键字来获取 null 值。


## Boolean

Boolean 类型有两个值， true 和 false，它用于表示逻辑意义上的真和假，同样有关键字 true 和 false 来表示两个值。

## String

String 有最大长度是 2^53 - 1，这在一般开发中都是够用的，但是有趣的是，这个所谓最大长度，并不完全是你理解中的字符数。

String 的意义并非“字符串”，而是字符串的 UTF16 编码

我们字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF16 编码。

所以，字符串的最大长度，实际上是受字符串的编码长度影响的。

Note：现行的字符集国际标准，字符是以 Unicode 的方式表示的，每一个 Unicode 的码点表示一个字符，理论上，Unicode 的范围是无限的。UTF 是 Unicode 的编码方式，规定了码点在计算机中的表示方法，常见的有 UTF16 和 UTF8。 Unicode 的码点通常用 U+??? 来表示，其中 ??? 是十六进制的码点值。 0-65536（U+0000 - U+FFFF）的码点被称为基本字符区域（BMP）。

JavaScript 中的字符串是永远无法变更的，一旦字符串构造出来，无法用任何方式改变字符串的内容，所以字符串具有值类型的特征。

JavaScript 字符串把每个 UTF16 单元当作一个字符来处理，所以处理非 BMP（超出 U+0000 - U+FFFF 范围）的字符时，你应该格外小心。

## Number

JavaScript 中的 Number 类型有 18437736874454810627(即 2^64-2^53+3) 个值。

JavaScript 中的 Number 类型基本符合 IEEE 754-2008 规定的双精度浮点数规则

但是 JavaScript 为了表达几个额外的语言场景（比如不让除以 0 出错，而引入了无穷大的概念），规定了几个例外情况：

NaN，占用了 9007199254740990，这原本是符合 IEEE 规则的数字；
Infinity，无穷大；
-Infinity，负无穷大。

另外，值得注意的是，JavaScript 中有 +0 和 -0，在加法类运算中它们没有区别

但是除法的场合则需要特别留意区分，“忘记检测除以 -0，而得到负无穷大”的情况经常会导致错误

而区分 +0 和 -0 的方式，正是检测 1/x 是 Infinity 还是 -Infinity。

根据双精度浮点数的定义，Number 类型中有效的整数范围是 -0x1fffffffffffff 至 0x1fffffffffffff，所以 Number 无法精确表示此范围外的整数。

同样根据浮点数的定义，非整数的 Number 类型无法用 ==（=== 也不行） 来比较，一段著名的代码，这也正是我们第三题的问题，为什么在 JavaScript 中，0.1+0.2 不能 =0.3：

```
console.log( 0.1 + 0.2 == 0.3);
```

这里输出的结果是 false，说明两边不相等的，这是浮点运算的特点，也是很多同学疑惑的来源，浮点数运算的精度问题导致等式左右的结果并不是严格相等，而是相差了个微小的值。

所以实际上，这里错误的不是结论，而是比较的方法，正确的比较方法是使用 JavaScript 提供的最小精度值：

```
console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
```

检查等式左右两边差的绝对值是否小于最小精度，才是正确的比较浮点数的方法。这段代码结果就是 true 了。


## Symbol

Symbol 是 ES6 中引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 Symbol 重塑。

Symbol 可以具有字符串类型的描述，但是即使描述相同，Symbol 也不相等。

```
var mySymbol = Symbol("my symbol");
```

一些标准中提到的 Symbol，可以在全局的 Symbol 函数的属性中找到。

例如，我们可以使用 Symbol.iterator 来自定义 for…of 在对象上的行为：

```
var o = new Object
    o[Symbol.iterator] = function () {
        var v = 0
        return {
            next: function () {
                return {value: v++, done: v > 10}
            }
        }
    };
    for (var v of o) console.log(v); // 0 1 2 3 ... 9
```

代码中我们定义了 iterator 之后，用 for(var v of o) 就可以调用这个函数，然后我们可以根据函数的行为，产生一个 for…of 的行为。

这里我们给对象 o 添加了 Symbol.iterator 属性，并且按照迭代器的要求定义了一个 0 到 10 的迭代器，之后我们就可以在 for of 中愉快地使用这个 o 对象啦。

这些标准中被称为“众所周知”的 Symbol，也构成了语言的一类接口形式。它们允许编写与语言结合更紧密的 API。

## Object

下面我们来看一看，为什么给对象添加的方法能用在基本类型上？

在 JavaScript 中，对象的定义是“属性的集合”。

属性分为数据属性和访问器属性，二者都是 key-value 结构，key 可以是字符串或者 Symbol 类型。

JavaScript 中的几个基本类型，都在对象类型中有一个“亲戚”。它们是：

* Number
* String
* Boolean
* Symbol

3 与 new Number(3) 是完全不同的值，它们一个是 Number 类型， 一个是对象类型。

Number、String 和 Boolean，三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。

Symbol 函数比较特殊，直接用 new 调用它会抛出错误，但它仍然是 Symbol 对象的构造器。

```
cosole.log("abc".charAt(0)); 
```

甚至我们在原型上添加方法，都可以应用于基本类型，比如以下代码，在 Symbol 原型上添加了 hello 方法，在任何 Symbol 类型变量都可以调用。

```
Symbol.prototype.hello = () => console.log("hello");

var a = Symbol("a");
console.log(typeof a); //symbol，a 并非对象
a.hello(); //hello，有效
```

为什么给对象添加的方法能用在基本类型上?

因为: `.`运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。

## 类型转换

这里我们当然也不打算讲解 == 的规则，它属于设计失误，并非语言中有价值的部分，很多实践中推荐禁止使用“ ==”，而要求程序员进行显式地类型转换后，用 === 比较。

较为复杂的部分是 Number 和 String 之间的转换，以及对象跟基本类型之间的转换。

我们分别来看一看这几种转换的规则。

### StringToNumber

字符串到数字的类型转换，存在一个语法结构，类型转换支持十进制、二进制、八进制和十六进制，比如：

* 30
* 0b111
* 0o13
* 0xFF

此外，JavaScript 支持的字符串语法还包括正负号科学计数法，可以使用大写或者小写的 e 来表示：

* 1e3
* -1e-2

注意: parseInt 和 parseFloat 并不使用这个转换，所以支持的语法跟这里不尽相同。

在不传入第二个参数的情况下，parseInt 只支持 16 进制前缀“0x”，而且会忽略非数字字符，也不支持科学计数法。

在一些古老的浏览器环境中，parseInt 还支持 0 开头的数字作为 8 进制前缀，这是很多错误的来源。

所以在任何环境下，都建议传入 parseInt 的第二个参数，而 parseFloat 则直接把原字符串作为十进制来解析，它不会引入任何的其他进制。


### NumberToString

在较小的范围内，数字到字符串的转换是完全符合你直觉的十进制表示。当 Number 绝对值较大或者较小时，字符串表示则是使用科学计数法表示的。这个算法细节繁多，我们从感性的角度认识，它其实就是保证了产生的字符串不会过长。

具体的算法，你可以去参考 JavaScript 的语言标准。由于这个部分内容，我觉得在日常开发中很少用到，所以这里我就不去详细地讲解了。


## 装箱转换

每一种基本类型 Number、String、Boolean、Symbol 在对象中都有对应的类，所谓装箱转换，正是把基本类型转换为对应的对象，它是类型转换中一种相当重要的种类。

全局的 Symbol 函数无法使用 new 来调用，但我们仍可以利用装箱机制来得到一个 Symbol 对象，我们可以利用一个函数的 call 方法来强迫产生装箱。

```
var symbolObject = (function () {
    return this;
}).call(Symbol("a"));
    
console.log(typeof symbolObject); //object 
console.log(symbolObject instanceof Symbol); //true 
console.log(symbolObject.constructor == Symbol); //true
```

我们可以用 console.log 看一下这个东西的 type of，它的值是 object，我们使用 symbolObject instanceof 可以看到，它是 Symbol 这个类的实例，我们找它的 constructor 也是等于 Symbol 的，所以我们无论从哪个角度看，它都是 Symbol 装箱过的对象：


装箱机制会频繁产生临时对象，在一些对性能要求较高的场景下，我们应该尽量避免对基本类型做装箱转换。

每一类装箱对象皆有私有的 Class 属性，这些属性可以用 Object.prototype.toString 获取：

```
var symbolObject = Object((Symbol("a"));

console.log(Object.prototype.toString.call(symbolObject)); //[object Symbol]
```


在 JavaScript 中，没有任何方法可以更改私有的 Class 属性，因此 Object.prototype.toString 是可以准确识别对象对应的基本类型的方法，它比 instanceof 更加准确。

但需要注意的是，call 本身会产生装箱操作，所以需要配合 typeof 来区分基本类型还是对象类型。


## 拆箱转换

在 JavaScript 标准中，规定了 ToPrimitive 函数，它是对象类型到基本类型的转换（即，拆箱转换）。

对象到 String 和 Number 的转换都遵循“先拆箱再转换”的规则。通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或者 Number。

拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。

```
var o = {
    valueOf: () => {
        console.log("valueOf");
        return {}
    }, toString: () => {
        console.log("toString");
        return {}
    }
}
o * 2 // valueOf // toString // TypeError
```

到 String 的拆箱转换会优先调用 toString。我们把刚才的运算从 o*2 换成 o + “”，那么你会看到调用顺序就变了。

```
var o = {
    valueOf: () => {
        console.log("valueOf");
        return {}
    }, toString: () => {
        console.log("toString");
        return {}
    }
}
o + "" // toString // valueOf // TypeError
```


在 ES6 之后，还允许对象通过显式指定 @@toPrimitive Symbol 来覆盖原有的行为。

```
var o = {
    valueOf: () => {
        console.log("valueOf");
        return {}
    }, toString: () => {
        console.log("toString");
        return {}
    }
}
o[Symbol.toPrimitive] = () => {
    console.log("toPrimitive");
    return "hello"
}
console.log(o + "") // toPrimitive // hello
```

## 结语

在本篇文章中，我们介绍了 JavaScript 运行时的类型系统。这里回顾一下今天讲解的知识点。

除了这七种语言类型，还有一些语言的实现者更关心的规范类型。

List 和 Record： 用于描述函数传参过程。
Set：主要用于解释字符集等。
Completion Record：用于描述异常、跳出等语句执行过程。
Reference：用于描述对象属性访问、delete 等。
Property Descriptor：用于描述对象的属性。
Lexical Environment 和 Environment Record：用于描述变量和作用域。
Data Block：用于描述二进制数据。

有一个说法是：程序 = 算法 + 数据结构，运行时类型包含了所有 JavaScript 执行时所需要的数据结构的定义，所以我们要对它格外重视。

事实上，“类型”在 JavaScript 中是一个有争议的概念。一方面，标准中规定了运行时数据类型； 另一方面，JS 语言中提供了 typeof 这样的运算，用来返回操作数的类型，但 typeof 的运算结果，与运行时类型的规定有很多不一致的地方。我们可以看下表来对照一下。


在表格中，多数项是对应的，但是请注意 object——Null 和 function——Object 是特例，我们理解类型的时候需要特别注意这个区别。

从一般语言使用者的角度来看，毫无疑问，我们应该按照 typeof 的结果去理解语言的类型系统。但 JS 之父本人也在多个场合表示过，typeof 的设计是有缺陷的，只是现在已经错过了修正它的时机。

运行时类型:
![运行时类型](./img/types.png)

