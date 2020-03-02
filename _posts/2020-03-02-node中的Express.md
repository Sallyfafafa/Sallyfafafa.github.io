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


