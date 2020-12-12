---
layout: post
#标题配置
title:  微信小程序中的behavior
#时间配置
date:   2020-11-20 17:53:00 +0800
#大类配置
categories: 微信小程序
#小类配置
tag: behavior
---

* content
{:toc}

为什么要用 behaviors ？
=====

在开发中，有两个非常相似的组件，它们的功能极其相似，但它们局部稍有不同。

我们应该如何更好抹平差异
-----

1 分成两个不同的组件？

（当功能发生变化，那么必须在两个地方修改它们，违背了DRY原则：Don’t Repeat Yourself。）

2 保留一个组件，props控制差异？

（采用过多的props控制组件的差异，这种维护起来将会很复杂，可能减慢开发速度。）


什么是 behaviors ？
======

[官方介绍](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)


VUE-mixins介绍
-----

概念：混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

Vue中的Mixins基本上是一块定义的逻辑，由Vue以特定的规定方式存储，可以反复使用，为Vue实例和组件添加功能。因此，Vue mixins可以在多个Vue组件之间共享，而无需重复代码块。

```js
//toggle.js
export const toggle = {
  data() {
    return {
      "show": false
    }
  },
  methods: {
    changeState() {
      this.show = !this.show;
    }
  }
};
```

```html
<template>
  <div>
    <div v-show="show">
      <p>提示框</p>
    </div>
    <button @click="changeState">click</button>
  </div>
</template>

<script>
import {toggle} from './mixins/toggle'

export default {
  mixins: [toggle]
}
</script>
```


traits介绍
-----

提取不同类的共性，统一处理。 *

依靠显示模板特殊化，把代码中因不同类型发生变化的片段提取出，用统一的接口来包装。

接口可以为c++类所能包含的任何东西。

客户通过traits模板类公开的接口来间接访问。

behaviors的同名字段的覆盖和组合规则
======



如果有同名的属性 (properties) 或方法 (methods)
-------
案例

[代码片段](https://developers.weixin.qq.com/s/Gaj0R3m27Mms)

如果有同名的数据字段 (data)
----
案例


生命周期执行顺序
-----
1 [behavior] created

2 [component] created

3 [behavior] attached

4 [component] attached

5 [behavior] ready

6 [component] ready

拓展应用
======
[小程序的 MobX](
https://developers.weixin.qq.com/miniprogram/dev/extended/utils/mobx.html)

总结 
===

我们在以上提到的所有内容构建可能会增加复杂性的应用程序时都会派上用场。

希望定义许多可重用的函数，或者以跨组件重用的方式对它们进行格式化，因此不必一遍又一遍地定义相同的内容。


