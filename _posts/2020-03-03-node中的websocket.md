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

websocket概念
-----
特点： 1、全双工 2、位于应用层 3、基于tcp传输协议 4、复用了http的握手通道


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
var ws = new WebSocket('ws://host/path');
ws.onopen = function(){
    ws.send('data'); // 发送data
}
ws.clone = function(){
    ws.ondata = function(ev) { // 接收data
        alert(ev.data); 
    }
}
```

实例
=====

小例子
-----
监听8080端口。当有新的连接请求到达时，打印日志，同时向客户端发送消息。当收到到来自客户端的消息时，同样打印日志
```js
index.js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>websocket test</title>
    <script>
        var ws = new WebSocket('ws://localhost:8080');
        ws.onopen = function () {
            console.log('ws onopen');
            ws.send('from client: hello');
        };
        ws.onmessage = function (e) {
            console.log('ws onmessage');
            console.log('from server: ' + e.data);
        };
    </script>
</head>
<body>
</body>
</html>
```

```js
server,js
const express  = require("express");
const ws  = require("ws");

var app = express();
app.use(express.static('src'));
var wss = new ws.Server({port: 8080});

wss.on('connection', function connection(ws){
    console.log('server: receive connection.');
    
    ws.on('message', function incoming(message) {
        console.log('server: received: %s', message);
    });
})

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/src/index.html');
});
  
app.listen(3000);

```

F12可以看出一些不一样。
普通的http请求就是：headers，preview，response，Timing。
而我们这个websocket省略了：preview，response，用Messages来代替。

![](https://cdn.weipaitang.com/static/20200304be324403-eacd-4403eacd-d869-4451cdbb0c8a-W1500H988)

![](https://cdn.weipaitang.com/static/202003048729e8d0-1f9c-e8d01f9c-62f1-171c1af9d870-W1486H1148)
状态代码：101表示协议切换

重点请求首部的意义：
Connection: Upgrade：
要升级协议

Upgrade: websocket：
要升级到websocket协议。

Sec-WebSocket-Version: 13：
表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader：
里面包含服务端支持的版本号。

Sec-WebSocket-Key：
与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

连接保持+心跳
------
发送方 -> 接收方：ping
接收方 -> 发送方：pong

WebSocket服务端向客户端发送ping，只需要如下代码（采用ws模块）

`ws.ping('', false, true);`

当服务端和客户端触发close时，tcp可能已经关闭了。而在实际情况，客户端的close不一定会被触发，所以要合理的利用超时和心跳检查。
```js
ws.on('close', function(){
})
```
隔几秒就请求一次，判断当前客户端还活着。如果发送失败，则意味着已经强制关闭连接。

