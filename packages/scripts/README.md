# @ufrontend/scripts

基于 webpack@5 搭建的适用于 vue@3 项目的脚手架工具。

## 安装

```shell
npm install @ufrontend/scripts -D
```

## 命令

```jsonc
{
  // 启动开发服务器
  "dev": "ufrontend-scripts dev",
  // 构建
  "release": "ufrontend-scripts release",
  // 自定义 mode 构建
  "staging": "ufrontend-scripts release --mode=staging"
}
```

## 选项

在项目根目录，创建 `project.config.js` 作为配置文件，文件导出一个配置对象：

```js
module.exports = {
  // 选项
}
```

> 也可同时存在 `project.config.local.js` 文件，此文件优先级会高于 `project.config.js`，这样在本地调试时候很有用（不托管给 Git）。
