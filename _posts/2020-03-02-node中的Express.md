---
layout: post
#标题配置
title:  node中的Express
#时间配置
date:   2020-03-02 13:14:00 +0800
#大类配置
categories: Node
#小类配置
tag: Node中Express
---

express是基于connect为构建整个网站和应用提供了更方便的API。保持了重用中间件来完成基础任务的想法。

目的
------

本章学习目的是通过创建一个express小应用，能够实现在用户通过查询关键词查找推文时，需要返回包含查询结果的页面。

创建模块
======
增加两个依赖，一个是ejs，模板依赖，一个是superagent简化Twitter发送推文的请求实现。

ejs：“可嵌入（Embedded）”。EJS 是一套简单的模板语言，帮你利用普通的 JavaScript 代码生成 HTML 页面。EJS 没有如何组织内容的教条。

```js
package.json
{
    "name": "express-tweet",
    "version": "0.0.1",
    "dependencies": {
        "express": "4.17.1",
        "ejs": "0.4.2",
        "superagent": "0.3.0"
    }
}
```

ejs里面<% ··· %>里面写着js逻辑。<%=··· %>打印变量值。

如下，搜索结果页：
```js

<h1>Tweet results for <%= search %></h1>

<% if (results.length) { %>
  <ul>
    <% for (var i = 0; i < results.length; i++) { %>
    <li><a href="<%= results[i].url %>"><%= results[i].text %></a> - <em><%= results[i].from_user %></li>
    <% } %>
  </ul>
<% } else { %>
  <p>No results</p>
<% } %>

```

setUp
======
express不需要任何必要的设置，也不对文件结构有必要的要求。它足够灵活，允许你对每一个单独的功能点进行定义。
（本例子中指定需要的引擎以及视图模板所在的目录）

通过set方法更改默认项
```js
var express = require('express'), server = require('./search');
var app = express(); //现在的express直接用不用像2版本的时候通过express.createServer()的方式去构建函数了。
console.log(app.set('views'));
app.set('view engine', 'ejs'); //将ejs文件设为视图引擎
app.set('views', __dirname + '/views');
app.set('view options', { layout: false }); // NOTE: express3 remove

```

定义路由
=====
通过`app.get(路径，回调)`的方式使用指定的回调函数将http的Get请求路由到指定的路径。

使用render方法，初始化模板引擎，读取视图文件并传递给模板引擎，获取到HTML响应并传递给客户端。

```js
server.js
var express = require('express')
  , search = require('./search')

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/search', function (req, res, next) {
  search(req.query.q, function (err, tweets) {
    if (err) return next(err); // 如果search方法捕捉到错误，直接传递给next
    res.render('search', { results: tweets, search: req.query.q }); // 这里第二个对象里的数据作为参数通过render传递过去，这两个变量可以直接在search.ejs视图中进行使用
  });
});

/**
 * Listen
 */

app.listen(3000);

```
查询
=====
这边暴露出去的方法是为了对推文进行查询，内部调用了Twitter的查询api。
获取到的数据会在search.ejs模板中生成。
```js
var qs = require('querystring')
  , http = require('http')

module.exports = function search (query, fn) {
  http.request({
      host: 'www.sogou.com'
    , path: '/web?' + qs.stringify({ query })
  }, function (res) {
    res.setEncoding('utf8');

    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      try {
        var obj = JSON.parse(body);
      } catch (e) {
        return fn(new Error('Bad twitter response'));
      }

      fn(null, obj.results);
    });
  }).end()
};
```


环境设置
-----
对模板进行缓存
```js
app.configure('production', function(){
    app.enable('view cache'); 
    //相当于 app.set('view cache', true);
})
```
使用`app.enabled`查看标志是否启用。
对应的方法还有：`app.disable`,`app.disabled`

环境变量NODE_ENV设为production时，上边我们设置的回调函数就会执行，否则，默认执行：
```js
app.configure('development', function(){
    ·····
})
```
执行production环境，终端输入`NODE_ENV=production node server`

模板引擎
------
使用步骤，就如上边的一个完整代码里面的：
1、 先安装ejs`npm install ejs`
2、 声明`app.engine('html', require('ejs').renderFile)` 要将EJS模板引擎映射到“ .html”文件

错误处理
-----
```js
app.error(function(err, req, res, next){
    if('bad response' == err.message) {
        res.render('pageerr');
    } else {
        next(); //检测结果不匹配，直接调用next
    }
})
```
最后一个next可以展示一个通用的错误页面:
```js
app.err(function(err, req, res){
    res.render('error', {status: 500})
})

```

快捷方法
=========

express.bodyParser()
------
body-parser实现的要点如下：

处理不同类型的请求体：比如text、json、urlencoded等，对应的报文主体的格式不同。
处理不同的编码：比如utf8、gbk等。
处理不同的压缩类型：比如gzip、deflare等。
其他边界、异常的处理。

request对象的扩展
-----

`req.get('http请求标头字段')`
以函数的方式获取头部信息，不区分大小写。别名`req.header('')`
ps： 
```js
req.get('Content-Type')
// => "text/plain"

req.get('content-type')
// => "text/plain"

req.get('Something')
// => undefined
```

`req.accepts('html')`
分析请求中的accepts头信息，返回是Boolean类型。

`req.is('text/html')`
检查Content-text头信息。匹配的话就返回匹配的内容，匹配不到就返回false


response对象的扩展
----
`res.header('content-type')`
检查对应参数来判断头信息是否已经在response上设置了
可以接收多个参数。

`res.render(view [，locals] [，callback])` 

[]内是可选的。
view，是一个字符串，它是视图文件来渲染的文件路径。
locals，其属性定义视图的局部变量的对象。
callback，一个回调函数。如果提供了该方法，则该方法将同时返回可能的错误和呈现的字符串，但不会执行自动响应。发生错误时，该方法在next(err)内部调用。

ps：
```js
// pass a local variable to the view
res.render('user', { name: 'Tobi' }, function (err, html) {
  // ...
    res.send(html)
})
```

`res.send([body])`

发送http响应
```js
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>some html</p>')
```
`res.sendFile（路径[，选项] [，fn]）`
在给定的位置传输文件path。
其余详细内容见：http://expressjs.com/en/4x/api.html#req

路由
======
相关内容使用见：http://expressjs.com/en/4x/api.html#router

```js
app.get('/user', (req, res, next)=>{ res.send('user用户'); next()});
app.get('/user/:id', (req, res) =>{ res.send(res.params)}); // 动态路由
```

新建一个express APP
----
在express官网的入门教程，跟着就可以一步步的建立一个小型app。