import path from 'path'
import fs from 'fs-extra'
import merge from 'webpack-merge'
import webpack, { Configuration } from 'webpack'
import WebpackDevServer, { Configuration as DevServerConfiguration } from 'webpack-dev-server'
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

function transformWebpackConfig(webpackConfig: Configuration, projectConfig: ProjectConfig) {
  let config = webpackConfig
  const { configureWebpack, webpackConfigTransform } = projectConfig

  if (configureWebpack) {
    config = merge(config, configureWebpack) as Configuration
  }

  if (webpackConfigTransform) {
    const result = webpackConfigTransform(config)
    if (result) config = result
  }

  return config
}

function transformWebpackDevServerConfig(devServerConfig: DevServerConfiguration, projectConfig: ProjectConfig) {
  let config = devServerConfig
  const { configureWebpackDevServer, webpackDevServerConfigTransform } = projectConfig

  if (configureWebpackDevServer) {
    config = merge(config, configureWebpackDevServer) as DevServerConfiguration
  }

  if (webpackDevServerConfigTransform) {
    const result = webpackDevServerConfigTransform(config)
    if (result) config = result
  }

  return config
}

class Compiler {
  public webpackConfig: Configuration

  public webpackDevServerConfig: DevServerConfiguration

  public options: Options

  constructor(options: CompilerOptions) {
    const projectConfig = loadUserProjectConfig()
    this.options = resolveOptions({
      command: options.command,
      debug: options.debug,
      projectConfig,
    })
    // 校验参数的合法性
    checkOptions(this.options)
    // webpackConfig
    this.webpackConfig = transformWebpackConfig(
      createWebpackConfig(this.options),
      projectConfig,
    )
    // webpackDevServerConfig
    this.webpackDevServerConfig = transformWebpackDevServerConfig(
      createDevServerConfig(this.options),
      projectConfig,
    )
  }

  run() {
    log('Debug:', this.options.debug)
    const compiler = webpack(this.webpackConfig)

    if (this.options.command === 'dev') {
      new WebpackDevServer(this.webpackDevServerConfig, compiler).start()
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
}

export default Compiler
