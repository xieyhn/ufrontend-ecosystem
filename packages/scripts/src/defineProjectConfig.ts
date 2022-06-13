import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

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
  // Enable stylelint
  enableStylelint?: boolean
  // Enable eslint
  enableESlint?: boolean
  transformAssetUrls?: {
    tags: Record<string, string[]>
  }
}

export function defineProjectConfig(config: ProjectConfig) {
  return config
}
