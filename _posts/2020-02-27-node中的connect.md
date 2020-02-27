---
layout: post
#标题配置
title:  node中的connect
#时间配置
date:   2020-02-27 16:28:00 +0800
#大类配置
categories: Node
#小类配置
tag: Node中connect
---


connect
=========
connect是一个基于http服务器的工具集，它提供了一种新的组织代码的方式来与请求，响应对象进行交互，这里称为中间件。

先用http实现一个静态网页的显示
------
```js
var http = require('http');
var fs = require('fs');

// 创建服务器
var server = http.createServer(function(req, res) {
    // 检查服务器目录是否与文件夹下目录匹配
    if('GET' == req.method && '/images' == req.url.substr(0,7)) {
        fs.stat(__dirname + req.url, function (err, stat) {
            console.log('err:',err);
            if (err || !stat.isFile()) {
                //请求错误时的Status Code
              res.writeHead(404);
              res.end('Not Found');
              return;
            }
            // jpg类型的图片
            serve(__dirname + req.url, 'application/jpg');
        });
    } else if ('GET' == req.method && '/' == req.url) {
        // 入口配置
        serve(__dirname+'/index.html', 'text/html');
    } else {
        res.writeHead(404);
        res.end('Not Found!!~')
    }
    // 请求服务函数,告诉浏览器发送的资源类型
    function serve (path, type) {
        res.writeHead(200, { 'Content-Type': type });
        fs.createReadStream(path).pipe(res);
        // 这里的 createReadStream 会有另一种写法：
        // fs.createReadStream(path)
        // .on('data', function(){})
        // .end('data', function(){})
        // }
    }
});

// 监听3000端口
server.listen(3000);

```


由于有的图片我放的不是jpg，代码会把不是jpg的图片给过滤掉。

用connect实现一个静态网页的显示
-------


