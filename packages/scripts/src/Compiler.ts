import path from 'path'
import fs from 'fs-extra'
import merge from 'webpack-merge'
import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { createWebpackConfig } from './webpack.config'
import { createDevServerConfig } from './webpack.devServer.config'
import { log, error } from './logger'
import { ProjectConfig } from './defineProjectConfig'
import { resolveOptions, Options, checkOptions } from './helper'

export type Command = 'dev' | 'release'

interface CompilerOptions {
  command?: Command,
  debug?: boolean
}

function loadUserProjectConfig(): ProjectConfig {
  const projectConfigPath = path.resolve(process.cwd(), 'project.config.js')
  if (!fs.existsSync(projectConfigPath)) return {}
  // eslint-disable-next-line
  return require(projectConfigPath)
}

class Compiler {
  public webpackConfig: Configuration

  public options: Options

  constructor(
    options: CompilerOptions,
  ) {
    const projectConfig = loadUserProjectConfig()
    this.options = resolveOptions({
      command: options.command,
      debug: options.debug,
      projectConfig,
    })
    // 校验参数的合法性
    checkOptions(this.options)
    // 生成内置 webpack 配置
    this.webpackConfig = createWebpackConfig(this.options)
    // 通过项目配置，修改 webpack 配置
    this.transformConfig(projectConfig)
  }

  run() {
    log('Debug:', this.options.debug)

    const compiler = webpack(this.webpackConfig)

    if (this.options.command === 'dev') {
      const server = new WebpackDevServer(
        createDevServerConfig(this.options),
        compiler,
      )
      server.start()
      return
    }

    compiler.run((err, stats) => {
      if (err) {
        error(err)
        return
      }
      if (stats) {
        log(stats.toString({ colors: true }))
      }
    })
  }

  /**
   * 根据项目配置，最后调整 webpack config
   */
  transformConfig(projectConfig: ProjectConfig) {
    const { configureWebpack, webpackConfigTransform } = projectConfig

    if (configureWebpack) {
      merge(this.webpackConfig, configureWebpack)
    }

    if (webpackConfigTransform) {
      const config = webpackConfigTransform(this.webpackConfig)
      if (config) this.webpackConfig = config
    }
  }
}

export default Compiler
