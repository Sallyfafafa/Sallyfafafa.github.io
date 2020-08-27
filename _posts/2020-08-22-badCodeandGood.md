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

ES2015/ES6 类优先与 ES5 纯函数

很难为经典的 ES5 类创建可读的的继承、 构造和方法定义。 如果你需要继承（并且感到奇怪为啥你不需 要）， 则优先用 ES2015/ES6的类。 不过， 短小的函数优先于类， 直到你发现你需要更大并且更复杂的 对象。



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
使用方法链

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

Prefer composition over inheritance
----------
组合优先于继承

正如设计模式四人帮所述， 如果可能， 你应该优先使用组合而不是继承。 有许多好的理由去使用继承， 也有许多好的理由去使用组合。这个格言的重点是， 如果你本能的观点是继承， 那么请想一下组合能否更好的为你的问题建模。 很多情况下它真的 可以。

那么你也许会这样想， “我什么时候改使用继承？” 这取决于你手上的问题， 不过这儿有一个像样的列表说明什么时候继承比组合更好用：

你的继承表示"是一个"的关系而不是"有一个"的关系（人类->动物 vs 用户->用户详情）【人类是动物 vs 用户有用户详情】；
你可以重用来自基类的代码（人可以像所有动物一样行动）；
你想通过基类对子类进行全局的修改（改变所有动物行动时的热量消耗）；

```js
Bad:

class Employee {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // ...
}

// Bad because Employees "have" tax data. EmployeeTaxData is not a type of Employee
class EmployeeTaxData extends Employee {
  constructor(ssn, salary) {
    super();
    this.ssn = ssn;
    this.salary = salary;
  }

  // ...
}
Good:

class EmployeeTaxData {
  constructor(ssn, salary) {
    this.ssn = ssn;
    this.salary = salary;
  }

  // ...
}

class Employee {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  setTaxData(ssn, salary) {
    this.taxData = new EmployeeTaxData(ssn, salary);
  }
  // ...
}

```

SOLID
========
五大原则

Single Responsibility Principle (SRP)
-------
单一责任原则

正如代码整洁之道所述， “永远不要有超过一个理由来修改一个类”。 给一个类塞满许多功能， 就像你在航 班上只能带一个行李箱一样， 这样做的问题你的类不会有理想的内聚性， 将会有太多的理由来对它进行修改。 最小化需要修改一个类的次数时很重要的， 因为如果一个类拥有太多的功能， 一旦你修改它的一小部分， 将会很难弄清楚会对代码库中的其它模块造成什么影响。

```js
Bad:

class UserSettings {
  constructor(user) {
    this.user = user;
  }

  changeSettings(settings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}
Good:

class UserAuth {
  constructor(user) {
    this.user = user;
  }

  verifyCredentials() {
    // ...
  }
}

class UserSettings {
  constructor(user) {
    this.user = user;
    this.auth = new UserAuth(user);
  }

  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

Open/Closed Principle (OCP)
-----
开放关闭原则 (OCP)

Bertrand Meyer 说过， “软件实体 (类， 模块， 函数等) 应该为扩展开放， 但是为修改关闭。” 这是什么意思呢？ 这个原则基本上说明了你应该允许用户添加功能而不必修改现有的代码。

```js

Bad:

class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = "ajaxAdapter";
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = "nodeAdapter";
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    if (this.adapter.name === "ajaxAdapter") {
      return makeAjaxCall(url).then(response => {
        // transform response and return
      });
    } else if (this.adapter.name === "nodeAdapter") {
      return makeHttpCall(url).then(response => {
        // transform response and return
      });
    }
  }
}

function makeAjaxCall(url) {
  // request and return promise
}

function makeHttpCall(url) {
  // request and return promise
}
Good:

class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = "ajaxAdapter";
  }

  request(url) {
    // request and return promise
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = "nodeAdapter";
  }

  request(url) {
    // request and return promise
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    return this.adapter.request(url).then(response => {
      // transform response and return
    });
  }
}
```

Liskov Substitution Principle (LSP)
------
里氏代换原则 (LSP)
这是针对一个非常简单的里面的一个恐怖意图， 它的正式定义是： “如果 S 是 T 的一个子类型， 那么类 型为 T 的对象可以被类型为 S 的对象替换（例如， 类型为 S 的对象可作为类型为 T 的替代品）儿不需 要修改目标程序的期望性质 （正确性、 任务执行性等）。” 这甚至是个恐怖的定义。

最好的解释是， 如果你有一个基类和一个子类， 那个基类和字类可以互换而不会产生不正确的结果。 这可能还有一些疑惑， 让我们来看一下这个经典的正方形与矩形的例子。 从数学上说， 一个正方形是一个矩形， 但是你用 "is-a" 的关系用继承来实现， 你将很快遇到麻烦。

```js

Bad:

class Rectangle {
  constructor() {
    this.width = 0;
    this.height = 0;
  }

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width;
  }

  setHeight(height) {
    this.width = height;
    this.height = height;
  }
}

function renderLargeRectangles(rectangles) {
  rectangles.forEach(rectangle => {
    rectangle.setWidth(4);
    rectangle.setHeight(5);
    const area = rectangle.getArea(); // BAD: Returns 25 for Square. Should be 20.
    rectangle.render(area);
  });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
Good:

class Shape {
  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(length) {
    super();
    this.length = length;
  }

  getArea() {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes) {
  shapes.forEach(shape => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

Interface Segregation Principle (ISP)
----------
接口隔离原则

JavaScript 没有接口， 所以这个原则不想其它语言那么严格。 不过， 对于 JavaScript 这种缺少类型的语言来说， 它依然是重要并且有意义的。

接口隔离原则说的是 “客户端不应该强制依赖他们不需要的接口。” 在 JavaScript 这种弱类型语言中， 接口是隐式的契约。

在 JavaScript 中能比较好的说明这个原则的是一个类需要一个巨大的配置对象。 不需要客户端去设置大 量的选项是有益的， 因为多数情况下他们不需要全部的设置。 让它们变成可选的有助于防止出现一个 “胖接口”。

```js
Bad:

class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.settings.animationModule.setup();
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName("body"),
  animationModule() {} // Most of the time, we won't need to animate when traversing.
  // ...
});
Good:

class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.options = settings.options;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.setupOptions();
  }

  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName("body"),
  options: {
    animationModule() {}
  }
});
```

Dependency Inversion Principle (DIP)
-----
依赖反转原则 (DIP)

这个原则阐述了两个重要的事情：

1、 高级模块不应该依赖于低级模块， 两者都应该依赖与抽象；
2、抽象不应当依赖于具体实现， 具体实现应当依赖于抽象。

这个一开始会很难理解， 但是如果你使用过 Angular.js ， 你应该已经看到过通过依赖注入来实现的这 个原则， 虽然他们不是相同的概念， 依赖反转原则让高级模块远离低级模块的细节和创建， 可以通过 DI 来实现。 这样做的巨大益处是降低模块间的耦合。 耦合是一个非常糟糕的开发模式， 因为会导致代码难于 重构。

如上所述， JavaScript 没有接口， 所以被依赖的抽象是隐式契约。 也就是说， 一个对象/类的方法和 属性直接暴露给另外一个对象/类。 在下面的例子中， 任何一个 Request 模块的隐式契约 InventoryTracker 将有一个 requestItems 方法。

```js
bad:

class InventoryRequester {
  constructor() {
    this.REQ_METHODS = ['HTTP'];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryTracker {
  constructor(items) {
    this.items = items;

    // 不好的： 我们已经创建了一个对请求的具体实现的依赖， 我们只有一个 requestItems 方法依
    // 赖一个请求方法 'request'
    this.requester = new InventoryRequester();
  }

  requestItems() {
    this.items.forEach((item) => {
      this.requester.requestItem(item);
    });
  }
}

const inventoryTracker = new InventoryTracker(['apples', 'bananas']);
inventoryTracker.requestItems();

good:

class InventoryTracker {
  constructor(items, requester) {
    this.items = items;
    this.requester = requester;
  }

  requestItems() {
    this.items.forEach((item) => {
      this.requester.requestItem(item);
    });
  }
}

class InventoryRequesterV1 {
  constructor() {
    this.REQ_METHODS = ['HTTP'];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryRequesterV2 {
  constructor() {
    this.REQ_METHODS = ['WS'];
  }

  requestItem(item) {
    // ...
  }
}

// 通过外部创建依赖项并将它们注入， 我们可以轻松的用一个崭新的使用 WebSockets 的请求模块进行
// 替换。
const inventoryTracker = new InventoryTracker(['apples', 'bananas'], new InventoryRequesterV2());
inventoryTracker.requestItems();

```

Concurrency
========
并发

Use Promises, not callbacks
-------
使用 Promises, 不要使用回调。

回调不够简洁， 因为他们会产生过多的嵌套。 在 ES2015/ES6 中， Promises 已经是内置的全局类型 了，使用它们吧！

```js
Bad:

import { get } from "request";
import { writeFile } from "fs";

get(
  "https://en.wikipedia.org/wiki/Robert_Cecil_Martin",
  (requestErr, response, body) => {
    if (requestErr) {
      console.error(requestErr);
    } else {
      writeFile("article.html", body, writeErr => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          console.log("File written");
        }
      });
    }
  }
);
Good:

import { get } from "request-promise";
import { writeFile } from "fs-extra";

get("https://en.wikipedia.org/wiki/Robert_Cecil_Martin")
  .then(body => {
    return writeFile("article.html", body);
  })
  .then(() => {
    console.log("File written");
  })
  .catch(err => {
    console.error(err);
  });
```

Async/Await are even cleaner than Promises
-------
Async/Await 比 Promises 更加简洁.

Promises 是回调的一个非常简洁的替代品， 但是 ES2017/ES8 带来的 async 和 await 提供了一个 更加简洁的解决方案。 你需要的只是一个前缀为 async 关键字的函数， 接下来就可以不需要 then 函数链来编写逻辑了。 如果你能使用 ES2017/ES8 的高级功能的话， 今天就使用它吧！

```js
Bad:

import { get } from "request-promise";
import { writeFile } from "fs-extra";

get("https://en.wikipedia.org/wiki/Robert_Cecil_Martin")
  .then(body => {
    return writeFile("article.html", body);
  })
  .then(() => {
    console.log("File written");
  })
  .catch(err => {
    console.error(err);
  });
Good:

import { get } from "request-promise";
import { writeFile } from "fs-extra";

async function getCleanCodeArticle() {
  try {
    const body = await get(
      "https://en.wikipedia.org/wiki/Robert_Cecil_Martin"
    );
    await writeFile("article.html", body);
    console.log("File written");
  } catch (err) {
    console.error(err);
  }
}

getCleanCodeArticle();
```

Error Handling
=====
错误处理

Don't ignore caught errors
------
不要忽略捕捉到的错误

对捕捉到的错误不做任何处理不能给你修复错误或者响应错误的能力。 向控制台记录错误 (console.log) 也不怎么好， 因为往往会丢失在海量的控制台输出中。 如果你把任意一段代码用 try/catch 包装那就 意味着你想到这里可能会错， 因此你应该有个修复计划， 或者当错误发生时有一个代码路径。

```js
Bad:

try {
  functionThatMightThrow();
} catch (error) {
  console.log(error);
}
Good:

try {
  functionThatMightThrow();
} catch (error) {
  // One option (more noisy than console.log):
  console.error(error);
  // Another option:
  notifyUserOfError(error);
  // Another option:
  reportErrorToService(error);
  // OR do all three!
}
```

