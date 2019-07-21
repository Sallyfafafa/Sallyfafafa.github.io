---
layout: post
#标题配置
title:  vue-router
#时间配置
date:   2019-06-14 14:08:00 +0800
#大类配置
categories: JS
#小类配置
tag: vue
---

* content
{:toc}

这篇简单讲一下router的配置。

首先在 src 下新建文件夹 pages ，在 pages 文件夹下新建文件夹 demo1，在 demo1 文件夹下新建一个 demo1.vue 文件。
然后demo1.vue文件内写：

```html
<template>
	<div>hello 123456</div>
</template>
```
然后去 src下边的router文件下边的index.js
插入一个：

```js
import demo1 from '@/pages/demo1/demo1'
```
这里的‘@’代表着src的意思。

在Router里面插入一句：
```js
    {
    	path:'/demo1',
    	name:'demo1',
    	component:demo1
    }
```

最后打开本地的[http://localhost:8080/#/demo1](http://localhost:8080/#/demo1)

就能看到页面上有一句话：hello 123456

router link
-----------------

首先确保项目已经安装引入过vue-router包

用法1：

< router-link to="/demo1">demo1< /router-link>

用法2：

< router-link to="{ name: 'demo9', params: { userId: 123 }}">跳转</ router-link>

（可以传一些参数），这里的name是在路由对应的name。这时候的路由就会变成/demo1/:userId,这里的：是通配符，表示后边的userId是不确定的。

用法3：

this.$router.push({ path: '/demo1})

用法4：

this.$router.push({ name: 'demo1', params: { userId: 123 }})


vuex
-----------------------

状态管理，这是一个可以存放全局变量的数据池。

若每次跳转网页都要穿某个值，那么就可以先把那个值写在vuex池中。

用法：

第一步：

先在项目下打开git bush here ，输入 cnpm install vuex --save

第二步：

在src里的main.js下 插入一句 import store from './store/'，在src下建立文件夹store，在文件夹store下建一个index.js

第三步：

action里面是调用mutation的方法，调用好了之后修改状态。


设置数据：this.$store.dispatch('increment', 100000);•获取数据：this.$store.state.num;




vue-resource
-------------
npm install引入vue-resource包

首先要在main.js中引入import VueResource from 'vue-resource'

Vue.use(VueResource)全局引用

this.$http.get('/someUrl')

this.$http.post('/someUrl', {foo: 'bar'})


