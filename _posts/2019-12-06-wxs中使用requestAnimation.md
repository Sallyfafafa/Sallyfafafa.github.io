---
layout: post
#标题配置
title:  wxs中使用requestAnimation
#时间配置
date:   2020-11-05 10:33:00 +0800
#大类配置
categories: 微信小程序
#小类配置
tag: wxs的requestAnimation
---

* content
{:toc}

起因
-----
想用wxs中的requestAnimation实现一个点击按钮，小球平滑移动的案例。

因为在h5那边这个requestAnimation是可以直接通过window.requestAnimation进行使用，并且微信开放文档中也没有什么资料可以参考，遇到了很多坑之后，终于向社区进行提问，还好有大佬愿意分享帮忙~实在是感动。

错误方式
-----
小程序代码片段：'https://developers.weixin.qq.com/s/K9AWDpmR7CdK'

```js
wxs
<wxs module="wxsFun">
    var progress = 0;
    var e;
    function render() {
        if (progress < 500) {
            e.selectComponent('.ball').setStyle({
                left: progress + 'rpx'
            });
            progress += 1;
            e.requestAnimationFrame(render);
        }
    }
    module.exports = {
        moveBall: function (event ,ins) {
            console.log(JSON.stringify(ins));
            e = ins
            ins.requestAnimationFrame(render);
        }
    }
</wxs>
```

这里我没有考虑到 全局性， requestAnimationFrame在h5里面是window下使用的。
但是具体说不来为什么我的小球直接走到了结果，而没有看到过程。

正确方式：
------
大神写的代码片段：
方案1：https://developers.weixin.qq.com/s/2QBJXpmD7zd8
方案2：https://developers.weixin.qq.com/s/O8BnApmV7Hdf
```js
wxs
<wxs module="wxsFun">
    var progress = 0;
    function render(e) {
        if (progress < 500) {
            e.selectComponent('.ball').setStyle({
                left: progress + 'rpx'
            });
            progress += 1;
            e.requestAnimationFrame(function(){render(e)});
        }
    }
    module.exports = {
        moveBall: function (event ,ins) {
            console.log(JSON.stringify(ins));
            ins.requestAnimationFrame(function(){render(ins)});
        }
    }
</wxs>
```
```js
wxs
<wxs module="wxsFun">
    var progress = 0;
    var e;
    function render() {
        if (progress < 500) {
            e.selectComponent('.ball').setStyle({
                left: progress + 'rpx'
            });
            progress += 1;
            e.requestAnimationFrame(render);
        }
    }
    module.exports = {
        moveBall: function (event ,ins) {
            console.log(JSON.stringify(ins));
            e = ins
            ins.requestAnimationFrame(render);
        }
    }
</wxs>

```
一个是在requestAnimationFrame中增加function在function内部调用其他函数
另一个是在全局定义的一个保存处理方法的一个变量。




