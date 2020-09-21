---
layout: post
#标题配置
title:  ts学习
#时间配置
date:   2019-12-10 10:33:00 +0800
#大类配置
categories: TypeScript
#小类配置
tag: requestAnimation
---

* content
{:toc}

一下笔记内容  全部摘抄至[TypeScript](https://www.tslang.cn/docs/handbook/basic-types.html)

声明类型
=======

基本类型
-----

基本类型一般用小写：
```js
let decLiteral: number = 6;
let isDone: boolean = false;
let name: string = "bob"; // 单引号或者双引号都行
let sentence: string = `Hello, my name is ${ name }. `// 模板字符串同样适用

// 数组两种声明方式
let list: number[] = [1, 2, 3]; // 声明一个全是数字类型的数组。
let list: Array<number> = [1, 2, 3]; // 建议就以上面那种方式声明数组。
let ro: ReadonlyArray<number> = [1, 2, 3, 4]; // ro里面数组值不可变

let list: any[] = [1, '', true]; // 声明一个不确定内容类型的数组。


```

特殊类型
------
```ts
// 元祖类型
let x: [string, number] = ['abc', 1]; //指定数组相应位置类型
x = [10, 'hello']; // Error Initialize it incorrectly


// 枚举类型 
// 可以通过值找到对应的编号，也可以通过一个编号，找到对应值
enum Color {Red, Green, Blue} // 编号默认从0开始
let c: Color = Color.Green; // 1

enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2]; // 'Green'

// 任意类型
let notSure: any = 4;

// void 
// 与any相反的类型，viod的函数没有返回值，变量只能复制undefined和null。

function warnUser(): void { // 一个没有返回值的函数
    console.log("This is my warning message");
}

let unusable: void = undefined; // 变量赋值undefined

string | null | undefined; // 在某处你想传入一个 string或null或undefined

// never
// never类型表示的是那些永不存在的值的类型。
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// object
// object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。

// 类型断言

let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;

let someValue1: any = 'this is a string';

let strLength1: number = (someValue1 as string).length; // tsx只支持这种写法

```

接口
=====

可选属性
------

```js
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});
```

```js
// 函数默认值
// 默认值可以让你在属性为 undefined 时使用缺省值：

function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}

// 如果还没传b的话，现在，即使 b 为 undefined ， keepWholeObject 函数的变量 wholeObject 的属性 a 和 b 都会有值
```

只读属性
------

```js
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error! 修改实例中的只读属性会报错

// ReadonlyArray
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

readonly vs const：

最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用readonly。

额外属性检查
-----
```js
// 表示的是SquareConfig可以有任意数量的属性，并且只要它们不是color和width，那么就无所谓它们的类型是什么
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

函数类型
----

```js
interface SearchFunc {
  (source: string, subString: string): boolean; // (参数类型) : 返回值类型
}

// 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```

可索引类型
-----
可以通过索引值得到的类型。
```js
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

// 可以使用obj.property和obj["property"]
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

继承接口
------

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```js
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

混合类型
-----

一个对象可以同时做为函数和对象使用，并带有额外的属性。
```js
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

函数
======

```js
// 带类型的函数
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };

// 完整的函数声明

let IdGenerator: (chars: string, nums: number) => string;

function createUserId(name: string, id: number): string {
  return name + id;
}
IdGenerator = createUserId;

// 完整的函数声明
let myAdd: (baseValue: number, increment: number) => number =
    function(x: number, y: number): number { return x + y; };

// => 如果要返回一个空函数，不能什么都不写，必须写一个void。

// 可选参数必须放在必填参数后边。
function buildName(firstName: string, lastName?: string) {
    // ...
}
// 默认参数，不规定必须在必传参数后。
// 注意， 如果带默认值的参数出现在必须参数前面，用户必须明确的传入 undefined值来获得默认值。
function buildName(firstName: string, lastName = "Smith") {
    // ...
}

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

泛型
=====
T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。
```js
// 定义
function identity<T>(arg: T): T {
    return arg;
}
// 使用
let output = identity<string>("myString");  // type of output will be 'string'
// 类型推论
let output = identity("myString");  // type of output will be 'string'

// 部分使用泛型
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}

// 泛型类型 使用可以换参数名
function identity<T>(arg: T): T {
    return arg;
}
// 只要在数量上和使用方式上能对应上就可以
let myIdentity: <U>(arg: U) => U = identity;
```

泛型接口
-----
 当我们使用 GenericIdentityFn的时候，还得传入一个类型参数来指定泛型类型（这里是：number），锁定了之后代码里使用的类型。 对于描述哪部分类型属于泛型部分来说，理解何时把参数放在调用签名里和何时放在接口上是很有帮助的。
```js
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

枚举
=======

数字枚举
-----
比较常见的都是默认从0开始枚举，或者定义一个开始枚举的值，依次递增。
```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```
字符串枚举
-----
字符串枚举强制每个成员必须用字符串字面量。
```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
// 要注意的是 不会为字符串枚举成员生成反向映射。
```
异构枚举
-----
虽然可以用，但是不推荐用。

```js
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

