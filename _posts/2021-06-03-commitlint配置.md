---
layout: post
#标题配置
title:  commitlint 配置
#时间配置
date:   2021-06-03 10:46:00 +0800
#大类配置
categories: 前端工程化
#小类配置
tag: 代码风格规范化
---

* content
{:toc}


# commitlint  无脑配置大法

## 配置 package.json

```json

{
  "lint-staged": {
    "*.{js,jsx,less,md,json}": [
      "prettier --write"
    ],
    "*.ts?(x)": [
      "prettier --parser=typescript --write"
    ]
  },
  "devDependencies": {
    "@commitlint/cli": "^12.1.4",
    "@commitlint/config-conventional": "^12.1.4",
    "husky": "^3.0.0",
    "lint-staged": "^10.0.7",
    "prettier": "^2.2.1",
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}


```


> ps：你可能会问，husky 为啥用 3.0.0，不都更新到 6.0.0 了吗？

解答： 考虑到，新版本需把 husky hooks 的内容放在 .husky.json 单独拷贝，不够无脑，所以采用 3.0.0 版本。


## 安装

```bash
## 下面两个有哪个，用哪个，跑一个
yarn install
npm install
```


## 提交限制配置

新建文件 commitlint.config.js， 与 package.json 同级

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 指 commit 的范围（哪些模块进行了修改）
    'scope-enum': [2, 'always', ['web', 'mini', 'ios', 'android', 'all']],
    // 指 commit 的简短描述
    'subject-case': [0],
    // 指当前 commit 类型，一般有下面几种可选类型：
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'deps',
      ],
    ],
  },
};
```

### type 含义解释

| 类型       | 描述                                                      |
|----------|---------------------------------------------------------|
| build    | 主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交           |
| ci       | 主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交 |
| docs     | 文档更新                                                    |
| feat     | 新增功能                                                    |
| merge    | 分支合并 Merge branch ? of ?                                |
| fix      | bug 修复                                                  |
| perf     | 性能, 体验优化                                                |
| refactor | 重构代码(既没有新增功能，也没有修复 bug)                                 |
| style    | 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)             |
| test     | 新增测试用例或是更新现有测试                                          |
| revert   | 回滚某个更早之前的提交                                             |
| chore    | 不属于以上类型的其他类型                                            |


## 参考资料：

rules 配置： https://commitlint.js.org/#/reference-rules
prompt 配置：https://commitlint.js.org/#/reference-prompt


