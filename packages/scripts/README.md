# @ufrontend/scripts

基于 webpack@5 搭建的适用于 vue@3 项目的脚手架工具。

## 安装

```shell
npm install @ufrontend/scripts -D
```

## 指令

```jsonc
{
  // 启动开发服务器
  "dev": "ufrontend-scripts dev",
  // 构建项目
  "release": "ufrontend-scripts release",
  // 自定义 mode 构建
  "staging": "ufrontend-scripts release --mode=staging"
}
```

## 选项

在项目根目录，创建 `project.config.js` 作为配置文件，文件导出一个配置对象

```js
module.exports = {
  // 选项
}
```

> 也可同时存在 `project.config.local.js` 文件，此文件优先级会高于 `project.config.js`，这样在本地调试时候很有用（不托管给 Git）。

### publicPath

+ Type：`string`
+ Default: `''`

部署应用包时的基本 URL，下面分别介绍为各种值的意义

+ `''`（常用、默认）

  相对路径，表示项目在部署后，需要在任意二级目录（如 `https://example.com/a/`）、多级目录下（如 `https://example.com/a/b/c`）都能访问，如项目中使用到了路由，一般需要与 Hash 模式的路由来搭配使用。

+ `/.?/`
  指定项目部署后的具体目录层级，如期望使用 `https://example.com` 来访问，则 `publicPath: '/'`；如期望使用 `https://example.com/a/b/` 来访问，则 `publicPath: '/a/b/'`，需要注意的是此选项的值必须以 `/` 结尾。

### configureWebpack

+ Type：`Object`

这个选项的值会通过 `webpack-marge` 合并进内置的 webpack 配置对象。

### webpackConfigTransform

+ Type `(config: WebpackConfig) => WebpackConfig`

这个选项是修改 webpack 的最后时机，可直接访问到最终的配置对象（包括 `configureWebpack` 选项提供的配置），这个方法返回一个修改后的 webpack 对象。

### configureWebpackDevServer

同 `configureWebpack` 用法，是用来修改 webpackDevServer 的配置。

### webpackDevServerConfigTransform

同 `webpackConfigTransform` 用法，是用来修改 webpackDevServer 的配置。

### css

这是一个和 CSS 相关的配置入口。

#### css.sassLoaderOptions

+ Type `(config: WebpackConfig) => WebpackConfig`

传递给 sass-loader 的选项。如可通过 sass-loader 提供的选项 `additionalData` 来配置给所有的 scss 文件的顶部增加一句代码来达到引入公共资源的目的：

```js
module.exports = {
   css: {
    sassLoaderOptions: {
      additionalData: `@import '@/styles/var.scss';`
    }
  }
}
```

#### css.inject

+ Type `'style' | 'link'`
+ Default `link`

指定 css 内容将注入到 HTML 文件的方式，style：通过 style 标签；link：通过 link 标签，引入外部资源文件。

>! 注意：此选项仅在 release 模式下生效，因为在 dev 模式下通过 style-loader 始终都是 style 标签插入的。


// TODO
