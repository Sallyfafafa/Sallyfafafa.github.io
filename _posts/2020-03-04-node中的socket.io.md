---
layout: post
#标题配置
title:  node中的socket.io
#时间配置
date:   2020-03-04 14:16:00 +0800
#大类配置
categories: Node
#小类配置
tag: Node中socket.io
---

特性
========
传输
-----
socket数据的传递是基于传输的，并非全部依靠于websocket。所以socket.io可以在绝大部分浏览器和设备运行，譬如ie6到IOS。
Polling（轮询）：是指不管服务端数据有无更新，客户端每隔定长时间请求拉取一次数据，可能有更新数据返回，也可能什么都没有。
long polling（长轮询）技术原理：客户端发起，此时如果服务端没有相关数据，会hold住请求，直到服务端有相关数据，或者等待一定时间超时才会返回。返回后，客户端又会立即再次发起下一次Long Polling。

而socket.io会自动使用像long polling的拘束，但是他的API又与websocket一样保持整洁。

断开与关闭
-----
socket.io有对超时的支持。

像在TCP和websocket中遗留的问题，close可能会因为外接因素影响然后非正常的单方断连接。

在socket内我们监听的是connect以及disconnect事件。（socket提供了可靠的机制，当客户端停止传输数据，并且在一定时间内没有正常关闭连接，socket就会认为它断开连接了）

事件
-----
支持分发（emit）和监听（on）事件对json数据收发。

```js
socket.emit('hello', 'world');
socket.emit('with-binary', 1, '2', { 3: '4', 5: new Buffer(6) });

socket.on('news', (data) => {
  console.log(data);
});
// with multiple arguments
socket.on('news', (arg1, arg2, arg3, arg4) => {
  // ...
});
// with callback
socket.on('news', (cb) => {
  cb(0);
});
```

命名空间(多路传输)
-------
利用命名空间将消息彼此区分开。
针对同样的资源（为用户选择的传输通道）进行频道切分，并将数据传输给对应的频道。

服务端API
------
有和没有new
```js
const io = require('socket.io')();
// 有new
const server = require('socket.io');
const io = new server();
```

新服务器 (httpServer[, options]):
```js
const server = require('http').createServer(); 

const io = require('socket.io')(server, { // server 是（http.Server）要绑定的服务器。
  path: '/test', // 捕获路径的名称（/test ）
  serveClient: false, // 是否提供客户端文件
  pingInterval: 10000, //  循环时间
  pingTimeout: 5000, // 超时ms没有连接，则考虑close
  cookie: false // 
});

server.listen(3000);
```

新服务器server（port [，options]）

```js
const server = require('http').createServer();

const io = require('socket.io')(3000, { // port （数字）一个要听的端口（一个新的http.Server将被创建）
  path: '/test',
});
```

新服务器 server (options)
```js
const io = require('socket.io')({
  path: '/src',
  serveClient: false,
});

// either
const server = require('http').createServer();

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3000);

// or
io.attach(3000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```
客户端API
------
引入io库：
```js
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io('http://localhost');
</script>
```
使用io：`io(url[, options])`
url （字符串）默认的指向widnow.location
option （Object）forceNew （布尔型）是否重用当前已存在的链接。

初始化实例，也可以实现多路复用：

这里需注意，如果是两个不同的命名空间，会默认取后一个作为单一连接。而命名空间相同，才会创建两个连接。
```js
const socket = io();
const adminSocket = io('/admin');
// a single connection will be established
const socket = io();
const socket2 = io();
// will also create two distinct connections
const socket = io('http://localhost', {
  path: '/myownpath'
}); // 自定义path
const socket = io('http://localhost?token=abc'); // 命名空间携带参数
```


构建一个聊天程序
=====

服务器端
------
首先要新建一个服务器。

```js
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/src/index.html');
})

io.on('connection', function(socket){
    console.log('get a connection');
    socket.broadcast.emit('hi');
    socket.on('disconnect', function(){ // 关闭连接触发
        console.log('end a connection');
    });
    socket.on('chat message', function(msg){ // 收到客户端的消息
        console.log('get massage:', msg);
    });
    socket.on('chat another', function(msg){ // 收到客户端的消息
        io.emit('chat another', 'this is a message to everybody'); // 在发给客户端
    });
})

http.listen(3000, function(){ // 监听端口
    console.log('listen on : 3000');
})

```

客户端
------
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./socket.io/socket.io.js"></script>

    <script>
        var io = io();
        io.on('chat another', function(msg){ // 收到服务端的消息
            console.log('another msg:', msg);
        })
        function submitMes(){  // 事件触发函数
            console.log('submit message');
            io.emit('chat message', 'this is a message');
            return;
        }
        function submitElse(){  // 事件触发函数
            console.log('submit message to another');
            io.emit('chat another', 'this is a message to everybody'); //传给服务端
            return;
        }
    </script>
</head>
<body>
    <button onclick="submitMes()">发给服务器</button>
    <button onclick="submitElse()">发给带自己还有其他人</button>
</body>
</html>

```
优化
=======
当用户连接和断开连接时广播消息
----
服务端增加：
```js
console.log('get a connection');
io.emit('hasConnect', '有人连接进来了');
socket.on('disconnect', function(){ // 关闭连接触发
    io.emit('broadcast', '有人关闭连接');
});
```
客户端增加：
```js
io.on('broadcast', function(msg){
    console.log('广播消息：', msg);
});
io.on('hasConnect', function(msg){
    console.log('广播消息：', msg);
})
```

更多api详见：https://www.w3cschool.cn/socket/socket-odxe2egl.html

添加昵称 1
不要将消息发送给服务器后再返回给发送者，应该在用户按下回车后立即将消息显示到消息列表。 1
添加 “{用户} 正在输入” 功能。
显示在线用户
添加私密消息
分享你的改进！

