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

？：可选变量声明
------

```js
// 函数默认值
// 默认值可以让你在属性为 undefined 时使用缺省值：

function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}

// 如果还没传b的话，现在，即使 b 为 undefined ， keepWholeObject 函数的变量 wholeObject 的属性 a 和 b 都会有值
```