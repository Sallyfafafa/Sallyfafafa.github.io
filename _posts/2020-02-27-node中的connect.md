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

先用http实现一个静态网页的显示
=========
connect是一个基于http服务器的工具集，它提供了一种新的组织代码的方式来与请求，响应对象进行交互，这里称为中间件。

学习步骤：
先通过http做到一个简单网页图片的展示
然后进一步用connect做到相同的事情

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

文件目录：（各类型图片应有尽有）
![](https://cdn.weipaitang.com/static/2020022762b88c3d-623d-8c3d623d-485e-147c03c7cfc4-W460H398)
实现的网站样子：(略微简陋)
![](https://cdn.weipaitang.com/static/2020022735389fdb-763a-9fdb763a-ecaf-35ed393c99c6-W898H1288)

用connect实现一个静态网页的显示
======

任务：托管静态文件，处理错误以及损坏或者不存在的url，处理不同类型的请求。

connect提供了一些工具方法来让这些重复性的处理更加的便于实现。

通过use()方法添加static中间件。
```js
var connect = require('connect');
var server = connect.createServer();
server.use(connect.static(__dirname + '/website'));
server.listen(3000);
```
为了更好的理解中间件，看一段伪代码：

```js
if('GET' == req.method && '/images' == req.url.substr(0, 7)){
    托管静态文件
} else if ('GET' == req.method && '/' == req.url) {
    启动server
} else {
    404
}
```

而更加大型的应用，是能够根据请求的不同情况对任务进行处理：记录请求处理时间，托管静态文件，授权。

虽然这些任务是可以放在createServer里面的回调函数中的，但是这个会弄得函数十分复杂。

用中间件来解决这些复杂，除了req，res还有一个next（）

接下来就用connect写一个可重用的中间件
------
这个中间件要实现：当一个请求时间过长，那么中间件做出警告。

```js
sampale.js
const connect  = require("connect"), time = require('./request-time');
var server = connect.createServer();
server.use(connect.logger('dev'));
server.use(time({time: 500}));
server.use(function(req, res, next){
    if('/' == req.url) {
        res.writeHead(200);
        res.end('fast!');
    } else {
        next();
    }
})
server.use(function(req, res, next) {
    if('/a' == req.url) {
        setTimeout(()=>{
            res.writeHead(200);
            res.end('slow!');
        }, 1000);
    } else {
        next();
    }
})

server.listen(3000);
```

```js
request-time.js
time = function(opts) {
    var time = opts.time || 100; // 超时阈值

    return function(req, res, next) {
        var timer = setTimeout(function (){
            console.log('\033[90m%s %s\033[39m \033[91mis taking too long!\033[39m', req.method, req.url);
        }, time)
        res.on('data', function(chunk){})
        var end = res.end; // 保持对原函数的引用
        res.end = function(chunk, encoding) {
            res.end = end; // 恢复原始函数
            res.end(chunk, encoding); // 调用它
            clearTimeout(timer); // 最后清除定时器
        };
        next();
    }
}
module.exports = time;
```

static中间件
-----
connect是允许中间件挂载到url上。
static:是允许把任意一个url匹配到文件系统中的任意目录。

ps：把url为:`/my-images`与文件目录`/images`对应起来
```js
server.use('/my-images', connect.static('/images'));
```

macAge: 代表一个资源在客户端缓存的时间。
实用之处在于，对于不经常改动的资源，浏览器无需每次都去请求他。
ps:将客户端所有的js文件都合并到一个文件中，并在这个文件名中加上修订号，设置maxAge做到永远缓存
```js
server.use('/js', connect.static('/path/to/bundles',{maxAge: 1000000000000}) );
```
hidden: 也是static接收的参数。若为true，connect就会托管那些文件名以（.）开始的UNIX系统中被隐藏的文件。
```js
server.use(connect.static('/path/to/resources', {hidden: true}) );
```

query中间件
--------
数据作为url的一部分以查询字符串的形式发送给服务器。
url:'/index ? age = 18'
使用query中间件获取数据
```js
server.use(connect.query);
server.use(function(req, res) {
    req.query.age // 18
})
```
query中间件是在express中默认启用的。

logger中间件
-----
诊断工具。它将请求与响应信息打印到终端。
日志格式有：
default，
dev，
short，
tiny
常用dev。
初始化：`server.use(connect.logger('dev'))`
dev会将请求的方法，页面路径以及响应状态码，处理时间输出。
```js
var connect = require('connect');
connect.server( connect.logger , function(req, res){
    res.writeHead(200);
    res.end('Hello word');
}).listen(3000);
```
logger自定义输出格式
ps：若只记录请求方法和ip地址
`server.use(connect.logger(':method :remote-addr'))`
ps：通过动态的req和res记录头信息
`server.use(connect.logger('type is :res[content-type], length is :res[content-length] and it took :resposon-time ms'))`

cookieParser中间件
------
不用手动解析，不用正则表达式。
直接:`server.use(connect.cookieParser())`
```js
server.use(function(req, res, next){
    req.cookie.secret1; // 'value'
})
```

会话session
------
见`/connect-website/session`文件，实现用户的登录登出，在服务器未关闭状态下保存登录状态。但是重启后重新登录。
这里的数据，存储在了内存，进程退出，数据便丢失。

Redis session
-----
通过redis这个既小又快的数据库，可以持久化存储session数据。这个放到后边学。

