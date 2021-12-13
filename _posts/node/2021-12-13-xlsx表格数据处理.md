---
layout: post
#标题配置
title: node 对 xlsx表格来回转换
#时间配置
date: 2021-12-13 09:52:00 +0800
#大类配置
categories: Node
#小类配置
tag: 处理 xlsx
---

* content
{:toc}


在此之前，需要安装三个npm 包：`"json2xls","node-xlsx","lodash"`

XLSX 转 JSON
------

```js
"use strict";
let _ = require("lodash");
let xlsxrd = require("node-xlsx");
const fs = require("fs");
const json2xls = require("json2xls");
// 这个是放置的待处理的 xlsx
let excelFilePath = "./template.xlsx";
// 读取excel中所有工作表的数据
let list = xlsxrd.parse(excelFilePath);
// 获取excel中第一个工作表的数据
let data = list[0].data;
let result = {};
// excel 数据格式转换
_.forEach(data.slice(1), (d) => {
    // 按列打印
    console.log(d)
});

```


JSON 转 XLSX
------
```js
"use strict";
const fs = require("fs");
const json2xls = require("json2xls");
const xlsxArray = [{
    name: 'xiaoming',
    age: 18
},{
    name: 'xiaohong',
    age: 19
}];

let xls = json2xls(xlsxArray);

fs.writeFileSync("新埋点对应id.xlsx", xls, "binary");

```