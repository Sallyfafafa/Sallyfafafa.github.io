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