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

构建一个聊天程序
=====





