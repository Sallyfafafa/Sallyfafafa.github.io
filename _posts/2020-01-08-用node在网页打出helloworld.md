---
layout: post
#标题配置
title:  用node在网页打出HelloWorld
#时间配置
date:   2020-01-06 14:33:00 +0800
#大类配置
categories: Node介绍与Node模块
#小类配置
tag: node.js
---

* content
{:toc}

包管理器-npm
=====

常见的使用场景：

1、下载第三方写好的三方包

2、可以从npm安装使用别人写好的命令行工具

3、可以上传自己写的包和命令行工具给别人使用

下载三方包
------
很熟悉的npm install的作用，就是下载三方包。一个包一个包下载就是：
```js
npm install argv //包的名称
npm install argv@0.0.1 //指定包版本的包
```
由于一个一个的包下载工作比较烦续，npm提供了package的配置：
```js
{
    "name": "node-echo",
    "main": "./lib/echo.js",
    "dependencies": {
        "argv": "0.0.2"
    }
}
//对应的目录
- project/
    - node_modules/
        - node-echo/
            - node_modules/
                + argv/
            ...
    ...
```
在dependencies里面已经提供好了，名字对应版本号。

这样npm做到了，用户只需要关心自己直接使用的包，不需要自己去解决包与包之间的依赖问题。

安装命令行程序
--------
从npm安装命令行工具也十分的简单，只要node-echo在package.json已经配置好
```js
npm install node-echo -g

//文件目录
- /usr/local/               # Linux系统下
    - lib/node_modules/
        + node-echo/
        ...
    - bin/
        node-echo
        ...
    ...
```

发布代码
-----

第一次使用NPM发布代码前需要注册一个账号。终端下运行
```js
npm adduser
```
之后按照提示做即可。

账号搞定后，接着我们需要编辑package.json文件，加入NPM必需的字段。接着上边node-echo的例子，package.json里必要的字段如下。
```js
{
    "name": "node-echo",           # 包名，在NPM服务器上须要保持唯一
    "version": "1.0.0",            # 当前版本号
    "dependencies": {              # 三方包依赖，需要指定包名和版本号
        "argv": "0.0.2"
      },
    "main": "./lib/echo.js",       # 入口模块位置
    "bin" : {
        "node-echo": "./bin/node-echo"      # 命令行程序名和主模块位置
    }
}
```
之后，我们就可以在package.json所在目录下运行npm publish发布代码了。

版本号
----
x/y/z 主版本号、次版本号和补丁版本号。

npm常用命令
-----
NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。

使用npm help <command>可查看某条命令的详细帮助，例如npm help install。

在package.json所在目录下使用npm install . -g可先在本地安装当前命令行程序，可用于发布前的本地测试。

使用npm update <package>可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。

使用npm update <package> -g可以把全局安装的对应命令行程序更新至最新版。

使用npm cache clear可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。

使用npm unpublish <package>@<version>可以撤销发布自己发布过的某个版本代码。
