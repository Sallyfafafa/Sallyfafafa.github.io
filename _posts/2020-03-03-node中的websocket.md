---
layout: post
#标题配置
title:  node中的webSocket
#时间配置
date:   2020-03-03 14:14:00 +0800
#大类配置
categories: Node
#小类配置
tag: Node中webSocket
---

Ajax
-------
web2.0标志着web应用的崛起，Ajax提升了用户体验。用户再也不用非得交互操作才能获取服务器端新的HTML文档了。有了ajax，用户不用每次提交都刷新整个页面，可以进行局部更新了。

但是如果使用类似于mousemove这类事件，频发触发并发送请求给服务器的话，服务器端没法确认哪个请求先到，哪个后来。

发送请求时，浏览器会选择可用的socket进行数据发送，为了提高性能，浏览器会自动建立多个socket通道。
举个例子：当我们正在下载图片时，同时我们还可以进行数据的发送。

而有的时候，我们发送的东西其实很小，小到还没有响应回的报文数据多，这时我们就要考虑减轻http请求内容。而理想的解决方案，就是从tcp来入手。

h5的解决方案，就是websocket。

h5 websocket
-----

浏览器实现的websocket API、服务器端实现的websocket协议

api编写：
```js
var wx = new WebSocket('ws://host/path');
wx.onopen = function(){
    wx.send('data'); // 发送data
}
wx.clone = function(){
    wx.ondata = function(ev) { // 接收data
        alert(ev.data); 
    }
}
```

写个小实例
=====



