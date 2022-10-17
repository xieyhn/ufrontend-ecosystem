import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import type { Options as SassLoaderOptions } from 'sass-loader'

export interface ProjectConfig {
  publicPath?: string
  // configureWebpack
  configureWebpack?: WebpackConfiguration
  // webpackConfigTransform
  webpackConfigTransform?: (webpackConfig: WebpackConfiguration) => WebpackConfiguration | void
  // configureDevServerWebpack
  configureWebpackDevServer?: WebpackDevServerConfiguration
  // webpackDevServerConfigTransform
  webpackDevServerConfigTransform?: (webpackDevServerConfig: WebpackDevServerConfiguration) => WebpackDevServerConfiguration | void
  // css
  css?: {
    prodInjectMode?: 'style' | 'link'
    sassLoaderOptions?: SassLoaderOptions
  }
}

export function defineProjectConfig(config: ProjectConfig) {
  return config
}
