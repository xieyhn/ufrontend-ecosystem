import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import type { Options as SassLoaderOptions } from 'sass-loader'

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
  publicPath: string

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
    // 传递给 sass-loader 的选项
    sassLoaderOptions?: SassLoaderOptions
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

  if (publicPath !== '' && !publicPath.endsWith('/')) {
    throw new Error('[project.config]: publicPath 选项值应为 \'\' 或者以 \'/\' 结尾')
  }
}

export function compile(options: CompileOptions = {}) {
  const { command = 'dev', mode = 'development' } = options

  loadEnv(mode)

  const projectConfig = loadProjectConfig()
  checkProjectConfig(projectConfig)

  const compiler = webpack(createWebpackConfig(command, projectConfig))

  if (command === 'dev') {
    new WebpackDevServer(createWebpackDevServerConfig(projectConfig), compiler).start()
    return
  }

  compiler.run((err, stats) => {
    if (err) {
      // TODO
      // error(err)
      return
    }
    if (stats) {
      // TODO
      // log(stats.toString({ colors: true }))
    }
  })
}
