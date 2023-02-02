import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import type { Options as SassLoaderOptions } from 'sass-loader'
import type { ProcessOptions as PostcssProcessOptions, Plugin as PostcssPlugin } from 'postcss'

import path from 'node:path'
import fs from 'fs-extra'
import dotenv from 'dotenv'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { createWebpackConfig, createWebpackDevServerConfig } from './webpack'

export type Command = 'dev' | 'release'
export type Mode = 'development' | 'production' | (string & {})

export interface CompileOptions {
  command?: Command
  mode?: Mode
}

export interface ProjectConfig {
  publicPath?: string

  // webpack 的额外的配置对象
  configureWebpack?: WebpackConfiguration
  // webpack 最终的配置对象转换方法
  webpackConfigTransform?: (webpackConfig: WebpackConfiguration) => WebpackConfiguration | void

  // webpack-dev-server 的额外的配置对象
  configureWebpackDevServer?: WebpackDevServerConfiguration
  // webpackDevServer 最终的配置对象转换方法
  webpackDevServerConfigTransform?: (webpackDevServerConfig: WebpackDevServerConfiguration) => WebpackDevServerConfiguration | void

  // css 相关的配置方法
  css?: {
    /**
     * 传递给 sass-loader 的选项
     */
    sassLoaderOptions?: SassLoaderOptions,
    /**
     * 传递给 postcss-loader 的 postcssOptions 配置，会与内置的配置合并
     */
    postcssOptions?: PostcssProcessOptions & { plugins?: PostcssPlugin[] }
    /**
     * 选择 css 如何插入文档中
     * style：通过 style 标签
     * link：通过 link 标签，引入外部资源文件
     *
     * 注意：此选项仅在 release 模式下生效，因为在 dev 模式下通过 style-loader 始终都是 style 标签插入的
     */
    inject?: 'style' | 'link'
  }
}

/**
 * 加载环境变量，指定 mode 后缀的文件具有高的优先级
 */
function loadEnv(mode?: string) {
  const files = ['.env.local', '.env']
  if (mode) files.unshift(`.env.${mode}.local`, `.env.${mode}`)

  files.forEach((i) => {
    dotenv.config({
      path: path.resolve(process.cwd(), i),
    })
  })
}

/**
 * 加载用户配置文件
 */
function loadProjectConfig(): ProjectConfig {
  const files = ['project.config.local.js', 'project.config.js'].map((i) => path.resolve(process.cwd(), i))

  for (let i = 0; i < files.length; i++) {
    if (fs.existsSync(files[i])) {
      // eslint-disable-next-line
      return require(files[i]) as ProjectConfig
    }
  }

  // 默认会应用的配置文件
  const defaultProjectConfig: ProjectConfig = {
    publicPath: '',
  }

  return defaultProjectConfig
}

/**
 * 校验配置文件的合法性
 */
function checkProjectConfig(projectConfig: ProjectConfig) {
  const { publicPath } = projectConfig

  if (publicPath !== '' && (!publicPath!.startsWith('/') || !publicPath!.endsWith('/'))) {
    throw new Error('[project.config]: publicPath 选项值支持 \'\' 和 \'/xx/\'')
  }
}

export function compile(options: CompileOptions = {}) {
  const { command = 'dev', mode = command === 'dev' ? 'development' : 'production' } = options

  loadEnv(mode)

  // set NODE_ENV
  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = command === 'dev' ? 'development' : 'production'
  }

  const projectConfig = loadProjectConfig()
  checkProjectConfig(projectConfig)

  const compiler = webpack(createWebpackConfig(command, projectConfig))

  if (command === 'dev') {
    new WebpackDevServer(createWebpackDevServerConfig(projectConfig), compiler).start()
    return
  }

  compiler.run((err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      process.exit(1)
    }
    if (stats) {
      // eslint-disable-next-line no-console
      console.log(stats.toString({ colors: true }))
    }
  })
}
