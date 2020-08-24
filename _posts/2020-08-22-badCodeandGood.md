---
layout: post
#标题配置
title:  clean-code-javascript
#时间配置
date:   2020-08-22 14:41:00 +0800
#大类配置
categories: goodCode
#小类配置
tag:  书写代码风格
---

* content
{:toc}

对象和数据结构
=======


Use getters and setters
------

使用getter和setter访问对象上的数据可能比仅在对象上查找属性要好。 

“为什么？” 你可能会问。 好吧，以下是一些原因：

· 除了获得对象属性以外，您还想做更多事情时，不必查找和更改代码库中的每个访问器。

· 进行set时，使添加验证变得简单。

· 封装内部表示。

· 获取和设置时易于添加日志记录和错误处理。

· 您可以延迟加载对象的属性，比方说从服务器获取它。

```js
Bad:

function makeBankAccount() {
  // ...

  return {
    balance: 0
    // ...
  };
}

const account = makeBankAccount();
account.balance = 100;

Good:

function makeBankAccount() {
  // 这是一个私有变量
  let balance = 0;

  // getter，开放使用
  function getBalance() {
    return balance;
  }

  // setter，开发使用
  function setBalance(amount) {
    // 在更新属性验证验证
    balance = amount;
  }

  return {
    // ...
    getBalance,
    setBalance
  };
}

const account = makeBankAccount();
account.setBalance(100);

```


Make objects have private members
-----

使对象具有私人属性
这可以通过关闭（对于ES5及以下版本）来完成。

```js
Bad:

const Employee = function(name) {
  this.name = name;
};

Employee.prototype.getName = function getName() {
  return this.name;
};

const employee = new Employee("John Doe");
console.log(`Employee name: ${employee.getName()}`); // Employee name: John Doe
delete employee.name;
console.log(`Employee name: ${employee.getName()}`); // Employee name: undefined
Good:

function makeEmployee(name) {
  return {
    getName() {
      return name;
    }
  };
}

const employee = makeEmployee("John Doe");
console.log(`Employee name: ${employee.getName()}`); // Employee name: John Doe
delete employee.name;
console.log(`Employee name: ${employee.getName()}`); // Employee name: John Doe

````

classes
=======

Prefer ES2015/ES6 classes over ES5 plain functions
------

比ES5普通函数更喜欢ES2015 / ES6类

要获得经典ES5类的可读类继承，构造和方法定义，是非常困难的。 如果需要继承（请注意可能不需要继承），请选择ES2015 / ES6类。 但是，在发现自己需要更大，更复杂的对象之前，请优先选择小型函数而不是类。

```js
Bad:

const Animal = function(age) {
  if (!(this instanceof Animal)) {
    throw new Error("Instantiate Animal with `new`");
  }

  this.age = age;
};

Animal.prototype.move = function move() {};

const Mammal = function(age, furColor) {
  if (!(this instanceof Mammal)) {
    throw new Error("Instantiate Mammal with `new`");
  }

  Animal.call(this, age);
  this.furColor = furColor;
};

Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.constructor = Mammal;
Mammal.prototype.liveBirth = function liveBirth() {};

const Human = function(age, furColor, languageSpoken) {
  if (!(this instanceof Human)) {
    throw new Error("Instantiate Human with `new`");
  }

  Mammal.call(this, age, furColor);
  this.languageSpoken = languageSpoken;
};

Human.prototype = Object.create(Mammal.prototype);
Human.prototype.constructor = Human;
Human.prototype.speak = function speak() {};
Good:

class Animal {
  constructor(age) {
    this.age = age;
  }

  move() {
    /* ... */
  }
}

class Mammal extends Animal {
  constructor(age, furColor) {
    super(age);
    this.furColor = furColor;
  }

  liveBirth() {
    /* ... */
  }
}

class Human extends Mammal {
  constructor(age, furColor, languageSpoken) {
    super(age, furColor);
    this.languageSpoken = languageSpoken;
  }

  speak() {
    /* ... */
  }
}
```

Use method chaining
------
使用方法连接

这种代码方式，像是写jq一样的链式调用。

```js
Bad:

class Car {
  constructor(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
  }

  setMake(make) {
    this.make = make;
  }

  setModel(model) {
    this.model = model;
  }

  setColor(color) {
    this.color = color;
  }

  save() {
    console.log(this.make, this.model, this.color);
  }
}

const car = new Car("Ford", "F-150", "red");
car.setColor("pink");
car.save();
Good:

class Car {
  constructor(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
  }

  setMake(make) {
    this.make = make;
    // NOTE: Returning this for chaining
    return this;
  }

  setModel(model) {
    this.model = model;
    // NOTE: Returning this for chaining
    return this;
  }

  setColor(color) {
    this.color = color;
    // NOTE: Returning this for chaining
    return this;
  }

  save() {
    console.log(this.make, this.model, this.color);
    // NOTE: Returning this for chaining
    return this;
  }
}

const car = new Car("Ford", "F-150", "red").setColor("pink").save();
```



